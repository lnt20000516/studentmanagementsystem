import http from "../request"
import store from '@/store/index'
import ElementUI from "element-ui";
import {
  YMD
} from "@/tools/dateConversion"
export async function searchAdmin(currentPage, pageSize, name) {
  const token = store.state.userInfo.token;
  let queryData = {
    index: currentPage,
    size: pageSize,
    role: -2,
  }
  if (name) {
    queryData.user_name = name;
  }
  const {
    data: res
  } = await http.get("user/search", {
    params: queryData,
    headers: {
      TOKEN: token
    }
  });
  if (res.code == undefined) {
    res.results.forEach(item => {
      item.user_details.birthday = YMD(item.user_details.birthday);
      switch(item.user_details.sex){
        case 0:{
          item.user_details.sex="男";
          break;
        }
        case 1:{
          item.user_details.sex="女";
          break;
        }
        case -1:{
          item.user_details.sex="保密";
          break;
        }
      }
    });
  } else {
    ElementUI.Message({
      showClose: false,
      message: res.message,
      type: 'error'
    });
    return [];
  }
  return res;
}