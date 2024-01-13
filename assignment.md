---
title: CS10 Homework Assignment
nav_exclude: true
---
<script type="text/javascript">
function autoRes(id) {
    var newheight;
    if (document.getElementById) {
        newheight = document.getElementById(id).contentWindow.document.body.scrollHeight;
    }
    document.getElementById(id).height = (newheight) + "px";
}
function updateAssignment() {
    doc = document.URL.split("?")[1];
    let iframe = document.getElementById('frm');
    iframe.src = `${doc}?embedded=true`;
    iframe.style = `min-height: ${window.innerHeight - 60}px`;
    resize('frm', document.getElementById('frm').src);
    document.getElementById('js-newTab').href = doc;
}
if (window.addEventListener) {
  function resize(id, other_domain) {
    var iframe = document.getElementById(id);
    window.addEventListener('message', function(event) {
      var height = parseInt(event.data) + 32;
      iframe.height = height + "px";
    }, false);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  updateAssignment();
})
</script>

<a href="#" class="btn btn-green" target=_blank id="js-newTab">Open In New Tab</a>

<iframe id='frm' onload='autoRes("frm")' src="">
  There should be an assignment here. Oops!
</iframe>

<style>
  #frm {
    width: 100%;
    border: 0;
    min-height: calc(100% - 40px);
  }
</style>
