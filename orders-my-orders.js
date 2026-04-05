(function () {
  var ul = document.getElementById("orderListRoot");
  var B = window.BlinkitOmuniSync;
  if (!ul || !B) return;

  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s == null ? "" : String(s);
    return d.innerHTML;
  }

  function escAttr(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
  }

  ul.querySelectorAll("li[data-blinkit-order]").forEach(function (n) {
    n.parentNode.removeChild(n);
  });

  B.getOrders().forEach(function (o) {
    var meta =
      "₹" + B.formatRs(o.grandTotal) + " • " + B.formatOrderDateLine(new Date(o.placedAt));
    var th = B.thumbsFromItems(o.items);
    var thumbs = th.urls
      .map(function (u) {
        return '<img src="' + escAttr(u) + '" alt="" width="48" height="48" />';
      })
      .join("");
    if (th.overflow > 0) {
      thumbs +=
        '<span class="order-card__more" title="More items">+' + th.overflow + "</span>";
    }

    var li = document.createElement("li");
    li.setAttribute("data-blinkit-order", o.syncId);
    li.innerHTML =
      '<article class="order-card order-card--from-blinkit">' +
      '<a href="#" class="order-card__header">' +
      '<span class="order-card__check" aria-hidden="true">' +
      '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6l2.5 2.5L9.5 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
      '<div class="order-card__head-text">' +
      '<strong class="order-card__status">Arrived in ' +
      esc(o.deliveryMinutes) +
      " minutes</strong>" +
      '<span class="order-card__meta">' +
      esc(meta) +
      "</span></div>" +
      '<span class="order-card__chev" aria-hidden="true">›</span></a>' +
      '<div class="order-card__thumbs">' +
      thumbs +
      "</div></article>";

    ul.insertBefore(li, ul.firstChild);
  });
})();
