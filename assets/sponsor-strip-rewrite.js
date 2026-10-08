/* Sponsor strip rewrite
   ---------------------
   The homepage compiled bundle hard-codes a "2025 Blazing Paddles Pickleball
   Tournament Sponsors" strip with last year's logos. This script finds that
   strip after render and replaces it with a clean "Become a sponsor" callout
   while 2026 sponsors are still being secured.

   When 2026 sponsors are confirmed, either:
   - Update the SPONSORS_2026 array below to list them, OR
   - Remove this script entirely and rebuild the React bundle with the real list.
*/
(function () {
  'use strict';

  // ===== CONFIG =====
  // Once 2026 sponsors are confirmed, add them here. While this is empty
  // the strip shows a "Become a sponsor" callout instead.
  var SPONSORS_2026 = [
    // 'Sponsor Name',
  ];

  // Only run on the homepage
  var path = (location.pathname || '').replace(/\/+$/, '');
  if (path !== '' && path !== '/index.html') return;

  var PATCHED = false;

  function findStrip() {
    // The 2025 sponsors are a string in the React text. Find the text node
    // that says "2025 Blazing Paddles" and walk up to the reveal wrapper.
    var all = document.querySelectorAll('div, p, span, h2, h3, h4');
    for (var i = 0; i < all.length; i++) {
      var t = all[i].textContent || '';
      // Match the heading line specifically, not the whole strip's combined text
      if (
        all[i].children.length === 0 &&
        /2025\s+Blazing\s+Paddles\s+Pickleball\s+Tournament\s+Sponsors/i.test(t)
      ) {
        // Walk up to the reveal container that wraps the whole strip
        var n = all[i];
        for (var hop = 0; hop < 6 && n; hop++) {
          if (n.classList && (n.classList.contains('reveal') || /text-center/.test(n.className || ''))) {
            return n;
          }
          n = n.parentElement;
        }
        return all[i].parentElement;
      }
    }
    return null;
  }

  function buildCallout() {
    var wrap = document.createElement('div');
    wrap.className = 'text-center';
    wrap.setAttribute('data-rrff-2026-callout', 'true');
    wrap.style.cssText = 'margin-top: 1.5rem;';

    var inner = "<style>#blazing-paddles-sponsors{margin:2rem auto;max-width:1100px;color:#040e27}#blazing-paddles-sponsors h2{font-size:28px;margin:8px 0 24px}#blazing-paddles-sponsors .confirmed-sponsors{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}#blazing-paddles-sponsors figure{margin:0;min-width:0}#blazing-paddles-sponsors img{display:block;width:100%;height:auto;border-radius:10px}#blazing-paddles-sponsors figcaption{padding:12px 0;line-height:1.4;font-size:16px}#blazing-paddles-sponsors strong,#blazing-paddles-sponsors span{display:block}#blazing-paddles-sponsors span{font-size:14px;margin-top:4px}@media(min-width:900px){#blazing-paddles-sponsors .confirmed-sponsors{grid-template-columns:repeat(4,minmax(0,1fr))}}@media(max-width:420px){#blazing-paddles-sponsors .confirmed-sponsors{grid-template-columns:1fr}}</style><section class=\"section section-alt\" id=\"blazing-paddles-sponsors\"><div class=\"container\"><header class=\"section-head\"><p class=\"kicker\">2026 Blazing Paddles</p><h2 class=\"section-title\">Thank You to Our Sponsors</h2></header><div class=\"confirmed-sponsors\"><figure class=\"confirmed-sponsor\"><img src=\"https://pickleball.roundrockfirefoundation.org/assets/images/sponsor-2026-kalahari.webp\" alt=\"Kalahari Resorts &amp; Conventions \u2014 Presenting Sponsor\" width=\"640\" height=\"800\" loading=\"lazy\"><figcaption><strong>Kalahari Resorts &amp; Conventions</strong><span>Presenting Sponsor</span></figcaption></figure><figure class=\"confirmed-sponsor\"><img src=\"https://pickleball.roundrockfirefoundation.org/assets/images/sponsor-2026-primerica.webp\" alt=\"Primerica \u2014 Jeff &amp; Alyse Paull \u2014 Chief Sponsor\" width=\"640\" height=\"800\" loading=\"lazy\"><figcaption><strong>Primerica \u2014 Jeff &amp; Alyse Paull</strong><span>Chief Sponsor</span></figcaption></figure><figure class=\"confirmed-sponsor\"><img src=\"https://pickleball.roundrockfirefoundation.org/assets/images/sponsor-2026-john-king.webp\" alt=\"John King Construction, Ltd. \u2014 Lieutenant Sponsor\" width=\"640\" height=\"800\" loading=\"lazy\"><figcaption><strong>John King Construction, Ltd.</strong><span>Lieutenant Sponsor</span></figcaption></figure><figure class=\"confirmed-sponsor\"><img src=\"https://pickleball.roundrockfirefoundation.org/assets/images/sponsor-2026-nunn.webp\" alt=\"Gerald Nunn Electric \u2014 Firefighter Sponsor\" width=\"640\" height=\"800\" loading=\"lazy\"><figcaption><strong>Gerald Nunn Electric</strong><span>Firefighter Sponsor</span></figcaption></figure><figure class=\"confirmed-sponsor\"><img src=\"https://pickleball.roundrockfirefoundation.org/assets/images/sponsor-2026-utz.webp\" alt=\"Utz Environmental Services \u2014 Firefighter Sponsor\" width=\"640\" height=\"800\" loading=\"lazy\"><figcaption><strong>Utz Environmental Services</strong><span>Firefighter Sponsor</span></figcaption></figure><figure class=\"confirmed-sponsor\"><img src=\"https://pickleball.roundrockfirefoundation.org/assets/images/sponsor-2026-watkins.webp\" alt=\"Watkins Insurance Group \u2014 Firefighter Sponsor\" width=\"640\" height=\"800\" loading=\"lazy\"><figcaption><strong>Watkins Insurance Group</strong><span>Firefighter Sponsor</span></figcaption></figure><figure class=\"confirmed-sponsor\"><img src=\"https://pickleball.roundrockfirefoundation.org/assets/images/sponsor-2026-heb.webp\" alt=\"H-E-B \u2014 Firefighter Sponsor\" width=\"640\" height=\"800\" loading=\"lazy\"><figcaption><strong>H-E-B</strong><span>Firefighter Sponsor</span></figcaption></figure><figure class=\"confirmed-sponsor\"><img src=\"https://pickleball.roundrockfirefoundation.org/assets/images/sponsor-2026-blooms-skulls.webp\" alt=\"Blooms &amp; Skulls Face &amp; Body Art \u2014 Firefighter Sponsor\" width=\"640\" height=\"800\" loading=\"lazy\"><figcaption><strong>Blooms &amp; Skulls Face &amp; Body Art</strong><span>Firefighter Sponsor</span></figcaption></figure></div></div></section>";

    wrap.innerHTML = inner;
    return wrap;
  }

  function patch() {
    if (PATCHED) return;
    var strip = findStrip();
    if (!strip || !strip.parentNode) return;
    PATCHED = true;
    var callout = buildCallout();
    strip.parentNode.replaceChild(callout, strip);
  }

  // Run now and on subsequent renders
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', patch);
  } else {
    patch();
  }
  var mo = new MutationObserver(function () { if (!PATCHED) patch(); });
  mo.observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(function () { mo.disconnect(); }, 15000);
})();
