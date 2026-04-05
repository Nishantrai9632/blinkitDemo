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
  var lifestyleBrandFilter = "all";
  var lifestyleGenderFilter = "all";
  var lifestyleSizeFilter = "all";
  var lifestyleTypeFilter = "all";

  var searchInput = document.getElementById("searchInput");
  var searchClear = document.getElementById("searchClear");
  var searchResultsTitle = document.getElementById("searchResultsTitle");

  var cartToggle = document.getElementById("cartToggle");
  var cartHeaderLine1 = document.getElementById("cartHeaderLine1");
  var cartHeaderLine2 = document.getElementById("cartHeaderLine2");
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

  var navAccountWrap = document.getElementById("navAccountWrap");
  var navAccountBtn = document.getElementById("navAccountBtn");
  var navAccountDropdown = document.getElementById("navAccountDropdown");

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
      p.hidden = true;
    });
    lifestyleFiltersRoot.querySelectorAll('[id^="lifestyleTrigger"]').forEach(function (t) {
      t.setAttribute("aria-expanded", "false");
    });
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

  function updateLifestyleFilterPillStates() {
    var sortT = document.getElementById("lifestyleTriggerSort");
    if (sortT) sortT.classList.toggle("lifestyle-filter-pill--dirty", !!(lifestyleSortEl && lifestyleSortEl.value !== "relevance"));
    var gT = document.getElementById("lifestyleTriggerGender");
    if (gT) gT.classList.toggle("lifestyle-filter-pill--dirty", lifestyleGenderFilter !== "all");
    var bT = document.getElementById("lifestyleTriggerBrand");
    if (bT) bT.classList.toggle("lifestyle-filter-pill--dirty", lifestyleBrandFilter !== "all");
    var sT = document.getElementById("lifestyleTriggerSize");
    if (sT) sT.classList.toggle("lifestyle-filter-pill--dirty", lifestyleSizeFilter !== "all");
    var tyT = document.getElementById("lifestyleTriggerType");
    if (tyT) tyT.classList.toggle("lifestyle-filter-pill--dirty", lifestyleTypeFilter !== "all");
  }

  function resetLifestyleFilters() {
    lifestyleGenderFilter = "all";
    lifestyleBrandFilter = "all";
    lifestyleSizeFilter = "all";
    lifestyleTypeFilter = "all";
    if (lifestyleSortEl) {
      lifestyleSortEl.value = "relevance";
    }
    markActiveInPanel(document.getElementById("lifestylePanelSort"), "data-sort-value", "relevance");
    markActiveInPanel(document.getElementById("lifestylePanelGender"), "data-gender-filter", "all");
    markActiveInPanel(document.getElementById("lifestylePanelBrand"), "data-brand-filter", "all");
    markActiveInPanel(document.getElementById("lifestylePanelSize"), "data-size-filter", "all");
    markActiveInPanel(document.getElementById("lifestylePanelType"), "data-type-filter", "all");
    updateLifestyleFilterPillStates();
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
    var cards = Array.prototype.slice.call(gridLifestyle.querySelectorAll(".product-card"));
    var match = [];
    var nomatch = [];
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var name = (card.getAttribute("data-name") || "").toLowerCase();
      var okSearch = !lower || name.indexOf(lower) !== -1;
      var b = card.getAttribute("data-brand") || "";
      var okBrand = lifestyleBrandFilter === "all" || b === lifestyleBrandFilter;
      var g = card.getAttribute("data-gender") || "";
      var okGender = lifestyleGenderFilter === "all" || g === lifestyleGenderFilter;
      var sz = card.getAttribute("data-size") || "";
      var okSize = lifestyleSizeFilter === "all" || sz === lifestyleSizeFilter;
      var ty = card.getAttribute("data-type") || "";
      var okType = lifestyleTypeFilter === "all" || ty === lifestyleTypeFilter;
      if (okSearch && okBrand && okGender && okSize && okType) {
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
    match.forEach(function (c) {
      c.style.display = "";
      gridLifestyle.appendChild(c);
    });
    nomatch.forEach(function (c) {
      c.style.display = "none";
      gridLifestyle.appendChild(c);
    });
  }

  window.applyLifestyleFacets = applyLifestyleFacets;

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
    lifestyleFiltersRoot.addEventListener("click", function (e) {
      var opt = e.target.closest(".lifestyle-filter-option");
      if (opt) {
        e.preventDefault();
        var panel = opt.closest(".lifestyle-filter-panel");
        if (opt.id === "lifestyleResetAllOption") {
          resetLifestyleFilters();
          closeAllLifestyleDropdowns();
          applySearchFilter();
          return;
        }
        if (opt.hasAttribute("data-sort-value")) {
          var sv = opt.getAttribute("data-sort-value") || "relevance";
          if (lifestyleSortEl) lifestyleSortEl.value = sv;
          markActiveInPanel(panel, "data-sort-value", sv);
        } else if (opt.hasAttribute("data-gender-filter")) {
          lifestyleGenderFilter = opt.getAttribute("data-gender-filter") || "all";
          markActiveInPanel(panel, "data-gender-filter", lifestyleGenderFilter);
        } else if (opt.hasAttribute("data-brand-filter")) {
          lifestyleBrandFilter = opt.getAttribute("data-brand-filter") || "all";
          markActiveInPanel(panel, "data-brand-filter", lifestyleBrandFilter);
        } else if (opt.hasAttribute("data-size-filter")) {
          lifestyleSizeFilter = opt.getAttribute("data-size-filter") || "all";
          markActiveInPanel(panel, "data-size-filter", lifestyleSizeFilter);
        } else if (opt.hasAttribute("data-type-filter")) {
          lifestyleTypeFilter = opt.getAttribute("data-type-filter") || "all";
          markActiveInPanel(panel, "data-type-filter", lifestyleTypeFilter);
        }
        updateLifestyleFilterPillStates();
        closeAllLifestyleDropdowns();
        applySearchFilter();
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
        }
      }
    });

    document.addEventListener("click", function (e) {
      if (!lifestyleFiltersRoot || lifestyleFiltersRoot.contains(e.target)) return;
      closeAllLifestyleDropdowns();
    });
  }
  if (lifestyleSortEl) {
    lifestyleSortEl.addEventListener("change", function () {
      var v = lifestyleSortEl.value;
      markActiveInPanel(document.getElementById("lifestylePanelSort"), "data-sort-value", v);
      updateLifestyleFilterPillStates();
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
    cartDrawer.hidden = false;
    cartDrawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("cart-open");
    if (cartToggle) cartToggle.setAttribute("aria-expanded", "true");
  }

  function closeCart() {
    if (!cartDrawer) return;
    cartDrawer.hidden = true;
    cartDrawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("cart-open");
    if (cartToggle) cartToggle.setAttribute("aria-expanded", "false");
  }

  if (cartToggle) cartToggle.addEventListener("click", openCart);
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
    locationModal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeLocation() {
    if (!locationModal) return;
    locationModal.hidden = true;
    document.body.style.overflow = "";
  }

  if (locationBtn && locationModal) {
    locationBtn.addEventListener("click", openLocation);
    locationModal.querySelectorAll("[data-close]").forEach(function (el) {
      el.addEventListener("click", closeLocation);
    });
    locationModal.querySelectorAll(".address-card__action").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
      });
    });
    locationModal.querySelectorAll(".address-card--blinkit[data-close]").forEach(function (card) {
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          closeLocation();
        }
      });
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
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
    if (gridLifestyle) applyLifestyleFacets();
  });

  initProductCards();
  renderCartDrawer();
  setActiveCategory("all");
  applySearchFilter();
})();
