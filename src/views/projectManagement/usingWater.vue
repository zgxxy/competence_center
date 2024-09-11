<template>
  <div class="table-warpper">
    <!-- 表格展示 -->
    <el-card class="fatherBox">
      <div class="block-content">
        <div class="title flex_">
          <p class="p1">使用流水</p>
          <p class="p2">东风日产乘用车有限公司-DFN</p>
        </div>
        <div class="dateGroup flex_">
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

        <div class="searchBar flex_">
          <div class="box flex_">
            <p class="p1">操作类型：</p>
            <el-select v-model="value3" placeholder="请选择">
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="box flex_">
            <p class="p1">操作者：</p>
            <el-input
              v-model="exitUser"
              placeholder="请输入操作者"
              @input="Search"
            />
          </div>
          <div class="box flex_">
            <p class="p1">资源名称：</p>
            <el-select v-model="value2" placeholder="请选择">
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>

        <el-table :data="tableData" border style="width: 100%;">
          <el-table-column prop="exitTime" label="操作时间" align="center" />
          <el-table-column prop="exit" label="操作事件" align="center" />
          <el-table-column prop="exitUser" label="操作者" align="center" />
          <el-table-column prop="exitType" label="操作类型" align="center" />
          <el-table-column prop="sourseName" label="资源名称" align="center" />
          <el-table-column prop="jlStyle" label="计量方式" align="center" />
          <el-table-column prop="cost" label="费用" align="center" />
          <el-table-column prop="empowerId" label="授权ID" align="center" />
          <el-table-column prop="requestId" label="请求ID" align="center" />
          <el-table-column prop="state" label="状态" align="center" />
          <el-table-column prop="ipAddress" label="源ID地址" align="center" />
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      exitUser: '',
      dateStr: [], // 时间戳
      btnList: ['近30分', '近1小时', '近1日', '近7日'],
      value3: [],
      activeIndex: null,
      crowdName: '',
      tableData: [
        {
          exitTime: '2023-06-02 11:25:25',
          exit: '支付接口调用',
          exitUser: '项目1',
          exitType: '接口调用',
          sourseName: 'LY支付工具',
          jlStyle: '总额返点',
          cost: '-',
          empowerId: 'LJGIJ345',
          requestId: '1099896',
          state: '成功',
          ipAddress: '172.26.110.24',
        },
        {
          exitTime: '2023-06-02 11:25:25',
          exit: '支付接口调用',
          exitUser: '项目1',
          exitType: '接口调用',
          sourseName: 'LY支付工具',
          jlStyle: '总额返点',
          cost: '-',
          empowerId: 'LJGIJ345',
          requestId: '1099896',
          state: '成功',
          ipAddress: '172.26.110.24',
        },
      ],
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
      value1: '',
      value2: '',
    }
  },
  created() {},
  methods: {
    // 操作者搜索
    Search(e) {
      console.log(e)
    },
    // 选择日期
    changeDate(index) {
      if (index === 0) {
        this.activeIndex = 0
        this.dateStr = this.getTimestamps(30)
      } else if (index === 1) {
        this.activeIndex = 1
        this.dateStr = this.getTimestamps(60)
      } else if (index === 2) {
        this.activeIndex = 2
        this.dateStr = this.getTimestamps(1440)
      } else if (index === 3) {
        this.activeIndex = 3
        this.dateStr = this.getTimestamps(1440 * 7)
      }
      console.log(this.dateStr)
    },
    // 选择日期范围
    selectDate(date) {
      console.log(date)
    },
    // 管理
    handleClick(row) {
      console.log(row)
    },
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
      console.log('formName', formName)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('valid', valid, this.ruleForm)
          // this.$router.push('/serviceAuthorization')
        } else {
          console.log('error submit!!')
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
}

.box {
  margin-right: 25px;

  .p1 {
    font-size: 15px;
    color: #444;
    min-width: 60px;
  }
}

::v-deep .el-table__row .el-table__cell {
  padding: 22px 0 !important;
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

  .el-date-editor {
    height: 32px;
  }

  .p1 {
    font-size: 14px;
    color: #444;
    margin-left: 30px;
  }
}
</style>
