/* main.js — core behaviour shared by every page.
   Theme (light/dark/system), RTL switching, mobile drawer, accordions, tabs, modals, toasts,
   reusable filter + search + pagination + deep-link engine, counters, scroll reveal, share buttons,
   scroll-spy and live delivery-centre clocks. Page-specific scripts extend window.BPO. */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var qs = new URLSearchParams(window.location.search);

  var store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }
  };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  };

  var BPO = window.BPO = window.BPO || {};
  BPO.$ = $; BPO.$$ = $$; BPO.esc = esc; BPO.qs = qs; BPO.store = store; BPO.reduceMotion = reduceMotion;
  BPO.icon = BPO.icon || function () { return ''; };

  /* ---------- Toasts ---------- */
  BPO.toast = function (message, type, ms) {
    var host = $('#toasts');
    if (!host) { return; }
    var el = doc.createElement('div');
    el.className = 'toast toast--' + (type || 'success');
    el.setAttribute('role', type === 'error' ? 'alert' : 'status');
    el.innerHTML = BPO.icon(type === 'error' ? 'alert-circle' : 'check-circle') + '<span>' + esc(message) + '</span>' +
      '<button type="button" aria-label="Dismiss notification">' + BPO.icon('x', 'icon--sm') + '</button>';
    host.appendChild(el);
    var close = function () { el.classList.add('is-leaving'); window.setTimeout(function () { el.remove(); }, 260); };
    el.querySelector('button').addEventListener('click', close);
    window.setTimeout(close, ms || 5000);
  };

  /* ---------- Theme (light / dark / system) ---------- */
  function applyTheme(mode, persist) {
    root.setAttribute('data-theme', mode);
    if (persist) { store.set('bpo-theme', mode); }
    $$('[data-theme-toggle]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(mode === 'dark'));
      b.setAttribute('aria-label', mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
    var meta = $('meta[name="theme-color"]');
    if (meta) { meta.setAttribute('content', mode === 'dark' ? '#090c11' : '#12406b'); }
  }
  applyTheme(root.getAttribute('data-theme') || 'light', false);
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onScheme = function (e) { if (!store.get('bpo-theme')) { applyTheme(e.matches ? 'dark' : 'light', false); } };
    if (mq.addEventListener) { mq.addEventListener('change', onScheme); }
  }

  /* ---------- Direction (LTR / RTL) ---------- */
  function applyDir(dir, persist) {
    if (dir === 'rtl') { root.setAttribute('dir', 'rtl'); } else { root.setAttribute('dir', 'ltr'); }
    if (persist) { store.set('bpo-dir', dir); }
    $$('[data-dir-toggle]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(dir === 'rtl'));
      b.setAttribute('aria-label', dir === 'rtl' ? 'Switch to left-to-right layout' : 'Switch to right-to-left layout');
    });
  }
  applyDir(root.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr', false);

  doc.addEventListener('click', function (e) {
    var t = e.target.closest('[data-theme-toggle]');
    if (t) { applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true); return; }
    var d = e.target.closest('[data-dir-toggle]');
    if (d) { applyDir(root.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl', true); }
  });

  /* ---------- Header state + mobile drawer ---------- */
  var header = $('#site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  var drawer = $('#mobile-drawer');
  var drawerToggle = $('.nav__toggle');
  var lastFocus = null;
  function setDrawer(open) {
    if (!drawer) { return; }
    drawer.classList.toggle('is-open', open);
    doc.body.classList.toggle('has-drawer', open);
    if (open) {
      drawer.removeAttribute('inert');
      lastFocus = drawerToggle || doc.activeElement;
      window.setTimeout(function () { var c = $('.drawer__close', drawer); if (c) { c.focus(); } }, 30);
    } else {
      drawer.setAttribute('inert', '');
      if (lastFocus && lastFocus.focus) { lastFocus.focus(); }
    }
    if (drawerToggle) {
      drawerToggle.setAttribute('aria-expanded', String(open));
      drawerToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
  }
  if (drawerToggle) { drawerToggle.addEventListener('click', function () { setDrawer(!drawer.classList.contains('is-open')); }); }
  doc.addEventListener('click', function (e) {
    if (e.target.closest('[data-drawer-close]') || (drawer && drawer.classList.contains('is-open') && e.target.closest('.drawer__link'))) { setDrawer(false); }
  });
  doc.addEventListener('keydown', function (e) {
    if (!drawer || !drawer.classList.contains('is-open')) { return; }
    if (e.key === 'Escape') { setDrawer(false); return; }
    if (e.key === 'Tab') {
      var f = $$('a[href], button:not([disabled])', $('.drawer__panel', drawer)).filter(function (n) { return n.offsetParent !== null; });
      if (!f.length) { return; }
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  window.addEventListener('resize', function () { if (window.innerWidth >= 1120 && drawer && drawer.classList.contains('is-open')) { setDrawer(false); } });

  /* ---------- Accordions ---------- */
  var accId = 0;
  function setAcc(trigger, open) {
    var panel = doc.getElementById(trigger.getAttribute('aria-controls'));
    trigger.setAttribute('aria-expanded', String(open));
    if (panel) { panel.classList.toggle('is-open', open); }
  }
  BPO.initAccordions = function (scope) {
    $$('.acc-item', scope).forEach(function (item) {
      var trigger = $('.acc-trigger', item), panel = $('.acc-panel', item);
      if (!trigger || !panel || trigger.hasAttribute('aria-controls')) { return; }
      accId += 1;
      panel.id = panel.id || 'acc-panel-' + accId;
      trigger.id = trigger.id || 'acc-trigger-' + accId;
      trigger.setAttribute('aria-controls', panel.id);
      trigger.setAttribute('aria-expanded', String(panel.classList.contains('is-open')));
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-labelledby', trigger.id);
    });
  };
  doc.addEventListener('click', function (e) {
    var t = e.target.closest('.acc-trigger');
    if (!t) { return; }
    var open = t.getAttribute('aria-expanded') === 'true';
    var group = t.closest('[data-accordion]');
    if (group && group.getAttribute('data-accordion') === 'single' && !open) {
      $$('.acc-trigger[aria-expanded="true"]', group).forEach(function (o) { setAcc(o, false); });
    }
    setAcc(t, !open);
  });

  /* ---------- Tabs (roving tabindex, arrow keys, ?tab= deep link) ---------- */
  var tabId = 0;
  BPO.initTabs = function (scope) {
    $$('[data-tabs]', scope).forEach(function (wrap) {
      if (wrap.getAttribute('data-ready')) { return; }
      wrap.setAttribute('data-ready', '1');
      tabId += 1;
      var list = $('[role="tablist"]', wrap);
      var tabs = $$('[role="tab"]', list);
      var panels = $$('[data-panel]', wrap).filter(function (p) { return p.closest('[data-tabs]') === wrap; });
      var select = function (tab, focus) {
        tabs.forEach(function (t) { var on = t === tab; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
        panels.forEach(function (p) { p.classList.toggle('is-active', p.id === tab.getAttribute('aria-controls')); });
        if (focus) { tab.focus(); }
      };
      tabs.forEach(function (t, i) {
        var key = t.getAttribute('data-tab');
        var panel = panels.filter(function (p) { return p.getAttribute('data-panel') === key; })[0];
        if (!panel) { return; }
        t.id = t.id || 'tab-' + tabId + '-' + i;
        panel.id = panel.id || 'tabpanel-' + tabId + '-' + i;
        t.setAttribute('aria-controls', panel.id);
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', t.id);
        panel.tabIndex = 0;
        t.addEventListener('click', function () { select(t, false); });
      });
      list.addEventListener('keydown', function (e) {
        var i = tabs.indexOf(doc.activeElement);
        if (i < 0) { return; }
        var rtl = root.getAttribute('dir') === 'rtl';
        var vertical = list.getAttribute('aria-orientation') === 'vertical';
        var next = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1, ArrowDown: vertical ? 1 : 0, ArrowUp: vertical ? -1 : 0 }[e.key];
        if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
        else if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
        else if (next) { e.preventDefault(); select(tabs[(i + next + tabs.length) % tabs.length], true); }
      });
      var wanted = wrap.getAttribute('data-tab-param') ? qs.get(wrap.getAttribute('data-tab-param')) : null;
      var initial = tabs.filter(function (t) { return t.getAttribute('data-tab') === wanted; })[0] || tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0];
      if (initial) { select(initial, false); }
    });
  };

  /* ---------- Modals (native <dialog>) ---------- */
  BPO.openModal = function (id, trigger) {
    var dlg = doc.getElementById(id);
    if (!dlg) { return; }
    dlg.dispatchEvent(new CustomEvent('bpo:before-open', { detail: { trigger: trigger || null } }));
    if (typeof dlg.showModal === 'function') { dlg.showModal(); } else { dlg.setAttribute('open', ''); }
    var focusTarget = $('[autofocus], [data-modal-close]', dlg);
    if (focusTarget) { focusTarget.focus(); }
  };
  doc.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-modal-open]');
    if (opener) { e.preventDefault(); BPO.openModal(opener.getAttribute('data-modal-open'), opener); return; }
    var closer = e.target.closest('[data-modal-close]');
    if (closer) { var d = closer.closest('dialog'); if (d) { d.close(); } return; }
    if (e.target.matches && e.target.matches('dialog.modal')) { e.target.close(); }
  });

  /* ---------- Filter + search + sort + pagination + deep links ---------- */
  var camel = function (s) { return s.replace(/-([a-z])/g, function (m, c) { return c.toUpperCase(); }); };
  BPO.filterable = function (rootEl) {
    var items = $$('[data-item]', rootEl);
    var list = $('[data-filter-list]', rootEl) || (items[0] && items[0].parentElement);
    var search = $('[data-filter-search]', rootEl);
    var chipGroups = $$('[data-filter-group]', rootEl);
    var selects = $$('[data-filter-select]', rootEl);
    var sortSel = $('[data-filter-sort]', rootEl);
    var status = $('[data-filter-status]', rootEl);
    var empty = $('[data-filter-empty]', rootEl);
    var pager = $('[data-pagination]', rootEl);
    var size = parseInt(rootEl.getAttribute('data-page-size') || '0', 10);
    var noun = rootEl.getAttribute('data-noun') || 'results';
    var keys = chipGroups.map(function (g) { return g.getAttribute('data-filter-group'); }).concat(selects.map(function (s) { return s.getAttribute('data-filter-select'); }));
    var state = { q: '', page: 1, sort: 'default' };
    keys.forEach(function (k) { state[k] = 'all'; });
    var original = items.slice();
    var deep = rootEl.getAttribute('data-deep-link') !== 'off';

    var tokens = function (v) { return (v || '').toLowerCase().split(/\s+/); };
    var textOf = function (el) { return (el.getAttribute('data-text') || el.textContent || '').toLowerCase().replace(/\s+/g, ' '); };
    var setChip = function (group, value) {
      $$('[data-value]', group).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-value') === value)); });
    };

    // Read initial state from the URL (?category=customer-support&q=refund&page=2)
    if (deep) {
      chipGroups.forEach(function (g) {
        var k = g.getAttribute('data-filter-group'), v = qs.get(k);
        if (v) {
          (g.getAttribute('data-aliases') || '').split(';').forEach(function (pair) { var kv = pair.split('='); if (kv[0] && kv[0] === v) { v = kv[1]; } });
        }
        if (v && $('[data-value="' + v.replace(/"/g, '') + '"]', g)) { state[k] = v; setChip(g, v); }
      });
      selects.forEach(function (s) {
        var k = s.getAttribute('data-filter-select'), v = qs.get(k);
        if (v && $$('option', s).some(function (o) { return o.value === v; })) { state[k] = v; s.value = v; }
      });
      if (qs.get('q')) { state.q = qs.get('q').toLowerCase(); if (search) { search.value = qs.get('q'); } }
      if (qs.get('page')) { state.page = Math.max(1, parseInt(qs.get('page'), 10) || 1); }
    }

    function syncUrl() {
      if (!deep || !window.history.replaceState) { return; }
      var p = new URLSearchParams(window.location.search);
      keys.forEach(function (k) { if (state[k] === 'all') { p.delete(k); } else { p.set(k, state[k]); } });
      if (state.q) { p.set('q', search ? search.value.trim() : state.q); } else { p.delete('q'); }
      if (state.page > 1) { p.set('page', String(state.page)); } else { p.delete('page'); }
      var s = p.toString();
      try { window.history.replaceState(null, '', window.location.pathname + (s ? '?' + s : '') + window.location.hash); } catch (e) { /* file:// restrictions */ }
    }

    function apply(scroll) {
      var matched = original.filter(function (el) {
        var ok = keys.every(function (k) { return state[k] === 'all' || tokens(el.getAttribute('data-' + k)).indexOf(state[k].toLowerCase()) > -1; });
        return ok && (!state.q || textOf(el).indexOf(state.q) > -1);
      });
      if (state.sort !== 'default') {
        var parts = state.sort.split(':'), field = camel(parts[0]), dir = parts[1] === 'desc' ? -1 : 1;
        matched.sort(function (a, b) {
          var x = a.dataset[field] || '', y = b.dataset[field] || '';
          var nx = parseFloat(x), ny = parseFloat(y);
          var r = (!isNaN(nx) && !isNaN(ny) && /^[\d.]+$/.test(x)) ? nx - ny : x.localeCompare(y);
          return r * dir;
        });
        matched.forEach(function (el) { list.appendChild(el); });
      } else if (list) {
        original.forEach(function (el) { list.appendChild(el); });
      }
      var total = matched.length;
      var pages = size ? Math.max(1, Math.ceil(total / size)) : 1;
      state.page = Math.min(state.page, pages);
      var start = size ? (state.page - 1) * size : 0;
      var visible = matched.slice(start, size ? start + size : undefined);
      original.forEach(function (el) { el.hidden = visible.indexOf(el) === -1; });
      if (empty) { empty.hidden = total !== 0; }
      if (status) {
        status.textContent = total === 0 ? 'No ' + noun + ' match your filters.' :
          'Showing ' + (start + 1) + '–' + (start + visible.length) + ' of ' + total + ' ' + noun;
      }
      renderPager(pages);
      syncUrl();
      if (scroll && list) { list.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); }
      rootEl.dispatchEvent(new CustomEvent('bpo:filtered', { detail: { total: total, page: state.page } }));
    }

    function renderPager(pages) {
      if (!pager) { return; }
      if (pages <= 1) { pager.innerHTML = ''; return; }
      var h = '<button type="button" class="page-btn" data-page="' + (state.page - 1) + '"' + (state.page === 1 ? ' disabled' : '') + ' aria-label="Previous page">' + BPO.icon('chevron-left', 'icon-dir') + '</button>';
      for (var i = 1; i <= pages; i++) {
        h += '<button type="button" class="page-btn" data-page="' + i + '"' + (i === state.page ? ' aria-current="page"' : '') + ' aria-label="Page ' + i + '">' + i + '</button>';
      }
      h += '<button type="button" class="page-btn" data-page="' + (state.page + 1) + '"' + (state.page === pages ? ' disabled' : '') + ' aria-label="Next page">' + BPO.icon('chevron-right', 'icon-dir') + '</button>';
      pager.innerHTML = h;
    }

    chipGroups.forEach(function (g) {
      g.addEventListener('click', function (e) {
        var b = e.target.closest('[data-value]');
        if (!b) { return; }
        state[g.getAttribute('data-filter-group')] = b.getAttribute('data-value');
        state.page = 1; setChip(g, b.getAttribute('data-value')); apply(false);
      });
    });
    selects.forEach(function (s) { s.addEventListener('change', function () { state[s.getAttribute('data-filter-select')] = s.value; state.page = 1; apply(false); }); });
    if (sortSel) { sortSel.addEventListener('change', function () { state.sort = sortSel.value; state.page = 1; apply(false); }); }
    if (search) {
      var timer;
      search.addEventListener('input', function () {
        window.clearTimeout(timer);
        timer = window.setTimeout(function () { state.q = search.value.trim().toLowerCase(); state.page = 1; apply(false); }, 120);
      });
      search.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); } });
    }
    if (pager) {
      pager.addEventListener('click', function (e) {
        var b = e.target.closest('[data-page]');
        if (!b || b.disabled) { return; }
        state.page = parseInt(b.getAttribute('data-page'), 10); apply(true);
      });
    }
    $$('[data-filter-reset]', rootEl).forEach(function (b) {
      b.addEventListener('click', function () {
        keys.forEach(function (k) { state[k] = 'all'; });
        chipGroups.forEach(function (g) { setChip(g, 'all'); });
        selects.forEach(function (s) { s.value = 'all'; });
        state.q = ''; state.page = 1; state.sort = 'default';
        if (search) { search.value = ''; } if (sortSel) { sortSel.value = 'default'; }
        apply(false);
      });
    });
    apply(false);
    return { apply: apply, state: state };
  };

  /* ---------- Counters + scroll reveal ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var pre = el.getAttribute('data-prefix') || '', suf = el.getAttribute('data-suffix') || '';
    if (reduceMotion || isNaN(target)) { return; }
    var start = null, dur = 1400;
    var step = function (ts) {
      if (start === null) { start = ts; }
      var p = Math.min((ts - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + (target * eased).toFixed(dec) + suf;
      if (p < 1) { window.requestAnimationFrame(step); }
    };
    el.textContent = pre + (0).toFixed(dec) + suf;
    window.requestAnimationFrame(step);
  }
  BPO.initMotion = function (scope) {
    var revealEls = $$('[data-reveal]:not(.is-visible)', scope);
    var countEls = $$('[data-count]:not([data-counted])', scope);
    if (!('IntersectionObserver' in window)) { revealEls.forEach(function (e) { e.classList.add('is-visible'); }); return; }
    $$('[data-reveal-group]', scope).forEach(function (g) {
      $$('[data-reveal]', g).forEach(function (c, i) { c.style.setProperty('--reveal-delay', (i * 0.07).toFixed(2) + 's'); });
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) { return; }
        en.target.classList.add('is-visible');
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (e) { io.observe(e); });
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) { return; }
        en.target.setAttribute('data-counted', '1'); animateCount(en.target); co.unobserve(en.target);
      });
    }, { threshold: 0.6 });
    countEls.forEach(function (e) { co.observe(e); });
  };

  /* ---------- Share buttons (Web Share API, social intents, copy link) ---------- */
  doc.addEventListener('click', function (e) {
    var b = e.target.closest('[data-share]');
    if (!b) { return; }
    var kind = b.getAttribute('data-share'), url = window.location.href, title = doc.title;
    if (kind === 'copy' || kind === 'native') {
      e.preventDefault();
      if (kind === 'native' && navigator.share) { navigator.share({ title: title, url: url }).catch(function () { /* dismissed */ }); return; }
      var done = function () { BPO.toast('Link copied to clipboard'); };
      if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(url).then(done, function () { BPO.toast('Copy failed — please copy the address bar URL.', 'error'); }); }
      else {
        var ta = doc.createElement('textarea'); ta.value = url; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
        doc.body.appendChild(ta); ta.select();
        try { doc.execCommand('copy'); done(); } catch (err) { BPO.toast('Copy failed — please copy the address bar URL.', 'error'); }
        ta.remove();
      }
    }
  });
  BPO.initShare = function (scope) {
    $$('a[data-share]', scope).forEach(function (a) {
      var kind = a.getAttribute('data-share'), u = encodeURIComponent(window.location.href), t = encodeURIComponent(doc.title);
      var base = a.getAttribute('data-base') || a.getAttribute('href');
      a.setAttribute('data-base', base);
      if (kind === 'linkedin') { a.href = base + '?url=' + u; }
      if (kind === 'x') { a.href = base + '?url=' + u + '&text=' + t; }
      if (kind === 'facebook') { a.href = base + '?u=' + u; }
      if (kind === 'email') { a.href = 'mailto:?subject=' + t + '&body=' + u; }
    });
  };

  /* ---------- Scroll-spy for tables of contents ---------- */
  BPO.initToc = function (scope) {
    $$('[data-toc]', scope).forEach(function (toc) {
      var links = $$('a[href^="#"]', toc);
      var map = {};
      links.forEach(function (a) { var t = doc.getElementById(a.getAttribute('href').slice(1)); if (t) { map[t.id] = a; } });
      var targets = Object.keys(map).map(function (id) { return doc.getElementById(id); });
      if (!targets.length || !('IntersectionObserver' in window)) { return; }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { links.forEach(function (l) { l.removeAttribute('aria-current'); }); map[en.target.id].setAttribute('aria-current', 'true'); }
        });
      }, { rootMargin: '-90px 0px -65% 0px' });
      targets.forEach(function (t) { io.observe(t); });
    });
  };

  /* ---------- Live delivery-centre clocks ---------- */
  function tickClocks() {
    $$('[data-tz]').forEach(function (el) {
      try {
        var tz = el.getAttribute('data-tz'), now = new Date();
        var t = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz }).format(now);
        el.textContent = t;
        var hr = parseInt(t.slice(0, 2), 10);
        var shift = $('[data-shift]', el.closest('[data-clock]') || doc);
        if (shift) { shift.textContent = hr >= 6 && hr < 14 ? 'Morning shift' : hr >= 14 && hr < 22 ? 'Evening shift' : 'Night shift'; }
      } catch (e) { el.textContent = '—'; }
    });
  }

  /* ---------- Head / hero sync for pages rendered from ?query parameters ---------- */
  BPO.setHead = function (o) {
    var meta = function (sel, val) { var n = $(sel); if (n && val) { n.setAttribute('content', val); } };
    if (o.title) { doc.title = o.title; meta('meta[property="og:title"]', o.title); meta('meta[name="twitter:title"]', o.title); }
    if (o.desc) { meta('meta[name="description"]', o.desc); meta('meta[property="og:description"]', o.desc); meta('meta[name="twitter:description"]', o.desc); }
    if (o.image) {
      ['meta[property="og:image"]', 'meta[name="twitter:image"]'].forEach(function (sel) {
        var n = $(sel); if (n) { n.setAttribute('content', n.getAttribute('content').replace(/[^/]*$/, o.image)); }
      });
    }
    var canon = $('link[rel="canonical"]');
    if (canon && o.query != null) {
      var url = canon.getAttribute('href').split('?')[0] + o.query;
      canon.setAttribute('href', url); meta('meta[property="og:url"]', url);
    }
  };
  BPO.setHero = function (o) {
    var h1 = $('#page-title'); if (h1 && o.h1) { h1.textContent = o.h1; }
    var lead = $('.page-hero .lead'); if (lead && o.lead) { lead.textContent = o.lead; }
    var crumb = $('.breadcrumb [aria-current]'); if (crumb && o.crumb) { crumb.textContent = o.crumb; }
    var eb = $('.page-hero .eyebrow'); if (eb && o.eyebrow) { eb.textContent = o.eyebrow; }
  };
  BPO.updateLd = function (type, fn) {
    $$('script[type="application/ld+json"]').forEach(function (sc) {
      try { var j = JSON.parse(sc.textContent); if (j['@type'] === type) { fn(j); sc.textContent = JSON.stringify(j, null, 2); } } catch (e) { /* ignore malformed JSON-LD */ }
    });
  };

  /* ---------- Launch countdown (coming-soon page) ---------- */
  $$('[data-countdown]').forEach(function (el) {
    var target = new Date(el.getAttribute('data-launch')).getTime();
    var units = {};
    $$('[data-unit]', el).forEach(function (u) { units[u.getAttribute('data-unit')] = u; });
    var pad = function (n) { return String(n).padStart(2, '0'); };
    var tick = function () {
      var diff = Math.max(0, (isNaN(target) ? 0 : target) - Date.now());
      units.days.textContent = pad(Math.floor(diff / 864e5));
      units.hours.textContent = pad(Math.floor(diff % 864e5 / 36e5));
      units.minutes.textContent = pad(Math.floor(diff % 36e5 / 6e4));
      units.seconds.textContent = pad(Math.floor(diff % 6e4 / 1e3));
    };
    tick();
    window.setInterval(tick, 1000);
  });

  /* ---------- Init ---------- */
  $$('[data-year]').forEach(function (n) { n.textContent = String(new Date().getFullYear()); });
  BPO.initAccordions(doc);
  BPO.initTabs(doc);
  BPO.initMotion(doc);
  BPO.initShare(doc);
  BPO.initToc(doc);
  $$('[data-filterable]').forEach(function (el) { BPO.filterable(el); });
  if ($('[data-tz]')) { tickClocks(); window.setInterval(tickClocks, 30000); }
  BPO.enhance = function (scope) { BPO.initAccordions(scope); BPO.initTabs(scope); BPO.initMotion(scope); BPO.initShare(scope); BPO.initToc(scope); };
  BPO.applyDir = applyDir;
})();
