<!-- 新建供应商 -->
<template>
  <div>
    <!-- 表格展示 -->
    <el-card class="father-card">
      <el-steps :active="stepIndex">
        <el-step title="填写基础信息" icon="el-icon-edit-outline" />
        <el-step title="填写服务信息" icon="el-icon-document" />
        <el-step title="关联资源" icon="el-icon-document-checked" />
      </el-steps>
      <template v-if="stepIndex == 1" class="content">
        <os-form ref="formData" :formFields="formFields1" :formData="formData1">
          <template slot="custom" slot-scope="props">
            <div class="title_box" v-if="props.data.key == 1">供应商信息</div>
            <div class="title_box" v-if="props.data.key == 2">对接人信息</div>
          </template>
        </os-form>
      </template>
      <template v-if="stepIndex == 2" class="content">
        <os-form ref="formData" :formFields="formFields2" :formData="formData2">
          <template slot="custom" slot-scope="props">
            <div class="title_box" v-if="props.data.key == 1">资源信息设置</div>
          </template>
        </os-form>
      </template>
      <div class="footer">
        <el-button type="primary" @click="prev" v-if="stepIndex == 2">
          上一步
        </el-button>
        <el-button type="primary" @click="next" v-if="stepIndex !== 2">
          下一步
        </el-button>
        <el-button type="primary" @click="confirm" v-else>
          确认
        </el-button>
        <el-button type="" @click="cancel">
          取消
        </el-button>
      </div>
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
      if (!value) {
        callback(new Error('请输入联系电话'))
      }
      if (regex.test(value)) {
        callback()
      } else {
        callback(new Error('手机号码格式不正确'))
      }
    }
    const validateEmail = (rule, value, callback) => {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!value) {
        callback(new Error('请输入联系邮箱'))
      }
      if (regex.test(value)) {
        callback()
      } else {
        callback(new Error('邮箱地址格式不正确'))
      }
    }
    return {
      stepIndex: 1, // 步骤
      formData1: {
        supplierName: '',
        contact: '',
        supplierphone: '',
        supplierEmail: '',
        principal: '',
        innerphone: '',
        innerEmail: '',
      },
      //第一步表单
      formFields1: [
        {
          type: 'custom', //自定义插槽
          key: 1, //区分插槽的显示
          span: 24,
        },
        {
          labelName: '供应商名称：',
          field: 'supplierName',
          type: 'input',
          placeholder: '请输入供应商名称',
          position: 'left',
          labelWidth: '110px',
          width: '280px',
          maxlength: 30,
          span: 24,
          rules: {
            required: true,
            message: '请输入供应商名称',
            trigger: 'blur',
          },
        },
        {
          labelName: '联系人：',
          field: 'contact',
          type: 'input',
          placeholder: '请输入供应商联系人姓名',
          position: 'left',
          labelWidth: '110px',
          width: '280px',
          maxlength: 30,
          span: 24,
          rules: { required: true, message: '请输入系人姓名', trigger: 'blur' },
        },
        {
          labelName: '联系电话：',
          field: 'supplierphone',
          type: 'input',
          placeholder: '请输入供应商联系人电话',
          position: 'left',
          labelWidth: '110px',
          width: '280px',
          maxlength: 30,
          span: 24,
          rules: [
            { required: true, message: '请输入联系电话', trigger: 'change' },
            { validator: validatelinkPhone },
          ],
        },
        {
          labelName: '联系邮箱：',
          field: 'supplierEmail',
          type: 'input',
          placeholder: '请输入供应商联系人邮箱',
          position: 'left',
          labelWidth: '110px',
          width: '280px',
          maxlength: 30,
          span: 24,
          // rules: [
          //   { required: true, message: '请输入联系邮箱', trigger: 'change' },
          //   { validator: validateEmail },
          // ],
        },
        {
          type: 'custom',
          key: 2,
          span: 24,
        },
        {
          labelName: '负责人：',
          field: 'principal',
          type: 'input',
          placeholder: '请输入内部的服务引入对接人姓名',
          position: 'left',
          labelWidth: '110px',
          width: '280px',
          maxlength: 30,
          span: 24,
          rules: { required: true, message: '请输入负责人', trigger: 'blur' },
        },
        {
          labelName: '联系电话：',
          field: 'innerphone',
          type: 'input',
          placeholder: '请输入内部对接人联系电话',
          position: 'left',
          labelWidth: '110px',
          width: '280px',
          maxlength: 30,
          span: 24,
          // rules: [
          //   { required: true, message: '请输入联系电话', trigger: 'change' },
          //   { validator: validatelinkPhone },
          // ],
        },
        {
          labelName: '联系邮箱：',
          field: 'innerEmail',
          type: 'input',
          placeholder: '请输入内部对接人联系邮箱',
          position: 'left',
          labelWidth: '110px',
          width: '280px',
          maxlength: 30,
          span: 24,
          // rules: [
          //   { required: true, message: '请输入联系邮箱', trigger: 'change' },
          //   { validator: validateEmail },
          // ],
        },
      ],
      formData2: {},
      formFields2: [
        {
          type: 'custom',
          span: 24,
        },
        {
          labelName: '联系电话：',
          field: 'innerphone',
          type: 'input',
          placeholder: '请输入内部对接人联系电话',
          position: 'left',
          labelWidth: '110px',
          width: '280px',
          maxlength: 30,
          span: 24,
          rules: {
            required: true,
            message: '请输入联系电话',
            trigger: 'change',
          },
        },
      ],
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
    // 取消
    cancel() {
      this.$router.back()
    },
    //上一步
    prev() {
      if (this.stepIndex-- > 2) this.stepIndex = 0
    },
    //下一步
    next() {
      this.$refs.formData.validate().then((valid) => {
        if (valid) {
          if (this.stepIndex++ > 2) this.stepIndex = 0
        }
      })
    },
    //确定
    confirm() {},
    // 上一步

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
.footer {
  display: flex;
  justify-content: flex-end;
}
.content {
  margin: 20px 0;
}
.title_box {
  padding: 10px;
  background: #f1f1f1;
  margin-bottom: 15px;
}
</style>
