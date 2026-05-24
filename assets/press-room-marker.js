/* Press Room marker shim
   ======================
   Identifies the "Community Impact" press card by its badge text and
   stamps a data attribute on it so CSS can give it the light background
   while leaving the rest dark. SPA-safe via MutationObserver. */
(function () {
  function tag() {
    // Find badges/labels with exactly "Community Impact"
    document.querySelectorAll('.press-card').forEach(card => {
      const txt = card.textContent || '';
      if (/community impact/i.test(txt)) {
        if (card.dataset.rrffLightCard !== '1') {
          card.dataset.rrffLightCard = '1';
        }
      }
    });
  }

  function init() {
    tag();
    const obs = new MutationObserver(() => {
      clearTimeout(window.__rrffPressScan);
      window.__rrffPressScan = setTimeout(tag, 150);
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
