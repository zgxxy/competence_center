<!-- 项目管理 -->
<template>
  <div class="table-warpper">
    <!-- 表格展示 -->
    <el-card class="fatherBox">
      <div class="block-content">
        <div class="title flex_">
          <i class="el-icon-warning icon" />
          <span class="p1">项目管理适用于多产品联合计费的场景</span>
        </div>
        <div class="header">
          <el-button
            v-if="showComputed('addProject')"
            type="primary"
            class="addBtn"
            @click="add"
          >
            新建项目
          </el-button>
          <div class="search">
            <el-tooltip
              :content="crowdName"
              placement="top"
              effect="light"
              :disabled="crowdName.length < 10"
            >
              <el-input
                v-model="crowdName"
                placeholder="请输入项目名称"
                maxlength="30"
                class="searchInput"
                @change="changeIpt"
              >
                <i slot="suffix" class="el-icon-search el-input__icon" />
              </el-input>
            </el-tooltip>
          </div>
        </div>
        <el-table
          :data="tableData"
          border
          class="commonTable"
          style="width: 100%;"
        >
          <!-- <el-table-column prop="projectId" label="项目 ID" width="300" align="center" /> -->
          <el-table-column label="项目名称" align="center">
            <template slot-scope="scope">
              <span class="slat" @click="goDetail(scope.row)">
                {{ scope.row.projectName || '--' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="customerName" label="客户" align="center" />
          <el-table-column
            prop=""
            label="项目经理/联系方式"
            align="center"
            min-width="110"
          >
            <template slot-scope="scope">
              <span class="">{{ scope.row.projectManage || '--' }}</span>
              /
              <span class="">{{ scope.row.contactInform || '--' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            width="170"
            label="创建时间"
            align="center"
          />
          <el-table-column label="状态" align="center" width="80">
            <template slot-scope="scope1">
              <span
                v-if="scope1.row.status == '1'"
                class=""
                style="color: #70b603;"
              >
                启用
              </span>
              <span
                v-if="scope1.row.status == '0'"
                class=""
                style="color: #d9001b;"
              >
                禁用
              </span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            min-width="120"
          >
            <template slot-scope="scope">
              <el-tag
                class="tag"
                v-if="showComputed('projectDetail')"
                @click="goDetail(scope.row)"
              >
                详情
              </el-tag>
              <el-tag
                v-if="
                  scope.row.status == 1 && showComputed('updateProjectStatus')
                "
                class="tag"
                type="warning"
                @click="updateStatus('0', scope.row)"
              >
                禁用
              </el-tag>
              <el-tag
                v-if="
                  scope.row.status == 0 && showComputed('updateProjectStatus')
                "
                class="tag"
                type="success"
                @click="updateStatus('1', scope.row)"
              >
                启用
              </el-tag>
              <el-tag
                v-if="scope.row.status == 0 && showComputed('deleteProject')"
                class="tag"
                type="danger"
                @click="delList(scope.row)"
              >
                删除
              </el-tag>
            </template>
          </el-table-column>
        </el-table>

        <!--分页按钮 prev, pager, next,jumper, ->, total-->
        <el-pagination
          background
          layout="total, prev, pager, next,sizes, jumper"
          :total="totalList"
          :current-page="currentPage"
          :page-size="pageSize"
          style="text-align: center;"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <div class="delDialog">
      <el-dialog title="提示" :visible.sync="dialogVisible">
        <span>是否确认删除，删除后不可撤回</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sureDel">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <el-dialog width="50%" title="新建项目" :visible.sync="dialogTableVisible">
      <div class="popup">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="项目名称" prop="projectName">
            <el-input
              v-model="ruleForm.projectName"
              maxlength="30"
              placeholder="请输入项目名称"
            />
          </el-form-item>
          <!-- <el-form-item label="项目ID" prop="customerId">
            <el-input v-model="ruleForm.customerId" placeholder="请输入项目ID"></el-input>
          </el-form-item> -->
          <el-form-item label="关联客户" prop="customerId">
            <el-select
              v-model="ruleForm.customerId"
              filterable
              placeholder="请选择关联客户"
            >
              <el-option
                v-for="item in options"
                :key="item.customerId"
                :label="item.customerName"
                :value="item.customerId"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="项目经理" maxlength="30" prop="projectManage">
            <el-input
              v-model="ruleForm.projectManage"
              placeholder="请输入项目经理名"
            />
          </el-form-item>

          <el-form-item label="联系邮箱" prop="contactInform">
            <el-input
              v-model="ruleForm.contactInform"
              maxlength="50"
              type="text"
              placeholder="请输入邮箱地址"
            />
          </el-form-item>

          <el-form-item
            style="
              padding-left: 80px;
              box-sizing: border-box;
              margin-top: 32px;
            "
          >
            <el-button
              class="btn"
              type="primary"
              @click="submitForm('ruleForm')"
            >
              提交
            </el-button>
            <el-button class="btn" @click="dialogTableVisible = false">
              取消
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  projectList,
  newBuildProject,
  CustomerList,
  deleteProject,
  updateProjectStatus,
} from '@/api/capacityApi'
export default {
  components: {},
  data() {
    const validateEmail = (rule, value, callback) => {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (regex.test(value)) {
        console.log('校验通过')
        callback()
      } else {
        callback(new Error('请输入正确的邮箱地址'))
      }
    }
    return {
      projectName: '', // 项目名称
      dialogVisible: false,
      projectId: '', // 项目id
      currentPage: 1, // 当前页 刷新后默认显示第一页
      pageSize: 10, // 每一页显示的数据量 此处每页显示6条数据
      totalList: 0,
      dialogTableVisible: false,
      crowdName: '',
      tableData: [],
      ruleForm: {
        projectName: '',
        customerId: [],
        projectManage: '',
        contactInform: '',
      },
      rules: {
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
        ],
        customerId: [
          { required: true, message: '请选择客户', trigger: 'blur' },
        ],
        projectManage: [
          { required: true, message: '请输入项目经理名', trigger: 'blur' },
        ],
        contactInform: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            required: true,
            message: '',
            trigger: 'blur',
            validator: validateEmail,
          },
        ],
        // linkUser: [
        //   { required: true, message: '请选择关联客户', trigger: 'blur' },
        // ],
      },
      options: [],
    }
  },
  watch: {
    // 'ruleForm.contactInform'(value, oldValue) {
    //   this.ruleForm.contactInform = value.slice(0, 11)
    // }
  },
  created() {
    this.getList()
    this.getCustomerList()
  },
  methods: {
    // 获取项目列表
    getList(isPage) {
      if (isPage !== true) {
        this.currentPage = 1
      }
      console.log(this.$store.getters.userInfo, 'userInfo')
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        projectName: this.projectName,
        userId:
          this.$store.getters.userInfo.userName === '管理员'
            ? ''
            : this.$store.getters.userInfo.userId,
      }
      projectList(params).then((res) => {
        if (res.data.code === '0') {
          const data_ = res.data.data
          this.tableData = data_.records
          this.totalList = Number(data_.total)
        }
      })
    },
    // 跳转至资源详情
    goDetail(row) {
      console.log(row)
      this.$router.push({
        path: '/projectManagement/projectDetail',
        query: {
          projectId: row.projectId,
          customerId: row.customerId,
        },
      })
    },
    // 搜索
    changeIpt(e) {
      console.log('a=', e)
      this.projectName = e
      this.getList()
    },
    // 删除客户
    delList(row) {
      console.log('row', row)
      this.projectId = row.projectId
      this.dialogVisible = true
    },
    // 确认删除
    sureDel() {
      const params = {
        projectId: this.projectId,
      }
      deleteProject(params).then((res) => {
        if (res.data.code === '0') {
          console.log('更新成功', res)
          this.$message.success('删除成功')
          this.dialogVisible = false
          setTimeout(() => {
            this.getList(true)
          }, 800)
        }
      })
    },
    // 获取客户列表
    getCustomerList() {
      const params = {
        customerName: '',
      }
      CustomerList(params).then((res) => {
        if (res.data.code === '0') {
          const data_ = res.data.data
          this.options = data_
        }
      })
    },
    // 分页
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage // 每次点击分页按钮，当前页发生变化
      this.getList(true)
    },
    // 切换页数
    handleSizeChange(val) {
      this.pageSize = val // 每次点击分页按钮，当前页发生变化
      this.getList()
    },
    // 管理
    handleClick(row) {
      console.log(row)
      this.$router.push('/customerManagement/serviceAuthorization')
    },
    // 消费明细
    seeDetail(row) {
      this.$router.push('/projectManagement/usingWater')
    },
    // 新建
    add() {
      this.dialogTableVisible = true
    },
    // 下一步
    submitForm(formName) {
      console.log('formName', formName)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('valid', valid, this.ruleForm)
          this.newBuildProject()
          // this.$router.push('/serviceAuthorization')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 新建项目
    newBuildProject() {
      const params = this.ruleForm
      newBuildProject(params).then((res) => {
        if (res.data.code === '0') {
          this.$message.success('新建项目成功')
          setTimeout(() => {
            this.dialogTableVisible = false
            this.ruleForm = {}
            this.getList()
          }, 800)
        }
      })
    },
    // 更新项目状态
    updateStatus(num, row) {
      let txt = ''
      if (num === '0') {
        txt = '是否禁用'
      } else {
        txt = '是否启用'
      }
      const params = {
        projectId: row.projectId,
        status: num,
      }
      this.$confirm(txt, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        lockScroll: false,
      })
        .then(() => {
          updateProjectStatus(params).then((res) => {
            if (res.data.code === '0') {
              console.log('更新成功', res)
              if (num === '0') {
                this.$message.success('禁用成功')
              } else {
                this.$message.success('启用成功')
              }
              setTimeout(() => {
                this.getList(true)
              }, 800)
            }
          })
        })
        .catch(() => {})
    },
  },
}
</script>

<style scoped lang="scss">
.el-card {
  min-height: 80vh;
}

.title {
  width: 100%;
  height: 45px;
  line-height: 45px;
  border-radius: 2px;
  background: #f1f1f1;
  color: #444;
  padding: 0 30px;
  box-sizing: border-box;
  margin-bottom: 20px;

  .p1 {
    color: #409eff;
  }

  .icon {
    color: #409eff;
    font-size: 20px;
    margin-right: 4px;
  }
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  justify-content: space-between;
}

.search {
  font-size: 14px;
  display: flex;
  align-items: center;

  :nth-child(2) {
    flex: 1;
    margin-left: 7px;
  }

  .searchInput {
    width: 300px;
  }
}

.addBtn {
  padding: 10px 20px;
  height: auto;
}

.slat {
  color: #409eff;
  margin: 0 6px;
  cursor: pointer;
  text-decoration: underline;
}

::v-deep .el-table__row .el-table__cell {
  // padding: 22px 0 !important;
}

.delDialog {
  ::v-deep .el-dialog {
    width: 400px !important;

    .el-dialog__header {
      border-bottom: none;
    }

    .el-dialog__body {
      padding: 30px 0 50px;
    }
  }
}

.tag {
  margin: 0 5px;
  cursor: pointer;
}

.slat {
  color: #409eff;
  margin: 0 6px;
  cursor: pointer;
}

.popup {
  width: 100%;
  height: auto;

  .el-form {
    width: 100%;
    padding: 40px 40px 0;
    box-sizing: border-box;

    ::v-deep .el-form-item {
      display: flex;
      align-items: center;

      .el-form-item__label {
        text-align: left;
        width: 80px !important;
        color: #666;
      }

      .el-form-item__content {
        margin-left: 10px !important;
        width: 60%;
        display: flex;
        align-items: center;

        .el-select {
          width: 100%;
        }
      }
    }

    .btn {
      min-width: 90px;
    }

    .addTxt {
      font-size: 13px;
      color: #999;
      margin-top: -20px;
    }
  }
}
</style>
