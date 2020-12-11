<template>
  <div class="administrators-menu">
    <div class="loading" v-show="loading">
      <loading-1></loading-1>
    </div>
    <div class="top-bar">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item style="font-weight: 800"
          >管理员管理</el-breadcrumb-item
        >
        <el-breadcrumb-item>所有管理员</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="administrators-menu-main">
      <div class="search">
        <effect-input
          v-model="adminName"
          placeholder="请输入管理员名称"
        ></effect-input>
        <button class="pan-btn primary-btn" @click="queryAdmin">
          立即查询
        </button>
      </div>
      <div class="table">
        <el-table :data="adminData" stripe style="width: 100%">
          <el-table-column prop="id" label="管理员Id" width="80" align="center">
          </el-table-column>
          <el-table-column
            prop="user_details.name"
            label="管理员名称"
            width="180"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="user_name"
            label="管理员用户名"
            width="180"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="user_details.sex"
            label="性别"
            width="100"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="user_details.birthday"
            label="生日"
            width="180"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="user_details.personal_signature"
            label="个性签名"
          >
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div>
                <i class="el-icon-edit" @click="editSchool(scope.row)"></i>
                <i
                  class="el-icon-delete"
                  @click="deleteSchool(scope.$index, scope.row.id,  )"
                ></i>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          :page-sizes="[5, 10, 15, 20]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import VueElementLoading from "vue-element-loading";
import effectInput from "@/components/common/effectInput";
import loading1 from "@/components/loading/loading1";
import * as admin from "@/api/manager/administrators";
export default {
  
  components: {
    VueElementLoading,
    effectInput,
    loading1,
  },
  data() {
    return {
      adminName: "",
      adminData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
    };
  },
  created() {
    this.getAdminData();
  },
  methods: {
    async queryAdmin() {
      let resData = await admin.searchAdmin(1, 10, this.adminName);
      this.adminData = resData.results;
      this.total = resData.count;
    },
    async getAdminData() {
      let resData = await admin.searchAdmin(this.currentPage, this.pageSize);
      this.adminData = resData.results;
      this.total = resData.count;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getAdminData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getAdminData();
    },
    deleteSchool(){

    }
  },
  computed: {
    loading() {
      return this.$store.state.loading;
    },
  },
};
</script>
<style scoped lang="scss">
@import "../../../styles/btn.scss";
.administrators-menu {
  .top-bar {
    background-color: white;
    padding: 20px;
    margin-bottom: 30px;
    .el-breadcrumb__inner {
      cursor: default !important;
    }
  }
  .administrators-menu-main {
    i {
      margin: 5px;
      cursor: pointer;
    }
    padding: 30px;
    background-color: #fff;
    .search {
      display: flex;
      flex-direction: row;
      margin-bottom: 30px;
      .pan-btn {
        margin-left: 20px;
      }
    }
  }
  .loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
    background: #fff;
  }
}
</style>