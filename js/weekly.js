(function () {
  var DATA_URL = "assets/weekly/weekly.json?v=1811271200";
  var IMG_DIR = "assets/weekly/";
  var FALLBACK = [
    {
      id: "coral-gables-33146-weekly",
      neighborhood: "Coral Gables",
      zip: "33146",
      specs: ["Chlorine", "About 12,000 gallons", "Sand filter", "Spa"],
      photo: "weekly-pool-coral-gables-33146.webp",
      alt: "Clear freeform chlorine pool with a spa and a canal behind it in Coral Gables.",
      width: 1600,
      height: 1600
    },
    {
      id: "kendall-33186-weekly",
      neighborhood: "Kendall",
      zip: "33186",
      specs: ["Saltwater", "About 12,000 gallons", "Cartridge filter"],
      photo: "weekly-pool-kendall-33186.webp",
      alt: "Clear oval saltwater pool with brick coping and a raised wall with fountains in Kendall.",
      width: 1600,
      height: 1600
    }
  ];

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderPool(pool) {
    var src = IMG_DIR + (pool.photo || "");
    var w = pool.width || 1600;
    var h = pool.height || 1600;
    var place = pool.neighborhood || "";
    if (place && pool.zip) place += ", FL " + pool.zip;
    var facts = [];
    if (place) facts.push(place);
    if (pool.specs && pool.specs.length) facts = facts.concat(pool.specs);
    var list = facts.length
      ? '<ul class="recent-work-facts">' +
        facts.map(function (s) { return "<li>" + escapeHtml(s) + "</li>"; }).join("") +
        "</ul>"
      : "";

    return (
      '<figure class="recent-work-job serviced-pools-card" data-pool-id="' + escapeHtml(pool.id || "") + '">' +
        '<div class="serviced-pools-photo">' +
          '<img src="' + escapeHtml(src) + '" alt="' + escapeHtml(pool.alt || "") + '" width="' + w + '" height="' + h + '" loading="lazy" decoding="async">' +
        "</div>" +
        '<figcaption class="recent-work-caption">' +
          list +
        "</figcaption>" +
      "</figure>"
    );
  }

  function mount(pools) {
    var grid = document.getElementById("serviced-pools-grid");
    if (!grid || !pools || !pools.length) return;
    grid.innerHTML = pools.map(renderPool).join("");
    grid.setAttribute("data-count", String(pools.length));
  }

  function start() {
    var grid = document.getElementById("serviced-pools-grid");
    if (!grid) return;
    var dataUrl = grid.getAttribute("data-src") || DATA_URL;
    var imgDir = grid.getAttribute("data-img-dir");
    if (imgDir) IMG_DIR = imgDir;
    fetch(dataUrl, { credentials: "same-origin" })
      .then(function (res) { if (!res.ok) throw new Error("weekly.json " + res.status); return res.json(); })
      .then(function (data) { mount((data && data.pools) || FALLBACK); })
      .catch(function () { mount(FALLBACK); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
