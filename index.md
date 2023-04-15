# Přetečení bufferu

Místo ollydb používám [EDB](https://github.com/eteran/edb-debugger) na linux.

Skvělý i když né úplně podrobný a vysvětlující návod [ZDE](https://medium.com/@sigkilla9/linux-buffer-overflows-46833345382b)

Skvělý odborný článek [ZDE](https://surface.syr.edu/cgi/viewcontent.cgi?article=1095&context=eecs)

## Úkol

Úkol jsem si rozdělil do 3 částí, a to:

> 1. Analýza binárky, zásobníku, vymyšlení strategie
>
> 2. Spuštění tajné funkce ```secret_function()```
>
> 3. Provedení syscall a spuštění jiného programu, např. shellu

### Napadaný program
```
#include <stdio.h>
#include <string.h>

void secret() {
	printf("Vkrocil jsem do tajne funkce!\n");
}

int main(int argc, char * argv[]) {
	char buffer[24];
	strcpy(buffer, argv[1]);
	printf("Ahoj, %s\n", buffer);
	return 0;
}
```

## Důležité před začátkem

### Kompilace

Na linuxu je potřeba komplivat následovně

```
gcc -O0 -g -fno-stack-protector -z execstack main.c
```

> **-fno-stack-protector**
>
> - Vypne Stack Canaries
>
>  - Co to jsou **Stack Canaries**?
>
>  		- tak říkajíc kanárci
>
>  		- Security cookies přidané do binárky chránící kritické zásobníkové hodnoty jako return pointer
>
> 		- V případě nesprávného kanárku se program automaticky ukončí 

> **-z execstack**
>
> - Udělá stack i heap executable


### Vypnutí ASLR

>  **Warning**
>
>  Nebezpečné

#### ASLR — Address Space Layout Randomization

Vypnutí následujícím přepsáním hodnoty:

```
echo 0 | sudo tee /proc/sys/kernel/randomize_va_space
```

- Původně hodnota ```2```

- Po restartu PC se hodnota obnoví


### Užitečné informace 

#### Naplnění systémového volání

Najít v tabulkách pro Manjaro (konkrétní OS)

syscall 11 execve
```
int execve(const char *filename, char *const argv[], char *const envp[]);
```

> **const char * filename**
>
> - Ukazatel na filename souboru který chceme spustit = stejně jako na Windows
>
> - může být např <mark>/bin/sh</mark>

> **char * const argv[]** 
>
> - Minimálně dva argumenty a to
>
> 		- ukazatel na jméno spouštěného souboru argv 0
>
> 		- dále nullptr (pokud nechceme nic dalšího)

> **char * const envp[]**
>
> - může být prázdné
>
> - tedy musí mít pointer na místo, kde je nullptr

#### Tipy a triky

 Je potřeba naplnit začátek NOP (No Operation), cca 40 ti, aby to doskákalo na začátek zásobníku. Jak ? Toť zatím nevím 

 - NOP sled

#### Registry

> **RIP**
>
> - drží adresu následující instrukce

> **RAX**
>
> - drží return value funkce max 8 bytes, větší se vrací na zásobníku

> **RSP** 
>
> - stack pointer, ukazatel na nejvyšší registr v zásobníku

> **RBP, RBX** 
>
> - calle-save registry,  ukládáné při volání funkcí call
>
> - base pointer, v minulosti (32bit x86) volaná funkce si uložila base pointer na current stack frame svého volatele

> **RDI, RSI, RDX, RCX, R8, R9** 
> 
> - na posílání parametrů do funkce, větší nebo více opět přes zásobník


## 1. Analýza binárky, zásobníku, vymyšlení strategie

### Popis zásobníku a instrukcí

Přikládám popis zásobníku  a k němu popsané jednotlivé  instrukce funkce ```main()```.

 Budu-li se zmiňovat a jednotivé instrukci, beru číslování v levém sloupci, zde teda je funkce z instrukcí ...6f až ...b9

#### Zásobník ve stavu po instrukci 7A

| Adresa            | Obsah - hexa     | Textově                      | Poznámka                                                  |
| ----------------- | ---------------- | ---------------------------- | --------------------------------------------------------- |
| 00007fff:ffffdd10 | 00007fffffffde58 |                              | Parametr funkce main (ukazatel na pole argumentů), ins 7A, zde ukazuje RSP |
| 00007fff:ffffdd18 | 0000000200000000 |                              | Parametr funkce main (počet argumentů), ins 77            |
| 00007fff:ffffdd20 | 0000000000000000 |                              | Stav z minule (pravděpodobně je zde buffer)               |
| 00007fff:ffffdd28 | 00007ffff7fe6380 |                              | Stav z minule (pravděpodobně je zde buffer)               |
| 00007fff:ffffdd30 | 0000000000000000 |                              | Stav z minule (pravděpodobně je zde buffer)               |
| 00007fff:ffffdd38 | 00007ffff7ffdab0 |                              | Stav z minule (pravděpodobně je zde buffer)               |
| 00007fff:ffffdd40 | 0000000000000002 |                              | Sem ukazuje RBP, je zde hodnota starého RBP                           |
| 00007fff:ffffdd48 | 00007ffff7dd1790 | return to 0x00007ffff7dd1790 | návratová adresa                                          |
| 00007fff:ffffdd50 |                  |                              |                                                           |
| ...               |                  |                              |                                                           |


#### Instrukce

![instrukce](./img/main_function.png  "instrukce")

> ##### Instrukce 6F
>
> - Záloha stávajícího  RBP

> ##### Instrukce 73
>
> - Vytvoření prostoru pro lokální proměnné

> ##### Instrukce 77 a 7A
>
> - Argumenty funkce ```main()``` na vrchol zásobníku (adresy ...dd10 a ...dd18)

> ##### Instrukce 7E až 90
>
> - Argumenty pro funkci ```strcpy()``` do registrů RSI a RDI, v RSI je ukazatel na obsah druhého argumentu programu, v RDI je adresa, kam se má obsah kopírovat, tedy z toho víme, že buffer začíná na adrese ```0x00007fffffffdd20```. Z toho ale nevíme přesně, jak je buffer dlouhý, rozhodně by ale neměl zasahovat do adresy ```0x00007fffffffdd40```, kde je na kterou ukazuje registr RBP. Tedy z tabulky zásobníku vidíme, že je buffer veliký maximálně 32 bajtů

> ##### Instrukce 93
>
> - Volání ```strcpy()```

> ##### Instrukce 98 až A9
>
> - Příprava argumentů pro funkci ```printf()```.  V RSI je ukazatel na začátek bufferu, v  RDI je konstantní text 

> ##### Instrukce AE
>
> - Volání ```printf()```

> ##### Instrukce B3
>
> - Vynulování RAX, return value funkce ```main()```

> ##### Instrukce B8
>
> -   leave = RSP na RBP, potom POP do RBP

> ##### Instrukce B9
>
> - ret = popne adresu ze zásobníku a skočí tam 

### Strategie

Ze zásobníku to tedy vyplívá, že 33. - 40 bajt vstupu přepíše hodnotu PUSHnutého RBP a 41. až 48. bajt vstupu přepíše návratovou adresu

Toto si ověřuji následujícím vstupem:

```
edb --run ./a.out $(python -c "print('a'*32+'bbbbbbbb'+'cccccccc')")
```

#### Zásobník po naplnění bufferu vymyšleným vstupem

| Adresa            | Obsah - hexa     | Textově          | Poznámka                                                  |
| ----------------- | ---------------- | ---------------- | --------------------------------------------------------- |
| 00007fff:ffffdd10 | 00007fffffffde58 |                  | Parametr funkce main (ukazatel na pole argumentů), ins 7A |
| 00007fff:ffffdd18 | 0000000200000000 |                  | Parametr funkce main (počet argumentů), ins 77            |
| 00007fff:ffffdd20 | 6161616161616161 | ASCII "aaaaaaaa" |                                                           |
| 00007fff:ffffdd28 | 6161616161616161 | ASCII "aaaaaaaa" |                                                           |
| 00007fff:ffffdd30 | 6161616161616161 | ASCII "aaaaaaaa" |                                                           |
| 00007fff:ffffdd38 | 6161616161616161 | ASCII "aaaaaaaa" |                                                           |
| 00007fff:ffffdd40 | 6262626262626262 | ASCII "bbbbbbbb" | Přepsaná záloha RBP                                       |
| 00007fff:ffffdd48 | 6363636363636363 | ASCII "cccccccc" | Přepsaná návratová adresa                                 |
| 00007fff:ffffdd50 |                  |                  |                                                           |
| ...               |                  |                  |                                                           |

Tedy opravdu, návratová adresa se přepsala a program kvůli neplatné návratové adrese spadl

Z tohoto jsem se tedy dozvěděl, jaké konkrétní bajty umožní např. spuštění tajné funkce či systémového volání. Tedy 41. až 48. bajt.
 
V případě tajné funkce zbývá tedy najít její adresu, kterou pak s dodrženou endianitou vložit do 41. až 48. bajtu vstupu
 
V případě systémového volání.............

## 2. Spuštění tajné funkce ```secret_function()```

### Postup

> 1. Zjištění adresy tajné funkce ```secret_function()```
>
> 2. Vytvoření inputu, který způsobí spuštění tajné funkce ```secret_function()```

### Vypracování

#### 1. Zjištění adresy tajné funkce ```secret_function()```

##### Využítí GDB

Za pomocí GDB (či rovnou v EDB) zjistím adresu tajné nespouštěné funkce ```secret_function()```

V praxi bychom to našli spíše rovnou v tom EDB, protože zpočátku nevíme, že se nějaké slovo 'secret' v binárce vůbec vyskytuje

```
gdb ./a.out
```

![GDB](./img/gdb_find_secret.png  "GDB")

![EDB secret function](./img/edb_secret_function.png  "EDB secret function")

Z výpisu vyčítáme, že 'secret' se nachází na adrese ```0x555555555159```

####  2. Vytvoření inputu, který způsobí spuštění tajné funkce ```secret_function()```

Nyní známe adresu tajné funkce ```secret_function()```, za 40. znakem vstupu napíšeme tuto adresu, aby se program po dokončení funkce ```strcpy()``` vrátil do tajné funkce

Při psaní adresy musíme dodržet endianitu, v mém připadě little endian, tedy adresu píši "zprava doleva", viz

```
./a.out $(python -c "print('a'*40+'\x59\x51\x55\x55\x55\x55')")
```

Po spuštění programu s daným argumentem je vidno, že se spustila tajná funkce ```secret_function()```:

![Secret function](./img/secret_function.png  "Secret function")

##### Problémové znaky

Pokud by však adresa tajné funkce obsahovala nulový bajt jinde než na konci (tam by ho případně doplnila ```strcpy()```), nebo více na konci, bash by ukončovací nulu úplně ignoroval. Adresa funkce tedy může obsahovat pouze jednu ukončovací nulu a to na samém konci, jinak by útok nebyl proveditelný

Dalším problémovým znakem je mezera, ASCII **0x20**. Mezera odděluje argumenty při spouštění programu. Pokud se tedy v nějaké adrese vyskytne bajt 0x20, tím argument a také vstup končí a nelze dopsat nic dalšího

Ten samý problém bude s některými dalšími oddělovacími znaky. Tedy problém nám dělají tyto znaky:

- TAB (**0x09**)
- new line (**0x0A**)
- space (**0x20**)

Naopak jsem vyzkoušel, že tyto znaky spadající pod ```isspace()``` problém nedělají: 

- vertical TAB (**0x0B**)
- carriage return (**0x0D**)
- form feed (**0x0C**)

Další problémové bajty jsou všechny bajty **>= 0x80**.
## 3. Provedení syscall a spuštění jiného programu, např. shellu

---

## Alternativní zjištění velikosti bufferu

### Vygenerování dlouhého unikátního neopakujícího se vstupu

Využití toolu od Metasploitu

```
bash /opt/metasploit/tools/exploit/pattern_create.rb -l 60
```

S výstupem:

```
Aa0Aa1Aa2Aa3Aa4Aa5Aa6Aa7Aa8Aa9Ab0Ab1Ab2Ab3Ab4Ab5Ab6Ab7Ab8Ab9
```

### Vygenerovaný string jako argument programu

```
edb --run ./a.out Aa0Aa1Aa2Aa3Aa4Aa5Aa6Aa7Aa8Aa9Ab0Ab1Ab2Ab3Ab4Ab5Ab6Ab7Ab8Ab9
```

Program necháme běžet v EDB debuggeru (tlačítko F9) a narazíme na Segmentation Fault:

![Segmentation Fault](./img/segfault.png  "Segmentation Fault")

Z následujícího obrázku vidíme, že string ```b3Ab4Ab5``` nebo hexa ```3562413462413362``` už přetekl do vedlejší paměti:

![Overflow](./img/after_segfault.png  "Overflow")

### Nalezení, kde string přetekl

Opět pomocí pomocného scriptu od metasploitu nalezneme konkrétní pozici vstupního string, kde začal přetékat do sousední paměti:

```
bash /opt/metasploit/tools/exploit/pattern_offset.rb -q 3562413462413362
```

S výstupem:

```
[*] Exact match at offset 40
```

Tedy víme, že 41. znak už je přetečený do sousední paměti
