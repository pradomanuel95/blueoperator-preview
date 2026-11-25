(function () {
  var DATA_URL = "assets/jobs/jobs.json";
  var IMG_DIR = "assets/jobs/";
  var FALLBACK = [
    {
      id: "kendall-green-to-clean",
      neighborhood: "Kendall",
      service: "Green-to-clean recovery",
      note: "The water had turned green. We brushed, balanced and filtered it back to clear.",
      before: "green-pool-before-kendall.webp",
      after: "green-to-clean-after-kendall.webp",
      altBefore: "Green rectangular pool in Kendall before recovery, with cloudy green water and a mosaic tile sun shelf.",
      altAfter: "The same Kendall pool after recovery, with clear water and a mosaic tile sun shelf.",
      width: 1600,
      height: 1699
    },
    {
      id: "miami-dade-green-to-clean",
      neighborhood: "Miami-Dade",
      service: "Green-to-clean recovery",
      before: "green-pool-before-miami-dade.webp",
      after: "green-to-clean-after-miami-dade.webp",
      altBefore: "Green kidney-shaped pool with a spa, pink deck, and shed in Miami-Dade, before recovery.",
      altAfter: "The same Miami-Dade kidney-shaped pool with a spa, pink deck, and shed, after recovery, with clear water.",
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

    function pctFromEvent(e) {
      var point = e.touches && e.touches.length ? e.touches[0] : e;
      var rect = slider.getBoundingClientRect();
      if (!rect.width) return 50;
      return ((point.clientX - rect.left) / rect.width) * 100;
    }

    function onMove(e) {
      if (!dragging) return;
      if (e.cancelable) e.preventDefault();
      setPos(slider, pctFromEvent(e));
    }

    function stop() {
      dragging = false;
      slider.classList.remove("is-dragging");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", stop);
      window.removeEventListener("touchcancel", stop);
    }

    slider.addEventListener("pointerdown", function (e) {
      if (e.button != null && e.button !== 0) return;
      dragging = true;
      slider.classList.add("is-dragging");
      try { slider.setPointerCapture(e.pointerId); } catch (err) {}
      setPos(slider, pctFromEvent(e));
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", stop);
      window.addEventListener("pointercancel", stop);
    });

    slider.addEventListener("touchstart", function (e) {
      dragging = true;
      slider.classList.add("is-dragging");
      setPos(slider, pctFromEvent(e));
      window.addEventListener("touchmove", onMove, { passive: false });
      window.addEventListener("touchend", stop);
      window.addEventListener("touchcancel", stop);
    }, { passive: true });

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
    var label = (job.neighborhood || "") + " · " + (job.service || "Green-to-clean recovery");
    var note = job.note
      ? '<p class="recent-work-note">' + escapeHtml(job.note) + "</p>"
      : "";
    var aria = "Before and after comparison: " + label;

    return (
      '<figure class="recent-work-job">' +
        '<div class="ba-slider" style="--pos:50%;--ba-w:' + w + ";--ba-h:" + h + ';" role="slider" tabindex="0" aria-label="' + escapeHtml(aria) + '" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" aria-valuetext="50 percent before">' +
          '<img class="ba-after" src="' + escapeHtml(after) + '" alt="' + escapeHtml(job.altAfter || "") + '" width="' + w + '" height="' + h + '" loading="lazy" decoding="async">' +
          '<div class="ba-before-wrap">' +
            '<img class="ba-before" src="' + escapeHtml(before) + '" alt="' + escapeHtml(job.altBefore || "") + '" width="' + w + '" height="' + h + '" loading="lazy" decoding="async">' +
          "</div>" +
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
          "<p>" + escapeHtml(label) + "</p>" +
          note +
        "</figcaption>" +
      "</figure>"
    );
  }

  function mount(jobs) {
    var grid = document.getElementById("recent-work-grid");
    if (!grid || !jobs || !jobs.length) return;
    grid.innerHTML = jobs.map(renderJob).join("");
    grid.querySelectorAll(".ba-slider").forEach(initSlider);
  }

  function start() {
    fetch(DATA_URL, { credentials: "same-origin" })
      .then(function (res) { if (!res.ok) throw new Error("jobs.json " + res.status); return res.json(); })
      .then(function (data) { mount((data && data.jobs) || FALLBACK); })
      .catch(function () { mount(FALLBACK); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
