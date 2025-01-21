---
layout: default
title: Home
---

# Welcome to My Writeups
Explore detailed writeups and code snippets below.

<ul>
  {% for post in site.posts %}
    <li><a href="{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>
