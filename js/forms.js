/* forms.js: wires every lead form on the site to the Website Form Relay (Make 7144400), same keys Wix sent.
   Loaded by site.js after bo-config.js and bo-quote.js. While BO_CFG.RELAY_LIVE is false NOTHING is sent:
   the payload is logged and {ok:true, ref} is simulated. Messages copy the live Wix wording (forms + campaign page code). */
(function () {
  'use strict';
  var CFG = window.BO_CFG || {}, BQ = window.BOQuote;
  var me = document.querySelector('script[src*="js/forms.js"]');
  var ROOT = me ? me.src.replace(/js\/forms\.js.*$/, '') : '/';
  var T0 = Date.now() - (window.performance && performance.now ? Math.round(performance.now()) : 0);
  var PHONE = '<a href="tel:+13059254491"><strong>305-925-4491</strong></a>';

  // ---------- page config ----------
  function slug() {
    var parts = location.pathname.split('/').filter(function (p) { return p && p !== 'index.html' && p !== 'blueoperator-preview'; });
    return parts.length ? parts[parts.length - 1].toLowerCase() : 'home';
  }
  var S = slug();
  var CAMPAIGN = {
    postcard:    { promo: 'POSTCARD',    lang: 'en' },
    postal:      { promo: 'POSTCARD',    lang: 'es' },   // live /postal sends POSTCARD
    kendall70:   { promo: 'KENDALL70',   lang: 'en', source: 'Facebook Group - Kendall',    coupon_code: 'KENDALL70' },
    cutlerbay70: { promo: 'CUTLERBAY70', lang: 'en', source: 'Facebook Group - Cutler Bay', coupon_code: 'CUTLERBAY70' },
    neighbor:    { promo: 'NEIGHBOR',    lang: 'en' },
    vecino:      { promo: 'VECINO',      lang: 'es' },
    nextdoor:    { promo: 'NEXTDOOR',    lang: 'en' },
    startup:     { promo: 'STARTUP',     lang: 'en' },
    arranque:    { promo: 'STARTUP',     lang: 'es' }    // Manuel: STARTUP on both sides
  };
  var AIPER = { 'aiper-signup-a': 'a', 'aiper-signup-c': 'c' };
  var OFFER = { 'contact-us-aiper': 'aiper', 'contact-us-30-off': '30-off', '2-contact-us-30-off': '30-off-2' };

  var STR = {
    en: {
      thanks: function (f) { return 'Thanks' + (f ? ', ' + esc(f) : '') + '!'; },
      received: 'Thanks, we received your submission.',
      preparing: 'Preparing your quote', preparingSub: 'This takes a few seconds. Please keep this page open.',
      onItsWay: 'Your quote is on its way by text.', quoteReady: 'Your quote is ready.', viewQuote: 'View your quote',
      shallowContact: "Thanks! We'll contact you shortly about your quote.",
      gotInfo: "We got your info and we'll be in touch soon with your weekly service quote.",
      outArea: "Sorry, we don't service your area yet. But you can still check out our pool cleaner specials.",
      cleanersLink: 'See our pool cleaner specials',
      phoneLine: 'Questions? Call or text ' + PHONE,
      retry: "Sorry, that didn't go through. Please try again, or call or text " + PHONE + '.',
      badPhone: 'Enter a 10-digit phone number.', pickService: 'Choose at least one service.',
      sending: 'Sending…'
    },
    es: {
      thanks: function (f) { return '¡Gracias' + (f ? ', ' + esc(f) : '') + '!'; },
      received: 'Gracias, recibimos su información.',
      preparing: 'Preparando su cotización', preparingSub: 'Esto toma unos segundos. Por favor no cierre esta página.',
      onItsWay: 'Su cotización va en camino por texto.', quoteReady: 'Su cotización está lista.', viewQuote: 'Ver su cotización',
      shallowContact: '¡Gracias! Le contactaremos en breve sobre su cotización.',
      gotInfo: 'Recibimos su información y le contactaremos pronto con el precio de su servicio semanal.',
      outArea: 'Lo sentimos, todavía no damos servicio en su zona. Pero puede ver nuestras ofertas de limpiadores de piscina.',
      cleanersLink: 'Vea nuestras ofertas de limpiadores de piscina',
      phoneLine: '¿Preguntas? Llame o envíe un texto al ' + PHONE,
      retry: 'Lo sentimos, no se pudo enviar. Intente de nuevo, o llame o envíe un texto al ' + PHONE + '.',
      badPhone: 'Escriba un número de teléfono de 10 dígitos.', pickService: 'Elija al menos un servicio.',
      sending: 'Enviando…'
    }
  };

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function val(form, name) { var el = form.elements[name]; return el && typeof el.value === 'string' ? el.value.trim().slice(0, 300) : (el && el.value ? String(el.value).trim() : ''); }
  function digits(s) { return String(s || '').replace(/\D/g, ''); }
  function phoneOk(s) { var d = digits(s); return d.length === 10 || (d.length === 11 && d[0] === '1'); }
  function uuid() {
    var c = window.crypto;
    if (c && c.randomUUID) return c.randomUUID();
    return BQ ? BQ.newRef() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (ch) { var r = Math.random() * 16 | 0; return (ch === 'x' ? r : (r & 3 | 8)).toString(16); });
  }
  function entrySrc() { var q = new URLSearchParams(location.search).get('src') || ''; q = q.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40); return q || 'direct'; }
  var blank = function (n) { return n === null || n === undefined ? '' : n; };

  // ---------- transport ----------
  function send(payload) {
    if (CFG.RELAY_LIVE !== true || !CFG.RELAY_URL) {
      try { console.info('[BO forms] RELAY_LIVE=false, not sent. Payload:', payload); } catch (e) {}
      window.__boLastPayload = payload;
      return new Promise(function (res) { setTimeout(function () { res({ ok: true, ref: payload.submission_id, mock: true }); }, 700); });
    }
    return fetch(CFG.RELAY_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }).then(function (j) { return r.ok && j && j.ok ? j : { ok: false, error: (j && j.error) || 'http_' + r.status }; }); })
      .catch(function () { return { ok: false, error: 'network' }; });
  }
  function quoteStatus(ref) {
    if (CFG.QUOTE_LIVE !== true || !CFG.QUOTE_STATUS_URL) return Promise.resolve(null);
    return fetch(CFG.QUOTE_STATUS_URL + (CFG.QUOTE_STATUS_URL.indexOf('?') === -1 ? '?' : '&') + 'ref=' + encodeURIComponent(ref), { cache: 'no-store' })
      .then(function (r) { return r.json(); }).catch(function () { return null; });
  }

  // ---------- shared UI ----------
  function addHoneypot(form) {
    if (form.querySelector('input[name="company_website"]')) return;
    var w = document.createElement('div');
    w.className = 'bo-hp'; w.setAttribute('aria-hidden', 'true');
    w.innerHTML = '<label>Company website<input type="text" name="company_website" tabindex="-1" autocomplete="off"></label>';
    form.appendChild(w);
  }
  function phoneGuard(form, L) {
    var p = form.elements['Phone'];
    if (!p) return;
    p.setAttribute('inputmode', 'tel');
    var check = function () { p.setCustomValidity(p.value && !phoneOk(p.value) ? L.badPhone : ''); };
    p.addEventListener('input', check); p.addEventListener('blur', check);
  }
  function msgEl(form) {
    var m = form.querySelector('.bo-form-msg');
    if (!m) { m = document.createElement('p'); m.className = 'bo-form-msg'; m.setAttribute('role', 'alert'); var nav = form.querySelector('.step-2 .step-nav') || form.querySelector('.step-nav'); (nav || form).insertAdjacentElement('afterend', m); }
    return m;
  }
  function busy(form, on, L) {
    var b = form.querySelector('button[type="submit"]');
    if (!b) return;
    if (on) { b.dataset.label = b.textContent; b.disabled = true; b.textContent = L.sending; }
    else { b.disabled = false; if (b.dataset.label) b.textContent = b.dataset.label; }
  }
  function card(form) { return form.querySelector('.estimate-card') || form; }
  function showBox(form, html) {
    var c = card(form);
    var box = form.parentNode.querySelector('.bo-result');
    if (!box) { box = document.createElement('div'); box.className = 'estimate-card bo-result'; box.setAttribute('role', 'status'); box.setAttribute('aria-live', 'polite'); form.parentNode.insertBefore(box, form); }
    box.innerHTML = html;
    form.hidden = true; c.hidden = true;
    try { box.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) {}
    return box;
  }
  var H = function (t) { return '<h3 class="bo-result-h">' + t + '</h3>'; };
  var P = function (t, cls) { return '<p' + (cls ? ' class="' + cls + '"' : '') + '>' + t + '</p>'; };

  // ---------- A/B: Free Estimate + Claim Offer (2-step) ----------
  function wireEstimate(form) {
    var L = STR.en, offer = OFFER[S];
    addHoneypot(form); phoneGuard(form, L);
    form.setAttribute('novalidate', '');   // we validate per step ourselves (hidden step fields can't show native bubbles)
    var step1 = form.querySelector('.step-1'), step2 = form.querySelector('.step-2');
    function invalidIn(box) {
      if (!box) return null;
      var els = box.querySelectorAll('input,select,textarea');
      for (var i = 0; i < els.length; i++) if (!els[i].checkValidity()) return els[i];
      return null;
    }
    function gotoStep(n) { var r = form.querySelector('#form-step-' + n) || form.querySelector('.step-radio:nth-of-type(' + n + ')'); if (r) r.checked = true; }
    form.querySelectorAll('label[for$="step-2"]').forEach(function (lbl) {
      lbl.addEventListener('click', function (ev) {
        var p = form.elements['Phone']; if (p) p.setCustomValidity(p.value && !phoneOk(p.value) ? L.badPhone : '');
        var bad = invalidIn(step1);
        if (bad) { ev.preventDefault(); bad.reportValidity(); }
      });
    });
    var boxes = form.querySelectorAll('input[name="Choose Services Needed"]');
    boxes.forEach(function (b) { b.addEventListener('change', function () { boxes[0].setCustomValidity(''); }); });
    var sending = false;
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (sending) return;
      var p = form.elements['Phone']; if (p) p.setCustomValidity(p.value && !phoneOk(p.value) ? L.badPhone : '');
      var bad1 = invalidIn(step1);
      if (bad1) { gotoStep(1); setTimeout(function () { bad1.reportValidity(); }, 30); return; }
      var services = [].filter.call(boxes, function (b) { return b.checked; }).map(function (b) { return b.value; });
      if (boxes.length && !services.length) { boxes[0].setCustomValidity(L.pickService); boxes[0].reportValidity(); return; }
      var bad2 = invalidIn(step2 || form);
      if (bad2) { bad2.reportValidity(); return; }
      var payload = {
        form_type: offer ? 'offer' : 'estimate', submission_id: uuid(), page: S,
        first_name: val(form, 'First name'), last_name: val(form, 'Last name'), phone: val(form, 'Phone'),
        email: val(form, 'Email').toLowerCase(), address: val(form, 'Address'), services: services.join(', '),
        coupon: val(form, 'Coupon Code'), company_website: val(form, 'company_website'), elapsed_ms: Date.now() - T0
      };
      if (offer) payload.offer = offer;
      sending = true; busy(form, true, L); msgEl(form).textContent = '';
      send(payload).then(function (r) {
        if (r && r.ok) { showBox(form, H(esc(L.received)) + P(L.phoneLine)); return; }
        sending = false; busy(form, false, L); msgEl(form).innerHTML = L.retry;
      });
    });
  }

  // ---------- C/D: campaign quote + Aiper signup ----------
  var QKEY = 'bo_quotelink_' + S, QMAX = 6 * 3600 * 1000;
  function quoteUrl(token, mock) { return ROOT + 'quote/?t=' + encodeURIComponent(token) + (mock ? '&mock=1' : ''); }
  function saveLink(url, first) { try { sessionStorage.setItem(QKEY, JSON.stringify({ url: url, first: first || '', ts: Date.now() })); } catch (e) {} }
  function loadLink() { try { var o = JSON.parse(sessionStorage.getItem(QKEY) || 'null'); return o && o.url && Date.now() - (o.ts || 0) < QMAX ? o : null; } catch (e) { return null; } }

  function wireQuote(form) {
    var camp = CAMPAIGN[S], aiperPv = AIPER[S];
    var lang = camp ? camp.lang : (document.documentElement.lang === 'es' ? 'es' : 'en');
    var L = STR[lang];
    addHoneypot(form); phoneGuard(form, L);
    var zip = form.elements['Zip code'];
    if (zip) { zip.setAttribute('inputmode', 'numeric'); zip.setAttribute('pattern', '[0-9]{5}'); zip.setAttribute('maxlength', '5'); }

    // conditional size inputs (Wix rules: gallons / measurements / don't know)
    var groups = { gallons: form.querySelector('[data-size="gallons"]'), measurements: form.querySelector('[data-size="measurements"]'), unknown: form.querySelector('[data-size="unknown"]') };
    function sync() {
      var r = form.querySelector('input[name="Pool size"]:checked');
      var c = r ? BQ.evaluate({ pool_size_known: r.value }).choice : '';
      Object.keys(groups).forEach(function (k) {
        var g = groups[k]; if (!g) return;
        var on = k === c; g.hidden = !on;
        g.querySelectorAll('input').forEach(function (i) { i.required = on; i.disabled = !on; });
      });
    }
    form.querySelectorAll('input[name="Pool size"]').forEach(function (r) { r.addEventListener('change', sync); });
    sync();

    var saved = loadLink();
    if (saved) { showBox(form, H(L.thanks(saved.first)) + P(esc(L.quoteReady)) + P('<a class="btn btn-yellow" href="' + esc(saved.url) + '">' + esc(L.viewQuote) + '</a>') + P(L.phoneLine, 'bo-result-small')); }

    var sending = false;
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (sending) return;
      var p = form.elements['Phone']; if (p) p.setCustomValidity(p.value && !phoneOk(p.value) ? L.badPhone : '');
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var size = form.querySelector('input[name="Pool size"]:checked');
      var v = {
        first_name: val(form, 'First name'), last_name: val(form, 'Last name'), phone: val(form, 'Phone'), email: val(form, 'Email').toLowerCase(),
        service_address: val(form, 'Service address'), zip: val(form, 'Zip code'), pool_size_known: size ? size.value : '',
        pool_gallons: val(form, 'pool_gallons'), pool_length_ft: val(form, 'pool_length_ft'), pool_width_ft: val(form, 'pool_width_ft')
      };
      if (aiperPv) v.pool_avg_depth_ft = val(form, 'pool_avg_depth_ft');
      else { v.pool_shallow_depth_ft = val(form, 'pool_shallow_depth_ft'); v.pool_deep_depth_ft = val(form, 'pool_deep_depth_ft'); }
      var r = BQ.evaluate(v), ref = uuid();
      var payload = {
        form_type: aiperPv ? 'aiper' : 'postcard', submission_id: ref,
        first_name: v.first_name, last_name: v.last_name, phone: v.phone, email: v.email, address: v.service_address, zip: r.zip || v.zip,
        gallons: blank(r.gallons), length_ft: blank(r.lengthFt), width_ft: blank(r.widthFt), avg_depth_ft: blank(r.depthFt),
        calc_gallons: blank(r.calcGallons), pool_size_unknown: r.poolSizeUnknown,
        company_website: val(form, 'company_website'), elapsed_ms: Date.now() - T0
      };
      if (aiperPv) { payload.page_version = aiperPv; }
      else {
        var es = camp.lang === 'es';
        payload.page = S;
        payload.shallow_depth_ft = blank(r.shallowFt); payload.deep_depth_ft = blank(r.deepFt); payload.depth_too_shallow = !!r.depthTooShallow;
        payload.page_version = es ? 'postcard-es' : 'postcard-en'; payload.language = es ? 'Spanish' : 'English'; payload.lead_source = es ? 'Postcard-ES' : 'Postcard-EN';
        payload.entry_src = entrySrc(); payload.promo_code = camp.promo; payload.source = camp.source || ''; payload.coupon_code = camp.coupon_code || '';
      }
      sending = true; busy(form, true, L); msgEl(form).textContent = '';
      send(payload).then(function (res) {
        if (!res || !res.ok) { sending = false; busy(form, false, L); msgEl(form).innerHTML = L.retry; return; }
        after(form, L, r, ref, res.mock, aiperPv ? 'aiper' : 'postcard', camp ? camp.promo : 'AIPER', lang);
      });
    });
  }

  function after(form, L, r, ref, mock, kind, promo, lang) {
    var first = r.firstName;
    if (r.outcome === 'out_of_area') {
      return showBox(form, H(L.thanks(first)) + P(esc(L.outArea)) + P('<a href="' + ROOT + 'cleaners/"><strong>' + esc(L.cleanersLink) + '</strong></a>') + P(L.phoneLine, 'bo-result-small'));
    }
    if (r.depthTooShallow) return showBox(form, H(esc(L.shallowContact)) + P(L.phoneLine, 'bo-result-small'));
    if (r.outcome !== 'quote') return showBox(form, H(L.thanks(first)) + P(esc(L.gotInfo)) + P(L.phoneLine, 'bo-result-small'));
    // priced: "Preparing your quote…" then go to the quote page (same as Wix), or "on its way by text" after 45 s
    var dots = 0, box = showBox(form, '');
    function prep() { box.innerHTML = '<div class="bo-spinner" aria-hidden="true"></div>' + H(esc(L.preparing) + '<span class="bo-dots">' + '...'.slice(0, dots % 4) + '</span>') + P(esc(L.preparingSub)); }
    prep(); var timer = setInterval(function () { dots++; var d = box.querySelector('.bo-dots'); if (d) d.textContent = '...'.slice(0, dots % 4); }, 500);
    var start = Date.now();
    function done(html) { clearInterval(timer); box.innerHTML = html; }
    function go(token, m) {
      var url = quoteUrl(token, m), left = (CFG.MIN_PREP_MS || 3000) - (Date.now() - start);
      setTimeout(function () { clearInterval(timer); saveLink(url, first); location.href = url; }, Math.max(0, left));
    }
    if (mock) {
      // simulate Ops' Quote Create + Quote Status: build the same quote locally so the quote page can show it
      var token = 'mock' + ref.replace(/-/g, '').slice(0, 18), n = BQ.cardNumbers(r.price, promo);
      try { sessionStorage.setItem('bo_mock_q_' + token, JSON.stringify({ ok: true, token: token, kind: kind, status: 'pending', language: lang, first: first,
        price: n.price, first_month: n.first_month_price, discount: n.discount, promo: promo, gallons: r.calcGallons })); } catch (e) {}
      return setTimeout(function () { go(token, true); }, 1200);
    }
    if (CFG.QUOTE_LIVE !== true || !CFG.QUOTE_STATUS_URL) {
      return setTimeout(function () { done(H(L.thanks(first)) + P(esc(L.onItsWay)) + P(L.phoneLine, 'bo-result-small')); }, CFG.MIN_PREP_MS || 3000);
    }
    (function poll() {
      if (Date.now() - start > (CFG.MAX_WAIT_MS || 45000)) return done(H(L.thanks(first)) + P(esc(L.onItsWay)) + P(L.phoneLine, 'bo-result-small'));
      setTimeout(function () {
        quoteStatus(ref).then(function (s) {
          if (s && s.ok && s.state === 'ready' && /^[A-Za-z0-9]{16,40}$/.test(s.token || '')) return go(s.token, false);
          if (s && s.ok && /^(no_price|failed)$/.test(s.state || '')) return done(H(L.thanks(first)) + P(esc(L.gotInfo)) + P(L.phoneLine, 'bo-result-small'));
          poll();
        });
      }, CFG.POLL_MS || 2000);
    })();
  }

  // ---------- boot ----------
  if (!BQ) { try { console.warn('[BO forms] bo-quote.js missing'); } catch (e) {} }
  document.querySelectorAll('form.estimate').forEach(function (form) {
    if (form.classList.contains('cp-form')) { if (BQ) wireQuote(form); }
    else wireEstimate(form);
  });
})();
