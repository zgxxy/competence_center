<!-- 用户管理 -->
<template>
  <div>
    <el-card class="fatherBox">
      <el-button
        v-if="showComputed('addUser')"
        type="primary"
        size="mini"
        @click="add"
      >
        新建用户
      </el-button>
      <!-- 表单 -->
      <div class="form_box">
        <os-form :formFields="formFields" :formData="formData" />
      </div>
      <!-- 表格展示 -->
      <os-table
        ref="table"
        :tableData="tableData"
        :tableCols="tableCols"
        :page="page"
        @pageChanged="pageChanged"
      />
    </el-card>
    <el-dialog
      title="绑定角色"
      :visible="dialogVisible"
      width="40%"
      @close="closeFrom"
    >
      <os-form
        ref="bindForm"
        :formFields="bindFormFields"
        :formData="bindFormData"
      />
    </el-dialog>
    <el-dialog
      title="续期"
      :visible="dateDialogVisible"
      width="40%"
      @close="closeFrom1"
    >
      <os-form
        ref="renewalForm"
        :formFields="renewalFormFields"
        :formData="renewalFormData"
      />
    </el-dialog>
  </div>
</template>

<script>
import {
  userSelectByPage,
  getRoleByCondition,
  disableUser,
  userBoundRole,
  renewUser,
} from '@/api/capacityApi'
import { getYear, getMonth } from '@/utils/public'
export default {
  name: 'userManagement',
  components: {},
  filters: {},
  data() {
    return {
      dialogVisible: false, //绑定角色弹窗
      dateDialogVisible: false, //续期弹窗
      roleData: [],
      bindRowData: {},
      dateRowData: {},
      //查询条件form绑定数据
      formData: {
        userName: '',
        acName: '',
        relevancecustomer: '',
        role: '',
      },
      //查询条件form内容--字段
      formFields: [
        {
          labelName: '用户名：',
          field: 'userName',
          type: 'input',
          labelWidth: '55px',
          span: 6,
        },
        {
          labelName: '账号：',
          field: 'acName',
          type: 'input',
          labelWidth: '40px',
          span: 6,
        },
        {
          show: false,
          labelName: '关联客户：',
          field: 'relevancecustomer',
          type: 'select',
          labelWidth: '70px',
          span: 6,
          options: [
            { label: '东风日产', value: '东风日产' },
            { label: '东风本田', value: '东风本田' },
          ],
        },
        {
          labelName: '角色：',
          field: 'role',
          type: 'select',
          optionLabel: 'roleName',
          optionValue: 'roleId',
          labelWidth: '40px',
          span: 6,
        },
        {
          type: 'button',
          span: 6,
          btnList: [
            {
              type: 'primary',
              label: '查询',
              size: 'mini',
              click: this.getList,
            },
            {
              label: '重置',
              size: 'mini',
              click: 'reset',
            },
          ],
        },
      ],
      //绑定用户弹窗form绑定数据
      bindFormData: {
        userName: '',
        postName: '',
        roleName: '',
      },
      //绑定用户弹窗form--字段内容
      bindFormFields: [
        {
          labelName: '用户名称：',
          field: 'userName',
          type: 'input',
          position: 'center',
          disabled: true,
          span: 24,
        },
        {
          labelName: '岗位名称：',
          field: 'postName',
          type: 'input',
          position: 'center',
          disabled: true,
          show: false,
          span: 24,
        },
        {
          labelName: '角色名称：',
          field: 'roleName',
          type: 'select',
          optionLabel: 'roleName',
          optionValue: 'roleId',
          position: 'center',
          span: 24,
        },
        {
          type: 'button',
          span: 22,
          btnList: [
            {
              type: 'primary',
              label: '绑定',
              size: 'mini',
              click: () => this.binding(),
            },
            {
              label: '取消',
              size: 'mini',
              click: () => this.closeFrom(),
            },
          ],
        },
      ],
      renewalFormData: {
        userName: '',
        validPeriod: '',
        overtime: '',
      },
      renewalFormFields: [
        {
          labelName: '用户名称：',
          field: 'userName',
          type: 'input',
          position: 'center',
          disabled: true,
          span: 24,
        },
        {
          labelName: '有效期限：',
          field: 'validPeriod',
          type: 'input',
          position: 'center',
          disabled: true,
          span: 24,
        },
        {
          labelName: '续期：',
          field: 'overtime',
          type: 'select',
          position: 'center',
          placeholder: '请选择',
          options: [
            {
              label: '30天',
              value: 4,
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
          ],
          span: 24,
          rules: [
            { required: true, message: '请选择有效期', trigger: 'change' },
          ],
        },
        {
          type: 'button',
          span: 22,
          btnList: [
            {
              type: 'primary',
              label: '续期',
              size: 'mini',
              click: () => this.renewal(),
            },
            {
              label: '取消',
              size: 'mini',
              click: () => this.closeFrom1(),
            },
          ],
        },
      ],
      page: {
        pageIndex: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30, 50],
        total: 0,
      },
      //表格字段
      tableCols: [
        { prop: 'userName', label: '用户名' },
        {
          prop: 'userType',
          label: '用户类型',
          filter: [
            { label: '内部', value: 1 },
            { label: '外部客户', value: 2 },
            { label: '测试', value: 3 },
          ],
        },
        { prop: 'userId', label: '用户ID' },
        { prop: 'acName', label: '账号' },
        {
          prop: 'loginType',
          label: '登录方式',
          filter: [
            { label: '域账号', value: 1 },
            { label: '账号密码', value: 2 },
          ],
        },
        { prop: 'createTime', label: '创建时间', width: 150 },
        { prop: 'validPeriod', label: '有效期限', width: 150 },
        {
          prop: 'status',
          label: '状态',
          filter: [
            { label: '已禁用', value: '0' },
            { label: '启用中', value: '1' },
            { label: '已过期', value: '2' },
          ],
          style: this.statusComputed,
        },
        { prop: 'phone', label: '关联手机', phoneHide: true },
        { prop: 'email', label: '关联邮箱' },
        // {
        //   prop: 'relevancecustomer',
        //   label: '关联客户',
        //   newLabel: 'dlrName',
        // },
        {
          prop: 'role',
          label: '角色',
          filter: [
            { label: '普通用户', value: 0 },
            { label: '管理员', value: 1 },
            { label: '运营', value: 2 },
            { label: '项目经理', value: 3 },
          ],
        },
        {
          label: '操作',
          fixed: 'right',
          width: 145,
          comps: [
            {
              type: 'button',
              btnType: 'text',
              labelName: '绑定角色',
              click: 'openBinding({})',
              show: this.showComputed('bindingRole'),
              dataOptions: {
                deleteName: '绑定角色',
                deleteKey: 'status',
                deleteVal: ['0'],
              },
            },
            {
              type: 'button',
              btnType: 'text',
              // btnType: 'warning',
              labelName: '禁用',
              click: 'updateStatus({type:0})',
              show: this.showComputed('updateUserStatus'),
              dataOptions: {
                deleteName: '禁用',
                deleteKey: 'status',
                deleteVal: ['0', '2'],
              },
            },
            {
              type: 'button',
              btnType: 'text',
              // btnType: 'success',
              labelName: '启用',
              click: 'updateStatus({type:1})',
              show: this.showComputed('updateUserStatus'),
              dataOptions: {
                deleteName: '启用',
                deleteKey: 'status',
                deleteVal: ['1', '2'],
              },
            },
            {
              type: 'button',
              btnType: 'text',
              labelName: '续期',
              click: 'openRenewal({})',
              show: this.showComputed('idRenewal'),
              dataOptions: {
                deleteName: '续期',
                deleteKey: 'userType',
                deleteVal: ['1'],
                deleteKey1: 'status',
                deleteVal1: ['0'],
              },
              // style: {
              //   background: '#dfc9f450',
              //   color: '#9e56e2',
              // },
            },
          ],
        },
      ],
      tableData: [], //表格数据
    }
  },
  mounted() {
    this.getList()
    this.getRoleList()
  },
  methods: {
    // 获取资源列表
    getList(isPage) {
      if (isPage !== true) {
        this.page.pageIndex = 1
      }
      const params = {
        pageNum: this.page.pageIndex,
        pageSize: this.page.pageSize,
        roleId: this.formData.role,
        userName: this.formData.userName,
        acName: this.formData.acName,
      }
      userSelectByPage(params).then((res) => {
        if (res.data.code === '0') {
          this.tableData = res.data.data.records
          this.page.total = res.data.data.total
        }
      })
    },
    //状态列样式设置
    statusComputed(row) {
      switch (row.status) {
        case '0':
          return 'color:#d9001b'
          break
        case '1':
          return 'color:#67C23A'
          break
        case '2':
          return 'color:gray'
          break
      }
    },
    getRoleList() {
      getRoleByCondition({ roleName: '' }).then((res) => {
        if (res.data.code === '0') {
          this.$set(
            this.getComponent('role', 'formFields'),
            'options',
            res.data.data,
          )
          this.roleData = res.data.data
        }
      })
    },
    // 绑定角色弹窗
    openBinding(row) {
      this.bindRowData = row
      Object.keys(this.bindFormData).map((item) => {
        this.bindFormData[item] = this.bindRowData[item]
      })
      this.bindFormData.roleName = this.bindRowData.roleId
      //弹窗角色名称下拉框赋值
      this.$set(
        this.getComponent('roleName', 'bindFormFields'),
        'options',
        this.roleData,
      )
      this.dialogVisible = true
    },
    closeFrom() {
      this.dialogVisible = false
      this.$refs.bindForm.emptyFormData()
    },
    //绑定角色
    binding() {
      let params = {
        roleId: this.bindFormData.roleName,
        userId: this.bindRowData.userId,
      }
      userBoundRole(params).then((res) => {
        if (res.data.code === '0') {
          this.$message.success('绑定角色成功')
          this.closeFrom()
          this.getList(true)
        }
      })
    },
    // 新建
    add() {
      this.$router.push('/userManagement/addUser')
    },
    // 启用禁用状态更新
    updateStatus(row, { type }) {
      let params = {
        status: type,
        userId: row.userId,
        validPeriod: row.validPeriod,
      }
      if (type == 0) {
        this.$confirm(
          `帐号禁用后将无法登录平台，为确保帐号的正常使用，请再次确认是否禁用帐号${
            '“' + row.userName + '”'
          }？`,
          '禁用提醒',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          },
        ).then(() => {
          disableUser(params).then((res) => {
            if (res.data.code === '0') {
              this.$message.success('禁用成功')
              this.getList(true)
            }
          })
        })
      } else {
        disableUser(params).then((res) => {
          if (res.data.code === '0') {
            this.$message.success('启用成功')
            this.getList(true)
          }
        })
      }
    },
    //续期弹窗
    openRenewal(row) {
      this.dateRowData = row
      Object.keys(this.renewalFormData).map((item) => {
        this.renewalFormData[item] = row[item]
      })
      this.dateDialogVisible = true
    },
    //续期
    renewal() {
      let validPeriod = ''
      let day =
        this.dateRowData.status == '2'
          ? new Date().getTime()
          : this.dateRowData.validPeriod
      this.$refs.renewalForm.validate().then((valid) => {
        if (valid) {
          switch (this.renewalFormData.overtime) {
            case 1:
              validPeriod = getYear(day) + ' 23:59:59'
              break
            case 2:
              validPeriod = getYear(day, 2) + ' 23:59:59'
              break
            case 3:
              validPeriod = getYear(day, 3) + ' 23:59:59'
              break
            case 4:
              validPeriod = getMonth(day) + ' 23:59:59'
              break
          }
          let params = {
            roleId: this.dateRowData.roleId,
            userId: this.dateRowData.userId,
            status: this.dateRowData.status,
            validPeriod: validPeriod,
          }
          renewUser(params).then((res) => {
            if (res.data.code === '0') {
              this.$message.success('续期成功')
              this.closeFrom1()
              this.getList(true)
            }
          })
        }
      })
    },
    //关闭续期弹窗
    closeFrom1() {
      this.dateDialogVisible = false
      this.$refs.renewalForm.emptyFormData()
    },
    pageChanged(val) {
      this.page.pageIndex = val.pageIndex
      this.page.pageSize = val.pageSize
      this.getList(true)
    },
  },
}
</script>

<style scoped lang="scss">
.el-card {
  min-height: 80vh;
}
.form_box {
  margin: 15px 0;
  padding: 15px 15px 0;
  background: #eef5ff;
  border-radius: 5px;
}
</style>
