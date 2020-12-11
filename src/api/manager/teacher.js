import http from "../request"
import store from '@/store'
import cookie from "vue-cookies"
import router from '@/router'
import ElementUI from 'element-ui';
import {
  YMD,
  timeStamp
} from "@/tools/dateConversion"

export async function getTeachData(schoolId, size, current) {
  const token = store.state.userInfo.token;
  const {
    data: res
  } = await http
    .get("teacher/search", {
      params: {
        school: schoolId,
        index: current,
        size: size,
      },
      headers: {
        TOKEN: token,
      },
    })

  if (res.code == undefined) {
    store.commit("updateLoading", false);
    res.results.forEach((item) => {
      if (item.user.user_details.sex == 1) item.user.user_details.sex = "男";
      if (item.user.user_details.sex == 0) item.user.user_details.sex = "保密";
      if (item.user.user_details.sex == -1) item.user.user_details.sex = "女";
      item.user.user_details.birthday = YMD(item.user.user_details.birthday);
      if (item.clazz == null) {
        item.type = '普通教师';
      } else {
        item.type = '班主任';
      }
    });
    return res;
  } else {
    store.commit("updateLoading", false);
    ElementUI.Message({
      showClose: false,
      message: res.message,
      type: 'error'
    });
    return [];
  }
}

export async function getAllTeachData(schoolId) {
  const token = store.state.userInfo.token;
  const {
    data: res
  } = await http
    .get("teacher/search", {
      params: {
        school: schoolId,
      },
      headers: {
        TOKEN: token,
      },
    })

  if (res.code == undefined) {
    store.commit("updateLoading", false);
    res.results.forEach((item) => {
      if (item.user.user_details.sex == 1) item.user.user_details.sex = "男";
      if (item.user.user_details.sex == 0) item.user.user_details.sex = "保密";
      if (item.user.user_details.sex == -1) item.user.user_details.sex = "女";
      if (item.clazz == null) {
        item.type = '普通教师';
      } else {
        item.type = '班主任';
      }
      item.user.user_details.birthday = YMD(item.user.user_details.birthday);
    });
    return res;
  } else {
    store.commit("updateLoading", false);
    ElementUI.Message({
      showClose: false,
      message: res.message,
      type: 'error'
    });
    return [];
  }
}

export async function queryTeacher(school, selectValue, searchValue) {
  const token = store.state.userInfo.token;
  const {
    data: res
  } =
  await http
    .get(
      "teacher/search?" +
      "school=" +
      school +
      "&" +
      selectValue +
      "=" +
      searchValue, {
        headers: {
          TOKEN: token,
        },
      }
    );
  if (res.code == undefined) {
    store.commit("updateLoading", false);
    res.results.forEach((item) => {
      if (item.clazz == null) {
        item.type = '普通教师';
      } else {
        item.type = '班主任';
      }
      if (item.user.user_details.sex == 1) item.user.user_details.sex = "男";
      if (item.user.user_details.sex == 0) item.user.user_details.sex = "保密";
      if (item.user.user_details.sex == -1) item.user.user_details.sex = "女";
      item.user.user_details.birthday = YMD(item.user.user_details.birthday);
    });
    return res;
  } else {
    store.commit("updateLoading", false);
    ElementUI.Message({
      showClose: false,
      message: res.message,
      type: 'error'
    });
    return [];
  }

}

export async function submitEditForm(id, editForm) {
  editForm.id = undefined
  const token = store.state.userInfo.token;
  const {
    data: res
  } = await http.patch("teacher/admUpdate/" + id, editForm, {
    headers: {
      TOKEN: token
    }
  });
  if (res.code != 200) {
    ElementUI.Message({
      showClose: false,
      message: res.message,
      type: 'error'
    });
    return false;
  } else {
    ElementUI.Message({
      showClose: false,
      message: "修改成功！",
      type: 'success'
    });
    return true
  }
}

export async function submitAddForm(teacherForm) {
  const token = store.state.userInfo.token;
  const {
    data: res
  } = await http.post("teacher/insert", teacherForm, {
    headers: {
      TOKEN: token
    }
  });
  if (res.code != 200) {
    ElementUI.Message({
      showClose: false,
      message: res.message,
      type: 'error'
    });
    return false;
  } else {
    ElementUI.Message({
      showClose: false,
      message: "添加成功！",
      type: 'success'
    });
    return true
  }
}

export async function deleteTeacher(id) {
  const token = store.state.userInfo.token;
  const {
    data: res
  } = await http.delete("teacher/delete/" + id, {
    headers: {
      TOKEN: token
    }
  });
  if (res.code != 200) {
    ElementUI.Message({
      showClose: false,
      message: res.message,
      type: 'error'
    });
    return false
  } else {
    ElementUI.Message({
      showClose: false,
      message: "删除成功！",
      type: 'success'
    });
    return true
  }
}

export async function batchDeletion(id_list) {
  const token = store.state.userInfo.token;
  let idList = {
    id_list: id_list
  }
  const {
    data: res
  } = await http.post("teacher/delete_all2", idList, {
    headers: {
      TOKEN: token
    }
  })
  if (res.code != 200) {
    ElementUI.Message({
      showClose: false,
      message: "删除失败！",
      type: 'error'
    });
    return false
  } else {
    ElementUI.Message({
      showClose: false,
      message: "删除成功！",
      type: 'success'
    });
    return true
  }
}