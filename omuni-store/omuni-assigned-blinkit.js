(function () {
  var B = window.BlinkitOmuniSync;
  var list = document.getElementById("omuniAssignedList");
  if (B && list) {
    list.querySelectorAll("li[data-blinkit-sync-id]").forEach(function (n) {
      n.parentNode.removeChild(n);
    });
    B.getOrders().forEach(function (order) {
      list.insertBefore(buildConsignmentLi(order), list.firstChild);
    });
    var t = B.getAssignedTotals();
    var e1 = document.getElementById("omuniSummaryOrders");
    var e2 = document.getElementById("omuniSummaryWorth");
    if (e1) e1.textContent = t.orderCount + " Orders";
    if (e2) e2.textContent = "Worth Rs. " + B.formatRs(t.worth);
  }

  function escAttr(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
  }

  function buildConsignmentLi(order) {
    var thumb =
      (order.items && order.items[0] && order.items[0].imgUrl) ||
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=160&h=160&fit=crop&auto=format&q=80";
    var cid = order.consignmentId || "";
    var li = document.createElement("li");
    li.setAttribute("data-blinkit-sync-id", order.syncId);
    li.innerHTML =
      '<a href="process.html?hyperlocal=1" class="omuni-consignment-card omuni-consignment-card--hyperlocal">' +
      '<img class="omuni-consignment-card__thumb" src="' +
      escAttr(thumb) +
      '" alt="" width="72" height="72" />' +
      '<div class="omuni-consignment-card__col">' +
      '<div><span class="omuni-field__label">Consignment id</span>' +
      '<span class="omuni-field__value">' +
      escAttr(cid) +
      "</span></div>" +
      '<div><span class="omuni-field__label">Status</span>' +
      '<span class="omuni-status">ASSIGNED</span></div></div>' +
      '<div class="omuni-consignment-card__col">' +
      '<div><span class="omuni-field__label">Type</span>' +
      '<span class="omuni-field__value omuni-field__value--type">Hyperlocal Delivery</span></div>' +
      '<div><span class="omuni-sla-label">SLA end time</span>' +
      '<div class="omuni-timer" data-sla-kind="hyperlocal">' +
      '<div class="omuni-timer__unit"><div class="omuni-timer__box">00</div><span class="omuni-timer__cap">hr</span></div>' +
      '<div class="omuni-timer__unit"><div class="omuni-timer__box">00</div><span class="omuni-timer__cap">min</span></div>' +
      '<div class="omuni-timer__unit"><div class="omuni-timer__box">00</div><span class="omuni-timer__cap">sec</span></div>' +
      "</div></div></div></a>";
    return li;
  }

  var SLA_BOUNDS_SEC = {
    hyperlocal: { min: 10 * 60, max: 15 * 60 },
    sdd: { min: 1, max: 2 * 60 * 60 - 1 },
    standard: { min: 1, max: 12 * 60 * 60 - 1 }
  };

  function pad(n) {
    return (n < 10 ? "0" : "") + n;
  }

  function randomIntInclusive(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  function initTimer(el) {
    var kind = el.getAttribute("data-sla-kind");
    var bounds = SLA_BOUNDS_SEC[kind];
    if (!bounds) return;

    var remaining = randomIntInclusive(bounds.min, bounds.max);
    var endAt = Date.now() + remaining * 1000;
    el.dataset.slaEndAt = String(endAt);
    var boxes = el.querySelectorAll(".omuni-timer__box");

    function tick() {
      var left = Math.floor((endAt - Date.now()) / 1000);
      if (left < 0) left = 0;
      var h = Math.floor(left / 3600);
      var m = Math.floor((left % 3600) / 60);
      var s = left % 60;
      if (boxes.length >= 3) {
        boxes[0].textContent = pad(h);
        boxes[1].textContent = pad(m);
        boxes[2].textContent = pad(s);
      }
      el.setAttribute(
        "aria-label",
        "Time remaining " + h + " hours " + m + " minutes " + s + " seconds"
      );
    }

    tick();
    setInterval(tick, 1000);
  }

  function sortAssignedList() {
    var ul = document.querySelector(".omuni-assigned-list");
    if (!ul) return;
    var items = Array.prototype.slice.call(ul.children);
    items.sort(function (a, b) {
      var aCard = a.querySelector(".omuni-consignment-card");
      var bCard = b.querySelector(".omuni-consignment-card");
      var aHL = aCard && aCard.classList.contains("omuni-consignment-card--hyperlocal");
      var bHL = bCard && bCard.classList.contains("omuni-consignment-card--hyperlocal");
      if (aHL !== bHL) return aHL ? -1 : 1;
      var aTimer = a.querySelector(".omuni-timer[data-sla-end-at]");
      var bTimer = b.querySelector(".omuni-timer[data-sla-end-at]");
      var aEnd = aTimer ? parseInt(aTimer.dataset.slaEndAt, 10) : 0;
      var bEnd = bTimer ? parseInt(bTimer.dataset.slaEndAt, 10) : 0;
      return aEnd - bEnd;
    });
    items.forEach(function (li) {
      ul.appendChild(li);
    });
  }

  document.querySelectorAll(".omuni-timer[data-sla-kind]").forEach(initTimer);
  sortAssignedList();
})();

