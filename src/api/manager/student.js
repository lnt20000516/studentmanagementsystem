import http from "../request"
import store from '@/store'
import cookie from "vue-cookies"
import router from '@/router'
import ElementUI from 'element-ui';

export async function getStuData(resData) {
  const token = store.state.userInfo.token;
  const {
    data: res
  } = await http.get("student/search", {
    params: resData,
    headers: {
      TOKEN: token,
    },
  });
  if (res.code == undefined) {
    store.commit("updateLoading", false);
    let resData = res;
    resData.results.forEach((item) => {
      let birthday = new Date(item.user.user_details.birthday * 1000);
      let month = birthday.getMonth() + 1;
      if (month < 10) month = "0" + month;
      let day = birthday.getDate();
      if (day < 10) day = "0" + day;
      item.user.user_details.birthday =
        birthday.getFullYear() + "-" + month + "-" + day;
      if (item.user.user_details.sex == 1) item.user.user_details.sex = "男";
      if (item.user.user_details.sex == 0) item.user.user_details.sex = "保密";
      if (item.user.user_details.sex == -1) item.user.user_details.sex = "女";
    });
    return resData;
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

export async function queryStudent(schoolId, select, value) {
  const token = store.state.userInfo.token;
  const {
    data: res
  } = await http.get(
    "student/search?" +
    select +
    "=" +
    value +
    "&" +
    "school_id=" +
    schoolId, {
      headers: {
        TOKEN: token,
      },
    }
  );
  if (res.code == undefined) {
    res.results.forEach((item) => {
      let birthday = new Date(item.user.user_details.birthday * 1000);
      let month = birthday.getMonth() + 1;
      if (month < 10) month = "0" + month;
      let day = birthday.getDate();
      if (day < 10) day = "0" + day;
      item.user.user_details.birthday =
        birthday.getFullYear() + "-" + month + "-" + day;
      if (item.user.user_details.sex == 1) item.user.user_details.sex = "男";
      if (item.user.user_details.sex == 0) item.user.user_details.sex = "保密";
      if (item.user.user_details.sex == -1) item.user.user_details.sex = "女";
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

export async function submitEditForm(editForm) {
  const token = store.state.userInfo.token;
  const {
    data: res
  } = await http.patch("student/amdupdate/" + editForm.id, {
    user_details: {
      name: editForm.name,
      sex: editForm.sex,
      birthday: editForm.birthday,
      card: editForm.card,
      qq: editForm.qq,
      email: editForm.email,
    },
    clazz: editForm.class_name,
    school: editForm.school_name,
  }, {
    headers: {
      TOKEN: token,
    },
  })
  console.log(res.code != 200);
  if (res.code == 200) {
    return true
  } else {
    console.log(res.message);
    ElementUI.Message({
      message: res.message,
      type: "error"
    })
    return false
  }

}

export async function deleteStudent(id) {
  const token = store.state.userInfo.token;
  const {
    data: res
  } = await http.delete("student/delete/" + id, {
    headers: {
      TOKEN: token,
    },
  });
  if (res.code != 200) {
    ElementUI.Message({
      message: "删除失败",
      type: "error"
    })
    return false;
  } else {
    return true;
  }

}

export async function submitAddForm(stuForm) {
  const token = store.state.userInfo.token;
  const {
    data: res
  } = await http.post("student/insert", stuForm, {
    headers: {
      TOKEN: token
    },
  })
  if (res.code != 200) {
    return false;
  } else {
    return true;
  }
}
export async function batchDeletion(id_list) {
  const token = store.state.userInfo.token;
  let idList = {
    id_list: id_list
  }
  const {
    data: res
  } = await http.post("student/delete_all", idList, {
    headers: {
      TOKEN: token
    }
  })
  console.log(res);
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