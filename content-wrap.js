if (!document.getElementById('nobullshit_injection')) {
  var e = document.createElement('script');
  e.id = 'nobullshit_injection';
  e.src = chrome.extension.getURL('content.js');
  if (document.documentElement.firstChild) {
    document.documentElement.insertBefore(e, document.documentElement.firstChild);
  } else {
    document.documentElement.appendChild(e);
  }

  // create an observer instance
  var observer = new MutationObserver(function(mutations) {
    //console.time('NoBullshit: mutation processor (' + mutations.length + ' mutations)');
    mutations.forEach(function(mutation) {
      if (mutation.type == 'attributes') {
        iterateChilds(mutation.target, true);
        return;
      }

      if (!mutation.addedNodes.length) {
        return;
      }

      for (var i = 0; i < mutation.addedNodes.length; i++) {
        iterateChilds(mutation.addedNodes[i]);
      }
    });
    //console.timeEnd('NoBullshit: mutation processor (' + mutations.length + ' mutations)');
  });

  observer.observe(document.documentElement, { childList: true, attributes: true, attributeFilter: ['id', 'class', 'style'], subtree: true });
}

function getOpacity(e) {
  if (!e) {
    return 1;
  }

  if ('cached_opacity' in e) {
    return e.cached_opacity;
  }

  return e.cached_opacity =
    getOpacity(e.parentElement) *
    ((e instanceof Element) ? parseFloat(getComputedStyle(e).getPropertyValue('opacity')) : 1);
}

function isRuleActive(rule) {
  if (document.location.host == 'vk.com') { // TODO: make a white-list
    return false;
  }
  return true;
}

function iterateChilds(e, dropCache) {
  if (!e || !(e instanceof Element)) {
    return;
  }

  if (dropCache) {
    delete e.cached_opacity;
  }

  if (isRuleActive('invisible_iframes')) {
    if (e.tagName == 'IFRAME') {
      if (getOpacity(e) < 0.5) {
        console.log('NoBullshit: Removing iframe with opacity value too low: ', e, e.src);
        e.src = '';
        e.parentNode.removeChild(e);
        return;
      }
    }
  }

  if (isRuleActive('audio')) {

  }

  if (isRuleActive('bottom_fixtures')) {
    var style = window.getComputedStyle(e);
    var bottom = style.getPropertyValue('bottom');
    var top = style.getPropertyValue('top');

    if (style.getPropertyValue('position') == 'fixed' &&
        ((bottom != 'auto' && top == 'auto') ||
         (top[top.length - 1] == '%' && parseFloat(top) > 66) ||
         (top[top.length - 1] == 'x' && parseFloat(top) > window.innerHeight * 0.66))) {
      console.log('NoBullshit: Fixed chat-like elements attached to the bottom side of the screen are not allowed: ', e);
      e.innerHTML = '';
      //e.style.display = 'none';
      e.parentNode.removeChild(e);
    }
  }

  if (e.children) {
    for (var i = 0; i < e.children.length; i++) {
      iterateChilds(e.children[i], dropCache);
    }
  }
}