/**
 * Omuni before/after toggle — updates copy, ETAs, metrics, and cart messaging without reload.
 */
(function () {
  var STORAGE_KEY = "omuni-enabled";

  var state = {
    isOmuniEnabled: false,
  };

  var COPY = {
    default: {
      locationLine: "Delivery in 19 minutes",
      heroTitle: "Stock up on daily essentials",
      heroSub:
        "Get farm-fresh goodness & a range of exotic fruits, vegetables, eggs & more.",
      fashionBanner:
        "Limited fashion availability · restocks can be slow outside core grocery.",
      productsNote:
        "Grocery ETAs reflect dark-store fulfilment. Fashion assortment is narrow on this lane.",
      apparelMeta: "Limited SKUs",
      promo1Title: "Pharmacy at your doorstep!",
      promo1Sub: "Cough syrups, pain relief sprays & more.",
      promo2Title: "Pet care supplies at your door",
      promo2Sub: "Food, treats, toys & more.",
      promo3Title: "No time for a diaper run?",
      promo3Sub: "Get baby care essentials.",
      fillHint: "Inventory sync every 24h",
      cancelHint: "Often stockouts & substitutions",
      visHint: "End-of-day updates",
      visLabel: "Batch",
      ops1:
        "Fulfilment: standard dark-store SLA. Fashion: limited brand depth & slower refresh.",
      ops2:
        "Inventory signals: batch updates · cancellations elevated on stockouts.",
    },
    omuni: {
      locationLine: "Delivery in 30 minutes",
      heroTitle: "Stock up on daily essentials",
      heroSub:
        "Fashion available in under 30 mins via 5000+ stores — Bata, XYXX & more. Groceries still in minutes.",
      fashionBanner:
        "Fashion available in under 30 mins via 5000+ stores & multiple brands — real-time inventory across the network.",
      productsNote:
        "Omuni: 5000+ stores, 50+ apparel brands — fashion in under 30 mins alongside your grocery basket.",
      apparelMeta: "5000+ stores · 50+ brands",
      promo1Title: "Pharmacy at your doorstep!",
      promo1Sub: "Same-day essentials with fewer stockouts on the Omuni lane.",
      promo2Title: "Fashion & lifestyle via Omuni",
      promo2Sub: "Bata, XYXX & more — under 30 min apparel delivery.",
      promo3Title: "No time for a diaper run?",
      promo3Sub: "Baby care + apparel add-ons in one trip.",
      fillHint: "POS-linked, network-wide fill",
      cancelHint: "Fewer stockouts & subs",
      visHint: "Store-level live feeds",
      visLabel: "Live",
      ops1:
        "Omuni: 95%+ fill rate · under 30 min apparel SLA from 5000+ partner stores.",
      ops2:
        "Real-time inventory visibility · cancellations down to ~3% vs baseline.",
    },
  };

  var METRICS = {
    default: { fill: 70, cancel: 12 },
    omuni: { fill: 96, cancel: 3 },
  };

  function $(id) {
    return document.getElementById(id);
  }

  function setText(id, text) {
    var el = $(id);
    if (el) el.textContent = text;
  }

  function parseMetric(el) {
    if (!el) return 0;
    var t = el.textContent.replace(/[^\d.]/g, "");
    var n = parseFloat(t);
    return isNaN(n) ? 0 : n;
  }

  function animateValue(el, from, to, suffix, durationMs, formatter) {
    if (!el) return;
    if (Math.abs(from - to) < 0.05) {
      el.textContent = formatter ? formatter(to) : Math.round(to) + (suffix || "");
      return;
    }
    var start = performance.now();
    suffix = suffix || "";
    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }
    function frame(now) {
      var u = Math.min(1, (now - start) / durationMs);
      var v = from + (to - from) * easeOutCubic(u);
      el.textContent = formatter ? formatter(v) : Math.round(v) + suffix;
      if (u < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function hashString(s) {
    var h = 5381;
    for (var i = 0; i < s.length; i++) {
      h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
  }

  /** Stable “random” per product: without Omuni 21–30 min; with Omuni 10–15 min. */
  function apparelMinutesForProduct(productId, omuniOn) {
    var h = hashString(String(productId) + (omuniOn ? "O" : "D"));
    if (omuniOn) {
      return 10 + (h % 6);
    }
    return 21 + (h % 10);
  }

  function formatMinsLabel(mins) {
    return mins + " MINS";
  }

  function applyProductEtas() {
    document.querySelectorAll(".product-card").forEach(function (card) {
      var eta = card.querySelector(".product-card__eta");
      if (!eta) return;
      var useOmuni = state.isOmuniEnabled;
      if (card.classList.contains("product-card--apparel")) {
        var pid = card.getAttribute("data-id") || "";
        var m = apparelMinutesForProduct(pid, useOmuni);
        eta.textContent = formatMinsLabel(m);
      } else if (card.hasAttribute("data-eta-default")) {
        var v = useOmuni
          ? card.getAttribute("data-eta-omuni")
          : card.getAttribute("data-eta-default");
        if (v) eta.textContent = v;
      }
      card.classList.toggle(
        "product-card--omuni-boost",
        useOmuni && card.classList.contains("product-card--apparel")
      );
    });
  }

  function applyMetricsAnimated() {
    var fillEl = $("metricFillValue");
    var cancelEl = $("metricCancelValue");
    var visEl = $("metricVisValue");
    var target = state.isOmuniEnabled ? METRICS.omuni : METRICS.default;

    if (fillEl) {
      var f0 = parseMetric(fillEl);
      animateValue(fillEl, f0, target.fill, "%", 550, function (v) {
        return Math.round(v) + "%";
      });
    }
    if (cancelEl) {
      var c0 = parseMetric(cancelEl);
      animateValue(cancelEl, c0, target.cancel, "%", 550, function (v) {
        return Math.round(v) + "%";
      });
    }
    if (visEl) {
      visEl.style.opacity = "0";
      setTimeout(function () {
        var c = state.isOmuniEnabled ? COPY.omuni : COPY.default;
        visEl.textContent = c.visLabel;
        visEl.style.opacity = "1";
      }, 160);
    }

    var c = state.isOmuniEnabled ? COPY.omuni : COPY.default;
    setText("metricFillHint", c.fillHint);
    setText("metricCancelHint", c.cancelHint);
    setText("metricVisHint", c.visHint);

    [ $("metricFillCard"), $("metricCancelCard"), $("metricVisCard") ].forEach(function (el) {
      if (el) el.classList.toggle("omuni-metric--glow", state.isOmuniEnabled);
    });
  }

  function applyCopy() {
    var c = state.isOmuniEnabled ? COPY.omuni : COPY.default;
    setText("locationDeliveryLine", c.locationLine);
    setText("heroBannerTitle", c.heroTitle);
    setText("heroBannerSub", c.heroSub);
    setText("fashionCatalogText", c.fashionBanner);
    setText("omuniSlideProductsNote", c.productsNote);
    setText("apparelTileMeta", c.apparelMeta);
    setText("promo1Title", c.promo1Title);
    setText("promo1Sub", c.promo1Sub);
    setText("promo2Title", c.promo2Title);
    setText("promo2Sub", c.promo2Sub);
    setText("promo3Title", c.promo3Title);
    setText("promo3Sub", c.promo3Sub);
    setText("omuniOpsLine1", c.ops1);
    setText("omuniOpsLine2", c.ops2);

    var banner = $("omuniSlideCatalog");
    if (banner) {
      banner.classList.toggle("fashion-catalog-banner--omuni", state.isOmuniEnabled);
    }
    var metrics = $("omuniSlideMetrics");
    if (metrics) {
      metrics.classList.toggle("omuni-metrics--omuni", state.isOmuniEnabled);
    }
    var hero = $("omuniSlideHero");
    if (hero) {
      hero.classList.toggle("hero-banner__copy--omuni", state.isOmuniEnabled);
    }
    var promo = $("omuniSlidePromo");
    if (promo) {
      promo.classList.toggle("promo-row--omuni", state.isOmuniEnabled);
    }
  }

  function minutesFromEtaLabel(label) {
    var m = String(label || "").match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  }

  /** Same rules as grocery product cards (data-eta-default / data-eta-omuni). */
  function groceryEtaLabelFromCard(productId) {
    var card = document.querySelector('.product-card[data-id="' + String(productId) + '"]');
    if (!card || !card.hasAttribute("data-eta-default")) return "8 MINS";
    if (state.isOmuniEnabled) {
      var om = card.getAttribute("data-eta-omuni");
      if (om) return om;
    }
    return card.getAttribute("data-eta-default") || "8 MINS";
  }

  /** Single source for cart row + headline ETAs (matches product cards). */
  function getCartLineEtaLabel(productId) {
    var id = String(productId || "");
    if (id.indexOf("a-") === 0) {
      return formatMinsLabel(apparelMinutesForProduct(id, state.isOmuniEnabled));
    }
    if (id.indexOf("g-") === 0) {
      return groceryEtaLabelFromCard(id);
    }
    return "";
  }

  function maxMinutesForCart(cart) {
    var maxM = 0;
    if (!cart) return 0;
    Object.keys(cart).forEach(function (key) {
      var it = cart[key];
      if (!it || !it.id) return;
      maxM = Math.max(maxM, minutesFromEtaLabel(getCartLineEtaLabel(it.id)));
    });
    return maxM;
  }

  function refreshCartDeliveryLine() {
    var el = $("cartDeliveryEta");
    if (!el) return;
    var cart =
      typeof window.blinkitGetCartForEta === "function" ? window.blinkitGetCartForEta() : null;
    var maxM = maxMinutesForCart(cart);
    if (maxM > 0) {
      el.textContent =
        "Delivery in " + maxM + " minute" + (maxM === 1 ? "" : "s");
      return;
    }
    var c = state.isOmuniEnabled ? COPY.omuni : COPY.default;
    el.textContent = c.locationLine;
  }

  function applyAll() {
    document.body.classList.toggle("omuni-on", state.isOmuniEnabled);
    var toggle = $("omuniToggle");
    if (toggle) toggle.checked = state.isOmuniEnabled;

    applyCopy();
    applyProductEtas();
    applyMetricsAnimated();
    refreshCartDeliveryLine();

    var wrap = $("omuniToggleWrap");
    if (wrap) {
      wrap.classList.toggle("omuni-toggle-wrap--on", state.isOmuniEnabled);
    }

    try {
      document.dispatchEvent(new CustomEvent("omuni:state-changed"));
    } catch (e) {}
  }

  function init() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "true") state.isOmuniEnabled = true;
      if (saved === "false") state.isOmuniEnabled = false;
    } catch (e) {}

    var toggle = $("omuniToggle");
    if (toggle) {
      toggle.addEventListener("change", function () {
        state.isOmuniEnabled = !!toggle.checked;
        try {
          localStorage.setItem(STORAGE_KEY, String(state.isOmuniEnabled));
        } catch (e) {}
        applyAll();
      });
    }

    document.addEventListener("blinkit:cart-updated", refreshCartDeliveryLine);

    applyAll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.omuniState = {
    isEnabled: function () {
      return state.isOmuniEnabled;
    },
    refresh: applyAll,
    /** ETA string e.g. "24 MINS" for cart rows — uses same rules as product cards. */
    getApparelEtaLabel: function (productId) {
      return formatMinsLabel(apparelMinutesForProduct(productId, state.isOmuniEnabled));
    },
  };

  window.omuniGetApparelEtaForProduct = function (productId) {
    return formatMinsLabel(apparelMinutesForProduct(productId, state.isOmuniEnabled));
  };

  /** Cart row ETA label — matches homepage product cards (grocery + apparel). */
  window.omuniGetCartLineEtaLabel = function (productId) {
    return getCartLineEtaLabel(productId);
  };
})();
