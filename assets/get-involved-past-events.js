/** Move completed events below the Get Involved upcoming list. */
(function () {
  'use strict';
  function patch() {
    var headings = document.querySelectorAll('h2');
    var heading = null;
    for (var i = 0; i < headings.length; i++) {
      if ((headings[i].textContent || '').trim() === 'Ways to Participate') { heading = headings[i]; break; }
    }
    if (!heading || !heading.parentElement || !heading.parentElement.parentElement) return;
    var reveal = heading.parentElement.parentElement;
    var list = reveal.nextElementSibling, section = reveal.parentElement;
    if (!list || !section || section.getAttribute('data-rrff-past-v2') === 'true') return;
    var blazing = null, foundation = null;
    for (var c = 0; c < list.children.length; c++) {
      var title = list.children[c].querySelector('h4');
      if (!title) continue;
      if (title.textContent === 'Blazing Paddles Pickleball Tournament') blazing = list.children[c];
      if (title.textContent === 'Fire Foundation Night at Dell Diamond') foundation = list.children[c];
    }
    if (!blazing) return;
    section.setAttribute('data-rrff-past-v2', 'true');
    var header = document.createElement('div');
    header.style.cssText = 'text-align:center;margin-top:64px;margin-bottom:32px;';
    header.innerHTML = '<h2 style="font-size:clamp(28px,3.4vw,36px);font-weight:300;color:#fff;margin:0;">Past Events</h2>';
    var pastList = document.createElement('div');
    pastList.style.cssText = 'display:flex;flex-direction:column;gap:16px;max-width:48rem;margin:0 auto;';
    var completed = [blazing, foundation];
    for (var j = 0; j < completed.length; j++) {
      var wrapper = completed[j];
      if (!wrapper) continue;
      var card = wrapper.firstElementChild || wrapper;
      if (wrapper === blazing) {
        var spans = card.querySelectorAll('span');
        for (var s = 0; s < spans.length; s++) {
          if (/October\s+18,\s*2026/.test(spans[s].textContent || '')) spans[s].textContent = 'October 10, 2026';
        }
        var description = card.querySelector('p');
        if (description) description.textContent = 'Held at Tejas Pickleball Club in Georgetown, TX, to support Round Rock Fire Foundation programs.';
        var links = card.querySelectorAll('a');
        for (var a = 0; a < links.length; a++) {
          var href = links[a].getAttribute('href') || '';
          if (href.indexOf('fluidpb') !== -1) links[a].remove();
          else if (href.indexOf('pickleball.roundrockfirefoundation.org') !== -1) links[a].textContent = 'View event page';
        }
      }
      var badge = document.createElement('span');
      badge.textContent = 'Past Event';
      badge.style.cssText = 'display:block;margin:8px 0;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:hsl(43,75%,55%);';
      var titleNode = card.querySelector('h4');
      if (titleNode) titleNode.parentElement.insertBefore(badge, titleNode);
      pastList.appendChild(wrapper);
    }
    section.appendChild(header);
    section.appendChild(pastList);
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
