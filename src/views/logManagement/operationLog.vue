<!-- 操作日志 -->
<template>
  <div>
    <el-card class="fatherBox">
      <!-- 表单 -->
      <os-form :formFields="formFields" :formData="formData" />
      <!-- 表格展示 -->
      <os-table
        ref="table"
        :tableData="tableData"
        :tableCols="tableCols"
        :page="page"
        @pageChanged="pageChanged"
      ></os-table>
    </el-card>
  </div>
</template>

<script>
import { selectServiceGroupByPage, getRoleByCondition } from '@/api/capacityApi'
import checkbox from '@/components/button/checkBox'
export default {
  name: 'serviceGroupManagement',
  components: { checkbox },
  data() {
    return {
      //form绑定数据
      formData: {
        userName: '',
        project: '',
        role: '',
        timeGranularity: '',
        date: '',
      },
      //form内容--字段
      formFields: [
        {
          labelName: '',
          field: 'userName',
          type: 'input',
          placeholder: '请输入用户名',
          span: 5,
        },
        {
          labelName: '',
          field: 'project',
          type: 'select',
          placeholder: '请选择项目',
          span: 5,
        },
        {
          labelName: '',
          field: 'role',
          type: 'select',
          placeholder: '请选择角色',
          optionLabel: 'roleName',
          optionValue: 'roleId',
          filter: [
            { label: '普通用户', value: 0 },
            { label: '管理员', value: 1 },
            { label: '运营', value: 2 },
            { label: '项目经理', value: 3 },
          ],
          span: 5,
        },
        {
          labelName: '',
          field: 'date',
          type: 'date',
          // dateType: 'years',
          // defaultTime: ['00:00:00', '23:59:59'],
          unlinkPanels: true,
          placeholder: '请选择时间',
          pickerOptions_preset: {
            disabledDate: [0, '+'],
            shortcuts: [-1, -7, -30, -90], //快捷键按钮
          },
          span: 5,
        },
        {
          type: 'button',
          span: 4,
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
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
      },
      //表格字段
      tableCols: [
        { prop: 'serviceGroupName', label: '操作时间' },
        { prop: 'remark', label: '操作事件' },
        { prop: 'name', label: '姓名' },
        { prop: 'userName', label: '用户名' },
        { prop: 'status', label: '状态' },
        { prop: 'idType', label: '账号类型' },
        { prop: 'role', label: '角色' },
        { prop: 'projectName', label: '项目名称' },
        { prop: 'operationDescription', label: '操作描述' },
      ],
      tableData: [], //表格数据
    }
  },
  created() {
    this.getRoleList()
    this.getList()
  },
  methods: {
    // 获取资源列表
    getList(isPage) {
      console.log(this.formData.date, 'formData')
      return
      if (isPage !== true) {
        this.page.pageIndex = 1
      }
      const params = {
        pageNum: this.page.pageIndex,
        pageSize: this.page.pageSize,
        serviceGroupName: this.formData.serviceGroupName,
      }
      selectServiceGroupByPage(params).then((res) => {
        if (res.data.code === '0') {
          let data = res.data.data.records
          if (data.length > 0) {
            data.forEach((e) => {
              e.relevanceService = e.assocService.length
              e.relevanceUser = e.assocUser.length
            })
          }
          this.tableData = data
          this.page.total = res.data.data.total
        }
      })
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
</style>
