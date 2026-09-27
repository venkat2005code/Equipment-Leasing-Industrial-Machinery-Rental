/* forms.js — client-side validation and submission handling for every <form data-form>.

   INTEGRATION (pick one, per form):
     1. Formspree     <form data-form="contact" data-endpoint="https://formspree.io/f/YOUR_FORM_ID">
     2. Netlify Forms <form data-form="contact" data-endpoint="/" name="contact"> + <input type="hidden" name="form-name" value="contact">
     3. Custom API    <form data-form="contact" data-endpoint="https://api.your-domain.com/v1/enquiries">
   With no data-endpoint the form runs in DEMO MODE: it validates, shows the loading state, then simulates a
   successful response. Append ?simulate=error to any page URL to preview the error state. */
(function () {
  'use strict';

  var BPO = window.BPO = window.BPO || {};
  var doc = document;
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };
  var qs = new URLSearchParams(window.location.search);

  var FREE_MAIL = /@(gmail|yahoo|hotmail|outlook|live|aol|icloud|proton|protonmail)\./i;
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE = /^[+()\d][\d\s().\-]{6,19}$/;

  function labelOf(field) {
    var l = $('.field__label', field);
    if (!l) { return 'this field'; }
    return l.textContent.replace('*', '').replace(/\(optional\)/i, '').trim().toLowerCase();
  }

  function messageFor(field, control) {
    var v = control.type === 'checkbox' ? control.checked : (control.value || '').trim();
    var label = control.getAttribute('data-label') || labelOf(field);
    if (control.type === 'file') {
      var file = control.files && control.files[0];
      if (control.required && !file) { return 'Please attach your ' + label + '.'; }
      if (file) {
        var accept = (control.getAttribute('data-accept') || '').split(',').filter(Boolean);
        var ext = file.name.split('.').pop().toLowerCase();
        if (accept.length && accept.indexOf(ext) === -1) { return 'Unsupported file type. Please upload a ' + accept.join(', ').toUpperCase() + ' file.'; }
        var max = parseFloat(control.getAttribute('data-max-mb') || '5');
        if (file.size > max * 1024 * 1024) { return 'File is too large. The maximum size is ' + max + ' MB.'; }
      }
      return '';
    }
    if (control.type === 'checkbox') { return control.required && !v ? (control.getAttribute('data-error') || 'Please confirm to continue.') : ''; }
    if (control.required && !v) {
      if (label === 'this field') { return 'Please fill in this field.'; }
      return control.tagName === 'SELECT' ? 'Please choose an option for ' + label + '.' : 'Please enter your ' + label + '.';
    }
    if (!v) { return ''; }
    if (control.type === 'email') {
      if (!EMAIL.test(v)) { return 'Enter a valid email address, for example name@company.com.'; }
      if (control.hasAttribute('data-business') && FREE_MAIL.test(v)) { return 'Please use your business email address.'; }
    }
    if (control.type === 'tel' && !PHONE.test(v)) { return 'Enter a valid phone number, including the country code if outside your region.'; }
    if (control.type === 'url' && !/^https?:\/\/[^\s.]+\.[^\s]{2,}/i.test(v)) { return 'Enter a full web address starting with https://'; }
    if (control.minLength > 0 && v.length < control.minLength) { return 'Please enter at least ' + control.minLength + ' characters.'; }
    if (control.getAttribute('data-strong') !== null && !(v.length >= 8 && /[A-Za-z]/.test(v) && /\d/.test(v))) { return 'Use at least 8 characters, including a letter and a number.'; }
    var match = control.getAttribute('data-match');
    if (match) { var other = $(match); if (other && other.value !== control.value) { return 'The values do not match.'; } }
    if (control.type === 'date' && control.hasAttribute('data-min-today')) {
      var today = new Date(); today.setHours(0, 0, 0, 0);
      if (new Date(v + 'T00:00:00') < today) { return 'Choose a date that is today or later.'; }
    }
    return '';
  }

  function setState(field, control, msg) {
    var err = $('.field__error', field);
    field.classList.toggle('is-invalid', !!msg);
    field.classList.toggle('is-valid', !msg && !!control && control.type !== 'checkbox' && control.type !== 'file' && (control.value || '').trim() !== '' && control.hasAttribute('required'));
    if (control) { control.setAttribute('aria-invalid', msg ? 'true' : 'false'); }
    if (err) { var span = $('span', err); (span || err).textContent = msg || ''; }
    return !msg;
  }

  function validateField(field) {
    if (field.hasAttribute('data-require-one')) {
      var any = $$('input[type="checkbox"], input[type="radio"]', field).some(function (c) { return c.checked; });
      return setState(field, null, any ? '' : (field.getAttribute('data-error') || 'Select at least one option.'));
    }
    var control = $('input:not([type="hidden"]), select, textarea', field);
    if (!control) { return true; }
    return setState(field, control, messageFor(field, control));
  }

  function silentlyValid(form) {
    return $$('.field', form).every(function (f) {
      if (f.hasAttribute('data-require-one')) { return $$('input[type="checkbox"], input[type="radio"]', f).some(function (c) { return c.checked; }); }
      var c = $('input:not([type="hidden"]), select, textarea', f);
      return !c || !messageFor(f, c);
    });
  }

  function wireAria(form) {
    $$('.field', form).forEach(function (f, i) {
      var c = $('input:not([type="hidden"]), select, textarea', f), err = $('.field__error', f);
      if (!err) { return; }
      var host = c || f;
      err.id = err.id || ((c && c.id ? c.id : 'field-' + i) + '-error');
      if (c) {
        var ids = (c.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
        if (ids.indexOf(err.id) === -1) { ids.push(err.id); }
        c.setAttribute('aria-describedby', ids.join(' '));
      } else { host.setAttribute('aria-describedby', err.id); }
    });
  }

  function prefill(form) {
    if (!form.hasAttribute('data-prefill')) { return; }
    qs.forEach(function (value, key) {
      var boxName = key === 'service' ? 'services' : key;
      $$('input[type="checkbox"][name="' + boxName + '"]', form).forEach(function (c) { if (c.value === value) { c.checked = true; } });
      var el = form.elements[key];
      if (!el || el.length !== undefined && el.tagName !== 'SELECT') { return; }
      if (el.tagName === 'SELECT') { if ($$('option', el).some(function (o) { return o.value === value; })) { el.value = value; } }
      else if (el.type !== 'file' && el.type !== 'checkbox' && !el.value) { el.value = value.slice(0, 200); }
    });
  }

  function send(form) {
    var endpoint = form.getAttribute('data-endpoint');
    if (endpoint) {
      var opts = { method: form.getAttribute('data-method') || 'POST', body: new FormData(form), headers: { Accept: 'application/json' } };
      return window.fetch(endpoint, opts).then(function (r) { if (!r.ok) { throw new Error('HTTP ' + r.status); } return r; });
    }
    return new Promise(function (resolve, reject) {
      window.setTimeout(function () { if (qs.get('simulate') === 'error') { reject(new Error('Simulated failure')); } else { resolve(); } }, 1200);
    });
  }

  function initForm(form) {
    if (form.getAttribute('data-ready')) { return; }
    form.setAttribute('data-ready', '1');
    form.setAttribute('novalidate', '');
    wireAria(form);
    prefill(form);
    var submitBtn = $('button[type="submit"]', form);
    var success = $('[data-form-success]', form), failure = $('[data-form-error]', form), msg = $('[data-form-message]', form);
    var gated = form.hasAttribute('data-disable-until-valid');
    var refreshGate = function () { if (gated && submitBtn && !submitBtn.hasAttribute('aria-busy')) { submitBtn.disabled = !silentlyValid(form); } };
    refreshGate();

    form.addEventListener('focusout', function (e) {
      var f = e.target.closest && e.target.closest('.field');
      if (f && f.closest('form') === form && e.target.tagName !== 'BUTTON') { validateField(f); }
    });
    var live = function (e) {
      var f = e.target.closest && e.target.closest('.field');
      if (f && (f.classList.contains('is-invalid') || e.target.type === 'file' || e.target.type === 'checkbox' || e.target.tagName === 'SELECT')) { validateField(f); }
      if (e.target.type === 'file') { showFile(e.target); }
      refreshGate();
    };
    form.addEventListener('input', live);
    form.addEventListener('change', live);

    $$('[data-toggle-password]', form).forEach(function (b) {
      b.addEventListener('click', function () {
        var input = doc.getElementById(b.getAttribute('aria-controls'));
        if (!input) { return; }
        var show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        b.setAttribute('aria-pressed', String(show));
        b.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (success) { success.hidden = true; } if (failure) { failure.hidden = true; }
      var bad = $$('.field', form).filter(function (f) { return !validateField(f); });
      if (bad.length) {
        var first = $('input:not([type="hidden"]), select, textarea', bad[0]);
        if (first) { first.focus(); }
        if (failure && form.hasAttribute('data-summary')) {
          $('[data-error-text]', failure).textContent = 'Please correct ' + bad.length + (bad.length === 1 ? ' field' : ' fields') + ' highlighted below and try again.';
          failure.hidden = false;
        }
        return;
      }
      var trap = $('.honeypot input', form);
      var original = submitBtn ? submitBtn.innerHTML : '';
      var done = function () {
        if (submitBtn) { submitBtn.removeAttribute('aria-busy'); submitBtn.innerHTML = original; submitBtn.disabled = false; }
        refreshGate();
      };
      if (submitBtn) {
        submitBtn.setAttribute('aria-busy', 'true'); submitBtn.disabled = true;
        submitBtn.textContent = form.getAttribute('data-loading-label') || 'Sending…';
      }
      var request = trap && trap.value ? Promise.resolve() : send(form);
      request.then(function () {
        form.reset();
        $$('.field', form).forEach(function (f) { f.classList.remove('is-valid', 'is-invalid'); });
        $$('.file-drop__name', form).forEach(function (n) { n.textContent = ''; });
        var successText = form.getAttribute('data-success-text') || 'Thank you — your message has been received.';
        if (msg) { msg.textContent = successText; }
        if (success) { success.hidden = false; success.setAttribute('tabindex', '-1'); success.focus(); }
        BPO.toast(successText);
        done();
        form.dispatchEvent(new CustomEvent('bpo:submitted'));
      }).catch(function () {
        if (failure) { $('[data-error-text]', failure).textContent = 'We could not send your request. Please check your connection and try again, or email us directly.'; failure.hidden = false; failure.setAttribute('tabindex', '-1'); failure.focus(); }
        else if (msg) { msg.textContent = 'Something went wrong — please try again.'; }
        BPO.toast('Submission failed. Please try again.', 'error');
        done();
      });
    });
  }

  function showFile(input) {
    var field = input.closest('.field'), name = field && $('.file-drop__name', field);
    if (name) { name.textContent = input.files && input.files[0] ? input.files[0].name + ' (' + Math.max(1, Math.round(input.files[0].size / 1024)) + ' KB)' : ''; }
  }

  BPO.forms = { init: function (scope) { $$('form[data-form]', scope || doc).forEach(initForm); }, validateField: validateField };
  BPO.forms.init(doc);
})();
