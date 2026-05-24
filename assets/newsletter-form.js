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

  function buildForm() {
    const wrap = document.createElement('div');
    wrap.className = 'rrff-newsletter';
    wrap.innerHTML = `
      <div class="rrff-newsletter-inner">
        <p class="rrff-newsletter-eyebrow">Stay Connected</p>
        <h2 class="rrff-newsletter-title">Help build support before it is needed.</h2>
        <p class="rrff-newsletter-lede">Stories, events, and one annual ask — sent only when there is something worth saying.</p>

        <form class="rrff-newsletter-form" action="${MAILCHIMP_ACTION}" method="post" target="_blank" novalidate>
          <div class="rrff-newsletter-field">
            <label for="rrff-fname">First name <span style="font-weight:400;text-transform:none;letter-spacing:0;opacity:0.65;">(optional)</span></label>
            <input id="rrff-fname" type="text" name="FNAME" placeholder="Jane" autocomplete="given-name" />
          </div>
          <div class="rrff-newsletter-field">
            <label for="rrff-email">Email address</label>
            <input id="rrff-email" type="email" name="EMAIL" placeholder="you@example.com" autocomplete="email" required />
          </div>
          <button type="submit" class="rrff-newsletter-submit">Subscribe</button>
          <!-- Honeypot field for bots. Hidden from real users. -->
          <div aria-hidden="true" style="position:absolute;left:-5000px;">
            <input type="text" name="${HONEYPOT_NAME}" tabindex="-1" value="" autocomplete="off" />
          </div>
        </form>

        <p class="rrff-newsletter-note">Unsubscribe anytime. We never share your email.</p>
      </div>
    `;
    return wrap;
  }

  function injectIntoSection(headingEl) {
    // Find the parent section (or DIV that wraps the section content)
    let section = headingEl.closest('section');
    if (!section) {
      // Fall back to the parent DIV with the bg class
      section = headingEl.parentElement;
      while (section && !/bg-\[hsl\(0,0%,6%\)\]/.test(section.className || '')) {
        section = section.parentElement;
        if (!section || section === document.body) return;
      }
    }
    if (!section || section.dataset.rrffNewsletterReplaced === '1') return;
    section.dataset.rrffNewsletterReplaced = '1';

    // Clear original content and insert our form
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

  // Run on initial load + on every SPA route change (the React app uses
  // hash-routing). Watch for hash changes and DOM mutations so we catch
  // the section whenever it appears.
  function init() {
    scan();
    window.addEventListener('hashchange', () => setTimeout(scan, 200));
    // Also use MutationObserver so we catch route changes that don't fire
    // hashchange (e.g. React replaces content in place).
    const observer = new MutationObserver(() => {
      // Debounce
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
