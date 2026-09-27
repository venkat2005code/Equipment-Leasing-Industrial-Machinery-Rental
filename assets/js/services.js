/* services.js — service-details page renderer (?service=customer-support|back-office|data-management)
   and the indicative pricing estimator on pricing.html. Content lives in the JSON block #service-data. */
(function () {
  'use strict';

  var BPO = window.BPO || {};
  var doc = document;
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };
  var esc = BPO.esc || function (x) { return String(x); };
  var icon = BPO.icon || function () { return ''; };
  var qs = new URLSearchParams(window.location.search);

  /* ---------- Service details ---------- */
  function renderService() {
    var root = $('[data-service-root]'), dataEl = $('#service-data');
    if (!root || !dataEl) { return; }
    var all;
    try { all = JSON.parse(dataEl.textContent); } catch (e) { return; }
    var key = qs.get('service');
    if (!all[key]) { key = 'customer-support'; }
    var d = all[key];

    var others = Object.keys(all).map(function (k) {
      var href = 'service-details.html' + (k === 'customer-support' ? '' : '?service=' + k);
      return '<li><a class="chip' + (k === key ? '' : '') + '" href="' + href + '"' + (k === key ? ' aria-current="page"' : '') + '>' + esc(all[k].title) + '</a></li>';
    }).join('');

    var caps = d.caps.map(function (c) {
      return '<article class="card cap-card" data-reveal><div class="card__body"><span class="icon-tile">' + icon(c[2], 'icon--lg') + '</span><h3>' + esc(c[0]) + '</h3><p>' + esc(c[1]) + '</p></div></article>';
    }).join('');
    var flow = d.workflow.map(function (w, i) {
      return '<li class="workflow__step" data-reveal><span class="workflow__num">' + (i + 1) + '</span><div><h3>' + esc(w[0]) + '</h3><p>' + esc(w[1]) + '</p></div></li>';
    }).join('');
    var benefits = d.benefits.map(function (b) {
      return '<li class="why-item" data-reveal><span class="icon-tile icon-tile--teal">' + icon('check-circle') + '</span><div><h3>' + esc(b[0]) + '</h3><p>' + esc(b[1]) + '</p></div></li>';
    }).join('');
    var tech = d.tech.map(function (t) { return '<li data-reveal><strong>' + esc(t[0]) + '</strong><span>' + esc(t[1]) + '</span></li>'; }).join('');
    var qa = d.qa.map(function (q) {
      return '<tr><th scope="row" data-label="Measure">' + esc(q[0]) + '</th><td data-label="Target">' + esc(q[1]) + '</td><td data-label="How it is measured">' + esc(q[2]) + '</td></tr>';
    }).join('');
    var sec = d.security.map(function (x) { return '<li>' + icon('shield-check') + '<span>' + esc(x) + '</span></li>'; }).join('');
    var faqs = d.faqs.map(function (f, i) {
      return '<div class="acc-item"><h3 class="acc-heading"><button type="button" class="acc-trigger">' + esc(f[0]) + icon('chevron-down') + '</button></h3><div class="acc-panel' + (i === 0 ? ' is-open' : '') + '"><div><div class="acc-panel__inner"><p>' + esc(f[1]) + '</p></div></div></div></div>';
    }).join('');
    var price = d.pricing.map(function (p) {
      return '<article class="card price-card" data-reveal><div class="card__body"><h3>' + esc(p[0]) + '</h3><p class="price-card__price">' + esc(p[1]) + '<span class="price-card__unit">' + esc(p[2]) + '</span></p><p>' + esc(p[3]) + '</p>' +
        '<div class="card__foot"><a class="btn btn--outline" href="partnership.html?model=' + esc(p[0].toLowerCase().replace(/\s+/g, '-')) + '">Request a quote' + icon('arrow-right', 'icon-dir') + '</a></div></div></article>';
    }).join('');
    var facts = d.facts.map(function (f) { return '<div><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('');
    var paras = d.overview.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');

    root.innerHTML =
      '<ul class="chips service-switch" aria-label="Choose a service">' + others + '</ul>' +
      '<div class="detail-layout"><div class="detail-main">' +
      '<section id="overview" aria-labelledby="ov-h"><h2 id="ov-h">Service overview</h2><div class="prose">' + paras + '</div>' +
      '<img class="media-frame media-light" src="../assets/images/' + esc(d.image) + '" alt="' + esc(d.imageAlt) + '" width="640" height="480" loading="lazy" decoding="async"></section>' +
      '<section id="capabilities" aria-labelledby="cap-h"><h2 id="cap-h">Key capabilities</h2><div class="grid grid--2" data-reveal-group>' + caps + '</div></section>' +
      '<section id="workflow" aria-labelledby="wf-h"><h2 id="wf-h">How the service works</h2><ol class="workflow" data-reveal-group>' + flow + '</ol></section>' +
      '<section id="benefits" aria-labelledby="ben-h"><h2 id="ben-h">Business benefits</h2><ul class="why__list why__list--single" data-reveal-group>' + benefits + '</ul></section>' +
      '<section id="technology" aria-labelledby="tech-h"><h2 id="tech-h">Technology and process</h2><ul class="tech-list" data-reveal-group>' + tech + '</ul></section>' +
      '<section id="quality" aria-labelledby="qa-h"><h2 id="qa-h">Quality assurance</h2><div class="table-wrap"><table class="table table--stack"><caption>Sample service-level targets — agree your own during service design.</caption><thead><tr><th scope="col">Measure</th><th scope="col">Target</th><th scope="col">How it is measured</th></tr></thead><tbody>' + qa + '</tbody></table></div></section>' +
      '<section id="security" aria-labelledby="sec-h"><h2 id="sec-h">Security considerations</h2><ul class="checklist checklist--roomy">' + sec + '</ul></section>' +
      '<section id="faqs" aria-labelledby="faq-h"><h2 id="faq-h">Frequently asked questions</h2><div class="accordion" data-accordion="single">' + faqs + '</div></section>' +
      '<section id="pricing" aria-labelledby="pr-h"><h2 id="pr-h">Engagement and pricing</h2><p class="lead">Typical commercial models for this service. <span class="badge badge--demo">Demo pricing — not a quotation</span></p><div class="grid grid--3" data-reveal-group>' + price + '</div>' +
      '<p class="mt-4"><a class="link-arrow" href="pricing.html">Compare all pricing models' + icon('arrow-right', 'icon-dir') + '</a></p></section>' +
      '</div>' +
      '<aside class="detail-aside" aria-label="Service summary"><div class="card"><div class="card__body"><h2 class="detail-aside__title">At a glance</h2><dl class="facts">' + facts + '</dl>' +
      '<a class="btn btn--primary btn--block" href="contact.html?service=' + esc(key) + '">Request a quote' + icon('arrow-right', 'icon-dir') + '</a>' +
      '<button type="button" class="btn btn--outline btn--block" data-modal-open="callback-modal">' + icon('phone') + 'Request a callback</button></div></div>' +
      '<nav class="card detail-toc" aria-label="On this page"><div class="card__body"><h2 class="detail-aside__title">On this page</h2><ol data-toc>' +
      [['overview', 'Overview'], ['capabilities', 'Capabilities'], ['workflow', 'Workflow'], ['benefits', 'Benefits'], ['technology', 'Technology'], ['quality', 'Quality'], ['security', 'Security'], ['faqs', 'FAQs'], ['pricing', 'Pricing']]
        .map(function (t) { return '<li><a href="#' + t[0] + '">' + t[1] + '</a></li>'; }).join('') + '</ol></div></nav></aside></div>';

    // Keep the page shell in sync with the selected service (title, meta, hero, JSON-LD)
    var title = d.title + ' Outsourcing Service | Alturis';
    var desc = d.tagline + ' Capabilities, workflow, benefits, quality, security, FAQs and demo pricing.';
    BPO.setHead({ title: title, desc: desc, query: key === 'customer-support' ? '' : '?service=' + key });
    var h1 = $('#page-title'); if (h1) { h1.textContent = d.title; }
    var lead = $('.page-hero .lead'); if (lead) { lead.textContent = d.tagline; }
    var crumb = $('.breadcrumb [aria-current]'); if (crumb) { crumb.textContent = d.title; }
    $$('script[type="application/ld+json"]').forEach(function (sc) {
      try {
        var j = JSON.parse(sc.textContent);
        if (j['@type'] === 'Service') { j.name = d.title + ' outsourcing'; j.description = d.tagline; sc.textContent = JSON.stringify(j, null, 2); }
        if (j['@type'] === 'BreadcrumbList') { j.itemListElement[2].name = d.title; sc.textContent = JSON.stringify(j, null, 2); }
      } catch (e) { /* ignore malformed JSON-LD */ }
    });
    if (BPO.enhance) { BPO.enhance(root); }
  }

  /* ---------- Pricing estimator (demo rates) ---------- */
  var MODELS = {
    'per-agent': { rate: 2400, label: 'Number of agents', hint: 'Full-time dedicated agents.', value: 25, unit: 'agents' },
    'per-hour': { rate: 14, label: 'Productive hours per month', hint: 'Total hours across all agents.', value: 4000, unit: 'hours' },
    'per-transaction': { rate: 0.85, label: 'Transactions per month', hint: 'Completed items such as orders, claims or records.', value: 60000, unit: 'transactions' },
    'per-process': { rate: 6500, label: 'Number of processes', hint: 'Distinct end-to-end processes in scope.', value: 2, unit: 'processes' }
  };
  var money = function (n) { return '$' + Math.round(n).toLocaleString('en-US'); };
  var round50 = function (n) { return Math.round(n / 50) * 50; };

  function initEstimator() {
    var root = $('[data-estimator]');
    if (!root) { return; }
    var f = { model: $('#est-model'), qty: $('#est-qty'), label: $('#est-qty-label'), hint: $('#est-qty-hint'), cov: $('#est-coverage'), cx: $('#est-complexity'),
      voice: $('#est-voice'), chat: $('#est-chat'), channels: $('#est-channels'), result: $('#est-result'), range: $('#est-range'), list: $('#est-breakdown') };

    function compute() {
      var m = f.model.value, spec = MODELS[m], qty = parseFloat(f.qty.value);
      f.list.replaceChildren();
      if (!(qty >= 1)) { f.result.textContent = '—'; f.range.textContent = 'Enter a quantity of 1 or more.'; return; }
      var cov = parseFloat(f.cov.value), cx = parseFloat(f.cx.value);
      var usesChannels = m === 'per-agent' || m === 'per-hour';
      f.channels.hidden = !usesChannels;
      var covMult = usesChannels ? cov : m === 'per-process' ? 1 + (cov - 1) * 0.5 : 1;
      var uplift = usesChannels ? (f.voice.checked ? 0.12 : 0) + (f.chat.checked ? 0.06 : 0) : 0;
      var disc = 1;
      if (m === 'per-agent') { disc = qty >= 100 ? 0.9 : qty >= 50 ? 0.95 : 1; }
      if (m === 'per-hour') { disc = qty >= 20000 ? 0.93 : qty >= 10000 ? 0.95 : 1; }
      if (m === 'per-transaction') { disc = qty >= 500000 ? 0.85 : qty >= 100000 ? 0.92 : 1; }
      var base = spec.rate * qty, total = base * covMult * (1 + uplift) * cx * disc;
      f.result.textContent = money(round50(total)) + ' / month';
      f.range.textContent = 'Typical range ' + money(round50(total * 0.9)) + ' – ' + money(round50(total * 1.1));
      var add = function (t) { var li = doc.createElement('li'); li.textContent = t; f.list.appendChild(li); };
      add('Base: ' + Math.round(qty).toLocaleString('en-US') + ' ' + spec.unit + ' × $' + spec.rate.toLocaleString('en-US') + ' = ' + money(base));
      if (covMult !== 1) { add('Service hours: ×' + covMult.toFixed(2)); }
      if (uplift) { add('Channels: +' + Math.round(uplift * 100) + '%'); }
      if (cx !== 1) { add('Complexity: ×' + cx.toFixed(2)); }
      if (disc !== 1) { add('Volume tier: −' + Math.round((1 - disc) * 100) + '%'); }
    }
    function setModel() {
      var spec = MODELS[f.model.value];
      f.label.textContent = spec.label; f.hint.textContent = spec.hint; f.qty.value = spec.value;
      compute();
    }
    f.model.addEventListener('change', setModel);
    [f.qty, f.cov, f.cx, f.voice, f.chat].forEach(function (el) { el.addEventListener('input', compute); el.addEventListener('change', compute); });
    var pre = qs.get('model');
    if (pre && MODELS[pre]) { f.model.value = pre; }
    setModel();
  }

  renderService();
  initEstimator();
})();
