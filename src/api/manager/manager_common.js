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