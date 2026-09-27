/* case-studies.js — renders case-study-details.html from the JSON block #case-data using ?case=<slug>.
   The listing page (case-studies.html) uses the shared filter engine in main.js and needs no code here. */
(function () {
  'use strict';

  var BPO = window.BPO || {};
  var doc = document;
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var esc = BPO.esc || function (x) { return String(x); };
  var icon = BPO.icon || function () { return ''; };
  var root = $('[data-case-root]'), dataEl = $('#case-data');
  if (!root || !dataEl) { return; }
  var all;
  try { all = JSON.parse(dataEl.textContent); } catch (e) { return; }
  var key = BPO.qs.get('case');
  if (!all[key]) { key = 'healthcare-patient-support'; }
  var c = all[key];

  var paras = function (a) { return a.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join(''); };
  var facts = [['Client', c.client + ' (fictional)'], ['Industry', c.industry], ['Region', c.region], ['Time to go-live', c.duration]]
    .map(function (f) { return '<div><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('');
  var services = c.services.map(function (s) { return '<li class="tag">' + esc(s) + '</li>'; }).join('');
  var approach = c.approach.map(function (a) { return '<li>' + icon('check-circle') + '<span>' + esc(a) + '</span></li>'; }).join('');
  var process = c.process.map(function (p, i) {
    return '<li class="workflow__step" data-reveal><span class="workflow__num">' + (i + 1) + '</span><div><h3>' + esc(p[0]) + ' <span class="badge badge--teal">' + esc(p[2]) + '</span></h3><p>' + esc(p[1]) + '</p></div></li>';
  }).join('');
  var outcome = c.outcome.map(function (o) { return '<li>' + icon('trending-up') + '<span>' + esc(o) + '</span></li>'; }).join('');
  var metrics = c.metrics.map(function (m) { return '<div class="metric" data-reveal><dt>' + esc(m[1]) + '</dt><dd>' + esc(m[0]) + '</dd></div>'; }).join('');
  var timeline = c.timeline.map(function (t) { return '<li class="timeline__item" data-reveal><span class="timeline__when">' + esc(t[0]) + '</span><p>' + esc(t[1]) + '</p></li>'; }).join('');
  var related = c.related.filter(function (k) { return all[k]; }).map(function (k) {
    var r = all[k];
    return '<article class="card card--hover case-card"><div class="card__media"><img src="../assets/images/' + esc(r.image) + '" alt="" width="480" height="320" loading="lazy" decoding="async"><span class="card__badge badge badge--amber">Demo Case Study</span></div>' +
      '<div class="card__body"><p class="case-card__industry">' + esc(r.industry) + '</p><h3>' + esc(r.title) + '</h3><p>' + esc(r.summary) + '</p>' +
      '<div class="card__foot"><a class="link-arrow card-link" href="case-study-details.html?case=' + esc(k) + '">View Case Study' + icon('arrow-right', 'icon-dir') + '<span class="visually-hidden">: ' + esc(r.title) + '</span></a></div></div></article>';
  }).join('');

  root.innerHTML =
    '<div class="detail-layout"><div class="detail-main">' +
    '<section id="overview" aria-labelledby="ov-h"><h2 id="ov-h">Overview</h2><p class="lead">' + esc(c.summary) + '</p>' +
    '<img class="media-frame" src="../assets/images/' + esc(c.image) + '" alt="Illustration for the ' + esc(c.title) + ' case study" width="480" height="320" decoding="async"></section>' +
    '<section id="challenge" aria-labelledby="ch-h"><h2 id="ch-h">Client challenge</h2><div class="prose">' + paras(c.challenge) + '</div></section>' +
    '<section id="context" aria-labelledby="cx-h"><h2 id="cx-h">Business context</h2><div class="prose"><p>' + esc(c.context) + '</p></div></section>' +
    '<section id="solution" aria-labelledby="so-h"><h2 id="so-h">Solution</h2><ul class="checklist checklist--roomy">' + approach + '</ul><h3 class="list-title">Service capabilities used</h3><ul class="tags">' + services + '</ul></section>' +
    '<section id="process" aria-labelledby="pr-h"><h2 id="pr-h">Implementation process</h2><ol class="workflow" data-reveal-group>' + process + '</ol></section>' +
    '<section id="results" aria-labelledby="re-h"><h2 id="re-h">Results</h2><dl class="metric-grid" data-reveal-group>' + metrics + '</dl><ul class="checklist checklist--roomy mt-8">' + outcome + '</ul><p class="form-note">Figures are fictional and for demonstration only.</p></section>' +
    '<section id="timeline" aria-labelledby="tl-h"><h2 id="tl-h">Timeline</h2><ol class="timeline">' + timeline + '</ol></section>' +
    '<section id="testimonial" aria-labelledby="te-h"><h2 id="te-h" class="visually-hidden">Client testimonial</h2><figure class="quote-lg"><span class="quote__mark" aria-hidden="true">“</span><blockquote><p>' + esc(c.quote[0]) + '</p></blockquote>' +
    '<figcaption class="quote__who"><span><strong>' + esc(c.quote[1]) + '</strong><span>' + esc(c.quote[2]) + '</span></span></figcaption><span class="badge badge--demo">Demo testimonial</span></figure></section>' +
    '</div>' +
    '<aside class="detail-aside" aria-label="Case study summary"><div class="card"><div class="card__body"><h2 class="detail-aside__title">At a glance</h2><dl class="facts">' + facts + '</dl>' +
    '<a class="btn btn--primary btn--block" href="partnership.html">Discuss a similar programme' + icon('arrow-right', 'icon-dir') + '</a>' +
    '<button type="button" class="btn btn--outline btn--block" data-share="copy">' + icon('link') + 'Copy link</button></div></div>' +
    '<nav class="card detail-toc" aria-label="On this page"><div class="card__body"><h2 class="detail-aside__title">On this page</h2><ol data-toc>' +
    [['overview', 'Overview'], ['challenge', 'Challenge'], ['context', 'Context'], ['solution', 'Solution'], ['process', 'Implementation'], ['results', 'Results'], ['timeline', 'Timeline'], ['testimonial', 'Testimonial']]
      .map(function (t) { return '<li><a href="#' + t[0] + '">' + t[1] + '</a></li>'; }).join('') + '</ol></div></nav></aside></div>' +
    '<section class="related" aria-labelledby="rel-h"><h2 id="rel-h">Related case studies <span class="badge badge--amber">Demo</span></h2><div class="grid grid--2">' + related + '</div></section>';

  var title = c.title + ' | Demo Case Study';
  BPO.setHead({ title: title, desc: c.summary + ' Challenge, solution, timeline and metrics (demo case study).', query: key === 'healthcare-patient-support' ? '' : '?case=' + key });
  BPO.setHero({ h1: c.title, lead: c.summary, crumb: c.title, eyebrow: 'Demo Case Study · ' + c.industry });
  BPO.updateLd('BreadcrumbList', function (j) { j.itemListElement[2].name = c.title; });
  if (BPO.enhance) { BPO.enhance(root); }
})();
