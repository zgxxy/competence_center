<!-- VIN车系查询明细表 -->
<template>
  <div class="table-warpper">
    <!-- 表格展示 -->
    <el-card class="fatherBox">
      <div class="content">
        <p class="title">VIN车系查询明细表</p>
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
            width="180"
          />
          <el-table-column
            prop="projectName"
            label="项目名称"
            align="center"
            width="180"
          />
          <el-table-column
            prop="createTime"
            label="请求时间"
            align="center"
            width="180"
          />
          <el-table-column prop="vin" label="vin" align="center" width="180" />
          <el-table-column
            prop="status"
            label="请求状态"
            align="center"
            width="100"
          >
            <template slot-scope="scope">
              <span
                style="color: #70b603;"
                :style="{
                  color: scope.row.status == '0' ? '#70b603' : '#d9001b',
                }"
              >
                {{ scope.row.status == '0' ? '成功' : '失败' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="mateStatus"
            label="匹配状态"
            align="center"
            width="100"
          >
            <template slot-scope="scope">
              <span
                style="color: #70b603;"
                :style="{
                  color: scope.row.mateStatus == '0' ? '#70b603' : '#d9001b',
                }"
              >
                {{ scope.row.mateStatus == '0' ? '成功' : '失败' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="result"
            label="查询结果"
            align="center"
            min-width="220"
          >
            <template slot-scope="scope">
              <el-tooltip
                popper-class="projectTooltip"
                :content="changeText(scope.row.result)"
                placement="top"
                :disabled="scope.row.result | showTooltip(150)"
              >
                <p class="tips ellipse2">{{ changeText(scope.row.result) }}</p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            align="center"
            min-width="120"
          >
            <template slot-scope="scope">
              <el-tooltip
                popper-class="projectTooltip"
                :content="scope.row.remark"
                placement="top"
                :disabled="scope.row.remark | showTooltip(150)"
              >
                <p class="tips ellipse2">{{ scope.row.remark }}</p>
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
import { getVinCarDetail } from '@/api/capacityApi'
import { replaceAll } from '@/utils'
export default {
  components: {},
  filters: {},
  data() {
    return {
      tableData: [],
      ocrListLength: 0,
      tableParams: {
        appId: '', // appID
        customerId: '', // 客户id
        projectId: '', // 项目id
        dimension: 'day',
        customerName: '', // 客户名称
        projectName: '', // 项目名称
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        pageNum: 1, // 当前页 刷新后默认显示第一页
        pageSize: 10, // 每一页显示的数据量 此处每页显示6条数据
      },
      dateRange: [new Date(), new Date()], // 设置默认开始和结束时间为今天
    }
  },
  created() {
    this.tableParams.appId = this.$route.query.appId
    this.tableParams.startTime = this.$route.query.startTime
    this.tableParams.endTime = this.$route.query.endTime
    this.getVinCarDetail()
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
    // OCR分页
    handleCurrentChange(currentPage) {
      this.tableParams.pageNum = currentPage // 每次点击分页按钮，当前页发生变化
      this.getVinCarDetail(true)
    },
    // 获取OCR报表数据
    getVinCarDetail(isPage) {
      isPage
        ? (this.tableParams.pageNum = this.tableParams.pageNum)
        : (this.tableParams.pageNum = 1)
      const params = this.tableParams
      getVinCarDetail(params).then((res) => {
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
    changeText(val) {
      let res = ''
      let signNum = 0 //通过计算'{'出现的次数判断有几组数据
      if (val && this.isJSON(val)) {
        signNum = val.length - val.replace(/{/g, '').length
        val = JSON.stringify(JSON.parse(val))
      }
      let mapReplace = {
        '{': signNum > 1 ? '【' : '',
        '}': signNum > 1 ? '】' : '',
        '"': '',
        ':': ' : ',
        ',': '，',
        brandId: '品牌ID',
        brandName: '品牌名称',
        modelId: '车型ID',
        modelName: '车型名称',
        seriesId: '车系ID',
        seriesName: '车系名称',
        year: '车型年款',
      }
      res = replaceAll(val, mapReplace)
      res = res.replace(/\[|\]/g, '')
      return res
    },
    //判断是否为json字符串
    isJSON(str) {
      if (typeof str == 'string') {
        try {
          JSON.parse(str)
          return true
        } catch (e) {
          return false
        }
      }
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
      this.getVinCarDetail()
    },
    Search2(e) {
      this.tableParams.appId = ''
      this.getVinCarDetail()
    },
    Search3(e) {
      this.tableParams.appId = ''
      this.getVinCarDetail()
    },
    // OCR选择日期范围
    // selectDate2(date) {
    //   if (date != null) {
    //     this.tableParams.startTime = date[0]
    //     this.tableParams.endTime = date[1]
    //     this.getVinCarDetail()
    //   } else {
    //     this.tableParams.startTime = ''
    //     this.tableParams.endTime = ''
    //     this.getVinCarDetail()
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
::v-deep .el-tooltip__popper {
  font-size: 14px;
  width: 200px !important;
}
</style>
