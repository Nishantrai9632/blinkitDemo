/**
 * Omuni before/after toggle — updates copy, ETAs, and cart messaging without reload.
 */
(function () {
  var STORAGE_KEY = "omuni-enabled";

  var state = {
    // Lifestyle requirement: Omuni is always ON (no user toggle).
    isOmuniEnabled: true,
  };

  var COPY = {
    default: {
      locationLine: "Delivery in 19 minutes",
      heroTitle: "Lifestyle & Apparel, delivered fast",
      heroSub: "Stock up on everyday styles, innerwear, activewear & accessories — right to your door.",
      productsNote:
        "Grocery ETAs reflect dark-store fulfilment. Fashion assortment is narrow on this lane.",
      apparelMeta: "Limited SKUs",
      promo1Title: "Pharmacy at your doorstep!",
      promo1Sub: "Cough syrups, pain relief sprays & more.",
      promo2Title: "Pet care supplies at your door",
      promo2Sub: "Food, treats, toys & more.",
      promo3Title: "No time for a diaper run?",
      promo3Sub: "Get baby care essentials.",
    },
    omuni: {
      locationLine: "Delivery in 30 minutes",
      heroTitle: "Lifestyle & Apparel, delivered in under 30 mins",
      heroSub: "Shop apparel delivered fast alongside your grocery basket.",
      productsNote:
        "Omuni: fashion in under 30 mins alongside your grocery basket.",
      apparelMeta: "",
      promo1Title: "Pharmacy at your doorstep!",
      promo1Sub: "Same-day essentials with fewer stockouts on the Omuni lane.",
      promo2Title: "Fashion & lifestyle via Omuni",
      promo2Sub: "Bata, XYXX & more — under 30 min apparel delivery.",
      promo3Title: "No time for a diaper run?",
      promo3Sub: "Baby care + apparel add-ons in one trip.",
    },
  };

  function $(id) {
    return document.getElementById(id);
  }

  function setText(id, text) {
    var el = $(id);
    if (el) el.textContent = text;
  }

  function hashString(s) {
    var h = 5381;
    for (var i = 0; i < s.length; i++) {
      h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
  }

  function isInLifestyleBaseline(id) {
    var ids = window.LIFESTYLE_BASELINE_IDS;
    if (!ids || !ids.length) return false;
    return ids.indexOf(String(id)) !== -1;
  }

  /** Brand slug from lv-{slug}-{nnn} (e.g. lv-jockey-001 → jockey). Fallback: full id. */
  function brandKeyFromApparelProductId(productId) {
    var parts = String(productId).split("-");
    if (parts.length >= 3 && parts[0] === "lv") {
      return parts.slice(1, -1).join("-");
    }
    return String(productId);
  }

  /**
   * Stable pseudo-random mix: id slug (brand lane) + full SKU + optional display brand + salt.
   * Cart path (no data-brand) still varies per product and per brand slug from the id.
   */
  function apparelEtaMix(productId, brandHint, salt) {
    var id = String(productId);
    var slug = brandKeyFromApparelProductId(id);
    var extra = "";
    if (brandHint && String(brandHint).trim()) {
      extra = String(brandHint).trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
    }
    return hashString(slug + "\n" + id + "\n" + extra + "\n" + salt);
  }

  /**
   * Apparel ETAs (lifestyle SKUs, data-id lv-… / a-…):
   * Uses brand + product id so each brand and SKU gets a distinct stable ETA.
   * Baseline allowlist: 10–20 min (unchanged when toggle turns on).
   * Toggle on + not baseline: 60–180 min (1–3 hr).
   * Toggle off + not baseline: 25–35 min.
   * @param {string} [brandFromDom] optional data-brand from card (stronger brand signal).
   */
  function apparelDeliveryMinutes(productId, brandFromDom) {
    var id = String(productId);
    var bHint = brandFromDom;
    if (isInLifestyleBaseline(id)) {
      return 10 + (apparelEtaMix(id, bHint, "BASE") % 11);
    }
    if (state.isOmuniEnabled) {
      return 60 + (apparelEtaMix(id, bHint, "OMUNI") % 121);
    }
    return 25 + (apparelEtaMix(id, bHint, "OFF") % 11);
  }

  /** Apparel SKUs that are only available when nearby-store inventory is on (OOS when toggle off). */
  var NEARBY_STOCK_APPAREL_IDS = ["lv-bata-1", "lv-tommy-1"];

  function formatMinsLabel(mins) {
    var m = Math.round(Number(mins) || 0);
    if (m >= 60) {
      var h = Math.floor(m / 60);
      var r = m % 60;
      if (r === 0) return h + " HR";
      return h + " HR " + r + " MINS";
    }
    return m + " MINS";
  }

  function applyProductEtas() {
    document.querySelectorAll(".product-card").forEach(function (card) {
      var eta = card.querySelector(".product-card__eta");
      if (!eta) return;
      var useOmuni = state.isOmuniEnabled;
      if (card.classList.contains("product-card--apparel")) {
        var pid = card.getAttribute("data-id") || "";
        var brand = card.getAttribute("data-brand") || "";
        var m = apparelDeliveryMinutes(pid, brand);
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

  function applyNearbyStockAvailability() {
    var gridLifestyle = document.getElementById("gridLifestyle");
    if (gridLifestyle && window.LIFESTYLE_BASELINE_IDS && window.LIFESTYLE_BASELINE_IDS.length) {
      var allow = {};
      window.LIFESTYLE_BASELINE_IDS.forEach(function (id) {
        allow[id] = true;
      });
      gridLifestyle.querySelectorAll(".product-card").forEach(function (card) {
        var id = card.getAttribute("data-id") || "";
        var oos = !state.isOmuniEnabled && !allow[id];
        card.classList.toggle("product-card--out-of-stock", oos);
      });
      if (!state.isOmuniEnabled && typeof window.blinkitRemoveCartLinesNotInAllowlist === "function") {
        window.blinkitRemoveCartLinesNotInAllowlist(window.LIFESTYLE_BASELINE_IDS);
      }
      return;
    }
    NEARBY_STOCK_APPAREL_IDS.forEach(function (id) {
      document.querySelectorAll('.product-card[data-id="' + id + '"]').forEach(function (card) {
        card.classList.toggle("product-card--out-of-stock", !state.isOmuniEnabled);
      });
    });
    if (!state.isOmuniEnabled && typeof window.blinkitRemoveLinesForProductIds === "function") {
      window.blinkitRemoveLinesForProductIds(NEARBY_STOCK_APPAREL_IDS);
    }
  }

  /** Previous nearby-stock toggle for lifestyle grid (avoid reshuffling every applyAll while on). */
  var lifestyleNearbyPrev = null;

  function sortLifestyleGridStockFirst(grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".product-card"));
    if (!cards.length) return;
    var inStock = [];
    var oos = [];
    for (var i = 0; i < cards.length; i++) {
      if (cards[i].classList.contains("product-card--out-of-stock")) oos.push(cards[i]);
      else inStock.push(cards[i]);
    }
    inStock.forEach(function (c) {
      grid.appendChild(c);
    });
    oos.forEach(function (c) {
      grid.appendChild(c);
    });
  }

  function shuffleLifestyleGrid(grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".product-card"));
    if (cards.length < 2) return;
    for (var i = cards.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = cards[i];
      cards[i] = cards[j];
      cards[j] = t;
    }
    cards.forEach(function (c) {
      grid.appendChild(c);
    });
  }

  /** In-stock grouped at top when toggle off; reshuffle when toggle turns on (all available). */
  function reorderLifestyleProductGrid() {
    var grid = document.getElementById("gridLifestyle");
    if (!grid || !window.LIFESTYLE_BASELINE_IDS || !window.LIFESTYLE_BASELINE_IDS.length) return;

    if (state.isOmuniEnabled) {
      if (lifestyleNearbyPrev !== true) {
        shuffleLifestyleGrid(grid);
      }
    } else {
      sortLifestyleGridStockFirst(grid);
    }
    lifestyleNearbyPrev = state.isOmuniEnabled;
  }

  function applyCopy() {
    var c = state.isOmuniEnabled ? COPY.omuni : COPY.default;
    setText("locationDeliveryLine", c.locationLine);
    setText("heroBannerTitle", c.heroTitle);
    setText("heroBannerSub", c.heroSub);
    setText("omuniSlideProductsNote", c.productsNote);
    setText("apparelTileMeta", c.apparelMeta);
    setText("promo1Title", c.promo1Title);
    setText("promo1Sub", c.promo1Sub);
    setText("promo2Title", c.promo2Title);
    setText("promo2Sub", c.promo2Sub);
    setText("promo3Title", c.promo3Title);
    setText("promo3Sub", c.promo3Sub);

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
    if (id.indexOf("a-") === 0 || id.indexOf("lv-") === 0) {
      return formatMinsLabel(apparelDeliveryMinutes(id, ""));
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
      if (maxM >= 60) {
        var ch = Math.floor(maxM / 60);
        var cr = maxM % 60;
        if (cr === 0) {
          el.textContent =
            "Delivery in " + ch + " hour" + (ch === 1 ? "" : "s");
        } else {
          el.textContent =
            "Delivery in " + ch + " hr " + cr + " min" + (cr === 1 ? "" : "s");
        }
      } else {
        el.textContent =
          "Delivery in " + maxM + " minute" + (maxM === 1 ? "" : "s");
      }
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
    applyNearbyStockAvailability();
    reorderLifestyleProductGrid();
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
    // Intentionally ignore persisted toggle state; Omuni stays ON.
    state.isOmuniEnabled = true;

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
      return formatMinsLabel(apparelDeliveryMinutes(productId, ""));
    },
  };

  window.omuniGetApparelEtaForProduct = function (productId) {
    return formatMinsLabel(apparelDeliveryMinutes(productId, ""));
  };

  /** Cart row ETA label — matches homepage product cards (grocery + apparel). */
  window.omuniGetCartLineEtaLabel = function (productId) {
    return getCartLineEtaLabel(productId);
  };
})();
