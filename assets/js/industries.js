/* industries.js — fills the "Example workflows" modal on industries.html from the JSON block #industry-data.
   Deep link: industries.html?workflows=healthcare opens the modal for that industry on load. */
(function () {
  'use strict';

  var BPO = window.BPO || {};
  var doc = document;
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var esc = BPO.esc || function (x) { return String(x); };
  var icon = BPO.icon || function () { return ''; };
  var dataEl = $('#industry-data'), dlg = $('#industry-modal');
  if (!dataEl || !dlg) { return; }
  var data;
  try { data = JSON.parse(dataEl.textContent); } catch (e) { return; }
  var VALID_CONTACT = ['healthcare', 'banking', 'insurance', 'retail', 'ecommerce', 'telecom', 'travel', 'logistics', 'technology', 'professional'];

  dlg.addEventListener('bpo:before-open', function (ev) {
    var trigger = ev.detail && ev.detail.trigger;
    var key = trigger && trigger.getAttribute('data-industry');
    var d = data[key];
    if (!d) { return; }
    $('#industry-modal-title').textContent = d.name + ' — example workflows';
    var flows = d.workflows.map(function (w) {
      return '<section class="wf"><h3>' + esc(w.title) + '</h3><ol class="wf__steps">' +
        w.steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol></section>';
    }).join('');
    var caps = d.caps.map(function (c) { return '<li class="tag">' + esc(c) + '</li>'; }).join('');
    $('#industry-modal-body').innerHTML = '<p>' + esc(d.summary) + '</p><ul class="tags">' + caps + '</ul>' + flows +
      '<p class="form-note">Illustrative workflows for demonstration. Actual processes are defined during service design.</p>';
    $('#industry-modal-cta').setAttribute('href', 'contact.html?industry=' + (VALID_CONTACT.indexOf(key) > -1 ? key : 'other'));
  });

  var wanted = BPO.qs && BPO.qs.get('workflows');
  if (wanted && data[wanted]) {
    var btn = $('[data-industry="' + wanted.replace(/"/g, '') + '"]');
    if (btn) { window.setTimeout(function () { BPO.openModal('industry-modal', btn); }, 150); }
  }
})();
