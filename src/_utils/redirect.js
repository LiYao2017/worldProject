var url = {
  open: 'dute://?',
  down: 'https://download.netwin.cn/download/duchuang-app.apk',
  yybUrl: 'https://a.app.qq.com/o/simple.jsp?pkgname=com.dute.dutenews',
  universalUrl: 'https://share.dutenews.com/webshare/'
};

export function redirect(object) {
  var paramStr = '';

  for (var name in object) {
    paramStr = paramStr + '&' + name + '=' + object[name];
  }
  var u = navigator.userAgent;
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
  var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

  if (isAndroid) {
    location.href =
      url.yybUrl + '&android_schema=' + encodeURIComponent(url.open + paramStr.substring(1));
    return false;
  } else if (isIOS) {
    location.href = url.universalUrl + '?' + paramStr.substring(1);
  } else {
    location.href = url.yybUrl;
  }
}
export default redirect;
