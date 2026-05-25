/* Shared page nav — used by standalone pages (About, Board, Chief Letter,
   Contact, Volunteer, Sponsor, Legacy Circle). Builds the nav HTML so
   we only need to update it in one place. */
(function () {
  const NAV_GROUPS = {
    home: { label: 'Home', href: '/' },
    whoWeAre: {
      label: 'Who We Are',
      items: [
        { label: 'About Us',             href: '/about/' },
        { label: 'Board Members',        href: '/board/' },
        { label: 'Letter From the Chief',href: '/chief-letter/' },
        { label: 'Contact Us',           href: '/contact/' },
      ],
    },
    programs: {
      label: 'Our Programs',
      items: [
        { label: 'The 1884 Fund',  href: '/#/the-1884-fund' },
        { label: "Chap's Corner",  href: 'https://chap.roundrockfirefoundation.org/firechaplain' },
        { label: 'Legacy Circle',  href: '/legacy-circle/' },
        { label: 'Our History',    href: '/#/history' },
      ],
    },
    events: {
      label: 'Our Events',
      items: [
        { label: 'All Events',                   href: '/events/' },
        { label: 'Foundation Night · May 29',    href: 'https://mlb.tickets.com/?orgId=58189&agency=MILB_MPV&eventId=27339' },
        { label: 'Blazing Paddles · Oct 10',     href: 'https://pickleball.roundrockfirefoundation.org/' },
        { label: 'Spouse Conference · Nov 6–8', href: 'https://spouseconference.roundrockfirefoundation.org/' },
      ],
    },
    pressRoom:  { label: 'Press Room',  href: '/#/press-room' },
    getInvolved:{ label: 'Get Involved',href: '/#/get-involved' },
  };
  const DONATE_HREF = 'https://ctxcf.networkforgood.com/projects/252774-the-round-rock-fire-foundation';

  function buildDesktop() {
    return `
      <a href="${NAV_GROUPS.home.href}">${NAV_GROUPS.home.label}</a>
      <div class="rrff-dropdown">
        <button type="button" aria-haspopup="true" aria-expanded="false">${NAV_GROUPS.whoWeAre.label}</button>
        <div class="rrff-dropdown-menu" role="menu">
          ${NAV_GROUPS.whoWeAre.items.map(i => `<a href="${i.href}" role="menuitem">${i.label}</a>`).join('')}
        </div>
      </div>
      <div class="rrff-dropdown">
        <button type="button" aria-haspopup="true" aria-expanded="false">${NAV_GROUPS.programs.label}</button>
        <div class="rrff-dropdown-menu" role="menu">
          ${NAV_GROUPS.programs.items.map(i => `<a href="${i.href}" role="menuitem">${i.label}</a>`).join('')}
        </div>
      </div>
      <div class="rrff-dropdown">
        <button type="button" aria-haspopup="true" aria-expanded="false">${NAV_GROUPS.events.label}</button>
        <div class="rrff-dropdown-menu" role="menu">
          ${NAV_GROUPS.events.items.map(i => `<a href="${i.href}" role="menuitem"${/^https?:/.test(i.href) ? ' target="_blank" rel="noopener noreferrer"' : ''}>${i.label}</a>`).join('')}
        </div>
      </div>
      <a href="${NAV_GROUPS.pressRoom.href}">${NAV_GROUPS.pressRoom.label}</a>
      <a href="${NAV_GROUPS.getInvolved.href}">${NAV_GROUPS.getInvolved.label}</a>
      <a class="rrff-donate" href="${DONATE_HREF}" target="_blank" rel="noopener noreferrer">Donate</a>
    `;
  }

  function buildMobile() {
    return `
      <a href="${NAV_GROUPS.home.href}">${NAV_GROUPS.home.label}</a>
      <div class="group-label">${NAV_GROUPS.whoWeAre.label}</div>
      ${NAV_GROUPS.whoWeAre.items.map(i => `<a class="sub" href="${i.href}">${i.label}</a>`).join('')}
      <div class="group-label">${NAV_GROUPS.programs.label}</div>
      ${NAV_GROUPS.programs.items.map(i => `<a class="sub" href="${i.href}">${i.label}</a>`).join('')}
      <div class="group-label">${NAV_GROUPS.events.label}</div>
      ${NAV_GROUPS.events.items.map(i => `<a class="sub" href="${i.href}"${/^https?:/.test(i.href) ? ' target="_blank" rel="noopener noreferrer"' : ''}>${i.label}</a>`).join('')}
      <a href="${NAV_GROUPS.pressRoom.href}">${NAV_GROUPS.pressRoom.label}</a>
      <a href="${NAV_GROUPS.getInvolved.href}">${NAV_GROUPS.getInvolved.label}</a>
      <a class="rrff-donate" href="${DONATE_HREF}" target="_blank" rel="noopener noreferrer">Donate</a>
    `;
  }

  function mount() {
    const desktop = document.querySelector('.rrff-nav-links');
    const mobile  = document.querySelector('.rrff-mobile-menu');
    if (desktop) desktop.innerHTML = buildDesktop();
    if (mobile)  mobile.innerHTML  = buildMobile();
    // Tap-to-toggle for touch devices on dropdowns
    document.querySelectorAll('.rrff-dropdown > button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const dd = btn.parentElement;
        const isOpen = dd.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        e.stopPropagation();
      });
    });
    document.addEventListener('click', () => {
      document.querySelectorAll('.rrff-dropdown.is-open').forEach(d => {
        d.classList.remove('is-open');
        const b = d.querySelector('button'); if (b) b.setAttribute('aria-expanded', 'false');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
