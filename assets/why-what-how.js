/* Why / What / How clickable wrapper
   ===================================
   Wraps each Why/What/How card on the homepage in an <a> tag so the
   whole box is clickable. Idempotent and SPA-safe via MutationObserver.

   Routes:
     Why  → #/the-1884-fund
     What → #/the-1884-fund
     How  → #/legacy-circle  (Squarespace-hosted page on this site)
*/

(function () {
  const ROUTES = {
    'why':  '/#/the-1884-fund',
    'what': '/#/the-1884-fund',
    'how':  '/legacy-circle/',
  };

  function wrap() {
    // Find all H3 headings whose text is exactly Why / What / How
    const headings = document.querySelectorAll('h3');
    headings.forEach(h => {
      const text = (h.textContent || '').trim().toLowerCase();
      if (!ROUTES[text]) return;

      const card = h.parentElement;
      if (!card) return;
      // Skip if already wrapped
      if (card.parentElement && card.parentElement.tagName === 'A' && card.parentElement.hasAttribute('data-rrff-wwh')) return;
      // Sanity: card should be a small card div, not a section
      if (!/rounded-lg/.test(card.className || '')) return;

      const a = document.createElement('a');
      a.href = ROUTES[text];
      a.setAttribute('data-rrff-wwh', text);
      a.setAttribute('aria-label', `Learn more — ${text.charAt(0).toUpperCase() + text.slice(1)}`);

      card.parentNode.insertBefore(a, card);
      a.appendChild(card);
    });
  }

  function init() {
    wrap();
    window.addEventListener('hashchange', () => setTimeout(wrap, 200));
    const observer = new MutationObserver(() => {
      clearTimeout(window.__rrffWwhScan);
      window.__rrffWwhScan = setTimeout(wrap, 150);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
