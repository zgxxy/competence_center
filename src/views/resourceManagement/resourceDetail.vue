<!-- 资源详情 -->
<template>
  <div class="table-warpper">
    <!-- 表格展示 -->
    <el-card class="fatherBox">
      <div class="content">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基础信息" name="1">
            <div class="title">基础信息</div>
            <ul class="Lists">
              <li class="lis ellipse">
                产品/服务名称：
                <span class="sp">{{ dataObj.powerName }}</span>
              </li>
              <li class="lis ellipse">
                产品/服务ID：
                <span class="sp">{{ dataObj.powerId }}</span>
              </li>
              <li class="lis ellipse">
                产品/服务分类：
                <span class="sp">{{ dataObj.type | filterType }}</span>
              </li>
              <li class="lis ellipse">
                上架时间：
                <span class="sp">{{ dataObj.createTime }}</span>
              </li>
              <li class="lis ellipse">
                有效期限：
                <span class="sp">长期</span>
              </li>
              <li class="lis ellipse flex_">
                接口文档地址：
                <el-tooltip
                  v-if="dataObj.documentLink"
                  popper-class="projectTooltip"
                  class="item"
                  effect="dark"
                  :content="dataObj.documentLink"
                  placement="top"
                >
                  <span
                    class="sp slat flex_ ellipse"
                    @click="goLink(dataObj.documentLink)"
                  >
                    {{ dataObj.documentLink }}
                  </span>
                </el-tooltip>

                <span v-else class="sp" @click="goLink(dataObj.documentLink)">
                  --
                </span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="修改"
                  placement="right"
                >
                  <i
                    class="el-icon-edit el-icon"
                    @click="dialogTableVisible = true"
                  />
                </el-tooltip>
              </li>
            </ul>

            <el-dialog
              width="50%"
              title="修改资源信息"
              :visible.sync="dialogTableVisible"
              @close="dialogTableVisible = false"
            >
              <div class="popup">
                <el-form
                  ref="ruleForm"
                  :model="ruleForm"
                  :rules="rules"
                  label-width="100px"
                  class="demo-ruleForm"
                >
                  <el-form-item label="接口文档地址" prop="documentLink">
                    <el-input
                      v-model="ruleForm.documentLink"
                      placeholder="请输入接口文档地址"
                    />
                    <br />
                    <p class="small">
                      文档地址需http或者https开头的格式，例如
                      <span class="sp">https://www.xxxxx.com</span>
                    </p>
                  </el-form-item>

                  <el-form-item
                    style="
                      padding-left: 100px;
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
          </el-tab-pane>

          <el-tab-pane v-if="showLog" label="用量信息" name="2">
            <div class="title">总业务量趋势</div>
            <div class="dateGroup flex_">
              <p class="sp">统计粒度</p>
              <el-button
                v-for="(item, index) in btnList"
                :key="index"
                :type="activeIndex == index ? 'primary' : ''"
                :plain="activeIndex == index"
                @click="changeDate(index)"
              >
                {{ item }}
              </el-button>
              <p class="p1">自定义时间：</p>
              <el-date-picker
                v-model="value1"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :unlink-panels="true"
                @change="selectDate"
              />
            </div>

            <div id="myChart" ref="myChart" style="height: 300px;" />
            <div class="title">供应商列表</div>

            <div class="dateGroup flex_">
              <p class="sp">项目名称：</p>
              <el-input
                v-model="projectName"
                placeholder="请输入项目名称"
                maxlength="30"
                class="searchInput"
                @change="changeIpt1"
              >
                <i slot="suffix" class="el-icon-search el-input__icon" />
              </el-input>
              <p class="sp">客户名称：</p>
              <el-input
                v-model="customerName"
                placeholder="请输入客户名称"
                maxlength="30"
                class="searchInput"
                @change="changeIpt2"
              >
                <i slot="suffix" class="el-icon-search el-input__icon" />
              </el-input>
              <p class="p1">时间筛选：</p>
              <el-date-picker
                v-model="value1"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="selectDate"
              />
            </div>

            <el-table :data="tableData" border style="width: 100%;">
              <el-table-column
                prop="customerId"
                label="客户ID"
                align="center"
              />
              <el-table-column
                prop="customerName"
                label="客户名"
                align="center"
              />
              <el-table-column
                prop="projectName"
                label="项目名"
                align="center"
              />
              <el-table-column
                prop="totalCallCount"
                label="总调用次数"
                align="center"
              />
              <el-table-column
                prop="totalFeeCount"
                label="总收费数"
                align="center"
              />
              <el-table-column
                prop="totalSplitCount"
                label="总分片数"
                align="center"
              />
            </el-table>

            <!--分页按钮 prev, pager, next,jumper, ->, total-->
            <el-pagination
              background
              layout="total, prev, pager, next, jumper"
              :total="ocrlList"
              :current-page="currentPage"
              :page-size="pageSize"
              style="text-align: center;"
              @current-change="handleCurrentChange"
            />
          </el-tab-pane>

          <el-tab-pane
            v-if="powerName === 'OCR文字识别'"
            label="OCR文字识别"
            name="3"
          >
            <p class="title">客户分业务类别统计表</p>
            <ocr
              :ocr-params="ocrParams"
              :link-list="linkList"
              :ocr-list-length="ocrListLength"
              :table-data2="tableData2"
              :statistics="statistics"
              @selectDate2="selectDate2"
              @selectStatistics="selectStatistics"
              @handleCurrentChange2="handleCurrentChange2"
              @Search2_="Search2"
              @Search3_="Search3"
              @Search4_="Search4"
              @exportFile_="exportFile(1)"
            />
          </el-tab-pane>
          <el-tab-pane v-if="powerName === '短信'" label="短信" name="4">
            <p class="title">合计</p>
            <el-table :data="totalNum" border style="width: 100%;">
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
              <el-table-column
                prop="feedbackRate"
                label="回执率"
                align="center"
              />
            </el-table>

            <p class="title" style="margin-top: 30px;">统计总表</p>
            <sms
              :sms-params="smsParams"
              :link-list2="linkList2"
              :sms-list-length="smsListLength"
              :table-data3="tableData3"
              :statistics2="statistics2"
              @selectDate3="selectDate3"
              @selectStatistics2="selectStatistics2"
              @handleCurrentChange3="handleCurrentChange3"
              @Search7="Search5"
              @Search6="Search6"
            />
          </el-tab-pane>
          <el-tab-pane
            v-if="powerName === 'VIN车系查询'"
            label="VIN车系查询"
            name="5"
          >
            <p class="title">VIN车系查询签名报表</p>
            <vin
              :vin-params="vinParams"
              :link-list="linkList"
              :vin-list-length="vinListLength"
              :table-data4="tableData4"
              :statistics="statistics"
              @selectDate4="selectDate4"
              @selectStatistics="selectStatistics"
              @handleCurrentChange4="handleCurrentChange4"
              @vinSearch1="vinSearch1"
              @vinSearch2="vinSearch2"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
import sms from '@/components/powerList/smsList'
import ocr from '@/components/powerList/ocrList'
import vin from '@/components/powerList/vinList'
import * as echarts from 'echarts'
import { mapList, getDate_ } from '@/utils/public'
import {
  powerDetail,
  getSmsStatisticsData,
  getOcrList,
  getSmsListPage,
  updatePowerPoolEntity,
  getVinCarDataByPage,
  exportOcrStatisticsData,
} from '@/api/capacityApi'
import { downloadFile } from '@/utils/file'
export default {
  components: {
    sms,
    ocr,
    vin,
  },
  filters: {
    filterType(val) {
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
    const validateDocumentLink = (rule, value, callback) => {
      const regex = /^(https?)/i
      if (regex.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的文档地址'))
      }
    }
    return {
      dialogTableVisible: false,
      statistics: '1',
      statistics2: '1',
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
      linkList2: [
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
      powerName: '', // 资源名
      showLog: false,
      currentPage: 1, // 当前页 刷新后默认显示第一页
      pageNum: 1, // 当前页 刷新后默认显示第一页
      pageSize: 10, // 每一页显示的数据量 此处每页显示10条数据
      ocrListLength: 0,
      smsListLength: 0,
      vinListLength: 0,
      totalList: 0,
      projectName: '', // 项目名称
      customerName: '', // 客户名称
      powerId: '', // 资源id
      activeName: '1',
      btnList: ['日', '周', '月'],
      ruleForm: {
        documentLink: '',
      },
      rules: {
        documentLink: [
          { required: true, message: '请输入接口文档地址', trigger: 'blur' },
          {
            required: true,
            message: '',
            trigger: 'change',
            validator: validateDocumentLink,
          },
        ],
      },
      tableData: [],
      gridData1: [
        {
          name1: '每日互动科技有限公司',
          name2: '正常',
          name3: 'API',
          name4: '2022-10-10 20:30:30',
          name5: '按ID收费',
          name6: '0.02',
          name7: '先付费',
          name8: '张良/13532156286',
          name9: '-',
          name10: 'http://pan.ge..',
          name11: 'Key: OH384...',
        },
        {
          name1: '每日互动科技有限公司',
          name2: '正常',
          name3: 'API',
          name4: '2022-10-10 20:30:30',
          name5: '按ID收费',
          name6: '0.02',
          name7: '先付费',
          name8: '张良/13532156286',
          name9: '-',
          name10: 'http://pan.ge..',
          name11: 'Key: OH384...',
        },
      ],
      tableData2: [],
      tableData3: [],
      tableData4: [], // vin报表
      options1: [
        {
          value: '1',
          label: '月',
        },
        {
          value: '2',
          label: '季',
        },
        {
          value: '3',
          label: '年',
        },
      ],
      vinParams: {
        appId: '', // appID
        customerId: '', // 客户id
        projectId: '', // 项目id
        dimension: 'day',
        customerName: '', // 客户名称
        projectName: '', // 项目名称
        startDate: '', // 开始时间
        endDate: '', // 结束时间
        pageNum: 1, // 当前页 刷新后默认显示第一页
        pageSize: 10, // 每一页显示的数据量 此处每页显示6条数据
      },
      ocrParams: {
        dimension: 'day',
        customerName: '', // 客户名称
        projectName: '', // 项目名称
        startDate: '', // 开始时间
        endDate: '', // 结束时间
        ocrType: '', // ocr类别
        pageNum: 1, // 当前页 刷新后默认显示第一页
        pageSize: 10, // 每一页显示的数据量 此处每页显示6条数据
      },
      smsParams: {
        dimension: 'day',
        customerName: '', // 客户名称
        projectName: '', // 项目名称
        startDate: '', // 开始时间
        endDate: '', // 结束时间
        pageNum: 1, // 当前页 刷新后默认显示第一页
        pageSize: 10, // 每一页显示的数据量 此处每页显示6条数据
      },
      dimension1: '',
      totalNum: [], // 短信合计
      value1: '',
      activeIndex: 0,
      dateStr: [], // //时间戳
      options: {},
      dataObj: {},
      dateRange: [], // 日期范围
      dateRange2: [
        new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      ], // OCR日期范围
      dateRange3: [
        new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      ], // 短信日期范围
    }
  },
  created() {
    // this.getSmsStatisticsData()
    this.powerId = this.$route.query.powerId
    this.powerName = this.$route.query.powerName
    if (this.$route.meta.id) {
      this.powerId = this.$route.meta.id
    }
    this.ocrParams.startDate = getDate_()
    this.ocrParams.endDate = getDate_()
    this.smsParams.startDate = getDate_()
    this.smsParams.endDate = getDate_()
    this.vinParams.startDate = getDate_()
    this.vinParams.endDate = getDate_()
    if (this.powerId) {
      this.getData()
    }
  },
  mounted() {},
  methods: {
    selectStatistics(e, text) {
      this.statistics = text
    },
    selectStatistics2(e, text) {
      this.statistics2 = text
    },
    // 接口文档地址跳转
    goLink(url) {
      if (url !== '' && url !== '--') {
        window.open(url)
      }
    },
    // 更新资源信息
    updatePowerPoolEntity() {
      const params = {
        documentLink: this.ruleForm.documentLink,
        powerId: this.powerId,
        powerName: '',
      }
      updatePowerPoolEntity(params).then((res) => {
        if (res.data.code === '0') {
          this.$message({
            type: 'success',
            message: '修改成功',
          })
          this.dialogTableVisible = false
          setTimeout(() => {
            this.getData()
          }, 800)
        }
      })
    },
    // 分页
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage // 每次点击分页按钮，当前页发生变化
    },
    // OCR分页
    handleCurrentChange2(currentPage) {
      this.ocrParams.pageNum = currentPage // 每次点击分页按钮，当前页发生变化
      this.getOcrList(true)
    },
    // 短信分页
    handleCurrentChange3(currentPage) {
      this.smsParams.pageNum = currentPage // 每次点击分页按钮，当前页发生变化
      this.getSmsListPage(true)
    },
    // vin分页
    handleCurrentChange4(currentPage) {
      this.vinParams.pageNum = currentPage // 每次点击分页按钮，当前页发生变化
      this.getVinCarDataByPage(true)
    },
    // 搜索项目名
    changeIpt1(e) {
      this.projectName = e
      this.getSmsStatisticsData()
    },
    // 搜索客户名
    changeIpt2(e) {
      this.customerName = e
      this.getSmsStatisticsData()
    },
    // 提交修改
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updatePowerPoolEntity()
        } else {
          return false
        }
      })
    },
    // 获取详情数据
    getData() {
      const params = {
        powerId: this.powerId,
      }
      powerDetail(params).then((res) => {
        if (res.data.code === '0') {
          const data_ = res.data.data
          this.dataObj = data_
        }
      })
    },
    // 获取短信使用量
    getSmsStatisticsData() {
      const params = {
        customerName: this.customerName,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        projectName: this.projectName,
        startDate: this.dateRange[0],
        endDate: this.dateRange[1],
      }
      getSmsStatisticsData(params).then((res) => {
        if (res.data.code === '0') {
          const data_ = res.data.data
          this.tableData = data_.records
          this.totalList = Number(data_.total)
        }
      })
    },
    getOptions() {
      var chartDom = document.getElementById('myChart')
      var myChart = echarts.init(chartDom)
      var option
      option = {
        xAxis: {
          type: 'category',
          data: [
            '1月1号',
            '1月2号',
            '1月3号',
            '1月4号',
            '1月5号',
            '1月6号',
            '1月7号',
            '1月8号',
            '1月9号',
            '1月10号',
          ],
        },
        grid: {
          left: '3%',
          right: '3%',
          top: '3%',
          bottom: '3%',
          containLabel: true,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [1, 2, 5, 7, 16, 15, 13, 10, 3, 12],
            type: 'line',
            smooth: true,
            symbolSize: 6, // 设定实心点的大小
            itemStyle: {
              normal: {
                color: '#409EFF', // 改变折线点的颜色
                lineStyle: {
                  color: '#409EFF', // 改变折线颜色
                },
              },
            },
          },
        ],
      }

      option && myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    // tab切换
    handleClick(tab) {
      const num = Number(tab.index)
      if (num === 1 && this.powerName === 'OCR文字识别') {
        // OCR文字识别
        this.getOcrList()
      }
      if (num === 1 && this.powerName === '短信') {
        // 短信
        this.getSmsListPage()
      }
      if (num === 1 && this.powerName === 'VIN车系查询') {
        // VIN车系查询
        this.getVinCarDataByPage()
      }
    },
    // 获取OCR报表数据
    getOcrList(isPage) {
      isPage
        ? (this.ocrParams.pageNum = this.ocrParams.pageNum)
        : (this.ocrParams.pageNum = 1)
      const params = this.ocrParams
      getOcrList(params).then((res) => {
        if (res.data.code === '0') {
          const data_ = res.data.data
          this.tableData2 = data_.records
          this.ocrListLength = Number(data_.total)
          mapList(this.tableData2)
        }
      })
    },
    // 获取VIN报表数据
    getVinCarDataByPage(isPage) {
      isPage
        ? (this.vinParams.pageNum = this.vinParams.pageNum)
        : (this.vinParams.pageNum = 1)
      const params = this.vinParams
      getVinCarDataByPage(params).then((res) => {
        if (res.data.code === '0') {
          const data_ = res.data.data
          this.tableData4 = data_.records
          this.vinListLength = Number(data_.total)
          mapList(this.tableData4)
        }
      })
    },
    // 获取短信报表数据
    getSmsListPage(isPage) {
      isPage
        ? (this.smsParams.pageNum = this.smsParams.pageNum)
        : (this.smsParams.pageNum = 1)
      const params = this.smsParams
      getSmsListPage(params).then((res) => {
        if (res.data.code === '0') {
          const data_ = res.data.data.pageData
          this.totalNum = res.data.data.totalNum
          this.tableData3 = data_.records
          this.smsListLength = Number(data_.total)

          mapList(this.tableData3)
        }
      })
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
    // 明细
    seeDetail(row) {
      this.$router.push('/projectManagement/usingWater')
    },
    // 查看
    seeDetail2(row) {
      // this.$router.push('/usingWater')
    },
    // 选择日期范围
    selectDate(date) {
      this.dateRange = date

      this.startDate = this.dateRange[0]
      this.endDate = this.dateRange[1]
      this.getSmsStatisticsData()
    },
    // OCR选择日期范围
    selectDate2(date) {
      if (this.statistics === '1') {
        this.ocrParams.dimension = 'day'
        if (date != null) {
          this.ocrParams.startDate = date[0]
          this.ocrParams.endDate = date[1]
          this.getOcrList()
        } else {
          this.ocrParams.startDate = ''
          this.ocrParams.endDate = ''
          this.getOcrList()
        }
      } else if (this.statistics === '2') {
        this.ocrParams.dimension = 'month'
        this.ocrParams.startDate = date[0] + '-01'
        this.ocrParams.endDate = this.getLastDayOfMonth(date[1])
        this.getOcrList()
      }
    },
    // 短信选择日期范围
    selectDate3(date) {
      if (this.statistics2 === '1') {
        this.smsParams.dimension = 'day'
        if (date != null) {
          this.smsParams.startDate = date[0]
          this.smsParams.endDate = date[1]
          this.getSmsListPage()
        } else {
          this.smsParams.startDate = ''
          this.smsParams.endDate = ''
          this.getSmsListPage()
        }
      } else if (this.statistics2 === '2') {
        this.smsParams.dimension = 'month'
        this.smsParams.startDate = date[0] + '-01'
        this.smsParams.endDate = this.getLastDayOfMonth(date[1])
        this.getSmsListPage()
      }
    },
    // vin选择日期范围
    selectDate4(date) {
      if (this.statistics === '1') {
        this.vinParams.dimension = 'day'
        if (date != null) {
          this.vinParams.startDate = date[0]
          this.vinParams.endDate = date[1]
          this.getVinCarDataByPage()
        } else {
          this.vinParams.startDate = ''
          this.vinParams.endDate = ''
          this.getVinCarDataByPage()
        }
      } else if (this.statistics === '2') {
        this.vinParams.dimension = 'month'
        this.vinParams.startDate = date[0] + '-01'
        this.vinParams.endDate = this.getLastDayOfMonth(date[1])
        this.getVinCarDataByPage()
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
    // 选择日期
    changeDate(index) {
      if (index === 0) {
        this.activeIndex = 0
      } else if (index === 1) {
        this.activeIndex = 1
      } else if (index === 2) {
        this.activeIndex = 2
      } else if (index === 3) {
        this.activeIndex = 3
      }
    },
    // OCR客户名称搜索
    Search2(e) {
      this.ocrParams.customerName = e
      this.getOcrList()
    },
    // OCR项目名称搜索
    Search3(e) {
      this.ocrParams.projectName = e
      this.getOcrList()
    },
    // OCR类别搜索
    Search4(e) {
      this.ocrParams.ocrType = e
      this.getOcrList()
    },
    // 短信客户名称搜索
    Search5(e) {
      this.smsParams.customerName = e
      this.getSmsListPage()
    },
    // 短信项目名称搜索
    Search6(e) {
      this.smsParams.projectName = e
      this.getSmsListPage()
    },
    // vin客户名称搜索
    vinSearch1(e) {
      this.vinParams.customerName = e
      this.getVinCarDataByPage()
    },
    // vin项目名称搜索
    vinSearch2(e) {
      this.vinParams.projectName = e
      this.getVinCarDataByPage()
    },
    exportFile(type) {
      switch (type) {
        case 1:
          exportOcrStatisticsData(this.vinParams).then((res) => {
            const resData = res.data
            if (resData.size == 0) {
              this.$message.warning('暂无下载文件')
              return
            }
            downloadFile(
              res,
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTzF-8;',
            ).then((e) => {
              if (e.code !== 200) {
                this.$message.error(`${e.msg}`)
              }
            })
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

.box2 {
  margin-right: 25px;
  padding-left: 15px;
  box-sizing: border-box;
  margin: 12px 0;

  .p1 {
    font-size: 15px;
    color: #444;
    min-width: 60px;
  }
}

#myChart {
  margin-bottom: 18px;
}

.addBtn {
  margin: 18px 0;
}

.content {
  width: 100%;
  height: auto;
  padding: 0 0 30px 10px;
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

  .smallTitle {
    margin-top: 12px;
    margin-left: 12px;
  }

  .Lists3 {
    width: 100%;
    height: auto;
    padding: 22px;
    box-sizing: border-box;

    .li {
      margin-bottom: 15px;

      .p1 {
        font-size: 14px;
        color: #999;
        min-width: 60px;
      }

      .p2 {
        font-size: 14px;
        color: #222;
        margin-left: 15px;
      }

      .icon {
        margin: 0 15px;
      }
    }
  }

  .tableBox {
    padding: 12px;
    box-sizing: border-box;
  }

  .Lists {
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding-bottom: 5px;

    .lis {
      width: 50%;
      height: auto;
      padding: 10px 20px;
      box-sizing: border-box;
      font-size: 14px;
      color: #999;

      .sp {
        color: #222;
      }

      .slat {
        color: #409eff;
        margin: 0 6px;
        cursor: pointer;
        max-width: 40%;

        &.slat2 {
          text-decoration: underline;
        }
      }

      ::v-deep .el-icon {
        font-size: 16px;
        color: #444;
        margin-left: 8px;
        cursor: pointer;
      }
    }

    &.Lists2 {
      padding-top: 12px;

      .lis {
        width: 33.3333%;
      }
    }
  }

  ::v-deep .el-form-item {
    display: flex;
    align-items: center;

    .el-form-item__label {
      text-align: left;
      width: 80px !important;
    }

    .el-form-item__content {
      margin-left: 10px !important;
      width: 40%;
      display: flex;
      align-items: center;
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

.tag {
  margin: 0 5px;
  cursor: pointer;
}

.dateGroup {
  width: 100%;
  height: auto;
  margin: 20px 0;

  .el-button {
    margin-left: 0;
    margin-right: 12px;
    min-width: 90px;
  }

  .el-date-editor {
    height: 32px;
  }

  .p1 {
    font-size: 14px;
    color: #444;
    margin-left: 12px;
  }

  .sp {
    font-size: 14px;
    color: #444;
    margin-right: 2px;
  }

  .el-input--medium {
    width: 200px;
    margin-right: 20px;
  }
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
      margin-left: 10px;
      min-width: 70px;
    }

    .el-input {
      width: 200px !important;
    }
  }
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
      align-items: flex-start;

      .el-form-item__label {
        text-align: left;
        width: 100px !important;
        color: #666;
      }

      .el-form-item__content {
        margin-left: 10px !important;
        width: 60%;
        display: block;

        .el-select {
          width: 100%;
        }
      }

      .small {
        font-size: 12px;
        color: #999;
        padding-left: 10px;
        line-height: 18px;
        margin-top: 8px;

        .sp {
          font-weight: 500;
          color: #222;
          margin-left: 3px;
          text-decoration: underline;
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
::v-deep .el-tabs__item {
  font-size: 16px;
}
</style>
