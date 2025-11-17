
---
title: Memory Debugger in Practice
description: Knowledge behind building own Memory Debugger
date: "2025-11-17"
tldr: Building a memory debugger involves substituting memory functions such as malloc or free with our solution, which keeps track of allocated and freed memory while still calling the original function. This is achieved by changing the pointers to the functions in the Import Address Table to point to the substitutes. These notes summarize the complex structure of the Portable Executable (PE) file format, its headers, and the mechanisms used for dependency resolution and runtime manipulation (hooking).
draft: false
tags: [c,win,memory,executable,reverse-engineering] 
toc: false
---

# How Can It Be Helpful

Sometimes, a reverse engineer or developer needs to understand how a program works with its memory. For a reverse engineer, this is to better understand the logic of the analysed program (an example of that case will be shown in a future post). For a developer, it is to check that the program is working correctly with its memory and is not causing any memory leaks.

Such tooling should be able to detect every instance of memory function usage, such as malloc, free, calloc, and realloc, and save information about the memory's state without altering the behaviour of these functions. Therefore, this tool must be positioned somewhere between the program's actual function call and its implementation. The program's Import Address Table can be used for this purpose perfectly.

But what is the Import Address Table, and how can it be altered? This post will answer exactly that question and maybe more. It will get a little technical, so don't be afraid to read it a couple of times to let it sink in. 

# Understanding the Program Headers

Every Windows portable executable (PE) starts with headers holding several important pieces of information about the binary like its structure, dependencies, or architecture that it is built for. These headers are read first by the PE loader so it can understand the binary that is being loaded.

The specification is derived from the Unix COFF (Common Object File Format). "Portable" means the file format is universal across Windows platforms (recognized by every Windows PE loader) and is used for Windows executables, DLLs, kernel mode drivers, object files, and libraries.

## DOS Header

All PE files must start with a simple DOS **MZ** header. Its first two bytes contain a signature `MZ` and it is there because of historical purposes - the reason is that Windows keeps its backward compatibility and this header allows the DOS system to recognize it and run a so-called **DOS Stub** which is a small program just telling the user for example that the system that it is being run on is not compatible. Nowadays, the only important field of the DOS header is the `e_lfanew` holding the relative virtual address (**RVA**), which tells the loader where the start of the **PE header** is.

> **Relative Virtual Address (RVA)** is an offset calculated relative to the Base Address (start address) of the program in memory. A pointer, on the other hand, is relative to the entire computer's memory. A conversion can be done by the following rule: $pointer = rva + program\_base\_address$

## PE Header

The structure referred to as the **PE header** or **NT header** is formally `IMAGE_NT_HEADERS` and it immediately follows the DOS header. It consists of the following subheaders.

### PE Header -> Signature

- A 32-bit signature, `0x00004550` (ASCII `PE00`).
- Used by Windows to confirm it is a modern Windows executable, distinguishing it from old DOS executables.

### PE Header -> File Header (`IMAGE_FILE_HEADER`)

Contains several fields like:
- **Machine Field:** Specifies the **target architecture** (e.g., Intel 80386 or 64-bit). OS uses this to select the correct execution mode.
- **NumberOfSections:** Total count of sections following the headers.

### PE Header -> Optional Header (`IMAGE_OPTIONAL_HEADER`)

This header is very misleadingly named, as it must be always present in the COFF, which is every PE file. It contains information necessary for loading (stack size, image base, etc.) and is for us the most interesting. These are some of its fields:
- **Address Of Entry Point:** A crucial RVA that specifies where program execution starts.
- **Image Base:** The preferred linear load address for the entire binary.
- **Dll Characteristics:** Flags that can be used to disable features like ASLR (Address Space Layout Randomization) for analysis.
- **Data Directory:** A trailing array of 16 `IMAGE_DATA_DIRECTORY` structures.
    - Each member gives the RVA and size (`isize`) of a logical component (e.g., Import Table, Export Table).
    - Index 0 refers to **Export Directory**, index 1 refers to the **Import Directory** (`IMAGE_DIRECTORY_ENTRY_IMPORT`) and so on.

Only the structure of the **Import Directory** is relevant to us in this case.

#### Import Directory 

The **Import Directory** points to an array of structs `IMAGE_IMPORT_DESCRIPTOR`, where the struct is defined:

```c
typedef struct _IMAGE_IMPORT_DESCRIPTOR {
  union {
    DWORD Characteristics;            // 0 for terminating null import descriptor
    DWORD OriginalFirstThunk;         // RVA to original unbound IAT (PIMAGE_THUNK_DATA)
  } DUMMYUNIONNAME;
  DWORD TimeDateStamp;                // 0 if not bound,
                                      // -1 if bound, and real date/time stamp
                                      // in IMAGE_DIRECTORY_ENTRY_BOUND_IMPORT (new BIND)
                                      // O.W. date/time stamp of DLL bound to (Old BIND)
  DWORD ForwarderChain;               // -1 if no forwarders
  DWORD Name;
  DWORD FirstThunk;                   // RVA to IAT (if bound this IAT has actual addresses)
} IMAGE_IMPORT_DESCRIPTOR;
```

Relevant variables are:
- `OriginalFirstThunk`: RVA pointing to the unbound `_IMAGE_THUNK_DATA` array described later
- `FirstThunk`: RVA points to the Import Address Table. If bound, it contains the actual symbol addresses. 
- `Name`: RVA pointing to `char *` with the DLL name, from which this descriptor imports symbols.

The number of `_IMAGE_IMPORT_DESCRIPTOR` structures in memory is equal to the number of DLLs linked by this PE file. The final `_IMAGE_IMPORT_DESCRIPTOR` ends with all `NULL` variables.

Initially, the IAT pointed to by the `FirstThunk` is unbounded and contains no real addresses. The loader's job is to go through the following structure, find the actual symbol addresses, and fill the IAT. `OriginalFirstThunk` points to an array of structures `_IMAGE_THUNK_DATA`. This array ends with an empty `_IMAGE_THUNK_DATA` structure.

##### \_IMAGE_THUNK_DATA

The `_IMAGE_THUNK_DATA` has two different variations based on the type of PE file (32-bit vs. 64-bit):

```c
typedef struct _IMAGE_THUNK_DATA64 {
  union {
    ULONGLONG ForwarderString;  // PBYTE
    ULONGLONG Function;         // PDWORD
    ULONGLONG Ordinal;
    ULONGLONG AddressOfData;    // PIMAGE_IMPORT_BY_NAME
  } u1;
} IMAGE_THUNK_DATA64;
typedef IMAGE_THUNK_DATA64 * PIMAGE_THUNK_DATA64;

#include "poppack.h"                        // Back to 4 byte packing

typedef struct _IMAGE_THUNK_DATA32 {
  union {
    DWORD ForwarderString;      // PBYTE
    DWORD Function;             // PDWORD
    DWORD Ordinal;
    DWORD AddressOfData;        // PIMAGE_IMPORT_BY_NAME
  } u1;
} IMAGE_THUNK_DATA32;
typedef IMAGE_THUNK_DATA32 * PIMAGE_THUNK_DATA32;
```

The `AddressOfData` is mostly an RVA pointing to the structure `_IMAGE_IMPORT_BY_NAME` defined like this:

> Mostly because imported symbols can also be referenced by their sequence number. In this case, `AddressOfData` is of type `IMAGE_THUNK_DATA`, with the highest bit of the entry set to 1 (this is how this case is recognized) and the remaining bits determining the sequence of the symbol in the library.

```c
typedef struct _IMAGE_IMPORT_BY_NAME {
  WORD    Hint;
  CHAR   Name[1];
} IMAGE_IMPORT_BY_NAME, *PIMAGE_IMPORT_BY_NAME;
```

The `Hint` provides the loader with information about the index of the import in the DLL export table. If the `Hint` does not provide the correct information, the import is found by `Name`. This is a `char *` containing the name of the imported symbol.

Visually we can depict this using the following figure:

![](./pic/iat.jpg)

Now we have a good understanding of the structures that the loader is working with. It does the following steps to fill the IAT with actual addresses of symbols:

1. For each required DLL specified by the descriptor, the loader consults the `OriginalFirstThunk` array, which contains RVAs to the `_IMAGE_IMPORT_BY_NAME` structures or ordinals, providing the names of the functions needed. This array remains unchanged.
2. The loader loads the external DLL into memory. It then uses the function names/ordinals to search the DLL's Export Table to find the function's actual memory address.
3. The loader overwrites the RVAs stored in the `FirstThunk` array (the IAT) with the real, linear memory addresses of the imported functions. Once this is complete, the program can execute and call external functions directly via the IAT.

## In Summary 

The PE file structure acts as a layered graph. The **DOS header** points to the **PE header** using the `e_lfanew`. The **PE header** validates the file and later directs the loader to the **Data Directory**. The **Data Directory** points (out of many things) to the **Import Directory**, where the loader resolves external DLL function names and patches the Import Table field `FirstThunk` with the live memory addresses. Hooking exploits this final step, intercepting the address replacement to route calls through custom code for analysis or modification.

## Back to Debugger

In order to build a memory debugger, we need to read the 'Import Directory' of a running program, which already contains the actual addresses in its IAT. We will search for symbols such as 'malloc' and 'calloc' and replace their addresses with our own, which point to our functions. 

It is important to keep track of the original addresses of these functions, as our functions will take notes on memory usage. Ultimately, however, the original function will be called so as not to change the behavior of the original program. It is important to note that the debugger's purpose is not to prevent memory leaks, but merely to log them and warn the developer about them.

# Implementation Details

To work with all of the previously described structures, the `windows.h` header can be used. This makes it quite simple to read the IAT and overwrite its addresses.

It is important to realize that we mostly need to work with the RVA pointers. For that, the start of the program address needs to be found. For that purpose, there is a little trick in the book:

```cpp
HMODULE hPEFile = GetModuleHandle(NULL); // NULL means current process
PIMAGE_DOS_HEADER pDosHeader = (PIMAGE_DOS_HEADER) hPEFile;
```

Then it is possible to get to the **PE header**:

```cpp
PIMAGE_NT_HEADERS pNTHeaders = (PIMAGE_NT_HEADERS)( ((BYTE*)pDosHeader) + pDosHeader->e_lfanew );
```

And we can locate the **Import Table** and **IAT**:
```cpp
pNTHeaders->OptionalHeader.DataDirectory[IMAGE_DIRECTORY_ENTRY_IMPORT]
pNTHeaders->OptionalHeader.DataDirectory[IMAGE_DIRECTORY_ENTRY_IAT]
```

The IAT is usually secured, so nobody can alter its values unless the VirtualProtect function is called to unlock this memory segment for writing.

```cpp
BOOL WINAPI VirtualProtect (
  (LPVOID) lpAddress,   // block address which privileges we want to change
  (size_t) dwSize,      // size of the block
  PAGE_READWRITE,       // read or write?
  (PDWORD)&dwOldProtect // the old PAGE_READWRITE
);
	```

Pointers to the first and last descriptor can be retrieved:
```c
PIMAGE_IMPORT_DESCRIPTOR pImportDescriptor = (PIMAGE_IMPORT_DESCRIPTOR)(((BYTE*)pDosHeader) + pNTHeaders->OptionalHeader.DataDirectory[IMAGE_DIRECTORY_ENTRY_IMPORT].VirtualAddress);

PIMAGE_IMPORT_DESCRIPTOR pImportDescriptorEnd = (PIMAGE_IMPORT_DESCRIPTOR)(((BYTE*)pImportDescriptor) + pNTHeaders->OptionalHeader.DataDirectory[IMAGE_DIRECTORY_ENTRY_IMPORT].Size);
```

The end of the descriptor array can be identified by checking that all variables of the last descriptor are `NULL` (based on [17], and by checking the upper bound of the array using the previously defined `pImportDescriptorEnd` variable:

```cpp
int IsNullImportDescriptor(const PIMAGE_IMPORT_DESCRIPTOR pDesc) {
	return 
			pDesc->Characteristics == 0 &&
			pDesc->TimeDateStamp == 0 &&
			pDesc->ForwarderChain == 0 &&
			pDesc->Name == 0 &&
			pDesc->FirstThunk == 0;
}

// iterate through import descriptors and hook our functions
// termination:
// check all fields are 0 for terminating descriptor
// check bounds to avoid reading beyond valid memory
while ((BYTE*)pImportDescriptor < (BYTE*)pImportDescriptorEnd &&
!IsNullImportDescriptor(pImportDescriptor)) {

	if (pImportDescriptor->Name != 0) {
		// work with the valid DLL
	}
	pImportDescriptor++;
}
```

Then it is important to validate the DLL further, as functions like `free()` could be defined in other irrelevant DLLs, where their purpose could be different. So look for DLLs that usually contain the memory functions.

It is usual that Windows does not use external runtime DLL and it puts all the code from the needed libraries to the binary itself. We can forbid it by compiling the code with `/MD`. That will tell the compiler to use external libraries.

The debugger should be aware of all the possible ways of how the memory functions can be called. Namely:
- `malloc`
	- Input size can be `0` or `NULL`. Even in that case `malloc` returns a valid pointer that needs to be tracked.
- `calloc`
	- Input size can be `0` or `NULL`. Even in that case `malloc` returns a valid pointer that needs to be tracked.
- `realloc`
	- Input pointer can be invalid, in that case, the debugger should warn that it is using an unknown pointer in realloc.
	- `realloc(NULL, size)` behaves like malloc(size) - can return a valid pointer that must be tracked
	- `realloc(ptr, 0)` behaves like free(ptr) and returns NULL, debugger should delete the internal record
	- normal realloc - resizing existing block, debugger needs to change its internal record
	- if realloc failed (`newPtr == NULL`), original block unchanged, debugger should keep the internal record
- `free`
	- `free(NULL)` is valid and does nothing, debugger idles
	- normal `free` - debugger should delete the internal record

As mentioned in the theoretical section, the symbols can be imported by ordinals and not by names. That is not the case for us, because the memory functions are always imported by name.

The implementation should handle unknown pointers/RVAs wisely and check them before working with them.

# Resources

1. PE Format documentation: https://msdn.microsoft.com/en-us/library/windows/desktop/ms680313(v=vs.85).aspx
2. PE Format - Win32 apps | Microsoft Learn: https://learn.microsoft.com/en-us/windows/win32/debug/pe-format
3. Iczelion's PE Tutorial 1: Overview of PE File Format: https://web.archive.org/web/20190517161709/http://win32assembly.programminghorizon.com/pe-tut1.html
4. Iczelion's PE Tutorial 6: Import Table: https://web.archive.org/web/20190517161709/http://win32assembly.programminghorizon.com/pe-tut6.html
5. Bernd Luevelsmeyer's PE Format Details: http://www.pelib.com/resources/luevel.txt
6. FlushInstructionCache function | Microsoft Learn: https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-flushinstructioncache
7. realloc | Microsoft Learn: https://learn.microsoft.com/en-us/cpp/c-runtime-library/reference/realloc?view=msvc-170
8. malloc | Microsoft Learn: https://learn.microsoft.com/en-us/cpp/c-runtime-library/reference/malloc?view=msvc-170
9. calloc | Microsoft Learn: https://learn.microsoft.com/en-us/cpp/c-runtime-library/reference/calloc?view=msvc-170
10. free | Microsoft Learn: https://learn.microsoft.com/en-us/cpp/c-runtime-library/reference/free?view=msvc-170
11. Upgrade your code to the Universal CRT | Microsoft Learn: https://learn.microsoft.com/en-us/cpp/porting/upgrade-your-code-to-the-universal-crt?view=msvc-170
12. 64-Bit PE File without Import Lookup Table | Stack Overflow: https://stackoverflow.com/questions/56132931/64-bit-pe-file-without-import-lookup-table
13. Win32 API hooking/Import address table | Stack Overflow: https://stackoverflow.com/questions/77427677/win32-api-hooking-import-address-table
14. Using Run-Time Dynamic Linking | Microsoft Learn: https://learn.microsoft.com/en-us/windows/win32/dlls/using-run-time-dynamic-linking
15. The case of the missing ordinal 380 | The Old New Thing: https://devblogs.microsoft.com/oldnewthing/20240816-00/?p=110136
16. The Import Address Table is now write-protected | The Old New Thing: https://devblogs.microsoft.com/oldnewthing/20221006-07/?p=107257
17. PE Format In-Depth Part 2 | ReadTheDocs: https://coffi.readthedocs.io/en/latest/pe_format_in_depth_look_part2.pdf