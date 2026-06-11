/* History page chiefs grid corrections
   -----------------------------------
   The compiled React bundle has incorrect dates for several Round Rock
   Fire Chiefs. The site uses hash routing (#/history) so we apply these
   fixes only when on the history view and the data has already rendered.

   Corrections (per official Round Rock city PDF + LinkedIn primary sources,
   confirmed by Diedra Brownell, Executive Director, Round Rock Fire Foundation):

     - Bizzell:    2005-2011  ->  1978-2004  (first career Fire Chief)
     - Hodge:      2011-2016  ->  2004-2011  (succeeded Bizzell)
     - Coatney:    2016       ->  2011-2016  (succeeded Hodge)
     - Smith:      REMOVED    (David W. Smith was never Fire Chief)

   The narrative paragraph elsewhere on the page already says Bizzell served
   until 2004 -- no edit needed there.
*/
(function () {
  'use strict';

  var corrections = {
    'Lynn Bizzell':   '1978\u20132004',
    'Larry Hodge':    '2004\u20132011',
    'David Coatney':  '2011\u20132016'
  };
  var removeNames = ['David W. Smith'];

  var PATCHED = false;

  function isHistoryPage() {
    var hash = (location.hash || '').replace(/^#/, '');
    var path = (location.pathname || '').replace(/\/+$/, '');
    return hash === '/history' || hash === '#/history' || /\/history\b/.test(hash) || /\/history/.test(path);
  }

  function patch() {
    if (PATCHED) return;
    if (!isHistoryPage()) return;

    var nameNodes = document.querySelectorAll('h4');
    var didAnything = false;

    nameNodes.forEach(function (h) {
      var name = (h.textContent || '').trim();

      // Date correction
      if (corrections[name]) {
        var datePara = h.nextElementSibling;
        if (datePara && /^\d{4}/.test((datePara.textContent || '').trim())) {
          if (datePara.textContent.trim() !== corrections[name]) {
            datePara.textContent = corrections[name];
            didAnything = true;
          }
        }
      }

      // Removal
      if (removeNames.indexOf(name) !== -1) {
        var card = h.closest('div');
        // walk up a few levels to find the actual card wrapper
        for (var hop = 0; hop < 4 && card; hop++) {
          if (card.classList && (card.className || '').match(/rounded|border|p-\d|bg-/)) break;
          card = card.parentElement;
        }
        if (card && !card.hasAttribute('data-rrff-removed')) {
          card.setAttribute('data-rrff-removed', 'true');
          card.style.display = 'none';
          didAnything = true;
        }
      }
    });

    if (didAnything) PATCHED = true;
  }

  function tryPatch() { patch(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryPatch);
  } else {
    tryPatch();
  }

  // History uses hash routing -- re-run when the hash changes
  window.addEventListener('hashchange', function () { PATCHED = false; setTimeout(tryPatch, 200); setTimeout(tryPatch, 800); });

  var mo = new MutationObserver(function () { if (!PATCHED) tryPatch(); });
  mo.observe(document.documentElement, { childList: true, subtree: true });

  setTimeout(function () { mo.disconnect(); }, 20000);
})();
