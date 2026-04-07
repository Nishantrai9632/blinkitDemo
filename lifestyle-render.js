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
    var brandRaw = String(p.brand || "");
    var brandUpper = brandRaw.toUpperCase();
    var brandDisplay = brandUpper === "BLACKBERRY" ? "BLACKBERRYS" : brandRaw;
    var nameRaw = String(p.name || "");
    if (brandUpper === "BLACKBERRY") {
      // Keep internal keys as-is, but display the pluralized brand consistently.
      nameRaw = nameRaw.replace(/\bBLACKBERRY\b/g, "BLACKBERRYS");
    }
    // IMPORTANT: Keep data-brand as the original catalog key for filtering.
    // Only the visible text should be pluralized.
    var brand = escAttr(brandRaw);
    var name = escAttr(nameRaw);
    var typeRaw = p.type || "";
    // Derive image from category (type) so imagery stays consistent with filters.
    // For select brands, force local sample images but rotate through all 5 deterministically.
    function rotateLocal5(orderedPaths, seed) {
      var s = String(seed || "");
      var base = hashStr(s) % orderedPaths.length;
      return encodeURI("./" + orderedPaths[base]);
    }

    function localPathsForBrand(brandUpper, typeLabel, poolKey) {
      var t = String(typeLabel || "").toLowerCase();
      // Return an array of 5 paths, ordered so the first entries are the "best match" for this type.
      if (brandUpper === "BATA") {
        var formal = "Catalog Images/BATA/Bata Formal Shoes.jpeg";
        var sandal = "Catalog Images/BATA/Bata Sandals.webp";
        var slipper = "Catalog Images/BATA/Bata Slippers.webp";
        var sport = "Catalog Images/BATA/Bata Sports.jpeg";
        var casual = "Catalog Images/BATA/Bata Casuals.webp";
        if (
          poolKey === "footwear_formal" ||
          t.indexOf("formal") !== -1 ||
          t.indexOf("school") !== -1 ||
          t.indexOf("ballerina") !== -1 ||
          t.indexOf("oxford") !== -1 ||
          t.indexOf("loafer") !== -1 ||
          t.indexOf("derb") !== -1 ||
          t.indexOf("monk") !== -1
        )
          return [formal, casual, sport, sandal, slipper];
        if (t.indexOf("slipper") !== -1) return [slipper, sandal, casual, sport, formal];
        if (t.indexOf("sandal") !== -1 || t.indexOf("chappal") !== -1) return [sandal, slipper, casual, sport, formal];
        if (t.indexOf("sport") !== -1 || t.indexOf("closed") !== -1) return [sport, casual, formal, sandal, slipper];
        return [casual, sport, formal, sandal, slipper];
      }
      if (brandUpper === "ARROW") {
        var blazer = "Catalog Images/ARROW/Arrow Blazer.webp";
        var jeans = "Catalog Images/ARROW/Arrow Jeans.webp";
        var shirt = "Catalog Images/ARROW/Arrow Shirt.webp";
        var tshirt = "Catalog Images/ARROW/Arrow T shirt.webp";
        var trousers = "Catalog Images/ARROW/Arrow Trousers.webp";
        if (t.indexOf("blazer") !== -1) return [blazer, shirt, trousers, jeans, tshirt];
        if (t.indexOf("jean") !== -1) return [jeans, tshirt, shirt, trousers, blazer];
        if (t.indexOf("trouser") !== -1 || t.indexOf("pant") !== -1) return [trousers, shirt, jeans, tshirt, blazer];
        if (t.indexOf("t-shirt") !== -1 || t.indexOf("t shirt") !== -1) return [tshirt, jeans, shirt, trousers, blazer];
        if (t.indexOf("shirt") !== -1) return [shirt, tshirt, trousers, jeans, blazer];
        return [shirt, tshirt, trousers, jeans, blazer];
      }
      if (brandUpper === "TOMMY HILFIGER") {
        var jacket = "Catalog Images/TOMMY HILFIGER/Tommy Jacket.webp";
        var jeansT = "Catalog Images/TOMMY HILFIGER/Tommy Jeans.webp";
        var shirts = "Catalog Images/TOMMY HILFIGER/Tommy Shirts.webp";
        var sweats = "Catalog Images/TOMMY HILFIGER/Tommy Sweatshirts.webp";
        var tshirts = "Catalog Images/TOMMY HILFIGER/Tommy Tshirts.webp";
        if (t.indexOf("jacket") !== -1) return [jacket, shirts, jeansT, sweats, tshirts];
        if (t.indexOf("jean") !== -1) return [jeansT, tshirts, shirts, sweats, jacket];
        if (t.indexOf("sweatshirt") !== -1) return [sweats, tshirts, shirts, jeansT, jacket];
        if (t.indexOf("t-shirt") !== -1 || t.indexOf("t shirt") !== -1) return [tshirts, shirts, jeansT, sweats, jacket];
        if (t.indexOf("shirt") !== -1) return [shirts, tshirts, jeansT, sweats, jacket];
        return [shirts, tshirts, jeansT, sweats, jacket];
      }
      if (brandUpper === "CALVIN KLEIN") {
        var cJeans = "Catalog Images/Calvin Klein/Calvin Jeans.webp";
        var cJoggers = "Catalog Images/Calvin Klein/Calvin Joggers.webp";
        var cMix = "Catalog Images/Calvin Klein/Calvin Mix.webp";
        var cTee = "Catalog Images/Calvin Klein/Calvin klein tshirt.webp";
        var cSweater = "Catalog Images/Calvin Klein/Calvin sweater.webp";
        if (t.indexOf("jean") !== -1) return [cJeans, cTee, cMix, cSweater, cJoggers];
        if (t.indexOf("jogger") !== -1 || t.indexOf("lower") !== -1) return [cJoggers, cTee, cMix, cJeans, cSweater];
        if (t.indexOf("sweater") !== -1 || t.indexOf("sweatshirt") !== -1) return [cSweater, cTee, cMix, cJeans, cJoggers];
        if (t.indexOf("t-shirt") !== -1 || t.indexOf("t shirt") !== -1) return [cTee, cMix, cJeans, cJoggers, cSweater];
        return [cMix, cTee, cJeans, cJoggers, cSweater];
      }
      if (brandUpper === "USPA") {
        var uSneakers = "Catalog Images/USPA/USPA Sneakers.webp";
        var uSweat = "Catalog Images/USPA/USPA Sweatshirt.webp";
        var uTees = "Catalog Images/USPA/USPA T-Shirts.webp";
        var uTrou = "Catalog Images/USPA/USPA Trousers.webp";
        var uShirt = "Catalog Images/USPA/USPA shirts.webp";
        if (t.indexOf("sneaker") !== -1 || t.indexOf("shoe") !== -1) return [uSneakers, uTees, uShirt, uTrou, uSweat];
        if (t.indexOf("sweatshirt") !== -1 || t.indexOf("hoodie") !== -1) return [uSweat, uTees, uShirt, uTrou, uSneakers];
        if (t.indexOf("trouser") !== -1 || t.indexOf("pant") !== -1) return [uTrou, uShirt, uTees, uSweat, uSneakers];
        if (t.indexOf("t-shirt") !== -1 || t.indexOf("t shirt") !== -1) return [uTees, uShirt, uTrou, uSweat, uSneakers];
        if (t.indexOf("shirt") !== -1) return [uShirt, uTees, uTrou, uSweat, uSneakers];
        return [uShirt, uTees, uTrou, uSweat, uSneakers];
      }
      if (brandUpper === "BLACKBERRY" || brandUpper === "BLACKBERRYS") {
        var bbJeans = "Catalog Images/Blackberry/Blackberrys Jeans.webp";
        var bbShirt = "Catalog Images/Blackberry/Blackberrys shirt.webp";
        var bbSuit = "Catalog Images/Blackberry/Blackberrys suit.webp";
        var bbSweat = "Catalog Images/Blackberry/Blackberrys sweatshirt.webp";
        var bbTrouser = "Catalog Images/Blackberry/Blackberrys trouser.webp";
        if (t.indexOf("suit") !== -1) return [bbSuit, bbShirt, bbTrouser, bbJeans, bbSweat];
        if (t.indexOf("jean") !== -1) return [bbJeans, bbShirt, bbTrouser, bbSweat, bbSuit];
        if (t.indexOf("trouser") !== -1 || t.indexOf("pant") !== -1) return [bbTrouser, bbShirt, bbJeans, bbSweat, bbSuit];
        if (t.indexOf("sweatshirt") !== -1) return [bbSweat, bbShirt, bbJeans, bbTrouser, bbSuit];
        if (t.indexOf("shirt") !== -1) return [bbShirt, bbTrouser, bbJeans, bbSweat, bbSuit];
        return [bbShirt, bbTrouser, bbJeans, bbSweat, bbSuit];
      }
      if (brandUpper === "SOCH") {
        var sochDress = "Catalog Images/SOCH/SOCH Dresses.webp";
        var sochKurta = "Catalog Images/SOCH/SOCH Kurtas.webp";
        var sochSaree = "Catalog Images/SOCH/SOCH Saree.webp";
        var sochMat = "Catalog Images/SOCH/SOCH material.webp";
        var sochMix = "Catalog Images/SOCH/SOCH.webp";
        if (t.indexOf("saree") !== -1) return [sochSaree, sochMix, sochDress, sochKurta, sochMat];
        if (t.indexOf("kurta") !== -1) return [sochKurta, sochMix, sochDress, sochSaree, sochMat];
        if (t.indexOf("dress material") !== -1 || t.indexOf("material") !== -1) return [sochMat, sochMix, sochDress, sochKurta, sochSaree];
        if (t.indexOf("dress") !== -1 || t.indexOf("gown") !== -1) return [sochDress, sochMix, sochKurta, sochSaree, sochMat];
        return [sochMix, sochDress, sochKurta, sochSaree, sochMat];
      }
      if (brandUpper === "SG SPORTS") {
        var sgGloves = "Catalog Images/SG Sports/SG Gloves.webp";
        var sgShoes = "Catalog Images/SG Sports/SG Shoes.webp";
        var sgBat = "Catalog Images/SG Sports/SG Sports bat.webp";
        var sgJackets = "Catalog Images/SG Sports/SG Sports jackets.webp";
        var sgTee = "Catalog Images/SG Sports/SG Tshirt.webp";
        if (t.indexOf("glove") !== -1) return [sgGloves, sgBat, sgShoes, sgTee, sgJackets];
        if (t.indexOf("bat") !== -1 || t.indexOf("willow") !== -1) return [sgBat, sgGloves, sgShoes, sgTee, sgJackets];
        if (t.indexOf("shoe") !== -1 || t.indexOf("closed") !== -1) return [sgShoes, sgBat, sgGloves, sgTee, sgJackets];
        if (t.indexOf("jacket") !== -1 || t.indexOf("hoodie") !== -1) return [sgJackets, sgTee, sgBat, sgShoes, sgGloves];
        if (t.indexOf("t-shirt") !== -1 || t.indexOf("t shirt") !== -1) return [sgTee, sgJackets, sgBat, sgShoes, sgGloves];
        return [sgBat, sgShoes, sgGloves, sgTee, sgJackets];
      }
      if (brandUpper === "SELECTED") {
        var selJeans = "Catalog Images/SELECTED/SELECTED Jeans.webp";
        var selChinos = "Catalog Images/SELECTED/SELECTED chinos.webp";
        var selShirt = "Catalog Images/SELECTED/SELECTED shirt.webp";
        var selJackets = "Catalog Images/SELECTED/Selected jackets.webp";
        var selPullover = "Catalog Images/SELECTED/Selected pullover.webp";
        if (t.indexOf("jean") !== -1) return [selJeans, selShirt, selChinos, selJackets, selPullover];
        if (t.indexOf("chino") !== -1 || t.indexOf("trouser") !== -1 || t.indexOf("pant") !== -1)
          return [selChinos, selShirt, selJeans, selJackets, selPullover];
        if (t.indexOf("shirt") !== -1) return [selShirt, selJeans, selChinos, selJackets, selPullover];
        if (t.indexOf("jacket") !== -1 || t.indexOf("hoodie") !== -1 || t.indexOf("coat") !== -1)
          return [selJackets, selPullover, selShirt, selJeans, selChinos];
        if (t.indexOf("pullover") !== -1 || t.indexOf("sweater") !== -1 || t.indexOf("sweatshirt") !== -1)
          return [selPullover, selJackets, selShirt, selJeans, selChinos];
        return [selShirt, selJeans, selChinos, selJackets, selPullover];
      }
      if (brandUpper === "VERO MODA") {
        var vm1 = "Catalog Images/VERO MODA/VERO MODA 1.webp";
        var vm2 = "Catalog Images/VERO MODA/VERO MODA 2.webp";
        var vm3 = "Catalog Images/VERO MODA/VERO MODA 3.webp";
        var vm4 = "Catalog Images/VERO MODA/VERO MODA 4.webp";
        var vm5 = "Catalog Images/VERO MODA/VERO MODA 5.webp";
        // No category keywords in filenames; rotate but bias by broad type.
        if (t.indexOf("dress") !== -1 || t.indexOf("gown") !== -1) return [vm3, vm1, vm2, vm4, vm5];
        if (t.indexOf("top") !== -1 || t.indexOf("t-shirt") !== -1 || t.indexOf("t shirt") !== -1)
          return [vm1, vm2, vm4, vm3, vm5];
        if (t.indexOf("jean") !== -1 || t.indexOf("trouser") !== -1 || t.indexOf("pant") !== -1)
          return [vm2, vm4, vm1, vm3, vm5];
        return [vm1, vm2, vm3, vm4, vm5];
      }
      if (brandUpper === "ONLY") {
        var o1 = "Catalog Images/ONLY/ONLY 1.webp";
        var o2 = "Catalog Images/ONLY/ONLY 2.webp";
        var o3 = "Catalog Images/ONLY/ONLY 3.webp";
        var o4 = "Catalog Images/ONLY/ONLY 4.webp";
        var o5 = "Catalog Images/ONLY/ONLY 5.webp";
        if (t.indexOf("dress") !== -1 || t.indexOf("gown") !== -1) return [o3, o1, o2, o4, o5];
        if (t.indexOf("top") !== -1 || t.indexOf("t-shirt") !== -1 || t.indexOf("t shirt") !== -1)
          return [o1, o2, o4, o3, o5];
        if (t.indexOf("jean") !== -1 || t.indexOf("trouser") !== -1 || t.indexOf("pant") !== -1)
          return [o2, o4, o1, o3, o5];
        return [o1, o2, o3, o4, o5];
      }
      if (brandUpper === "JACK & JONES") {
        var jjCargo = "Catalog Images/JACK & JONES/JJ Cargo.webp";
        var jjJeans = "Catalog Images/JACK & JONES/JJ Jeans.webp";
        var jjShirts = "Catalog Images/JACK & JONES/JJ Shirts.webp";
        var jjShoes = "Catalog Images/JACK & JONES/JJ Shoes.jpg";
        var jjTees = "Catalog Images/JACK & JONES/JJ Tsirts.webp";
        if (t.indexOf("cargo") !== -1) return [jjCargo, jjJeans, jjTees, jjShirts, jjShoes];
        if (t.indexOf("jean") !== -1) return [jjJeans, jjTees, jjShirts, jjCargo, jjShoes];
        if (t.indexOf("shirt") !== -1) return [jjShirts, jjTees, jjJeans, jjCargo, jjShoes];
        if (t.indexOf("shoe") !== -1 || t.indexOf("sneaker") !== -1) return [jjShoes, jjJeans, jjTees, jjShirts, jjCargo];
        if (t.indexOf("t-shirt") !== -1 || t.indexOf("t shirt") !== -1) return [jjTees, jjJeans, jjShirts, jjCargo, jjShoes];
        return [jjTees, jjShirts, jjJeans, jjCargo, jjShoes];
      }
      return null;
    }

    var poolKey = poolKeyForType(typeRaw);
    var local5 = localPathsForBrand(brandUpper, typeRaw, poolKey);
    var imgDerived = local5
      ? rotateLocal5(local5, (p.id || "") + "|" + brandUpper + "|" + typeRaw)
      : pickFrom(IMG_POOLS[poolKey], (p.id || "") + "|" + (p.brand || "") + "|" + typeRaw);
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
    var delSel = window.lifestyleDeliveryBy && String(window.lifestyleDeliveryBy).trim().length;
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
      var imgUrl = "";
      var bUpper = String(brand || "").toUpperCase();
      var local5b = localPathsForBrand(bUpper, typ, poolKey);
      if (local5b) {
        imgUrl = rotateLocal5(local5b, pid + "|" + bUpper + "|" + typ + "|" + ti);
      } else {
        var pool = IMG_POOLS[poolKey];
        imgUrl = pickUniqueFrom(pool, pid + "|" + brand + "|" + typ + "|" + ti, used);
      }
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
