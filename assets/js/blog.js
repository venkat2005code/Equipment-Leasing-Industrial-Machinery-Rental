/* blog.js — renders blog-details.html from the JSON block #post-data using ?post=<slug>: article body, table of
   contents, share buttons, author box, related posts, reading-progress bar and Article JSON-LD.
   The listing (blog.html) uses the shared filter engine in main.js: search, topic chips, sort, pagination and
   deep links such as ?category=customer-support&page=2. */
(function () {
  'use strict';

  var BPO = window.BPO || {};
  var doc = document;
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var esc = BPO.esc || function (x) { return String(x); };
  var icon = BPO.icon || function () { return ''; };
  var root = $('[data-post-root]'), dataEl = $('#post-data');
  if (!root || !dataEl) { return; }
  var all;
  try { all = JSON.parse(dataEl.textContent); } catch (e) { return; }
  var DEFAULT = 'measuring-customer-experience-outsourced-support';
  var key = BPO.qs.get('post');
  if (!all[key]) { key = DEFAULT; }
  var p = all[key];
  var fdate = function (s) { return new Date(s + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); };

  var toc = [], body = p.body.map(function (sec, i) {
    var id = 's' + (i + 1);
    toc.push([id, sec.h]);
    return '<section aria-labelledby="' + id + '"><h2 id="' + id + '">' + esc(sec.h) + '</h2>' +
      sec.p.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') +
      (sec.ul ? '<ul>' + sec.ul.map(function (li) { return '<li>' + esc(li) + '</li>'; }).join('') + '</ul>' : '') + '</section>';
  }).join('');
  var take = '<aside class="takeaways" aria-labelledby="tk-h"><h2 id="tk-h">Key takeaways</h2><ul class="checklist">' + p.take.map(function (t) { return '<li>' + icon('check-circle') + '<span>' + esc(t) + '</span></li>'; }).join('') + '</ul></aside>';
  var shareRow = function (cls) {
    return '<div class="share ' + (cls || '') + '"><span class="share__label">Share</span>' +
      '<a class="icon-btn" data-share="linkedin" href="https://www.linkedin.com/sharing/share-offsite/" target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn (opens in a new tab)">' + icon('linkedin') + '</a>' +
      '<a class="icon-btn" data-share="x" href="https://twitter.com/intent/tweet" target="_blank" rel="noopener noreferrer" aria-label="Share on X (opens in a new tab)">' + icon('x-social') + '</a>' +
      '<a class="icon-btn" data-share="facebook" href="https://www.facebook.com/sharer/sharer.php" target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook (opens in a new tab)">' + icon('facebook') + '</a>' +
      '<a class="icon-btn" data-share="email" href="mailto:" aria-label="Share by email">' + icon('mail') + '</a>' +
      '<button type="button" class="icon-btn" data-share="copy" aria-label="Copy link">' + icon('link') + '</button></div>';
  };
  var author = '<div class="author-box card"><img class="avatar avatar--lg" src="../assets/images/avatar-' + String(p.avatar).padStart(2, '0') + '.svg" alt="" width="72" height="72" loading="lazy"><div><p class="author-box__label">Written by</p><h2 class="author-box__name">' + esc(p.author) + '</h2><p>' + esc(p.authorRole) + ' at Alturis (fictional author)</p></div></div>';
  var related = p.related.filter(function (k) { return all[k]; }).map(function (k) {
    var r = all[k];
    return '<article class="card card--hover post-card"><div class="card__media"><img src="../assets/images/' + esc(r.img) + '" alt="" width="480" height="320" loading="lazy" decoding="async"></div><div class="card__body">' +
      '<div class="cluster"><span class="badge badge--teal">' + esc(r.catLabel) + '</span></div><h3>' + esc(r.title) + '</h3><p>' + esc(r.excerpt) + '</p>' +
      '<div class="card__meta"><span>' + icon('clock') + r.mins + ' min read</span></div><div class="card__foot"><a class="link-arrow card-link" href="blog-details.html?post=' + esc(k) + '">Read article' + icon('arrow-right', 'icon-dir') + '<span class="visually-hidden">: ' + esc(r.title) + '</span></a></div></div></article>';
  }).join('');

  root.innerHTML =
    '<div class="article-layout"><article class="article" aria-label="' + esc(p.title) + '">' +
    '<figure class="article__figure"><img src="../assets/images/' + esc(p.img) + '" alt="Illustration for the article ' + esc(p.title) + '" width="480" height="320" fetchpriority="high"></figure>' +
    '<p class="lead">' + esc(p.excerpt) + '</p><div class="prose" id="article-body">' + body + take + '</div>' +
    shareRow('share--bottom') + author + '</article>' +
    '<aside class="article-side" aria-label="Article tools"><nav class="card toc" aria-label="Table of contents"><div class="card__body"><h2 class="detail-aside__title">In this article</h2><ol data-toc>' +
    toc.map(function (t) { return '<li><a href="#' + t[0] + '">' + esc(t[1]) + '</a></li>'; }).join('') + '<li><a href="#tk-h">Key takeaways</a></li></ol></div></nav>' +
    '<div class="card"><div class="card__body">' + shareRow('share--side') + '</div></div>' +
    '<div class="card"><div class="card__body"><h2 class="detail-aside__title">Talk to our team</h2><p>Want to apply these ideas to your operation?</p><a class="btn btn--primary btn--block" href="partnership.html">Request a partnership call' + icon('arrow-right', 'icon-dir') + '</a></div></div></aside></div>' +
    '<section class="related" aria-labelledby="rel-h"><h2 id="rel-h">Related articles</h2><div class="grid grid--2">' + related + '</div></section>';

  // Sync the page shell (hero, head, JSON-LD)
  var cat = $('#post-category'); if (cat) { cat.innerHTML = '<a class="badge" href="blog.html?category=' + esc(p.cat) + '">' + esc(p.catLabel) + '</a>'; }
  var meta = $('#post-meta');
  if (meta) { meta.innerHTML = '<li>' + icon('user') + esc(p.author) + '</li><li>' + icon('calendar') + '<time datetime="' + esc(p.date) + '">' + esc(fdate(p.date)) + '</time></li><li>' + icon('clock') + p.mins + ' min read</li>'; }
  BPO.setHero({ h1: p.title, crumb: p.title });
  var shortTitle = p.title.length > 44 ? p.title.slice(0, 43).replace(/\s+\S*$/, '') + '…' : p.title;
  BPO.setHead({ title: shortTitle + ' | Alturis Blog', desc: p.excerpt, query: key === DEFAULT ? '' : '?post=' + key });
  BPO.updateLd('Article', function (j) {
    j.headline = p.title; j.description = p.excerpt; j.image = j.image.replace(/[^/]*$/, p.img); j.datePublished = p.date; j.dateModified = p.date;
    j.author = { '@type': 'Person', name: p.author, jobTitle: p.authorRole }; j.articleSection = p.catLabel;
    j.mainEntityOfPage = j.mainEntityOfPage.split('?')[0] + (key === DEFAULT ? '' : '?post=' + key);
  });
  BPO.updateLd('BreadcrumbList', function (j) { j.itemListElement[2].name = p.title; });
  if (BPO.enhance) { BPO.enhance(root); }

  // Reading progress
  var bar = $('#reading-progress'), art = $('.article');
  if (bar && art) {
    var upd = function () {
      var r = art.getBoundingClientRect(), total = r.height - window.innerHeight * 0.6;
      var v = Math.min(1, Math.max(0, (-r.top + 80) / Math.max(total, 1)));
      bar.style.transform = 'scaleX(' + v.toFixed(3) + ')';
    };
    window.addEventListener('scroll', upd, { passive: true }); window.addEventListener('resize', upd); upd();
  }
})();
