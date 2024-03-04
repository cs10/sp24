---
layout: page
title: Staff
description: A listing of all the course staff members.
nav_order: 10
---

# Staff
### Add 'berkeley.edu' to the end of all emails.

## Instructor

{% assign instructors = site.staffers | where: 'role', 'Instructor' %}
<div class="role">
  {% for staffer in instructors %}
  {{ staffer }}
  {% endfor %}
</div>

## Head UCS-2 (Head Teaching Assistant)

{% assign HeadTA = site.staffers | where: 'role', 'Head TA' %}
<div class="role">
  {% for staffer in HeadTA %}
  {{ staffer }}
  {% endfor %}
</div>

## UCS-2 (Teaching Assistant)

{% assign LabTA = site.staffers | where: 'role', 'Lab TA' %}
<div class="role">
  {% for staffer in LabTA %}
  {{ staffer }}
  {% endfor %}
</div>

## UCS-1s (Tutors)

{% assign OHTA = site.staffers | where: 'role', 'OH TA' %}
<div class="role">
  {% for staffer in OHTA %}
  {{ staffer }}
  {% endfor %}
</div>

## Academic Interns

{% assign AI = site.staffers | where: 'role', 'Academic Interns' %}
<div class="role">
  {% for staffer in AI %}
  {{ staffer }}
  {% endfor %}
</div>
