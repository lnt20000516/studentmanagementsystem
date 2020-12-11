<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import screenMinix from "@/tools/screenMinix";

export default {
  name: "App",
  mixins: [screenMinix],
  created() {
    if (this.$cookies.isKey("userInfo")) {
      this.$store.commit("setUserInfo", this.$cookies.get("userInfo"));
    }
    if (sessionStorage.getItem("store")) {
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem("store"))
        )
      );
    }
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state));
    });
  },
  methods: {
    async getUserInfo() {
      const result = await this.$http.get();
    },
  },
};
</script>
<style lang="scss">
@import "./assets/css/common.scss";
</style>
