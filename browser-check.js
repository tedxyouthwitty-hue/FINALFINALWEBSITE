/*
 * browser-check.js — TEDxWittyIntlSchoolYouth
 * Detects in-app browsers (Instagram, Facebook, WhatsApp, LinkedIn, Snapchat,
 * TikTok, etc.) and old/limited browsers missing features the site needs
 * (crypto.randomUUID, fetch, Promise, localStorage). Shows a full-screen
 * "Open in Chrome" prompt with a redirect button.
 *
 * Usage: put this as the FIRST script in <head> on every page (no defer/async):
 *   <script src="/browser-check.js"></script>
 *
 * Test on desktop: add ?forceBrowserCheck=1 to any URL.
 *
 * Written in old-style JS (no arrow functions, no let/const) on purpose,
 * so it runs even in very old in-app webviews.
 */
(function () {
  var ua = navigator.userAgent || '';
  var href = window.location.href;
  var force = /[?&]forceBrowserCheck=1/.test(window.location.search);

  // ---- 1. Polyfill crypto.randomUUID where possible ----------------------
  // Many webviews have crypto.getRandomValues but not randomUUID.
  // This alone fixes most "nothing works" cases.
  try {
    if (window.crypto && !window.crypto.randomUUID && window.crypto.getRandomValues) {
      window.crypto.randomUUID = function () {
        var b = new Uint8Array(16);
        window.crypto.getRandomValues(b);
        b[6] = (b[6] & 0x0f) | 0x40; // version 4
        b[8] = (b[8] & 0x3f) | 0x80; // variant
        var h = [];
        for (var i = 0; i < 16; i++) h.push((b[i] + 0x100).toString(16).slice(1));
        return h.slice(0, 4).join('') + '-' + h.slice(4, 6).join('') + '-' +
          h.slice(6, 8).join('') + '-' + h.slice(8, 10).join('') + '-' + h.slice(10).join('');
      };
    }
  } catch (e) {}

  // ---- 2. Detect in-app browsers -----------------------------------------
  var isAndroid = /Android/i.test(ua);
  var isIOS = /iPhone|iPad|iPod/i.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  var apps = [
    { name: 'Instagram', re: /Instagram/i },
    { name: 'Facebook', re: /FBAN|FBAV|FB_IAB|FBIOS|FB4A/i },
    { name: 'Messenger', re: /Messenger|FBMS/i },
    { name: 'WhatsApp', re: /WhatsApp/i },
    { name: 'LinkedIn', re: /LinkedInApp/i },
    { name: 'Snapchat', re: /Snapchat/i },
    { name: 'TikTok', re: /musical_ly|BytedanceWebview|TikTok/i },
    { name: 'X (Twitter)', re: /Twitter/i },
    { name: 'Telegram', re: /Telegram/i },
    { name: 'LINE', re: /\bLine\//i },
    { name: 'Pinterest', re: /Pinterest/i },
    { name: 'Gmail', re: /GSA\/.*Gmail|\bGmail\b/i }
  ];

  var appName = null;
  for (var i = 0; i < apps.length; i++) {
    if (apps[i].re.test(ua)) { appName = apps[i].name; break; }
  }

  // Generic webviews (an app embedding a browser without naming itself)
  var androidWebView = isAndroid && (/; wv\)/.test(ua) || /Version\/[\d.]+ Chrome\/[\d.]+ Mobile/.test(ua));
  var iosWebView = isIOS && /AppleWebKit/i.test(ua) && !/Safari\//i.test(ua) &&
    !/CriOS|FxiOS|EdgiOS|OPiOS/i.test(ua);

  var inApp = !!appName || androidWebView || iosWebView;

  // ---- 3. Detect missing features ----------------------------------------
  var missing = [];
  if (!(window.crypto && window.crypto.randomUUID)) missing.push('crypto.randomUUID');
  if (!window.fetch) missing.push('fetch');
  if (!window.Promise) missing.push('Promise');
  try { localStorage.setItem('__bc', '1'); localStorage.removeItem('__bc'); }
  catch (e) { missing.push('localStorage'); }

  if (!inApp && missing.length === 0 && !force) return;

  // ---- 4. Build the redirect link ----------------------------------------
  var noProto = href.replace(/^https?:\/\//, '');
  var buttons = []; // [label, url, isPrimary]

  if (isAndroid) {
    // Android intent: opens Chrome directly; if Chrome is missing, the
    // fallback URL opens in the phone's default browser
    buttons.push(['Open in Chrome', 'intent://' + noProto +
      '#Intent;scheme=https;package=com.android.chrome;' +
      'S.browser_fallback_url=' + encodeURIComponent(href) + ';end', true]);
  } else if (isIOS) {
    // iOS: Safari is always installed; Chrome only if the user has it
    buttons.push(['Open in Safari', 'x-safari-' + href, true]);
    buttons.push(['Open in Chrome', 'googlechromes://' + noProto, false]);
  } else {
    buttons.push(['Reload page', href, true]);
  }

  var reason = appName
    ? 'You’re viewing this inside the ' + appName + ' app.'
    : inApp
      ? 'You’re viewing this inside an app’s built-in browser.'
      : 'Your browser is missing features this site needs.';

  var manual = isIOS
    ? 'Or tap <b>•••</b> / the share icon and choose <b>Open in Safari</b> or <b>Open in browser</b>.'
    : 'Or tap <b>⋮</b> (top right) and choose <b>Open in Chrome</b> / <b>Open in browser</b>.';

  // ---- 5. Show the overlay -----------------------------------------------
  function show() {
    if (document.getElementById('bc-overlay')) return;

    var css = '' +
      '#bc-overlay{position:fixed;inset:0;top:0;left:0;right:0;bottom:0;z-index:2147483647;' +
      'background:rgba(10,10,10,.96);color:#fff;display:flex;align-items:center;justify-content:center;' +
      'padding:24px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;}' +
      '#bc-box{max-width:380px;width:100%;text-align:center;}' +
      '#bc-box .bc-x{font-weight:800;font-size:28px;color:#e62b1e;letter-spacing:-.5px;margin-bottom:16px;}' +
      '#bc-box h2{font-size:22px;margin:0 0 10px;line-height:1.3;}' +
      '#bc-box p{font-size:15px;line-height:1.5;color:#ccc;margin:0 0 18px;}' +
      '#bc-box a.bc-btn,#bc-box button.bc-btn{display:block;width:100%;box-sizing:border-box;padding:14px 16px;' +
      'border-radius:10px;font-size:16px;font-weight:700;text-decoration:none;border:0;cursor:pointer;margin-bottom:10px;}' +
      '#bc-box .bc-primary{background:#e62b1e;color:#fff;}' +
      '#bc-box .bc-secondary{background:#2a2a2a;color:#fff;}' +
      '#bc-box .bc-small{font-size:13px;color:#999;}';

    var style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    (document.head || document.documentElement).appendChild(style);

    var btnHtml = '';
    for (var b = 0; b < buttons.length; b++) {
      btnHtml += '<a class="bc-btn ' + (buttons[b][2] ? 'bc-primary' : 'bc-secondary') +
        '" href="' + buttons[b][1] + '">' + buttons[b][0] + '</a>';
    }

    var o = document.createElement('div');
    o.id = 'bc-overlay';
    o.setAttribute('role', 'dialog');
    o.setAttribute('aria-modal', 'true');
    o.innerHTML =
      '<div id="bc-box">' +
        '<div class="bc-x">TEDx</div>' +
        '<h2>' + (isIOS ? 'Please open this in Safari or Chrome' : 'Please open this in Chrome') + '</h2>' +
        '<p>' + reason + ' Ticket booking and payments may not work here.</p>' +
        btnHtml +
        '<button class="bc-btn bc-secondary" id="bc-copy" type="button">Copy link</button>' +
        '<p class="bc-small">' + manual + '</p>' +
      '</div>';
    document.body.appendChild(o);
    document.documentElement.style.overflow = 'hidden';

    document.getElementById('bc-copy').addEventListener('click', function () {
      var btn = this;
      function done() { btn.textContent = 'Link copied — paste it in Chrome'; }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(href).then(done, fallback);
      } else { fallback(); }
      function fallback() {
        var t = document.createElement('textarea');
        t.value = href; t.style.position = 'fixed'; t.style.opacity = '0';
        document.body.appendChild(t); t.select();
        try { document.execCommand('copy'); done(); } catch (e) { window.prompt('Copy this link:', href); }
        document.body.removeChild(t);
      }
    });

  }

  if (document.body) show();
  else document.addEventListener('DOMContentLoaded', show);
})();
