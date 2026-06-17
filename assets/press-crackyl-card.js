/* Press Room — add the CRACKYL feature article.
   --------------------------------------------------------------
   The Press Room's "Featured Coverage" cards are rendered by the compiled
   React bundle, so this script injects an additional card for the CRACKYL
   article ("Standing With Fire Families: The Story of the Round Rock Fire
   Foundation", June 15, 2026) into the existing grid. It clones the site's
   own card markup so styling stays consistent, and inserts it as the first
   (most recent) card. Idempotent and SPA-navigation safe. */
(function () {
  'use strict';

  var ARTICLE_URL =
    'https://www.crackyl.com/standing-with-fire-families-the-story-of-the-round-rock-fire-foundation/';

  function buildCard() {
    var card = document.createElement('div');
    card.className =
      'press-card bg-white rounded-xl overflow-hidden border border-[hsl(40,15%,90%)]';
    card.setAttribute('data-rrff-crackyl', '1');
    card.innerHTML = [
      '<div class="relative">',
        '<img alt="Standing With Fire Families: The Story of the Round Rock Fire Foundation" ',
             'class="w-full h-56 object-cover bg-[hsl(40,15%,96%)]" src="/images/press-crackyl.jpg">',
        '<div class="absolute top-4 left-4 bg-gold text-[hsl(220,15%,8%)] text-xs font-semibold px-3 py-1 rounded-full">Article</div>',
      '</div>',
      '<div class="p-6">',
        '<div class="flex items-center gap-2 mb-2">',
          '<span class="text-gold text-xs font-semibold">CRACKYL Magazine</span>',
          '<span class="text-[hsl(220,15%,60%)] text-xs">\u2014</span>',
          '<span class="text-[hsl(220,15%,60%)] text-xs">June 15, 2026</span>',
        '</div>',
        '<h3 class="text-[hsl(220,15%,20%)] text-lg font-semibold mb-3 leading-tight">',
          '\u201CStanding With Fire Families: The Story of the Round Rock Fire Foundation\u201D',
        '</h3>',
        '<p class="text-[hsl(220,15%,40%)] text-sm leading-relaxed mb-4">',
          'How one fire family\u2019s grief and gratitude grew into a foundation that walks ',
          'alongside firefighters and the families who stand beside them. After losing their ',
          'daughter Bailey, the Brownell family was carried by the Round Rock fire family\u2019s ',
          'extraordinary support \u2014 and turned that support into The Round Rock Fire Foundation.',
        '</p>',
        '<div class="flex flex-wrap gap-3">',
          '<a href="' + ARTICLE_URL + '" target="_blank" rel="noopener noreferrer" ',
             'class="text-gold text-sm inline-flex items-center gap-1 hover:underline font-medium">',
            'Read Article ',
            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ',
                 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ',
                 'stroke-linejoin="round" class="lucide lucide-external-link w-3.5 h-3.5" aria-hidden="true">',
              '<path d="M15 3h6v6"></path><path d="M10 14 21 3"></path>',
              '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>',
            '</svg>',
          '</a>',
        '</div>',
      '</div>'
    ].join('');
    return card;
  }

  function findGrid() {
    // The press grid contains the existing .press-card items.
    var cards = document.querySelectorAll('.press-card');
    for (var i = 0; i < cards.length; i++) {
      var grid = cards[i].parentElement;
      if (grid && /grid/.test(grid.className || '')) return grid;
    }
    return null;
  }

  function inject() {
    // Only run on the Press Room (the KXAN link is unique to that page).
    if (!document.querySelector('a[href*="kxan.com"]')) return;
    if (document.querySelector('[data-rrff-crackyl]')) return; // already added
    var grid = findGrid();
    if (!grid) return;
    grid.insertBefore(buildCard(), grid.firstChild); // most recent first
  }

  function init() {
    inject();
    var obs = new MutationObserver(function () { inject(); });
    obs.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('hashchange', function () {
      // give the SPA a moment to render the new route, then try again
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
