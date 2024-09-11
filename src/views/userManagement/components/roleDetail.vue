<!-- 角色详情弹窗 -->
<template>
  <el-dialog
    title=""
    :visible="dialogVisible"
    width="55%"
    @opened="opened"
    @close="close"
  >
    <el-tabs v-model="activeName" type="card" class="tabs">
      <el-tab-pane label="关联的用户" name="1">
        <os-table
          ref="user"
          tableKey="user"
          :maxHeight="230"
          :tableData="tableData_user"
          :tableCols="tableCols_user"
          :page="page_user"
          :tableOptions="{ isNumber: false }"
        ></os-table>
      </el-tab-pane>
      <el-tab-pane label="关联的策略" name="2">
        <os-table
          ref="strategy"
          tableKey="strategy"
          :maxHeight="230"
          :tableData="tableData_strategy"
          :tableCols="tableCols_strategy"
          :page="page_strategy"
          :tableOptions="{ isNumber: false }"
        >
          <template slot="label" slot-scope="props">
            <span>{{ props.row.label }}</span>
            <span style="font-size: 12px; color: gray; margin-left: 8px;">
              {{ props.row.remark }}
            </span>
          </template>
        </os-table>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import { getRoleData } from '@/api/capacityApi'
export default {
  name: 'roleDetail',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    dialogData: {
      type: Object,
      default: function () {
        return ''
      },
    },
  },
  data() {
    return {
      activeName: '1',
      //关联用户表--分页参数
      page_user: {
        isPage: false,
        pageIndex: 1,
        pageSize: 10,
        total: 0,
      },
      tableData_user: [], //关联用户表--数据
      //关联用户表--字段
      tableCols_user: [
        { prop: 'userName', label: '用户名称' },
        { prop: 'userId', label: '用户ID', width: 160 },
        {
          prop: 'status',
          label: '账号状态',
          filter: [
            { label: '禁用', value: '0' },
            { label: '启用', value: '1' },
            { label: '过期', value: '2' },
          ],
        },
        { prop: 'updateTime', label: '最近操作时间', width: 150 },
      ],
      //关联策略表--分页参数
      page_strategy: {
        isPage: false,
        pageIndex: 1,
        pageSize: 10,
        total: 0,
      },
      tableData_strategy: [], //关联策略表--数据
      //关联策略表--字段
      tableCols_strategy: [
        {
          prop: 'label',
          label: '策略名称',
          type: 'slot',
          align: 'left',
        },
        { prop: 'type', label: '策略类型', width: 150 },
      ],
    }
  },
  methods: {
    opened() {
      console.log(this.dialogData, '弹窗数据')
      // 请求总数据的接口
      getRoleData({ roleId: this.dialogData.roleId })
        .then((res) => {
          if (res.data.code === '0') {
            this.tableData_user = res.data?.data?.userItemList
            this.tableData_strategy = res.data?.data?.strategyItemList
          }
          // this.transferData = data
        })
        .catch((error) => {
          // this.$message.error(error)
        })
    },
    //关闭弹窗事件
    close() {
      this.$emit('dialogVisible', false)
    },
  },
}
</script>

<style lang="scss" scoped>
.title_box {
  font-weight: 900;
  margin: 10px 0;
}
::v-deep .el-dialog__header {
  border: none !important;
}
::v-deep .tabs .el-tabs__item {
  font-size: 14px;
  font-weight: 600;
  padding: 0 15px;
}
</style>
