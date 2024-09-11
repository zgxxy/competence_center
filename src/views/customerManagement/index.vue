<!-- 客户管理 -->
<template>
  <div class="table-warpper">
    <!-- 表格展示 -->
    <el-card class="fatherBox">
      <div class="block-content">
        <div class="header">
          <el-button
            type="primary"
            @click="add"
            v-if="showComputed('addCustomer')"
          >
            新建客户
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
                placeholder="请输入客户名称"
                maxlength="30"
                class="searchInput"
                clearable
                @change="changeIpt"
              >
                <i slot="suffix" class="el-icon-search el-input__icon" />
              </el-input>
            </el-tooltip>
          </div>
        </div>
        <el-table
          ref="table"
          :data="tableData"
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
          class="commonTable"
          border
          style="width: 100%;"
          @expand-change="handleChange"
        >
          <el-table-column
            fixed
            type="index"
            label="序号"
            width="60"
            align="center"
          />
          <el-table-column
            prop="customerName"
            label="客户名称"
            align="center"
            min-width="110"
          />
          <el-table-column prop="linkPerson" label="联系人" align="center" />
          <el-table-column
            prop="linkPhone"
            label="联系电话"
            align="center"
            width="110"
          />
          <el-table-column
            prop="email"
            label="联系邮箱"
            min-width="110"
            align="center"
          />
          <el-table-column
            prop="createTime"
            label="创建时间"
            width="180"
            align="center"
          />
          <el-table-column prop="status" label="状态" align="center">
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
          <!-- <el-table-column label="关联服务" width="100" align="center">
            <template slot-scope="scope1">
              <span class="exit_" :class="scope1.row.hasSelect && popupIndex==1 ?'active':''" @click="openDialog(1, scope1.row)">{{
                scope1.row.powerCount
              }}</span>
            </template>
          </el-table-column> -->
          <el-table-column label="关联用户" align="center">
            <template slot-scope="scope1">
              <span
                class="exit_"
                :class="scope1.row.hasSelect && popupIndex == 2 ? 'active' : ''"
                @click="openDialog(2, scope1.row)"
              >
                {{ scope1.row.userCount }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="关联项目" align="center">
            <template slot-scope="scope1">
              <span
                class="exit_"
                :class="scope1.row.hasSelect && popupIndex == 3 ? 'active' : ''"
                @click="openDialog(3, scope1.row)"
              >
                {{ scope1.row.projectCount }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="130" align="center">
            <template slot-scope="scope">
              <el-tag
                class="tag"
                v-if="showComputed('customDetail')"
                @click="goCustomDetail(scope.row)"
              >
                详情
              </el-tag>
              <el-tag
                v-if="
                  scope.row.status == 1 && showComputed('updateCustomerStatus')
                "
                class="tag"
                type="warning"
                @click="updateStatus('0', scope.row)"
              >
                禁用
              </el-tag>
              <el-tag
                v-if="
                  scope.row.status == 0 && showComputed('updateCustomerStatus')
                "
                class="tag"
                type="success"
                @click="updateStatus('1', scope.row)"
              >
                启用
              </el-tag>
              <!-- <el-tag v-if="scope.row.status == 0" class="tag" type="danger" @click="delList(scope.row, '客户')">删除</el-tag> -->
            </template>
          </el-table-column>

          <!-- 子表格抽屉 -->
          <el-table-column type="expand" width="1">
            <template slot-scope="props">
              <div style="width: 95%; display: flex; margin: auto;">
                <!-- 关联服务 -->
                <template v-if="popupIndex == 1">
                  <el-table
                    :data="props.row.customerPowerPoolAuthEntityVOList"
                    border
                    :header-cell-style="{
                      background: '#eef5ff',
                      color: '#606266',
                      borderColor: '#d8e6fe',
                      'text-align': 'center',
                    }"
                    :cell-style="{
                      borderColor: '#d8e6fe',
                      'text-align': 'center',
                    }"
                  >
                    <el-table-column label="产品/服务名称" prop="powerName" />
                    <el-table-column label="交付方式" prop="deliveryMode" />
                    <el-table-column label="状态" prop="status">
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
                    <el-table-column label="服务开通时间" prop="createTime" />
                    <el-table-column label="操作" width="200" align="center">
                      <template slot-scope="scope">
                        <el-tag
                          v-if="scope.row.status == 1"
                          class="tag"
                          type="warning"
                          @click="updateStatus2('0', scope.row)"
                        >
                          禁用
                        </el-tag>
                        <el-tag
                          v-if="scope.row.status == 0"
                          class="tag"
                          type="success"
                          @click="updateStatus2('1', scope.row)"
                        >
                          启用
                        </el-tag>
                        <el-tag
                          class="tag"
                          type="danger"
                          @click="delList(scope.row, '服务')"
                        >
                          删除
                        </el-tag>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>

                <!-- 关联用户 -->
                <template v-if="popupIndex == 2">
                  <el-table
                    :data="props.row.userEntityVOList"
                    border
                    :header-cell-style="{
                      background: '#eef5ff',
                      color: '#606266',
                      borderColor: '#d8e6fe',
                      'text-align': 'center',
                    }"
                    :cell-style="{
                      borderColor: '#d8e6fe',
                      'text-align': 'center',
                    }"
                  >
                    <el-table-column label="用户姓名" prop="userName" />
                    <el-table-column label="用户手机号" prop="phone" />
                    <el-table-column label="状态" prop="status">
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
                    <el-table-column label="创建时间" prop="createTime" />
                    <el-table-column label="有效期限" prop="">
                      长期
                    </el-table-column>
                  </el-table>
                </template>

                <!-- 关联项目 -->
                <template v-if="popupIndex == 3">
                  <el-table
                    :data="props.row.projectEntityVOList"
                    border
                    :header-cell-style="{
                      background: '#eef5ff',
                      color: '#606266',
                      borderColor: '#d8e6fe',
                      'text-align': 'center',
                    }"
                    :cell-style="{
                      borderColor: '#d8e6fe',
                      'text-align': 'center',
                    }"
                  >
                    <el-table-column label="项目名称" prop="projectName" />
                    <el-table-column label="创建时间" prop="createTime" />
                    <el-table-column
                      prop=""
                      label="项目经理/联系方式"
                      align="center"
                    >
                      <template slot-scope="scope">
                        <span class="">
                          {{ scope.row.projectManage || '--' }}
                        </span>
                        /
                        <span class="">
                          {{ scope.row.contactInform || '--' }}
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column label="状态" prop="status">
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
                    <!-- <el-table-column label="备注" prop="" /> -->
                    <el-table-column label="操作" width="200" align="center">
                      <template slot-scope="scope">
                        <el-tag
                          v-if="
                            scope.row.status == 1 &&
                            showComputed('updateRelevanceProjectStatus')
                          "
                          class="tag"
                          type="warning"
                          @click="updateStatus3('0', scope.row)"
                        >
                          禁用
                        </el-tag>
                        <el-tag
                          v-if="
                            scope.row.status == 0 &&
                            showComputed('updateRelevanceProjectStatus')
                          "
                          class="tag"
                          type="success"
                          @click="updateStatus3('1', scope.row)"
                        >
                          启用
                        </el-tag>
                        <el-tag
                          v-if="scope.row.status == 0"
                          class="tag"
                          type="danger"
                          @click="delList(scope.row, '项目')"
                        >
                          删除
                        </el-tag>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </div>
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

    <el-dialog width="70%" :title="linkTxt" :visible.sync="dialogTableVisible">
      <el-table
        v-if="popupIndex == 1"
        :data="gridData1"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column property="name" label="产品/服务名称" />
        <el-table-column property="pay" label="交付方式" />
        <el-table-column property="state" label="状态" />
        <el-table-column property="startTime" label="服务开通时间" />
        <el-table-column property="endTime" label="服务结束时间" />
        <el-table-column property="dosage" label="用量">
          <template slot-scope="scope3">
            <el-progress :percentage="scope3.row.dosage" />
          </template>
        </el-table-column>
        <el-table-column property="exit" label="操作">
          <template>
            <span class="slat">编辑</span>
            <span class="slat">明细</span>
            <span class="slat">启用</span>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-if="popupIndex == 2"
        :data="gridData2"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column property="name" label="用户姓名" />
        <el-table-column property="types" label="账号类型" />
        <el-table-column property="userId" label="用户ID" />
        <el-table-column property="creatTime" label="创建时间" />
        <el-table-column property="timeout" label="有效期限" />
        <el-table-column property="state" label="状态" />
        <el-table-column property="linkInfo" label="关联信息" />
        <el-table-column property="linkType" label="访问类型" />
        <el-table-column property="remark" label="备注" />
        <el-table-column property="exit" label="操作">
          <template>
            <span class="slat">授权</span>
            <span class="slat">禁用</span>
            <span class="slat">删除</span>
            <span class="slat">查看</span>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-if="popupIndex == 3"
        :data="gridData3"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column property="name" label="项目名称" />
        <el-table-column property="types" label="项目ID" />
        <el-table-column property="creatTime" label="创建时间" />
        <el-table-column property="endTime" label="结束时间" />
        <el-table-column property="state" label="状态" />
        <el-table-column property="linkInfo" label="关联服务" />
        <el-table-column property="remark" label="备注" />
        <el-table-column property="exit" label="操作">
          <template>
            <span class="slat">授权</span>
            <span class="slat">禁用</span>
            <span class="slat">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { mapList } from '@/utils/public'
import {
  getSelectByPage,
  updateCustomerStatus,
  deleteCustomer,
  updateCustomerPowerPoolAuthStatus,
  updateProjectStatus,
  deleteProject,
  deleteCustomerPower,
} from '@/api/capacityApi'
export default {
  components: {},
  data() {
    return {
      projectId: '', // 项目id
      delType: '', // 删除类型
      smallList: [], // 抽屉列表
      currentPage: 1, // 当前页 刷新后默认显示第一页
      pageSize: 10, // 每一页显示的数据量 此处每页显示6条数据
      dialogTableVisible: false,
      gridData1: [
        {
          name: '客户画像洞察平台',
          pay: 'SAAS',
          state: '试用',
          startTime: '2023-01-31 11:30:25',
          endTime: '2023-01-31 11:30:26',
          dosage: 40,
        },
      ],
      gridData2: [
        {
          name: '张三',
          types: '主账号',
          userId: '1654654',
          creatTime: '2023-01-31 11:30:25',
          timeout: '长期',
          state: '启用',
          linkInfo: [],
          linkType: '全权限',
          remark: '超级管理员',
        },
      ],
      gridData3: [
        {
          name: 'DFN数字转型',
          types: 'DFN106985430',
          creatTime: '2023-01-31 11:30:25',
          endTime: '2023-01-31 11:30:25',
          state: '启用',
          linkInfo: 'LY-支付工具；画像....',
          remark: '暂无',
        },
      ],
      crowdName: '',
      tableData: [],
      linkTxt: '关联服务',
      popupIndex: 1,
      totalList: 0,
      customerId2: '', // 客户id
      serviceId: '', // 服务id
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleChange(row, expandedRows) {
      row.hasSelect = !row.hasSelect
    },
    // 打开关联服务
    openDialog(num, data) {
      // this.dialogTableVisible = true
      const $table = this.$refs.table
      // data.hasSelect = true
      const rowIndex = this.tableData.indexOf(data)
      this.tableData.forEach((item, index) => {
        if (rowIndex !== index) {
          this.$refs.table.toggleRowExpansion(item, false)
        }
      })
      if (num === 1) {
        this.popupIndex = 1
        if (data.powerCount < 1) {
          this.$message.warning('暂无关联服务')
        } else {
          $table.toggleRowExpansion(data)
        }
      } else if (num === 2) {
        this.popupIndex = 2
        if (data.userCount < 1) {
          this.$message.warning('暂无关联用户')
        } else {
          $table.toggleRowExpansion(data)
        }
      } else if (num === 3) {
        this.popupIndex = 3
        if (data.projectCount < 1) {
          this.$message.warning('暂无关联项目')
        } else {
          $table.toggleRowExpansion(data)
        }
      }
    },
    // 管理
    handleClick(row) {},
    // 详情
    goCustomDetail(row) {
      // this.$router.push("/customDetail");
      this.$router.push({
        path: '/customerManagement/customDetail',
        query: { customerId: row.customerId, customerName: row.customerName },
      })
    },
    // 新建
    add() {
      this.$router.push('/customerManagement/addCustomer')
    },
    // 搜索
    changeIpt(e) {
      this.crowdName = e
      this.getList()
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
    // 获取列表数据
    getList(isPage) {
      if (isPage !== true) {
        this.currentPage = 1
      }
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        customerName: this.crowdName,
      }
      getSelectByPage(params).then((res) => {
        if (res.data.code === '0') {
          const data_ = res.data.data
          this.tableData = data_.records
          this.tableData.forEach((item) => {
            item.hasSelect = false
          })
          mapList(this.tableData)
          this.totalList = Number(data_.total)
        }
      })
    },
    // 启用禁用状态更新
    updateStatus(num, row) {
      let txt = ''
      if (num === '0') {
        txt = '是否禁用'
      } else {
        txt = '是否启用'
      }
      const params = {
        customerId: row.customerId,
        status: num,
      }
      this.$confirm(txt, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        lockScroll: false,
      })
        .then(() => {
          updateCustomerStatus(params).then((res) => {
            if (res.data.code === '0') {
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
    // 禁用启用关联服务
    updateStatus2(num, row) {
      const params = {
        customerPowerPoolAuthId: row.customerPowerPoolAuthId,
        status: num,
      }
      updateCustomerPowerPoolAuthStatus(params).then((res) => {
        if (res.data.code === '0') {
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
    },
    // 禁用启用关联服务
    updateStatus3(num, row) {
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
    // 删除客户
    delList(row, type) {
      this.delType = type
      if (type === '客户') {
        this.customerId2 = row.customerId
      } else if (type === '项目') {
        this.projectId = row.projectId
      } else if (type === '服务') {
        this.serviceId = row.customerPowerPoolAuthId
      }
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        lockScroll: false,
      })
        .then(() => {
          this.sureDel()
        })
        .catch(() => {})
    },
    // 确认删除
    sureDel() {
      if (this.delType === '客户') {
        const params = {
          customerId: this.customerId2,
        }
        deleteCustomer(params).then((res) => {
          if (res.data.code === '0') {
            this.$message.success('删除成功')
            setTimeout(() => {
              this.getList(true)
            }, 800)
          }
        })
      } else if (this.delType === '项目') {
        const params = {
          projectId: this.projectId,
        }
        deleteProject(params).then((res) => {
          if (res.data.code === '0') {
            this.$message.success('删除成功')
            setTimeout(() => {
              this.getList()
            }, 800)
          }
        })
      } else if (this.delType === '服务') {
        const params = {
          id: this.serviceId,
        }
        deleteCustomerPower(params).then((res) => {
          if (res.data.code === '0') {
            this.$message.success('删除成功')
            setTimeout(() => {
              this.getList()
            }, 800)
          }
        })
      }
    },
  },
}
</script>

<style scoped lang="scss">
.el-card {
  min-height: 80vh;
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

.slat {
  color: #409eff;
  margin: 0 6px;
  cursor: pointer;
}

.tag {
  margin: 0 5px;
  cursor: pointer;
}

.exit_ {
  color: #409eff;
  text-decoration: underline;
  cursor: pointer;
  padding: 5px 20px;
  box-sizing: border-box;
  display: inline-block;
  border-radius: 3px;

  &.active {
    background: #eee;
  }
}

::v-deep .el-dialog {
  width: 400px !important;

  .el-dialog__header {
    border-bottom: none;
  }

  .el-dialog__body {
    padding: 30px 0 50px;
  }
}

::v-deep .el-table__row .el-table__cell {
  // padding: 22px 0 !important;
}
</style>
