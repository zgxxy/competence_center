<!-- 资源管理 -->
<template>
  <div class="table-warpper">
    <!-- 表格展示 -->
    <el-card class="fatherBox">
      <div class="block-content">
        <div class="header">
          <el-button
            type="primary"
            class="addBtn"
            @click="add"
            v-if="showComputed('newResource')"
          >
            新增资源
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
                placeholder="搜索产品名称、缩写、功能名称"
                maxlength="30"
                class="searchInput"
                @change="changeIpt"
              >
                <i slot="suffix" class="el-icon-search el-input__icon" />
              </el-input>
            </el-tooltip>
          </div>
        </div>
        <el-table ref="table" :data="tableData" border class="commonTable">
          <el-table-column
            prop="powerName"
            label="服务名称"
            min-width="110"
            align="center"
          >
            <template slot-scope="scope">
              <span class="slat slat2" @click="goDetail(scope.row)">
                {{ scope.row.powerName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="分类" width="140" align="center">
            <template slot-scope="scope1">
              <span>{{ scope1.row.type | filterChange }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="documentLink"
            label="接口文档地址"
            align="center"
          >
            <template slot-scope="scope">
              <el-tooltip
                popper-class="projectTooltip"
                :content="scope.row.documentLink"
                placement="top"
              >
                <span
                  class=""
                  :class="
                    scope.row.documentLink !== '' &&
                    scope.row.documentLink !== '--'
                      ? 'slat slat2'
                      : ''
                  "
                  @click="goLink(scope.row.documentLink)"
                >
                  {{ scope.row.documentLink | splitLink }}
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            width="180"
            align="center"
          />
          <el-table-column
            prop="updateTime"
            label="更新时间"
            width="180"
            align="center"
          />
          <el-table-column
            prop="deliveryMode"
            label="交付方式"
            align="center"
          />

          <el-table-column label="状态" align="center">
            <template slot-scope="scope1">
              <span
                v-if="scope1.row.status == '0'"
                class=""
                style="color: #d9001b;"
              >
                禁用
              </span>
              <span
                v-if="scope1.row.status == '1'"
                class=""
                style="color: #70b603;"
              >
                启用
              </span>
              <span
                v-if="scope1.row.status == '2'"
                class=""
                style="color: #909399;"
              >
                禁用待生效
              </span>
            </template>
          </el-table-column>

          <el-table-column width="200" label="操作" align="center">
            <template slot-scope="scope2">
              <el-tag
                class="tag"
                v-if="showComputed('resourceDetail')"
                @click="goDetail(scope2.row)"
              >
                详情
              </el-tag>
              <el-tag
                v-if="scope2.row.status == 1"
                class="tag"
                type="warning"
                @click="updateStatus('0', scope2.row)"
              >
                禁用
              </el-tag>
              <el-tag
                v-if="scope2.row.status == 0"
                class="tag"
                type="success"
                @click="updateStatus('1', scope2.row)"
              >
                启用
              </el-tag>
              <el-tag
                v-if="scope2.row.status == 2"
                class="tag"
                type="info"
                @click="updateStatus('2', scope2.row)"
              >
                取消禁用
              </el-tag>
              <el-tag
                v-if="scope2.row.status == 0"
                class="tag"
                type="danger"
                @click="delList(scope2.row)"
              >
                删除
              </el-tag>
            </template>
          </el-table-column>
        </el-table>

        <el-dialog title="提示" :visible.sync="dialogVisible">
          <span>是否确认删除，删除后不可撤回</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="sureDel">确 定</el-button>
          </span>
        </el-dialog>

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
  </div>
</template>

<script>
import { mapList } from '@/utils/public'
import {
  powerList,
  updatePowerPoolStatus,
  deletePowerPool,
} from '@/api/capacityApi'
export default {
  components: {},
  filters: {
    splitLink(val) {
      if (val) {
        if (val.length > 40) {
          return val.substring(0, 40) + '...'
        } else {
          return val
        }
      } else {
        return val
      }
    },
    filterChange(val) {
      if (val) {
        if (val === '1') {
          return '基础能力类'
        }
      } else {
        return '--'
      }
    },
  },
  data() {
    return {
      dialogVisible: false,
      currentPage: 1, // 当前页 刷新后默认显示第一页
      pageSize: 10, // 每一页显示的数据量 此处每页显示6条数据
      totalList: 0,
      crowdName: '',
      tableData: [],
      tableData2: [],
      linkTxt: '关联服务',
      popupIndex: 1,
      powerId2: '', // 资源id
    }
  },
  created() {
    this.tableData2 = this.tableData
    this.getList()
  },
  methods: {
    // 接口文档地址跳转
    goLink(url) {
      if (url !== '' && url !== '--') {
        window.open(url)
      }
    },
    // 获取资源列表
    getList(isPage) {
      if (isPage !== true) {
        this.currentPage = 1
      }
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        powerName: this.crowdName,
      }
      powerList(params).then((res) => {
        if (res.data.code === '0') {
          const data_ = res.data.data
          this.tableData = data_.records
          mapList(this.tableData)
          // localStorage.setItem('resourceList',JSON.stringify(this.tableData))
          this.totalList = Number(data_.total)
        }
      })
    },
    // 启用禁用状态更新
    updateStatus(num, row) {
      let txt = ''
      let statusNum = '0'
      if (num === '0') {
        txt =
          '该操作将在次日生效，生效后会影响关联了该服务的项目以及客户，请确认是否禁用?'
        statusNum = '0'
      } else if (num === '1') {
        txt = '请确认是否启用?'
        statusNum = '1'
      } else if (num === '2') {
        txt = '请确认是否取消禁用?'
        statusNum = '1'
      }
      const params = {
        powerId: row.powerId,
        status: statusNum,
      }

      this.$confirm(txt, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        lockScroll: false,
      })
        .then(() => {
          updatePowerPoolStatus(params).then((res) => {
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
    // 展开抽屉表格
    toogleExpand(row) {},
    // 跳转至资源详情
    goDetail(row) {
      this.$router.push({
        path: '/resourceManagement/resourceDetail',
        query: { powerId: row.powerId, powerName: row.powerName },
      })
    },
    // 新建
    add() {
      this.$router.push('/resourceManagement/newResource')
    },
    // 搜索-
    changeIpt(e) {
      this.crowdName = e
      this.getList()
    },
    // 删除
    delList(row) {
      this.powerId2 = row.powerId
      this.dialogVisible = true
    },
    // 确认删除
    sureDel(row) {
      const params = {
        powerId: this.powerId2,
      }
      deletePowerPool(params)
        .then((res) => {
          if (res.data.code === '0') {
            this.$message.success('删除成功')
            this.dialogVisible = false
            setTimeout(() => {
              this.getList()
            }, 800)
          }
        })
        .catch((err) => {
          this.dialogVisible = false
        })
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
  min-width: 300px;
  font-size: 14px;
  display: flex;
  align-items: center;

  :nth-child(2) {
    flex: 1;
    margin-left: 7px;
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

  &.slat2 {
    text-decoration: underline;
  }
}

.tag {
  margin: 0 5px;
  cursor: pointer;
}

.exit_ {
  color: #409eff;
  text-decoration: underline;
  cursor: pointer;
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
