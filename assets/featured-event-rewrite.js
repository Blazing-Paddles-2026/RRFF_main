/**
 * featured-event-rewrite.js
 *
 * Foundation Night (May 29, 2026) has passed. The compiled React bundle still
 * has it as the homepage "Featured Event". This shim rewrites the rendered DOM
 * on the homepage to replace it with the next upcoming event: Blazing Paddles
 * Pickleball Tournament (October 10, 2026).
 *
 * Watches DOM via MutationObserver so it patches after React renders.
 */
(function () {
  'use strict';

  if (window.__rrffFeaturedRewriteRan) return;
  window.__rrffFeaturedRewriteRan = true;

  // Only run on the homepage
  var path = window.location.pathname.replace(/\/+$/, '');
  if (path !== '' && path !== '/index.html') return;

  var PATCHED = false;

  function patch() {
    if (PATCHED) return;

    // Find the Featured Event card by looking for the headline text
    var titleNode = null;
    var nodes = document.querySelectorAll('h1, h2, h3, h4');
    for (var i = 0; i < nodes.length; i++) {
      var t = (nodes[i].textContent || '').trim();
      if (t.indexOf('Round Rock Fire Foundation Night at Dell Diamond') !== -1) {
        titleNode = nodes[i];
        break;
      }
    }
    if (!titleNode) return;

    // Locate the closest containing card / section
    var card = titleNode.closest('article, section, div');
    if (!card) return;

    // Walk up until we find the card root that also contains "Featured Event"
    var root = card;
    for (var hop = 0; hop < 6 && root; hop++) {
      if ((root.textContent || '').indexOf('Featured Event') !== -1) break;
      root = root.parentElement;
    }
    if (!root) return;

    PATCHED = true;

    // --- Rewrite title ---
    titleNode.textContent = 'Blazing Paddles Pickleball Tournament';

    // --- Rewrite label ("Featured Event" / "Foundation Night" eyebrow) ---
    var allEls = root.querySelectorAll('*');
    for (var j = 0; j < allEls.length; j++) {
      var el = allEls[j];
      if (el.children.length > 0) continue; // leaf nodes only
      var txt = (el.textContent || '').trim();
      if (txt === 'Featured Event') {
        el.textContent = 'Signature Fundraiser';
      } else if (txt === 'May 29, 2026' || /May\s*29,?\s*2026/.test(txt)) {
        el.textContent = 'October 10, 2026';
      }
    }

    // --- Rewrite the description paragraph ---
    var paras = root.querySelectorAll('p');
    for (var k = 0; k < paras.length; k++) {
      var p = paras[k];
      var pt = (p.textContent || '');
      if (pt.indexOf('inaugural community-wide tribute') !== -1 ||
          pt.indexOf('Round Rock Express vs. Salt Lake Bees') !== -1 ||
          pt.indexOf('Salt Lake Bees') !== -1) {
        p.textContent = 'A community pickleball tournament at Tejas Pickleball Club in Georgetown, TX. Sponsors, players, volunteers, and fire families gather to raise support for RRFF programs. Tournament brackets include men\u2019s and women\u2019s doubles, singles, and first responders. Registration is now open.';
      }
    }

    // --- Replace the bullet list (Pipes & Drums, Honor Guard, etc.) ---
    var lists = root.querySelectorAll('ul');
    for (var li = 0; li < lists.length; li++) {
      var ul = lists[li];
      var ulText = (ul.textContent || '');
      if (ulText.indexOf('Pipes') !== -1 ||
          ulText.indexOf('apparatus') !== -1 ||
          ulText.indexOf('Honor Guard') !== -1 ||
          ulText.indexOf('first pitch') !== -1 ||
          ulText.indexOf('Touch-A-Truck') !== -1) {
        ul.innerHTML =
          '<li>Men\u2019s and women\u2019s doubles, singles, and first-responder brackets</li>' +
          '<li>All skill levels welcome &mdash; competitive and recreational</li>' +
          '<li>Sponsor packages and individual player registration open</li>' +
          '<li>Food, music, raffle prizes, and community celebration</li>' +
          '<li>All proceeds support Round Rock Fire Foundation programs</li>';
        break;
      }
    }

    // --- Hide the FIRE26 promo code chip ---
    var fireCode = null;
    var allLeaves = root.querySelectorAll('*');
    for (var f = 0; f < allLeaves.length; f++) {
      var fel = allLeaves[f];
      if (fel.children.length === 0 && (fel.textContent || '').trim() === 'FIRE26') {
        // Hide the chip and any "Use code" / promo label sibling
        var chip = fel;
        // Walk up to a likely container with promo text
        for (var w = 0; w < 4 && chip; w++) {
          var ct = (chip.textContent || '');
          if (/promo|code/i.test(ct)) {
            chip.style.display = 'none';
            break;
          }
          chip = chip.parentElement;
        }
        // Always hide the leaf itself
        fel.style.display = 'none';
      }
    }
    // Also hide any nearby text that says "Use promo code:" or similar
    var promoTexts = root.querySelectorAll('*');
    for (var pt2 = 0; pt2 < promoTexts.length; pt2++) {
      var pel = promoTexts[pt2];
      if (pel.children.length > 0) continue;
      var ptxt = (pel.textContent || '').trim();
      if (/^Promo Code:?$/i.test(ptxt) || /^Use code:?$/i.test(ptxt) ||
          /^Use promo code:?$/i.test(ptxt) || /save \$\d+/i.test(ptxt)) {
        pel.style.display = 'none';
      }
    }

    // --- Rewrite the CTA buttons ---
    var anchors = root.querySelectorAll('a');
    var rewroteTickets = false, rewroteDetails = false;
    for (var a = 0; a < anchors.length; a++) {
      var ah = anchors[a];
      var aText = (ah.textContent || '').trim();
      var aHref = ah.getAttribute('href') || '';

      // "Get Tickets" -> "Register Now" -> FluidPB
      if (!rewroteTickets && (
          /get\s*tickets/i.test(aText) ||
          aHref.indexOf('mlb.tickets.com') !== -1)) {
        ah.textContent = 'Register Now';
        ah.setAttribute('href', 'https://app.fluidpb.com/tournaments/blazing-paddles-pickleball-fundraiser-tournament-2');
        ah.setAttribute('target', '_blank');
        ah.setAttribute('rel', 'noopener noreferrer');
        rewroteTickets = true;
        continue;
      }

      // "Event Details" -> point to pickleball subdomain
      if (!rewroteDetails && (
          /event\s*details/i.test(aText) ||
          aHref.indexOf('/foundation-night') !== -1 ||
          aHref.indexOf('fire-foundation-night') !== -1)) {
        ah.textContent = 'Learn More';
        ah.setAttribute('href', 'https://pickleball.roundrockfirefoundation.org');
        ah.setAttribute('target', '_blank');
        ah.setAttribute('rel', 'noopener noreferrer');
        rewroteDetails = true;
        continue;
      }
    }

    // --- Hide the duplicate Blazing Paddles card that comes after ---
    // Walk siblings of `root` to find the next event card containing Blazing Paddles
    setTimeout(function () {
      try {
        var sib = root.nextElementSibling;
        for (var s = 0; s < 8 && sib; s++) {
          var st = (sib.textContent || '');
          if (st.indexOf('Blazing Paddles Pickleball Tournament') !== -1 &&
              (st.indexOf('Tejas') !== -1 || st.indexOf('Register Now') !== -1 || st.indexOf('Signature Fundraiser') !== -1)) {
            sib.style.display = 'none';
            break;
          }
          sib = sib.nextElementSibling;
        }
        // If `root` is the inner card, also check root.parentElement's siblings
        if (root.parentElement) {
          var psib = root.parentElement.nextElementSibling;
          for (var ps = 0; ps < 8 && psib; ps++) {
            var pst = (psib.textContent || '');
            if (pst.indexOf('Blazing Paddles Pickleball Tournament') !== -1 &&
                (pst.indexOf('Tejas') !== -1 || pst.indexOf('Register Now') !== -1)) {
              psib.style.display = 'none';
              break;
            }
            psib = psib.nextElementSibling;
          }
        }
      } catch (e) {}
    }, 200);

    // --- Swap the flyer image if present ---
    var imgs = root.querySelectorAll('img');
    for (var im = 0; im < imgs.length; im++) {
      var src = imgs[im].getAttribute('src') || '';
      var alt = imgs[im].getAttribute('alt') || '';
      if (src.indexOf('foundation-night') !== -1 ||
          alt.toLowerCase().indexOf('foundation night') !== -1 ||
          alt.toLowerCase().indexOf('dell diamond') !== -1) {
        imgs[im].setAttribute('src', '/images/blazing-paddles-logo-dark.jpg');
        imgs[im].setAttribute('alt', 'Blazing Paddles Pickleball Tournament — October 10, 2026');
        imgs[im].onerror = function () {
          // Fallback to the new RRFF logo if the flyer file isn't present
          this.onerror = null;
          this.setAttribute('src', '/images/rrff-logo-v3.png');
        };
      }
    }
  }

  // Run now and observe future renders
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', patch);
  } else {
    patch();
  }

  var mo = new MutationObserver(function () {
    if (!PATCHED) patch();
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });

  // Stop observing after 15 seconds to avoid wasted cycles
  setTimeout(function () { mo.disconnect(); }, 15000);
})();
