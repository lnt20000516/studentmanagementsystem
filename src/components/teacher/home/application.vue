<template>
  <div class="application">
    <div class="app-main">
      <div class="title-section">
        <span>Application</span>
        <h2>Choose our Application</h2>
      </div>
      <div class="row" v-if="show">
        <div class="card animate__animated animate__zoomIn">
          <img
            src="../../../assets/svg/teacher/application/students.svg"
            alt=""
            width="75px"
            height="75px"
          />
          <h5>我的学生</h5>
        </div>
        <div class="card animate__animated animate__zoomIn">
          <img
            src="../../../assets/svg/teacher/application/course.svg"
            alt=""
            width="75px"
            height="75px"
          />
          <h5>我的课程</h5>
        </div>
        <div class="card animate__animated animate__zoomIn">
          <img
            src="../../../assets/svg/teacher/application/homework.svg"
            alt=""
            width="75px"
            height="75px"
          />
          <h5>我的作业</h5>
        </div>
      </div>
      <div class="row" v-if="show2">
        <div class="card animate__animated animate__zoomIn">
          <img
            src="../../../assets/svg/teacher/application/timeTable.svg"
            alt=""
            width="75px"
            height="75px"
          />
          <h5>课程表</h5>
        </div>
        <div class="card animate__animated animate__zoomIn">
          <img
            src="../../../assets/svg/teacher/application/parents.svg"
            alt=""
            width="75px"
            height="75px"
          />
          <h5>学生家长</h5>
        </div>
        <div class="card animate__animated animate__zoomIn">
          <img
            src="../../../assets/svg/teacher/application/record.svg"
            alt=""
            width="75px"
            height="75px"
          />
          <h5>打卡记录</h5>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      show: false,
      show2: false,
    };
  },
  methods: {
    scrollHandle(e) {
      const scroll = e.srcElement.scrollingElement.scrollTop;
      if (scroll >= 300) this.show = true;
      if (scroll >= 450) this.show2 = true;
    },
  },
  mounted() {
    window.addEventListener("scroll", this.scrollHandle); // 绑定页面的滚动事件
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.scrollHandle, true);
  },
};
</script>
<style scoped lang='scss'>
.application {
  position: absolute;
  width: 100%;
  height: 70%;
  background-image: url("../../../assets/img/bg/bg.png");
  background-repeat: no-repeat;
  background-size: contain;
  padding-top: 70px;
  .app-main {
    width: 60%;
    margin: 0 auto;
    .title-section {
      text-align: center;
      padding-bottom: 40px;
      span {
        color: #614caa;
        font-size: 16px;
        font-weight: 600;
        text-transform: capitalize;
        margin-bottom: 20px;
        display: block;
      }
    }
    .row {
      display: flex;
      margin-right: -15px;
      margin-left: -15px;
      justify-content: space-between;
      .card {
        width: 200px;
        padding: 20px 20px 2px 20px;
        padding-right: 15px;
        padding-left: 15px;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 10px;
        animation-duration: 2s;
        cursor: pointer;
        h5 {
          margin-top: 20px;
          margin-bottom: 20px;
        }
      }
      .card:hover {
        box-shadow: 0px 0px 25px rgba($color: rgb(141, 141, 141), $alpha: 0.5);
      }
    }
  }
}
</style>
<style lang="scss">
@media screen and(max-width: 420px) {
  .application {
    .app-main {
      width: 90% !important;
      .row {
        flex-direction: column !important;
        align-items: center;
      }
    }
  }
}
</style>