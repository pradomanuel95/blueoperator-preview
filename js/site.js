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
  if (bar && photo && inline) {
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
      var photoBox = photo.getBoundingClientRect();
      var contactBox = inline.getBoundingClientRect();
      var limit = window.innerHeight - (document.body.classList.contains("has-sticky") ? dock : 0);
      var photoPast = photoBox.bottom < 4;
      var contactVisible = contactBox.bottom > 72 && contactBox.top < limit - 4;
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
