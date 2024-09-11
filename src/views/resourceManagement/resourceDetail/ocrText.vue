<!-- OCR服务 -->
<template>
  <div class="table-warpper">
    <!-- 表格展示 -->
    <el-card class="fatherBox">
      <div class="content">
        <p class="title">业务类别明细表</p>
        <div class="searchBar flex_ searchBar2">
          <div class="box flex_">
            <p class="p1">客户名称：</p>
            <el-input
              v-model="tableParams.customerName"
              maxlength="30"
              placeholder="请输入客户名称"
              clearable
              @change="Search2"
            />
          </div>
          <div class="box flex_">
            <p class="p1">项目名称：</p>
            <el-input
              v-model="tableParams.projectName"
              maxlength="30"
              placeholder="请输入项目名称"
              clearable
              @change="Search3"
            />
          </div>
        </div>
        <div class="searchBar flex_">
          <div class="box flex_">
            <p class="p1">开始时间：</p>
            <el-date-picker
              v-model="tableParams.startTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择开始时间"
            />
          </div>
          <div class="box flex_">
            <p class="p1">结束时间：</p>
            <el-date-picker
              v-model="tableParams.endTime"
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

        <el-table :data="tableData" border style="width: 100%;">
          <el-table-column
            prop="customerName"
            label="客户名称"
            align="center"
            width="140"
          />
          <el-table-column
            prop="projectName"
            label="项目名称"
            align="center"
            width="180"
          />
          <!-- <el-table-column prop="appId" label="appId" align="center" width="220" /> -->
          <el-table-column
            prop="createTime"
            label="请求时间"
            width="180"
            align="center"
          />
          <el-table-column
            prop="ocrType"
            label="OCR类别"
            width="150"
            align="center"
          />
          <el-table-column
            prop="result"
            label="识别内容"
            align="center"
            min-width="160"
          >
            <template slot-scope="scope">
              <el-tooltip
                popper-class="projectTooltip"
                :content="changeText(scope.row.result)"
                placement="top"
                :disabled="changeText(scope.row.result) | showTooltip(180)"
              >
                <p class="tips ellipse2">
                  {{ changeText(scope.row.result) }}
                </p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            align="center"
            width="120"
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.status == '成功'"
                class=""
                style="color: #70b603;"
              >
                成功
              </span>
              <span
                v-if="scope.row.status == '失败'"
                class=""
                style="color: #d9001b;"
              >
                失败
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            align="center"
            min-width="160"
          >
            <template slot-scope="scope">
              <el-tooltip
                popper-class="projectTooltip"
                :content="scope.row.remark"
                placement="top"
                :disabled="scope.row.remark | showTooltip(180)"
              >
                <p class="tips ellipse2">
                  {{ scope.row.remark }}
                </p>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <!--分页按钮 prev, pager, next,jumper, ->, total-->
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          :total="ocrListLength"
          :current-page="tableParams.pageNum"
          :page-size="tableParams.pageSize"
          style="text-align: center;"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { getOcrDeatail } from '@/api/capacityApi'
export default {
  components: {},
  filters: {},
  data() {
    return {
      tableData: [],
      ocrListLength: 0,
      tableParams: {
        appId: '',
        pageNum: 1,
        pageSize: 10,
        ocrType: '',
        startTime: '',
        endTime: '',
        customerName: '', // 客户名称
        projectName: '', // 项目名称
      },
      dateRange: [new Date(), new Date()], // 设置默认开始和结束时间为今天
    }
  },
  created() {
    console.log('参数', this.$route)
    this.tableParams.appId = this.$route.query.appId
    this.tableParams.ocrType = this.$route.query.ocrType
    this.tableParams.startTime = this.$route.query.startTime
    this.tableParams.endTime = this.$route.query.endTime
    this.getOcrDeatail()
  },
  mounted() {},
  methods: {
    // 获取今天日期
    getDate() {
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(today.getDate())

      const year = yesterday.getFullYear()
      const month = (yesterday.getMonth() + 1).toString().padStart(2, '0')
      const day = yesterday.getDate().toString().padStart(2, '0')

      const formattedDate = `${year}-${month}-${day}`
      return formattedDate
    },
    changeText(val) {
      let res = ''
      let mapReplace = {
        '{': '',
        '}': '',
        '"': '',
        ':': ' : ',
        ',': '，',
        address: '户籍',
        authority: '发证机关',
        birth: '出生年月日',
        brandModel: '品牌型号',
        cardFrom: '发卡行',
        cardId: '卡号',
        cardType: '卡类型',
        dateIssue: '发证日期',
        enginNumber: '发动机号码',
        holder: '所有人',
        idNum: '身份证号',
        idType: '证件类型',
        name: '姓名',
        nation: '民族',
        natureUse: '使用性质',
        plateNumber: '号牌号码',
        registrationDate: '注册日期',
        sex: '性别',
        validDate: '卡片有效期限',
        vehicleType: '车辆类型',
      }
      if (val && val !== '--') {
        val = JSON.parse(val)
        val = Object.keys(val)
          .filter(
            (key) =>
              val[key] !== null && val[key] !== undefined && val[key] !== '',
          )
          .reduce((acc, key) => ({ ...acc, [key]: val[key] }), {})
        if (val.name) {
          val.name = this.encryptName(val.name)
        }
        if (val.holder) {
          val.holder = this.encryptName(val.holder)
        }
        if (val.idNum) {
          val.idNum = this.encryptId(val.idNum)
        }
        if (val.cardId) {
          val.cardId = this.encryptId(val.cardId)
        }
        val = JSON.stringify(val)
      }
      res = this.replaceAll(val, mapReplace)
      res = res.replace(/\[|\]/g, '')
      if (res == '') {
        res = '--'
      }
      return res
    },
    // OCR分页
    handleCurrentChange(currentPage) {
      this.tableParams.pageNum = currentPage // 每次点击分页按钮，当前页发生变化
      this.getOcrDeatail(true)
    },
    // 获取OCR报表数据
    getOcrDeatail(isPage) {
      isPage
        ? (this.tableParams.pageNum = this.tableParams.pageNum)
        : (this.tableParams.pageNum = 1)
      const params = this.tableParams
      getOcrDeatail(params).then((res) => {
        if (res.data.code === '0') {
          const data_ = res.data.data
          this.tableData = data_.records
          this.ocrListLength = Number(data_.total)

          // 遍历数组中的每个对象
          for (let i = 0; i < this.tableData.length; i++) {
            const obj = this.tableData[i]

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
        }
      })
    },
    // 时间搜索
    Search() {
      const d1 = new Date(this.tableParams.startTime) // 开始时间
      const d2 = new Date(this.tableParams.endTime) // 结束时间
      if (!this.tableParams.startTime) {
        this.$message.warning('请选择开始时间')
        return
      }
      if (!this.tableParams.endTime) {
        this.$message.warning('请选择结束时间')
        return
      }
      if (d1 >= d2) {
        this.$message.warning('开始时间必须小于结束时间')
        return
      }
      this.getOcrDeatail()
    },
    Search2(e) {
      this.tableParams.appId = ''
      this.getOcrDeatail()
    },
    Search3(e) {
      this.tableParams.appId = ''
      this.getOcrDeatail()
    },
    // OCR选择日期范围
    // selectDate2(date) {
    //   console.log('date=', date)
    //   if (date != null) {
    //     this.tableParams.startTime = date[0]
    //     this.tableParams.endTime = date[1]
    //     this.getOcrDeatail()
    //   } else {
    //     this.tableParams.startTime = ''
    //     this.tableParams.endTime = ''
    //     this.getOcrDeatail()
    //   }
    // }
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

  .tips {
    margin: 12px;
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

    .searchBtn {
      margin-left: 30px !important;
      height: 36px;
      min-width: 90px;
    }
  }
}
</style>
