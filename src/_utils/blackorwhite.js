import _api from '_api/common.js';
_api.getColorStatus().then((res) => {
  if (res && res.data && res.data.app_gray === 1) {
    document.body.className += ' black-white';
  }
});
