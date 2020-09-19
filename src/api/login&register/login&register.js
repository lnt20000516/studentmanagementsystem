import http from "../request"
import store from '@/store'
import cookie from "vue-cookies"
import router from '@/router'
import ElementUI from 'element-ui';


export async function phoneLogin(user) {
  const {
    data: res
  } = await http.post("/user/loginPhoneNumber", user);
  if (res.code != 200) {
    ElementUI.Message({
      message: res.message,
      type: 'error'
    })
  } else {
    let resData = {};
    if (res.data.role == "-2") {
      res.role_info = {};
    }
    resData = Object.assign(res.role_info, res.data);
    window.localStorage.setItem("userPhone", user.phone_number);
    window.localStorage.removeItem("user");
    cookie.set("token", res.data.token, 24 * 60 * 60);
    cookie.set("userInfo", resData, 24 * 60 * 60);
    store.commit('setUserInfo', resData)
    switch (res.data.role) {
      case 1: {
        router.push("/stuIndex");
        break;
      }
      case 0: {
        router.push("/teachIndex");
        break;
      }
      case -1: {
        router.push("/manager");
        break;
      }
      case -2: {
        router.push("/manager");
        break;
      }
      case 3: {
        router.push("/teachIndex");
        break;
      }
    }
    ElementUI.Message({
      showClose: false,
      message: '登录成功',
      type: 'success'
    });
  }
}