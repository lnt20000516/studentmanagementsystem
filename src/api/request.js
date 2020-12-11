import axios from 'axios';
import router from '@/router'
import cookie from "vue-cookies"
import ElementUI from 'element-ui';
import store from '@/store'
const service = axios.create({
  baseURL: 'http://39.108.164.247:8000/',
  timeout: 10000 //访问超时的时间限制
});

// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(ElementUI);
// 添加请求拦截器
service.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config
}, function (error) {
  return Promise.reject(error)
});

// 添加响应拦截器
service.interceptors.response.use(function (response) {
  if (response.data.code == "-109") {
    cookie.remove("token");
    router.push("/login&register");
  }
  // 对响应数据做点什么
  return response
}, function (error) {
  store.commit("updateLoading", false);
  if (error.message.indexOf("Network Error") >= 0) {
    ElementUI.Notification.error({
      title: error.message,
      message: '网络错误'
    });
  }
  return Promise.reject(error)
});

export default service;