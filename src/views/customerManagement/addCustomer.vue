<!-- 新增客户 -->
<template>
  <div class="container">
    <!-- 表格展示 -->
    <el-card class="Content">
      <el-steps :active="stepIndex">
        <el-step title="新增客户" icon="el-icon-circle-plus-outline" />
        <el-step title="服务授权" icon="el-icon-folder-checked" />
        <el-step title="客户授权" icon="el-icon-document-add" />
      </el-steps>
      <!-- <el-steps :active="stepIndex" finish-status="success" simple>
        <el-step title="新增客户"></el-step>
        <el-step title="服务授权"></el-step>
        <el-step title="客户授权"></el-step>
      </el-steps> -->

      <template v-if="stepIndex == 1">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="100px"
          class="Form_"
        >
          <el-form-item label="客户名称" prop="customerName">
            <el-input
              v-model="ruleForm.customerName"
              maxlength="30"
              placeholder="请输入客户名称"
            />
          </el-form-item>
          <el-form-item label="联系人" prop="linkPerson">
            <el-input
              v-model="ruleForm.linkPerson"
              maxlength="30"
              placeholder="请输入联系人名称"
            />
          </el-form-item>
          <el-form-item label="联系电话" prop="linkPhone">
            <el-input
              v-model="ruleForm.linkPhone"
              max-length="11"
              placeholder="请输入联系电话"
              @input="restrictInput"
            />
          </el-form-item>
          <el-form-item label="联系邮箱" prop="email">
            <el-input
              v-model="ruleForm.email"
              maxlength="50"
              placeholder="请输入联系邮箱"
            />
          </el-form-item>

          <div class="title title2">开通及绑定主帐号</div>
          <el-form-item label="主账号" prop="userAccount">
            <el-input
              v-model="ruleForm.userAccount"
              maxlength="30"
              placeholder="请输入主账号"
            />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="ruleForm.password"
              disabled
              placeholder="请点击右侧按钮生成密码"
            />
            <el-tag class="tags" @click="createPassword">随机生成密码</el-tag>
          </el-form-item>
          <el-form-item label="主账号用户名" prop="userName">
            <el-input
              v-model="ruleForm.userName"
              maxlength="30"
              placeholder="请输入主账号用户名"
            />
          </el-form-item>

          <el-form-item
            class="btnBox"
            style="
              padding-left: 100px;
              box-sizing: border-box;
              margin-top: 30px;
            "
          >
            <el-button
              class="btn"
              type="primary"
              @click="prevPage1('ruleForm')"
            >
              下一步
            </el-button>
            <el-button class="btn" @click="resetForm('ruleForm')">
              取消
            </el-button>
          </el-form-item>
        </el-form>
      </template>
      <template v-if="stepIndex == 2">
        <div class="content">
          <!-- <p class="ed">已授权服务 <span class="sp" @click="slideShow">{{ selected.length }}项</span></p>
          <div v-if="isShow" class="selected">
            <p class="p1">已选资源</p>
            <el-checkbox-group v-model="selected">
              <el-checkbox v-for="(item, index) in selected" :key="index" :label="item.powerName" disabled />
            </el-checkbox-group>
          </div> -->

          <div class="header">
            <p class="p2">选择服务资源</p>
            <el-input
              v-model="search"
              placeholder="请输入服务或产品名称"
              maxlength="30"
              class="searchInput"
              @input="changeIpt"
            >
              <i slot="suffix" class="el-icon-search el-input__icon" />
            </el-input>

            <p class="p2" style="margin-left: 30px;">类型筛选</p>
            <el-select
              v-model="value"
              placeholder="请选择"
              @change="selectChange"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>

            <el-checkbox
              v-model="checkAll"
              style="margin-left: 30px;"
              @change="handleCheckAllChange"
            >
              全部资源
            </el-checkbox>
          </div>
          <!-- 能力池 -->
          <div class="group">
            <el-checkbox-group
              class="checkBox"
              v-model="checkedCities"
              @change="handleChange"
            >
              <el-checkbox
                v-for="(city, index) in checkList"
                :key="index"
                :label="city.powerId"
                :disabled="city.status == '0'"
              >
                {{ city.powerName }}
              </el-checkbox>
            </el-checkbox-group>
            <el-empty
              v-if="checkList.length == 0"
              :image-size="100"
              description="没有可选服务资源了..."
            />
          </div>
          <!-- 能力池 -->
          <div class="btnBox">
            <el-button class="btn" @click="prevPage2">上一步</el-button>
            <el-button class="btn" type="primary" @click="nextPage2">
              下一步
            </el-button>
            <!-- <el-button class="btn" type="primary" @click="nextPage">提交</el-button> -->
          </div>
        </div>
      </template>
      <template v-if="stepIndex == 3">
        <div class="Form_">
          <div class="title title3">资源定量分配</div>
          <el-table
            :data="gridData1"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
            border
          >
            <el-table-column property="name" label="产品/服务名称" />
            <el-table-column property="id" label="服务id" />
            <el-table-column property="chargeMode" label="计费模式">
              <template slot-scope="scope4">
                <el-select v-model="scope4.row.value2" placeholder="请选择">
                  <el-option
                    v-for="item in scope4.row.chargeMode"
                    :key="item.chargeMode"
                    :label="item.chargeModeName"
                    :value="item.chargeMode"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column property="kts" width="200" label="是否限量">
              <template slot-scope="scope2">
                <el-radio-group
                  v-model="scope2.row.kts"
                  @input="changeRadio(scope2.row)"
                >
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column property="dosage" width="150" label="分配限量">
              <template slot-scope="scope3">
                <el-input
                  v-model="scope3.row.dosage"
                  class="fp-input"
                  style="width: 100px;"
                  :disabled="scope3.row.kts == 0 ? true : false"
                  @input="validateInput(scope3.row)"
                />
              </template>
            </el-table-column>

            <el-table-column property="str" width="400" label="密钥有效期限">
              <template slot-scope="scope3">
                <el-date-picker
                  v-model="scope3.row.str"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  type="daterange"
                  :unlink-panels="true"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                  @change="selectDate"
                />
              </template>
            </el-table-column>
          </el-table>

          <div class="btnBox">
            <el-button class="btn" @click="prevPage3">上一步</el-button>
            <el-button class="btn" type="primary" @click="Submit">
              提交
            </el-button>
            <el-button class="btn" @click="cancel3">取消</el-button>
          </div>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script>
import { encryptDate } from '@/utils/public'
import {
  selectListByCondition,
  getAllPowerList,
  insertCustomerEntity,
} from '@/api/capacityApi'
export default {
  components: {},
  data() {
    const validatelinkPhone = (rule, value, callback) => {
      const regex = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (regex.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的手机号码'))
      }
    }
    const validateEmail = (rule, value, callback) => {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (regex.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的邮箱地址'))
      }
    }
    return {
      stepIndex: 1, // 步骤
      ruleForm: {
        customerName: '',
        linkPerson: '',
        linkPhone: '',
        userAccount: '',
        password: '',
        userName: '',
        email: '',
      },
      rules: {
        customerName: [
          { required: true, message: '请输入客户名称', trigger: 'blur' },
        ],
        linkPerson: [
          { required: true, message: '请输入联系人', trigger: 'blur' },
        ],
        linkPhone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            required: true,
            message: '',
            trigger: 'change',
            validator: validatelinkPhone,
          },
        ],
        email: [
          { required: true, message: '请输入联系邮箱', trigger: 'blur' },
          {
            required: true,
            message: '',
            trigger: 'change',
            validator: validateEmail,
          },
        ],
        userAccount: [
          { required: true, message: '请输入主账号', trigger: 'blur' },
        ],
        password: [{ required: true, message: '请生成密码', trigger: 'blur' }],
        userName: [
          { required: true, message: '请输入主账号用户名', trigger: 'blur' },
        ],
      },
      pickerOptions: {
        disabledDate(time) {
          // 禁用早于今天的日期
          const today = new Date()
          return time.getTime() < today.setHours(0, 0, 0, 0)
        },
      },
      search: '',
      isShow: true,
      checkAll: false,
      checkList: [],
      checkedCities: [],
      isIndeterminate: true,
      options: [
        {
          value: '',
          label: '全部',
        },
        {
          value: '1',
          label: '基础服务类',
        },
      ],
      value: '',
      powerIds: [],
      selected: [],
      selected_2: [],
      paramsObj: {},
      page: '', // 来源页面
      customerId: '', // 客户id
      gridData1: [],
      chargeMode_: [],
      powerAuthList: [], // 授权集合
    }
  },
  watch: {},
  created() {
    this.getList()
    this.getAllPowerList()
  },
  methods: {
    changeRadio(e) {
      if (e.kts === 0) {
        e.dosage = 0
      }
    },
    // 获取能力池列表
    getList() {
      const params = {
        status: '1',
        powerName: this.search, // 能力名称
        type: this.value, // 类型
      }
      selectListByCondition(params).then((res) => {
        if (res.data.code === '0') {
          const data_ = res.data.data
          this.checkList = data_

          if (this.page === 'customDetail') {
            // this.selected = this.checkList.filter(item => this.selected_2.includes(item.powerId))
            this.selected = []
            const arr = this.checkList.filter(
              (item) => !this.selected_2.includes(item.powerId),
            )
            this.checkList = arr
          }
        }
      })
    },
    // 获取计费模式列表
    getAllPowerList() {
      getAllPowerList({}).then((res) => {
        if (res.data.code === '0') {
          const data_ = res.data.data
          this.chargeMode_ = data_
        }
      })
    },
    // 提交
    insertCustomerEntity() {
      this.paramsObj = {
        customerName: this.ruleForm.customerName, // 客户名称
        linkPerson: this.ruleForm.linkPerson, // 联系人
        linkPhone: this.ruleForm.linkPhone, // 联系电话
        email: this.ruleForm.email, // 邮箱
        password: encryptDate(this.ruleForm.password), // 密码
        remark: '', // 备注
        userAccount: this.ruleForm.userAccount, // 主账号
        userName: this.ruleForm.userName, // 主账号用户名
        powerAuthList: this.powerAuthList, // 授权集合
      }

      for (let i = 0; i < this.paramsObj.powerAuthList.length; i++) {
        if (
          this.paramsObj.powerAuthList[i].chargeMode === '' ||
          this.paramsObj.powerAuthList[i].chargeMode === undefined
        ) {
          this.$message.warning('请选择第' + (i + 1) + ' 项的计费模式')
          return
        }
        if (this.paramsObj.powerAuthList[i].startTime.includes('undefined')) {
          this.$message.warning('请选择第' + (i + 1) + ' 项的密钥有效期限')
          return
        }
        if (
          this.paramsObj.powerAuthList[i].isLimit === 1 &&
          (this.paramsObj.powerAuthList[i].limitNum === 0 ||
            this.paramsObj.powerAuthList[i].limitNum === '')
        ) {
          this.$message.warning('请输入第' + (i + 1) + ' 项的分配限量，不能为0')
          return
        }
      }
      const params = this.paramsObj
      insertCustomerEntity(params).then((res) => {
        if (res.data.code === '0') {
          this.$message.success('新增成功，请稍后')
          setTimeout(() => {
            this.$router.push('/customerManagement')
          }, 800)
        }
      })
    },
    // 手机号码输入限制
    restrictInput() {
      // 使用正则表达式检查输入
      this.ruleForm.linkPhone = this.ruleForm.linkPhone.replace(/[^0-9]/g, '') // 只允许数字
      if (this.ruleForm.linkPhone.length > 11) {
        this.ruleForm.linkPhone = this.ruleForm.linkPhone.slice(0, 11) // 限制长度为11位
      }
    },
    validateInput(e) {
      // 使用isNaN判断是否为数字，以及是否不为空且不为0
      if (isNaN(e.dosage) || e.dosage === '' || e.dosage === '0') {
        // 如果输入不合法，将输入值置为空
        e.dosage = ''
      }
    },
    // 选择日期范围
    selectDate(date) {},
    // 下一步-1
    prevPage1(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.$router.push('/serviceAuthorization')
          this.stepIndex = 2
        } else {
          return false
        }
      })
    },
    // 取消
    resetForm(formName) {
      this.$router.back()
      // this.$router.push({
      //   name:'customerManagement',
      //   params:{
      //     id:'1'
      //   }
      // })
    },
    // 随机生成密码
    createPassword() {
      this.ruleForm.password = this.generateRandomPassword(8)
    },
    // 随机密码串
    generateRandomPassword(length) {
      const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz'
      const numberChars = '0123456789'
      const specialChars = '@#$%&*.'

      const allChars =
        upperCaseChars + lowerCaseChars + numberChars + specialChars
      const allCharsLength = allChars.length
      // 最少8位数
      if (length < 8) {
        length = 8
      }

      let password = ''
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allCharsLength)
        password += allChars.charAt(randomIndex)
      }
      return password
    },
    // 显示已选资源
    slideShow() {
      this.isShow = !this.isShow
    },
    // 类型筛选
    selectChange(e) {
      this.value = e
      this.getList()
    },
    // 全选
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.checkList.map((item) => item.powerId) : []
      this.selected = val
        ? this.checkList.filter((item) => item.status === '1')
        : []
      if (val) {
        this.powerIds = this.checkList
          .filter((item) => item.status === '1')
          .map((item) => item.powerId)
      } else {
        this.powerIds = []
      }

      this.isIndeterminate = false
    },
    // 选择资源
    handleChange(value) {
      const checkedCount =
        this.checkedCities.length > this.selected_2.length
          ? value.length - this.selected_2.length
          : value.length
      this.checkAll = checkedCount === this.checkList.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.checkList.length
      this.powerIds = this.checkedCities
      this.selected = this.checkList.filter(
        (item) => item.status === '1' && this.powerIds.includes(item.powerId),
      )
      if (this.page === 'customDetail') {
        this.powerIds = this.selected.map((item) => item.powerId)
      }
    },
    // 搜索
    changeIpt(e) {
      this.search = e
      this.getList()
    },
    // 取消
    cancel() {
      this.checkedCities = []
      this.powerIds = []
      this.checkAll = false
    },
    // 上一步
    prevPage2() {
      this.stepIndex = 1
    },
    // 下一步
    nextPage2() {
      if (this.powerIds.length < 1)
        return this.$message.warning('请先选择服务资源')
      this.stepIndex = 3
      for (let i = 0; i < this.selected.length; i++) {
        let found = false
        // 遍历 arr2，检查是否存在相同 id 的项
        for (let j = 0; j < this.gridData1.length; j++) {
          if (this.gridData1[j].id === this.selected[i].powerId) {
            found = true
            break
          }
        }

        if (!found) {
          this.gridData1.push({
            id: this.selected[i].powerId,
            name: this.selected[i].powerName,
            chargeMode: this.chargeMode_,
            kts: 1,
            dosage: 0,
            str: '',
          })
        }
      }
      const result = this.gridData1.filter((item1) =>
        this.selected.some((item2) => item2.powerId === item1.id),
      )
      this.gridData1 = result
    },
    // 上一步
    prevPage3() {
      this.stepIndex = 2
    },
    // 提交
    Submit() {
      this.powerAuthList = []
      console.log('参数1', this.ruleForm)
      console.log('参数2', this.powerIds)
      console.log('参数3', this.gridData1)

      for (var i = 0; i < this.gridData1.length; i++) {
        this.powerAuthList.push({
          chargeMode: this.gridData1[i].value2,
          startTime: this.gridData1[i].str[0] + ' 00:00:00',
          endTime: this.gridData1[i].str[1] + ' 23:59:59',
          limitNum: this.gridData1[i].dosage,
          powerId: this.gridData1[i].id,
          isLimit: this.gridData1[i].kts,
        })
      }
      this.$nextTick(() => {
        this.insertCustomerEntity()
      })
    },
    // 取消
    cancel3() {
      this.$router.back()
    },
  },
}
</script>

<style scoped lang="scss">
.el-card {
  min-height: 80vh;

  .el-form {
    margin: 30px 0;
  }
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

  &.title2 {
    margin: 15px 0 30px;
    display: inline-block;
  }

  &.title3 {
    margin: 25px 0;
  }
}

.Content {
  width: 100%;

  .h1 {
    font-size: 16px;
    color: #333;
    font-weight: 600;
    margin: 6px 0 24px;
  }

  .h2 {
    font-size: 15px;
    color: #555;
    margin: 15px 0;
  }

  ::v-deep .el-form-item {
    display: flex;
    align-items: center;
    &.hasAni {
      animation: shake 1s ease;
    }
    @keyframes shake {
      0% {
        transform: translateX(0);
      }
      10%,
      90% {
        transform: translateX(-10px);
      }
      20%,
      80% {
        transform: translateX(10px);
      }
      30%,
      50%,
      70% {
        transform: translateX(-10px);
      }
      40%,
      60% {
        transform: translateX(10px);
      }
      100% {
        transform: translateX(0);
      }
    }

    .el-form-item__label {
      text-align: right !important;
      width: 110px !important;
    }

    .el-form-item__content {
      margin-left: 10px !important;
      width: 35%;
      display: flex;
      align-items: center;

      .tags {
        height: 36px;
        line-height: 34px;
        margin-left: 20px;
        cursor: pointer;
      }
    }
  }
}

.content {
  width: 100%;
  height: auto;
  padding: 30px 50px;
  box-sizing: border-box;

  .group {
    width: 100%;
    height: auto;
    min-height: 200px;
    max-height: 300px;
    overflow: hidden;
    overflow-y: auto;
    background: #f9f9f9;
    padding: 15px 32px;
    box-sizing: border-box;
    border-radius: 5px;

    .checkBox {
      width: 100%;
      height: auto;
      display: flex;
      flex-wrap: wrap;
      .el-checkbox {
        margin-bottom: 20px;
        width: 20%;
        margin-right: 0;
        display: flex;
        align-items: flex-start;
        white-space: normal;
        ::v-deep .el-checkbox__input {
          margin-top: 3px;
        }
      }
    }
  }

  .btnBox {
    margin-top: 30px;

    .el-button {
      min-width: 90px;
      margin-right: 12px;
    }
  }

  .ed {
    font-size: 15px;
    color: #555;
    margin-bottom: 25px;

    .sp {
      margin-left: 12px;
      color: #409eff;
      text-decoration: underline;
      cursor: pointer;
    }
  }

  .selected {
    width: 100%;
    height: auto;
    padding: 12px;
    box-sizing: border-box;
    border: 1px solid #e1e1e1;
    border-radius: 5px;
    margin-bottom: 25px;

    .p1 {
      margin-bottom: 12px;
      font-size: 14px;
      color: #666;
    }
  }

  .header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .p2 {
      font-size: 14px;
      color: #666;
      margin-right: 12px;
    }

    .searchInput {
      width: 20%;
      margin-right: 12px;
    }
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

.Form_ {
  padding: 0 50px;
  box-sizing: border-box;
  ::v-deep .el-table__row {
    .el-table__cell {
      padding: 10px;
      box-sizing: border-box;
    }
  }

  .fp-input {
    ::v-deep .el-input__inner {
      text-align: center !important;
    }
  }
}

::v-deep .el-steps--horizontal {
  padding: 0 58px;
  box-sizing: border-box;

  .el-step__main {
    margin-left: -8px;
  }
}
</style>
