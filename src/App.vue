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
* {
  margin: 0;
  padding: 0;
  border: 0;
}
::-webkit-scrollbar {
  width: 5px;
  height: 10px;
  background-color: #f5f5f5;
  border-radius: 2px;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  background-color: #f5f5f5;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 2px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: rgb(175, 173, 173);
}
</style>
