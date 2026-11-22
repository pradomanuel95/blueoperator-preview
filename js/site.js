(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var nodes = document.querySelectorAll("[data-reveal]");
  if (nodes.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      nodes.forEach(function (node) { node.classList.add("is-in"); });
    } else {
      var reveal = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          reveal.unobserve(entry.target);
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
      nodes.forEach(function (node) { reveal.observe(node); });
    }
  }

  document.querySelectorAll("[data-carousel]").forEach(function (root) {
    var scroller = root.querySelector("[data-carousel-track]");
    var prev = root.querySelector("[data-carousel-prev]");
    var next = root.querySelector("[data-carousel-next]");
    if (!scroller || !prev || !next) return;

    var amount = function () {
      var card = scroller.querySelector(".t-card");
      if (!card) return Math.max(240, scroller.clientWidth * 0.8);
      var styles = window.getComputedStyle(scroller);
      var gap = parseFloat(styles.columnGap || styles.gap) || 16;
      return card.getBoundingClientRect().width + gap;
    };

    var update = function () {
      var max = scroller.scrollWidth - scroller.clientWidth;
      prev.disabled = scroller.scrollLeft <= 2;
      next.disabled = scroller.scrollLeft >= max - 2;
    };

    var step = function (dir) {
      scroller.scrollBy({
        left: dir * amount(),
        behavior: reduce ? "auto" : "smooth"
      });
    };

    prev.addEventListener("click", function () { step(-1); });
    next.addEventListener("click", function () { step(1); });
    scroller.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  });

  var bar = document.querySelector(".sticky-contact");
  var photo = document.querySelector(".hero-photo");
  var inline = document.querySelector(".mobile-contact");
  var scroller = document.querySelector(".page-scroll");
  if (bar) {
    var dock = 68;
    var popped = false;
    try { popped = sessionStorage.getItem("boCallPop") === "1"; } catch (e) {}
    var sync = function () {
      var mobile = window.matchMedia("(max-width: 899px)").matches;
      if (!mobile) {
        bar.classList.remove("is-visible");
        if (header) header.classList.remove("is-scrolled");
        document.body.classList.remove("has-sticky");
        return;
      }
      var y = Math.max(window.scrollY || 0, scroller ? scroller.scrollTop : 0);
      var show = y > 40;
      if (header) header.classList.toggle("is-scrolled", show);
      var was = bar.classList.contains("is-visible");
      bar.classList.toggle("is-visible", show);
      if (show && !was && !reduce && !popped) {
        popped = true;
        try { sessionStorage.setItem("boCallPop", "1"); } catch (e) {}
        bar.classList.remove("is-popping");
        void bar.offsetWidth;
        bar.classList.add("is-popping");
      }
      document.body.classList.toggle("has-sticky", show);
    };
    if (scroller) scroller.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    window.addEventListener("pageshow", sync);
    window.addEventListener("orientationchange", sync);
    bar.addEventListener("animationend", function (e) { if (e.target === bar) bar.classList.remove("is-popping"); });
    sync();
  }
})();

(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function headerOffset() {
    var h = document.querySelector(".site-header");
    return (h ? h.getBoundingClientRect().height : 0) + 12;
  }
  function goTo(id, smooth) {
    var el = document.getElementById(id);
    if (!el) return false;
    el.classList.add("is-in");
    var y = 0, n = el;
    while (n) { y += n.offsetTop; n = n.offsetParent; }
    var top = y - headerOffset();
    window.scrollTo({ top: Math.max(0, top), behavior: smooth && !reduce ? "smooth" : "auto" });
    return true;
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest('a[href*="#our-story"]') : null;
    if (!a) return;
    var url = new URL(a.getAttribute("href"), location.href);
    if (url.pathname.replace(/index\.html$/, "") !== location.pathname.replace(/index\.html$/, "")) return;
    if (!document.getElementById("our-story")) return;
    e.preventDefault();
    var t = document.getElementById("nav-toggle");
    if (t) t.checked = false;
    goTo("our-story", true);
    if (history.replaceState) history.replaceState(null, "", "#our-story");
  });
  if (location.hash === "#our-story") {
    var land = function () { goTo("our-story", false); };
    window.addEventListener("load", function () { land(); setTimeout(land, 350); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(land);
  }
})();
(function () {
  document.querySelectorAll("[data-gallery]").forEach(function (g) {
    var track = g.querySelector("[data-gallery-track]");
    if (!track) return;
    var slides = track.children;
    var thumbs = g.querySelectorAll("[data-gallery-go]");
    function idx() { return Math.round(track.scrollLeft / Math.max(1, track.clientWidth)); }
    function go(i) {
      i = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
    }
    function mark() {
      var i = idx();
      thumbs.forEach(function (t, k) { t.classList.toggle("is-active", k === i); });
    }
    thumbs.forEach(function (t) { t.addEventListener("click", function () { go(+t.getAttribute("data-gallery-go")); }); });
    var p = g.querySelector("[data-gallery-prev]"), n = g.querySelector("[data-gallery-next]");
    if (p) p.addEventListener("click", function () { go(idx() - 1); });
    if (n) n.addEventListener("click", function () { go(idx() + 1); });
    track.addEventListener("scroll", function () { window.requestAnimationFrame(mark); }, { passive: true });
    mark();
  });
})();

/* Lead forms: load the endpoint config, the price logic and the form wiring on pages that have a form. */
(function () {
  if (!document.querySelector("form.estimate")) return;
  var me = document.querySelector('script[src*="js/site.js"]');
  var base = me ? me.src.replace(/js\/site\.js.*$/, "") : "";
  var V = "1811221300";
  function add(src, cb) { var s = document.createElement("script"); s.src = base + src + "?v=" + V; s.onload = cb || null; document.head.appendChild(s); }
  add("js/bo-config.js", function () { add("js/bo-quote.js", function () { add("js/forms.js"); }); });
})();
