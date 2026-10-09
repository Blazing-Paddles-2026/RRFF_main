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

    var inner = "<style>\n#blazing-paddles-sponsors{margin:32px auto;max-width:1100px;padding:32px 20px;background:#fff;color:#040E27;border-top:1px solid #9D8346;border-bottom:1px solid #9D8346;text-align:center}\n#blazing-paddles-sponsors h2{font-family:Georgia,serif;font-size:28px;line-height:1.2;margin:0 0 8px}\n#blazing-paddles-sponsors .sponsor-intro{font-size:16px;margin:0 0 28px;color:#495167}\n#blazing-paddles-sponsors .sponsor-logo-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:28px 20px}\n#blazing-paddles-sponsors figure{margin:0;min-width:0}\n#blazing-paddles-sponsors .logo-window{position:relative;width:100%;aspect-ratio:730/290;overflow:hidden;border-radius:4px;background:#f3ead9}\n#blazing-paddles-sponsors .logo-window img{position:absolute;display:block;width:147.945206%;max-width:none;height:auto;left:-12.328767%;top:-151.724138%}\n#blazing-paddles-sponsors figcaption{padding:14px 2px 0;font-size:15px;line-height:1.4}\n#blazing-paddles-sponsors strong,#blazing-paddles-sponsors span{display:block}\n#blazing-paddles-sponsors span{font-size:14px;color:#705c30;margin-top:5px}\n@media(max-width:800px){#blazing-paddles-sponsors .sponsor-logo-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}\n@media(max-width:380px){#blazing-paddles-sponsors{padding:24px 12px}#blazing-paddles-sponsors .sponsor-logo-grid{gap:24px 12px}#blazing-paddles-sponsors figcaption{font-size:14px}}\n#blazing-paddles-sponsors .standalone-logo{background:#fff;display:flex;align-items:center;justify-content:center}\n#blazing-paddles-sponsors .standalone-logo img{position:static;width:100%;max-width:100%;height:100%;object-fit:contain;padding:6px;box-sizing:border-box}\n</style><section id=\"blazing-paddles-sponsors\" aria-label=\"2026 Blazing Paddles sponsors\"><h2>Thank You to Our Sponsors</h2><p class=\"sponsor-intro\">2026 Blazing Paddles Pickleball Tournament</p><div class=\"sponsor-logo-grid\"><figure><div class=\"logo-window standalone-logo\"><img src=\"/assets/sponsor-kalahari.png\" alt=\"Kalahari Resorts &amp; Conventions \u2014 Presenting Sponsor\"></div><figcaption><strong>Kalahari Resorts &amp; Conventions</strong><span>Presenting Sponsor</span></figcaption></figure><figure><div class=\"logo-window standalone-logo\"><img src=\"/assets/sponsor-primerica.png\" alt=\"Primerica \u2014 Jeff &amp; Alyse Paull \u2014 Chief Sponsor\"></div><figcaption><strong>Primerica \u2014 Jeff &amp; Alyse Paull</strong><span>Chief Sponsor</span></figcaption></figure><figure><div class=\"logo-window standalone-logo\"><img src=\"/assets/sponsor-john-king.png\" alt=\"John King Construction, Ltd. \u2014 Lieutenant Sponsor\"></div><figcaption><strong>John King Construction, Ltd.</strong><span>Lieutenant Sponsor</span></figcaption></figure><figure><div class=\"logo-window standalone-logo\"><img src=\"/assets/sponsor-gerald-nunn.png\" alt=\"Gerald Nunn Electric \u2014 Firefighter Sponsor\"></div><figcaption><strong>Gerald Nunn Electric</strong><span>Firefighter Sponsor</span></figcaption></figure><figure><div class=\"logo-window standalone-logo\"><img src=\"/assets/sponsor-utz.png\" alt=\"Utz Environmental Services \u2014 Firefighter Sponsor\"></div><figcaption><strong>Utz Environmental Services</strong><span>Firefighter Sponsor</span></figcaption></figure><figure><div class=\"logo-window\"><img src=\"/assets/sponsor-2026-watkins.webp\" alt=\"Watkins Insurance Group \u2014 Firefighter Sponsor\"></div><figcaption><strong>Watkins Insurance Group</strong><span>Firefighter Sponsor</span></figcaption></figure><figure><div class=\"logo-window standalone-logo\"><img src=\"/assets/sponsor-heb.png\" alt=\"H-E-B \u2014 Firefighter Sponsor\"></div><figcaption><strong>H-E-B</strong><span>Firefighter Sponsor</span></figcaption></figure><figure><div class=\"logo-window standalone-logo\"><img src=\"/assets/sponsor-blooms-skulls.png\" alt=\"Blooms &amp; Skulls Face &amp; Body Art \u2014 Firefighter Sponsor\"></div><figcaption><strong>Blooms &amp; Skulls Face &amp; Body Art</strong><span>Firefighter Sponsor</span></figcaption></figure><figure><div class=\"logo-window standalone-logo\"><img src=\"/assets/sponsor-brigade.png\" alt=\"Brigade Electronics, Inc. \u2014 Firefighter Sponsor\"></div><figcaption><strong>Brigade Electronics, Inc.</strong><span>Firefighter Sponsor</span></figcaption></figure><figure><div class=\"logo-window standalone-logo\"><img src=\"/assets/sponsor-georgetown-health.png\" alt=\"Georgetown Health Foundation \u2014 Firefighter Sponsor\"></div><figcaption><strong>Georgetown Health Foundation</strong><span>Firefighter Sponsor</span></figcaption></figure></div></section>";

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
