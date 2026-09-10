/**
 * appreciation-popup.js
 *
 * Homepage-only popup promoting the Round Rock Express Appreciation Night
 * (Saturday, September 19, 2026). Shows once per browser session, a beat
 * after the page loads, with a link to the event page and the ticket page.
 *
 * Self-contained: injects its own <style>, doesn't depend on the React
 * bundle's DOM, and is safe to include on every page (it no-ops off the
 * homepage).
 */
(function () {
  'use strict';

  if (window.__rrffApnPopupRan) return;
  window.__rrffApnPopupRan = true;

  // Only run on the homepage
  var path = window.location.pathname.replace(/\/+$/, '');
  if (path !== '' && path !== '/index.html') return;

  // Once per browser session
  var STORAGE_KEY = 'rrffApnPopupShown_v1';
  try {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
  } catch (e) {}

  var TICKET_URL =
    'https://mlb.tickets.com/?orgId=58189&agency=MILB_MPV&eventId=27354#/event/E27354/ticketlist/?view=sections&minPrice=15&maxPrice=23&quantity=2&sort=price_desc&ada=false&coupon=RRFIRE&seatSelection=false&onlyCoupon=true&onlyVoucher=false';
  var EVENT_URL = '/express-appreciation-night/';

  function injectStyle() {
    var css =
      '.rrff-apn-overlay{position:fixed;inset:0;z-index:9999;display:flex;' +
      'align-items:center;justify-content:center;padding:20px;' +
      'background:hsla(0,0%,2%,0.72);backdrop-filter:blur(3px);' +
      '-webkit-backdrop-filter:blur(3px);opacity:0;transition:opacity .28s ease;}' +
      '.rrff-apn-overlay.rrff-apn-in{opacity:1;}' +
      '.rrff-apn-card{position:relative;width:100%;max-width:440px;' +
      'background:hsl(0,0%,7%);border:1px solid hsl(0,0%,16%);border-radius:20px;' +
      'overflow:hidden;box-shadow:0 30px 80px hsla(0,0%,0%,0.5);' +
      'transform:translateY(14px) scale(0.98);transition:transform .32s cubic-bezier(.2,.8,.2,1);' +
      'font-family:Inter,Arial,sans-serif;}' +
      '.rrff-apn-overlay.rrff-apn-in .rrff-apn-card{transform:translateY(0) scale(1);}' +
      '.rrff-apn-photo{position:relative;height:130px;background-size:cover;' +
      'background-position:center 65%;' +
      'background-image:linear-gradient(180deg,hsla(213,55%,6%,0.35) 0%,hsl(0,0%,7%) 100%),' +
      'url("/images/express-appreciation-night-stadium-bg.jpg");}' +
      '.rrff-apn-close{position:absolute;top:12px;right:12px;width:32px;height:32px;' +
      'border-radius:50%;border:1px solid hsla(0,0%,100%,0.25);background:hsla(0,0%,0%,0.35);' +
      'color:hsl(0,0%,95%);font-size:18px;line-height:1;display:flex;align-items:center;' +
      'justify-content:center;cursor:pointer;transition:background .15s;}' +
      '.rrff-apn-close:hover{background:hsla(0,0%,0%,0.55);}' +
      '.rrff-apn-body{padding:26px 28px 28px;text-align:center;}' +
      '.rrff-apn-eyebrow{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;' +
      'color:hsl(43,75%,55%);margin:0 0 10px;}' +
      '.rrff-apn-title{font-family:"Playfair Display",Georgia,serif;font-weight:700;' +
      'font-size:27px;color:hsl(40,20%,95%);margin:0 0 6px;line-height:1.15;}' +
      '.rrff-apn-title em{color:hsl(43,75%,55%);font-style:italic;}' +
      '.rrff-apn-sub{font-size:14px;color:hsl(40,10%,72%);margin:0 0 18px;line-height:1.5;}' +
      '.rrff-apn-sub strong{color:hsl(40,20%,95%);}' +
      '.rrff-apn-code{display:inline-block;font-size:12px;font-weight:700;letter-spacing:0.5px;' +
      'color:hsl(0,0%,4%);background:hsl(43,75%,55%);border-radius:999px;padding:3px 12px;' +
      'margin:0 0 20px;}' +
      '.rrff-apn-actions{display:flex;flex-direction:column;gap:10px;}' +
      '.rrff-apn-btn{display:block;width:100%;padding:13px 18px;border-radius:999px;' +
      'font-size:14.5px;font-weight:700;text-decoration:none;text-align:center;' +
      'box-sizing:border-box;transition:transform .15s, background .15s;}' +
      '.rrff-apn-btn:hover{transform:translateY(-1px);text-decoration:none;}' +
      '.rrff-apn-btn-primary{background:hsl(43,75%,55%);color:hsl(0,0%,4%);}' +
      '.rrff-apn-btn-primary:hover{background:hsl(43,75%,65%);}' +
      '.rrff-apn-btn-ghost{background:transparent;color:hsl(40,20%,95%);' +
      'border:1px solid hsl(0,0%,22%);}' +
      '.rrff-apn-btn-ghost:hover{border-color:hsl(43,75%,55%);color:hsl(43,75%,55%);}' +
      'body.rrff-apn-lock{overflow:hidden;}' +
      '@media (max-width:420px){.rrff-apn-title{font-size:23px;}.rrff-apn-body{padding:22px 20px 24px;}}';
    var style = document.createElement('style');
    style.setAttribute('data-rrff', 'apn-popup');
    style.textContent = css;
    document.head.appendChild(style);
  }

  function closePopup(overlay) {
    overlay.classList.remove('rrff-apn-in');
    document.body.classList.remove('rrff-apn-lock');
    setTimeout(function () {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, 260);
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch (e) {}
    document.removeEventListener('keydown', onKeydown);
  }

  var overlayRef = null;
  function onKeydown(e) {
    if (e.key === 'Escape' && overlayRef) closePopup(overlayRef);
  }

  function showPopup() {
    injectStyle();

    var overlay = document.createElement('div');
    overlay.className = 'rrff-apn-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Round Rock Express Appreciation Night');

    overlay.innerHTML =
      '<div class="rrff-apn-card">' +
      '  <div class="rrff-apn-photo">' +
      '    <button class="rrff-apn-close" aria-label="Close">&times;</button>' +
      '  </div>' +
      '  <div class="rrff-apn-body">' +
      '    <p class="rrff-apn-eyebrow">Saturday, September 19, 2026</p>' +
      '    <h2 class="rrff-apn-title">Appreciation <em>Night</em></h2>' +
      '    <p class="rrff-apn-sub">Join us at Dell Diamond as the <strong>Round Rock Express</strong> host the Tacoma Rainiers &mdash; honoring our firefighters and their families, with a Cowboy Hat Giveaway while supplies last.</p>' +
      '    <span class="rrff-apn-code">Discount code RRFIRE</span>' +
      '    <div class="rrff-apn-actions">' +
      '      <a class="rrff-apn-btn rrff-apn-btn-primary" href="' + TICKET_URL + '" target="_blank" rel="noopener noreferrer">Get Tickets Now &rarr;</a>' +
      '      <a class="rrff-apn-btn rrff-apn-btn-ghost" href="' + EVENT_URL + '">See Full Details</a>' +
      '    </div>' +
      '  </div>' +
      '</div>';

    document.body.appendChild(overlay);
    document.body.classList.add('rrff-apn-lock');
    overlayRef = overlay;

    // Fade/scale in on next frame
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        overlay.classList.add('rrff-apn-in');
      });
    });

    overlay.querySelector('.rrff-apn-close').addEventListener('click', function () {
      closePopup(overlay);
    });
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closePopup(overlay);
    });
    document.addEventListener('keydown', onKeydown);
  }

  function init() {
    setTimeout(showPopup, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
