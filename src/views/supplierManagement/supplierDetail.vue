<!-- 供应商详情 -->
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
        :tableOptions="tableOptions"
        :page="page"
        @pageChanged="pageChanged"
        expand
      >
        <template slot="expand" slot-scope="props">
          <os-table
            :maxHeight="230"
            v-if="childTable == '1'"
            :tableData="props.row.assocService"
            :tableCols="tableCols1"
            :page="{ isPage: false }"
          />
          <os-table
            :maxHeight="230"
            v-if="childTable == '2'"
            :tableData="props.row.assocUser"
            :tableCols="tableCols2"
            :page="{ isPage: false }"
          />
        </template>
      </os-table>
    </el-card>
  </div>
</template>

<script>
import {
  selectServiceGroupByPage,
  selectListByCondition,
  deleteServiceGroup,
  getServiceGroupUserList,
} from '@/api/capacityApi'
export default {
  name: 'serviceGroupManagement',
  components: {},
  data() {
    return {
      //form绑定数据
      formData: {
        serviceGroupName: '',
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
              label: '新建服务组',
              size: 'mini',
              click: (row) => this.addServiceGroup(),
              show: this.showComputed('addServiceGroup'),
            },
          ],
        },
        {
          labelName: '',
          field: 'serviceGroupName',
          type: 'input',
          placeholder: '搜索服务组名',
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
      tableOptions: {
        // multipleSelect: true,
      },
      //表格字段
      tableCols: [
        { prop: 'serviceGroupName', label: '服务组名称' },
        { prop: 'remark', label: '备注' },
        { prop: 'createTime', label: '创建时间' },
        {
          prop: 'relevanceService',
          label: '关联服务',
          comps: [
            {
              type: 'link',
              click: 'openChild({index:1})',
            },
          ],
        },
        {
          prop: 'relevanceUser',
          label: '关联用户',
          comps: [
            {
              type: 'link',
              click: 'openChild({index:2})',
            },
          ],
        },
        {
          // hidden: true,
          label: '操作',
          width: 150,
          comps: [
            {
              type: 'button',
              btnType: 'text',
              labelName: '编辑',
              click: 'edit({})',
              show: this.showComputed('serviceGroupRelevanceResource'),
            },
            {
              type: 'button',
              btnType: 'text',
              labelName: '关联用户',
              click: 'relevance({})',
              show: this.showComputed('serviceGroupRelevanceUser'),
            },
            {
              type: 'button',
              btnType: 'text',
              labelName: '删除',
              click: 'delete({})',
              show: this.showComputed('deleteServiceGroup'),
            },
          ],
        },
      ],
      tableData: [], //表格数据
      tableCols1: [
        { prop: 'powerName', label: '产品/服务名称' },
        {
          prop: 'type',
          label: '分类',
          filter: [
            { label: '基础能力类', value: '1' },
            { label: '--', value: '2' },
            { label: '--', value: '3' },
          ],
        },
        { prop: 'deliveryMode', label: '交付方式' },
      ],
      tableCols2: [
        { prop: 'userName', label: '产品/用户名称' },
        {
          prop: 'userType',
          label: '用户类型',
          filter: [
            { label: '内部', value: 1 },
            { label: '外部客户', value: 2 },
            { label: '测试', value: 3 },
          ],
        },
        { prop: 'acName', label: '账号' },
        {
          prop: 'status',
          label: '状态',
          filter: [
            { label: '已禁用', value: '0' },
            { label: '启用中', value: '1' },
            { label: '已过期', value: '2' },
          ],
        },
      ],
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
        serviceGroupName: this.formData.serviceGroupName,
      }
      selectServiceGroupByPage(params).then((res) => {
        if (res.data.code === '0') {
          let data = res.data.data.records
          if (data.length > 0) {
            data.forEach((e) => {
              e.relevanceService = e.assocService.length
              e.relevanceUser = e.assocUser.length || '0'
            })
          }
          this.tableData = data
          this.page.total = res.data.data.total
        }
      })
    },
    // 打开抽屉
    openChild(row, { index }) {
      const rowIndex = this.tableData.indexOf(row)
      this.tableData.forEach((item, idx) => {
        if (rowIndex !== idx) {
          this.$refs.table.openChildTable(item, false)
        }
      })
      this.$refs.table.openChildTable(row)
      this.childTable = index
    },
    delete(row) {
      this.$confirm('确定删除？', '删除提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        if (row.serviceGroupId) {
          deleteServiceGroup({
            serviceGroupId: row.serviceGroupId,
          }).then((res) => {
            if (res.data.code === '0') {
              this.$message.success('删除成功！')
              this.getList(true)
            }
          })
        }
      })
    },
    //打开关联用户弹窗
    relevance(row) {
      this.dialogData_user = row
      this.dialogData_user.rightData = []
      getServiceGroupUserList({
        serviceGroupId: row.serviceGroupId,
      }).then((res) => {
        if (res.data.code === '0') {
          res.data.data.map((item, index) => {
            this.dialogData_user.rightData.push(item.userId)
          })
        }
      })
      this.dialogVisible_user = true
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
