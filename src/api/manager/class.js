import http from "../request"
import store from '@/store/index'
import ElementUI from "element-ui";

export async function deleteClass(id) {
  const token = store.state.userInfo.token;
  const {
    data: res
  } = await http.delete("classs/delete/" + id, {
    headers: {
      TOKEN: token
    }
  });
  if (res.code != 200) {
    ElementUI.Message({
      type: "error",
      message: "删除失败"
    });
    return false;
  } else {
    ElementUI.Message({
      type: "success",
      message: "删除成功"
    });
    return true;
  }
}

export async function getClassData(id, currentPage, pageSize) {
  const token = store.state.userInfo.token;
  const {
    data: res
  } = await http
    .get("classs/search", {
      params: {
        school_id: id,
        index: currentPage,
        size: pageSize
      },
      headers: {
        TOKEN: token,
      },
    });
  if (res.code == undefined) {
    return res
  } else {
    ElementUI.Message({
      type: "error",
      message: res.message
    });
    return []
  }
}

export async function submitAddClass(classAddForm) {
  const token = store.state.userInfo.token;
  const {
    data: res
  } = await http
    .post("classs/insert", classAddForm, {
      headers: {
        TOKEN: token,
      },
    });
  if (res.code != 200) {
    ElementUI.Message({
      type: "error",
      message: res.message
    });
    return false;
  } else {
    return true;
  }
}

export async function queryClass(school, className) {
  const token = store.state.userInfo.token;
  const {
    data: res
  } = await http
    .get("classs/search", {
      params: {
        school_id: school,
        class_name: className,
      },
      headers: {
        TOKEN: token,
      },
    })
  if (res.code == undefined) {
    if (res.count === 0) {
      ElementUI.Message({
        type: "error",
        message: "抱歉，未找到您要查询的班级"
      });
    }
    return res;
  } else {
    ElementUI.Message({
      type: "error",
      message: res.message
    });
    return {};
  }
}