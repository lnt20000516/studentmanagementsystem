<template>
  <div class="teacher">
    <el-backtop></el-backtop>
    <el-container>
      <el-header> <index-header></index-header> </el-header>
      <el-main><router-view></router-view> </el-main>
    </el-container>
  </div>
</template>
<script>
import indexHeader from "@/components/teacher/indexHeader";
export default {
  components: {
    indexHeader,
  },
};
</script>
<style scoped lang='scss'>
@import "../../assets/css/common.scss";
.teacher {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url("../../assets/img/bg/bg-hero.png");
  background-repeat: no-repeat;
  background-size: contain;
  .el-main {
    padding: 0px;
  }
}
</style>
<style lang="scss">
.el-button--primary {
  background-color: #6f60a5;
  border-color: #6f60a5;
  transition: all 0.5s ease-in-out;
}

.el-button--primary:focus {
  background-color: #6f60a5;
  border-color: #6f60a5;
}

.el-button--primary:hover,
.el-button--primary:active {
  background-color: #7e72ac;
  border-color: #7e72ac;
}

.el-button.el-button--default.is-plain {
  border-color: #6f60a5;
  color: #6f60a5;
}
</style>
