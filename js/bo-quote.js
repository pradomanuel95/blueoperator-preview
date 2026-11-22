/* bo-quote.js — static-site port of the live Wix quote logic (SKELETON, not wired to any endpoint).
   Sources (live, read Nov 22 2026): public/aiperQuoteCalc.js (bundled into the campaign page code),
   backend/quotes.js (pricing + card wording + promo discount). Pure functions; no network calls here. */
(function (root) {
  'use strict';
  var SERVICE_ZIPS = ['33129','33133','33134','33135','33143','33145','33146','33149','33155','33156','33157','33158',
    '33165','33170','33173','33174','33175','33176','33177','33183','33184','33185','33186','33187',
    '33189','33190','33193','33194','33196','33030','33031','33032','33033','33034','33035','33039'];
  var TIERS = [[17000,140],[22000,150],[26000,175],[30000,190],[35000,210]];
  var MAX_GAL = 35000, MIN_GAL = 1000, MAX_LEN = 150, MAX_DEPTH = 20, MIN_END_DEPTH = 2;
  // Wix backend/quotes.js PROMO_DISCOUNT (anything else = 30). Make sends KENDALL70/CUTLERBAY70 as POSTCARD ($70).
  // STARTUP/ARRANQUE = $70 off weekly service after the startup (Manuel, Nov 22). AIPER = no first-month discount.
  var PROMO_DISCOUNT = { POSTCARD: 70, POSTAL: 70, KENDALL70: 70, CUTLERBAY70: 70, STARTUP: 70, ARRANQUE: 70, NEXTDOOR: 0, AIPER: 0 };
  function discountFor(promo) { var d = PROMO_DISCOUNT[String(promo || '').toUpperCase().trim()]; return typeof d === 'number' ? d : 30; }

  function str(v) { return v == null ? '' : String(v).trim().slice(0, 300); }
  function num(v) { if (v === undefined || v === null || v === '') return null; if (typeof v === 'number') return isFinite(v) ? v : null;
    var m = String(v).replace(/,/g, '').match(/-?\d+(\.\d+)?/); if (!m) return null; var n = parseFloat(m[0]); return isFinite(n) ? n : null; }
  function zipOf(v) { var m = str(v).match(/\d{5}/); return m ? m[0] : ''; }
  function choiceOf(v) {
    var s = str(Array.isArray(v) ? v[0] : v).toLowerCase().replace(/[\u2018\u2019]/g, "'");
    if (s.indexOf('gallon') !== -1) return 'gallons';
    if (s.indexOf('measure') !== -1) return 'measurements';
    if (s.indexOf("don't") !== -1 || s.indexOf('dont') !== -1 || s.indexOf('not sure') !== -1) return 'unknown';
    if (s.indexOf('galon') !== -1 || s.indexOf('galón') !== -1) return 'gallons';
    if (s.indexOf('medida') !== -1) return 'measurements';
    if (s === 'no sé' || s === 'no se' || s.indexOf('no sé') === 0 || s.indexOf('no se ') === 0 || s.indexOf('no estoy') !== -1) return 'unknown';
    return '';
  }
  function calcGallons(choice, g, L, W, D) {
    if (choice === 'unknown') return null;
    if (choice === 'gallons' || (choice === '' && g !== null)) return (g === null || g < MIN_GAL) ? null : Math.round(g);
    if (choice === 'measurements' || choice === '') {
      var ok = function (x) { return x !== null && x > 0; };
      if (!ok(L) || !ok(W) || !ok(D)) return null;
      if (L > MAX_LEN || W > MAX_LEN || D > MAX_DEPTH) return null;
      var r = Math.round(L * W * D * 7.5); return r >= MIN_GAL ? r : null;
    }
    return null;
  }
  function priceFor(g) { if (g == null || g <= 0 || g > MAX_GAL) return null; for (var i = 0; i < TIERS.length; i++) if (g <= TIERS[i][0]) return TIERS[i][1]; return null; }

  // values use the Wix field keys: first_name, zip, pool_size_known, pool_gallons, pool_length_ft, pool_width_ft,
  // pool_avg_depth_ft (Aiper) or pool_shallow_depth_ft + pool_deep_depth_ft (campaign forms).
  function evaluate(v) {
    v = v || {};
    var choice = choiceOf(v.pool_size_known), useGal = choice === 'gallons' || choice === '', useMeas = choice === 'measurements' || choice === '';
    var g = useGal ? num(v.pool_gallons) : null, L = useMeas ? num(v.pool_length_ft) : null, W = useMeas ? num(v.pool_width_ft) : null;
    var sh = useMeas ? num(v.pool_shallow_depth_ft) : null, dp = useMeas ? num(v.pool_deep_depth_ft) : null;
    var two = sh !== null || dp !== null;
    var tooShallow = two && ((sh !== null && sh < MIN_END_DEPTH) || (dp !== null && dp < MIN_END_DEPTH));
    var D;
    if (!useMeas) D = null; else if (!two) D = num(v.pool_avg_depth_ft);
    else if (tooShallow || sh === null || dp === null || sh > MAX_DEPTH || dp > MAX_DEPTH) D = null;
    else D = Math.round(((sh + dp) / 2) * 100) / 100;
    var zip = zipOf(v.zip), inArea = SERVICE_ZIPS.indexOf(zip) !== -1, cg = calcGallons(choice, g, L, W, D), price = priceFor(cg);
    var outcome = !inArea ? 'out_of_area' : cg === null ? 'unknown_size' : price === null ? 'over_35k' : 'quote';
    return { outcome: outcome, choice: choice, zip: zip, inArea: inArea, calcGallons: cg, price: price, gallons: g, lengthFt: L, widthFt: W,
      depthFt: D, shallowFt: sh, deepFt: dp, depthTooShallow: outcome === 'unknown_size' && tooShallow,
      firstName: str(v.first_name).split(/\s+/)[0] || '', poolSizeUnknown: cg === null };
  }
  function newRef() {
    var c = root.crypto; if (c && c.randomUUID) return c.randomUUID();
    var b = new Uint8Array(16); c.getRandomValues(b); b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128;
    var h = Array.prototype.map.call(b, function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
    return h.slice(0,8) + '-' + h.slice(8,12) + '-' + h.slice(12,16) + '-' + h.slice(16,20) + '-' + h.slice(20);
  }
  // Card numbers exactly as Wix buildDisplay(): price "$140", first_month_price "$70" ('' when discount 0), discount "$70".
  function cardNumbers(monthly, promo) {
    var d = discountFor(promo);
    return { price: '$' + monthly, first_month_price: d ? '$' + (monthly - d) : '', discount: d ? '$' + d : '' };
  }
  root.BOQuote = { SERVICE_ZIPS: SERVICE_ZIPS, TIERS: TIERS, PROMO_DISCOUNT: PROMO_DISCOUNT, discountFor: discountFor,
    evaluate: evaluate, priceFor: priceFor, newRef: newRef, cardNumbers: cardNumbers };
})(typeof window !== 'undefined' ? window : globalThis);
