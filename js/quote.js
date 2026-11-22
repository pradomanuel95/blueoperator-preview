/* quote.js: static /quote/ page (replaces the Wix router page "quote-page", live quote-page.simple.js).
   Loads a quote by token from Ops' Quote Load endpoint and posts Approve/Decline to Ops' Quote Decide endpoint.
   While BO_CFG.QUOTE_LIVE is false (now), it uses mock data and sends nothing. Card wording = live backend/quotes.js WORDING. */
(function () {
  'use strict';
  var CFG = window.BO_CFG || {};
  var WORDING = {"en": {"service": "BlueProtect Weekly Pool Service", "includes_title": "BlueProtect Weekly Pool Service Includes:", "line_items": [{"title": "Water Chemistry & Treatment", "items": ["Test and balance water chemistry to ensure safe, swimmable water and prevent algae or cloudiness (This includes chlorine, pH, alkalinity, stabilizer, and more.)", "Maintain proper LSI (Langelier Saturation Index) to protect pool surfaces and equipment (Helps prevent scaling, corrosion, and plaster damage by keeping water in balance.)"]}, {"title": "Cleaning & Maintenance", "items": ["Skim surface debris", "Brush walls, steps, and tiles", "Empty skimmer and pump baskets", "Vacuum", "Backwash / Clean filter (every month or when needed)", "Exclusive discounts on pool robots and cleaners"]}, {"title": "System Check", "items": ["Visual inspection of the pump, filter, timer, and automation", "Ensure proper system pressure and flow", "Monitor water level and notify if low or high (via text or email)", "Confirm that the salt cell, heater, and other equipment are operating correctly"]}], "report_note": "A detailed service report with photos is provided after each visit for your records and peace of mind", "filter_note": "*Multi-cartridge filters (4+): +$15/mo, includes quarterly filter deep clean.", "first_month_label": "First month:", "price_label": "Weekly Service Estimate:", "per_month": "a month", "brand": "(BlueProtect™ Service System)"}, "es": {"service": "Servicio semanal BlueProtect", "includes_title": "El servicio semanal BlueProtect incluye:", "line_items": [{"title": "Química y tratamiento del agua", "items": ["Analizar y balancear la química del agua para que sea segura para nadar y evitar algas o agua turbia (incluye cloro, pH, alcalinidad, estabilizador y más).", "Mantener el LSI (Índice de Saturación de Langelier) adecuado para proteger las superficies y el equipo de la piscina (ayuda a evitar sarro, corrosión y daños al plaster manteniendo el agua en balance)."]}, {"title": "Limpieza y mantenimiento", "items": ["Retirar la basura de la superficie", "Cepillar paredes, escalones y azulejos", "Vaciar las canastas del skimmer y de la bomba", "Aspirar", "Retrolavado / limpieza del filtro (cada mes o cuando haga falta)", "Descuentos exclusivos en robots y limpiadores de piscina"]}, {"title": "Revisión del sistema", "items": ["Inspección visual de la bomba, el filtro, el temporizador y la automatización", "Verificar que la presión y el flujo del sistema sean correctos", "Vigilar el nivel del agua y avisarle si está bajo o alto (por texto o correo electrónico)", "Confirmar que la celda de sal, el calentador y los demás equipos funcionen bien"]}], "report_note": "Después de cada visita le enviamos un reporte detallado con fotos para su control y tranquilidad", "filter_note": "*Filtros de varios cartuchos (4 o más): +$15/mes, incluye limpieza profunda del filtro cada tres meses.", "first_month_label": "Primer mes:", "price_label": "Cotización de servicio semanal:", "per_month": "al mes", "brand": "(Sistema de servicio BlueProtect™)"}};
  var T = {
    en: { hi: function (f) { return 'Hi ' + f + ", here's your weekly pool service quote"; }, approve: 'Approve Quote', decline: 'Decline',
      q: 'Questions? Call or text', after: 'after', off: 'off', valid: 'Valid for 30 days',
      ok: 'Thanks! Your quote is approved. We will contact you shortly to schedule your first visit.',
      no: 'Got it, you declined this quote.', err: 'Something went wrong. Please try again or call us.',
      exp: 'This quote has expired.', expQ: 'Call or text', loading: 'Loading your quote…',
      startup: '$70 off your weekly service after the startup',
      aiperH: 'Your bonus: Aiper EcoSurfer P1', aiper: '50% off, $194.97 (was $389.97), when you enroll in weekly pool service.' },
    es: { hi: function (f) { return 'Hola ' + f + ', aquí está su cotización de servicio semanal de piscina'; }, approve: 'Aprobar cotización', decline: 'Rechazar',
      q: '¿Preguntas? Llame o envíe un texto al', after: 'después de', off: 'de descuento', valid: 'Válida por 30 días',
      ok: '¡Gracias! Su cotización está aprobada. Le contactaremos en breve para programar su primera visita.',
      no: 'Entendido, rechazó esta cotización.', err: 'Algo salió mal. Intente de nuevo o llámenos.',
      exp: 'Esta cotización ha vencido.', expQ: 'Llame o envíe un texto al', loading: 'Cargando su cotización…',
      startup: '$70 de descuento en su servicio semanal después del arranque',
      aiperH: 'Su bono: Aiper EcoSurfer P1', aiper: '50% de descuento, $194.97 (antes $389.97), al inscribirse en el servicio semanal de piscina.' }
  };
  var PHONE = '<a class="q-phone" href="tel:+13059254491">(305)&nbsp;925-4491</a>';
  var BOLD = /exclusive|exclusivos|detailed service report|informe detallado|reporte detallado/i;
  var $ = function (id) { return document.getElementById(id); };
  var L = T.en, Q = null, busy = false;
  var qs = new URLSearchParams(location.search);
  var MOCK = CFG.QUOTE_LIVE !== true || !CFG.QUOTE_LOAD_URL;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function token() {
    var m = location.pathname.match(/\/quote\/([A-Za-z0-9]{16,40})\/?$/);
    if (m) return m[1];
    var t = qs.get('t') || '';
    return /^[A-Za-z0-9]{16,40}$/.test(t) ? t : '';
  }
  function setLang(lang) { L = T[lang === 'es' ? 'es' : 'en']; document.documentElement.lang = lang === 'es' ? 'es' : 'en'; }

  function cardHtml(q) {
    var w = (q.display && q.display.line_items) ? q.display : WORDING[q.language === 'es' ? 'es' : 'en'];
    var m = String(w.includes_title || '').match(/^(BlueProtect\S*)\s*(.*)$/);
    var s = '<h1 class="q-hi">' + esc(L.hi(q.first || '')) + '</h1>';
    s += '<h2 class="q-inc">' + (m ? '<strong>' + esc(m[1]) + '</strong> ' + esc(m[2]) : esc(w.includes_title)) + '</h2>';
    (w.line_items || []).forEach(function (sec, n, all) {
      var items = (sec.items || []).map(function (i) { return '<li>' + (BOLD.test(i) ? '<strong>' + esc(i) + '</strong>' : esc(i)) + '</li>'; });
      if (n === all.length - 1 && w.report_note) items.push('<li><strong>' + esc(w.report_note) + '</strong></li>');
      s += '<h3 class="q-sec">' + esc(sec.title) + '</h3><ul class="q-list">' + items.join('') + '</ul>';
    });
    if (w.filter_note) s += '<p class="q-note"><em>' + esc(w.filter_note) + '</em></p>';
    s += '<div class="q-price"><p class="q-price-label">' + esc(w.price_label) + '</p><p class="q-price-num">' + esc(q.price) + ' <span>' + esc(w.per_month) + '</span></p>';
    s += '<p class="q-valid">' + esc(L.valid) + '</p>';
    if (w.brand) s += '<p class="q-brand"><em>' + esc(w.brand) + '</em></p></div>'; else s += '</div>';
    var promo = String(q.promo || '').toUpperCase();
    if (promo === 'STARTUP' || promo === 'ARRANQUE') s += '<p class="q-band">' + esc(L.startup) + '</p>';
    else if (q.first_month) s += '<p class="q-band">' + esc(w.first_month_label) + ' <strong>' + esc(q.first_month) + '</strong> ' + esc(L.after) + ' ' + esc(q.discount || '$30') + ' ' + esc(L.off) + '</p>';
    if (q.kind === 'aiper') s += '<div class="q-bonus"><p class="q-bonus-h">' + esc(L.aiperH) + '</p><p>' + esc(L.aiper) + '</p></div>';
    return s;
  }
  function foot(status, err) {
    var done = status === 'approved' || status === 'declined', f = '';
    if (done) { $('q-btns').innerHTML = ''; f += '<p class="q-done' + (status === 'approved' ? ' q-ok' : '') + '">' + esc(status === 'approved' ? L.ok : L.no) + '</p>'; }
    if (err) f += '<p class="q-err" role="alert">' + esc(err) + '</p>';
    $('q-foot').innerHTML = f + '<p class="q-q">' + esc(L.q) + '<br>' + PHONE + '</p>';
  }
  function expired() {
    $('q-btns').innerHTML = ''; $('q-foot').innerHTML = '';
    $('q-body').innerHTML = '<h1 class="q-hi">' + esc(L.exp) + '</h1><p class="q-expq">' + esc(L.expQ) + ' ' + PHONE + '</p>';
  }
  function show(q) {
    Q = q; setLang(q.language);
    $('q-body').innerHTML = cardHtml(q);
    $('q-btns').innerHTML = '<button type="button" class="btn btn-yellow q-approve" id="q-approve">' + esc(L.approve) + '</button>' +
      '<button type="button" class="btn q-decline" id="q-decline">' + esc(L.decline) + '</button>';
    $('q-approve').addEventListener('click', function () { act('approve'); });
    $('q-decline').addEventListener('click', function () { act('decline'); });
    foot(q.status, '');
  }

  // ---------- data ----------
  function mockQuote(t) {
    var q = null;
    try { q = JSON.parse(sessionStorage.getItem('bo_mock_q_' + t) || 'null'); } catch (e) {}
    q = q || { ok: true, token: t, kind: qs.get('kind') === 'aiper' ? 'aiper' : 'postcard', status: 'pending', language: qs.get('lang') === 'es' ? 'es' : 'en',
      first: 'Truck', price: '$140', first_month: '$70', discount: '$70', promo: (qs.get('promo') || 'POSTCARD').toUpperCase() };
    if (q.promo === 'NEXTDOOR' || q.kind === 'aiper') { q.first_month = ''; q.discount = ''; }
    if (q.promo === 'NEIGHBOR' || q.promo === 'VECINO') { q.first_month = '$' + (parseInt(q.price.slice(1), 10) - 30); q.discount = '$30'; }
    var st = null; try { st = sessionStorage.getItem('bo_mock_status_' + t); } catch (e) {}
    var forced = qs.get('state');
    q.status = forced && /^(pending|approved|declined)$/.test(forced) ? forced : (st || q.status);
    return Promise.resolve(forced === 'expired' ? { ok: false } : q);
  }
  function load(t) {
    if (MOCK) return mockQuote(t);
    var u = CFG.QUOTE_LOAD_URL + (CFG.QUOTE_LOAD_URL.indexOf('?') === -1 ? '?' : '&') + 'token=' + encodeURIComponent(t);
    return fetch(u, { cache: 'no-store' }).then(function (r) { return r.json(); }).catch(function () { return { ok: false, error: 'network' }; });
  }
  function decide(action) {
    if (CFG.QUOTE_LIVE !== true || !CFG.QUOTE_DECIDE_URL) {
      try { console.info('[BO quote] QUOTE_LIVE=false, not sent:', { token: Q.token, action: action }); } catch (e) {}
      var status = action === 'approve' ? 'approved' : 'declined';
      try { sessionStorage.setItem('bo_mock_status_' + Q.token, status); } catch (e) {}
      return new Promise(function (res) { setTimeout(function () { res({ s: 200, j: { ok: true, action: action, status: status, mock: true } }); }, 600); });
    }
    return fetch(CFG.QUOTE_DECIDE_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: Q.token, action: action }) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { s: r.status, j: j }; }); });
  }
  function act(action) {
    if (busy) return; busy = true;
    var a = $('q-approve'), d = $('q-decline'); if (a) a.disabled = true; if (d) d.disabled = true;
    decide(action).then(function (x) {
      busy = false;
      if (x.j && x.j.ok) return foot(x.j.status || (action === 'approve' ? 'approved' : 'declined'), '');
      if (x.s === 404 || x.s === 410) return expired();
      throw new Error('decide');
    }).catch(function () { busy = false; if (a) a.disabled = false; if (d) d.disabled = false; foot('pending', L.err); });
  }

  var t = token();
  setLang(qs.get('lang') === 'es' ? 'es' : 'en');
  if (!t) return expired();
  $('q-body').innerHTML = '<p class="q-loading">' + esc(L.loading) + '</p>';
  load(t).then(function (q) { if (!q || !q.ok) return expired(); q.token = q.token || t; show(q); })
    .catch(function () { foot('pending', L.err); });
})();
