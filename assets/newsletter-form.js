/* Newsletter signup form injector
   ===============================
   Replaces the "Help build support before it is needed" placeholder
   section across the site with a real Mailchimp embed.

   Posts to the Round Rock Fire Foundation Mailchimp audience.
   First name optional, email required. Submits in a new tab so
   the user doesn't lose context on the RRFF site.
*/

(function () {
  const MAILCHIMP_ACTION = 'https://roundrockfirefoundation.us12.list-manage.com/subscribe/post?u=2696c5aa619c6f71a706d2242&id=6d6ae7ae32&f_id=006e56e0f0';
  const HONEYPOT_NAME = 'b_2696c5aa619c6f71a706d2242_6d6ae7ae32';

  const userIcon = `<svg class="rrff-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"></path></svg>`;
  const mailIcon = `<svg class="rrff-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 7l9 6 9-6"></path></svg>`;
  const lockIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path></svg>`;
  const noSpamIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z"></path><path d="M9 9l6 6M15 9l-6 6"></path></svg>`;
  const calendarIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M3 10h18M8 3v4M16 3v4"></path></svg>`;

  function buildForm() {
    const wrap = document.createElement('div');
    wrap.className = 'rrff-newsletter';
    wrap.innerHTML = `
      <div class="rrff-newsletter-inner">
        <p class="rrff-newsletter-eyebrow">Stay Connected</p>
        <h2 class="rrff-newsletter-title">Help build support before it is needed.</h2>
        <p class="rrff-newsletter-lede">Stories, events, and one annual ask — sent only when there is something worth saying.</p>

        <div class="rrff-newsletter-card">
          <form class="rrff-newsletter-form" action="${MAILCHIMP_ACTION}" method="post" target="_blank" novalidate>
            <div class="rrff-newsletter-field">
              <label for="rrff-fname">First name <span class="rrff-optional">(optional)</span></label>
              <div class="rrff-newsletter-input-wrap rrff-newsletter-input-wrap--icon">
                ${userIcon}
                <input id="rrff-fname" type="text" name="FNAME" placeholder="Jane" autocomplete="given-name" />
              </div>
            </div>
            <div class="rrff-newsletter-field">
              <label for="rrff-email">Email address</label>
              <div class="rrff-newsletter-input-wrap rrff-newsletter-input-wrap--icon">
                ${mailIcon}
                <input id="rrff-email" type="email" name="EMAIL" placeholder="you@example.com" autocomplete="email" required />
              </div>
            </div>
            <button type="submit" class="rrff-newsletter-submit">
              Subscribe <span class="rrff-arrow">→</span>
            </button>
            <!-- Honeypot field for bots. Hidden from real users. -->
            <div aria-hidden="true" style="position:absolute;left:-5000px;">
              <input type="text" name="${HONEYPOT_NAME}" tabindex="-1" value="" autocomplete="off" />
            </div>
          </form>

          <div class="rrff-newsletter-trust">
            <span>${calendarIcon} A few times a year</span>
            <span>${noSpamIcon} No spam</span>
            <span>${lockIcon} Email stays private</span>
          </div>
        </div>

        <p class="rrff-newsletter-note">Unsubscribe anytime with one click.</p>
      </div>
    `;
    return wrap;
  }

  function injectIntoSection(headingEl) {
    let section = headingEl.closest('section');
    if (!section) {
      section = headingEl.parentElement;
      while (section && !/bg-\[hsl\(0,0%,6%\)\]/.test(section.className || '')) {
        section = section.parentElement;
        if (!section || section === document.body) return;
      }
    }
    if (!section || section.dataset.rrffNewsletterReplaced === '1') return;
    section.dataset.rrffNewsletterReplaced = '1';
    const wrapper = buildForm();
    section.innerHTML = '';
    section.appendChild(wrapper);
  }

  function scan() {
    const headings = document.querySelectorAll('h1, h2, h3, h4');
    headings.forEach(h => {
      if (/help build support before it is needed/i.test(h.textContent || '')) {
        injectIntoSection(h);
      }
    });
  }

  function init() {
    scan();
    window.addEventListener('hashchange', () => setTimeout(scan, 200));
    const observer = new MutationObserver(() => {
      clearTimeout(window.__rrffNewsletterScan);
      window.__rrffNewsletterScan = setTimeout(scan, 150);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
