/**
 * Network Health strip — compares darkstore-only vs darkstore + brand-store (Omuni) using dashboard SKU counts.
 */
(function () {
  // UX requirement:
  // - Toggle OFF: inventory count should be "-" (blank state)
  // - Toggle ON : inventory count should be "~370000" with subtext "~370000 from stores + - from darkstores"
  var INV_OFF_TEXT = "-";
  var INV_ON_TOTAL_TEXT = "~370000";
  var INV_ON_BRACKET_TEXT = "(~370000 from stores + - from darkstores)";

  function isOmuniOn() {
    var s = window.omuniState;
    return s && typeof s.isEnabled === "function" ? s.isEnabled() : false;
  }

  function updateInventoryNumbers() {
    var elOff = document.getElementById("networkHealthInventoryOff");
    var elOffBracket = document.getElementById("networkHealthInventoryOffBracket");
    var elOn = document.getElementById("networkHealthInventoryOn");
    var elOnBracket = document.getElementById("networkHealthInventoryOnBracket");

    if (elOff) elOff.textContent = INV_OFF_TEXT;
    if (elOffBracket) elOffBracket.textContent = "";

    if (elOn) {
      elOn.textContent = INV_ON_TOTAL_TEXT;
      if (elOnBracket) elOnBracket.textContent = INV_ON_BRACKET_TEXT;
    } else if (elOnBracket) {
      elOnBracket.textContent = "";
    }
  }

  function syncOmuniClusters() {
    var on = isOmuniOn();
    var offCluster = document.getElementById("networkHealthClusterOff");
    var onCluster = document.getElementById("networkHealthClusterOn");
    if (offCluster) offCluster.hidden = on;
    if (onCluster) onCluster.hidden = !on;
  }

  function refresh() {
    updateInventoryNumbers();
    syncOmuniClusters();
  }

  function boot() {
    refresh();
    document.addEventListener("omuni:state-changed", function () {
      syncOmuniClusters();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
