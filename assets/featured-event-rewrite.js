/**
 * Archive completed Blazing Paddles listings on the homepage.
 * The compiled homepage still contains the older Foundation Night feature.
 */
(function () {
  'use strict';
  function patch() {
    var section = document.getElementById('events');
    if (!section || section.getAttribute('data-rrff-events-archived') === 'true') return;
    var titles = section.querySelectorAll('h3');
    var blazing = null, foundation = null;
    for (var i = 0; i < titles.length; i++) {
      var text = (titles[i].textContent || '').trim();
      var card = titles[i].closest('.rounded-xl');
      if (!card) continue;
      if (text === 'Blazing Paddles Pickleball Tournament') blazing = card;
      if (text === 'Round Rock Fire Foundation Night at Dell Diamond') foundation = card;
    }
    if (!blazing) return;
    var wrapper = blazing.parentElement;
    var list = wrapper.parentElement;
    section.setAttribute('data-rrff-events-archived', 'true');
    if (foundation) foundation.parentElement.style.display = 'none';
    var label = blazing.querySelector('.text-xs.font-semibold');
    if (label) label.textContent = 'Past Event';
    var paragraphs = blazing.querySelectorAll('p');
    for (var p = 0; p < paragraphs.length; p++) {
      if ((paragraphs[p].textContent || '').indexOf('community pickleball tournament') !== -1) {
        paragraphs[p].textContent = 'Held October 10, 2026, at Tejas Pickleball Club in Georgetown, TX, to support Round Rock Fire Foundation programs.';
      }
    }
    var links = blazing.querySelectorAll('a');
    for (var a = 0; a < links.length; a++) {
      var href = links[a].getAttribute('href') || '';
      if (href.indexOf('fluidpb') !== -1 || /^\/sponsor\/?$/.test(href)) links[a].remove();
      else if (href.indexOf('pickleball.roundrockfirefoundation.org') !== -1) links[a].textContent = 'View event page';
    }
    var past = document.createElement('section');
    past.setAttribute('aria-labelledby', 'home-past-events-heading');
    past.style.marginTop = '48px';
    var heading = document.createElement('h3');
    heading.id = 'home-past-events-heading';
    heading.textContent = 'Past Events';
    heading.style.cssText = 'font-size:28px;font-weight:300;color:hsl(220,15%,15%);margin:0 0 24px;';
    var pastList = document.createElement('div');
    pastList.className = 'space-y-6';
    pastList.appendChild(wrapper);
    past.appendChild(heading);
    past.appendChild(pastList);
    list.parentElement.appendChild(past);
  }
  function init() {
    patch();
    window.addEventListener('hashchange', function () { setTimeout(patch, 250); });
    var observer = new MutationObserver(patch);
    observer.observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
