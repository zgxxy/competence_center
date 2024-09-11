<!-- 短信服务 -->
<template>
  <div class="table-warpper">
    <!-- 表格展示 -->
    <el-card class="fatherBox">
      <div class="content">
        <p class="title">统计总表</p>
        <div class="searchBar flex_">
          <div class="box flex_">
            <p class="p1">时间区间：</p>
            <el-date-picker
              v-model="dateRange"
              :value-format="statistics === '1' ? 'yyyy-MM-dd' : 'yyyy-MM'"
              :format="statistics === '1' ? 'yyyy-MM-dd' : 'yyyy-MM'"
              :type="statistics === '1' ? 'daterange' : 'monthrange'"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :unlink-panels="true"
              :picker-options="
                statistics === '1'
                  ? dateRangePickerOptions
                  : dateRangePickerOptions2
              "
              @change="selectDate"
            />
          </div>
          <div class="box flex_">
            <p class="p1">统计粒度：</p>
            <el-select
              v-model="statistics"
              class="el-select2"
              filterable
              placeholder="请选择"
              @change="selectStatistics"
            >
              <el-option
                v-for="item in linkList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
        </div>
        <div class="searchBar flex_">
          <div class="box flex_">
            <p class="p1">客户名称：</p>
            <el-input
              v-model="smsParams.customerName"
              placeholder="请输入客户名称"
              @change="Search1"
            />
          </div>
          <div class="box flex_">
            <p class="p1">项目名称：</p>
            <el-input
              v-model="smsParams.projectName"
              placeholder="请输入项目名称"
              @change="Search2"
            />
          </div>
          <div class="box flex_">
            <p class="p1">签名：</p>
            <el-input
              v-model="smsParams.signName"
              placeholder="请输入签名"
              @change="Search3"
            />
          </div>
        </div>
        <el-table :data="tableData" border style="width: 100%;">
          <el-table-column prop="customerName" label="客户名" align="center" />
          <el-table-column prop="projectName" label="项目名" align="center" />
          <el-table-column prop="signName" label="签名" align="center" />
          <template v-if="smsParams.dimension === 'month'">
            <el-table-column
              prop="statisticsYear"
              label="统计年份"
              align="center"
            />
            <el-table-column
              prop="statisticsMonth"
              label="统计月份"
              align="center"
            />
          </template>
          <template v-if="smsParams.dimension === 'day'">
            <el-table-column
              prop="statisticsDate"
              label="统计日期"
              align="center"
            />
          </template>
          <el-table-column
            prop="totalCallCount"
            label="提交总数"
            align="center"
          />
          <el-table-column
            prop="totalCallSuccessCount"
            label="提交成功总数"
            align="center"
          />
          <el-table-column
            prop="totalCallFailCount"
            label="提交失败总数"
            align="center"
          />
          <el-table-column
            prop="totalSplitCount"
            label="拆分总数"
            align="center"
          />
          <el-table-column
            prop="totalDelivrdCount"
            label="发送成功总数"
            align="center"
          />
          <el-table-column
            prop="totalUndeliveredCount"
            label="发送失败总数"
            align="center"
          />
          <el-table-column
            prop="sendingSuccessRate"
            label="发送成功率"
            align="center"
          />
          <el-table-column prop="feedbackRate" label="回执率" align="center" />
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-tag
                class="tag"
                v-if="showComputed('textMessageDetail')"
                @click="goDetail(scope.row)"
              >
                明细
              </el-tag>
              <div v-else>--</div>
            </template>
          </el-table-column>
        </el-table>

        <!--分页按钮 prev, pager, next,jumper, ->, total-->
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          :total="smsListLength"
          :current-page="smsParams.pageNum"
          :page-size="smsParams.pageSize"
          style="text-align: center;"
          @current-change="handleCurrentChange"
        />

        <el-dialog
          width="80%"
          title="业务明细表"
          :visible.sync="dialogTableVisible"
        >
          <div class="dialogBox">
            <div class="searchBar flex_">
              <div class="box flex_">
                <p class="p1">开始时间：</p>
                <el-date-picker
                  v-model="smsDetParams.startTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="选择开始时间"
                />
              </div>
              <div class="box flex_">
                <p class="p1">结束时间：</p>
                <el-date-picker
                  v-model="smsDetParams.endTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="选择结束时间"
                />
                <el-button type="primary" class="searchBtn" @click="Search">
                  搜索
                </el-button>
              </div>
            </div>
            <el-table :data="gridData">
              <el-table-column
                prop="customerName"
                label="客户名"
                align="center"
              />
              <el-table-column prop="mobile" label="手机号" align="center" />
              <el-table-column
                prop="projectName"
                label="项目名"
                align="center"
              />
              <el-table-column prop="signName" label="签名" align="center" />

              <el-table-column prop="content" label="短信内容" align="center">
                <template slot-scope="scope">
                  <p class="p1">{{ scope.row.content | changeText }}</p>
                </template>
              </el-table-column>

              <el-table-column prop="status" label="请求状态" align="center">
                <template slot-scope="scope">
                  <p class="p1">{{ scope.row.status | textChange2 }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="reportStatus"
                label="报告状态"
                align="center"
              >
                <template slot-scope="scope">
                  <p class="p1">{{ scope.row.reportStatus | textChange1 }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="sendingTime"
                label="发送时间"
                align="center"
              />
            </el-table>

            <!--分页按钮 prev, pager, next,jumper, ->, total-->
            <el-pagination
              background
              layout="total, prev, pager, next, jumper"
              :total="smsLogListLength"
              :current-page="smsDetParams.pageNum"
              :page-size="smsDetParams.pageSize"
              style="text-align: center;"
              @current-change="handleCurrentChange2"
            />
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getSmsSecondList, getSmsLogDataByPage } from '@/api/capacityApi'
export default {
  components: {},
  filters: {
    changeText(text) {
      const str = text
      // 使用正则表达式替换第一个中括号及其内部内容
      const result = str.replace(/[\[\]【】].*?[\[\]【】]/, '')
      return result
    },
    textChange1(value) {
      switch (value) {
        case '':
          return '未反馈'
        case 'BLACK':
          return '黑名单'
        case 'NOWAY':
          return '未匹配通道'
        case 'CHECK':
          return '审核不通过'
        case 'SIGN':
          return '签名错误，未报备'
        case 'KEYWORD':
          return '内容含有非法关键词'
        case 'LIMIT':
          return '超发限制'
        case 'PHONERR':
          return '无归属地'
        case 'SWITCH':
          return '通道切出'
        case 'DELIVRD':
          return '反馈成功'
        case 'TDBLACK':
          return '退订黑'
        case 'TSBLACK':
          return '投诉黑'
        case 'RDBLACK':
          return '红名单'
        case 'AICHECK':
          return '智能拦截，一般是发送账号有误'
        case 'INSUFFICIENT_BALANCE':
          return '余额不足'
        case 'UNDELIV':
          return '反馈失败'
        case 'TESTER_DELIVRD':
          return '压测专用码'
        case 'ERRLMSG':
          return 'CMPP长短信异常'
        default:
          return '--' // 如果没有匹配的值，可以返回一个默认值或者空字符串
      }
    },
    textChange2(value) {
      switch (value) {
        case '0':
          return '成功'
        case '-1':
          return '失败'
        case '100001':
          return '鉴权失败'
        case '100002':
          return '必选参数为空'
        case '100003':
          return '参数格式错误'
        case '100004':
          return '系统错误'
        case '100005':
          return 'timestamp过期'
        case '1001':
          return '账号不能为空'
        case '1002':
          return '账号不合法'
        case '1003':
          return 'ip不能为空'
        case '1004':
          return 'ip校验失败'
        case '1005':
          return '密码不能为空'
        case '1006':
          return '密码错误'
        case '1007':
          return '手机号码不能为空或者手机号码位数不正确或者数量过多'
        case '1008':
          return '缺少手机参数'
        case '1009':
          return '扩展必须为数字'
        case '10010':
          return 'msgid长度限制'
        case '10011':
          return '内容为空'
        case '10012':
          return '内容含关键字'
        case '10013':
          return '内容超过系统支持最大长度'
        case '10014':
          return '签名超长或为空'
        case '10016':
          return '余额不足'
        case '10017':
          return '账号已禁用'
        case '10018':
          return '该用户此时间段禁止提交'
        case '10019':
          return '不允许主动获取和主动推送同时调用'
        case '10020':
          return '打包短信错误'
        case '10021':
          return '批量短信数量超限'
        case '10022':
          return '定时短信添加错误'
        case '10023':
          return 'sId过长'
        case '10024':
          return '定时短信时间异常'
        case '10025':
          return '国际短信接口不支持国内号码'
        case '10026':
          return '不支持国际短信'
        default:
          return '--' // 如果没有匹配的值，可以返回一个默认值或者空字符串
      }
    },
  },
  data() {
    return {
      statistics: '1',
      linkList: [
        {
          name: '日',
          id: '1',
        },
        {
          name: '月',
          id: '2',
        },
      ],
      dateRangePickerOptions: {
        disabledDate(time) {
          // 禁用大于今天的日期（包括今天）
          // return time.getTime() > new Date().setHours(0, 0, 0, 0) - 1

          // 获取当前日期
          const today = new Date()
          today.setHours(0, 0, 0, 0) - 1

          // 计算允许选择的最早日期
          const earliestAllowedDate = new Date(
            today.getFullYear(),
            today.getMonth() - 2,
            today.getDate(),
          )

          // 禁用大于今天的日期（包括今天）和在前两个月之外的日期
          return (
            time.getTime() > new Date().setHours(0, 0, 0, 0) - 1 ||
            time.getTime() < earliestAllowedDate.getTime()
          )
        },
      },
      dateRangePickerOptions2: {
        disabledDate: this.handleDisabledDate,
      },
      dateRange: [
        new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      ],
      dialogTableVisible: false,
      tableData: [],
      smsListLength: 0,
      smsLogListLength: 0,
      smsParams: {
        dimension: 'day',
        appId: '',
        customerName: '', // 客户名称
        projectName: '', // 项目名称
        startDate: '', // 开始时间
        endDate: '', // 结束时间
        signName: '', // 签名
        pageNum: 1, // 当前页 刷新后默认显示第一页
        pageSize: 10, // 每一页显示的数据量 此处每页显示6条数据
      },
      smsDetParams: {
        appId: '',
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        pageNum: 1, // 当前页 刷新后默认显示第一页
        pageSize: 10, // 每一页显示的数据量 此处每页显示6条数据
      },
      gridData: [],
    }
  },
  created() {
    console.log('参数', this.$route)
    this.smsParams.appId = this.$route.query.appId
    this.smsParams.startDate = this.$route.query.startTime
    this.smsParams.endDate = this.$route.query.endTime
    this.dateRange = [this.smsParams.startDate, this.smsParams.endDate]
    this.getSmsSecondList()
  },
  mounted() {},
  methods: {
    // 限制只能选择前两个月的日期
    handleDisabledDate(time) {
      const currentMonth = new Date().getMonth() // 当前月份（0 到 11）
      // 获取当前月份的第一天
      const firstDayOfCurrentMonth = new Date(
        new Date().getFullYear(),
        currentMonth,
        1,
      )
      // 获取前两个月的第一天
      const firstDayOfAllowedRange = new Date(
        new Date().getFullYear(),
        currentMonth - 2,
        1,
      )
      return (
        time.getTime() < firstDayOfAllowedRange.getTime() ||
        time.getTime() > firstDayOfCurrentMonth.getTime()
      )
    },
    selectStatistics(e) {
      if (e === '2') {
        this.dateRange = []
      } else {
        this.dateRange = []
      }
    },
    // 明细
    goDetail(row) {
      // const arr = {
      //   appId: row.appId,
      //   signName: row.signName,
      //   startTime: this.smsParams.startDate || row.statisticsDate + ' 00:00:00',
      //   endTime: this.smsParams.endDate || row.statisticsDate + ' 00:00:00'
      // }
      // return
      this.$router.push({
        path:
          '/resourceManagement/resourceDetail/textMessage/textMessageDetail',
        query: {
          appId: row.appId,
          signName: row.signName,
          startTime:
            this.smsParams.startDate || row.statisticsDate + ' 00:00:00',
          endTime: this.smsParams.endDate || row.statisticsDate + ' 23:59:59',
        },
      })
    },
    // 短信分页
    handleCurrentChange(currentPage) {
      this.smsParams.pageNum = currentPage // 每次点击分页按钮，当前页发生变化
    },
    // 短信明细分页
    handleCurrentChange2(currentPage) {
      this.smsDetParams.pageNum = currentPage // 每次点击分页按钮，当前页发生变化
    },
    // 获取短信报表数据
    getSmsSecondList() {
      const params = this.smsParams
      getSmsSecondList(params).then((res) => {
        if (res.data.code === '0') {
          const data_ = res.data.data.pageData
          this.tableData = data_.records
          this.smsListLength = Number(data_.total)

          this.mapList(this.tableData)
        }
      })
    },
    // 获取短信明细
    getSmsLogDataByPage() {
      const params = this.smsDetParams
      getSmsLogDataByPage(params).then((res) => {
        if (res.data.code === '0') {
          const data_ = res.data.data
          this.gridData = data_.records
          this.smsLogListLength = Number(data_.total)

          this.mapList(this.gridData)
        }
      })
    },
    // 时间搜索
    Search() {
      const d1 = new Date(this.smsDetParams.startTime) // 开始时间
      const d2 = new Date(this.smsDetParams.endTime) // 结束时间
      if (!this.smsDetParams.startTime) {
        this.$message.warning('请选择开始时间')
        return
      }
      if (!this.smsDetParams.endTime) {
        this.$message.warning('请选择结束时间')
        return
      }
      if (d1 >= d2) {
        this.$message.warning('开始时间必须小于结束时间')
        return
      }
      this.getSmsLogDataByPage()
    },
    // 遍历数组加默认值
    mapList(list) {
      // 遍历数组中的每个对象
      for (let i = 0; i < list.length; i++) {
        const obj = list[i]

        // 遍历对象的属性
        for (const key in obj) {
          if (
            obj.hasOwnProperty(key) &&
            (obj[key] === '' || obj[key] === null)
          ) {
            obj[key] = '--'
          }
        }
      }
    },
    // 客户名称搜索
    Search1(e) {
      this.smsParams.customerName = e
      this.getSmsSecondList()
    },
    // 客户名称搜索
    Search2(e) {
      this.smsParams.projectName = e
      this.getSmsSecondList()
    },
    // 签名搜索
    Search3(e) {
      this.smsParams.signName = e
      this.getSmsSecondList()
    },
    // 选择日期范围
    selectDate(date) {
      if (this.statistics === '1') {
        this.smsParams.dimension = 'day'
        if (date != null) {
          this.smsParams.startDate = date[0]
          this.smsParams.endDate = date[1]
          this.getSmsSecondList()
        } else {
          this.smsParams.startDate = ''
          this.smsParams.endDate = ''
          this.getSmsSecondList()
        }
      } else if (this.statistics === '2') {
        this.smsParams.dimension = 'month'
        this.smsParams.startDate = date[0] + '-01 00:00:00'
        this.smsParams.endDate = this.getLastDayOfMonth(date[1]) + ' 23:59:59'
        this.getSmsSecondList()
      }
    },
    // 获取月份最后一天
    getLastDayOfMonth(dateString) {
      const [year, month] = dateString.split('-').map(Number) // 将字符串分割并转换为数字
      const lastDay = new Date(year, month, 0).getDate() // 传入年份和月份，Day设为0即为取得上一个月的最后一天

      // 格式化成 YYYY-MM-DD 形式
      const formattedLastDay = `${year}-${month
        .toString()
        .padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`
      return formattedLastDay
    },
  },
}
</script>

<style scoped lang="scss">
.el-card {
  min-height: 80vh;

  .dialogBox {
    width: 100%;
    padding: 12px 25px;
    box-sizing: border-box;
  }
}

.box {
  width: 100%;
  height: auto;
  margin-bottom: 10px;

  .h1 {
    font-size: 18px;
    color: #222;
    font-weight: 600;
  }

  .icon {
    font-size: 20px;
    color: #409eff;
    cursor: pointer;
    font-weight: bold;
    padding: 10px;
    box-sizing: border-box;
  }

  .el-select2 {
    width: 80px;
  }
}

.content {
  width: 100%;
  height: auto;
  padding: 10px 0 30px 10px;
  box-sizing: border-box;

  .title {
    width: 100%;
    height: 35px;
    line-height: 35px;
    border-radius: 2px;
    background: #f1f1f1;
    color: #444;
    padding: 0 15px;
    box-sizing: border-box;
    margin: 10px 0 25px;
  }
}

.tag {
  margin: 0 5px;
  cursor: pointer;
}

.searchBar {
  width: 100%;
  height: auto;
  margin-bottom: 22px;
  padding-left: 15px;
  box-sizing: border-box;

  .box {
    margin-right: 20px;
    width: auto;

    .p1 {
      font-size: 14px;
      color: #444;
      text-align: right;
      padding: 0 10px;
      box-sizing: border-box;
      min-width: 80px;
    }

    .el-input {
      width: 200px !important;
    }

    .searchBtn {
      margin-left: 30px !important;
      height: 36px;
      min-width: 90px;
    }
  }
}
</style>
