/* careers.js — renders job-details.html from the JSON block #job-data using ?job=<slug>, keeps the application
   form in sync (hidden "position" field, heading). The job listing on careers.html uses the shared filter engine. */
(function () {
  'use strict';

  var BPO = window.BPO || {};
  var doc = document;
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var esc = BPO.esc || function (x) { return String(x); };
  var icon = BPO.icon || function () { return ''; };
  var root = $('[data-job-root]'), dataEl = $('#job-data');
  if (!root || !dataEl) { return; }
  var all;
  try { all = JSON.parse(dataEl.textContent); } catch (e) { return; }
  var key = BPO.qs.get('job');
  if (!all[key]) { key = 'customer-support-associate-voice'; }
  var j = all[key];

  var list = function (a, ic) { return '<ul class="checklist checklist--roomy">' + a.map(function (x) { return '<li>' + icon(ic) + '<span>' + esc(x) + '</span></li>'; }).join('') + '</ul>'; };
  var posted = new Date(j.posted + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  var facts = [['Department', j.deptName], ['Location', j.loc], ['Employment type', j.typeName], ['Experience', j.exp], ['Posted', posted]]
    .map(function (f) { return '<div><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('');
  var others = Object.keys(all).filter(function (k) { return k !== key && all[k].dept === j.dept; }).slice(0, 2)
    .concat(Object.keys(all).filter(function (k) { return k !== key && all[k].dept !== j.dept; })).slice(0, 3);

  root.innerHTML =
    '<div class="detail-layout"><div class="detail-main">' +
    '<div class="cluster job-head"><span class="badge badge--teal">' + esc(j.deptName) + '</span><span class="badge">' + esc(j.typeName) + '</span><span class="badge badge--demo">Demo listing — not a real vacancy</span></div>' +
    '<ul class="job-card__meta job-card__meta--lg"><li>' + icon('map-pin') + esc(j.loc) + '</li><li>' + icon('briefcase') + esc(j.typeName) + '</li><li>' + icon('clock') + esc(j.exp) + '</li><li>' + icon('calendar') + 'Posted ' + esc(posted) + '</li></ul>' +
    '<section id="about-role" aria-labelledby="ab-h"><h2 id="ab-h">About the role</h2><div class="prose">' + j.desc.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div></section>' +
    '<section id="responsibilities" aria-labelledby="rs-h"><h2 id="rs-h">Responsibilities</h2>' + list(j.resp, 'check-circle') + '</section>' +
    '<section id="requirements" aria-labelledby="rq-h"><h2 id="rq-h">Requirements</h2>' + list(j.req, 'check-circle') + '</section>' +
    '<section id="preferred" aria-labelledby="pf-h"><h2 id="pf-h">Preferred qualifications</h2>' + list(j.pref, 'star') + '</section>' +
    '<section id="benefits" aria-labelledby="bn-h"><h2 id="bn-h">Benefits</h2><ul class="benefit-grid">' + j.benefits.map(function (b) { return '<li>' + icon('check-circle') + '<span>' + esc(b) + '</span></li>'; }).join('') + '</ul></section>' +
    '<section aria-labelledby="oth-h"><h2 id="oth-h">Other open roles</h2><ul class="other-jobs">' + others.map(function (k) {
      return '<li><a href="job-details.html?job=' + esc(k) + '"><strong>' + esc(all[k].title) + '</strong><span>' + esc(all[k].loc) + ' · ' + esc(all[k].typeName) + '</span></a></li>';
    }).join('') + '</ul></section></div>' +
    '<aside class="detail-aside" aria-label="Job summary"><div class="card"><div class="card__body"><h2 class="detail-aside__title">Role summary</h2><dl class="facts">' + facts + '</dl>' +
    '<a class="btn btn--primary btn--block btn--lg" href="#apply">Apply for this role' + icon('arrow-right', 'icon-dir') + '</a>' +
    '<button type="button" class="btn btn--outline btn--block" data-share="copy">' + icon('link') + 'Copy link to this job</button>' +
    '<a class="link-arrow" href="careers.html#openings">' + icon('chevron-left', 'icon-dir') + 'All open positions</a></div></div></aside></div>';

  var applyRole = $('#apply-role'); if (applyRole) { applyRole.textContent = j.title; }
  var pos = $('#apply-position'); if (pos) { pos.value = j.title; }
  BPO.setHead({ title: j.title + ' | Alturis Careers (Demo)', desc: j.summary + ' Demo listing with responsibilities, requirements, benefits and an application form.', query: key === 'customer-support-associate-voice' ? '' : '?job=' + key });
  BPO.setHero({ h1: j.title, lead: j.summary, crumb: j.title });
  BPO.updateLd('BreadcrumbList', function (x) { x.itemListElement[2].name = j.title; });
  if (BPO.enhance) { BPO.enhance(root); }
})();
