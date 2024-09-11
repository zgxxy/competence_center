<!-- 策略管理 -->
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
        :tableOptions="{ multipleSelect: true }"
        :page="page"
        :callbackObj="callbackObj"
        @pageChanged="pageChanged"
      />
    </el-card>
    <!-- 关联角色弹窗 -->
    <el-dialog
      :title="bindFormData.strategyName"
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
  </div>
</template>

<script>
import {
  selectStrategyByPage,
  getRoleByCondition,
  addRoleStrategyRelation,
  updateStrategyStatus,
  getRoleListByStrategyId,
} from '@/api/capacityApi'
export default {
  name: 'strategyMangement',
  components: {},
  data() {
    return {
      dialogVisible: false,
      tableSelectData: [], //表格选中数据
      //form绑定数据
      formData: {
        strategyName: '',
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
              label: '批量启用',
              size: 'mini',
              show: this.showComputed('updateStrategyStatus'),
              click: () => this.updateStatus('1'),
            },
            {
              type: 'info',
              label: '批量停用',
              size: 'mini',
              show: this.showComputed('updateStrategyStatus'),
              click: () => this.updateStatus('0'),
            },
          ],
        },
        {
          labelName: '',
          field: 'strategyName',
          placeholder: '请输入策略名称',
          type: 'input',
          suffixOptions: {
            isSuffix: true,
            click: this.getList,
          },
          span: 12,
        },
      ],
      //绑定角色弹窗form绑定数据
      bindFormData: {
        strategyName: '',
        strategyId: '',
        relevanceRole: [],
      },
      //绑定角色弹窗form--字段内容
      bindFormFields: [
        {
          labelName: '关联角色：',
          field: 'relevanceRole',
          type: 'select',
          position: 'center',
          placeholder: '请选择',
          multiple: true, //多选
          filterable: true, //可搜索
          clearable: false,
          optionLabel: 'roleName',
          optionValue: 'roleId',
          span: 24,
          rules: [{ required: true, message: '请选择角色', trigger: 'change' }],
        },
        {
          type: 'button',
          span: 22,
          btnList: [
            {
              type: 'primary',
              label: '确定',
              size: 'mini',
              click: () => this.confirm(),
            },
            {
              label: '取消',
              size: 'mini',
              click: () => this.closeFrom(),
            },
          ],
        },
      ],
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
      },
      //表格回调事件
      callbackObj: {
        //选择事件
        onCheckSelectChange: (response) => {
          this.tableSelectData = response
        },
      },
      //表格字段
      tableCols: [
        { prop: 'strategyName', label: '策略名称' },
        { prop: 'remark', label: '描述', width: 200 },
        {
          prop: 'status',
          label: '策略状态',
          filter: [
            { label: '已停用', value: 0 },
            { label: '启用中', value: 1 },
          ],
          style: this.statusComputed,
        },
        { prop: 'referenceCount', label: '引用次数' },
        { prop: 'type', label: '策略类型' },
        {
          label: '操作',
          fixed: 'right',
          width: 110,
          comps: [
            {
              type: 'button',
              btnType: 'text',
              labelName: '关联角色',
              click: 'relevance({})',
              show: this.showComputed('relevanceRole'),
            },
          ],
        },
      ],
      tableData: [], //表格数据
      roleList: [], //角色下拉框数据--全量
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
        strategyName: this.formData.strategyName,
      }
      selectStrategyByPage(params).then((res) => {
        if (res.data.code == '0') {
          this.tableData = res.data.data.records
          this.page.total = res.data.data.total
        }
      })
    },
    getRoleListByStrategyId() {
      this.roleList.forEach((e) => {
        e.disabled = false
      })
      getRoleListByStrategyId({
        strategyId: this.bindFormData.strategyId,
      }).then((res) => {
        if (res.data.code === '0') {
          res.data.data.forEach((el) => {
            this.bindFormData.relevanceRole.push(el.roleId)
            for (let i = 0; i < this.roleList.length; i++) {
              if (this.roleList[i].roleId === el.roleId) {
                this.roleList[i].disabled = true
              }
            }
          })
          this.$set(
            this.getComponent('relevanceRole', 'bindFormFields'),
            'options',
            this.roleList,
          )
        }
      })
    },
    async getRoleList() {
      let res = await getRoleByCondition({ roleName: '' })
      if (res.data.code === '0') {
        this.roleList = res.data.data
      }
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
      }
    },
    //批量操作 0禁用 1启用
    updateStatus(type) {
      const change = type === '1' ? '启用' : '停用'
      if (!this.tableSelectData.length) {
        this.$message.warning('尚未选择用户,请勾选左侧选择框')
        return
      } else {
        const flag = this.tableSelectData.every((item) => {
          return item.status === type
        })
        if (flag) {
          this.$message.warning(`所选用户状态均为${change}`)
          return
        }
      }
      const idList = this.tableSelectData.map((el) => {
        return el.strategyId
      })
      let params = {
        status: type,
        strategyId: idList,
      }
      this.$confirm(
        `是否${change}所选的${this.tableSelectData.length}个用户`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          lockScroll: false,
        },
      ).then(() => {
        updateStrategyStatus(params).then((res) => {
          this.tableSelectData = []
          this.$message({
            type: 'success',
            message: '批量操作成功',
          })
          this.getList(true)
        })
      })
    },
    // 关联角色
    relevance(row) {
      this.bindFormData.strategyName = row.strategyName
      this.bindFormData.strategyId = row.strategyId
      this.getRoleListByStrategyId()
      this.dialogVisible = true
    },
    confirm() {
      this.$refs.bindForm.validate().then((valid) => {
        if (valid) {
          let params = {
            roleId: this.bindFormData.relevanceRole,
            strategyId: this.bindFormData.strategyId,
          }
          addRoleStrategyRelation(params).then((res) => {
            if (res.data.code === '0') {
              this.$message.success('操作成功！')
            }
          })
          this.closeFrom()
          this.getList(true)
        }
      })
    },
    //关闭弹窗
    closeFrom() {
      this.dialogVisible = false
      this.bindFormData.relevanceRole = []
      this.$refs.bindForm.emptyFormData()
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
