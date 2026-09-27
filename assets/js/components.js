/* components.js — shared site chrome (single source of truth for header, footer, drawer, icon sprite, toast host).
   Loaded synchronously at the end of <body> so the header/footer exist before first paint and before main.js runs.
   Classic script (not an ES module) so the template also works when opened directly from the file system.
   Edit SITE below to rebrand: name, contact details, navigation. */
(function () {
  'use strict';

  var SITE = {
    name: 'Alturis',
    tagline: 'Global Services',
    phone: '+1 (555) 014-2200',
    phoneHref: '+15550142200',
    email: 'partnerships@alturis-bpo.example',
    address: 'Alturis Global Services, 1200 Meridian Business Park, Suite 400, Austin, TX 78701, USA',
    nav: [
      { href: 'index.html', label: 'Home', key: 'home' },
      { href: 'about.html', label: 'About', key: 'about' },
      { href: 'services.html', label: 'Services', key: 'services' },
      { href: 'industries.html', label: 'Industries', key: 'industries' },
      { href: 'case-studies.html', label: 'Case Studies', key: 'case-studies' },
      { href: 'careers.html', label: 'Careers', key: 'careers' },
      { href: 'contact.html', label: 'Contact', key: 'contact' }
    ],
    social: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: 'linkedin' },
      { label: 'X (Twitter)', href: 'https://x.com/', icon: 'x-social' },
      { label: 'Facebook', href: 'https://www.facebook.com/', icon: 'facebook' },
      { label: 'YouTube', href: 'https://www.youtube.com/', icon: 'youtube' }
    ]
  };

  var ICONS = {
    'headset': '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/><path d="M19 20c0 1.2-1.6 2-4 2h-2"/>',
    'file-text': '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    'file-check': '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 14.5l2 2 4-4"/>',
    'database': '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
    'shield-check': '<path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
    'clock': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    'globe': '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>',
    'users': '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><circle cx="17" cy="9" r="2.6"/><path d="M17.5 14c2.7.2 4.5 2.1 4.5 5"/>',
    'user': '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7"/>',
    'bar-chart': '<path d="M3 21h18"/><rect x="5" y="11" width="3.5" height="8" rx="1"/><rect x="10.25" y="5" width="3.5" height="14" rx="1"/><rect x="15.5" y="9" width="3.5" height="10" rx="1"/>',
    'pie': '<path d="M12 3a9 9 0 1 0 9 9h-9z"/><path d="M15 3.5A9 9 0 0 1 20.5 9H15z"/>',
    'activity': '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    'check': '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    'check-circle': '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/>',
    'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
    'arrow-up-right': '<path d="M7 17L17 7M8 7h9v9"/>',
    'chevron-down': '<path d="M6 9l6 6 6-6"/>',
    'chevron-right': '<path d="M9 6l6 6-6 6"/>',
    'chevron-left': '<path d="M15 6l-6 6 6 6"/>',
    'menu': '<path d="M4 7h16M4 12h16M4 17h16"/>',
    'x': '<path d="M6 6l12 12M18 6L6 18"/>',
    'search': '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
    'sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/>',
    'moon': '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    'dir': '<path d="M4 6h10M4 12h7M4 18h10"/><path d="M17 8l4 4-4 4"/>',
    'mail': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    'phone': '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    'map-pin': '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    'calendar': '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    'chat': '<path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H10l-5 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/>',
    'mic': '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    'workflow': '<rect x="3" y="4" width="6" height="6" rx="1.5"/><rect x="15" y="14" width="6" height="6" rx="1.5"/><path d="M9 7h4a2 2 0 0 1 2 2v5"/>',
    'sliders': '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
    'lock': '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    'target': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
    'layers': '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    'heart-pulse': '<path d="M12 20s-8-4.6-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.4 12 20 12 20z"/><path d="M6 12h3l1.5-3 3 6 1.5-3h3"/>',
    'bank': '<path d="M3 10l9-6 9 6z"/><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>',
    'cart': '<path d="M3 4h2.5l2 11h10l2-8H7"/><circle cx="9.5" cy="19.5" r="1.5"/><circle cx="17" cy="19.5" r="1.5"/>',
    'radio': '<circle cx="12" cy="12" r="2"/><path d="M8 8a5.7 5.7 0 0 0 0 8M16 8a5.7 5.7 0 0 1 0 8M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14"/>',
    'compass': '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    'truck': '<path d="M2 6h11v10H2zM13 9h4l3 3v4h-7"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="16.5" cy="17.5" r="1.8"/>',
    'umbrella': '<path d="M3 12a9 9 0 0 1 18 0z"/><path d="M12 12v6a2 2 0 0 0 4 0"/>',
    'code': '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>',
    'briefcase': '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18"/>',
    'clipboard-check': '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9z"/><path d="M9 14l2 2 4-4"/>',
    'refresh': '<path d="M20 12a8 8 0 1 1-2.5-5.8M20 4v4h-4"/>',
    'trending-up': '<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>',
    'graduation-cap': '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5"/>',
    'star': '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    'linkedin': '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v6M8 7.5v.01M12 16v-6M12 12.5c0-1.5 1-2.5 2.5-2.5S17 11 17 12.5V16"/>',
    'facebook': '<path d="M14 8h2.5V4.5H14A3.5 3.5 0 0 0 10.5 8v2H8v3.5h2.5V21H14v-7.5h2.5L17 10h-3V8.3c0-.2.1-.3.3-.3z"/>',
    'x-social': '<path d="M4 4h4.5l11.5 16h-4.5zM19.5 4L4.5 20"/>',
    'youtube': '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9.5l5 2.5-5 2.5z"/>',
    'instagram': '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".6"/>',
    'share': '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6"/>',
    'link': '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1"/>',
    'upload': '<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',
    'download': '<path d="M12 4v12M7 11l5 5 5-5M4 20h16"/>',
    'plus': '<path d="M12 5v14M5 12h14"/>',
    'minus': '<path d="M5 12h14"/>',
    'alert-circle': '<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16.5v.01"/>',
    'info': '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/>',
    'bell': '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 21h4"/>',
    'home': '<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z"/>',
    'building': '<rect x="5" y="3" width="10" height="18" rx="1"/><path d="M15 9h4v12h-4M8.5 7.5h3M8.5 11h3M8.5 14.5h3"/>',
    'filter': '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
    'book-open': '<path d="M12 6c-2-1.5-5-2-8-2v14c3 0 6 .5 8 2 2-1.5 5-2 8-2V4c-3 0-6 .5-8 2zM12 6v14"/>',
    'eye': '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    'inbox': '<path d="M4 13l2.5-8h11L20 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M4 13h4.5l1 2.5h5l1-2.5H20"/>',
    'zap': '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    'server': '<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5v.01M7 16.5v.01"/>',
    'monitor': '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
    'folder': '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    'edit': '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    'table': '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 4v16"/>',
    'life-buoy': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/><path d="M5.6 5.6l3.9 3.9M14.5 14.5l3.9 3.9M18.4 5.6l-3.9 3.9M9.5 14.5l-3.9 3.9"/>',
    'package': '<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
    'smile': '<circle cx="12" cy="12" r="9"/><path d="M8.5 14a4.2 4.2 0 0 0 7 0M9 9.5v.01M15 9.5v.01"/>',
    'dollar': '<circle cx="12" cy="12" r="9"/><path d="M14.5 9.2A2.8 2.2 0 0 0 12 8c-1.4 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2a2.8 2.2 0 0 1-2.5-1.2M12 6v2M12 16v2"/>',
    'send': '<path d="M21 3L3 10.5l6.5 2.5L12 20z"/><path d="M9.5 13L21 3"/>',
    'copy': '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    'log-in': '<path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4M10 8l4 4-4 4M14 12H4"/>',
    'flag': '<path d="M5 21V4M5 5h11l-2 4 2 4H5"/>',
    'grid': '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    'list': '<path d="M9 6h11M9 12h11M9 18h11M4.5 6v.01M4.5 12v.01M4.5 18v.01"/>',
    'award': '<circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 21l5-3 5 3-1.5-7"/>',
    'handshake': '<path d="M3 12l4-4 4 1 3-2 6 5-3 4-4-1-3 2-4-1z"/><path d="M3 12l3 5M21 12l-2 5"/>',
    'receipt': '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
    'thumbs-up': '<path d="M7 11v9H4v-9zM7 11l4-8a2 2 0 0 1 2 2v4h6a2 2 0 0 1 2 2l-1.5 7a2 2 0 0 1-2 1.5H7"/>'
  };

  function icon(name, cls) {
    return '<svg class="icon' + (cls ? ' ' + cls : '') + '" aria-hidden="true" focusable="false"><use href="#i-' + name + '"/></svg>';
  }

  function sprite() {
    var s = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>';
    Object.keys(ICONS).forEach(function (k) { s += '<symbol id="i-' + k + '" viewBox="0 0 24 24">' + ICONS[k] + '</symbol>'; });
    return s + '</defs></svg>';
  }

  var MARK = '<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false"><rect width="40" height="40" rx="10" fill="#12406b"/><path d="M11.5 29.5 20 10.5l8.5 19" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.6 23.4h8.8" stroke="#f0a12b" stroke-width="3.4" stroke-linecap="round"/></svg>';

  function brand() {
    return '<a class="brand" href="index.html" aria-label="' + SITE.name + ' ' + SITE.tagline + ' — home">' + MARK +
      '<span class="brand__text"><span class="brand__name">' + SITE.name + '</span><span class="brand__tag">' + SITE.tagline + '</span></span></a>';
  }

  var current = document.body.getAttribute('data-nav') || '';
  function navLinks(cls) {
    return SITE.nav.map(function (n) {
      var cur = n.key === current ? ' aria-current="page"' : '';
      var link = '<a class="' + cls + '" href="' + n.href + '"' + cur + '>' + n.label + (cls === 'drawer__link' ? icon('chevron-right', 'icon-dir') : '') + '</a>';
      return '<li>' + link + '</li>';
    }).join('');
  }

  var toggles = '<button type="button" class="icon-btn theme-toggle" data-theme-toggle aria-pressed="false" aria-label="Switch to dark mode"><span class="i-moon">' + icon('moon') + '</span><span class="i-sun">' + icon('sun') + '</span></button>' +
    '<button type="button" class="icon-btn" data-dir-toggle aria-pressed="false" aria-label="Switch to right-to-left layout">' + icon('dir', 'icon-dir') + '</button>';

  function header() {
    return '<div class="utility-bar"><div class="container utility-bar__inner">' +
      '<ul class="utility-list"><li><a class="ltr" href="tel:' + SITE.phoneHref + '">' + icon('phone') + SITE.phone + '</a></li>' +
      '<li><a href="mailto:' + SITE.email + '">' + icon('mail') + SITE.email + '</a></li>' +
      '<li><span>' + icon('clock') + '24/7 global delivery</span></li></ul>' +
      '<ul class="utility-list"><li><a href="home-2.html">' + icon('globe') + 'Global operations view</a></li>' +
      '<li><a href="login.html">' + icon('log-in') + 'Client login</a></li></ul></div></div>' +
      '<header class="site-header" id="site-header"><div class="container nav">' + brand() +
      '<nav class="nav__primary" aria-label="Primary"><ul class="nav__list">' + navLinks('nav__link') + '</ul></nav>' +
      '<div class="nav__actions">' + toggles + '<a class="btn btn--accent nav__cta" href="partnership.html">Partner With Us</a>' +
      '<button type="button" class="icon-btn nav__toggle" aria-expanded="false" aria-controls="mobile-drawer" aria-label="Open menu">' + icon('menu') + '</button></div></div></header>' +
      '<div class="drawer" id="mobile-drawer" role="dialog" aria-modal="true" aria-label="Site menu" inert>' +
      '<div class="drawer__scrim" data-drawer-close></div><div class="drawer__panel">' +
      '<div class="drawer__head">' + brand() + '<button type="button" class="icon-btn drawer__close" data-drawer-close aria-label="Close menu">' + icon('x') + '</button></div>' +
      '<ul class="drawer__list">' + navLinks('drawer__link') + '</ul>' +
      '<div class="drawer__foot"><a class="btn btn--accent btn--block btn--lg" href="partnership.html">Partner With Us</a>' +
      '<div class="drawer__tools"><span>Appearance &amp; direction</span>' + toggles + '</div>' +
      '<div class="drawer__contact"><a class="ltr" href="tel:' + SITE.phoneHref + '">' + icon('phone') + SITE.phone + '</a><a href="mailto:' + SITE.email + '">' + icon('mail') + SITE.email + '</a><a href="login.html">' + icon('log-in') + 'Client login</a></div></div></div></div>';
  }

  function linkList(items) {
    return '<ul class="footer__links">' + items.map(function (i) { return '<li><a href="' + i[0] + '">' + i[1] + '</a></li>'; }).join('') + '</ul>';
  }

  function footer() {
    var year = new Date().getFullYear();
    return '<footer class="site-footer"><div class="container footer__main">' +
      '<div class="footer__brand">' + brand() +
      '<p class="footer__about">Alturis is a fictional business process outsourcing company created for this website template. We run customer support, back-office and data operations for growing and enterprise businesses.</p>' +
      '<form class="newsletter" data-form="newsletter" data-success-text="Thanks — you are subscribed (demo mode, nothing was sent)." novalidate><label for="newsletter-email">Operations insights, monthly</label>' +
      '<div class="field"><div class="newsletter__row"><input class="input" id="newsletter-email" name="email" type="email" autocomplete="email" placeholder="Work email" required data-label="email address" aria-describedby="newsletter-email-error">' +
      '<button class="btn btn--accent" type="submit">Subscribe</button></div>' +
      '<p class="field__error" id="newsletter-email-error" role="alert">' + icon('alert-circle', 'icon--sm') + '<span></span></p></div>' +
      '<p class="newsletter__msg" data-form-message role="status" aria-live="polite"></p>' +
      '<p class="form-note">Demo form — no data is sent. See documentation to connect your mailing provider.</p></form>' +
      '<ul class="social">' + SITE.social.map(function (s) { return '<li><a href="' + s.href + '" target="_blank" rel="noopener noreferrer" aria-label="' + SITE.name + ' on ' + s.label + ' (opens in a new tab)">' + icon(s.icon) + '</a></li>'; }).join('') + '</ul></div>' +
      '<nav aria-label="Quick links"><h2 class="footer__title">Quick links</h2>' + linkList([['index.html', 'Home'], ['about.html', 'About'], ['services.html', 'Services'], ['industries.html', 'Industries'], ['case-studies.html', 'Case Studies'], ['careers.html', 'Careers'], ['contact.html', 'Contact']]) + '</nav>' +
      '<nav aria-label="Services"><h2 class="footer__title">Services</h2>' + linkList([['service-details.html', 'Customer Support'], ['service-details.html?service=back-office', 'Back-Office Processing'], ['service-details.html?service=data-management', 'Data Management'], ['pricing.html', 'Pricing models'], ['partnership.html', 'Partnership enquiry']]) + '</nav>' +
      '<nav aria-label="Resources"><h2 class="footer__title">Resources</h2>' + linkList([['blog.html', 'Blog'], ['case-studies.html', 'Case Studies'], ['careers.html', 'Careers'], ['home-2.html', 'Global operations'], ['login.html', 'Client login']]) + '</nav>' +
      '<div><h2 class="footer__title">Contact</h2><ul class="footer__contact">' +
      '<li>' + icon('map-pin') + '<address>1200 Meridian Business Park, Suite 400<br>Austin, TX 78701, USA</address></li>' +
      '<li>' + icon('phone') + '<a class="ltr" href="tel:' + SITE.phoneHref + '">' + SITE.phone + '</a></li>' +
      '<li>' + icon('mail') + '<a href="mailto:' + SITE.email + '">' + SITE.email + '</a></li></ul></div></div>' +
      '<div class="container footer__bottom"><p class="mb-0">&copy; <span data-year>' + year + '</span> ' + SITE.name + ' Global Services. Demo template — all names, figures and testimonials are fictional.</p>' +
      '<ul class="footer__legal"><li><a href="privacy.html">Privacy Policy</a></li><li><a href="terms.html">Terms &amp; Conditions</a></li><li><a href="#main">Back to top</a></li></ul></div></footer>';
  }

  function mount(name, html) {
    var host = document.querySelector('[data-component="' + name + '"]');
    if (host) { host.innerHTML = html; }
  }

  document.body.insertAdjacentHTML('afterbegin', sprite());
  if (document.body.getAttribute('data-layout') !== 'bare') {
    mount('header', header());
    mount('footer', footer());
  }
  document.body.insertAdjacentHTML('beforeend', '<div class="toasts" id="toasts" role="region" aria-label="Notifications" aria-live="polite"></div>');

  window.BPO = window.BPO || {};
  window.BPO.icon = icon;
  window.BPO.site = SITE;
})();
