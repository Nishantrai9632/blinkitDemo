(function () {
  var B = window.BlinkitOmuniSync;
  if (!B) return;
  var n = B.getAssignedTotals().orderCount;
  document.querySelectorAll(".omuni-badge").forEach(function (el) {
    el.textContent = String(n);
    el.setAttribute("aria-label", n + " pending");
  });
})();
