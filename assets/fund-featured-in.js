/* The 1884 Fund page — "In the News" CRACKYL callout.
   --------------------------------------------------------------
   The 1884 Fund page is rendered by the compiled React bundle, so this script
   injects a compact media-mention callout after the "Why It Matters" section
   (which holds the Bailey / Brownell family story that the CRACKYL article
   expands on). Ties the news feature to the giving narrative. Idempotent and
   SPA-navigation safe. */
(function () {
  'use strict';

  var ARTICLE_URL =
    'https://www.crackyl.com/standing-with-fire-families-the-story-of-the-round-rock-fire-foundation/';

  function buildCallout() {
    var wrap = document.createElement('div');
    wrap.setAttribute('data-rrff-fund-featured', '1');
    wrap.className = 'max-w-3xl mx-auto px-6';
    wrap.style.margin = '56px auto';
    wrap.innerHTML = [
      '<div class="rounded-2xl border border-white/10 bg-white/[0.03] text-center" ',
           'style="padding: 40px 32px; border-radius: 16px;">',
        '<span class="text-gold text-xs font-semibold tracking-[0.25em] uppercase">In the News</span>',
        '<p class="font-serif text-xl md:text-2xl leading-snug text-white/90" ',
           'style="margin: 20px 0 0;">',
          '\u201CThe Round Rock Fire Foundation exists because one family experienced the ',
          'strength of a community and chose to carry that gift forward.\u201D',
        '</p>',
        '<div class="flex flex-col items-center gap-2" style="margin-top: 24px;">',
          '<span class="text-white text-sm font-semibold tracking-[0.18em]">CRACKYL ',
            '<span class="text-white/50 text-xs tracking-[0.2em]">MAGAZINE</span></span>',
          '<a href="' + ARTICLE_URL + '" target="_blank" rel="noopener noreferrer" ',
             'class="text-gold text-sm inline-flex items-center gap-1.5 hover:underline font-medium">',
            'Read the full story',
            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" ',
                 'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ',
                 'class="w-4 h-4" aria-hidden="true"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path>',
                 '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg>',
          '</a>',
        '</div>',
      '</div>'
    ].join('');
    return wrap;
  }

  function inject() {
    // Only on the 1884 Fund page (its hero is the only min-h-[60vh] section).
    var main = document.querySelector('main');
    if (!main) return;
    var hero = main.querySelector(':scope > section.min-h-\\[60vh\\]');
    if (!hero) return;
    if (document.querySelector('[data-rrff-fund-featured]')) return;
    // Find the "Why It Matters" section and insert the callout right after it.
    var sections = main.querySelectorAll(':scope > section');
    var target = null;
    for (var i = 0; i < sections.length; i++) {
      if (/why it matters/i.test(sections[i].textContent || '')) { target = sections[i]; break; }
    }
    if (!target) return;
    target.parentNode.insertBefore(buildCallout(), target.nextSibling);
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
