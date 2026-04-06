/**
 * Renders #gridLifestyle from window.LIFESTYLE_CATALOG (lifestyle-catalog.js).
 */
(function () {
  var CLOCK_SVG =
    '<svg class="product-card__clock" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  // Neutral stock photography (Unsplash) — no brand logos; split footwear so “formal shoes”
  // doesn’t reuse loud athletic sneaker shots.
  var IMG_POOLS = {
    footwear_formal: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3b?w=400&h=533&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&h=533&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5a0?w=400&h=533&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1616400653233-8e2daf37b0b0?w=400&h=533&fit=crop&auto=format&q=80"
    ],
    footwear_sandal: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=533&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1573100924848-075b9b5360d?w=400&h=533&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=533&fit=crop&auto=format&q=80"
    ],
    footwear_boot: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=533&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3b?w=400&h=533&fit=crop&auto=format&q=80"
    ],
    footwear_sport: [
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=533&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=533&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=533&fit=crop&auto=format&q=80"
    ],
    footwear_casual: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=533&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=533&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=400&h=533&fit=crop&auto=format&q=80"
    ],
    tops: [
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=533&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1520975661595-6453be3f7070?w=400&h=533&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=533&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=533&fit=crop&auto=format&q=80"
    ],
    outerwear: [
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400&h=533&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=533&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=533&fit=crop&auto=format&q=80"
    ],
    bottoms: [
      "https://images.unsplash.com/photo-1520975661595-6453be3f7070?w=400&h=533&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&h=533&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=533&fit=crop&auto=format&q=80"
    ],
    innerwear: [
      "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400&h=533&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=533&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=533&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400&h=533&fit=crop&auto=format&q=80"
    ],
    bags: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=533&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=533&fit=crop&auto=format&q=80"
    ],
    accessories: [
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=533&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=533&fit=crop&auto=format&q=80"
    ],
    ethnic: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=533&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1618354691213-152f7b6a8d28?w=400&h=533&fit=crop&auto=format&q=80"
    ]
  };

  var DEFAULT_IMG = IMG_POOLS.tops[0];

  function hashStr(s) {
    // Simple deterministic hash (stable across sessions, no crypto needed).
    var str = String(s || "");
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h * 16777619) >>> 0;
    }
    return h >>> 0;
  }

  function pickFrom(pool, seed) {
    if (!pool || !pool.length) return DEFAULT_IMG;
    var idx = hashStr(seed) % pool.length;
    return pool[idx];
  }

  function pickUniqueFrom(pool, seed, usedMap) {
    if (!pool || !pool.length) return DEFAULT_IMG;
    var base = hashStr(seed) % pool.length;
    for (var i = 0; i < pool.length; i++) {
      var idx = (base + i) % pool.length;
      var url = pool[idx];
      if (!usedMap[url]) {
        usedMap[url] = true;
        return url;
      }
    }
    // If pool is smaller than requested unique count, fall back to deterministic pick.
    return pickFrom(pool, seed);
  }

  function poolKeyForType(typeLabel) {
    var t = String(typeLabel || "").toLowerCase().trim();
    // Footwear — order matters: sandals vs formal vs sports vs generic “shoes”.
    if (
      t.indexOf("sandal") !== -1 ||
      t.indexOf("slipper") !== -1 ||
      t.indexOf("chappal") !== -1 ||
      t.indexOf("slide") !== -1 ||
      t.indexOf("floater") !== -1
    ) {
      return "footwear_sandal";
    }
    if (
      t.indexOf("formal") !== -1 ||
      t.indexOf("oxford") !== -1 ||
      t.indexOf("loafer") !== -1 ||
      t.indexOf("derb") !== -1 ||
      t.indexOf("monk") !== -1 ||
      t.indexOf("school") !== -1 ||
      t.indexOf("plimsoll") !== -1 ||
      t.indexOf("ballerina") !== -1
    ) {
      return "footwear_formal";
    }
    if (t.indexOf("boot") !== -1) {
      return "footwear_boot";
    }
    if (
      t.indexOf("sneaker") !== -1 ||
      t.indexOf("sport") !== -1 ||
      t.indexOf("cricket") !== -1 ||
      t.indexOf("runner") !== -1 ||
      t.indexOf("cleat") !== -1
    ) {
      return "footwear_sport";
    }
    if (t.indexOf("shoe") !== -1 || t.indexOf("closed") !== -1) {
      return "footwear_casual";
    }
    if (
      t.indexOf("saree") !== -1 ||
      t.indexOf("kurti") !== -1 ||
      t.indexOf("kurta") !== -1 ||
      t.indexOf("salwar") !== -1 ||
      t.indexOf("dupatta") !== -1 ||
      t.indexOf("ghagra") !== -1 ||
      t.indexOf("choli") !== -1 ||
      t.indexOf("blouse") !== -1 ||
      t.indexOf("kaftan") !== -1 ||
      t.indexOf("shawl") !== -1 ||
      t.indexOf("petticoat") !== -1
    ) {
      return "ethnic";
    }
    if (
      t.indexOf("bag") !== -1 ||
      t.indexOf("hand bag") !== -1 ||
      t.indexOf("tote") !== -1
    ) {
      return "bags";
    }
    if (
      t.indexOf("belt") !== -1 ||
      t.indexOf("tie") !== -1 ||
      t.indexOf("cap") !== -1 ||
      t.indexOf("wallet") !== -1 ||
      t.indexOf("watch") !== -1 ||
      t.indexOf("sunglass") !== -1 ||
      t.indexOf("cufflink") !== -1 ||
      t.indexOf("pocket square") !== -1 ||
      t.indexOf("handkerchief") !== -1 ||
      t.indexOf("scarf") !== -1 ||
      t.indexOf("bandana") !== -1 ||
      t.indexOf("perfume") !== -1 ||
      t === "accessories"
    ) {
      return "accessories";
    }
    if (
      t.indexOf("brief") !== -1 ||
      t.indexOf("trunk") !== -1 ||
      t.indexOf("boxer") !== -1 ||
      t.indexOf("sock") !== -1 ||
      t.indexOf("vest") !== -1 ||
      t.indexOf("bra") !== -1 ||
      t.indexOf("pyjama") !== -1 ||
      t.indexOf("inner") !== -1
    ) {
      return "innerwear";
    }
    if (
      t.indexOf("jacket") !== -1 ||
      t.indexOf("hoodie") !== -1 ||
      t.indexOf("blazer") !== -1 ||
      t.indexOf("sweatshirt") !== -1 ||
      t.indexOf("sweater") !== -1 ||
      t.indexOf("pullover") !== -1 ||
      t.indexOf("coat") !== -1 ||
      t.indexOf("shrug") !== -1
    ) {
      return "outerwear";
    }
    if (
      t.indexOf("jean") !== -1 ||
      t.indexOf("trouser") !== -1 ||
      t.indexOf("pant") !== -1 ||
      t.indexOf("legging") !== -1 ||
      t.indexOf("jogger") !== -1 ||
      t.indexOf("short") !== -1 ||
      t.indexOf("lower") !== -1 ||
      t.indexOf("track") !== -1 ||
      t.indexOf("tight") !== -1 ||
      t.indexOf("plazo") !== -1 ||
      t.indexOf("skirt") !== -1
    ) {
      return "bottoms";
    }
    // Default: tops (shirts / tees / dresses / etc.)
    return "tops";
  }

  function escAttr(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
  }

  function buildVariant(p) {
    if (!p.hasSize) {
      return (
        '<div class="product-card__variant"><span class="product-card__unit">' +
        escAttr(p.unit || "1 pc") +
        '</span><span class="product-card__chev" aria-hidden="true">▾</span></div>'
      );
    }
    return (
      '<div class="product-card__variant">' +
      '<select class="size-select size-select--inline" data-size-select aria-label="Size">' +
      '<option value="S">1 pc · S</option>' +
      '<option value="M" selected>1 pc · M</option>' +
      '<option value="L">1 pc · L</option>' +
      '<option value="XL">1 pc · XL</option>' +
      "</select>" +
      '<span class="product-card__chev" aria-hidden="true">▾</span>' +
      "</div>"
    );
  }

  function buildCard(p, catalogIndex) {
    var id = escAttr(p.id);
    var brand = escAttr(p.brand);
    var name = escAttr(p.name);
    var typeRaw = p.type || "";
    // Always derive image from category (type) so imagery stays consistent with filters.
    var imgDerived = pickFrom(IMG_POOLS[poolKeyForType(typeRaw)], (p.id || "") + "|" + (p.brand || "") + "|" + typeRaw);
    var img = escAttr(imgDerived);
    var off = p.off;
    var gender = escAttr(p.gender || "");
    var typ = escAttr(typeRaw);
    var size = escAttr(p.size || "");
    return (
      '<article class="product-card product-card--apparel" data-id="' +
      id +
      '" data-brand="' +
      brand +
      '" data-name="' +
      name +
      '" data-price="' +
      p.price +
      '" data-mrp="' +
      p.mrp +
      '" data-off="' +
      off +
      '" data-unit="' +
      escAttr(p.unit || "1 pc") +
      '" data-product-img="' +
      img +
      '" data-gender="' +
      gender +
      '" data-type="' +
      typ +
      '" data-size="' +
      size +
      '" data-catalog-index="' +
      catalogIndex +
      '">' +
      '<div class="product-card__media">' +
      '<span class="product-card__badge">' +
      off +
      "% OFF</span>" +
      '<div class="product-card__img product-card__img--apparel">' +
      '<img class="product-card__photo" src="' +
      img +
      '" alt="" loading="lazy" decoding="async" width="400" height="533" />' +
      "</div></div>" +
      '<p class="product-card__time">' +
      CLOCK_SVG +
      ' <span class="product-card__eta">28 MINS</span></p>' +
      '<h3 class="product-card__name">' +
      name +
      "</h3>" +
      buildVariant(p) +
      '<div class="product-card__buy">' +
      '<div class="product-card__prices">' +
      '<span class="product-card__price">₹' +
      p.price +
      '</span><span class="product-card__mrp">₹' +
      p.mrp +
      "</span></div>" +
      '<div class="product-card__action" data-action-root></div></div>' +
      "</article>"
    );
  }

  function isDefaultUnfilteredView() {
    var brandSel = window.lifestyleBrandSelected && Object.keys(window.lifestyleBrandSelected).length;
    var typeSel = window.lifestyleTypeSelected && Object.keys(window.lifestyleTypeSelected).length;
    var delSel = window.lifestyleDeliverySelected && Object.keys(window.lifestyleDeliverySelected).length;
    var q = "";
    var inp = document.getElementById("searchInput");
    if (inp && inp.value) q = String(inp.value).trim();
    var sort = document.getElementById("lifestyleSort");
    var sortMode = sort ? String(sort.value || "") : "";
    return !brandSel && !typeSel && !delSel && !q && (!sortMode || sortMode === "relevance");
  }

  function interleaveByBrand(items) {
    var byBrand = {};
    for (var i = 0; i < items.length; i++) {
      var p = items[i];
      var b = (p && p.brand) || "";
      if (!byBrand[b]) byBrand[b] = [];
      byBrand[b].push(p);
    }
    var brandOrder =
      (window.LIFESTYLE_FILTER_OPTIONS && window.LIFESTYLE_FILTER_OPTIONS.brands) || Object.keys(byBrand).sort();
    var out = [];
    var idx = 0;
    var appended = true;
    while (appended) {
      appended = false;
      for (var j = 0; j < brandOrder.length; j++) {
        var b = brandOrder[j];
        var arr = byBrand[b];
        if (arr && idx < arr.length) {
          out.push(arr[idx]);
          appended = true;
        }
      }
      idx++;
    }
    return out.length ? out : items;
  }

  function render() {
    var grid = document.getElementById("gridLifestyle");
    var cat = window.LIFESTYLE_CATALOG;
    if (!grid || !cat || !cat.length) return;
    var items = cat;
    if (isDefaultUnfilteredView()) {
      items = interleaveByBrand(cat);
    }
    var parts = new Array(items.length);
    for (var i = 0; i < items.length; i++) parts[i] = buildCard(items[i], i);
    grid.innerHTML = parts.join("");

    // Reduce “redundant” look: ensure top 100 tiles use distinct images when possible.
    // We do this after render so we can overwrite src safely without changing catalog data.
    var used = {};
    var cards = grid.querySelectorAll(".product-card");
    var topN = Math.min(100, cards.length);
    for (var ti = 0; ti < topN; ti++) {
      var card = cards[ti];
      var typ = card.getAttribute("data-type") || "";
      var brand = card.getAttribute("data-brand") || "";
      var pid = card.getAttribute("data-id") || "";
      var poolKey = poolKeyForType(typ);
      var pool = IMG_POOLS[poolKey];
      var imgUrl = pickUniqueFrom(pool, pid + "|" + brand + "|" + typ + "|" + ti, used);
      var imgEl = card.querySelector("img.product-card__photo");
      if (imgEl) imgEl.src = imgUrl;
      card.setAttribute("data-product-img", imgUrl);
    }

    // Ensure every card has a valid image even if a remote URL fails.
    var imgs = grid.querySelectorAll("img.product-card__photo");
    for (var j = 0; j < imgs.length; j++) {
      imgs[j].addEventListener(
        "error",
        function () {
          if (this && this.src !== DEFAULT_IMG) this.src = DEFAULT_IMG;
        },
        { once: true }
      );
    }

    if (typeof window.initProductCards === "function") {
      window.initProductCards();
    }
    if (typeof window.applyLifestyleFacets === "function") {
      window.applyLifestyleFacets();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
