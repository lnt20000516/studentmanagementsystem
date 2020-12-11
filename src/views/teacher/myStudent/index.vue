<template>
  <div class="my-student">
    <div class="index1">
      <div class="title-section">
        <span>My Students</span>
      </div>
      <div class="select animate__animated animate__slideInLeft">
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="list animate__animated animate__slideInRight">
        <list-menu></list-menu>
      </div>
    </div>
    <add-student></add-student>
  </div>
</template>
<script>
import listMenu from "@/components/teacher/myStudent/listMenu";
import addStudent from "@/components/teacher/myStudent/addStudent";
export default {
  components: { listMenu, addStudent },
  data() {
    return {
      options: [
        {
          value: "我的学生",
          label: "我的学生",
        },
        {
          value: "全校学生",
          label: "全校学生",
        },
      ],
      value: "我的学生",
    };
  },
};
</script>
<style scoped lang='scss'>
.my-student {
  .index1 {
    width: 80%;
    margin: 0 auto;
    margin-top: 20px;
    overflow: hidden;
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
    .select {
      animation-duration: 1.5s;
    }
    .list {
      animation-duration: 1.5s;
      margin-top: 20px;
    }
  }
}
</style>
