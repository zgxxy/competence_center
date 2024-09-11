<!-- 角色管理 -->
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
      />
    </el-card>
    <addRole
      :dialog-visible.sync="dialogVisible"
      :dialogData="dialogData"
      @dialogVisible="closeFrom"
    ></addRole>
    <role-detail
      :dialog-visible.sync="detailDialogVisible"
      :dialogData="detailDialogData"
      @dialogVisible="closeFrom1"
    ></role-detail>
  </div>
</template>

<script>
import { selectRoleByPage } from '@/api/capacityApi'
import addRole from './components/addRole.vue'
import roleDetail from './components/roleDetail.vue'

export default {
  name: 'roleManagement',
  components: {
    addRole,
    roleDetail,
  },
  data() {
    return {
      dialogVisible: false,
      detailDialogVisible: false,
      dialogData: {},
      detailDialogData: {},
      //form绑定数据
      formData: {
        roleName: '',
      },
      //form内容--字段
      formFields: [
        {
          type: 'button',
          span: 12,
          position: 'left',
          btnList: [
            {
              type: 'primary',
              label: '新建角色',
              size: 'mini',
              click: (row) => this.addRole(),
              show: this.showComputed('addRole'),
            },
          ],
        },
        {
          labelName: '',
          field: 'roleName',
          type: 'input',
          placeholder: '请输入角色名称或ID',
          blur: this.getList,
          suffixOptions: {
            isSuffix: true,
            click: this.getList,
          },
          span: 12,
        },
      ],
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
      },
      //表格字段
      tableCols: [
        { prop: 'roleName', label: '角色名称' },
        { prop: 'roleId', label: '角色ID' },
        // { prop: 'relevanceNum', label: '关联用户' },
        { prop: 'roleDescription', label: '角色描述' },
        { prop: 'createTime', label: '创建时间' },
        {
          label: '操作',
          fixed: 'right',
          width: 110,
          comps: [
            {
              type: 'button',
              btnType: 'text',
              labelName: '查看',
              click: 'check({})',
              show: this.showComputed('roleDetail'),
            },
            {
              type: 'button',
              btnType: 'text',
              labelName: '编辑',
              click: 'edit({})',
              show: this.showComputed('roleRelevanceStrategy'),
            },
          ],
        },
      ],
      tableData: [], //表格数据
    }
  },
  created() {
    this.getList()
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
        roleName: this.formData.roleName,
      }
      selectRoleByPage(params).then((res) => {
        if (res.data.code === '0') {
          this.tableData = res.data.data.records
          this.page.total = res.data.data.total
        }
      })
    },
    // 查看
    check(row) {
      this.detailDialogData = row
      this.detailDialogVisible = true
    },
    // 新建角色
    addRole() {
      function obj() {}
      this.dialogData = new obj()
      this.dialogData.edit = false
      this.dialogVisible = true
    },
    //关闭弹窗
    closeFrom(val, num) {
      this.dialogVisible = val
      if (num) {
        this.getList()
      }
    },
    closeFrom1(val) {
      this.detailDialogVisible = val
    },
    // 编辑
    edit(row) {
      this.dialogData = row
      this.dialogData.edit = true
      this.dialogVisible = true
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
