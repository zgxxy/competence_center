<!-- 系统日志详情 -->
<template>
  <div class="table-warpper">
    <!-- 表格展示 -->
    <el-card class="fatherBox">
      <div class="content">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基础信息" name="1">
            <div class="title">基础信息</div>
            <ul class="Lists">
              <li class="lis ellipse flex_">
                接口名称：
                <p class="sp ellipse">{{ dataObj.apiName || '--' }}</p>
              </li>
              <li class="lis ellipse flex_">
                appId：
                <p class="sp ellipse">{{ dataObj.appId || '--' }}</p>
              </li>
              <li class="lis ellipse flex_">
                调用来源：
                <p class="sp ellipse">{{ dataObj.callResource || '--' }}</p>
              </li>
              <li class="lis ellipse flex_">
                执行时间(秒)：
                <p class="sp ellipse">{{ dataObj.executeTime || '--' }}</p>
              </li>
              <li class="lis ellipse flex_">
                主键id：
                <p class="sp ellipse">{{ dataObj.id || '--' }}</p>
              </li>
              <li class="lis ellipse flex_">
                能力模块：
                <p class="sp ellipse">{{ dataObj.module || '--' }}</p>
              </li>
              <li class="lis ellipse flex_">
                请求方式：
                <p class="sp ellipse">{{ dataObj.requestMethod || '--' }}</p>
              </li>
              <li class="lis ellipse flex_">
                请求时间：
                <p class="sp ellipse">{{ dataObj.requestTime || '--' }}</p>
              </li>
              <li class="lis ellipse flex_">
                响应结果：
                <el-tooltip
                  popper-class="projectTooltip"
                  :content="dataObj.response"
                  placement="top"
                >
                  <el-button class="sp ellipse">
                    {{ dataObj.response || '--' }}
                  </el-button>
                </el-tooltip>
              </li>
              <li class="lis ellipse flex_">
                http状态码：
                <span
                  v-if="dataObj.statusCode == '200'"
                  class="sp ellipse"
                  style="color: #70b603;"
                >
                  {{ dataObj.statusCode }}
                </span>
                <span v-else class="sp ellipse" style="color: #d9001b;">
                  {{ dataObj.statusCode }}
                </span>
                <!-- <p class="sp ellipse">{{ dataObj.statusCode }}</p> -->
              </li>
              <li class="lis ellipse flex_">
                业务是否请求成功：
                <p class="sp ellipse">
                  {{ dataObj.success == true ? '成功' : '失败' }}
                </p>
              </li>
              <li class="lis ellipse flex_">
                线程id：
                <p class="sp ellipse">{{ dataObj.threadId || '--' }}</p>
              </li>
              <li class="lis ellipse flex_">
                请求路径：
                <el-tooltip
                  popper-class="projectTooltip"
                  :content="dataObj.urlPath"
                  placement="top"
                >
                  <el-button class="sp ellipse">
                    {{ dataObj.urlPath || '--' }}
                  </el-button>
                </el-tooltip>
              </li>
            </ul>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getSysLogDataById } from '@/api/capacityApi'
export default {
  components: {},
  filters: {
    filterType(val) {
      if (val) {
        if (val === 1) {
          return '基础能力类'
        }
      } else {
        return '--'
      }
    },
  },
  data() {
    return {
      dataObj: {},
      activeName: '1',
      logId: '', // 日志id
    }
  },
  created() {
    // this.getSmsStatisticsData()
    this.logId = this.$route.query.logId
    console.log('this.logId', this.logId)

    if (this.logId) {
      this.getData()
    }
  },
  mounted() {},
  methods: {
    // tab切换
    handleClick(tab) {
      console.log(tab.index)
    },
    // 获取详情数据
    getData() {
      const params = {
        id: this.logId,
      }
      getSysLogDataById(params).then((res) => {
        if (res.data.code === '0') {
          const data_ = res.data.data
          console.log('详情接口响应', res)
          this.dataObj = data_
        }
      })
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
    margin-top: 10px;
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
    padding: 10px 0 5px;

    .lis {
      width: 50%;
      height: auto;
      padding: 10px 20px;
      box-sizing: border-box;
      font-size: 14px;
      color: #999;

      .sp {
        color: #222;
        max-width: 400px;
        border: none;
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

  .slat {
    color: #409eff;
    margin: 0 6px;
    cursor: pointer;
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
::v-deep .el-tabs__item {
  font-size: 16px;
}
</style>
