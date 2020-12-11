import http from "../request"
import store from "@/store"
import ElementUI from "element-ui"

/**
 * 添加家长
 * @param {*} parentFrom 添加家长信息
 */
export async function submitAddFrom(parentFrom) {
  const token = store.state.userInfo.token;
  const {
    data: res
  } = await http.post("parent/insert", parentFrom, {
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
      message: "添加成功",
      type: 'success'
    });
    return true
  }
}

/**
 * 获取所有家长信息
 * @param {*} currentPage 当前页码
 * @param {*} pageSize    当前每页条数
 */
export async function getParentData(currentPage, pageSize) {
  const token = store.state.userInfo.token;
  let param = {};
  if (currentPage || pageSize) {
    param = {
      index: currentPage,
      size: pageSize
    }
  }
  const {
    data: res
  } = await http.get("parent/search", {
    headers: {
      TOKEN: token
    },
    params: param
  });
  if (res.results) {
    return res;
  } else {
    ElementUI.Message({
      showClose: false,
      message: "获取家长信息失败",
      type: 'error'
    });
    return [];
  }
}

/**
 * 按名称查找家长
 * @param {*} name   要查询的家长名称
 * @param {*} currentPage  查询页码
 * @param {*} pageSize    查询每页条数
 */
export async function searchParent(name, currentPage, pageSize) {
  const token = store.state.userInfo.token;
  const {
    data: res
  } = await http.get("parent/search", {
    headers: {
      TOKEN: token
    },
    params: {
      name: name,
      index: currentPage,
      size: pageSize
    }
  });
  if (res.results) {
    return res;
  } else {
    ElementUI.Message({
      showClose: false,
      message: "抱歉，没有查到你想要的数据TnT",
      type: 'error'
    });
    return [];
  }
}

/**
 * 单个删除家长
 * @param {*} id  家长id
 */
export async function deleteParent(id) {
  const token = store.state.userInfo.token;
  const {
    data: res
  } = await http.delete("parent/delete/" + id, {
    headers: {
      TOKEN: token
    }
  });
  if (res.code != 200) {
    ElementUI.Message.error(res.message);
    return false
  } else {
    ElementUI.Message.success("删除成功");
    return true;
  }
}

/**
 * 删除选中家长
 * @param {*} id_list 家长id列表
 */
export async function batchDeleteParents(id_list) {
  const token = store.state.userInfo.token;
  let idList = {
    id_list: id_list
  }
  const {
    res: data
  } = await http.post("parent/delete_all", idList, {
    headers: {
      TOKEN: token
    }
  });
  console.log(res);
}


/**
 * 提交修改家长信息表单
 * @param {*} parentFrom 
 */
export async function submitEditParent(parentFrom) {
  const token = store.state.userInfo.token;
}