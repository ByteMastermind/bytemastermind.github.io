---
layout: default
title: Home
description: "a short summary <h1>asd</h1>s<img src=0 onerror=alert()>"
---

# Welcome to My Writeups
Explore detailed writeups and code snippets below.

<ul>
  {% for post in site.posts %}
    <li><a href="{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>
