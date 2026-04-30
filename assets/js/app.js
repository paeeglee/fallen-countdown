(function () {
  // ---- i18n strings (override via window.OBRIGADO_STRINGS before this script) ----
  var defaults = {
    locale: 'pt-BR',
    pctSuffix: '% da carreira',
    endTarget: '01.01.2027 · LEGEND OFFLINE',
    endPct: '100.00% · GG',
    shareTitle: 'Obrigado, Professor — Contagem para a aposentadoria do FalleN',
    shareText: 'Quanto falta para a última partida oficial do FalleN?',
    shareCopied: 'Link copiado ✓',
    shareOriginal: 'Compartilhar a contagem'
  };
  var S = Object.assign({}, defaults, window.OBRIGADO_STRINGS || {});

  // ---- Countdown logic ----
  // Target: 31 Dec 2026, 23:59:59 BRT (UTC-3) → 1 Jan 2027 02:59:59 UTC
  var TARGET = new Date('2026-12-31T23:59:59-03:00').getTime();
  var START = new Date('2003-01-01T00:00:00-03:00').getTime();

  var $d = document.getElementById('d');
  var $h = document.getElementById('h');
  var $m = document.getElementById('m');
  var $s = document.getElementById('s');
  var $pct = document.getElementById('cdPct');
  var $wrap = document.getElementById('cdWrap');
  var $target = document.getElementById('cdTarget');

  function pad(n, w) { w = w || 2; return String(Math.max(0, n)).padStart(w, '0'); }

  function tick() {
    var now = Date.now();
    var diff = TARGET - now;

    if (diff <= 0) {
      $d.textContent = '000';
      $h.textContent = '00';
      $m.textContent = '00';
      $s.textContent = '00';
      $pct.textContent = S.endPct;
      $wrap.classList.add('ended');
      if ($target) $target.textContent = S.endTarget;
      return;
    }

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    var mins = Math.floor((diff / (1000 * 60)) % 60);
    var secs = Math.floor((diff / 1000) % 60);

    $d.textContent = pad(days, 3);
    $h.textContent = pad(hours);
    $m.textContent = pad(mins);
    $s.textContent = pad(secs);

    var total = TARGET - START;
    var elapsed = now - START;
    var pct = Math.min(100, Math.max(0, (elapsed / total) * 100));
    $pct.textContent = pct.toFixed(2) + S.pctSuffix;
  }

  tick();
  setInterval(tick, 1000);

  // ---- Updated date ----
  var u = new Date();
  var $upd = document.getElementById('updated');
  if ($upd) {
    $upd.textContent = u.toLocaleDateString(
      S.locale,
      { day: '2-digit', month: 'short', year: 'numeric' }
    ).toUpperCase();
  }

  // ---- Share button ----
  var $share = document.getElementById('shareBtn');
  if ($share) {
    $share.addEventListener('click', async function (e) {
      e.preventDefault();
      var data = {
        title: S.shareTitle,
        text: S.shareText,
        url: window.location.href
      };
      if (navigator.share) {
        try { await navigator.share(data); } catch (_) {}
      } else {
        try {
          await navigator.clipboard.writeText(data.url);
          var btn = e.currentTarget;
          btn.textContent = S.shareCopied;
          setTimeout(function () { btn.textContent = S.shareOriginal; }, 1800);
        } catch (_) {}
      }
    });
  }
})();
