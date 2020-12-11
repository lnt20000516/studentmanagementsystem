<template>
  <div class="parent-menu">
    <div class="top-bar">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item style="font-weight: 800"
          >家长管理</el-breadcrumb-item
        >
        <el-breadcrumb-item>所有家长</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="parent-menu-main">
      <div class="operation flex-row">
        <div class="search flex-row">
          <effect-input
            v-model="searchValue"
            class="effect"
            placeholder="请输入家长名称"
            @keyup.enter.native="searchParent"
          ></effect-input>
          <button class="pan-btn primary-btn" @click="searchParent">
            立即查询
          </button>
        </div>
        <el-tooltip
          class="item"
          effect="dark"
          content="删除所选家长"
          placement="top-start"
        >
          <el-button
            style="margin-left: 20px"
            type="danger"
            icon="el-icon-delete"
            circle
            @click="batchDelete"
          ></el-button>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="导出家长表"
          placement="top-start"
        >
          <el-button
            :loading="downloadLoading"
            type="success"
            circle
            icon="el-icon-download"
            @click="handleDownload"
          >
          </el-button>
        </el-tooltip>
      </div>
      <div class="parent-menu">
        <vue-element-loading
          :active="this.$store.state.vueElementLoading"
          spinner="bar-fade-scale"
          color="#7d76ca"
          size="60"
        />
        <el-table
          :data="parentData"
          stripe
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="45" align="center">
          </el-table-column>
          <el-table-column
            prop="user.user_details.id"
            label="家长ID"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="user.user_details.name"
            label="姓名"
            align="center"
          >
          </el-table-column>
          <el-table-column label="性别" align="center">
            <template slot-scope="scope">
              {{ scope.row.user.user_details.sex | sex }}
            </template>
          </el-table-column>
          <el-table-column
            prop="user.user_details.card"
            label="身份证号"
            width="180"
            align="center"
          >
          </el-table-column>
          <el-table-column label="出生日期" align="center" min-width="120">
            <template slot-scope="scope">
              {{ scope.row.user.user_details.birthday | YMD }}
            </template>
          </el-table-column>
          <el-table-column
            prop="user.phone_number"
            label="电话号码"
            width="120"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="user.user_details.qq"
            label="QQ号"
            width="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="user.user_details.email"
            label="Email"
            width="180"
            align="center"
          >
          </el-table-column>
          <el-table-column align="center" fixed="right">
            <template slot-scope="scope">
              <i
                class="el-icon-edit"
                @click="handleEdit(scope.$index, scope.row)"
              ></i>
              <i
                class="el-icon-delete"
                @click="handleDelete(scope.$index, scope.row.id)"
              ></i>
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
          v-if="showAllpag"
        ></el-pagination>
        <el-pagination
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :total="total"
          v-else
        >
        </el-pagination>
        <el-dialog
          title="修改信息"
          :visible.sync="dialogVisible"
          :append-to-body="true"
        >
          <el-form
            :model="editForm"
            label-width="80px"
            :rules="rules"
            ref="editForm"
          >
            <el-form-item label="姓名" prop="name">
              <el-input v-model="editForm.name"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-select v-model="editForm.sex" placeholder="请选择性别">
                <el-option label="男" :value="1"></el-option>
                <el-option label="女" :value="-1"></el-option>
                <el-option label="保密" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="身份证号" prop="card">
              <el-input v-model="editForm.card"></el-input>
            </el-form-item>
            <el-form-item label="出生日期" prop="birthday">
              <el-date-picker
                v-model="editForm.birthday"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="timestamp"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="联系方式" prop="phone_number">
              <el-input v-model="editForm.phone_number"></el-input>
            </el-form-item>
            <el-form-item label="QQ" prop="qq">
              <el-input v-model="editForm.qq"></el-input>
            </el-form-item>
            <el-form-item label="email" prop="email">
              <el-input v-model="editForm.email"></el-input>
            </el-form-item>
          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitEditForm()"
              >确 定</el-button
            >
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import VueElementLoading from "vue-element-loading";
import * as parent from "@/api/manager/parent";
import effectInput from "@/components/common/effectInput";
import { YMD } from "@/tools/dateConversion";
import { NtT } from "@/tools/sexConversion";
export default {
  components: {
    VueElementLoading,
    effectInput,
  },
  created() {
    this.getParentData();
  },
  data() {
    return {
      parentData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      showAllpag: true,
      searchValue: "",
      downloadLoading: false,
      selectionData: [],
      filename: "教师花名册",
      autoWidth: true,
      bookType: "xlsx",
      dialogVisible: false,
      editForm: {},
      rules: {
        name: [
          {
            validator: (rule, value, callback) => {
              if (!value) callback(new Error("请填写姓名"));
              else {
                const nameError = isChines(value);
                if (nameError != true) {
                  callback(new Error(nameError));
                } else {
                  callback();
                }
              }
              callback();
            },
            trigger: "blur",
            required: true,
          },
        ],
        sex: [
          {
            trigger: "change",
            message: "请选择性别",
            required: true,
          },
        ],
        card: [
          {
            validator: (rule, value, callback) => {
              if (!value) callback(new Error("请输入身份证号"));
              else {
                const cardError = isCardID(value);
                if (cardError != true) {
                  callback(new Error(cardError));
                } else {
                  callback();
                }
              }
              callback();
            },
            trigger: "blur",
            required: true,
          },
        ],
        birthday: [
          {
            trigger: "change",
            message: "请选择生日",
            required: true,
          },
        ],
        phone_number: [
          {
            validator: (rule, value, callback) => {
              if (!value) callback(new Error("请输入电话号码"));
              else {
                const telError = isTelOk(value);
                if (telError != true) {
                  callback(new Error(telError));
                } else {
                  callback();
                }
              }
              callback();
            },
            trigger: "blur",
            required: true,
          },
        ],
        qq: [
          {
            validator: (rule, value, callback) => {
              if (!value) callback();
              else {
                if (!isQQ(value)) {
                  callback(new Error("QQ号码格式错误"));
                } else {
                  callback();
                }
              }
              callback();
            },
            required: false,
            trigger: "blur",
          },
        ],
        email: [
          {
            validator: (rule, value, callback) => {
              if (!value) callback();
              else {
                if (!isEmail(value)) {
                  callback(new Error("邮箱格式错误"));
                } else {
                  callback();
                }
              }
              callback();
            },
            required: false,
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    async getParentData() {
      this.$store.commit("updateLoading", true);
      const resultData = await parent.getParentData(
        this.currentPage,
        this.pageSize
      );
      if (resultData) {
        this.total = resultData.count;
        this.parentData = resultData.results;
      }
      this.$store.commit("updateLoading", false);
    },
    async searchParent() {
      this.$store.commit("updateLoading", true);
      const resultData = await parent.searchParent(this.searchKey);
      if (resultData) {
        this.total = resultData.count;
        this.parentData = resultData.results;
      }
      this.$store.commit("updateLoading", false);
    },
    handleEdit(index, row) {
      this.editForm.name = row.user.user_details.name;
      this.editForm.sex= row.user.user_details.sex;
      this.editForm.card= row.user.user_details.card;
      this.editForm.birthday= row.user.user_details.birthday;
      this.editForm.phone_number= row.user.phone_number;
      this.editForm.qq= row.user.user_details.qq;
      this.editForm.email= row.user.user_details.email;
      this.dialogVisible = true;
    },
    submitEditForm(){
      
    },
    handleDelete(index, rowid) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const resultData = await parent.deleteParent(rowid);
          if (resultData) {
            this.parentData.splice(index, 1);
          }
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },
    handleSelectionChange(val) {
      this.selectionData = [];
      val.forEach((item) => {
        this.selectionData.push(item.id);
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getParentData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getParentData();
    },
    batchDelete() {
      this.$confirm("此操作将永久删除选中用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const resultData = await parent.batchDeleteParents(
            this.selectionData
          );
        })
        .catch((error) => {
          if (error.response) {
            this.$message.error(error.response.data.message);
          } else {
            this.$message("已取消删除");
          }
        });
    },
    async searchParent() {
      this.$store.commit("updateLoading", true);
      const resultData = await parent.searchParent(this.searchValue, 1, 10);
      if (resultData) {
        this.total = resultData.count;
        this.parentData = resultData.results;
      }
      this.$store.commit("updateLoading", false);
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(async (excel) => {
        const tHeader = [
          "家长姓名",
          "性别",
          "身份证号",
          "出生日期",
          "电话号码",
          "QQ",
          "Email",
        ];
        const filterVal = [
          "name",
          "sex",
          "card",
          "birthday",
          "phone_number",
          "qq",
          "email",
        ];
        const list = await this.getAllParentData();
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType,
        });
        this.downloadLoading = false;
      });
    },
    async getAllParentData() {
      let parentData = await parent.getParentData(1, 10000000);
      parentData = parentData.results;
      let newParentData = [];
      parentData.forEach((item, index) => {
        let temp = {
          name: item.user.user_details.name,
          sex: NtT(item.user.user_details.sex),
          card: item.user.user_details.card,
          birthday: YMD(item.user.user_details.birthday),
          phone_number: item.user.phone_number,
          qq: item.user.user_details.qq,
          email: item.user.user_details.email,
        };
        newParentData.push(temp);
      });
      return newParentData;
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../../styles/btn.scss";
.parent-menu {
  .top-bar {
    background-color: white;
    padding: 20px;
    margin-bottom: 30px;
    .el-breadcrumb__inner {
      cursor: default !important;
    }
  }
  .parent-menu-main {
    background-color: #fff;
    padding: 30px;
    .operation {
      margin-bottom: 20px;
      .search {
        width: 30%;
        button {
          margin-left: 20px;
          min-width: 80px;
        }
        .effect {
          width: 90%;
        }
      }
    }
  }
  i {
    margin: 0px 5px;
    cursor: pointer;
  }
  .flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
</style>
<style lang="scss">
.el-dialog .el-select,
.el-dialog .el-date-editor {
  width: 100%;
}
@media screen and (max-width: 500px) {
  .el-dialog {
    width: 90% !important;
  }
}
@media screen and (max-width: 625px) {
}
</style>