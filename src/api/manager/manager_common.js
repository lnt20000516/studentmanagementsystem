import http from "../request"
import store from '@/store/index'

export async function getSchool() {
  const token = store.getters.getUserInfo.token;
  const res = await http.get("school/search", {
    headers: {
      TOKEN: token
    },
  });
  return res.data.results;
}

export async function getClass(id) {
  const token = store.getters.getUserInfo.token;
  const res = await http
    .get("classs/search", {
      params: {
        school_id: id,
      },
      headers: {
        TOKEN: token,
      },
    });
  return res.data.results;
}

export async function getTeachData(schoolId) {
  const token = store.state.userInfo.token;
  const {
    data: res
  } = await http
    .get("teacher/search", {
      params: {
        school: schoolId,
        role: 0
      },
      headers: {
        TOKEN: token,
      },
    })

  if (res.code == undefined) {
    return res.results;
  } else {
    ElementUI.Message({
      showClose: false,
      message: res.message,
      type: 'error'
    });
    return [];
  }
}