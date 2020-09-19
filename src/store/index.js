import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    screenWH: {
      maxW: 0,
      maxH: 0
    },
    userId: "",
    userInfo: {},
    count: 0, //应用初始化的数据
    vueElementLoading: false,
    imgLoading: false // 用于控制图片加载动画
  },
  getters: {
    getScreenWH(state) {
      return state.screenWH;
    },
    getUserId(state) {
      return state.userId
    },
    getUserInfo(state) {
      return state.userInfo
    }
  },
  mutations: {
    setScreenWH(state, payload) {
      state.screenWH = payload;
    },
    setUserId(state, payload) {
      state.userId = payload
    },
    setUserInfo(state, payload) {
      state.userInfo = payload
    },
    updateCount(state, num) {
      state.count = num
    },
    updateLoading(state, num) {
      state.vueElementLoading = num
    },
    updateImgLoading(state, num) {
      state.imgLoading = num
    }
  }
});