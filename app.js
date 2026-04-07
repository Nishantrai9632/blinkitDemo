(function () {
  var FEES = { delivery: 30, handling: 11, surge: 20 };

  var categoryStrip = document.getElementById("categoryStrip");
  var productsTitle = document.getElementById("productsTitle");
  var gridDefault = document.getElementById("gridDefault");
  var gridApparel = document.getElementById("gridApparel");
  var gridLifestyle = document.getElementById("gridLifestyle");
  var productsSection = document.getElementById("productsSection");
  var lifestyleFiltersRoot = document.getElementById("lifestyleFilters");
  var lifestyleSortEl = document.getElementById("lifestyleSort");
  var omuniStoresCountEl = document.getElementById("omuniStoresCount");
  var styleCountEl = document.getElementById("styleCount");
  /** @type {Record<string, true>} */
  var lifestyleBrandSelected = {};
  /** @type {Record<string, true>} */
  var lifestyleTypeSelected = {};
  /** Single-select: "" = Any time; otherwise "30"|"60"|"120"|"same-day". Exposed for lifestyle-render.js */
  var lifestyleDeliveryBy = "";
  window.lifestyleDeliveryBy = "";

  var searchInput = document.getElementById("searchInput");
  var searchClear = document.getElementById("searchClear");
  var searchResultsTitle = document.getElementById("searchResultsTitle");

  var cartToggle = document.getElementById("cartToggle");
  var cartToggleMobile = document.getElementById("cartToggleMobile");
  var cartHeaderLine1 = document.getElementById("cartHeaderLine1");
  var cartHeaderLine2 = document.getElementById("cartHeaderLine2");
  var cartHeaderLine1Mobile = document.getElementById("cartHeaderLine1Mobile");
  var cartHeaderLine2Mobile = document.getElementById("cartHeaderLine2Mobile");
  var cartDrawer = document.getElementById("cartDrawer");
  var cartBackdrop = document.getElementById("cartBackdrop");
  var cartClose = document.getElementById("cartClose");
  var cartEmpty = document.getElementById("cartEmpty");
  var cartHasItems = document.getElementById("cartHasItems");
  var cartList = document.getElementById("cartList");
  var cartFooter = document.getElementById("cartFooter");
  var cartShipmentCount = document.getElementById("cartShipmentCount");
  var cartItemsPayable = document.getElementById("cartItemsPayable");
  var cartItemsMrpLine = document.getElementById("cartItemsMrpLine");
  var cartSavedBadge = document.getElementById("cartSavedBadge");
  var cartSavedAmt = document.getElementById("cartSavedAmt");
  var cartDeliveryLine = document.getElementById("cartDeliveryLine");
  var cartHandlingLine = document.getElementById("cartHandlingLine");
  var cartSurgeLine = document.getElementById("cartSurgeLine");
  var cartGrandLine = document.getElementById("cartGrandLine");
  var cartStickyTotal = document.getElementById("cartStickyTotal");
  var checkoutBtn = document.getElementById("checkoutBtn");
  var cartChangeAddress = document.getElementById("cartChangeAddress");

  var checkoutModal = document.getElementById("checkoutModal");
  var checkoutBackdrop = document.getElementById("checkoutBackdrop");
  var checkoutForm = document.getElementById("checkoutForm");
  var checkoutOrderSummary = document.getElementById("checkoutOrderSummary");
  var checkoutSuccess = document.getElementById("checkoutSuccess");
  var checkoutDone = document.getElementById("checkoutDone");
  var checkoutTitle = document.getElementById("checkoutTitle");
  var checkoutMainBlock = document.getElementById("checkoutMainBlock");
  var checkoutSticky = document.getElementById("checkoutSticky");
  var checkoutStickyTotal = document.getElementById("checkoutStickyTotal");
  var placeOrderBtn = document.getElementById("placeOrderBtn");
  var donationCheck = document.getElementById("donationCheck");
  var tipRow = document.getElementById("tipRow");

  var checkoutSavedAddressBlock = document.getElementById("checkoutSavedAddressBlock");
  var checkoutPaymentBlock = document.getElementById("checkoutPaymentBlock");
  var checkoutPaymentHint = document.getElementById("checkoutPaymentHint");
  var checkoutAddressFields = document.getElementById("checkoutAddressFields");
  /** When true, cart already has a delivery address — skip address form and show payment only. */
  var CHECKOUT_USE_SAVED_ADDRESS = true;

  var locationModal = document.getElementById("locationModal");
  var locationBtn = document.getElementById("locationBtn");
  var locationDeliveryLine = document.getElementById("locationDeliveryLine");
  var locationAddressLine = document.getElementById("locationAddressLine");

  var navAccountWrap = document.getElementById("navAccountWrap");
  var navAccountBtn = document.getElementById("navAccountBtn");
  var navAccountDropdown = document.getElementById("navAccountDropdown");
  var headerMenuBtn = document.getElementById("headerMenuBtn");
  var headerMenuBackdrop = document.getElementById("headerMenuBackdrop");

  function closeHeaderMenu() {
    if (!document.body.classList.contains("header--menu-open")) return;
    document.body.classList.remove("header--menu-open");
    if (headerMenuBtn) {
      headerMenuBtn.setAttribute("aria-expanded", "false");
      headerMenuBtn.setAttribute("aria-label", "Open menu");
    }
    if (headerMenuBackdrop) {
      headerMenuBackdrop.hidden = true;
      headerMenuBackdrop.setAttribute("aria-hidden", "true");
    }
  }

  function openHeaderMenu() {
    document.body.classList.add("header--menu-open");
    if (headerMenuBtn) {
      headerMenuBtn.setAttribute("aria-expanded", "true");
      headerMenuBtn.setAttribute("aria-label", "Close menu");
    }
    if (headerMenuBackdrop) {
      headerMenuBackdrop.hidden = false;
      headerMenuBackdrop.setAttribute("aria-hidden", "false");
    }
  }

  function toggleHeaderMenu() {
    if (document.body.classList.contains("header--menu-open")) closeHeaderMenu();
    else openHeaderMenu();
  }

  if (headerMenuBtn) {
    headerMenuBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleHeaderMenu();
    });
  }

  if (headerMenuBackdrop) {
    headerMenuBackdrop.addEventListener("click", function () {
      closeHeaderMenu();
    });
  }

  var headerNavPanel = document.getElementById("headerNavPanel");
  if (headerNavPanel) {
    headerNavPanel.addEventListener("click", function (e) {
      var link = e.target.closest("a[href]");
      if (!link || link.closest(".nav-account-dropdown")) return;
      var href = link.getAttribute("href") || "";
      if (href !== "#" && href.indexOf("javascript:") !== 0) closeHeaderMenu();
    });
  }

  window.addEventListener(
    "resize",
    function () {
      if (window.innerWidth > 900) closeHeaderMenu();
    },
    { passive: true }
  );

  function closeAccountDropdown() {
    if (!navAccountWrap || !navAccountDropdown || !navAccountBtn) return;
    navAccountWrap.classList.remove("nav-account-wrap--open");
    navAccountDropdown.hidden = true;
    navAccountBtn.setAttribute("aria-expanded", "false");
  }

  function openAccountDropdown() {
    if (!navAccountWrap || !navAccountDropdown || !navAccountBtn) return;
    navAccountWrap.classList.add("nav-account-wrap--open");
    navAccountDropdown.hidden = false;
    navAccountBtn.setAttribute("aria-expanded", "true");
    if (headerNavPanel) {
      window.setTimeout(function () {
        try {
          headerNavPanel.scrollTo({ top: Math.max(0, navAccountWrap.offsetTop - 8), behavior: "smooth" });
        } catch (err) {
          headerNavPanel.scrollTop = Math.max(0, navAccountWrap.offsetTop - 8);
        }
      }, 0);
    }
  }

  function toggleAccountDropdown() {
    if (!navAccountDropdown) return;
    if (navAccountDropdown.hidden) openAccountDropdown();
    else closeAccountDropdown();
  }

  if (navAccountBtn && navAccountDropdown) {
    navAccountBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleAccountDropdown();
    });
    navAccountDropdown.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function (e) {
        var href = a.getAttribute("href");
        if (!href || href === "#") {
          e.preventDefault();
        }
        closeAccountDropdown();
      });
    });
  }

  document.addEventListener("click", function (e) {
    if (!navAccountWrap || !navAccountDropdown || navAccountDropdown.hidden) return;
    if (navAccountWrap.contains(e.target)) return;
    closeAccountDropdown();
  });

  var omuniBenefitsSlide = document.getElementById("omuniSlideBenefits");
  var omuniBenefitsOpen = document.getElementById("omuniBenefitsOpen");
  var omuniPresentationClose = document.getElementById("omuniPresentationClose");
  var omuniPresentationFrame = document.getElementById("omuniPresentationFrame");
  var omuniPresentationFallback = document.getElementById("omuniPresentationFallback");
  var omuniBenefitsLastFocus = null;

  /** Export PPT to PDF as Omuni_Blinkit_CRO.pdf in the project root to prefer the PDF viewer (scrollable). */
  var OMUNI_PRESENTATION_PDF = "Omuni_Blinkit_CRO.pdf";
  /** HTML slide deck (same folder) — works when no PDF is present. */
  var OMUNI_PRESENTATION_HTML = "Omuni_Blinkit_CRO_v2.html";
  var omuniPresentationSrcResolved = null;

  function resolvePresentationEmbedUrl(cb) {
    if (omuniPresentationSrcResolved) {
      cb(omuniPresentationSrcResolved);
      return;
    }
    fetch(OMUNI_PRESENTATION_PDF, { method: "HEAD", cache: "no-store" })
      .then(function (res) {
        omuniPresentationSrcResolved = res.ok ? OMUNI_PRESENTATION_PDF : OMUNI_PRESENTATION_HTML;
        cb(omuniPresentationSrcResolved);
      })
      .catch(function () {
        omuniPresentationSrcResolved = OMUNI_PRESENTATION_HTML;
        cb(omuniPresentationSrcResolved);
      });
  }

  function loadOmuniPresentationIframe() {
    if (!omuniPresentationFrame) return;
    resolvePresentationEmbedUrl(function (url) {
      var frame = omuniPresentationFrame;
      if (omuniPresentationFallback) omuniPresentationFallback.hidden = true;
      frame.hidden = false;
      if (frame.dataset.embeddedUrl === url) return;
      frame.dataset.embeddedUrl = url;
      frame.src = url;
    });
  }

  function showPresentationFallback() {
    if (omuniPresentationFrame) omuniPresentationFrame.hidden = true;
    if (omuniPresentationFallback) omuniPresentationFallback.hidden = false;
  }

  function openOmuniBenefits() {
    if (!omuniBenefitsSlide) return;
    closeHeaderMenu();
    omuniBenefitsLastFocus = document.activeElement;
    omuniBenefitsSlide.removeAttribute("hidden");
    document.body.classList.add("omuni-benefits-active");
    loadOmuniPresentationIframe();
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        omuniBenefitsSlide.classList.add("omuni-benefits--open");
      });
    });
    if (omuniPresentationClose) omuniPresentationClose.focus();
  }

  function closeOmuniBenefits() {
    if (!omuniBenefitsSlide || !omuniBenefitsSlide.classList.contains("omuni-benefits--open")) return;
    omuniBenefitsSlide.classList.remove("omuni-benefits--open");
    function finish() {
      omuniBenefitsSlide.setAttribute("hidden", "");
      document.body.classList.remove("omuni-benefits-active");
      if (omuniBenefitsLastFocus && typeof omuniBenefitsLastFocus.focus === "function") {
        omuniBenefitsLastFocus.focus();
      }
      omuniBenefitsLastFocus = null;
    }
    var done = false;
    function onEnd(e) {
      if (e.target !== omuniBenefitsSlide || e.propertyName !== "opacity") return;
      if (done) return;
      done = true;
      omuniBenefitsSlide.removeEventListener("transitionend", onEnd);
      finish();
    }
    omuniBenefitsSlide.addEventListener("transitionend", onEnd);
    window.setTimeout(function () {
      if (done) return;
      done = true;
      omuniBenefitsSlide.removeEventListener("transitionend", onEnd);
      finish();
    }, 400);
  }

  if (omuniBenefitsOpen && omuniBenefitsSlide) {
    omuniBenefitsOpen.addEventListener("click", function () {
      openOmuniBenefits();
    });
  }
  if (omuniBenefitsSlide) {
    omuniBenefitsSlide.querySelectorAll("[data-omuni-benefits-close]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        closeOmuniBenefits();
      });
    });
  }
  if (omuniPresentationFrame) {
    omuniPresentationFrame.addEventListener("load", function () {
      try {
        var s = omuniPresentationFrame.src || "";
        if (!s || s.indexOf("about:blank") !== -1) return;
      } catch (err) {
        return;
      }
      omuniPresentationFrame.hidden = false;
      if (omuniPresentationFallback) omuniPresentationFallback.hidden = true;
    });
  }

  var CATEGORY_TITLES = {
    all: "Best sellers",
    fruit: "Fruits & vegetables",
    dairy: "Dairy, bread & eggs",
    snacks: "Snacks & munchies",
    beverages: "Cold drinks & juices",
    instant: "Breakfast & instant food",
    personal: "Personal care",
  };

  var selectedTip = 0;
  /** @type {Record<string, { id: string, name: string, price: number, qty: number, size: string, mrp: number | null }>} */
  var cart = {};

  window.blinkitGetCartForEta = function () {
    return cart;
  };

  /** Remove cart lines whose product id is in ids (e.g. when apparel goes OOS). */
  window.blinkitRemoveLinesForProductIds = function (ids) {
    if (!ids || !ids.length) return;
    var drop = {};
    ids.forEach(function (id) {
      drop[id] = true;
    });
    var changed = false;
    Object.keys(cart).forEach(function (key) {
      var it = cart[key];
      if (it && it.id && drop[it.id]) {
        delete cart[key];
        changed = true;
      }
    });
    if (changed) {
      renderCartDrawer();
      document.querySelectorAll(".product-card").forEach(syncCardActions);
    }
  };

  /** Lifestyle page: remove cart lines whose product id is not in the baseline allowlist (toggle off). */
  window.blinkitRemoveCartLinesNotInAllowlist = function (allowlist) {
    if (!allowlist || !allowlist.length) return;
    var allow = {};
    allowlist.forEach(function (id) {
      allow[id] = true;
    });
    var changed = false;
    Object.keys(cart).forEach(function (key) {
      var it = cart[key];
      if (it && it.id && !allow[it.id]) {
        delete cart[key];
        changed = true;
      }
    });
    if (changed) {
      renderCartDrawer();
      document.querySelectorAll(".product-card").forEach(syncCardActions);
    }
  };

  function formatRupee(n) {
    return "₹" + Math.round(n);
  }

  function hueFromId(id) {
    var h = 0;
    for (var i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * 17) % 360;
    return h;
  }

  function getLineKey(card) {
    var id = card.getAttribute("data-id");
    if (!id) return "";
    var sel = card.querySelector("[data-size-select]");
    var size = sel ? String(sel.value).trim() : "";
    return size ? id + "::" + size : id;
  }

  function getDisplayName(card) {
    var base = card.getAttribute("data-name") || "Item";
    var sel = card.querySelector("[data-size-select]");
    if (sel) {
      return base + " · Size " + sel.value;
    }
    return base;
  }

  function getMrpFromCard(card) {
    var m = card.getAttribute("data-mrp");
    if (m == null || m === "") return null;
    var v = parseFloat(m);
    return isNaN(v) ? null : v;
  }

  function getProductImg(card) {
    return (card.getAttribute("data-product-img") || "").trim();
  }

  function cartItemCount() {
    var t = 0;
    Object.keys(cart).forEach(function (k) {
      t += cart[k].qty;
    });
    return t;
  }

  function cartSubtotalAmount() {
    var s = 0;
    Object.keys(cart).forEach(function (k) {
      s += cart[k].price * cart[k].qty;
    });
    return s;
  }

  function cartMrpTotal() {
    var s = 0;
    Object.keys(cart).forEach(function (k) {
      var it = cart[k];
      if (it.mrp != null) s += it.mrp * it.qty;
    });
    return s;
  }

  function cartSavedAmount() {
    var m = cartMrpTotal();
    if (m <= 0) return 0;
    return Math.max(0, m - cartSubtotalAmount());
  }

  function feesTotal() {
    return FEES.delivery + FEES.handling + FEES.surge;
  }

  function grandCartTotal() {
    return cartSubtotalAmount() + feesTotal();
  }

  function updateHeaderCart() {
    var n = cartItemCount();
    var total = grandCartTotal();
    if (cartHeaderLine1) cartHeaderLine1.textContent = n === 1 ? "1 item" : n + " items";
    if (cartHeaderLine2) cartHeaderLine2.textContent = formatRupee(n > 0 ? total : 0);
    if (cartHeaderLine1Mobile) cartHeaderLine1Mobile.textContent = n === 1 ? "1 item" : n + " items";
    if (cartHeaderLine2Mobile) cartHeaderLine2Mobile.textContent = formatRupee(n > 0 ? total : 0);
  }

  function getVisibleProductCards() {
    if (gridLifestyle) {
      return Array.prototype.slice.call(gridLifestyle.querySelectorAll(".product-card"));
    }
    var grid = gridApparel && !gridApparel.hidden ? gridApparel : gridDefault;
    if (!grid) return [];
    return Array.prototype.slice.call(grid.querySelectorAll(".product-card"));
  }

  function closeAllLifestyleDropdowns() {
    if (!lifestyleFiltersRoot) return;
    lifestyleFiltersRoot.querySelectorAll(".lifestyle-filter-panel").forEach(function (p) {
      resetLifestylePanelPosition(p);
      p.hidden = true;
    });
    lifestyleFiltersRoot.querySelectorAll('[id^="lifestyleTrigger"]').forEach(function (t) {
      t.setAttribute("aria-expanded", "false");
    });
  }

  function resetLifestylePanelPosition(panel) {
    if (!panel) return;
    panel.style.position = "";
    panel.style.left = "";
    panel.style.top = "";
    panel.style.right = "";
    panel.style.bottom = "";
    panel.style.width = "";
    panel.style.maxWidth = "";
    panel.style.maxHeight = "";
  }

  function positionLifestylePanel(trigger, panel) {
    if (!trigger || !panel) return;
    if (window.innerWidth > 900) return;

    var rect = trigger.getBoundingClientRect();
    var vw = Math.max(320, window.innerWidth || 0);
    var margin = 12;
    var maxW = vw - margin * 2;

    panel.style.position = "fixed";
    panel.style.top = Math.round(rect.bottom + 8) + "px";
    panel.style.maxHeight = "min(60vh, 420px)";
    panel.style.maxWidth = maxW + "px";
    panel.style.width = "";

    // Measure after applying fixed so we can clamp left.
    var pw = panel.getBoundingClientRect().width || 240;
    var left = rect.left;
    if (left + pw > vw - margin) left = vw - margin - pw;
    if (left < margin) left = margin;
    panel.style.left = Math.round(left) + "px";
  }

  function markActiveInPanel(panel, attrName, value) {
    if (!panel) return;
    panel.querySelectorAll(".lifestyle-filter-option").forEach(function (opt) {
      var v = opt.getAttribute(attrName);
      var on = v === value;
      opt.classList.toggle("lifestyle-filter-option--active", on);
      opt.setAttribute("aria-selected", on ? "true" : "false");
    });
  }

  function setLifestylePillSummary(triggerId, summaryText) {
    var btn = document.getElementById(triggerId);
    if (!btn) return;
    var sum = btn.querySelector(".lifestyle-filter-pill__summary");
    if (!sum) return;
    var t = String(summaryText || "").trim();
    if (t) {
      sum.textContent = t;
      sum.hidden = false;
      btn.setAttribute("title", t);
    } else {
      sum.textContent = "";
      sum.hidden = true;
      btn.removeAttribute("title");
    }
  }

  function summarizeLifestyleMultiSelect(selectedMap) {
    var keys = Object.keys(selectedMap).sort();
    if (keys.length === 0) return "";
    if (keys.length === 1) return keys[0];
    if (keys.length === 2) return keys[0] + ", " + keys[1];
    return keys[0] + ", " + keys[1] + " +" + (keys.length - 2);
  }

  function labelForLifestyleDeliveryBy(key) {
    var k = String(key || "").trim();
    if (k === "30") return "30 Mins";
    if (k === "60") return "60 Mins";
    if (k === "120") return "2 Hour";
    if (k === "same-day") return "SDD/NDD";
    return k;
  }

  function labelForLifestyleSort(value) {
    var v = String(value || "relevance");
    if (v === "relevance") return "";
    if (v === "price-asc") return "Price (low to high)";
    if (v === "price-desc") return "Price (high to low)";
    if (v === "discount-desc") return "Discount (high to low)";
    return v;
  }

  function updateLifestyleFilterPillStates() {
    var sortVal = String(lifestyleSortEl ? lifestyleSortEl.value : "relevance").trim();
    var sortDirty = !!sortVal && sortVal !== "relevance";
    var sortT = document.getElementById("lifestyleTriggerSort");
    if (sortT) {
      sortT.classList.toggle("lifestyle-filter-pill--dirty", sortDirty);
      setLifestylePillSummary("lifestyleTriggerSort", labelForLifestyleSort(sortVal));
    }

    var brandKeys = Object.keys(lifestyleBrandSelected);
    var bT = document.getElementById("lifestyleTriggerBrand");
    if (bT) {
      bT.classList.toggle("lifestyle-filter-pill--dirty", brandKeys.length > 0);
      setLifestylePillSummary("lifestyleTriggerBrand", summarizeLifestyleMultiSelect(lifestyleBrandSelected));
    }

    var typeKeys = Object.keys(lifestyleTypeSelected);
    var tyT = document.getElementById("lifestyleTriggerType");
    if (tyT) {
      tyT.classList.toggle("lifestyle-filter-pill--dirty", typeKeys.length > 0);
      setLifestylePillSummary("lifestyleTriggerType", summarizeLifestyleMultiSelect(lifestyleTypeSelected));
    }

    var dT = document.getElementById("lifestyleTriggerDeliveryBy");
    if (dT) {
      var delDirty = !!String(lifestyleDeliveryBy || "").trim();
      dT.classList.toggle("lifestyle-filter-pill--dirty", delDirty);
      setLifestylePillSummary("lifestyleTriggerDeliveryBy", delDirty ? labelForLifestyleDeliveryBy(lifestyleDeliveryBy) : "");
    }

    var clearBtn = document.getElementById("lifestyleClearFilters");
    if (clearBtn) {
      // Defensive: keep hidden unless we can positively identify an applied filter.
      clearBtn.hidden = true;
      var anyDirty =
        sortDirty ||
        brandKeys.length > 0 ||
        typeKeys.length > 0 ||
        !!String(lifestyleDeliveryBy || "").trim() ||
        (lifestyleFiltersRoot && lifestyleFiltersRoot.querySelector(".lifestyle-filter-pill--dirty"));
      if (anyDirty) clearBtn.hidden = false;
    }
  }

  function resetLifestyleFilters() {
    lifestyleBrandSelected = {};
    lifestyleTypeSelected = {};
    lifestyleDeliveryBy = "";
    window.lifestyleDeliveryBy = "";
    if (lifestyleSortEl) {
      lifestyleSortEl.value = "relevance";
    }
    markActiveInPanel(document.getElementById("lifestylePanelSort"), "data-sort-value", "relevance");
    markActiveInPanel(document.getElementById("lifestylePanelBrand"), "data-brand-filter", "all");
    markActiveInPanel(document.getElementById("lifestylePanelType"), "data-type-filter", "all");
    markActiveInPanel(document.getElementById("lifestylePanelDeliveryBy"), "data-delivery-by", "all");
    updateLifestyleFilterPillStates();
  }

  function minutesFromEtaLabel(label) {
    var s = String(label || "").trim();
    var hr = s.match(/(\d+)\s*HR\b/i);
    var mn = s.match(/(\d+)\s*MINS/i);
    var total = 0;
    if (hr) total += parseInt(hr[1], 10) * 60;
    if (mn) total += parseInt(mn[1], 10);
    if (total > 0) return total;
    var fallback = s.match(/(\d+)/);
    return fallback ? parseInt(fallback[1], 10) : 0;
  }

  function haversineKm(aLat, aLng, bLat, bLng) {
    function toRad(x) {
      return (x * Math.PI) / 180;
    }
    var R = 6371;
    var dLat = toRad(bLat - aLat);
    var dLng = toRad(bLng - aLng);
    var s1 = Math.sin(dLat / 2);
    var s2 = Math.sin(dLng / 2);
    var aa = s1 * s1 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * s2 * s2;
    var c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
    return R * c;
  }

  /** Nearest-store distance (km) must match at least one selected delivery filter (OR). */
  function minKmMatchesAnyDeliveryFilter(minKm, keys) {
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (k === "30" && minKm < 7) return true;
      if (k === "60" && minKm < 15) return true;
      if (k === "120" && minKm <= 40) return true;
      if (k === "same-day" && minKm < 800) return true;
    }
    return false;
  }

  /** Individual store distance (km) matches at least one selected delivery filter (OR). */
  function storeKmMatchesAnyDeliveryFilter(km, keys) {
    for (var j = 0; j < keys.length; j++) {
      var k2 = keys[j];
      if (k2 === "30" && km < 7) return true;
      if (k2 === "60" && km < 15) return true;
      if (k2 === "120" && km <= 40) return true;
      if (k2 === "same-day" && km < 800) return true;
    }
    return false;
  }

  function getUserLatLng() {
    var loc = getSavedLocation && getSavedLocation();
    if (loc && typeof loc.lat === "number" && typeof loc.lng === "number") {
      return { lat: loc.lat, lng: loc.lng, pincode: String(loc.pincode || "").trim() };
    }
    var pin = loc && loc.pincode ? String(loc.pincode).trim() : "";
    if (pin && window.PINCODE_LAT_LNG) {
      // Some generated mappings use numeric-like keys like "560038.0".
      var key = pin;
      var pair = window.PINCODE_LAT_LNG[key];
      if (!pair && pin.indexOf(".") === -1) pair = window.PINCODE_LAT_LNG[pin + ".0"];
      if (!pair && pin.endsWith(".0")) pair = window.PINCODE_LAT_LNG[pin.replace(/\.0$/, "")];
      if (pair) {
        return { lat: Number(pair[0]), lng: Number(pair[1]), pincode: pin };
      }
    }
    return null;
  }

  function computeBrandDistanceBuckets() {
    var user = getUserLatLng();
    var stores = window.WAREHOUSE_STORES || [];
    if (!user || !(user.lat || user.lat === 0) || !(user.lng || user.lng === 0) || stores.length === 0) {
      return null;
    }
    var minKmByBrand = {};
    for (var i = 0; i < stores.length; i++) {
      var s = stores[i];
      if (!s || !s.brand) continue;
      var km = haversineKm(user.lat, user.lng, Number(s.lat), Number(s.lng));
      var b = s.brand;
      if (minKmByBrand[b] == null || km < minKmByBrand[b]) minKmByBrand[b] = km;
    }
    return { minKmByBrand: minKmByBrand };
  }

  function syncMultiSelectPanel(panel, attrName, selectedMap) {
    if (!panel) return;
    var hasAny = Object.keys(selectedMap).length > 0;
    panel.querySelectorAll(".lifestyle-filter-option").forEach(function (opt) {
      var v = opt.getAttribute(attrName);
      if (!v) return;
      if (v === "all") {
        var onAll = !hasAny;
        opt.classList.toggle("lifestyle-filter-option--active", onAll);
        opt.setAttribute("aria-selected", onAll ? "true" : "false");
        return;
      }
      var on = !!selectedMap[v];
      opt.classList.toggle("lifestyle-filter-option--active", on);
      opt.setAttribute("aria-selected", on ? "true" : "false");
    });
  }

  function filterLifestylePanelOptions(panel, query) {
    if (!panel) return;
    var q = String(query || "").trim().toLowerCase();
    panel.querySelectorAll(".lifestyle-filter-option").forEach(function (opt) {
      var v =
        opt.getAttribute("data-brand-filter") ||
        opt.getAttribute("data-type-filter") ||
        opt.getAttribute("data-delivery-by") ||
        opt.getAttribute("data-sort-value") ||
        "";
      if (v === "all") {
        opt.style.display = "";
        return;
      }
      var label = (opt.textContent || "").trim().toLowerCase();
      opt.style.display = !q || label.indexOf(q) !== -1 ? "" : "none";
    });
  }

  function initLifestylePanelSearch(inputId, panelId) {
    var input = document.getElementById(inputId);
    var panel = document.getElementById(panelId);
    if (!input || !panel) return;

    input.addEventListener("click", function (e) {
      e.stopPropagation();
    });
    input.addEventListener("keydown", function (e) {
      e.stopPropagation();
      if (e.key === "Escape") {
        input.blur();
      }
    });
    input.addEventListener("input", function () {
      filterLifestylePanelOptions(panel, input.value);
    });
  }

  function applyLifestyleFacets() {
    if (!gridLifestyle) return;
    var q = (searchInput && searchInput.value ? searchInput.value : "").trim();
    var lower = q.toLowerCase();
    if (searchClear) searchClear.hidden = !q;
    if (searchResultsTitle) {
      if (q) {
        searchResultsTitle.hidden = false;
        searchResultsTitle.textContent = 'Showing results for "' + q + '"';
      } else {
        searchResultsTitle.hidden = true;
      }
    }
    var sortMode = lifestyleSortEl ? lifestyleSortEl.value : "relevance";
    var delKeysFacet = lifestyleDeliveryBy ? [lifestyleDeliveryBy] : [];
    var distFacet = delKeysFacet.length ? computeBrandDistanceBuckets() : null;
    var cards = Array.prototype.slice.call(gridLifestyle.querySelectorAll(".product-card"));
    var match = [];
    var nomatch = [];
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var name = (card.getAttribute("data-name") || "").toLowerCase();
      var okSearch = !lower || name.indexOf(lower) !== -1;
      var b = card.getAttribute("data-brand") || "";
      var okBrand = Object.keys(lifestyleBrandSelected).length === 0 || !!lifestyleBrandSelected[b];
      var ty = card.getAttribute("data-type") || "";
      var okType = Object.keys(lifestyleTypeSelected).length === 0 || !!lifestyleTypeSelected[ty];
      var okDelivery = true;
      if (delKeysFacet.length > 0) {
        // If we don't know the user's lat/lng (or mapping missing), don't hide everything.
        // Delivery-by filtering becomes a best-effort filter when location is known.
        if (!distFacet || !distFacet.minKmByBrand) {
          okDelivery = true;
        } else {
          var minKm = distFacet.minKmByBrand[b];
          if (minKm == null) okDelivery = true;
          else okDelivery = minKmMatchesAnyDeliveryFilter(minKm, delKeysFacet);
        }
      }
      if (okSearch && okBrand && okType && okDelivery) {
        match.push(card);
      } else {
        nomatch.push(card);
      }
    }
    function lifestyleCardOos(card) {
      return card.classList.contains("product-card--out-of-stock");
    }

    function compareLifestyleSort(a, b) {
      var ia = parseInt(a.getAttribute("data-catalog-index") || "0", 10);
      var ib = parseInt(b.getAttribute("data-catalog-index") || "0", 10);
      var pa = parseFloat(a.getAttribute("data-price") || "0");
      var pb = parseFloat(b.getAttribute("data-price") || "0");
      var oa = parseFloat(a.getAttribute("data-off") || "0");
      var ob = parseFloat(b.getAttribute("data-off") || "0");
      if (sortMode === "price-asc") return pa - pb;
      if (sortMode === "price-desc") return pb - pa;
      if (sortMode === "discount-desc") return ob - oa;
      return ia - ib;
    }

    match.sort(function (a, b) {
      var aOos = lifestyleCardOos(a);
      var bOos = lifestyleCardOos(b);
      if (aOos !== bOos) {
        return aOos ? 1 : -1;
      }
      return compareLifestyleSort(a, b);
    });

    function etaLabelFromMinutes(m) {
      var mins = Math.max(1, Math.round(Number(m) || 0));
      if (mins >= 120) {
        var hrs = Math.round(mins / 60);
        return hrs + " HR";
      }
      if (mins >= 60) {
        var h = Math.floor(mins / 60);
        var rm = mins % 60;
        if (rm < 5) return h + " HR";
        return h + " HR " + rm + " MINS";
      }
      return mins + " MINS";
    }

    function seededRand01(seed) {
      // xorshift32-ish, deterministic per seed.
      var x = seed | 0;
      x ^= x << 13;
      x ^= x >>> 17;
      x ^= x << 5;
      // 0..1
      return ((x >>> 0) % 10000) / 10000;
    }

    function hashStringToInt(s) {
      var str = String(s || "");
      var h = 2166136261;
      for (var i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
      return h | 0;
    }

    function deliveryRangeFor(keys) {
      // If multiple selected, take the widest range among them.
      var maxKey = null;
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (k === "same-day") return { lo: 120, hi: 480 };
        if (k === "120") maxKey = maxKey === "60" || maxKey === "30" || maxKey == null ? "120" : maxKey;
        if (k === "60" && maxKey !== "120") maxKey = maxKey === "30" || maxKey == null ? "60" : maxKey;
        if (k === "30" && !maxKey) maxKey = "30";
      }
      if (maxKey === "120") return { lo: 20, hi: 120 };
      if (maxKey === "60") return { lo: 20, hi: 60 };
      if (maxKey === "30") return { lo: 20, hi: 30 };
      return null;
    }

    var etaRange = delKeysFacet.length ? deliveryRangeFor(delKeysFacet) : null;
    match.forEach(function (c) {
      c.style.display = "";
      gridLifestyle.appendChild(c);

      // Update the visible ETA label based on Delivery By selection.
      if (etaRange) {
        var etaEl = c.querySelector(".product-card__eta");
        if (etaEl) {
          var cid = c.getAttribute("data-id") || c.getAttribute("data-name") || "";
          var seed = hashStringToInt(cid + "|" + delKeysFacet.join(","));
          var r = seededRand01(seed);
          var mins = etaRange.lo + Math.floor(r * (etaRange.hi - etaRange.lo + 1));
          etaEl.textContent = etaLabelFromMinutes(mins);
        }
      }
    });
    nomatch.forEach(function (c) {
      c.style.display = "none";
      gridLifestyle.appendChild(c);
    });
  }

  window.applyLifestyleFacets = applyLifestyleFacets;

  function formatInt(n) {
    try {
      return new Intl.NumberFormat("en-IN").format(n);
    } catch (e) {
      return String(n);
    }
  }

  function isOmuniToggleOnForLifestyleStats() {
    try {
      if (!window.omuniState || typeof window.omuniState.isEnabled !== "function") return true;
      return window.omuniState.isEnabled();
    } catch (e) {
      return true;
    }
  }

  function updateLifestyleStats() {
    if (!isOmuniToggleOnForLifestyleStats()) {
      if (omuniStoresCountEl) omuniStoresCountEl.textContent = formatInt(0);
      if (styleCountEl) styleCountEl.textContent = formatInt(0);
      return;
    }

    var dist = computeBrandDistanceBuckets();
    // Omuni Stores
    if (omuniStoresCountEl) {
      var brandKeys = Object.keys(lifestyleBrandSelected);
      var deliveryKeys = lifestyleDeliveryBy ? [lifestyleDeliveryBy] : [];
      var wh = 0;
      var userLoc = getUserLatLng();
      var stores = window.WAREHOUSE_STORES || [];
      if (userLoc && stores.length && dist && dist.minKmByBrand) {
        for (var si = 0; si < stores.length; si++) {
          var st = stores[si];
          if (!st || !st.brand) continue;
          if (brandKeys.length && !lifestyleBrandSelected[st.brand]) continue;
          var skm = haversineKm(userLoc.lat, userLoc.lng, Number(st.lat), Number(st.lng));
          if (deliveryKeys.length === 0 || storeKmMatchesAnyDeliveryFilter(skm, deliveryKeys)) {
            wh += 1;
          }
        }
      } else {
        // Fallback to precomputed brand counts when user lat/lng unknown
        var totalWh = typeof window.WAREHOUSE_TOTAL_COUNT === "number" ? window.WAREHOUSE_TOTAL_COUNT : 0;
        var byBrand = window.WAREHOUSE_COUNTS_BY_BRAND || {};
        if (brandKeys.length === 0) {
          wh = totalWh;
        } else {
          brandKeys.forEach(function (b) {
            wh += byBrand[b] ? Number(byBrand[b]) : 0;
          });
        }
      }
      omuniStoresCountEl.textContent = formatInt(wh);
    }

    // Style Added
    if (styleCountEl) {
      var rows = window.BRAND_CATEGORY_STYLE_ROWS || [];
      var totalStyles =
        typeof window.BRAND_CATEGORY_STYLE_TOTAL === "number" ? window.BRAND_CATEGORY_STYLE_TOTAL : 0;
      var brandKeys2 = Object.keys(lifestyleBrandSelected);
      var typeKeys = Object.keys(lifestyleTypeSelected);
      var deliveryKeys2 = lifestyleDeliveryBy ? [lifestyleDeliveryBy] : [];
      var styles = 0;
      if (brandKeys2.length === 0 && typeKeys.length === 0 && deliveryKeys2.length === 0) {
        styles = totalStyles;
      } else {
        // Option B: scale style counts by how many stores remain per brand after Delivery By filter.
        // This avoids the "if 1 store exists, count all styles" issue.
        var userLoc2 = getUserLatLng();
        var stores2 = window.WAREHOUSE_STORES || [];
        var canScaleByStores =
          deliveryKeys2.length > 0 && userLoc2 && stores2.length && dist && dist.minKmByBrand;

        var totalStoresByBrand = {};
        var eligibleStoresByBrand = {};

        if (canScaleByStores) {
          for (var si2 = 0; si2 < stores2.length; si2++) {
            var st2 = stores2[si2];
            if (!st2 || !st2.brand) continue;
            var b2 = st2.brand;
            totalStoresByBrand[b2] = (totalStoresByBrand[b2] || 0) + 1;
            var km2 = haversineKm(userLoc2.lat, userLoc2.lng, Number(st2.lat), Number(st2.lng));
            if (storeKmMatchesAnyDeliveryFilter(km2, deliveryKeys2)) {
              eligibleStoresByBrand[b2] = (eligibleStoresByBrand[b2] || 0) + 1;
            }
          }
        }

        // Smoothing to avoid overly aggressive drops when store coverage is small.
        // Higher alpha => less aggressive drop (keeps styles higher with few eligible stores).
        var alpha = 2.6;
        function brandCoverageFactor(brand) {
          if (!canScaleByStores) return 1;
          var tot = totalStoresByBrand[brand] || 0;
          var elig = eligibleStoresByBrand[brand] || 0;
          if (tot <= 0) return 1; // best-effort fallback
          if (elig <= 0) return 0;
          var ratio = elig / tot;
          // 1 - (1 - ratio)^alpha
          return 1 - Math.pow(1 - ratio, alpha);
        }

        // If we can't compute store-based scaling (no lat/lng, etc.), keep the old best-effort
        // "brand has any eligible store" gating, so the stat still behaves reasonably.
        var minKmByBrand2 = dist && dist.minKmByBrand ? dist.minKmByBrand : null;

        for (var i = 0; i < rows.length; i++) {
          var r = rows[i];
          var okB = brandKeys2.length === 0 || !!lifestyleBrandSelected[r.brand];
          var okT = typeKeys.length === 0 || !!lifestyleTypeSelected[r.type];
          if (!okB || !okT) continue;

          var base = Number(r.count) || 0;
          if (deliveryKeys2.length === 0) {
            styles += base;
            continue;
          }

          if (canScaleByStores) {
            styles += base * brandCoverageFactor(r.brand);
          } else {
            var okD2 = true;
            if (!minKmByBrand2) {
              okD2 = true;
            } else {
              var mk2 = minKmByBrand2[r.brand];
              if (mk2 == null) okD2 = true;
              else okD2 = minKmMatchesAnyDeliveryFilter(mk2, deliveryKeys2);
            }
            if (okD2) styles += base;
          }
        }
      }
      styleCountEl.textContent = formatInt(Math.round(styles));
    }
  }

  function applySearchFilter() {
    if (gridLifestyle) {
      applyLifestyleFacets();
      return;
    }
    var q = (searchInput && searchInput.value ? searchInput.value : "").trim();
    var lower = q.toLowerCase();
    if (searchClear) searchClear.hidden = !q;
    if (searchResultsTitle) {
      if (q) {
        searchResultsTitle.hidden = false;
        searchResultsTitle.textContent = 'Showing results for "' + q + '"';
      } else {
        searchResultsTitle.hidden = true;
      }
    }
    getVisibleProductCards().forEach(function (card) {
      var name = (card.getAttribute("data-name") || "").toLowerCase();
      var matchSearch = !lower || name.indexOf(lower) !== -1;
      card.style.display = matchSearch ? "" : "none";
    });
  }

  if (lifestyleFiltersRoot) {
    // Ensure multi-select panels reflect initial "All" state.
    syncMultiSelectPanel(document.getElementById("lifestylePanelBrand"), "data-brand-filter", lifestyleBrandSelected);
    syncMultiSelectPanel(document.getElementById("lifestylePanelType"), "data-type-filter", lifestyleTypeSelected);
    markActiveInPanel(
      document.getElementById("lifestylePanelDeliveryBy"),
      "data-delivery-by",
      lifestyleDeliveryBy ? lifestyleDeliveryBy : "all"
    );
    updateLifestyleFilterPillStates();
    updateLifestyleStats();

    initLifestylePanelSearch("lifestyleSearchBrand", "lifestylePanelBrand");
    initLifestylePanelSearch("lifestyleSearchType", "lifestylePanelType");

    lifestyleFiltersRoot.addEventListener("click", function (e) {
      var clearBtn = e.target && e.target.closest && e.target.closest("#lifestyleClearFilters");
      if (clearBtn) {
        e.preventDefault();
        closeAllLifestyleDropdowns();
        resetLifestyleFilters();
        updateLifestyleStats();
        applySearchFilter();
        return;
      }

      var opt = e.target.closest(".lifestyle-filter-option");
      if (opt) {
        e.preventDefault();
        var panel = opt.closest(".lifestyle-filter-panel");
        var shouldClose = false;
        if (opt.hasAttribute("data-sort-value")) {
          var sv = opt.getAttribute("data-sort-value") || "relevance";
          if (lifestyleSortEl) lifestyleSortEl.value = sv;
          markActiveInPanel(panel, "data-sort-value", sv);
          shouldClose = true;
        } else if (opt.hasAttribute("data-brand-filter")) {
          var bv = opt.getAttribute("data-brand-filter") || "";
          if (bv === "all") {
            lifestyleBrandSelected = {};
          } else {
            if (lifestyleBrandSelected[bv]) delete lifestyleBrandSelected[bv];
            else lifestyleBrandSelected[bv] = true;
          }
          syncMultiSelectPanel(panel, "data-brand-filter", lifestyleBrandSelected);
        } else if (opt.hasAttribute("data-type-filter")) {
          var tv = opt.getAttribute("data-type-filter") || "";
          if (tv === "all") {
            lifestyleTypeSelected = {};
          } else {
            if (lifestyleTypeSelected[tv]) delete lifestyleTypeSelected[tv];
            else lifestyleTypeSelected[tv] = true;
          }
          syncMultiSelectPanel(panel, "data-type-filter", lifestyleTypeSelected);
        } else if (opt.hasAttribute("data-delivery-by")) {
          var dv = opt.getAttribute("data-delivery-by") || "";
          lifestyleDeliveryBy = dv === "all" ? "" : dv;
          window.lifestyleDeliveryBy = lifestyleDeliveryBy;
          markActiveInPanel(panel, "data-delivery-by", dv === "all" ? "all" : dv);
          shouldClose = true;
        }
        updateLifestyleFilterPillStates();
        updateLifestyleStats();
        applySearchFilter();
        if (shouldClose) closeAllLifestyleDropdowns();
        return;
      }

      var trigger = e.target.closest('[id^="lifestyleTrigger"]');
      if (trigger) {
        e.stopPropagation();
        var dd = trigger.closest(".lifestyle-filter-dd");
        var p = dd ? dd.querySelector(".lifestyle-filter-panel") : null;
        if (!p) return;
        var wasOpen = !p.hidden;
        closeAllLifestyleDropdowns();
        if (!wasOpen) {
          p.hidden = false;
          trigger.setAttribute("aria-expanded", "true");
          positionLifestylePanel(trigger, p);
          var searchInput = p.querySelector(".lifestyle-filter-search__input");
          if (searchInput) {
            searchInput.focus();
            filterLifestylePanelOptions(p, searchInput.value);
          }
        }
      }
    });

    // Close open dropdown when clicking anywhere outside the active dropdown (even within the bar).
    document.addEventListener(
      "click",
      function (e) {
        if (!lifestyleFiltersRoot) return;
        var openTrigger = lifestyleFiltersRoot.querySelector('[id^="lifestyleTrigger"][aria-expanded="true"]');
        if (!openTrigger) return;
        var openDd = openTrigger.closest(".lifestyle-filter-dd");
        if (openDd && openDd.contains(e.target)) return;
        closeAllLifestyleDropdowns();
      },
      true
    );

    document.addEventListener("click", function (e) {
      if (!lifestyleFiltersRoot || lifestyleFiltersRoot.contains(e.target)) return;
      closeAllLifestyleDropdowns();
    });
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!lifestyleFiltersRoot) return;
      var openTrigger = lifestyleFiltersRoot.querySelector('[id^="lifestyleTrigger"][aria-expanded="true"]');
      if (!openTrigger) return;
      var dd = openTrigger.closest(".lifestyle-filter-dd");
      var p = dd ? dd.querySelector(".lifestyle-filter-panel") : null;
      if (!p || p.hidden) return;
      positionLifestylePanel(openTrigger, p);
    },
    { passive: true }
  );
  if (lifestyleSortEl) {
    lifestyleSortEl.addEventListener("change", function () {
      var v = lifestyleSortEl.value;
      markActiveInPanel(document.getElementById("lifestylePanelSort"), "data-sort-value", v);
      updateLifestyleFilterPillStates();
      updateLifestyleStats();
      applySearchFilter();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", applySearchFilter);
  }
  if (searchClear) {
    searchClear.addEventListener("click", function () {
      if (searchInput) searchInput.value = "";
      applySearchFilter();
      searchInput && searchInput.focus();
    });
  }

  function renderCartDrawer() {
    var keys = Object.keys(cart);
    var sub = cartSubtotalAmount();
    var has = keys.length > 0;
    var mrpTot = cartMrpTotal();
    var saved = cartSavedAmount();

    if (cartEmpty) cartEmpty.hidden = has;
    if (cartHasItems) cartHasItems.hidden = !has;
    if (cartList) {
      cartList.innerHTML = "";
    }
    if (cartFooter) cartFooter.hidden = !has;

    if (cartShipmentCount) {
      var c = cartItemCount();
      cartShipmentCount.textContent = "Shipment of " + c + " item" + (c === 1 ? "" : "s");
    }

    keys.forEach(function (key) {
      var it = cart[key];
      var li = document.createElement("li");
      li.className = "cart-line";
      li.setAttribute("data-line-key", key);

      var thumb = document.createElement("div");
      thumb.className = "cart-line__thumb";
      if (it.imgUrl) {
        var timg = document.createElement("img");
        timg.src = it.imgUrl;
        timg.alt = "";
        timg.loading = "lazy";
        thumb.appendChild(timg);
      } else {
        thumb.style.setProperty("--thumb-hue", String(hueFromId(it.id || key)));
      }

      var body = document.createElement("div");
      body.className = "cart-line__body";

      var nameEl = document.createElement("p");
      nameEl.className = "cart-line__name";
      nameEl.textContent = it.name;
      body.appendChild(nameEl);

      if (it.size) {
        var meta = document.createElement("p");
        meta.className = "cart-line__meta";
        meta.textContent = "Size: " + it.size;
        body.appendChild(meta);
      }

      if (it.id && typeof window.omuniGetCartLineEtaLabel === "function") {
        var etaLbl = window.omuniGetCartLineEtaLabel(it.id);
        if (etaLbl) {
          var etaP = document.createElement("p");
          etaP.className = "cart-line__eta";
          etaP.textContent = "ETA " + etaLbl;
          body.appendChild(etaP);
        }
      }

      var row = document.createElement("div");
      row.className = "cart-line__row";

      var pw = document.createElement("div");
      pw.className = "cart-line__price-wrap";
      var pr = document.createElement("span");
      pr.className = "cart-line__price";
      pr.textContent = formatRupee(it.price * it.qty);
      pw.appendChild(pr);
      if (it.mrp != null) {
        var mrpEl = document.createElement("span");
        mrpEl.className = "cart-line__mrp";
        mrpEl.textContent = formatRupee(it.mrp * it.qty);
        pw.appendChild(mrpEl);
      }

      var stepper = document.createElement("div");
      stepper.className = "qty-stepper";
      stepper.innerHTML =
        '<button type="button" class="qty-stepper__btn" data-delta="-1" aria-label="Decrease">−</button>' +
        '<span class="qty-stepper__val">' +
        it.qty +
        "</span>" +
        '<button type="button" class="qty-stepper__btn" data-delta="1" aria-label="Increase">+</button>';

      stepper.querySelectorAll("[data-delta]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var d = parseInt(btn.getAttribute("data-delta"), 10);
          updateLineQty(key, d);
        });
      });

      row.appendChild(pw);
      row.appendChild(stepper);
      body.appendChild(row);
      li.appendChild(thumb);
      li.appendChild(body);
      if (cartList) cartList.appendChild(li);
    });

    if (cartItemsPayable) cartItemsPayable.textContent = formatRupee(sub);
    if (cartItemsMrpLine) {
      if (mrpTot > 0 && saved > 0) {
        cartItemsMrpLine.hidden = false;
        cartItemsMrpLine.textContent = formatRupee(mrpTot);
      } else {
        cartItemsMrpLine.hidden = true;
      }
    }
    if (cartSavedBadge && cartSavedAmt) {
      if (saved > 0) {
        cartSavedBadge.hidden = false;
        cartSavedAmt.textContent = formatRupee(saved);
      } else {
        cartSavedBadge.hidden = true;
      }
    }
    if (cartDeliveryLine) cartDeliveryLine.textContent = has ? formatRupee(FEES.delivery) : "—";
    if (cartHandlingLine) cartHandlingLine.textContent = has ? formatRupee(FEES.handling) : "—";
    if (cartSurgeLine) cartSurgeLine.textContent = has ? formatRupee(FEES.surge) : "—";
    var grand = has ? grandCartTotal() : 0;
    if (cartGrandLine) cartGrandLine.textContent = formatRupee(grand);
    if (cartStickyTotal) cartStickyTotal.textContent = formatRupee(grand);
    updateHeaderCart();
    try {
      document.dispatchEvent(new CustomEvent("blinkit:cart-updated"));
    } catch (e) {}
  }

  function updateLineQty(key, delta) {
    if (!cart[key]) return;
    cart[key].qty += delta;
    if (cart[key].qty <= 0) delete cart[key];
    renderCartDrawer();
    document.querySelectorAll(".product-card").forEach(syncCardActions);
  }

  function addOrIncrement(card) {
    if (card.classList.contains("product-card--out-of-stock")) return;
    var key = getLineKey(card);
    if (!key) return;
    var price = parseFloat(card.getAttribute("data-price"));
    if (isNaN(price)) return;
    var name = getDisplayName(card);
    var sel = card.querySelector("[data-size-select]");
    var size = sel ? sel.value : "";
    var mrp = getMrpFromCard(card);

    if (!cart[key]) {
      cart[key] = {
        id: card.getAttribute("data-id"),
        name: name,
        price: price,
        qty: 0,
        size: size || "",
        mrp: mrp,
        imgUrl: getProductImg(card),
      };
    }
    cart[key].name = name;
    cart[key].price = price;
    cart[key].mrp = mrp;
    cart[key].imgUrl = getProductImg(card);
    cart[key].qty += 1;
    renderCartDrawer();
    syncCardActions(card);
  }

  function getQtyForCard(card) {
    var key = getLineKey(card);
    return cart[key] ? cart[key].qty : 0;
  }

  function syncCardActions(card) {
    var root = card.querySelector("[data-action-root]");
    if (!root) return;
    var sel = card.querySelector("[data-size-select]");
    if (sel) sel.disabled = card.classList.contains("product-card--out-of-stock");
    var qty = getQtyForCard(card);
    root.innerHTML = "";

    if (card.classList.contains("product-card--out-of-stock")) {
      var oos = document.createElement("button");
      oos.type = "button";
      oos.className = "add-btn add-btn--oos";
      oos.disabled = true;
      oos.textContent = "OUT OF STOCK";
      root.appendChild(oos);
      return;
    }

    if (qty <= 0) {
      var add = document.createElement("button");
      add.type = "button";
      add.className = "add-btn";
      add.textContent = "ADD";
      add.addEventListener("click", function () {
        addOrIncrement(card);
      });
      root.appendChild(add);
      return;
    }

    var stepper = document.createElement("div");
    stepper.className = "qty-stepper";
    stepper.innerHTML =
      '<button type="button" class="qty-stepper__btn" data-delta="-1" aria-label="Decrease">−</button>' +
      '<span class="qty-stepper__val">' +
      qty +
      "</span>" +
      '<button type="button" class="qty-stepper__btn" data-delta="1" aria-label="Increase">+</button>';

    stepper.querySelectorAll("[data-delta]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var d = parseInt(btn.getAttribute("data-delta"), 10);
        var k = getLineKey(card);
        if (!cart[k]) return;
        updateLineQty(k, d);
      });
    });
    root.appendChild(stepper);
  }

  function initProductCards() {
    document.querySelectorAll(".product-card").forEach(function (card) {
      if (card.dataset.blinkitCardInited === "1") return;
      card.dataset.blinkitCardInited = "1";
      var sel = card.querySelector("[data-size-select]");
      if (sel) {
        sel.dataset._lastKey = getLineKey(card);
        sel.addEventListener("change", function () {
          var oldKey = sel.dataset._lastKey;
          var newKey = getLineKey(card);
          if (oldKey && oldKey !== newKey && cart[oldKey]) {
            if (!cart[newKey]) {
              cart[newKey] = cart[oldKey];
              cart[newKey].name = getDisplayName(card);
              cart[newKey].size = sel.value;
              cart[newKey].mrp = getMrpFromCard(card);
              cart[newKey].imgUrl = getProductImg(card);
            } else {
              cart[newKey].qty += cart[oldKey].qty;
              cart[newKey].name = getDisplayName(card);
              cart[newKey].size = sel.value;
              cart[newKey].mrp = getMrpFromCard(card);
              cart[newKey].imgUrl = getProductImg(card);
            }
            delete cart[oldKey];
          }
          sel.dataset._lastKey = newKey;
          renderCartDrawer();
          syncCardActions(card);
        });
      }
      syncCardActions(card);
    });
  }

  window.initProductCards = initProductCards;

  function setActiveCategory(cat) {
    if (!categoryStrip) return;
    categoryStrip.querySelectorAll("button.cat-tile").forEach(function (btn) {
      var is = btn.getAttribute("data-category") === cat;
      btn.classList.toggle("cat-tile--active", is);
      btn.setAttribute("aria-selected", is ? "true" : "false");
    });
    if (productsTitle) {
      productsTitle.textContent = CATEGORY_TITLES[cat] || CATEGORY_TITLES.all;
    }
    if (gridDefault && gridApparel) {
      if (cat === "apparel") {
        gridApparel.hidden = false;
        gridDefault.hidden = true;
      } else {
        gridApparel.hidden = true;
        gridDefault.hidden = false;
      }
    }
    applySearchFilter();
  }

  if (categoryStrip) {
    categoryStrip.querySelectorAll("button.cat-tile").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cat = btn.getAttribute("data-category") || "all";
        setActiveCategory(cat);
      });
    });
  }

  function openCart() {
    if (!cartDrawer) return;
    closeHeaderMenu();
    cartDrawer.hidden = false;
    cartDrawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("cart-open");
    if (cartToggle) cartToggle.setAttribute("aria-expanded", "true");
    if (cartToggleMobile) cartToggleMobile.setAttribute("aria-expanded", "true");
  }

  function closeCart() {
    if (!cartDrawer) return;
    cartDrawer.hidden = true;
    cartDrawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("cart-open");
    if (cartToggle) cartToggle.setAttribute("aria-expanded", "false");
    if (cartToggleMobile) cartToggleMobile.setAttribute("aria-expanded", "false");
  }

  if (cartToggle) cartToggle.addEventListener("click", openCart);
  if (cartToggleMobile) cartToggleMobile.addEventListener("click", openCart);
  if (cartBackdrop) cartBackdrop.addEventListener("click", closeCart);
  if (cartClose) cartClose.addEventListener("click", closeCart);

  function computeCheckoutTotal() {
    var base = grandCartTotal();
    var donation = donationCheck && donationCheck.checked ? 1 : 0;
    return base + selectedTip + donation;
  }

  function syncTipUI() {
    if (!tipRow) return;
    tipRow.querySelectorAll(".tip-btn").forEach(function (b) {
      var t = parseInt(b.getAttribute("data-tip"), 10);
      b.classList.toggle("tip-btn--active", t === selectedTip);
    });
  }

  if (tipRow) {
    tipRow.addEventListener("click", function (e) {
      var btn = e.target.closest(".tip-btn");
      if (!btn) return;
      selectedTip = parseInt(btn.getAttribute("data-tip"), 10) || 0;
      syncTipUI();
      if (checkoutStickyTotal) checkoutStickyTotal.textContent = formatRupee(computeCheckoutTotal());
    });
  }

  if (donationCheck) {
    donationCheck.addEventListener("change", function () {
      if (checkoutStickyTotal) checkoutStickyTotal.textContent = formatRupee(computeCheckoutTotal());
    });
  }

  function applyCheckoutAddressMode() {
    if (!checkoutAddressFields) return;
    var useSaved = CHECKOUT_USE_SAVED_ADDRESS;
    checkoutAddressFields.hidden = useSaved;
    checkoutAddressFields.querySelectorAll("input").forEach(function (inp) {
      inp.disabled = useSaved;
    });
    if (checkoutSavedAddressBlock) checkoutSavedAddressBlock.hidden = !useSaved;
    if (checkoutPaymentBlock) checkoutPaymentBlock.hidden = !useSaved;
    if (checkoutPaymentHint) checkoutPaymentHint.hidden = !useSaved;
  }

  function openCheckout() {
    if (cartItemCount() === 0) return;
    closeCart();
    selectedTip = 0;
    syncTipUI();
    if (donationCheck) donationCheck.checked = false;
    if (!checkoutModal || !checkoutForm) return;
    var lines = [];
    Object.keys(cart).forEach(function (k) {
      var it = cart[k];
      lines.push(
        escapeHtml(it.name) +
          " × " +
          it.qty +
          " — " +
          formatRupee(it.price * it.qty)
      );
    });
    if (checkoutOrderSummary) {
      checkoutOrderSummary.innerHTML =
        "<strong>Bill</strong><ul><li>" +
        lines.join("</li><li>") +
        "</li></ul><p>Includes delivery &amp; surcharges as in cart.</p>";
    }
    checkoutForm.reset();
    if (donationCheck) donationCheck.checked = false;
    if (checkoutMainBlock) checkoutMainBlock.hidden = false;
    checkoutForm.hidden = false;
    if (checkoutSuccess) checkoutSuccess.hidden = true;
    if (checkoutTitle) checkoutTitle.textContent = "Checkout";
    if (checkoutSticky) checkoutSticky.hidden = false;
    if (checkoutStickyTotal) checkoutStickyTotal.textContent = formatRupee(computeCheckoutTotal());
    applyCheckoutAddressMode();
    checkoutModal.hidden = false;
    document.body.classList.add("checkout-open");
  }

  function closeCheckout() {
    if (!checkoutModal) return;
    checkoutModal.hidden = true;
    document.body.classList.remove("checkout-open");
  }

  function escapeHtml(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  if (checkoutBtn) checkoutBtn.addEventListener("click", openCheckout);
  if (checkoutBackdrop) checkoutBackdrop.addEventListener("click", closeCheckout);
  if (cartChangeAddress) {
    cartChangeAddress.addEventListener("click", function () {
      closeCart();
      openLocation();
    });
  }

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (cartItemCount() === 0) return;
      if (checkoutMainBlock) checkoutMainBlock.hidden = true;
      checkoutForm.hidden = true;
      if (checkoutSuccess) checkoutSuccess.hidden = false;
      if (checkoutTitle) checkoutTitle.textContent = "Order placed";
      if (checkoutSticky) checkoutSticky.hidden = true;
      if (typeof BlinkitOmuniSync !== "undefined" && BlinkitOmuniSync.recordOrder) {
        BlinkitOmuniSync.recordOrder(cart, computeCheckoutTotal());
      }
      cart = {};
      renderCartDrawer();
      document.querySelectorAll(".product-card").forEach(syncCardActions);
    });
  }

  if (checkoutDone) {
    checkoutDone.addEventListener("click", function () {
      closeCheckout();
      if (checkoutMainBlock) checkoutMainBlock.hidden = false;
      if (checkoutForm) checkoutForm.hidden = false;
      if (checkoutSuccess) checkoutSuccess.hidden = true;
      if (checkoutSticky) checkoutSticky.hidden = false;
      applyCheckoutAddressMode();
    });
  }

  function openLocation() {
    if (!locationModal) return;
    closeHeaderMenu();
    locationModal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeLocation() {
    if (!locationModal) return;
    locationModal.hidden = true;
    document.body.style.overflow = "";
  }

  function safeJsonParse(s) {
    try {
      return JSON.parse(s);
    } catch (e) {
      return null;
    }
  }

  function setSavedLocation(loc) {
    try {
      localStorage.setItem("blinkit_location", JSON.stringify(loc));
    } catch (e) {
      // ignore
    }
  }

  function getSavedLocation() {
    try {
      return safeJsonParse(localStorage.getItem("blinkit_location") || "");
    } catch (e) {
      return null;
    }
  }

  function formatLocationLine(loc) {
    if (!loc || !loc.pincode) return "";
    var pin = String(loc.pincode || "").trim();
    var place = String(loc.place || "").trim();
    var city = String(loc.city || "").trim();
    var left = place && city && place.toLowerCase() !== city.toLowerCase() ? place + ", " + city : place || city;
    left = left || "Delivery area";
    return left + " • " + pin;
  }

  function renderHeaderLocation() {
    if (!locationAddressLine) return;
    var loc = getSavedLocation();
    var line = formatLocationLine(loc);
    if (!line) {
      locationAddressLine.childNodes[0].nodeValue = "Set delivery location ";
      if (locationDeliveryLine) locationDeliveryLine.textContent = "Deliver to";
      var hint = document.getElementById("lifestyleOnboardingHint");
      if (hint) hint.hidden = false;
      return;
    }
    // keep the chevron svg at end; replace only leading text node
    locationAddressLine.childNodes[0].nodeValue = line + " ";
    if (locationDeliveryLine) locationDeliveryLine.textContent = "Deliver to";
    var hint2 = document.getElementById("lifestyleOnboardingHint");
    if (hint2) hint2.hidden = true;
  }

  async function reverseGeocode(lat, lng) {
    // Nominatim reverse geocoding (best-effort)
    var url =
      "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" +
      encodeURIComponent(lat) +
      "&lon=" +
      encodeURIComponent(lng);
    var res = await fetch(url, { headers: { "Accept-Language": "en" } });
    if (!res.ok) throw new Error("reverse geocode failed");
    var data = await res.json();
    var addr = data && data.address ? data.address : {};
    var pincode = (addr.postcode || "").trim();
    var place =
      (addr.suburb || addr.neighbourhood || addr.city_district || addr.county || addr.town || addr.village || "").trim();
    var city = (addr.city || addr.town || addr.village || addr.state_district || "").trim();
    return { pincode: pincode, place: place, city: city };
  }

  async function lookupPincode(pin) {
    var p = String(pin || "").trim();
    // India Post API (best-effort)
    var res = await fetch("https://api.postalpincode.in/pincode/" + encodeURIComponent(p));
    if (!res.ok) throw new Error("pincode lookup failed");
    var arr = await res.json();
    var first = Array.isArray(arr) && arr[0] ? arr[0] : null;
    if (!first || first.Status !== "Success" || !Array.isArray(first.PostOffice) || !first.PostOffice[0]) {
      throw new Error("invalid pincode");
    }
    var po = first.PostOffice[0];
    var place = String(po.Name || "").trim();
    var city = String(po.District || po.Region || "").trim();
    return { pincode: p, place: place, city: city };
  }

  async function geocodePincodeLatLng(pin) {
    var p = String(pin || "").trim();
    // Prefer local mapping when available (instant, no network).
    if (p && window.PINCODE_LAT_LNG) {
      var pair = window.PINCODE_LAT_LNG[p];
      if (!pair && p.indexOf(".") === -1) pair = window.PINCODE_LAT_LNG[p + ".0"];
      if (!pair && p.endsWith(".0")) pair = window.PINCODE_LAT_LNG[p.replace(/\.0$/, "")];
      if (pair) return { lat: Number(pair[0]), lng: Number(pair[1]) };
    }
    // Best-effort: forward geocode pincode via Nominatim.
    var url =
      "https://nominatim.openstreetmap.org/search?format=jsonv2&countrycodes=in&limit=1&q=" + encodeURIComponent(p);
    var res = await fetch(url, { headers: { "Accept-Language": "en" } });
    if (!res.ok) throw new Error("pincode geocode failed");
    var arr = await res.json();
    var first = Array.isArray(arr) && arr[0] ? arr[0] : null;
    if (!first || first.lat == null || first.lon == null) throw new Error("pincode geocode empty");
    return { lat: Number(first.lat), lng: Number(first.lon) };
  }

  if (locationBtn && locationModal) {
    locationBtn.addEventListener("click", openLocation);
    locationModal.querySelectorAll("[data-close]").forEach(function (el) {
      el.addEventListener("click", closeLocation);
    });
    var detectBtn = document.getElementById("locDetectBtn");
    var pinForm = document.getElementById("locPincodeForm");
    var pinInput = document.getElementById("locPincodeInput");
    var pinSubmit = document.getElementById("locPincodeSubmit");
    var hint = document.getElementById("locModalHint");

    function setHint(msg) {
      if (!hint) return;
      hint.textContent = msg;
    }

    if (detectBtn) {
      detectBtn.addEventListener("click", function () {
        if (!navigator.geolocation) {
          setHint("Geolocation is not supported in this browser. Please enter pincode.");
          return;
        }
        detectBtn.disabled = true;
        setHint("Detecting your location…");
        navigator.geolocation.getCurrentPosition(
          async function (pos) {
            try {
              var lat = pos.coords.latitude;
              var lng = pos.coords.longitude;
              var r = await reverseGeocode(lat, lng);
              if (!r.pincode) {
                setHint("Couldn’t auto-detect pincode. Please enter your pincode.");
                return;
              }
              setSavedLocation({ method: "geo", lat: lat, lng: lng, pincode: r.pincode, place: r.place, city: r.city });
              renderHeaderLocation();
              if (gridLifestyle) {
                updateLifestyleStats();
                applyLifestyleFacets();
              }
              closeLocation();
            } catch (e) {
              setHint("Couldn’t detect location. Please enter your pincode.");
            } finally {
              detectBtn.disabled = false;
            }
          },
          function () {
            detectBtn.disabled = false;
            setHint("Location permission denied. Please enter your pincode.");
          },
          { enableHighAccuracy: false, timeout: 12000, maximumAge: 600000 }
        );
      });
    }

    if (pinForm && pinInput) {
      pinForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        var pin = String(pinInput.value || "").replace(/\D/g, "").slice(0, 6);
        pinInput.value = pin;
        if (pin.length !== 6) {
          setHint("Please enter a valid 6-digit pincode.");
          return;
        }
        if (pinSubmit) pinSubmit.disabled = true;
        setHint("Fetching area details…");
        try {
          var r = await lookupPincode(pin);
          // Also try to resolve lat/lng so Delivery By works even when PINCODE_LAT_LNG doesn't include this pin.
          var latlng = null;
          try {
            latlng = await geocodePincodeLatLng(r.pincode);
          } catch (e2) {
            latlng = null;
          }
          var toSave = { method: "pincode", pincode: r.pincode, place: r.place, city: r.city };
          if (latlng && typeof latlng.lat === "number" && typeof latlng.lng === "number") {
            toSave.lat = latlng.lat;
            toSave.lng = latlng.lng;
          }
          setSavedLocation(toSave);
          renderHeaderLocation();
          if (gridLifestyle) {
            updateLifestyleStats();
            applyLifestyleFacets();
          }
          closeLocation();
        } catch (err) {
          setHint("Couldn’t find this pincode. Please try another one.");
        } finally {
          if (pinSubmit) pinSubmit.disabled = false;
        }
      });
    }
  }

  // First-time visitors: prompt for location immediately.
  // If a saved location (pincode/lat/lng) already exists, do nothing.
  (function autoPromptLocationOnce() {
    if (!locationModal) return;
    var loc = getSavedLocation();
    if (loc && loc.pincode) return;
    var key = "blinkit_location_prompted_v1";
    try {
      if (localStorage.getItem(key) === "true") return;
      localStorage.setItem(key, "true");
    } catch (e) {
      // If storage is blocked, still avoid being too aggressive: only prompt once per page load.
      if (window.__blinkitLocationPrompted) return;
      window.__blinkitLocationPrompted = true;
    }

    // Open modal and trigger geolocation permission prompt (best-effort).
    openLocation();
    var detectBtn = document.getElementById("locDetectBtn");
    if (detectBtn && !detectBtn.disabled) {
      setTimeout(function () {
        try {
          detectBtn.click();
        } catch (e2) {}
      }, 250);
    }
  })();

  renderHeaderLocation();

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (document.body.classList.contains("header--menu-open")) {
      closeHeaderMenu();
      return;
    }
    if (navAccountWrap && navAccountWrap.classList.contains("nav-account-wrap--open")) {
      closeAccountDropdown();
      return;
    }
    if (
      lifestyleFiltersRoot &&
      lifestyleFiltersRoot.querySelector(".lifestyle-filter-panel:not([hidden])")
    ) {
      closeAllLifestyleDropdowns();
      return;
    }
    if (omuniBenefitsSlide && !omuniBenefitsSlide.hidden && omuniBenefitsSlide.classList.contains("omuni-benefits--open")) {
      closeOmuniBenefits();
      return;
    }
    if (checkoutModal && !checkoutModal.hidden) {
      closeCheckout();
      return;
    }
    if (cartDrawer && !cartDrawer.hidden) {
      closeCart();
      return;
    }
    if (locationModal && !locationModal.hidden) closeLocation();
  });

  document.addEventListener("omuni:state-changed", function () {
    renderCartDrawer();
    document.querySelectorAll(".product-card").forEach(syncCardActions);
    if (gridLifestyle) {
      updateLifestyleStats();
      applyLifestyleFacets();
    }
  });

  initProductCards();
  renderCartDrawer();
  setActiveCategory("all");
  applySearchFilter();
})();
