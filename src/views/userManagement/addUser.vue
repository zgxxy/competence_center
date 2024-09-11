<!-- 新建用户 -->
<template>
  <div>
    <!-- 表格展示 -->
    <el-card class="father-card">
      <div class="title_box">用户信息填写</div>
      <div class="content">
        <os-form ref="formData" :formFields="formFields" :formData="formData">
          <template slot="userInfo" slot-scope="props">
            <div class="userInfo_box">
              <el-form ref="childFormData" :model="childFormData">
                <div
                  v-for="(item, index) in childFormData.list"
                  :key="'childFormData' + index"
                  class="childFormData_box"
                >
                  <el-col :span="4">
                    <el-form-item
                      :prop="'list.' + index + '.userName'"
                      :rules="rules1.userName"
                      :label="index === 0 ? '用户名' : ' '"
                      :class="index === 0 ? '' : 'noFirst'"
                    >
                      <div style="white-space: nowrap;">
                        <el-input
                          v-model="item.userName"
                          maxlength="10"
                          clearable
                        />
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item
                      :prop="'list.' + index + '.acName'"
                      :rules="rules1.acName"
                      :label="index === 0 ? '登陆账号' : ' '"
                      :class="index === 0 ? '' : 'noFirst'"
                    >
                      <div style="white-space: nowrap;">
                        <el-input
                          v-model="item.acName"
                          maxlength="10"
                          clearable
                          @blur="acNameBlur(index, item.acName)"
                        />
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item
                      :prop="'list.' + index + '.roleId'"
                      :rules="rules1.roleId"
                      :label="index === 0 ? '用户角色' : ' '"
                      :class="index === 0 ? '' : 'noFirst'"
                    >
                      <div style="white-space: nowrap;">
                        <el-select
                          v-model="item.roleId"
                          placeholder="请选择"
                          clearable
                          :filterable="true"
                          :disabled="item.disabled"
                        >
                          <el-option
                            v-for="(item, optionIndex) in roleTypeList"
                            :key="optionIndex"
                            :label="item.roleName"
                            :value="item.roleId"
                          ></el-option>
                        </el-select>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item
                      :prop="'list.' + index + '.phone'"
                      :rules="rules1.phone"
                      :label="index === 0 ? '手机号码' : ' '"
                      :class="index === 0 ? '' : 'noFirst'"
                    >
                      <div style="white-space: nowrap;">
                        <el-input v-model="item.phone" clearable />
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="3">
                    <el-form-item
                      :prop="'list.' + index + '.email'"
                      :rules="rules1.email"
                      :label="index === 0 ? '邮箱' : ' '"
                      :class="index === 0 ? '' : 'noFirst'"
                    >
                      <div style="white-space: nowrap;">
                        <el-input v-model="item.email" clearable />
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="3">
                    <el-form-item
                      :prop="'list.' + index + '.remark'"
                      :label="index === 0 ? '备注' : ' '"
                    >
                      <div style="white-space: nowrap;">
                        <el-input
                          v-model="item.remark"
                          maxlength="10"
                          clearable
                        />
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2">
                    <div
                      style="
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                      "
                    >
                      <div style="font-weight: 600; height: 30px;">
                        {{ index === 0 ? '操作' : '' }}
                      </div>
                      <el-button type="text" @click="delUser(index)">
                        删除
                      </el-button>
                    </div>
                  </el-col>
                </div>
              </el-form>
            </div>
          </template>
          <template slot="password-append" v-if="passwordControl()">
            <el-button
              @click="createPassword"
              style="margin-left: 10px; color: '#66b1ff';"
            >
              随机生成密码
            </el-button>
          </template>
          <template slot="serviceAuthority-append">
            <span style="font-size: 12px; color: gray;">
              服务组主要是对用户进行服务授权
            </span>
          </template>
        </os-form>
        <div class="footer">
          <el-button type="primary" @click="confirm">
            确认
          </el-button>
          <el-button type="" @click="cancel">
            取消
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getYear, encryptDate } from '@/utils/public'
import {
  getCustomerProjectList,
  getRoleByCondition,
  getServiceGroupByCondition,
  addUser,
} from '@/api/capacityApi'
export default {
  components: {},
  data() {
    const validateAcName = (rule, value, callback) => {
      const regex = /^[A-Za-z-_@]+$/
      if (regex.test(value)) {
        callback()
      } else {
        callback(new Error('账号只能输入字母和符号（@-_）'))
      }
    }
    const validatelinkPhone = (rule, value, callback) => {
      const regex = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (regex.test(value)) {
        callback()
      } else {
        callback(new Error('手机号码格式不正确'))
      }
    }
    const validateEmail = (rule, value, callback) => {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (regex.test(value)) {
        callback()
      } else {
        callback(new Error('邮箱地址格式不正确'))
      }
    }
    const validatePassWord = (rule, value, callback) => {
      //密码必须包含大、小写字母、数字、特殊符号（!@#$%&）
      const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&])[\da-zA-Z!@#$%&]{8,}$/
      if (regex.test(value)) {
        callback()
      } else {
        callback(
          new Error('密码必须8位数以上且包含大小写字母、数字、符号（!@#$%&）'),
        )
      }
    }
    return {
      //总表单数据
      formData: {
        relevanceClient: '', //关联客户
        relevanceProject: '', //关联项目
        initialPassword: 1, //密码设置方式--保存不需要传
        password: '', //初始密码
        serviceAuthority: '', //服务组授权
        indate: 5, //有效期
      },
      //总表单字段内容
      formFields: [
        {
          labelName: '用户信息设置：',
          field: 'userInfo',
          type: 'slot',
          placeholder: '请输入角色名称',
          position: 'left',
          labelWidth: '110px',
          maxlength: 30,
          span: 24,
          requiredIcon: true,
        },
        {
          labelName: ' ',
          labelWidth: '110px',
          type: 'button',
          span: 24,
          position: 'left',
          btnList: [
            {
              type: '',
              label: '新增用户',
              size: 'mini',
              click: () => this.addUser(),
              style: {
                color: '#66b1ff',
              },
            },
          ],
        },
        {
          labelName: '关联客户：',
          field: 'relevanceClient',
          type: 'select',
          position: 'left',
          optionValue: 'label',
          labelWidth: '110px',
          width: '280px',
          placeholder: '请选择',
          span: 24,
          change: (row) => this.clientChange(row),
        },
        {
          labelName: '关联项目：',
          field: 'relevanceProject',
          type: 'select',
          position: 'left',
          labelWidth: '110px',
          width: '280px',
          placeholder: '请选择',
          span: 24,
        },
        {
          labelName: '初始密码设置：',
          field: 'initialPassword',
          type: 'radio',
          position: 'left',
          labelWidth: '110px',
          requiredIcon: true,
          change: (row) => this.initialPasswordChange(row),
          radios: [
            {
              label: '自动生成初始密码',
              value: 1,
            },
            {
              label: '指定初始密码',
              value: 2,
            },
          ],
          span: 24,
        },
        {
          labelName: ' ',
          field: 'password',
          type: 'input',
          placeholder: '请输入密码',
          position: 'left',
          labelWidth: '110px',
          width: '280px',
          maxlength: 16,
          disabled: () => this.passwordControl(),
          span: 24,
          requiredIcon: false,
          rules: [
            { required: true, message: '请输入密码', trigger: 'change' },
            { validator: validatePassWord },
          ],
          //插槽设置
          slotOptions: {
            slot: true,
            slotType: 'append',
            isOnline: true,
          },
        },
        {
          labelName: '服务组授权：',
          field: 'serviceAuthority',
          type: 'select',
          position: 'left',
          labelWidth: '110px',
          width: '280px',
          optionLabel: 'serviceGroupName',
          optionValue: 'serviceGroupId',
          placeholder: '请选择',
          //插槽设置
          slotOptions: {
            slot: true,
            slotType: 'append',
          },
          span: 24,
        },
        {
          labelName: '有效期：',
          field: 'indate',
          type: 'select',
          position: 'left',
          labelWidth: '110px',
          width: '280px',
          placeholder: '请选择',
          options: [
            {
              label: '半年',
              value: 5,
            },
            {
              label: '1年',
              value: 1,
            },
            {
              label: '2年',
              value: 2,
            },
            {
              label: '3年',
              value: 3,
            },
            {
              label: '长期',
              value: 4,
            },
          ],
          span: 24,
          rules: [
            { required: true, message: '请选择有效期', trigger: 'change' },
          ],
        },
      ],
      relevanceClientData: [], //关联客户下拉框数据
      relevanceProjectData: [], //关联项目下拉框数据
      //用户信息设置表单
      childFormData: {
        list: [
          {
            userName: '',
            acName: '',
            roleId: '',
            phone: '',
            email: '',
            remark: '',
          },
        ],
      },
      roleTypeList: [], //用户角色下拉框数据
      rules1: {
        userName: { required: true, message: '请输入', trigger: 'blur' },
        acName: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator: validateAcName },
        ],
        roleId: { required: true, message: '请选择', trigger: 'change' },
        phone: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur',
          },
          { validator: validatelinkPhone },
        ],
        email: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator: validateEmail },
        ],
      },
    }
  },
  watch: {},
  created() {
    this.initData()
  },
  methods: {
    // 获取下拉列表
    initData() {
      //关联项目
      getCustomerProjectList().then((res) => {
        if (res.data.code === '0') {
          this.relevanceClientData = res.data.data
          this.$set(
            this.getComponent('relevanceClient', 'formFields'),
            'options',
            this.relevanceClientData,
          )
        }
      })
      //用户角色
      getRoleByCondition({}).then((res) => {
        if (res.data.code === '0') {
          this.roleTypeList = res.data.data
        }
      })
      //服务组授权
      getServiceGroupByCondition({}).then((res) => {
        if (res.data.code === '0') {
          this.$set(
            this.getComponent('serviceAuthority', 'formFields'),
            'options',
            res.data.data,
          )
        }
      })
    },
    //关联客户选择事件
    clientChange(val) {
      this.formData.relevanceProject = ''
      this.$set(
        this.getComponent('relevanceProject', 'formFields'),
        'options',
        [],
      )
      if (val) {
        this.relevanceProjectData = this.relevanceClientData?.find(
          (el, index) => el.value == this.formData.relevanceClient,
        ).children
        this.$set(
          this.getComponent('relevanceProject', 'formFields'),
          'options',
          this.relevanceProjectData,
        )
      }
    },
    //初始密码设置change事件
    initialPasswordChange(val) {
      this.formData.password = ''
    },
    //密码输入框禁用方法
    passwordControl() {
      if (this.formData.initialPassword == 1) {
        return true
      } else {
        return false
      }
    },
    // 随机生成密码
    createPassword() {
      this.formData.password = this.randPassword()
    },
    //新增用户
    addUser() {
      let add = {
        userName: '',
        roleId: '',
        phone: '',
        email: '',
        remark: '',
      }
      if (this.childFormData.list.length >= 10) {
        this.$message.warning('最多不能超过10项')
        return
      }
      this.childFormData.list.push(add)
    },
    //删除用户
    delUser(index) {
      if (this.childFormData.list.length < 2) {
        this.$message.warning('至少保留一名用户')
        return
      }
      this.childFormData.list.splice(index, 1)
    },
    //登陆账号blur事件--不能输入重复相同账号
    acNameBlur(index, val) {
      this.childFormData.list.forEach((el, idx) => {
        if (index !== idx && val == el.acName) {
          this.childFormData.list[index].acName = ''
          this.$message({
            type: 'warning',
            message: '不能重复添加账号！',
            direction: 2000,
          })
        }
      })
    },
    // 取消
    cancel(formName) {
      this.$router.back()
    },
    //确认
    confirm() {
      let childValid = false
      let indate = ''
      switch (this.formData.indate) {
        case 1:
          indate = getYear() + ' 23:59:59'
          break
        case 2:
          indate = getYear('', 2) + ' 23:59:59'
          break
        case 3:
          indate = getYear('', 3) + ' 23:59:59'
          break
        case 4:
          indate = '2099-12-31 23:59:59'
          break
        case 5:
          indate = getYear('', 0.5) + ' 23:59:59'
          break
      }
      this.$refs.childFormData.validate((valid) => {
        if (valid) {
          childValid = true
        }
      })
      this.$refs.formData.validate().then((valid) => {
        if (valid && childValid) {
          let password = encryptDate(this.formData.password)
          const params = {
            password: password,
            projectId: this.formData.relevanceProject,
            serviceGroupId: this.formData.serviceAuthority,
            userList: this.childFormData.list,
            validPeriod: indate,
          }
          addUser(params).then((res) => {
            if (res.data.code == 0) {
              this.$message.success('新增成功')
              this.$router.push('/userManagement')
            }
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请完善表单..',
          })
        }
      })
    },
  },
}
</script>

<style scoped lang="scss">
.title_box {
  padding: 10px;
  background-color: #f1f1f1;
  margin-bottom: 15px;
}
.userInfo_box {
  min-height: 80px;
  max-height: 165px;
  padding: 10px 0 20px 5px;
  overflow: auto;
  border: 1px #f1f1f1 solid;
}
.childFormData_box {
  height: 50px;
  margin-bottom: 15px;
}
.footer {
  display: flex;
  justify-content: flex-end;
}
::v-deep .noFirst .el-form-item__label:before {
  display: none;
}
</style>
