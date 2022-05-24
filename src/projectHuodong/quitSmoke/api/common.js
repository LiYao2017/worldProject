import http from '_utils/http';
import store from '@/store/index';

function getDevice_id() {
  let device_id = localStorage.getItem('dute_device_id');
  if (!device_id) {
    device_id = new Date().getTime();
    localStorage.setItem('dute_device_id', device_id);
  }
  return device_id;
}

function parameter(obj) {
  let option = new URLSearchParams();
  for (const key in obj) {
    option.append(key, obj[key]);
  }
  return option;
}
export default {
  getRecordList() {
    let data = { limit: 60 };
    return http.get('/activity/api/record/list', data);
  },
  wxLogin(data) {
    return http.get('/activity/api/wx/getUserInfo', data);
  },
  setRecordSave(data) {
    return http.post('/activity/api/record/save', data);
  },
  getIncreasing() {
    return http.get('/activity/api/increasing');
  }
};
