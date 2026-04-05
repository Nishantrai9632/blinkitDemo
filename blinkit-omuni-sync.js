/**
 * Persists Blinkit orders to localStorage and mirrors each as a hyperlocal Omuni consignment.
 * Requires same origin (e.g. http://localhost) for Blinkit + omuni-store to share storage.
 */
(function (global) {
  var STORAGE_KEY = "blinkit_omuni_sync_v1";
  var ASSIGNED_BASE_COUNT = 7;
  var ASSIGNED_BASE_WORTH = 4193;

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { orders: [] };
      var d = JSON.parse(raw);
      return d && Array.isArray(d.orders) ? d : { orders: [] };
    } catch (e) {
      return { orders: [] };
    }
  }

  function save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  function generateConsignmentId() {
    return "CW" + Date.now().toString().slice(-10) + String(Math.floor(Math.random() * 9000 + 1000));
  }

  function formatOrderDateLine(d) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var h = d.getHours();
    var ampm = h >= 12 ? "pm" : "am";
    var h12 = h % 12;
    if (h12 === 0) h12 = 12;
    var mi = d.getMinutes();
    var mp = mi < 10 ? "0" + mi : String(mi);
    return d.getDate() + " " + months[d.getMonth()] + ", " + h12 + ":" + mp + " " + ampm;
  }

  function parseDeliveryMinutesFromPage() {
    var el = document.getElementById("locationDeliveryLine");
    if (!el) return 19;
    var m = (el.textContent || "").match(/(\d+)\s*min/i);
    return m ? parseInt(m[1], 10) : 19;
  }

  function formatRs(n) {
    var x = Math.round(Number(n) || 0);
    return x.toLocaleString("en-IN");
  }

  global.BlinkitOmuniSync = {
    STORAGE_KEY: STORAGE_KEY,
    ASSIGNED_BASE_COUNT: ASSIGNED_BASE_COUNT,
    ASSIGNED_BASE_WORTH: ASSIGNED_BASE_WORTH,

    load: load,
    save: save,

    /** Call with live cart object and checkout total (incl. tip & donation) before clearing cart. */
    recordOrder: function (cartObj, grandTotal) {
      var items = [];
      Object.keys(cartObj || {}).forEach(function (k) {
        var it = cartObj[k];
        items.push({
          key: k,
          id: it.id || k,
          name: it.name || "",
          qty: it.qty || 0,
          price: it.price || 0,
          imgUrl: it.imgUrl || ""
        });
      });
      if (items.length === 0) return null;

      var data = load();
      var now = new Date();
      var mins = parseDeliveryMinutesFromPage();
      var order = {
        syncId: "syn_" + now.getTime() + "_" + Math.random().toString(36).slice(2, 10),
        placedAt: now.getTime(),
        grandTotal: Math.round(Number(grandTotal) || 0),
        deliveryMinutes: mins,
        consignmentId: generateConsignmentId(),
        items: items
      };
      data.orders.unshift(order);
      save(data);
      return order;
    },

    getOrders: function () {
      return load().orders;
    },

    getAssignedTotals: function () {
      var orders = load().orders;
      var extra = orders.length;
      var sum = 0;
      orders.forEach(function (o) {
        sum += o.grandTotal || 0;
      });
      return {
        orderCount: ASSIGNED_BASE_COUNT + extra,
        worth: ASSIGNED_BASE_WORTH + sum
      };
    },

    formatRs: formatRs,
    formatOrderDateLine: formatOrderDateLine,

    /** Build thumbnail URLs (max 4) and overflow count for order card UI. */
    thumbsFromItems: function (items) {
      var urls = [];
      for (var i = 0; i < items.length && urls.length < 4; i++) {
        var u = items[i].imgUrl;
        if (u) urls.push(u);
      }
      var overflow = items.length > 4 ? items.length - 4 : 0;
      if (urls.length === 0 && items.length) {
        urls.push(
          "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=96&h=96&fit=crop&auto=format&q=80"
        );
      }
      return { urls: urls, overflow: overflow };
    }
  };
})(typeof window !== "undefined" ? window : this);
