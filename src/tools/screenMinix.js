import store from "../store"
export default {
  beforeMount() {
    this.setScreenWH()
    window.addEventListener('resize', this.setScreenWH)
  },
  beforeDestroy() {
    window.removeEventListener('resize')
  },
  methods: {
    setScreenWH() {
      const maxW = window.screen.width;
      const maxH = window.innerHeight;
      store.commit('setScreenWH', {
        maxW: maxW,
        maxH: maxH
      })
    }
  },
  data() {
    return {

    }
  }
}