/* dashboard.js — demo operations dashboard (vanilla JS + SVG, no backend, no chart library).
   Charts: stacked columns (service volume), line + area (monthly enquiries), horizontal bars (industry share),
   meters (SLA vs target). One period filter scopes every figure. Each chart has a table-view twin, keyboard
   focus shows the same tooltip as hover, and all labels are inserted with textContent.
   Replace the DATA object with a fetch() to your own API to make it live. */
(function () {
  'use strict';

  var doc = document;
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };
  var NS = 'http://www.w3.org/2000/svg';
  var icon = (window.BPO && window.BPO.icon) || function () { return ''; };

  var MONTHS = ['Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026'];
  var DATA = {
    support: [118, 124, 141, 109, 112, 121, 127, 133, 138, 142, 147, 152],
    back: [64, 66, 72, 70, 74, 79, 81, 84, 86, 90, 93, 97],
    data: [38, 41, 39, 44, 46, 48, 53, 55, 57, 60, 62, 66],
    enq: [42, 38, 35, 47, 52, 58, 61, 66, 63, 71, 74, 82],
    req: [210, 198, 224, 231, 240, 252, 247, 268, 271, 283, 291, 305],
    qa: [94.1, 94.3, 94.0, 94.6, 94.8, 95.0, 95.1, 95.3, 95.4, 95.6, 95.5, 95.8],
    sla: {
      support: [96.4, 96.9, 96.1, 97.0, 97.2, 97.4, 97.5, 97.6, 97.9, 97.7, 97.8, 97.9],
      back: [98.1, 98.3, 98.0, 98.4, 98.6, 98.7, 98.7, 98.9, 98.8, 99.0, 98.9, 99.1],
      data: [99.0, 99.1, 99.2, 99.1, 99.3, 99.3, 99.4, 99.3, 99.5, 99.4, 99.4, 99.5],
      complaint: [92.4, 91.8, 90.9, 91.5, 92.0, 91.6, 92.3, 91.9, 92.5, 91.7, 92.1, 91.8]
    }
  };
  var SERIES = [{ key: 'support', name: 'Customer Support', cls: 's1' }, { key: 'back', name: 'Back-Office Processing', cls: 's2' }, { key: 'data', name: 'Data Management', cls: 's3' }];
  var INDUSTRY = [['Healthcare', 18], ['Banking & Financial Services', 16], ['E-commerce', 14], ['Telecommunications', 12], ['Insurance', 10], ['Retail', 9], ['Travel & Hospitality', 8], ['Logistics', 6], ['Technology', 5], ['Professional Services', 2]];
  var SLA = [{ key: 'support', name: 'Customer Support', target: 95 }, { key: 'back', name: 'Back-Office Processing', target: 97 },
    { key: 'data', name: 'Data Management', target: 98.5 }, { key: 'complaint', name: 'Complaints resolved in 5 days', target: 95 }];
  var state = { range: 12 };

  /* ---------- helpers ---------- */
  var sum = function (a) { return a.reduce(function (x, y) { return x + y; }, 0); };
  var avg = function (a) { return sum(a) / a.length; };
  var last = function (a, n) { return a.slice(-n); };
  var fmt = function (n) { return Math.round(n).toLocaleString('en-US'); };
  var compact = function (n) { return n >= 1e6 ? (n / 1e6).toFixed(2) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'K' : String(Math.round(n)); };
  var pct = function (n) { return (n >= 0 ? '+' : '−') + Math.abs(n).toFixed(1) + '%'; };
  function nice(max, ticks) {
    var raw = max / ticks, mag = Math.pow(10, Math.floor(Math.log10(raw))), norm = raw / mag;
    var step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * mag;
    return { step: step, max: step * Math.ceil(max / step) };
  }
  function h(tag, cls, text) { var n = doc.createElement(tag); if (cls) { n.className = cls; } if (text != null) { n.textContent = text; } return n; }
  function s(tag, attrs, text) {
    var n = doc.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (text != null) { n.textContent = text; }
    return n;
  }
  function roundTop(x, y, w, hh, r) {
    r = Math.max(0, Math.min(r, hh, w / 2));
    return 'M' + x + ',' + (y + hh) + 'L' + x + ',' + (y + r) + 'Q' + x + ',' + y + ' ' + (x + r) + ',' + y + 'L' + (x + w - r) + ',' + y + 'Q' + (x + w) + ',' + y + ' ' + (x + w) + ',' + (y + r) + 'L' + (x + w) + ',' + (y + hh) + 'Z';
  }

  /* ---------- tooltip ---------- */
  var tip = $('#tip');
  function showTip(cx, cy, title, rows) {
    tip.replaceChildren();
    tip.appendChild(h('div', 'tip__title', title));
    rows.forEach(function (r) {
      var row = h('div', 'tip__row');
      if (r.cls) { row.appendChild(h('span', 'tip__key ' + r.cls)); }
      row.appendChild(h('strong', 'tip__val', r.value));
      row.appendChild(h('span', 'tip__name', r.name));
      tip.appendChild(row);
    });
    tip.hidden = false;
    var w = tip.offsetWidth, hh = tip.offsetHeight;
    var x = Math.min(Math.max(8, cx + 14), window.innerWidth - w - 8);
    var y = cy - hh - 14 < 8 ? cy + 18 : cy - hh - 14;
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
  }
  function hideTip() { tip.hidden = true; }
  function focusPoint(node) { var b = node.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + Math.min(b.height / 2, 40) }; }

  /* ---------- table views ---------- */
  function fillTable(panel, headers, rows) {
    var host = $('.chart-table', panel);
    host.replaceChildren();
    var wrap = h('div', 'table-wrap'), t = h('table', 'table');
    var head = h('tr');
    headers.forEach(function (x, i) { var th = h('th', '', x); th.scope = 'col'; if (i > 0) { th.className = 'num'; } head.appendChild(th); });
    var thead = h('thead'); thead.appendChild(head); t.appendChild(thead);
    var tb = h('tbody');
    rows.forEach(function (r) {
      var tr = h('tr');
      r.forEach(function (c, i) { var cell = h(i === 0 ? 'th' : 'td', i > 0 ? 'num' : '', c); if (i === 0) { cell.scope = 'row'; } tr.appendChild(cell); });
      tb.appendChild(tr);
    });
    t.appendChild(tb); wrap.appendChild(t); host.appendChild(wrap);
  }

  /* ---------- tiles ---------- */
  function spark(vals) {
    var w = 96, hh = 28, lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals);
    var pts = vals.map(function (v, i) { return [i * w / (vals.length - 1 || 1), hh - 4 - (v - lo) / ((hi - lo) || 1) * (hh - 8)]; });
    var svg = s('svg', { viewBox: '0 0 ' + w + ' ' + hh, class: 'spark', 'aria-hidden': 'true', focusable: 'false' });
    svg.appendChild(s('polyline', { points: pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' '), class: 'spark__line' }));
    var l = pts[pts.length - 1];
    svg.appendChild(s('circle', { cx: l[0].toFixed(1), cy: l[1].toFixed(1), r: 3.5, class: 'spark__dot' }));
    return svg;
  }
  function tile(label, value, delta, note, series) {
    var t = h('div', 'tile');
    t.appendChild(h('dt', 'tile__label', label));
    t.appendChild(h('dd', 'tile__value', value));
    var d = h('dd', 'tile__delta');
    var up = delta.value >= 0;
    d.innerHTML = icon(up ? 'trending-up' : 'activity', 'icon--sm');
    d.appendChild(h('span', '', delta.text));
    d.appendChild(h('span', 'tile__note', ' ' + note));
    t.appendChild(d);
    if (series) { var sp = h('dd', 'tile__spark'); sp.appendChild(spark(series)); t.appendChild(sp); }
    return t;
  }
  function monthDelta(arr) { var a = arr[arr.length - 1], b = arr[arr.length - 2]; var v = (a / b - 1) * 100; return { value: v, text: pct(v) }; }
  function renderTiles() {
    var n = state.range, host = $('#tiles');
    host.replaceChildren();
    var enq = last(DATA.enq, n), req = last(DATA.req, n);
    var support = last(DATA.support, n), proc = last(DATA.back, n).map(function (v, i) { return v + last(DATA.data, n)[i]; });
    var slaAvg = avg(SLA.slice(0, 3).map(function (x) { return avg(last(DATA.sla[x.key], n)); }));
    var below = SLA.filter(function (x) { return avg(last(DATA.sla[x.key], n)) < x.target; }).length;
    var qa = last(DATA.qa, n);
    host.appendChild(tile('Total enquiries', fmt(sum(enq)), monthDelta(DATA.enq), 'Sep vs Aug', enq));
    host.appendChild(tile('Active projects', '34', { value: 3, text: '+3' }, 'vs last month', null));
    host.appendChild(tile('Service requests', fmt(sum(req)), monthDelta(DATA.req), 'Sep vs Aug', req));
    host.appendChild(tile('Open partnership enquiries', '19', { value: 2, text: '+2' }, 'vs last week', null));
    host.appendChild(tile('Support volume', compact(sum(support) * 1000), monthDelta(DATA.support), 'Sep vs Aug', support));
    host.appendChild(tile('Processing volume', compact(sum(proc) * 1000), monthDelta(DATA.back.map(function (v, i) { return v + DATA.data[i]; })), 'Sep vs Aug', proc));
    var st = tile('SLA status', slaAvg.toFixed(1) + '%', { value: 0.3, text: '+0.3 pts' }, below ? below + ' of 4 measures below target' : 'all measures on target', last(DATA.sla.support, n));
    host.appendChild(st);
    host.appendChild(tile('Quality score', avg(qa).toFixed(1) + '%', { value: qa[qa.length - 1] - qa[qa.length - 2], text: '+' + (qa[qa.length - 1] - qa[qa.length - 2]).toFixed(1) + ' pts' }, 'Sep vs Aug', qa));
    $('#range-note').textContent = 'Showing ' + MONTHS[MONTHS.length - n] + ' – ' + MONTHS[MONTHS.length - 1] + ' · demo data';
  }

  /* ---------- chart scaffolding ---------- */
  function frame(host, hgt, label) {
    var w = Math.max(host.clientWidth, 280);
    var svg = s('svg', { viewBox: '0 0 ' + w + ' ' + hgt, width: w, height: hgt, role: 'group', 'aria-label': label });
    return { svg: svg, w: w, h: hgt };
  }
  function axes(svg, m, iw, ih, sc, w, unit) {
    for (var t = 0; t <= 4; t++) {
      var v = sc.step * t, y = m.t + ih - v / sc.max * ih;
      svg.appendChild(s('line', { x1: m.l, x2: w - m.r, y1: y, y2: y, class: t === 0 ? 'axis' : 'gridline' }));
      svg.appendChild(s('text', { x: m.l - 8, y: y + 4, 'text-anchor': 'end', class: 'tick' }, fmt(v) + (v && unit ? unit : '')));
    }
  }

  /* ---------- 1. Service volume: stacked columns ---------- */
  function renderVolume() {
    var n = state.range, host = $('#chart-volume'), months = last(MONTHS, n);
    var vals = SERIES.map(function (k) { return last(DATA[k.key], n); });
    var totals = months.map(function (_, i) { return vals[0][i] + vals[1][i] + vals[2][i]; });
    var f = frame(host, 280, 'Stacked column chart: monthly service volume in thousands, by service line');
    var m = { l: 44, r: 8, t: 22, b: 30 }, iw = f.w - m.l - m.r, ih = f.h - m.t - m.b;
    var sc = nice(Math.max.apply(null, totals), 4);
    axes(f.svg, m, iw, ih, sc, f.w, 'K');
    var slot = iw / n, bw = Math.min(24, slot * 0.62), step = slot < 26 ? 3 : slot < 40 ? 2 : 1, base = m.t + ih;
    months.forEach(function (mo, i) {
      var x = m.l + slot * i + (slot - bw) / 2;
      var g = s('g', { class: 'mark', tabindex: 0, role: 'img', 'aria-label': mo + ': ' + SERIES.map(function (k, j) { return k.name + ' ' + vals[j][i] + 'K'; }).join(', ') + '. Total ' + totals[i] + 'K' });
      var cursor = base;
      SERIES.forEach(function (k, j) {
        var hgt = vals[j][i] / sc.max * ih, top = cursor - hgt, seg = j === 0 ? hgt : hgt - 2;
        if (j === SERIES.length - 1) { g.appendChild(s('path', { d: roundTop(x, top, bw, seg, 4), class: 'fill-' + k.cls })); }
        else { g.appendChild(s('rect', { x: x, y: top, width: bw, height: Math.max(seg, 1), class: 'fill-' + k.cls })); }
        cursor = top;
      });
      g.appendChild(s('rect', { x: m.l + slot * i, y: m.t, width: slot, height: ih + 6, class: 'hit' }));
      if (i === n - 1) { f.svg.appendChild(s('text', { x: x + bw / 2, y: cursor - 6, 'text-anchor': 'middle', class: 'val' }, totals[i] + 'K')); }
      if ((n - 1 - i) % step === 0) { f.svg.appendChild(s('text', { x: x + bw / 2, y: f.h - 8, 'text-anchor': 'middle', class: 'tick' }, mo.slice(0, 3))); }
      var show = function (cx, cy) {
        g.classList.add('is-hover');
        showTip(cx, cy, mo, SERIES.map(function (k, j) { return { cls: k.cls, value: vals[j][i] + 'K', name: k.name }; }).concat([{ value: totals[i] + 'K', name: 'Total' }]));
      };
      g.addEventListener('pointermove', function (e) { show(e.clientX, e.clientY); });
      g.addEventListener('pointerleave', function () { g.classList.remove('is-hover'); hideTip(); });
      g.addEventListener('focus', function () { var p = focusPoint(g); show(p.x, p.y); });
      g.addEventListener('blur', function () { g.classList.remove('is-hover'); hideTip(); });
      f.svg.appendChild(g);
    });
    host.replaceChildren(f.svg);
    var lg = $('#legend-volume'); lg.replaceChildren();
    SERIES.forEach(function (k) { var li = h('li', 'legend__item'); li.appendChild(h('span', 'legend__key fill-' + k.cls)); li.appendChild(h('span', '', k.name)); lg.appendChild(li); });
    fillTable($('[data-panel="volume"]'), ['Month', 'Customer Support (K)', 'Back-Office (K)', 'Data Management (K)', 'Total (K)'],
      months.map(function (mo, i) { return [mo, String(vals[0][i]), String(vals[1][i]), String(vals[2][i]), String(totals[i])]; }));
  }

  /* ---------- 2. Monthly enquiries: line + area with crosshair ---------- */
  function renderEnquiries() {
    var n = state.range, host = $('#chart-enquiries'), months = last(MONTHS, n), v = last(DATA.enq, n);
    var f = frame(host, 280, 'Line chart: monthly enquiries received');
    var m = { l: 44, r: 16, t: 22, b: 30 }, iw = f.w - m.l - m.r, ih = f.h - m.t - m.b;
    var sc = nice(Math.max.apply(null, v), 4), base = m.t + ih;
    axes(f.svg, m, iw, ih, sc, f.w, '');
    var X = function (i) { return m.l + 8 + (n === 1 ? 0 : i * (iw - 16) / (n - 1)); };
    var Y = function (val) { return base - val / sc.max * ih; };
    var pts = v.map(function (val, i) { return X(i).toFixed(1) + ',' + Y(val).toFixed(1); });
    f.svg.appendChild(s('path', { d: 'M' + X(0).toFixed(1) + ',' + base + 'L' + pts.join('L') + 'L' + X(n - 1).toFixed(1) + ',' + base + 'Z', class: 'area fill-s1' }));
    f.svg.appendChild(s('path', { d: 'M' + pts.join('L'), class: 'line stroke-s1' }));
    var step = (iw / n) < 26 ? 3 : (iw / n) < 40 ? 2 : 1;
    months.forEach(function (mo, i) { if ((n - 1 - i) % step === 0) { f.svg.appendChild(s('text', { x: X(i), y: f.h - 8, 'text-anchor': 'middle', class: 'tick' }, mo.slice(0, 3))); } });
    f.svg.appendChild(s('circle', { cx: X(n - 1), cy: Y(v[n - 1]), r: 4.5, class: 'dot fill-s1' }));
    f.svg.appendChild(s('text', { x: X(n - 1), y: Y(v[n - 1]) - 12, 'text-anchor': 'end', class: 'val' }, String(v[n - 1])));
    var cross = s('line', { x1: 0, x2: 0, y1: m.t, y2: base, class: 'cross', visibility: 'hidden' });
    var active = s('circle', { r: 4.5, class: 'dot fill-s1', visibility: 'hidden' });
    f.svg.appendChild(cross); f.svg.appendChild(active);
    var overlay = s('rect', { x: m.l, y: m.t - 6, width: iw, height: ih + 12, class: 'hit' });
    f.svg.appendChild(overlay);
    var idx = n - 1;
    var activate = function (i, cx, cy) {
      idx = i;
      cross.setAttribute('x1', X(i)); cross.setAttribute('x2', X(i)); cross.setAttribute('visibility', 'visible');
      active.setAttribute('cx', X(i)); active.setAttribute('cy', Y(v[i])); active.setAttribute('visibility', 'visible');
      showTip(cx, cy, months[i], [{ cls: 's1', value: String(v[i]), name: 'Enquiries' }]);
    };
    var clear = function () { cross.setAttribute('visibility', 'hidden'); active.setAttribute('visibility', 'hidden'); hideTip(); };
    overlay.addEventListener('pointermove', function (e) {
      var r = overlay.getBoundingClientRect(), rel = (e.clientX - r.left) / r.width * iw - 8;
      var i = Math.max(0, Math.min(n - 1, Math.round(rel / ((iw - 16) / Math.max(n - 1, 1)))));
      activate(i, e.clientX, e.clientY);
    });
    overlay.addEventListener('pointerleave', clear);
    f.svg.tabIndex = 0;
    f.svg.addEventListener('focus', function () { var r = f.svg.getBoundingClientRect(); activate(idx, r.left + X(idx), r.top + Y(v[idx])); });
    f.svg.addEventListener('blur', clear);
    f.svg.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) { return; }
      e.preventDefault();
      var i = Math.max(0, Math.min(n - 1, idx + d)), r = f.svg.getBoundingClientRect();
      activate(i, r.left + X(i), r.top + Y(v[i]));
    });
    host.replaceChildren(f.svg);
    fillTable($('[data-panel="enquiries"]'), ['Month', 'Enquiries'], months.map(function (mo, i) { return [mo, String(v[i])]; }));
  }

  /* ---------- 3. Industry share: horizontal bars ---------- */
  function renderIndustry() {
    var n = state.range, host = $('#chart-industry'), total = sum(last(DATA.enq, n));
    var rows = INDUSTRY.map(function (r) { return { name: r[0], share: r[1], count: Math.round(total * r[1] / 100) }; });
    var max = rows[0].share, ul = h('ul', 'hbars');
    rows.forEach(function (r) {
      var li = h('li', 'hbar'); li.tabIndex = 0;
      li.setAttribute('aria-label', r.name + ': ' + r.count + ' enquiries, ' + r.share + '% of the period');
      li.appendChild(h('span', 'hbar__label', r.name));
      var track = h('span', 'hbar__track'), bar = h('span', 'hbar__bar fill-s1');
      bar.style.width = (r.share / max * 78) + '%';
      track.appendChild(bar); track.appendChild(h('span', 'hbar__val', r.count + ' · ' + r.share + '%'));
      li.appendChild(track);
      var show = function (cx, cy) { li.classList.add('is-hover'); showTip(cx, cy, r.name, [{ cls: 's1', value: String(r.count), name: 'Enquiries (' + r.share + '%)' }]); };
      li.addEventListener('pointermove', function (e) { show(e.clientX, e.clientY); });
      li.addEventListener('pointerleave', function () { li.classList.remove('is-hover'); hideTip(); });
      li.addEventListener('focus', function () { var p = focusPoint(li); show(p.x, Math.max(p.y, 20)); });
      li.addEventListener('blur', function () { li.classList.remove('is-hover'); hideTip(); });
      ul.appendChild(li);
    });
    host.replaceChildren(ul);
    fillTable($('[data-panel="industry"]'), ['Industry', 'Enquiries', 'Share'], rows.map(function (r) { return [r.name, String(r.count), r.share + '%']; }));
  }

  /* ---------- 4. SLA performance: meters vs target ---------- */
  function renderSla() {
    var n = state.range, host = $('#chart-sla'), wrap = h('div', 'meters'), tableRows = [];
    SLA.forEach(function (x) {
      var val = avg(last(DATA.sla[x.key], n)), diff = val - x.target;
      var st = diff >= 0 ? { cls: 'ok', text: 'On target', ic: 'check-circle' } : diff > -4 ? { cls: 'warn', text: 'Below target', ic: 'alert-circle' } : { cls: 'crit', text: 'Off target', ic: 'alert-circle' };
      var row = h('div', 'meter-row'); row.tabIndex = 0;
      row.setAttribute('aria-label', x.name + ': ' + val.toFixed(1) + '% against a ' + x.target + '% target. ' + st.text);
      var head = h('div', 'meter-row__head');
      head.appendChild(h('span', 'meter-row__name', x.name));
      head.appendChild(h('span', 'meter-row__val', val.toFixed(1) + '%'));
      var track = h('div', 'meter'), fill = h('span', 'meter__fill meter__fill--' + st.cls), tick = h('span', 'meter__target');
      fill.style.width = val + '%'; tick.style.insetInlineStart = x.target + '%';
      track.appendChild(fill); track.appendChild(tick);
      var foot = h('div', 'meter-row__foot meter-row__foot--' + st.cls);
      foot.innerHTML = icon(st.ic, 'icon--sm');
      foot.appendChild(h('span', '', st.text + ' · target ' + x.target + '%'));
      row.appendChild(head); row.appendChild(track); row.appendChild(foot);
      var show = function (cx, cy) { showTip(cx, cy, x.name, [{ value: val.toFixed(1) + '%', name: 'Attainment' }, { value: x.target + '%', name: 'Target' }, { value: (diff >= 0 ? '+' : '−') + Math.abs(diff).toFixed(1) + ' pts', name: st.text }]); };
      row.addEventListener('pointermove', function (e) { show(e.clientX, e.clientY); });
      row.addEventListener('pointerleave', hideTip);
      row.addEventListener('focus', function () { var p = focusPoint(row); show(p.x, Math.max(p.y, 20)); });
      row.addEventListener('blur', hideTip);
      wrap.appendChild(row);
      tableRows.push([x.name, val.toFixed(1) + '%', x.target + '%', st.text]);
    });
    host.replaceChildren(wrap);
    fillTable($('[data-panel="sla"]'), ['Measure', 'Attainment', 'Target', 'Status'], tableRows);
  }

  function renderAll() { renderTiles(); renderVolume(); renderEnquiries(); renderIndustry(); renderSla(); }

  /* ---------- controls ---------- */
  $$('[data-range]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.getAttribute('aria-pressed') === 'true') { return; }
      $$('[data-range]').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
      state.range = parseInt(b.getAttribute('data-range'), 10);
      var c = $('#dash-content');
      c.classList.add('is-updating');
      window.setTimeout(function () { renderAll(); c.classList.remove('is-updating'); }, 220);
    });
  });
  $$('.tbl-toggle').forEach(function (b) {
    b.addEventListener('click', function () {
      var panel = b.closest('.panel'), on = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', String(on));
      b.textContent = on ? 'Chart view' : 'Table view';
      $('.chart', panel).hidden = on; $('.chart-table', panel).hidden = !on;
      var lg = $('.legend', panel); if (lg) { lg.hidden = on; }
      if (!on) { renderAll(); }
    });
  });
  var raf = 0;
  var relayout = function () { window.cancelAnimationFrame(raf); raf = window.requestAnimationFrame(function () { renderVolume(); renderEnquiries(); }); };
  if ('ResizeObserver' in window) {
    var ro = new ResizeObserver(relayout);
    $$('#chart-volume, #chart-enquiries').forEach(function (el) { ro.observe(el); });
  } else { window.addEventListener('resize', relayout); }
  renderAll();
})();
