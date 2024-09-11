<!-- 新建客群弹窗 -->
<template>
  <div class="container">
    <div class="searchBar flex_">
      <div class="box flex_">
        <p class="p1">统计粒度：</p>
        <el-select
          v-model="statistics2_"
          class="el-select2"
          filterable
          placeholder="请选择"
          @change="selectStatistics2"
        >
          <el-option
            v-for="item in linkList2"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
      <div class="box flex_">
        <p class="p1">时间区间：</p>
        <el-date-picker
          v-model="dateRange3"
          :value-format="statistics2_ === '1' ? 'yyyy-MM-dd' : 'yyyy-MM'"
          :format="statistics2_ === '1' ? 'yyyy-MM-dd' : 'yyyy-MM'"
          :type="statistics2_ === '1' ? 'daterange' : 'monthrange'"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="
            statistics2_ === '1'
              ? dateRangePickerOptions
              : dateRangePickerOptions2
          "
          @change="selectDate3"
        />
      </div>
    </div>
    <div class="searchBar flex_">
      <div v-if="hasShow" class="box flex_">
        <p class="p1">客户名称：</p>
        <el-input
          v-model="smsParams.customerName"
          clearable
          maxlength="30"
          placeholder="请输入客户名称"
          @change="Search7"
        />
      </div>
      <div class="box flex_">
        <p class="p1">项目名称：</p>
        <el-input
          v-model="smsParams.projectName"
          clearable
          maxlength="30"
          placeholder="请输入项目名称"
          @change="Search6"
        />
      </div>
    </div>
    <el-table
      :data="tableData3"
      :header-cell-style="{ 'text-align': 'center' }"
      :cell-style="{ 'text-align': 'center' }"
      border
      style="width: 100%;"
    >
      <el-table-column prop="customerName" label="客户名" align="center" />
      <el-table-column prop="projectName" label="项目名" align="center" />
      <el-table-column
        :label="smsParams.dimension == 'day' ? '统计日期' : '统计年月'"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="smsParams.dimension == 'month'">
            {{ scope.row.statisticsYear }}-{{ scope.row.statisticsMonth }}
          </span>
          <span v-if="smsParams.dimension == 'day'">
            {{ scope.row.statisticsDate }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="totalCallCount" label="提交总数" align="center" />
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
      <el-table-column prop="totalSplitCount" label="拆分总数" align="center" />
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
            v-if="showComputed('textMessage')"
            @click="goDetail2(scope.row)"
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
      @current-change="handleCurrentChange3"
    />
  </div>
</template>

<script>
import { isDateRangeExceeds60Days, getFirstAndLastDay } from '@/utils/public'
export default {
  name: 'SmsList',
  components: {},
  props: {
    hasShow: {
      type: Boolean,
      default: true,
    },
    tableData3: {
      type: Array,
      required: true,
    },
    statistics2: {
      type: String,
      default: '1',
    },
    smsListLength: {
      type: Number,
      required: true,
    },
    linkList2: {
      type: Array,
      required: true,
    },
    smsParams: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      statistics2_: this.statistics2,
      dateRange3: [
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
    selectDate3(data) {
      const result = isDateRangeExceeds60Days(data[0], data[1])
      if (this.statistics2_ === '1') {
        if (result) {
          this.$message.warning('日期筛选范围不能超过60天,请重新选择')
          this.dateRange3 = []
        } else {
          this.$emit('selectDate3', data)
        }
      } else {
        this.$emit('selectDate3', data)
      }
    },
    selectStatistics2(e) {
      if (e === '1') {
        this.statistics2_ = '1'
      } else if (e === '2') {
        this.statistics2_ = '2'
      }
      this.$emit('selectStatistics2', e, this.statistics2_)
    },
    goDetail2(row) {
      let startTime = ''
      let endTime = ''
      if (this.statistics2 === '1') {
        // 日
        startTime = row.statisticsDate + ' 00:00:00'
        endTime = row.statisticsDate + ' 23:59:59'
      } else if (this.statistics2 === '2') {
        // 月
        const parmas = row.statisticsYear + '-' + row.statisticsMonth
        const Date_ = getFirstAndLastDay(parmas)
        startTime = Date_[0]
        endTime = Date_[1]
      }
      this.$router.push({
        path: '/resourceManagement/resourceDetail/textMessage',
        query: {
          appId: row.appId,
          startTime: startTime,
          endTime: endTime,
        },
      })
      // this.$emit('goDetail2', row)
    },
    handleCurrentChange3(e) {
      this.$emit('handleCurrentChange3', e)
    },
    Search7(e) {
      this.$emit('Search7', e)
    },
    Search6(e) {
      this.$emit('Search6', e)
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
