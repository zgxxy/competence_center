<!-- 新建客群弹窗 -->
<template>
  <div class="container">
    <div class="searchBar flex_">
      <div class="box flex_">
        <p class="p1">统计粒度：</p>
        <el-select
          v-model="statistics_"
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
      <div class="box flex_">
        <p class="p1">时间区间：</p>
        <el-date-picker
          v-model="dateRange2"
          :value-format="statistics_ === '1' ? 'yyyy-MM-dd' : 'yyyy-MM'"
          :format="statistics_ === '1' ? 'yyyy-MM-dd' : 'yyyy-MM'"
          :type="statistics_ === '1' ? 'daterange' : 'monthrange'"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="
            statistics_ === '1'
              ? dateRangePickerOptions
              : dateRangePickerOptions2
          "
          @change="selectDate2"
        />
      </div>
    </div>
    <div class="searchBar flex_ searchBar2">
      <div v-if="hasShowCustomer" class="box flex_">
        <p class="p1">客户名称：</p>
        <el-input
          v-model="ocrParams.customerName"
          clearable
          maxlength="30"
          placeholder="请输入客户名称"
          @change="Search2"
        />
      </div>
      <div v-if="hasShowProject" class="box flex_">
        <p class="p1">项目名称：</p>
        <el-input
          v-model="ocrParams.projectName"
          clearable
          maxlength="30"
          placeholder="请输入项目名称"
          @change="Search3"
        />
      </div>
      <div class="box flex_">
        <p class="p1">服务名称：</p>
        <el-input
          v-model="ocrParams.ocrType"
          clearable
          maxlength="30"
          placeholder="请输入服务名称"
          @change="Search4"
        />
      </div>
      <!--<el-button type="primary" @click="exportFile">导出</el-button>-->
    </div>
    <el-table
      :data="tableData2"
      :header-cell-style="{ 'text-align': 'center' }"
      :cell-style="{ 'text-align': 'center' }"
      border
      style="width: 100%;"
    >
      <el-table-column prop="customerName" label="客户名称" align="center" />
      <el-table-column prop="projectName" label="项目名称" align="center" />
      <el-table-column prop="ocrType" label="服务名称" align="center" />
      <el-table-column
        :label="ocrParams.dimension == 'day' ? '统计日期' : '统计年月'"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="ocrParams.dimension == 'month'">
            {{ scope.row.statisticsYear }}-{{ scope.row.statisticsMonth }}
          </span>
          <span v-if="ocrParams.dimension == 'day'">
            {{ scope.row.statisticsDate }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="successCount" label="成功次数" align="center" />
      <el-table-column prop="failCount" label="失败次数" align="center" />
      <el-table-column prop="totalCount" label="调用总次数" align="center" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-tag
            class="tag"
            v-if="showComputed('ocrText')"
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
      :total="ocrListLength"
      :current-page="ocrParams.pageNum"
      :page-size="ocrParams.pageSize"
      style="text-align: center;"
      @current-change="handleCurrentChange2"
    />
  </div>
</template>

<script>
import { isDateRangeExceeds60Days, getFirstAndLastDay } from '@/utils/public'
export default {
  name: 'OcrList',
  components: {},
  props: {
    hasShowCustomer: {
      type: Boolean,
      default: true,
    },
    hasShowProject: {
      type: Boolean,
      default: true,
    },
    tableData2: {
      type: Array,
      required: true,
    },
    statistics: {
      type: String,
      default: '1',
    },
    ocrListLength: {
      type: Number,
      required: true,
    },
    linkList: {
      type: Array,
      required: true,
    },
    ocrParams: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      statistics_: this.statistics,
      dateRange2: [
        new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      ], // 短信日期范围
      dateRangePickerOptions: {
        disabledDate(time) {
          // 获取当前日期
          const now = new Date()
          // 如果选择的日期在今天之后，则禁用
          return time.getTime() > now.getTime()
        },
      },
      dateRangePickerOptions2: {
        disabledDate(time) {
          // 获取当前日期
          const now = new Date()
          // 设置当前月份之后的月份不可选
          return time.getTime() > now.getTime()
        },
      },
    }
  },
  created() {},
  methods: {
    selectDate2(data) {
      const result = isDateRangeExceeds60Days(data[0], data[1])
      if (this.statistics_ === '1') {
        if (result) {
          this.$message.warning('日期筛选范围不能超过60天,请重新选择')
          this.dateRange2 = []
        } else {
          this.$emit('selectDate2', data)
        }
      } else {
        this.$emit('selectDate2', data)
      }
    },
    selectStatistics(e) {
      if (e === '1') {
        this.statistics_ = '1'
      } else if (e === '2') {
        this.statistics_ = '2'
      }
      this.$emit('selectStatistics', e, this.statistics_)
    },
    goDetail(row) {
      console.log('row', row)
      let startTime = ''
      let endTime = ''
      if (this.statistics === '1') {
        // 日
        startTime = row.statisticsDate + ' 00:00:00'
        endTime = row.statisticsDate + ' 23:59:59'
      } else if (this.statistics === '2') {
        // 月
        const parmas = row.statisticsYear + '-' + row.statisticsMonth
        const Date_ = getFirstAndLastDay(parmas)
        startTime = Date_[0]
        endTime = Date_[1]
      }
      this.$router.push({
        path: '/resourceManagement/resourceDetail/ocrText',
        query: {
          appId: row.appId,
          ocrType: row.ocrType,
          startTime: startTime,
          endTime: endTime,
        },
      })
      // this.$emit('goDetail', row)
    },
    exportFile() {
      this.$emit('exportFile_')
    },
    handleCurrentChange2(e) {
      this.$emit('handleCurrentChange2', e)
    },
    Search2(e) {
      this.$emit('Search2_', e)
    },
    Search3(e) {
      this.$emit('Search3_', e)
    },
    Search4(e) {
      this.$emit('Search4_', e)
    },
  },
}
</script>

<style lang="scss" scoped>
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

    .el-select2 {
      width: 80px;
    }
  }
}

.tag {
  cursor: pointer;
}
</style>
