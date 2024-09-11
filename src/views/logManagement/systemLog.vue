<!-- 系统日志 -->
<template>
  <div class="table-warpper">
    <!-- 表格展示 -->
    <el-card class="fatherBox">
      <div class="block-content">
        <div class="title flex_">
          <span class="p1">系统日志</span>
          <!-- <p class="p2">东风日产乘用车有限公司-DFN</p> -->
        </div>
        <div class="searchBar flex_">
          <div class="box flex_">
            <p class="p1">接口名称：</p>
            <el-input
              v-model="params.apiName"
              placeholder="请输入接口名称"
              maxlength="50"
              @change="Search2"
            />
          </div>
          <div class="box flex_">
            <p class="p1">appId：</p>
            <el-input
              v-model="params.appId"
              controls-position="none"
              maxlength="20"
              placeholder="请输入appId，限数字"
              @change="Search3"
              @input="restrictInput"
            />
          </div>
          <div class="box flex_">
            <p class="p1">模块：</p>
            <el-input
              v-model="params.module"
              placeholder="请输入模块"
              maxlength="30"
              @change="Search4"
            />
          </div>
        </div>
        <div class="dateGroup flex_">
          <p class="p1">开始时间：</p>
          <el-date-picker
            v-model="params.startTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择开始时间"
            @change="selectDate2"
          />
          <p class="p1">结束时间：</p>
          <el-date-picker
            v-model="params.endTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择结束时间"
            @change="selectDate3"
          />
          <el-button type="primary" class="searchBtn" @click="Search">
            搜索
          </el-button>
          <!-- <el-button type="primary" plain class="searchBtn reset" @click="Reset">重置</el-button> -->
        </div>

        <el-table
          :data="tableData"
          class="commonTable"
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
          border
        >
          <el-table-column
            prop="id"
            label="主键id"
            min-width="110"
            align="center"
          />
          <el-table-column
            prop="threadId"
            label="线程id"
            min-width="110"
            align="center"
          />
          <el-table-column
            prop="module"
            label="能力模块"
            min-width="110"
            align="center"
          />
          <el-table-column
            prop="apiName"
            label="接口名称"
            min-width="110"
            align="center"
          />
          <el-table-column
            prop="appId"
            label="appId"
            min-width="110"
            align="center"
          />
          <el-table-column prop="statusCode" label="http状态码" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.statusCode === '200'" type="success">
                {{ scope.row.statusCode }}
              </el-tag>
              <el-tag v-else type="danger">{{ scope.row.statusCode }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="callResource"
            label="调用来源"
            align="center"
          />
          <el-table-column
            prop="executeTime"
            label="执行时间(秒)"
            width="100"
            align="center"
          />
          <el-table-column
            prop="requestMethod"
            label="请求方式"
            align="center"
          />
          <el-table-column
            prop="requestTime"
            label="请求时间"
            :sortable="true"
            width="150"
            align="center"
          />

          <el-table-column
            prop="urlPath"
            label="请求路径"
            min-width="110"
            align="center"
          />
          <el-table-column
            fixed="right"
            label="操作"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag
                class="tag"
                v-if="showComputed('systemDetail')"
                @click="goDetail(scope.row)"
              >
                详情
              </el-tag>
              <div v-else>--</div>
            </template>
          </el-table-column>
        </el-table>

        <!--分页按钮 prev, pager, next,jumper, ->, total-->
        <el-pagination
          background
          layout="total, prev, pager, next,sizes, jumper"
          :total="totalList"
          :current-page="params.pageNum"
          :page-sizes="[10, 50, 100]"
          :page-size="params.pageSize"
          style="text-align: center;"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
// import _ from 'lodash'
import { mapList } from '@/utils/public'
import { selectSysLogByPage } from '@/api/capacityApi'
export default {
  components: {},
  data() {
    return {
      totalList: 0,
      exitUser: '',
      dateStr: [], // 时间戳
      value1: [],
      activeIndex: null,
      crowdName: '',
      tableData: [],
      options1: [
        {
          value: '1',
          label: '全部',
        },
        {
          value: '2',
          label: '只读',
        },
        {
          value: '3',
          label: '只写',
        },
      ],
      options2: [
        {
          value: '4',
          label: 'LY支付工具',
        },
        {
          value: '5',
          label: '画像中心',
        },
        {
          value: '6',
          label: '话务平台',
        },
      ],
      value2: '',
      params: {
        pageNum: 1, // 当前页 刷新后默认显示第一页
        pageSize: 10, // 每一页显示的数据量 此处每页显示6条数据
        apiName: '', // api名称
        appId: '', // appId
        module: '', // 模块
        startTime: '', // 开始时间
        endTime: '', // 结束时间
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取项目列表
    getList(isPage) {
      isPage
        ? (this.params.pageNum = this.params.pageNum)
        : (this.params.pageNum = 1)
      const params = this.params
      selectSysLogByPage(params).then((res) => {
        if (res.data.code === '0') {
          const data_ = res.data.data
          this.tableData = data_.records

          // 遍历数组中的每个对象
          mapList(this.tableData)
          this.totalList = Number(data_.total)
        }
      })
    },
    // 分页
    handleCurrentChange(currentPage) {
      this.params.pageNum = currentPage // 每次点击分页按钮，当前页发生变化
      this.getList(true)
    },
    // 切换页数
    handleSizeChange(val) {
      this.params.pageSize = val // 每次点击分页按钮，当前页发生变化
      this.getList()
    },
    // 详情
    goDetail(e) {
      this.$router.push({
        path: '/systemLog/systemDetail',
        query: {
          logId: e.id,
        },
      })
    },
    // 操作者搜索
    Search() {
      const d1 = new Date(this.params.startTime) // 开始时间
      const d2 = new Date(this.params.endTime) // 结束时间
      if (!this.params.startTime) {
        this.$message.warning('请选择开始时间')
        return
      }
      if (!this.params.endTime) {
        this.$message.warning('请选择结束时间')
        return
      }
      if (d1 >= d2) {
        this.$message.warning('开始时间必须小于结束时间')
        return
      }
      this.getList()
    },
    // 重置
    Reset() {
      this.params = {
        ...this.params,
        startTime: '',
        endTime: '',
        apiName: '',
        appId: '',
        module: '',
      }
      this.getList()
    },
    // 接口名称搜索
    Search2(e) {
      this.params.apiName = e
      this.getList()
    },
    // appid搜索
    Search3(e) {
      this.params.appId = e
      this.getList()
      // const regex = /^(?!0+(\.0+)?$)\d+$/
      // if (regex.test(e)) {
      //   this.params.appId = e
      //   this.getList()
      // } else {
      //   this.$message.warning('请输入数字')
      //   this.params.appId = ''
      // }
    },
    // 手机号码输入限制
    restrictInput() {
      // 使用正则表达式检查输入
      this.params.appId = this.params.appId.replace(/[^0-9]/g, '') // 只允许数字
      // if (this.params.appId.length > 11) {
      //   this.params.appId = this.params.appId.slice(0, 11) // 限制长度为11位
      // }
    },
    // appid搜索
    Search4(e) {
      this.params.module = e
      this.getList()
    },
    // 选择日期范围
    selectDate(date) {},
    // 选择开始时间
    selectDate2(date) {},
    // 选择结束时间
    selectDate3(date) {},
    // 管理
    handleClick(row) {},
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
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.$router.push('/serviceAuthorization')
        } else {
          return false
        }
      })
    },
    // 获取时间戳
    getTimestamps(date) {
      // date参数表示分钟数
      const currentTimeStamp = Math.floor(Date.now() / 1000) // 当前时间戳（单位：秒）
      const thirtyMinutesAgoTimeStamp = currentTimeStamp - date * 60
      return [thirtyMinutesAgoTimeStamp, currentTimeStamp]
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
    font-weight: 600;
    font-size: 16px;
  }

  .p2 {
    font-size: 14px;
    margin-left: 20px;
    color: #777;
    padding-left: 5px;
    border-left: 2px solid #409eff;
    height: 16px;
    line-height: 16px;
  }
}

.searchBar {
  width: 100%;
  height: auto;
  margin-bottom: 22px;
  padding-left: 15px;
  box-sizing: border-box;

  .box {
    margin-right: 8px;

    .p1 {
      font-size: 14px;
      color: #444;
      margin-left: 10px;
      min-width: 70px;
      text-align: right;
    }

    ::v-deep .el-input {
      width: 220px;
    }
  }
}

.tag {
  cursor: pointer;
}

.dateGroup {
  width: 100%;
  height: auto;
  margin-bottom: 20px;

  .el-button {
    margin-left: 0;
    margin-right: 12px;
    min-width: 90px;
  }

  .p1 {
    font-size: 14px;
    color: #444;
    margin-left: 24px;
    min-width: 60px;
  }
}

.searchBtn {
  margin-left: 30px !important;
  width: 90px;
  height: 36px;

  &.reset {
    margin-left: 0 !important;
  }
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
</style>
