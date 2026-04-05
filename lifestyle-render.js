/**
 * Renders #gridLifestyle from window.LIFESTYLE_CATALOG (lifestyle-catalog.js).
 */
(function () {
  var CLOCK_SVG =
    '<svg class="product-card__clock" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

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

  function buildCard(p) {
    var id = escAttr(p.id);
    var brand = escAttr(p.brand);
    var name = escAttr(p.name);
    var img = escAttr(p.img);
    var off = p.off;
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

  function render() {
    var grid = document.getElementById("gridLifestyle");
    var cat = window.LIFESTYLE_CATALOG;
    if (!grid || !cat || !cat.length) return;
    var parts = new Array(cat.length);
    for (var i = 0; i < cat.length; i++) parts[i] = buildCard(cat[i]);
    grid.innerHTML = parts.join("");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
