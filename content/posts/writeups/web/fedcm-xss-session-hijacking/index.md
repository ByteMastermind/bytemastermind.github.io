---
title: FedCM as a Session Hijacking Gadget
description: How FedCM can turn XSS into session hijacking
date: "2026-10-06"
tldr: Sites using FedCM with XSS vulnerability are inherently vulnerable to session hijacking.
draft: false
tags: [web,fedcm,xss,auth,session]
toc: false
---

An XSS on a relying party using FedCM leads to session hijacking, even when its session cookies are HttpOnly. This is an already documented consequence of exposing login credentials to JavaScript, and something worth remembering when assessing XSS impact.

Let's say `example.com` uses Google to sign users in through FedCM in Chrome. Here, `example.com` is the relying party (RP), and Google is the identity provider (IdP). The browser mediates the login, but ultimately returns a credential to the RP's JavaScript through `navigator.credentials.get()`. Its `token` property contains the login assertion. This handoff is shown in [Chrome's RP implementation guide](https://developer.chrome.com/docs/identity/fedcm/implement/relying-party).

With XSS on the origin performing that flow, an attacker can invoke FedCM using the RP's legitimate provider and client ID. If the user completes the login, the malicious script receives the credential and can send it to the attacker. The browser's login dialog can look completely legitimate because the RP and IdP are legitimate.

The [FedCM specification's Cross-Site Scripting section](https://w3c-fedid.github.io/FedCM/#cross-site-scripting) explicitly describes this:

> their credentials are then received by the malicious script, which can then send it to its own server.

The practical consequence: if the RP accepts that stolen credential from the attacker's browser, the attacker can obtain a session as the victim on `example.com`. `HttpOnly` protects the existing session cookie; the exposed login credential can create another session. Google's [server-side ID token guide](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token) describes how the RP validates an ID token and signs the user in. The impact here concerns the victim's RP account, without requiring access to their Google session.

FedCM inherently exposes the returned credential to RP JavaScript, making session hijacking a possible XSS impact. Chrome also acknowledges this risk in its [Q1 2025 feedback report](https://privacysandbox.google.com/overview/feedback/report-2025-q1#fedcm).
