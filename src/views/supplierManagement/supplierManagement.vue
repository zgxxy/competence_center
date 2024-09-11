<!-- 供应商管理 -->
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
        </template>
      </os-table>
    </el-card>
    <!-- 关联角色弹窗 -->
    <el-dialog
      title="自定义列表字段"
      :visible="dialogVisible"
      width="50%"
      @close="closeFrom"
    >
      <div class="title">请勾选您想显示的列表详细信息字段</div>
      <div class="checkbox_box">
        <el-checkbox-group v-model="setData" v-if="dataList.length > 0">
          <el-checkbox
            v-for="(item, index) in dataList"
            :key="index + 'checkbox'"
            :label="item.value"
          >
            <labelName
              :label-name="item.label"
              label-style="font-weight: 300;"
              tooltip-min-width="80px"
            />
          </el-checkbox>
        </el-checkbox-group>
        <el-empty v-else description="暂无数据" style="height: 100%;" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm">
          确认
        </el-button>
        <el-button type="" @click="closeFrom">
          取消
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { selectServiceGroupByPage } from '@/api/capacityApi'

export default {
  name: 'supplierManagement',
  components: {
    labelName: () => import('@/components/form/labelName'), //labelName组件
  },
  data() {
    return {
      childTable: 0,
      //弹窗
      dialogVisible: false,
      dialogData_set: {}, //自定义设置弹窗数据
      setData: [],
      dataList: [],
      //form绑定数据
      formData: {},
      //form内容--字段
      formFields: [
        {
          type: 'button',
          span: 12,
          position: 'left',
          btnList: [
            {
              type: 'primary',
              label: '新建供应商',
              size: 'mini',
              click: this.addServiceGroup,
              // show: this.showComputed('addServiceGroup'),//待定
            },
          ],
        },
        {
          type: 'button',
          span: 12,
          btnList: [
            {
              label: '设置',
              icon: 'el-icon-setting',
              size: 'mini',
              click: this.openSet,
              // show: this.showComputed('addServiceGroup'),//待定
              style: {
                'font-size': '16px',
              },
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
        // multipleSelect: true,
      },
      //表格字段
      tableCols: [
        {
          prop: 'supplierName',
          label: '供应商名称',
          comps: [
            {
              type: 'link',
              click: 'goDetail({})',
            },
          ],
        },
        { prop: 'supplierId', label: '供应商ID' },
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
          prop: 'contact',
          label: '联系人',
        },
        {
          prop: 'phone',
          label: '联系方式',
        },
        {
          prop: 'principal',
          label: '负责人',
        },
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
        {
          prop: 'remark',
          label: '备注',
        },
        {
          label: '操作',
          width: 150,
          comps: [
            {
              type: 'button',
              btnType: 'text',
              labelName: '新增服务资源',
              click: 'addServiceResource({})',
              // show: this.showComputed('serviceGroupRelevanceResource'),//待定
            },
            {
              type: 'button',
              btnType: 'text',
              labelName: '编辑',
              click: 'edit({})',
              // show: this.showComputed('serviceGroupRelevanceUser'),//待定
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
      this.tableData = [
        {
          supplierId: '1762296954379067393',
          supplierName: '测试服务组5',
          createTime: '2024-02-27 10:01:50',
          remark: '5',
          assocService: [
            {
              powerId: '1727924465635233793',
              powerName: '验证关联项目后的资源能否被删除',
              isEnabled: null,
              type: '1',
              createTime: '2023-11-24 13:37:51',
              updateTime: '2023-11-28 10:23:37',
              remark: null,
              deliveryMode: 'API',
              status: '0',
              documentLink:
                'http://172.26.161.226:36287/#/resourceDetail?powerId=1727924465635233793&powerName=%E9%AA%8C%E8%AF%81%E5%85%B3%E8%81%94%E9%A1%B9%E7%9B%AE%E5%90%8E%E7%9A%84%E8%B5%84%E6%BA%90%E8%83%BD%E5%90%A6%E8%A2%AB%E5%88%A0%E9%99%A4',
              isChecked: null,
            },
            {
              powerId: '1727936356768092161',
              powerName: '底盘域控系统(测试勿动)',
              isEnabled: null,
              type: '1',
              createTime: '2023-11-24 14:25:06',
              updateTime: '2023-11-24 14:25:06',
              remark: null,
              deliveryMode: 'SAAS',
              status: '1',
              documentLink: 'http://172.26.161.226:36287/#/newResource',
              isChecked: null,
            },
            {
              powerId: '1705138989245321219',
              powerName: '短信',
              isEnabled: null,
              type: '1',
              createTime: '2023-09-22 16:36:30',
              updateTime: '2023-11-21 09:29:48',
              remark: null,
              deliveryMode: 'API',
              status: '1',
              documentLink: 'https://op.szlanyou.com',
              isChecked: null,
            },
          ],
          assocUser: [],
        },
        {
          supplierId: '1742812903799795713',
          supplierName: '测试服务组',
          createTime: '2024-01-04 15:39:11',
          remark: '测试',
          assocService: [
            {
              powerId: '1705138989245321218',
              powerName: 'OCR文字识别',
              isEnabled: null,
              type: '1',
              createTime: '2023-09-22 16:36:30',
              updateTime: '2023-11-21 09:29:37',
              remark: null,
              deliveryMode: 'API',
              status: '1',
              documentLink: 'https://op.szlanyou.com',
              isChecked: null,
            },
            {
              powerId: '1705138989245321219',
              powerName: '短信',
              isEnabled: null,
              type: '1',
              createTime: '2023-09-22 16:36:30',
              updateTime: '2023-11-21 09:29:48',
              remark: null,
              deliveryMode: 'API',
              status: '1',
              documentLink: 'https://op.szlanyou.com',
              isChecked: null,
            },
          ],
          assocUser: [
            {
              userId: '1760586788901310466',
              userName: '马冬',
              userType: '1',
              acName: 'madong',
              loginType: '1',
              phone: '15813825030',
              email: 'madong@szlanyou.com',
              serviceGroupId: '1742812903799795713',
              status: '1',
              role: null,
              roleId: '666',
              remark: null,
              validPeriod: '2099-12-31 23:59:59',
              createTime: '2024-02-22 16:46:15',
              createUserId: '1752624796453249026',
              updateTime: '2024-02-22 16:46:15',
              joinProjectTime: null,
              updateUserId: '1752624796453249026',
            },
          ],
        },
      ]
      this.tableData.forEach((e) => {
        e.relevanceService = e.assocService.length
      })
      return
      const params = {
        pageNum: this.page.pageIndex,
        pageSize: this.page.pageSize,
        supplierName: this.formData.supplierName,
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
    // 新建角色
    addServiceGroup() {
      this.$router.push('/supplierManagement/addSupplier')
    },
    //跳转详情页
    goDetail(row) {
      this.$router.push({
        path: '/supplierManagement/supplierDetail',
        query: {},
      })
    },
    //新增服务资源
    addServiceResource() {},
    // 编辑
    edit(row) {},
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
    openSet() {
      this.dialogVisible = true
      this.dataList = [
        { label: '供应商ID', value: '供应商ID' },
        { label: '供应商名称', value: '供应商名称' },
        { label: '关联服务', value: '关联服务' },
        { label: '服务名称', value: '服务名称' },
        { label: '合作开始时间', value: '合作开始时间' },
        { label: '合作结束时间', value: '合作结束时间' },
        { label: '计费方式', value: '计费方式' },
      ]
    },
    confirm() {
      console.log(this.setData, 'setData')
    },
    //关闭弹窗
    closeFrom() {
      this.dialogVisible = false
      this.setData = []
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
.title {
  background: #f9f9f9;
  color: #409eff;
  padding: 5px;
}
.checkbox_box {
  padding: 10px 15px;
  max-height: 170px;
  // overflow: auto;
}
::v-deep .el-checkbox__label {
  width: 130px;
  line-height: 25px;
}
</style>
