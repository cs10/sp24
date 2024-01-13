---
layout: home
title: Calendar (JS)
permalink: /cal
nav_exclude: true
---

<script src="{{site.baseurl}}/assets/jquery.min.js"></script>
<script src="{{site.baseurl}}/assets/dayjs.min.js"></script>
<script>
  !function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).dayjs_plugin_weekOfYear=t()}(this,(function(){"use strict";var e="week",t="year";return function(i,n,r){var f=n.prototype;f.week=function(i){if(void 0===i&&(i=null),null!==i)return this.add(7*(i-this.week()),"day");var n=this.$locale().yearStart||1;if(11===this.month()&&this.date()>25){var f=r(this).startOf(t).add(1,t).date(n),s=r(this).endOf(e);if(f.isBefore(s))return 1}var a=r(this).startOf(t).date(n).startOf(e).subtract(1,"millisecond"),o=this.diff(a,e,!0);return o<0?r(this).startOf("week").week():Math.ceil(o)},f.weeks=function(e){return void 0===e&&(e=null),this.week(e)}}}));
</script>
<script src="{{site.baseurl}}/assets/schedule.js"></script>

<table class="table table-bordered schedule-table">
  <thead>
    <tr>
      <th class="center schedule-week-num">Week</th>
      <th>Date</th>
      <th>Lecture</th>
      <th>Readings</th>
      <th>Lab</th>
      <th>Discussion</th>
      <th>Assignment</th>
    </tr>
  </thead>
  <tbody class="js-scheduleContent">
  </tbody>
</table>
