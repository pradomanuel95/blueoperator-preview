(function () {
  var DATA_URL = "assets/jobs/jobs.json?v=1811271140";
  var IMG_DIR = "assets/jobs/";
  var FALLBACK = [
    {
      id: "kendall-33173-green-to-clean",
      home: true,
      neighborhood: "Kendall",
      zip: "33173",
      service: "Green-to-clean recovery",
      note: "The water had turned green. We brushed, balanced and filtered it back to clear.",
      specs: ["Saltwater", "About 15,000 gallons", "Cartridge filter"],
      before: "green-pool-before-kendall.webp",
      after: "green-to-clean-after-kendall.webp",
      altBefore: "Green rectangular pool in Kendall before recovery, with cloudy green water and a mosaic tile sun shelf.",
      altAfter: "The same Kendall pool after recovery, with clear water and a mosaic tile sun shelf.",
      width: 1600,
      height: 1699
    },
    {
      id: "kendall-33176-green-to-clean",
      home: true,
      neighborhood: "Kendall",
      zip: "33176",
      service: "Green-to-clean recovery",
      note: "This one was green when we got the call. Now it's ready to swim.",
      specs: ["Chlorine", "About 11,000 gallons", "Cartridge filter", "Spa"],
      before: "green-pool-before-kendall-33176.webp",
      after: "green-to-clean-after-kendall-33176.webp",
      altBefore: "Green kidney-shaped pool with a spa, pink deck, and shed in Kendall, before recovery.",
      altAfter: "The same Kendall kidney-shaped pool with a spa, pink deck, and shed, after recovery, with clear water.",
      width: 1600,
      height: 1699
    },
    {
      id: "hammocks-33193-green-to-clean",
      home: true,
      neighborhood: "The Hammocks",
      zip: "33193",
      service: "Green-to-clean recovery",
      note: "The pool had gone a heavy green. The water is clear now.",
      specs: ["Chlorine", "About 5,000 gallons", "Cartridge filter"],
      before: "green-pool-before-hammocks-33193.webp",
      after: "green-to-clean-after-hammocks-33193.webp",
      altBefore: "Green rectangular pool with a sun shelf and screen enclosure in The Hammocks, before recovery.",
      altAfter: "The same Hammocks pool after recovery, with clear water, a sun shelf, and screen enclosure.",
      width: 1600,
      height: 1699
    },
    {
      id: "kendall-33186-b-green-to-clean",
      neighborhood: "Kendall",
      zip: "33186",
      service: "Green-to-clean recovery",
      note: "Algae had taken over the water. We cleaned it back to clear.",
      specs: ["Chlorine", "About 13,000 gallons", "Sand filter"],
      before: "green-pool-before-kendall-33186-b.webp",
      after: "green-to-clean-after-kendall-33186-b.webp",
      altBefore: "Green rectangular pool with brick coping and a safety fence in Kendall, before recovery.",
      altAfter: "Clear rectangular pool with brick coping and a handrail in Kendall after recovery.",
      width: 1600,
      height: 1699
    },
    {
      id: "kendall-33176-cloudy-to-clear",
      neighborhood: "Kendall",
      zip: "33176",
      service: "Algae-to-clear recovery",
      note: "Algae had clouded the water green. We brought it back to clear.",
      specs: ["Saltwater", "About 40,000 gallons", "Quad cartridge filter"],
      before: "cloudy-pool-before-kendall-33176-b.webp",
      after: "clear-pool-after-kendall-33176-b.webp",
      altBefore: "Saltwater pool in Kendall with algae-clouded green water, a white house, and light stone deck, before it was cleared.",
      altAfter: "The same Kendall pool after the algae was cleared, with a white house and light stone deck.",
      width: 1600,
      height: 1699
    },
    {
      id: "kendall-33186-green-to-clean",
      neighborhood: "Kendall",
      zip: "33186",
      service: "Green-to-clean recovery",
      note: "Green and cloudy when we started. Clear blue now.",
      specs: ["Chlorine", "About 10,000 gallons", "Cartridge filter"],
      before: "green-pool-before-kendall-33186.webp",
      after: "green-to-clean-after-kendall-33186.webp",
      altBefore: "Green pool with a rounded sun shelf, safety fence, and terracotta deck in Kendall, before recovery.",
      altAfter: "The same Kendall pool after recovery, with clear blue water, a rounded sun shelf, and safety fence.",
      width: 1600,
      height: 1699
    },
    {
      id: "kendall-lakes-33183-green-to-clean",
      neighborhood: "Kendall Lakes",
      zip: "33183",
      service: "Green-to-clean recovery",
      note: "The water was murky green. It's clear again.",
      specs: ["Chlorine", "About 11,000 gallons", "Cartridge filter"],
      before: "green-pool-before-kendall-lakes-33183.webp",
      after: "green-to-clean-after-kendall-lakes-33183.webp",
      altBefore: "Murky green rectangular pool with a white stone deck and pergola in Kendall Lakes, before recovery.",
      altAfter: "The same Kendall Lakes pool after recovery, with clear water, white stone deck, and a pergola at the far end.",
      width: 1600,
      height: 1699
    },
    {
      id: "west-kendall-33196-algae-to-clear",
      neighborhood: "West Kendall",
      zip: "33196",
      service: "Light algae cleanup",
      note: "A light algae bloom had turned the water cloudy green. We cleared it up before it got worse.",
      specs: ["Chlorine", "About 7,500 gallons", "Cartridge filter"],
      before: "light-algae-pool-before-west-kendall-33196.webp",
      after: "clear-pool-after-west-kendall-33196.webp",
      altBefore: "Oval pool with light cloudy green water, a sun shelf, and a tile roof in West Kendall, before it was cleared.",
      altAfter: "The same West Kendall pool after the water was cleared, with a sun shelf and tile roof.",
      width: 1600,
      height: 1699
    }
  ];

  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function setPos(slider, pct) {
    pct = Math.max(0, Math.min(100, Number(pct)));
    slider.style.setProperty("--pos", pct + "%");
    slider.setAttribute("aria-valuenow", String(Math.round(pct)));
    slider.setAttribute("aria-valuetext", Math.round(pct) + " percent before");
  }

  function initSlider(slider) {
    var dragging = false;
    var pending = null;
    var moveOpts = { passive: false };

    function point(e) {
      if (e.touches && e.touches.length) return e.touches[0];
      return e;
    }

    function pctFromEvent(e) {
      var pt = point(e);
      var rect = slider.getBoundingClientRect();
      if (!rect.width) return 50;
      return ((pt.clientX - rect.left) / rect.width) * 100;
    }

    function isHandleEvent(e) {
      var t = e.target;
      return !!(t && t.closest && t.closest(".ba-handle"));
    }

    function unbind() {
      window.removeEventListener("pointermove", onMove, moveOpts);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    }

    function stop() {
      dragging = false;
      pending = null;
      slider.classList.remove("is-dragging");
      unbind();
    }

    function onMove(e) {
      var pt = point(e);
      if (pending && !dragging) {
        var dx = pt.clientX - pending.startX;
        var dy = pt.clientY - pending.startY;
        var ax = Math.abs(dx);
        var ay = Math.abs(dy);
        if (ax < 8 && ay < 8) return;
        if (ax > ay && ax > 8) {
          dragging = true;
          pending = null;
          slider.classList.add("is-dragging");
          try { slider.setPointerCapture(e.pointerId); } catch (err) {}
        } else {
          stop();
          return;
        }
      }
      if (!dragging) return;
      if (e.cancelable) e.preventDefault();
      setPos(slider, pctFromEvent(e));
    }

    slider.addEventListener("pointerdown", function (e) {
      if (e.button != null && e.button !== 0) return;
      var fromHandle = isHandleEvent(e);
      var isTouch = e.pointerType === "touch";
      if (fromHandle || !isTouch) {
        dragging = true;
        pending = null;
        slider.classList.add("is-dragging");
        try { slider.setPointerCapture(e.pointerId); } catch (err) {}
        setPos(slider, pctFromEvent(e));
      } else {
        dragging = false;
        pending = { startX: e.clientX, startY: e.clientY };
      }
      window.addEventListener("pointermove", onMove, moveOpts);
      window.addEventListener("pointerup", stop);
      window.addEventListener("pointercancel", stop);
    });

    slider.addEventListener("keydown", function (e) {
      var cur = parseFloat(getComputedStyle(slider).getPropertyValue("--pos")) || 50;
      if (e.key === "ArrowLeft") { e.preventDefault(); setPos(slider, cur - 5); }
      else if (e.key === "ArrowRight") { e.preventDefault(); setPos(slider, cur + 5); }
      else if (e.key === "Home") { e.preventDefault(); setPos(slider, 0); }
      else if (e.key === "End") { e.preventDefault(); setPos(slider, 100); }
    });
  }

  function renderJob(job) {
    var before = IMG_DIR + job.before;
    var after = IMG_DIR + job.after;
    var w = job.width || 1600;
    var h = job.height || 1699;
    var place = job.neighborhood || "";
    if (place && job.zip) place += ", FL " + job.zip;
    var facts = [];
    if (place) facts.push(place);
    if (job.specs && job.specs.length) facts = facts.concat(job.specs);
    var note = job.note
      ? '<p class="recent-work-note">' + escapeHtml(job.note) + "</p>"
      : "";
    var list = facts.length
      ? '<ul class="recent-work-facts">' +
        facts.map(function (s) { return "<li>" + escapeHtml(s) + "</li>"; }).join("") +
        "</ul>"
      : "";
    var aria = "Before and after comparison" +
      (place ? ": " + place : "") +
      (job.service ? ", " + job.service : "");

    return (
      '<figure class="recent-work-job" data-job-id="' + escapeHtml(job.id || "") + '">' +
        '<div class="ba-slider" style="--pos:50%;--ba-w:' + w + ";--ba-h:" + h + ';" role="slider" tabindex="0" aria-label="' + escapeHtml(aria) + '" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" aria-valuetext="50 percent before">' +
          '<img class="ba-after" src="' + escapeHtml(after) + '" alt="' + escapeHtml(job.altAfter || "") + '" width="' + w + '" height="' + h + '" loading="lazy" decoding="async">' +
          '<img class="ba-before" src="' + escapeHtml(before) + '" alt="' + escapeHtml(job.altBefore || "") + '" width="' + w + '" height="' + h + '" loading="lazy" decoding="async">' +
          '<div class="ba-handle" aria-hidden="true">' +
            '<span class="ba-line"></span>' +
            '<span class="ba-knob">' +
              '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                '<path d="M7 4L3 9l4 5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>' +
                '<path d="M11 4l4 5-4 5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>' +
              "</svg>" +
            "</span>" +
          "</div>" +
        "</div>" +
        '<figcaption class="recent-work-caption">' +
          note +
          list +
        "</figcaption>" +
      "</figure>"
    );
  }

  function selectJobs(jobs, mode) {
    if (!jobs || !jobs.length) return [];
    if (mode === "all") return jobs;
    var featured = jobs.filter(function (j) { return j.home; });
    return featured.length ? featured : jobs.slice(0, 3);
  }

  function mount(jobs) {
    var grid = document.getElementById("recent-work-grid");
    if (!grid || !jobs || !jobs.length) return;
    grid.innerHTML = jobs.map(renderJob).join("");
    grid.querySelectorAll(".ba-slider").forEach(initSlider);
  }

  function start() {
    var grid = document.getElementById("recent-work-grid");
    if (!grid) return;
    var dataUrl = grid.getAttribute("data-src") || DATA_URL;
    var imgDir = grid.getAttribute("data-img-dir");
    if (imgDir) IMG_DIR = imgDir;
    var mode = grid.getAttribute("data-jobs") || "home";
    fetch(dataUrl, { credentials: "same-origin" })
      .then(function (res) { if (!res.ok) throw new Error("jobs.json " + res.status); return res.json(); })
      .then(function (data) { mount(selectJobs((data && data.jobs) || FALLBACK, mode)); })
      .catch(function () { mount(selectJobs(FALLBACK, mode)); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
