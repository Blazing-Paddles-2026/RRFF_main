/* 1884 Fund launch campaign (Oct 26 – Dec 1, 2026, Giving Tuesday)
   ----------------------------------------------------------------
   Naming rule (decided Oct 24, 2026): no titles. The program is simply
   "The 1884 Fund." No "Legacy Circle" and no "Founding 100" — "the first
   100" is plain language only.

   The React bundle renders the 1884 Fund page and the homepage, so this
   script (like the other shims) rewrites the DOM rather than the bundle:

   1. 1884 Fund page (#/the-1884-fund): inserts the campaign at the top and
      hides the old hero, "Why 1884", "How It Works", and "Legacy Circle"
      sections. Keeps "Why It Matters" (Wylie's quote about Bailey), the
      CRACKYL callout, and the newsletter signup — the page leads with the
      ask and lands with the heart.
   2. Homepage: replaces the "How to Help · Legacy Circle" section with a
      campaign callout and retires "Founding Legacy Donor" wording.
   3. Get Involved card + footer: "Legacy Circle" wording -> The 1884 Fund.

   Idempotent and SPA-navigation safe. */
(function () {
  'use strict';

  var DONATE = 'https://ctxcf.fcsuite.com/erp/donate/create/fund?funit_id=1111';
  var FUND = '#/the-1884-fund';
  var DEADLINE = Date.parse('2026-12-01T23:59:00-06:00'); // 11:59 p.m. Central (CST)
  var HOWTO = 'On the donation page, select Recurring Donation Amount, choose Other Amount, and enter $18.84.';

  function donateBtn(label, cls) {
    return '<a class="c84-btn c84-btn-primary ' + (cls || '') + '" href="' + DONATE +
      '" target="_blank" rel="noopener noreferrer">' + label + ' <span aria-hidden="true">&rsaquo;</span></a>';
  }

  var STAR = '<span class="c84-rule" aria-hidden="true"><i></i><b>&#10022;</b><i></i></span>';

  /* ---------- 1884 Fund page campaign ---------- */
  function buildFundCampaign() {
    var wrap = document.createElement('div');
    wrap.setAttribute('data-c84', 'fund');
    wrap.className = 'c84';
    wrap.innerHTML = [
      '<section class="c84-hero">',
        '<div class="c84-hero-photo" aria-hidden="true"></div>',
        '<div class="c84-hero-copy">',
          '<p class="c84-kicker">Round Rock Fire Foundation</p>',
          '<h1 class="c84-logo-h"><img src="/images/1884-fund-logo-navy.png" alt="The 1884 Fund" width="280"></h1>',
          STAR,
          '<p class="c84-tag">100 people. $18.84 each.<br>$1,884 together &mdash; every month.</p>',
          '<div class="c84-price">',
            '<div class="c84-price-big"><span class="c84-goldtxt">$18.84</span><small>Per Month</small></div>',
            '<div class="c84-price-side"><p>Round Rock\u2019s firefighters serve our community every day. The Round Rock Fire Foundation exists to make sure they and their families don\u2019t face the unexpected alone.</p></div>',
          '</div>',
          '<div class="c84-cta-row">',
            donateBtn('Join the 1884 Fund', 'c84-btn-lg'),
            '<a class="c84-btn c84-btn-ghost c84-btn-lg" href="#c84-how" data-c84-scroll="c84-how">How to join</a>',
          '</div>',
        '</div>',
      '</section>',

      '<section class="c84-band c84-cream2">',
        '<div class="c84-container c84-narrow c84-center">',
          '<p class="c84-kicker">Launching Today</p>',
          '<h2 class="c84-h2">Help establish The 1884 Fund</h2>',
          STAR,
          '<p class="c84-lead">Today we launch a campaign to help establish The 1884 Fund, our emergency-relief fund for Round Rock fire families, currently under development.</p>',
        '</div>',
      '</section>',

      '<section class="c84-band c84-navy">',
        '<div class="c84-container c84-why">',
          '<img class="c84-why-logo" src="/images/1884-fund-logo-white.png" alt="" aria-hidden="true">',
          '<div class="c84-why-copy">',
            '<p class="c84-kicker">Why $18.84</p>',
            '<h2 class="c84-h2">The year it all began</h2>',
            '<p class="c84-lead"><strong>1884: the year Round Rock\u2019s first fire company formed.</strong> That\u2019s why the gift is $18.84 a month &mdash; the year it all began, given every month.</p>',
          '</div>',
        '</div>',
      '</section>',

      '<section class="c84-band">',
        '<div class="c84-container">',
          '<div class="c84-head">',
            '<p class="c84-kicker">How It Adds Up</p>',
            '<h2 class="c84-h2">No one carries it alone</h2>',
            STAR,
          '</div>',
          '<p class="c84-statement">100 people. $18.84 each.<br><span>$1,884 together &mdash; every month.</span></p>',
          '<p class="c84-lead c84-center c84-adds">Here\u2019s how it adds up: 100 people giving $18.84 each comes to $1,884 together, every month. No one carries it alone. Everyone carries a little, and together it becomes a steady source of help for the families behind Round Rock\u2019s firefighters.</p>',
        '</div>',
      '</section>',

      '<section class="c84-goldband">',
        '<div class="c84-container c84-gold-grid">',
          '<div>',
            '<h2 class="c84-gold-h">Be one of the first 100</h2>',
            '<p class="c84-gold-p">Join by <strong>December 1, 2026 at 11:59 p.m. Central</strong> to be one of the first 100 people building this fund. After December 1, giving continues &mdash; the launch window simply ends.</p>',
          '</div>',
          '<div class="c84-gold-side">',
            '<div class="c84-cd" data-c84-cd>',
              '<div><span data-u="d">--</span><small>Days</small></div>',
              '<div><span data-u="h">--</span><small>Hours</small></div>',
              '<div><span data-u="m">--</span><small>Minutes</small></div>',
            '</div>',
            '<p class="c84-cd-note" data-c84-cd-note>Join by December 1 &middot; Giving Tuesday</p>',
          '</div>',
        '</div>',
      '</section>',

      '<section class="c84-band c84-cream2" id="c84-how">',
        '<div class="c84-container">',
          '<div class="c84-head">',
            '<p class="c84-kicker">How to Join</p>',
            '<h2 class="c84-h2">Three simple steps</h2>',
            STAR,
            '<p>How to join: ' + HOWTO + '</p>',
          '</div>',
          '<ol class="c84-steps">',
            '<li><span class="c84-step-n">1</span><h3>Select</h3><p>Recurring Donation Amount</p></li>',
            '<li><span class="c84-step-n">2</span><h3>Choose</h3><p>Other Amount</p></li>',
            '<li class="c84-step-navy"><span class="c84-step-n">3</span><h3>Enter</h3><p class="c84-step-amt">$18.84</p></li>',
          '</ol>',
          '<div class="c84-cta-row c84-center-row">', donateBtn('Join the 1884 Fund', 'c84-btn-xl'), '</div>',
        '</div>',
      '</section>'
    ].join('');
    return wrap;
  }

  /* ---------- Homepage callout ---------- */
  function buildHomeCallout() {
    var s = document.createElement('section');
    s.setAttribute('data-c84', 'home');
    s.className = 'c84 c84-home';
    s.innerHTML = [
      '<div class="c84-home-card">',
        '<div class="c84-home-photo" aria-hidden="true"></div>',
        '<div class="c84-home-copy">',
          '<p class="c84-kicker">Now Launching</p>',
          '<img class="c84-home-logo" src="/images/1884-fund-logo-navy.png" alt="The 1884 Fund" width="200">',
          STAR,
          '<p class="c84-tag">100 people. $18.84 each.<br>$1,884 together &mdash; every month.</p>',
          '<p class="c84-body">Help establish The 1884 Fund, our emergency-relief fund for Round Rock fire families, currently under development. <strong>1884: the year Round Rock\u2019s first fire company formed.</strong></p>',
          '<p class="c84-body" style="margin-top:12px">Join by December 1, 2026 at 11:59 p.m. Central to be one of the first 100 people building this fund.</p>',
          '<div class="c84-cta-row">',
            donateBtn('Join the 1884 Fund', 'c84-btn-lg'),
            '<a class="c84-btn c84-btn-ghost c84-btn-lg" href="' + FUND + '">See the campaign</a>',
          '</div>',
          '<p class="c84-howto">How to join: ' + HOWTO + '</p>',
        '</div>',
      '</div>'
    ].join('');
    return s;
  }

  /* ---------- helpers ---------- */
  function hide(el) { if (el && !el.hasAttribute('data-c84-hidden')) el.setAttribute('data-c84-hidden', '1'); }
  function txt(el) { return (el.textContent || '').replace(/\s+/g, ' ').trim(); }

  function fillDots(root) {
    var box = root.querySelector('.c84-dots');
    if (!box || box.childNodes.length) return;
    for (var i = 0; i < 100; i++) {
      var d = document.createElement('span');
      d.style.transitionDelay = (i * 18) + 'ms';
      box.appendChild(d);
    }
    var go = function () { box.classList.add('is-filled'); };
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { go(); io.disconnect(); } });
      }, { threshold: 0.25 });
      io.observe(box);
    } else { go(); }
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function tick() {
    var ms = DEADLINE - Date.now();
    var cds = document.querySelectorAll('[data-c84-cd]');
    for (var i = 0; i < cds.length; i++) {
      var cd = cds[i], note = cd.parentNode.querySelector('[data-c84-cd-note]');
      if (ms <= 0) {
        cd.style.display = 'none';
        if (note) note.textContent = 'The launch window has ended. Giving continues \u2014 join anytime at $18.84 a month.';
        continue;
      }
      var m = Math.floor(ms / 60000);
      cd.querySelector('[data-u="d"]').textContent = Math.floor(m / 1440);
      cd.querySelector('[data-u="h"]').textContent = pad(Math.floor((m % 1440) / 60));
      cd.querySelector('[data-u="m"]').textContent = pad(m % 60);
    }
  }

  /* ---------- page logic ---------- */
  function onFundPage(main) {
    var hero = main.querySelector(':scope > section.min-h-\\[60vh\\]');
    if (!hero) return false;
    var secs = main.querySelectorAll(':scope > section');
    for (var i = 0; i < secs.length; i++) {
      var s = secs[i]; if (s.hasAttribute('data-c84')) continue;
      var t = txt(s).slice(0, 80);
      if (s === hero || /^Why 1884/i.test(t) || /^How It Works/i.test(t) || /^Legacy Circle/i.test(t)) hide(s);
    }
    if (!main.querySelector('[data-c84="fund"]')) {
      var c = buildFundCampaign();
      main.insertBefore(c, hero);
      tick();
    }
    return true;
  }

  function onHome(main) {
    if (!main.querySelector('section#fund')) return false;
    var secs = main.querySelectorAll(':scope > section');
    var legacy = null;
    for (var i = 0; i < secs.length; i++) {
      if (/^How to Help\s*·\s*Legacy Circle/i.test(txt(secs[i]))) { legacy = secs[i]; break; }
    }
    if (legacy) {
      hide(legacy);
      if (!main.querySelector('[data-c84="home"]')) main.insertBefore(buildHomeCallout(), legacy);
    }
    // Hero CTA + Why/What/How "How" card
    var links = main.querySelectorAll('a');
    for (var j = 0; j < links.length; j++) {
      var a = links[j];
      if (txt(a) === 'Become a Founding Legacy Donor') {
        a.textContent = 'Join the 1884 Fund';
        a.setAttribute('href', FUND); a.removeAttribute('target'); a.removeAttribute('rel');
      }
    }
    var ps = main.querySelectorAll('p');
    for (var k = 0; k < ps.length; k++) {
      if (txt(ps[k]) === 'Founding Legacy Donors and community partners help launch lasting care.') {
        ps[k].textContent = '100 people giving $18.84 a month help establish The 1884 Fund.';
      }
    }
    return true;
  }

  function sitewide() {
    // Get Involved card
    var h3s = document.querySelectorAll('h3');
    for (var i = 0; i < h3s.length; i++) {
      var h = h3s[i];
      if (txt(h) !== 'Legacy Circle') continue;
      var card = h.parentNode;
      var p = card.querySelector('p');
      var a = card.querySelector('a[href^="/legacy-circle"]');
      if (!p || !a) continue;
      h.textContent = 'The 1884 Fund';
      p.textContent = 'Give $18.84 a month to help establish The 1884 Fund, our emergency-relief fund for Round Rock fire families. Join by December 1 to be one of the first 100.';
      a.setAttribute('href', FUND); a.removeAttribute('target'); a.removeAttribute('rel');
      if (a.firstChild && a.firstChild.nodeType === 3) a.firstChild.nodeValue = 'Join the Campaign ';
    }
    // Footer "Legacy donor circle" (plain span) -> link to the fund
    var spans = document.querySelectorAll('footer span');
    for (var j = 0; j < spans.length; j++) {
      var s = spans[j];
      if (txt(s) !== 'Legacy donor circle') continue;
      s.innerHTML = '<a class="text-white/60 hover:text-white text-sm transition-colors" href="' + FUND + '">The 1884 Fund</a>';
    }
  }

  function cleanup(main) {
    // Remove campaign blocks left behind after SPA navigation.
    var fund = document.querySelector('[data-c84="fund"]');
    if (fund && !(main && main.querySelector(':scope > section.min-h-\\[60vh\\]'))) fund.remove();
    var home = document.querySelector('[data-c84="home"]');
    if (home && !(main && main.querySelector('section#fund'))) home.remove();
  }

  var busy = false;
  function run() {
    if (busy) return; busy = true;
    try {
      var main = document.querySelector('main');
      cleanup(main);
      if (main) { onFundPage(main) || onHome(main); }
      sitewide();
    } finally { busy = false; }
  }

  function init() {
    run();
    new MutationObserver(run).observe(document.body, { childList: true, subtree: true });
    window.addEventListener('hashchange', function () { setTimeout(run, 300); setTimeout(run, 900); });
    setInterval(tick, 30000);
    // In-page "How to join" scroll (hash links would trigger the SPA router)
    document.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('[data-c84-scroll]');
      if (!t) return;
      var el = document.getElementById(t.getAttribute('data-c84-scroll'));
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
