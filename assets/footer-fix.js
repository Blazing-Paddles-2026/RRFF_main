/* Footer + stale-link fix
   =======================
   The compiled React bundle has several links pointing to dead or
   wrong routes. This shim finds them across the page (footer + body)
   and rewrites their hrefs to live destinations.

   Wrong routes being fixed:
     - "Board Members"   → /board/
     - "Sponsor an event"→ /sponsor/
     - "Volunteer"       → /volunteer/
     - "Privacy Policy"  → /privacy/
     - "Terms"           → /terms/
     - "About Us"        → /about/
     - "Contact"         → /contact/
     - "Letter From the Chief" → /chief-letter/
     - Any link to #/sponsor (React blank route) → /sponsor/
*/
(function () {
  const TEXT_REWRITES = [
    { match: /^board members$/i,    href: '/board/' },
    { match: /^sponsor an event$/i, href: '/sponsor/' },
    { match: /^sponsor$/i,          href: '/sponsor/' },
    { match: /^volunteer$/i,        href: '/volunteer/' },
    { match: /^privacy policy$/i,   href: '/privacy/' },
    { match: /^terms$/i,            href: '/terms/' },
    { match: /^about us$/i,         href: '/about/' },
    { match: /^contact$/i,          href: '/contact/' },
    { match: /^letter from the chief$/i, href: '/chief-letter/' },
  ];
  // Hrefs that are always wrong, regardless of link text
  const HREF_REWRITES = [
    { match: /^#\/sponsor$|\/#\/sponsor$/, href: '/sponsor/' },
  ];

  function fix() {
    const all = document.querySelectorAll('a');
    all.forEach(a => {
      if (a.dataset.rrffLinkFixed === '1') return;

      // Skip nav links — we let the main-nav-rewrite handle those.
      // (The footer and body links here have different layouts.)
      if (a.closest('.rrff-main-dd-menu, .rrff-main-dd, .hidden.lg\\:flex.items-center.gap-6')) return;

      const text = (a.textContent || '').trim();
      const href = a.getAttribute('href') || '';

      let newHref = null;

      // First check href-based rules (more specific)
      for (const rule of HREF_REWRITES) {
        if (rule.match.test(href)) { newHref = rule.href; break; }
      }

      // Then text-based rules — but only inside the footer to avoid
      // accidentally rewriting in-page "Volunteer" or "Sponsor" body links
      // we want to keep going wherever they were going.
      // EXCEPTION: on the homepage Get Involved hub, the "Sponsor" link
      // points to #/sponsor (broken), so the HREF rule above will catch it.
      if (!newHref && a.closest('footer')) {
        for (const rule of TEXT_REWRITES) {
          if (rule.match.test(text)) { newHref = rule.href; break; }
        }
      }

      if (newHref) {
        a.setAttribute('href', newHref);
        a.dataset.rrffLinkFixed = '1';
        if (a.getAttribute('target') === '_blank' && newHref.startsWith('/')) {
          a.removeAttribute('target');
          a.removeAttribute('rel');
        }
      }
    });
  }

  function init() {
    fix();
    const obs = new MutationObserver(() => {
      clearTimeout(window.__rrffLinkScan);
      window.__rrffLinkScan = setTimeout(fix, 150);
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
