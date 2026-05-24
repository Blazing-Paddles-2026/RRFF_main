/* Homepage section reorder — Chap's Corner placement
   ====================================================
   The compiled React bundle places Chap's Corner second on the
   homepage (right after the hero) via CSS `order: 2` on its flex
   section. Move it to sit just above the "Giving Partners" section
   near the bottom.

   We do this by giving Chap's Corner the same `order` as Giving
   Partners (10) and bumping Giving Partners to 11. Then since they
   were originally DOM siblings inside main, the new order is:
     hero → ...other sections... → Chap's Corner → Giving Partners.
*/
(function () {
  function reorder() {
    const main = document.querySelector('main');
    if (!main) return;
    const sections = Array.from(main.children).filter(el => el.tagName === 'SECTION');

    // Find by content
    const chap = sections.find(s => /chap'?s corner/i.test(s.textContent || ''));
    const giving = sections.find(s => /giving partners/i.test(s.textContent || ''));
    if (!chap || !giving) return;

    if (chap.dataset.rrffReordered === '1') return;
    chap.style.setProperty('order', '10', 'important');
    giving.style.setProperty('order', '11', 'important');
    chap.dataset.rrffReordered = '1';
    giving.dataset.rrffReordered = '1';
  }

  function init() {
    reorder();
    // Watch for SPA re-renders that recreate the section nodes.
    const obs = new MutationObserver(() => {
      clearTimeout(window.__rrffChapReorder);
      window.__rrffChapReorder = setTimeout(reorder, 120);
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
