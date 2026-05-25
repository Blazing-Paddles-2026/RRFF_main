/* Main React-app nav rewrite
   ==========================
   The compiled React bundle renders a flat nav (Home · 1884 Fund · Events ·
   History · Press Room · Get Involved · Chap's Corner · Donate).

   This shim rewrites it in place to:
     Home · [Who We Are ▾] · [Our Programs ▾] · Events · Press Room ·
     Get Involved · Donate

   It runs on first paint and on every SPA mutation (the React tree can
   re-render). Idempotent via a data attribute marker. */
(function () {
  const DONATE_HREF = 'https://ctxcf.networkforgood.com/projects/252774-the-round-rock-fire-foundation';

  const NAV = [
    { type: 'link',  label: 'Home', href: '#/' },
    { type: 'group', label: 'Who We Are', items: [
        { label: 'About Us',              href: '/about/' },
        { label: 'Board Members',         href: '/board/' },
        { label: 'Letter From the Chief', href: '/chief-letter/' },
        { label: 'Contact Us',            href: '/contact/' },
    ] },
    { type: 'group', label: 'Our Programs', items: [
        { label: 'The 1884 Fund', href: '#/the-1884-fund' },
        { label: "Chap's Corner", href: 'https://chap.roundrockfirefoundation.org/firechaplain' },
        { label: 'Legacy Circle', href: '/legacy-circle/' },
        { label: 'Our History',   href: '#/history' },
    ] },
    { type: 'group', label: 'Our Events', items: [
        { label: 'All Events',                  href: '/events/' },
        { label: 'Foundation Night · May 29',   href: '/foundation-night/' },
        { label: 'Blazing Paddles · Oct 10',    href: 'https://pickleball.roundrockfirefoundation.org/' },
        { label: 'Spouse Conference · Nov 6–8',href: 'https://spouseconference.roundrockfirefoundation.org/' },
    ] },
    { type: 'link',  label: 'Press Room',  href: '#/press-room' },
    { type: 'link',  label: 'Get Involved',href: '#/get-involved' },
  ];

  function makeDesktopGroup(label, items) {
    const wrap = document.createElement('div');
    wrap.className = 'rrff-main-dd';
    wrap.innerHTML = `
      <button type="button" class="text-sm transition-colors text-white/80 hover:text-gold rrff-main-dd-btn" aria-haspopup="true" aria-expanded="false">${label}</button>
      <div class="rrff-main-dd-menu" role="menu">
        ${items.map(i => `<a href="${i.href}" role="menuitem"${/^https?:/.test(i.href) ? ' target="_blank" rel="noopener noreferrer"' : ''}>${i.label}</a>`).join('')}
      </div>
    `;
    const btn = wrap.querySelector('button');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = wrap.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      // Close other dropdowns
      document.querySelectorAll('.rrff-main-dd.is-open').forEach(d => {
        if (d !== wrap) { d.classList.remove('is-open'); d.querySelector('button')?.setAttribute('aria-expanded','false'); }
      });
    });
    return wrap;
  }

  function makeDesktopLink(label, href) {
    const a = document.createElement('a');
    a.className = 'text-sm transition-colors text-white/80 hover:text-gold';
    a.href = href;
    a.textContent = label;
    return a;
  }

  function makeDonate() {
    const a = document.createElement('a');
    a.href = DONATE_HREF;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'bg-gold text-[hsl(220,15%,8%)] px-5 py-2 rounded-full text-sm font-semibold hover:bg-[hsl(43,75%,65%)] transition-colors';
    a.textContent = 'Donate';
    return a;
  }

  function rewriteDesktop() {
    const desktop = document.querySelector('nav .hidden.lg\\:flex.items-center.gap-6');
    if (!desktop || desktop.dataset.rrffNavRewritten === '1') return;
    desktop.dataset.rrffNavRewritten = '1';
    desktop.innerHTML = '';
    NAV.forEach(item => {
      if (item.type === 'link') desktop.appendChild(makeDesktopLink(item.label, item.href));
      else desktop.appendChild(makeDesktopGroup(item.label, item.items));
    });
    desktop.appendChild(makeDonate());
  }

  function rewriteMobile() {
    // Find the mobile menu container: a div with class "px-4 py-4 space-y-3"
    const mobile = document.querySelector('nav .px-4.py-4.space-y-3');
    if (!mobile || mobile.dataset.rrffNavRewritten === '1') return;
    mobile.dataset.rrffNavRewritten = '1';
    const html = [];
    NAV.forEach(item => {
      if (item.type === 'link') {
        html.push(`<a href="${item.href}" class="block py-2 transition-colors text-white/80 hover:text-gold">${item.label}</a>`);
      } else {
        html.push(`<div class="pt-2 pb-1 text-[11px] tracking-[0.2em] uppercase text-gold font-semibold">${item.label}</div>`);
        item.items.forEach(sub => {
          html.push(`<a href="${sub.href}" class="block pl-3 py-1.5 text-sm transition-colors text-white/70 hover:text-gold"${/^https?:/.test(sub.href) ? ' target="_blank" rel="noopener noreferrer"' : ''}>${sub.label}</a>`);
        });
      }
    });
    html.push(`<a href="${DONATE_HREF}" target="_blank" rel="noopener noreferrer" class="block bg-gold text-[hsl(220,15%,8%)] px-5 py-3 rounded-full text-sm font-semibold text-center mt-2">Donate</a>`);
    mobile.innerHTML = html.join('');
  }

  function run() {
    rewriteDesktop();
    rewriteMobile();
  }

  // Close dropdowns on outside click
  document.addEventListener('click', () => {
    document.querySelectorAll('.rrff-main-dd.is-open').forEach(d => {
      d.classList.remove('is-open');
      d.querySelector('button')?.setAttribute('aria-expanded','false');
    });
  });

  // Initial + react to SPA mutations
  function init() {
    run();
    const obs = new MutationObserver(() => {
      clearTimeout(window.__rrffMainNavScan);
      window.__rrffMainNavScan = setTimeout(run, 100);
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
