---
layout: page
title: Staff
description: A listing of all the course staff members.
---

# Staff

## Instructors

Email the instructors with any questions about the class.

{% assign instructors = site.staffers | where: 'role', 'Instructor' %}
<div class="role">
  {% for staffer in instructors %}
  {{ staffer }}
  {% endfor %}
</div>

## Teaching Assistants

{% assign staff = site.staffers | where: 'role', 'Teaching Assistant' %}
<div class="role">
  {% for staffer in staff %}
  {{ staffer }}
  {% endfor %}
</div>

## Readers

{% assign readers = site.staffers | where: 'role', 'Reader' %}
<div class="role">
  {% for staffer in readers %}
  {{ staffer }}
  {% endfor %}
</div>
