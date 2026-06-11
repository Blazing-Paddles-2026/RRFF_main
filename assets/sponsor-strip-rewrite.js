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

    var inner;
    if (SPONSORS_2026 && SPONSORS_2026.length > 0) {
      // 2026 sponsors confirmed: render them as chips
      inner =
        '<p style="color: hsl(220,15%,40%); font-size: 0.875rem; margin-bottom: 1rem; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase;">' +
          '2026 Blazing Paddles Pickleball Tournament Sponsors' +
        '</p>' +
        '<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem;">';
      for (var s = 0; s < SPONSORS_2026.length; s++) {
        var name = String(SPONSORS_2026[s]).replace(/</g, '&lt;');
        inner +=
          '<div style="border: 1px solid hsl(40,15%,90%); border-radius: 0.5rem; padding: 0.75rem 1.5rem; color: hsl(220,15%,40%); font-size: 0.875rem;">' +
            name +
          '</div>';
      }
      inner += '</div>';
    } else {
      // No 2026 sponsors yet: invite businesses to sponsor
      inner =
        '<div style="max-width: 640px; margin: 0 auto; padding: 2rem 1.5rem; border: 1px solid hsl(40,15%,90%); border-radius: 0.75rem; background: hsl(40,20%,98%);">' +
          '<p style="color: hsl(43,75%,45%); font-size: 0.8125rem; margin: 0 0 0.5rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;">' +
            'Blazing Paddles 2026' +
          '</p>' +
          '<h3 style="font-family: \'Playfair Display\', Georgia, serif; color: hsl(220,15%,15%); font-size: 1.5rem; line-height: 1.25; margin: 0 0 0.75rem; font-weight: 600;">' +
            'Be part of the Blazing Paddles 2026 sponsor list.' +
          '</h3>' +
          '<p style="color: hsl(220,15%,40%); font-size: 0.95rem; line-height: 1.5; margin: 0 0 1.25rem;">' +
            'Sponsorships are open for the October 10, 2026 tournament. ' +
            'Four tiers, every dollar tax-deductible, every gift directly supports Round Rock firefighter families.' +
          '</p>' +
          '<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.75rem;">' +
            '<a href="https://pickleball.roundrockfirefoundation.org/sponsor.html" target="_blank" rel="noopener noreferrer" ' +
               'style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; border-radius: 999px; ' +
                      'background: hsl(43,75%,55%); color: hsl(0,0%,4%); font-weight: 700; font-size: 0.9375rem; text-decoration: none;">' +
              'See Sponsor Levels' +
            '</a>' +
            '<a href="mailto:info@roundrockfirefoundation.org?subject=Blazing%20Paddles%202026%20Sponsorship" ' +
               'style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; border-radius: 999px; ' +
                      'border: 1px solid hsl(40,15%,80%); color: hsl(220,15%,25%); font-weight: 600; font-size: 0.9375rem; text-decoration: none; background: white;">' +
              'Email to Sponsor' +
            '</a>' +
          '</div>' +
        '</div>';
    }

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
