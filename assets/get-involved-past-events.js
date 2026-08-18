/**
 * get-involved-past-events.js
 *
 * The "Ways to Participate" list on the Get Involved page (/#/get-involved)
 * is compiled into the React bundle with three cards under a single
 * "Upcoming" eyebrow: Fire Foundation Night at Dell Diamond (May 29, 2026 —
 * already happened), Blazing Paddles Pickleball Tournament (Oct 18, 2026),
 * and the National Spouse Conference (Nov 6-8, 2026).
 *
 * This shim splits that list: it moves the Foundation Night card out into a
 * new "Past Events" group below, dims it and tags it "Past Event", and makes
 * sure Blazing Paddles is the first card in the remaining upcoming list.
 *
 * Idempotent and SPA-safe via a MutationObserver, matching the pattern used
 * by featured-event-rewrite.js / why-what-how.js elsewhere in this repo.
 */
(function () {
  'use strict';

  function patch() {
    // Find the "Ways to Participate" heading
    var headings = document.querySelectorAll('h2');
    var heading = null;
    for (var i = 0; i < headings.length; i++) {
      if ((headings[i].textContent || '').trim() === 'Ways to Participate') {
        heading = headings[i];
        break;
      }
    }
    if (!heading) return;

    var headerWrap = heading.parentElement; // div.text-center.mb-12
    if (!headerWrap) return;

    // The header is itself wrapped in a scroll-reveal div, so the cards
    // list is actually the reveal wrapper's next sibling, not headerWrap's.
    var revealWrap = headerWrap.parentElement;
    if (!revealWrap) return;

    var list = revealWrap.nextElementSibling; // div.space-y-4 (the upcoming cards)
    var section = revealWrap.parentElement; // container we append the Past group into
    if (!list || !section) return;

    if (section.getAttribute('data-rrff-past-done') === 'true') {
      // Already split — just make sure Blazing Paddles is still first.
      ensureBlazingPaddlesFirst(list);
      return;
    }

    // Find the Foundation Night card among the upcoming cards
    var foundationCard = null;
    for (var c = 0; c < list.children.length; c++) {
      if ((list.children[c].textContent || '').indexOf('Fire Foundation Night at Dell Diamond') !== -1) {
        foundationCard = list.children[c];
        break;
      }
    }
    if (!foundationCard) return; // nothing to move (yet)

    section.setAttribute('data-rrff-past-done', 'true');

    // --- Remove it from the upcoming list ---
    list.removeChild(foundationCard);
    ensureBlazingPaddlesFirst(list);

    // --- Dim it and tag it as a past event ---
    var styledCard = foundationCard.firstElementChild || foundationCard;
    styledCard.style.opacity = '0.7';
    styledCard.style.position = 'relative';

    var badge = document.createElement('span');
    badge.textContent = 'Past Event';
    badge.style.position = 'absolute';
    badge.style.top = '14px';
    badge.style.right = '16px';
    badge.style.fontSize = '10px';
    badge.style.fontWeight = '700';
    badge.style.letterSpacing = '1.5px';
    badge.style.textTransform = 'uppercase';
    badge.style.color = 'rgba(255,255,255,0.75)';
    badge.style.background = 'rgba(0,0,0,0.55)';
    badge.style.padding = '4px 10px';
    badge.style.borderRadius = '999px';
    badge.style.pointerEvents = 'none';
    styledCard.appendChild(badge);

    // --- Build the "Past Events" header + list ---
    var pastHeaderWrap = document.createElement('div');
    pastHeaderWrap.setAttribute('style', 'text-align:center;margin-top:64px;margin-bottom:48px;');
    pastHeaderWrap.innerHTML =
      '<span style="display:block;margin-bottom:16px;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:hsl(43,75%,55%);">Past</span>' +
      '<h2 style="font-size:clamp(28px,3.4vw,36px);font-weight:300;color:#fff;margin:0;">Past Events</h2>';

    var pastList = document.createElement('div');
    pastList.setAttribute('style', 'display:flex;flex-direction:column;gap:16px;max-width:48rem;margin:0 auto;');
    pastList.appendChild(foundationCard);

    section.appendChild(pastHeaderWrap);
    section.appendChild(pastList);
  }

  // Keep the Blazing Paddles card as the first item of the upcoming list.
  function ensureBlazingPaddlesFirst(list) {
    if (!list || !list.children.length) return;
    var blazing = null;
    for (var i = 0; i < list.children.length; i++) {
      if ((list.children[i].textContent || '').indexOf('Blazing Paddles Pickleball Tournament') !== -1) {
        blazing = list.children[i];
        break;
      }
    }
    if (blazing && list.firstElementChild !== blazing) {
      list.insertBefore(blazing, list.firstElementChild);
    }
  }

  function init() {
    patch();
    window.addEventListener('hashchange', function () { setTimeout(patch, 250); });
    var mo = new MutationObserver(function () { patch(); });
    mo.observe(document.body, { childList: true, subtree: true });
    // Stop observing after 20s to avoid wasted cycles on a long-lived tab
    setTimeout(function () { mo.disconnect(); }, 20000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
