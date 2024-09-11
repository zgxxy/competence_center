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
          @change="selectDate4"
        />
      </div>
    </div>
    <div class="searchBar flex_ searchBar2">
      <div v-if="hasShowCustomer" class="box flex_">
        <p class="p1">客户名称：</p>
        <el-input
          v-model="vinParams.customerName"
          clearable
          maxlength="30"
          placeholder="请输入客户名称"
          @change="vinSearch1"
        />
      </div>
      <div v-if="hasShowProject" class="box flex_">
        <p class="p1">项目名称：</p>
        <el-input
          v-model="vinParams.projectName"
          clearable
          maxlength="30"
          placeholder="请输入项目名称"
          @change="vinSearch2"
        />
      </div>
    </div>
    <el-table
      :data="tableData4"
      :header-cell-style="{ 'text-align': 'center' }"
      :cell-style="{ 'text-align': 'center' }"
      border
      style="width: 100%;"
    >
      <el-table-column prop="customerName" label="客户名称" align="center" />
      <el-table-column prop="projectName" label="项目名称" align="center" />

      <el-table-column
        :label="vinParams.dimension == 'day' ? '统计日期' : '统计年月'"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="vinParams.dimension == 'month'">
            {{ scope.row.statisticsYear }}-{{ scope.row.statisticsMonth }}
          </span>
          <span v-if="vinParams.dimension == 'day'">
            {{ scope.row.statisticsDate }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="totalCount" label="总次数" align="center" />
      <el-table-column prop="mateCount" label="匹配次数" align="center" />
      <el-table-column prop="successCount" label="成功次数" align="center" />
      <el-table-column prop="failCount" label="失败次数" align="center" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-tag
            class="tag"
            v-if="showComputed('vinDetail')"
            @click="goDetail3(scope.row)"
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
      :total="vinListLength"
      :current-page="vinParams.pageNum"
      :page-size="vinParams.pageSize"
      style="text-align: center;"
      @current-change="handleCurrentChange4"
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
    tableData4: {
      type: Array,
      required: true,
    },
    statistics: {
      type: String,
      default: '1',
    },
    vinListLength: {
      type: Number,
      required: true,
    },
    linkList: {
      type: Array,
      required: true,
    },
    vinParams: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dimension_: 'day',
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
    selectDate4(data) {
      const result = isDateRangeExceeds60Days(data[0], data[1])
      if (this.statistics_ === '1') {
        if (result) {
          this.$message.warning('日期筛选范围不能超过60天,请重新选择')
          this.dateRange2 = []
        } else {
          this.$emit('selectDate4', data)
        }
      } else {
        this.$emit('selectDate4', data)
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
    goDetail3(row) {
      console.log(row)
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
        path: '/resourceManagement/resourceDetail/vinDetail',
        query: {
          appId: row.appId,
          ocrType: row.ocrType,
          startTime: startTime,
          endTime: endTime,
        },
      })
      // this.$emit('goDetail3', row)
    },
    handleCurrentChange4(e) {
      this.$emit('handleCurrentChange4', e)
    },
    vinSearch1(e) {
      this.$emit('vinSearch1', e)
    },
    vinSearch2(e) {
      this.$emit('vinSearch2', e)
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
