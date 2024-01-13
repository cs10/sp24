---
layout: page
title: Announcements
nav_exclude: true
description: A feed containing all of the class announcements.
---

# Announcements

Here, you can find all weekly announcements for the summer.

{% assign announcements = site.announcements | reverse %}
{% for announcement in announcements %}
{{ announcement }}
{% endfor %}
