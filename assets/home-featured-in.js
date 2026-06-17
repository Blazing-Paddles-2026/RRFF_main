/* Homepage — "As Featured In" credibility strip (CRACKYL Magazine).
   --------------------------------------------------------------
   The homepage is rendered by the compiled React bundle, so this script
   injects a slim media-mention band between the hero and the "Our Mission"
   section. It surfaces the CRACKYL feature article (which otherwise lives only
   in the Press Room) to give first-time visitors instant third-party
   credibility. Styled to match the site's dark/gold theme. Idempotent and
   SPA-navigation safe. */
(function () {
  'use strict';

  var ARTICLE_URL =
    'https://www.crackyl.com/standing-with-fire-families-the-story-of-the-round-rock-fire-foundation/';

  function buildStrip() {
    var section = document.createElement('section');
    section.setAttribute('data-rrff-featured-in', '1');
    section.className = 'bg-[hsl(0,0%,4%)] border-t border-b border-white/5 py-14 lg:py-16';
    section.innerHTML = [
      '<div class="max-w-5xl mx-auto px-6">',
        '<div class="text-center mb-7">',
          '<span class="inline-flex items-center gap-2 text-gold text-xs font-semibold tracking-[0.25em] uppercase">',
            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" ',
                 'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ',
                 'class="w-4 h-4" aria-hidden="true"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>',
            'As Featured In',
          '</span>',
        '</div>',
        '<figure class="text-center">',
          '<blockquote class="font-serif text-2xl md:text-3xl leading-snug text-white/90 max-w-3xl mx-auto">',
            '\u201CThe Round Rock Fire Foundation exists because one family experienced the strength of a community and chose to carry that gift forward.\u201D',
          '</blockquote>',
          '<figcaption class="mt-6 flex flex-col items-center gap-3">',
            '<span class="text-white text-lg font-semibold tracking-[0.18em]">CRACKYL <span class="text-white/50 text-sm tracking-[0.2em]">MAGAZINE</span></span>',
            '<a href="' + ARTICLE_URL + '" target="_blank" rel="noopener noreferrer" ',
               'class="text-gold text-sm inline-flex items-center gap-1.5 hover:underline font-medium">',
              'Read the full story',
              '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" ',
                   'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ',
                   'class="w-4 h-4" aria-hidden="true"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path>',
                   '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg>',
            '</a>',
          '</figcaption>',
        '</figure>',
      '</div>'
    ].join('');
    return section;
  }

  function inject() {
    // Only run on the homepage. The hero is the only min-h-screen section that
    // contains the big "1884" watermark + the "Founding Legacy Donor" CTA.
    var main = document.querySelector('main');
    if (!main) return;
    var hero = main.querySelector(':scope > section.min-h-screen');
    if (!hero) return; // not the homepage
    if (document.querySelector('[data-rrff-featured-in]')) return; // already added
    // Insert right after the hero, before the "Our Mission" section.
    hero.parentNode.insertBefore(buildStrip(), hero.nextSibling);
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
