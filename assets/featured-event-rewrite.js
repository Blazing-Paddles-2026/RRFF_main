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
    var blazing = null, foundation = null, spouse = null;
    for (var i = 0; i < titles.length; i++) {
      var text = (titles[i].textContent || '').trim();
      var card = titles[i].closest('.rounded-xl');
      if (!card) continue;
      if (text === 'Blazing Paddles Pickleball Tournament') blazing = card;
      if (text === 'Round Rock Fire Foundation Night at Dell Diamond') foundation = card;
      if (text === 'RRFF National Spouse Conference') spouse = card;
    }
    if (!blazing) return;
    var wrapper = blazing.parentElement;
    var list = wrapper.parentElement;
    section.setAttribute('data-rrff-events-archived', 'true');
    var spousePast = null;
    if (spouse) {
      spousePast = spouse.parentElement.cloneNode(true);
      var archivedCard = spousePast.querySelector('.rounded-xl');
      archivedCard.querySelector('h3').textContent = '2026 RRFF National Spouse Conference';
      archivedCard.querySelector('.text-xs.font-semibold').textContent = 'Past Event';
      archivedCard.querySelector('p.text-sm').textContent = 'Held November 6–8, 2026, bringing firefighter couples together in Round Rock for hands-on training, connection, and resilience.';
      archivedCard.querySelector('.flex.flex-wrap').innerHTML = '<a href="/events/#spouse-conference-2026" class="text-sm inline-flex items-center gap-1 text-gold hover:underline">View past event</a>';
      spouse.querySelector('h3').textContent = '2027 RRFF National Spouse Conference';
      spouse.querySelector('.text-xs.font-semibold').textContent = 'Upcoming Event';
      spouse.querySelector('p.text-xs').textContent = 'November 5–7, 2027';
      var spouseDescription = spouse.querySelector('p.text-sm');
      spouseDescription.textContent = 'Join us in Round Rock for an immersive, hands-on weekend built to strengthen firefighter marriages through shared experiences, expert guidance, and lasting connections.';
      var registrationNote = document.createElement('p');
      registrationNote.className = 'rrff-event-registration-note';
      registrationNote.style.cssText = 'margin:0 0 12px;font-size:14px;font-weight:600;line-height:1.5;color:#e0b83f;';
      registrationNote.textContent = 'Registration opens April 1st';
      spouseDescription.insertAdjacentElement('afterend', registrationNote);
      spouse.querySelector('.flex.flex-wrap').innerHTML = '<a href="https://spouseconference.roundrockfirefoundation.org/" target="_blank" rel="noopener noreferrer" class="text-sm inline-flex items-center gap-1 text-gold hover:underline">View 2027 conference</a>';
    }
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
    if (spousePast) pastList.appendChild(spousePast);
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
