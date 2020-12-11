<template>
  <div class="home">
    <div class="index1">
      <div
        class="entry animate__animated animate__fadeInUp"
        style="animation-duration: 1.5s"
      >
        <span>I Am {{ identity }}</span>
        <h2>
          {{ toDay }}
          <br />
          {{ week }}
          <br />
          {{ time }}
        </h2>
        <button>打卡</button>
      </div>
      <div class="entry">
        <img
          src="../../../assets/img/teacher.png"
          alt=""
          class="animate__animated animate__zoomIn"
          style="animation-duration: 1.5s"
        />
      </div>
    </div>
    <application-view></application-view>
  </div>
</template>
<script>
import applicationView from "@/components/teacher/home/application";
export default {
  components: {
    applicationView,
  },
  created() {
    this.setDate();
    this.interval = setInterval(() => {
      this.setTime();
    }, 1000);
  },
  data() {
    return {
      identity: "Teacher",
      toDay: "",
      week: "",
      time: "",
      interval: null,
    };
  },
  methods: {
    setDate() {
      const date = new Date();
      this.toDay =
        date.getFullYear() +
        "年" +
        date.getMonth() +
        "月" +
        date.getDate() +
        "日";
      const weeks = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ];
      this.week = weeks[date.getDay()];
    },
    setTime() {
      const date = new Date();
      this.time =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
        ":" +
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":" +
        (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());
    },
  },

  beforeDestroy() {
    clearInterval(this.interval);
  },
};
</script>
<style scoped lang='scss'>
.home {
  .index1 {
    width: 80%;
    margin: 0 auto;
    display: flex;
    .entry {
      max-width: 50%;
      height: 450px;
      padding: 75px 0px;
      flex: 0 0 50%;
      span {
        color: #614caa;
        font-size: 16px;
        font-weight: 600;
        text-transform: capitalize;
        cursor: default;
      }
      h2 {
        font-size: 36px;
        font-weight: 700;
        line-height: 46px;
        margin: 20px 0;
        cursor: default;
      }
      button {
        outline: none;
        background: #614caa;
        border: 0;
        color: #fff;
        padding: 6px 14px 6px 14px;
        border-radius: 5px;
        font-size: 15px;
        position: relative;
        padding: 8px 20px;
        transition: all 0.3s;
        margin-top: 20px;
        cursor: pointer;
      }
      button:hover {
        border-radius: 20px;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
<style lang="scss">
@media screen and(max-width: 420px) {
  .home {
    .index1 {
      width: 100% !important;
      flex-direction: column;
      align-items: center;
      .entry {
        width: 100% !important;
      }
    }
  }
}
</style>