//console.log('hi from NoBullshit content script:', document.location.href);

(function() {
  var _alert = window.alert;
  var _confirm = window.confirm;
  var _prompt = window.prompt;

  function isRuleActive(rule) {
    return true;
  }

  if (isRuleActive('browser_modals')) {
    window.alert = function(msg) {
      console.log('NoBullshit: window.alert is blocked', msg);
    };
    window.confirm = function(msg) {
      console.log('NoBullshit: window.confirm is blocked', msg);
    };
    window.prompt = function(msg) {
      console.log('NoBullshit: window.prompt is blocked', msg);
    };
  }
})();