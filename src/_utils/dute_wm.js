(function () {
  var dute_ip = window.location.host;
  var dute_mpid = 5;
  if (dute_ip.includes('dutenews') && !dute_ip.includes('page.')) {
    dute_mpid = 6;
  }
  if (dute_ip.includes('page.szdute')) {
    dute_mpid = 13;
  }
  if (dute_ip.includes('page.dutenews')) {
    dute_mpid = 14;
  }
  var ta = document.createElement('script');
  ta.src = 'https://mgta.szpgm.com:8801/c/js/ta.js?mpid=' + dute_mpid;
  ta.setAttribute('id', '_trs_ta_js');
  ta.setAttribute('async', 'async');
  ta.setAttribute('defer', 'defer');
  ta.onload = ta.onreadystatechange = function () {
    if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
      (function (a, b, c, d) {
        a[b] = a[b] || {};
        a[b][d] =
          a[b][d] ||
          function () {
            (a[c] = a[c] || []).push(arguments);
            ``;
          };
      })(window, 'TA17Obj', 'TAQueueArr', 'track');
      ta.onload = ta.onreadystatechange = null;
    }
  };
  var du_s = document.getElementsByTagName('script')[0];
  du_s.parentNode.insertBefore(ta, du_s);
})();
