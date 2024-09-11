<!-- osForm、osTatle组件测试页面 -->
<template>
  <div>
    <!-- 表格展示 -->
    <el-card class="fatherBox">
      <os-form :formFields="formFields" :formData="formData">
        <template slot="userName-append">
          <span style="font-size: 12px; color: gray;">
            这个是用户名的插槽
          </span>
        </template>
      </os-form>
      <os-table
        ref="table"
        :tableData="tableData"
        :tableCols="tableCols"
        :tableOptions="tableOptions"
        :page="page"
        :callbackObj="callbackObj"
        :selectable="selectable"
        :tableRowClassName="tableRowClassName"
        @pageChanged="pageChanged"
        expand
      >
        <template slot="price" slot-scope="props">
          <span style="color: #c6e2ff;">{{ props.row.price }}</span>
        </template>
        <template slot="expand" slot-scope="props">
          <os-table
            :maxHeight="180"
            v-if="childTable == '1'"
            :tableData="props.row.relevanceData"
            :tableCols="tableCols1"
            :page="{ isPage: false }"
          />
          <os-table
            v-if="childTable == '2'"
            :tableData="props.row.reportData"
            :tableCols="tableCols2"
            :page="{ isPage: false }"
          />
        </template>
      </os-table>
    </el-card>
  </div>
</template>

<script>
import { powerList, deletePowerPool } from '@/api/capacityApi'
import os_table_data from '/public/testData/os_table_data.json'
export default {
  components: {},
  filters: {},
  data() {
    return {
      childTable: 0,
      formData: {
        name: '',
        userName: '',
        relevancecustomer: '',
        role: '',
        date: '2024-03-12',
      },
      formFields: [
        {
          labelName: '姓名：',
          field: 'name',
          type: 'input',
          blur: this.nameChange,
          suffixIcon: 'el-icon-search',
          span: 6,
          // labelWidth: '50px',
          // enter: this.nameChange,
          // suffixOptions: {
          //   isAppend: true,
          //   click: this.nameChange,
          // },
        },
        {
          labelName: '用户名：',
          field: 'userName',
          placeholder: '请输入',
          type: 'input',
          suffixOptions: {
            isSuffix: true,
            click: this.getList,
          },
          //插槽设置
          slotOptions: {
            slot: true,
            slotType: 'append',
            // isOnline: true, //是否同一行
          },
          span: 6,
        },
        {
          labelName: '关联客户：',
          field: 'relevancecustomer',
          type: 'select',
          span: 6,
        },
        {
          labelName: '角色：',
          field: 'role',
          type: 'select',
          span: 6,
        },
        {
          labelName: '日期',
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
          span: 6,
        },
        {
          type: 'button',
          span: 24,
          btnList: [
            {
              type: 'primary',
              label: '查询',
              size: 'mini',
              icon: 'el-icon-search',
              click: (row) => this.search(),
              show: this.showBtn,
            },
            {
              type: 'info',
              label: '重置',
              size: 'mini',
              icon: 'el-icon-setting',
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
      tableOptions: {
        multipleSelect: true,
      },
      callbackObj: {
        //选择事件
        onCheckSelectChange: (response) => {
          this.onCheckSelectChange(response)
        },
        //单击行事件
        onRowClick: (response) => {},
        //双击行事件
        onRowDbClick: (response) => {},
      },
      tableCols1: [
        { prop: 'type', label: '类型' },
        { prop: 'color', label: '颜色' },
        { prop: 'level', label: '等级' },
      ],
      tableCols2: [
        { prop: 'name', label: '姓名' },
        { prop: 'age', label: '年龄' },
      ],
      tableCols: [
        { prop: 'dataSource', label: '数据来源' },
        {
          prop: 'crowdName',
          label: '人群名称',
        },
        {
          prop: 'status',
          label: '状态',
          filter: [
            { label: '已禁用', value: 0 },
            { label: '启用中', value: 1 },
            { label: '已过期', value: 2 },
          ],
          style: (row) => this.statusComputed(row, 1),
        },
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
          prop: 'isApp',
          label: '是否App',
          isTransform: true,
          style: (row) => this.statusComputed(row, 2),
        },
        { prop: 'isThird', label: '是否第三方', isTransform: true },
        { prop: 'sampleSize', label: '数据量' },
        {
          prop: 'reportNum',
          label: '报告数量',
          comps: [
            {
              type: 'link',
              click: 'openChild({index:1})',
            },
          ],
        },
        {
          prop: 'relevanceNum',
          label: '关联数量',
          comps: [
            {
              type: 'link',
              click: 'openChild({index:2})',
            },
          ],
        },
        { prop: 'price', label: '单价', type: 'slot' },
        {
          // hidden: true,
          label: '操作',
          width: 150,
          comps: [
            {
              type: 'button',
              btnType: 'text',
              labelName: '绑定角色',
              click: 'binding({})',
              dataOptions: {
                deleteName: '绑定角色',
                deleteKey: 'role',
                deleteVal: ['0'],
              },
            },
            {
              type: 'button',
              btnType: 'text',
              labelName: '禁用',
              click: 'updateStatus({})',
            },
            {
              type: 'button',
              btnType: 'text',
              labelName: '删除',
              disabled: false,
              click: 'delete({})',
              // dataOptions: {
              // deleteName: '删除',
              // deleteKey: 'dataSource',
              // deleteVal: ['生态共享'],
              // deleteKey1: 'crowdName',
              // deleteVal1: ['号百各。'],
              // },
            },
          ],
        },
      ], //表格字段
      tableData: [], //表格数据
    }
  },
  created() {
    this.getList()
  },
  methods: {
    //状态列样式设置
    statusComputed(row, type) {
      console.log(row, 'statusComputed')
      let data = row.status
      let data1 = row.isApp
      if (type == 1) {
        switch (data) {
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
      } else {
        switch (data1) {
          case '0':
            return 'color:#d9001b'
            break
          case '1':
            return 'color:#67C23A'
            break
        }
      }
    },
    // 获取资源列表
    getList(isPage) {
      this.$message.success('查询成功')
      this.tableData = os_table_data
      this.page.total = this.tableData.length
      this.$set(
        this.getComponent('relevancecustomer', 'formFields'),
        'options',
        [
          { label: '全部', value: '全部' },
          { label: '东风日产', value: '东风日产' },
          { label: '东风本田', value: '东风本田' },
        ],
      )
      this.$set(this.getComponent('role', 'formFields'), 'options', [
        { label: '全部', value: '' },
        { label: '普通用户', value: 0 },
        { label: '管理员', value: 1 },
        { label: '运营', value: 2 },
        { label: '项目经理', value: 3 },
      ])
    },
    nameChange(val) {
      console.log(val, '姓名change')
    },
    //设置表格行背景色
    tableRowClassName({ row, rowIndex }) {
      //管理员：绿色  项目经理：红色
      if (row.role == 3) {
        return 'red-row'
      } else if (row.role == 1) {
        return 'green-row'
      }
      return ''
    },
    //按钮显示判断
    showBtn() {
      if (this.$store.getters.userInfo.userName == '管理员') {
        return true
      } else {
        return false
      }
    },
    //禁选判断
    selectable(row, index) {
      //isThird==='1'可选
      return row.isApp === '1'
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
    // 新建
    add() {
      // this.$router.push('/newResource')
    },
    // 启用禁用状态更新
    updateStatus(num, row) {
      console.log('num=', num)
      console.log('row=', row)
      console.log('checkListed', this.checkListed)
    },
    onCheckSelectChange(row) {
      console.log(row, '选中数据')
    },
    // 删除
    delete(row) {
      console.log('row', row)
      this.dialogVisible = true
    },
    pageChanged(val) {
      this.page.pageIndex = val.pageIndex
      this.page.pageSize = val.pageSize
      this.getList()
    },
  },
}
</script>

<style scoped lang="scss">
.el-card {
  min-height: 80vh;
}
::v-deep .el-table .red-row {
  background: #d9001b50 !important;
}

::v-deep .el-table .green-row {
  background: #67c23a50 !important;
}
</style>
