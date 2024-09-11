<template>
  <div class="container">
    <!-- 表格展示 -->
    <el-card class="fatherBox">
      <div class="h1">客户授权</div>
      <div class="title">资源定量分配</div>

      <el-table
        :data="gridData1"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column property="name" label="产品/服务名称" />
        <el-table-column property="AppKey" label="授权密钥">
          <template slot-scope="scope">AppKey: {{ scope.row.AppKey }}</template>
        </el-table-column>
        <!-- <el-table-column property="Merchant" label="供应商">
          <template slot-scope="scope1">
            <el-select v-model="value1" multiple placeholder="请选择">
              <el-option v-for="item in scope1.row.Merchant" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column> -->
        <el-table-column property="chargeMode" label="计费模式">
          <template slot-scope="scope4">
            <el-select v-model="scope4.row.value2" placeholder="请选择">
              <el-option
                v-for="item in scope4.row.chargeMode"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column property="kts" width="200" label="是否限量">
          <template slot-scope="scope2">
            <!-- AppKey: {{ scope2.row.AppKey }} -->
            <el-radio-group v-model="scope2.row.kts">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="2">否</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column property="dosage" width="150" label="分配限量">
          <template slot-scope="scope3">
            <el-input
              v-model="scope3.row.dosage"
              style="width: 100px;"
              :disabled="scope3.row.kts == 2 ? true : false"
              :data="scope3.row.kts"
            />
            <!-- <el-progress :percentage="scope3.row.dosage"></el-progress> -->
          </template>
        </el-table-column>

        <el-table-column property="str" width="400" label="密钥有效期限">
          <template slot-scope="scope3">
            <el-date-picker
              v-model="scope3.row.str"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :unlink-panels="true"
              @change="selectDate"
            />
          </template>
        </el-table-column>
      </el-table>

      <!-- <div class="datePicker">
        <p class="p1">秘钥有效期限</p>
        <el-date-picker value-format="yyyy-MM-dd" format="yyyy-MM-dd" v-model="value1" @change="selectDate"
          type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </div> -->

      <div class="btnBox">
        <el-button class="btn" @click="prevPage">上一步</el-button>
        <el-button class="btn" type="primary" @click="seedEmail">
          提交
        </el-button>
        <el-button class="btn" @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import JSEncrypt from 'jsencrypt' // 引入模块
export default {
  components: {},
  data() {
    return {
      value1: [],
      value2: '',
      gridData1: [
        {
          name: '外呼机器人',
          AppKey: 'AKIDTlpiMqApKabOwFnDxSijVdXFh6GAtQikAppSecret:******',
          Merchant: [],
          chargeMode: [
            {
              value: '1',
              label: '按流量（ID）收费',
            },
            {
              value: '2',
              label: '按时长收费',
            },
            {
              value: '3',
              label: '按交易额返点',
            },
            {
              value: '4',
              label: '按次数收费',
            },
            {
              value: '5',
              label: '按套餐收费',
            },
            {
              value: '6',
              label: '包年收费',
            },
          ],
          kts: 2,
          dosage: '40',
          str: '',
        },
        {
          name: '外呼机器人',
          AppKey: 'AKIDTlpiMqApKabOwFnDxSijVdXFh6GAtQikAppSecret:******',
          Merchant: [],
          chargeMode: [
            {
              value: '1',
              label: '按流量（ID）收费',
            },
            {
              value: '2',
              label: '按时长收费',
            },
            {
              value: '3',
              label: '按交易额返点',
            },
            {
              value: '4',
              label: '按次数收费',
            },
            {
              value: '5',
              label: '按套餐收费',
            },
            {
              value: '6',
              label: '包年收费',
            },
          ],
          kts: 1,
          dosage: '40',
          str: '',
        },
      ],
    }
  },
  created() {
    var encryptDate = (publicKey, data) => {
      // publicKey: 后端返回的公钥  data：要加密的字符串
      if (publicKey) {
        const encrypt = new JSEncrypt() // 1.实例化对象
        console.log('encrypt', encrypt)
        encrypt.setPublicKey(publicKey) // 2. 设置公钥
        return encrypt.encrypt(data) // 3. 返回加密的字符串
      } else {
        return ''
      }
    }
    var d = encryptDate(
      'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyD2eq6reTMh6gS3FiXmxVaRmm/F6boQgUIe815zG0KUu00Eg06tsxt5pH22H/Kr7G8WuDcJtHwmF5hWN4IsHEfSPf4GJYTK+TfL6xTC0ny8fkPhORXlFOX4xBn+ueJe0GaOsLN5/DYkOZBcWRsuyzyk0DIKfd8VA9cG/RmgFZa1S1DCu+K/Gz3I6DJETZlmWmyrjUPjRWBIt6gnTKoFOpRzYRv1E2FWfG6tj+ayY0ZMzQ8WekpTh17Y0WHD6zly7fr6S2pLvYONZwQCps7y1va4GYkFtvuvGKmS1ZxssZtOtWMTGkzXVXCKqHh+Vo7TCW9hm8FFlJe390SdhDd42gQIDAQAB',
      '123456',
    )
  },
  methods: {
    // 选择日期范围
    selectDate(date) {},
    // 上一步
    prevPage() {
      this.$router.back()
    },
    // 下发邮箱
    seedEmail() {},
    // 取消
    cancel() {
      this.$router.push('/customerManagement')
    },
  },
}
</script>

<style scoped lang="scss">
.el-card {
  min-height: 80vh;
}

.h1 {
  font-size: 18px;
  color: #222;
  font-weight: 600;
  margin-bottom: 20px;
  padding-left: 12px;
}

.title {
  width: 100%;
  height: 35px;
  line-height: 35px;
  border-radius: 2px;
  background: #f1f1f1;
  color: #444;
  padding: 0 15px;
  box-sizing: border-box;
  margin-bottom: 20px;

  &.title2 {
    margin-bottom: 30px;
  }
}

.btnBox {
  margin: 50px 0;
  padding-left: 25px;
  box-sizing: border-box;

  .el-button {
    min-width: 90px;
    margin-right: 12px;
  }
}

.datePicker {
  display: flex;
  align-items: center;
  margin: 25px 0;
  padding-left: 25px;
  box-sizing: border-box;

  .p1 {
    margin-right: 25px;
  }
}

::v-deep .el-table__cell {
  padding: 10px 12px !important;
  box-sizing: border-box;
}
</style>
