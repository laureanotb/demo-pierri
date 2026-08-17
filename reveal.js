(function () {
  if (window.__dcRevealInit) return;
  window.__dcRevealInit = true;

  var SEL = 'section > div > *, section > div > div > div > *, section [style*="grid"] > *, footer > div > *';
  var EASE = 'opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1)';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pending = [];
  var known = new WeakSet();
  var started = 0;

  function show(el) {
    el.style.transition = EASE;
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.setAttribute('data-dc-shown', '1');
  }

  function hide(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = EASE;
  }

  function register() {
    if (reduce || !document.body) return;
    var nodes = document.querySelectorAll(SEL);
    var vh = window.innerHeight || 800;
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (known.has(el) || el.hasAttribute('data-dc-shown')) continue;
      var tag = el.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'LINK' || tag === 'HELMET') continue;
      known.add(el);
      var top = el.getBoundingClientRect().top;
      // only ever hide what is safely below the fold — visible content is never touched
      if (top > vh * 0.9) { hide(el); pending.push(el); }
      else { el.setAttribute('data-dc-shown', '1'); }
    }
  }

  function sweep() {
    if (!pending.length) return;
    var vh = window.innerHeight || 800;
    var still = [];
    for (var i = 0; i < pending.length; i++) {
      var el = pending[i];
      if (!el.isConnected) continue;
      if (el.getBoundingClientRect().top < vh * 0.88) show(el);
      else still.push(el);
    }
    pending = still;
  }

  function tick(t) {
    if (!started) started = t;
    register();
    sweep();
    // hard safety: after 12s reveal anything still pending
    if (t - started > 12000) {
      pending.forEach(show);
      pending = [];
    }
    requestAnimationFrame(tick);
  }

  window.addEventListener('scroll', sweep, { passive: true, capture: true });
  window.addEventListener('resize', sweep, { passive: true });
  requestAnimationFrame(tick);
})();
