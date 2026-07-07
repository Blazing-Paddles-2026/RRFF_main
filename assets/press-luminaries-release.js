/* Press Room — add the "Luminaries" press release.
   --------------------------------------------------------------
   The Press Room's "Press Releases" list is rendered by the compiled
   React bundle, so this script injects an additional release card
   ("RRFF and Next Step Connect Leaders Named in National Women's
   Leadership Book", July 2, 2026) at the top of the existing list
   (most recent first). It clones the site's own release-card markup
   so styling stays consistent, and links to the full standalone
   release page. Idempotent and SPA-navigation safe. */
(function () {
  'use strict';

  var RELEASE_URL = '/press/luminaries-womens-leadership-book/';

  function buildCard() {
    var card = document.createElement('div');
    card.className =
      'bg-white rounded-xl p-6 border border-[hsl(40,15%,90%)] hover:shadow-md transition-shadow';
    card.setAttribute('data-rrff-luminaries', '1');
    card.innerHTML = [
      '<div class="flex items-center gap-2 mb-2">',
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ',
             'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ',
             'stroke-linejoin="round" class="lucide lucide-calendar w-4 h-4 text-gold" aria-hidden="true">',
          '<path d="M8 2v4"></path><path d="M16 2v4"></path>',
          '<rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path>',
        '</svg>',
        '<span class="text-gold text-xs font-semibold">July 2, 2026</span>',
      '</div>',
      '<h3 class="text-[hsl(220,15%,20%)] text-lg font-semibold mb-2">',
        'RRFF and Next Step Connect Leaders Named in National Women’s Leadership Book',
      '</h3>',
      '<p class="text-[hsl(220,15%,40%)] text-sm leading-relaxed mb-4">',
        'Diedra Brownell and Sarah Talley bring the first responder family story to a national ',
        'stage with the July 7 release of “Luminaries: Women Leaders Who Light the Way” ',
        'from Sulit Press. The Round Rock Fire Foundation and Next Step Connect LLC leaders are ',
        'featured authors, with back-to-back companion chapters on leadership forged behind the ',
        'front door of a fire family.',
      '</p>',
      '<a href="' + RELEASE_URL + '" ',
         'class="text-gold text-sm inline-flex items-center gap-1 hover:underline font-medium mb-4">',
        'Read Full Release ',
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ',
             'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ',
             'stroke-linejoin="round" class="lucide lucide-arrow-right w-3.5 h-3.5" aria-hidden="true">',
          '<path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>',
        '</svg>',
      '</a>',
      '<p class="text-[hsl(220,15%,50%)] text-xs border-t border-[hsl(40,15%,90%)] pt-3 mt-3">',
        'Media Contact: Diedra Brownell, Executive Director &amp; President — ',
        'press@roundrockfirefoundation.org — (512) 632-7848',
      '</p>'
    ].join('');
    return card;
  }

  function findList() {
    // The Press Releases list holds cards whose last <p> begins "Media Contact:".
    var ps = document.querySelectorAll('p');
    for (var i = 0; i < ps.length; i++) {
      if (/^\s*Media Contact:/.test(ps[i].textContent || '')) {
        var card = ps[i].closest('.rounded-xl');
        if (card && card.parentElement) return card.parentElement;
      }
    }
    return null;
  }

  function inject() {
    // Only run on the Press Room (the KXAN link is unique to that page).
    if (!document.querySelector('a[href*="kxan.com"]')) return;
    if (document.querySelector('[data-rrff-luminaries]')) return; // already added
    var list = findList();
    if (!list) return;
    list.insertBefore(buildCard(), list.firstChild); // most recent first
  }

  function init() {
    inject();
    var obs = new MutationObserver(function () { inject(); });
    obs.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('hashchange', function () {
      setTimeout(inject, 300);
      setTimeout(inject, 800);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
