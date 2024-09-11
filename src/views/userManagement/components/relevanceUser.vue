<!-- 关联用户弹窗 -->
<template>
  <el-dialog
    title="关联用户"
    :visible="dialogVisible"
    width="75%"
    @opened="opened"
    @close="close"
  >
    <div style="padding: 0 20px;">
      <a-transfer
        :titles="['选择策略', '已选策略']"
        :dataSource="mockData"
        :target-keys="targetKeys"
        :show-search="true"
        :filter-option="
          (inputValue, item) =>
            item.acName.indexOf(inputValue) !== -1 ||
            item.userName.indexOf(inputValue) !== -1
        "
        :show-select-all="false"
        searchPlaceholder="输入姓名或用户名搜索"
        @change="onChange"
      >
        <template
          slot="children"
          slot-scope="{
            props: {
              direction,
              filteredItems,
              selectedKeys,
              disabled: listDisabled,
            },
            on: { itemSelectAll, itemSelect },
          }"
        >
          <a-table
            :row-selection="
              getRowSelection({
                disabled: listDisabled,
                selectedKeys,
                itemSelectAll,
                itemSelect,
              })
            "
            :columns="direction === 'left' ? leftColumns : rightColumns"
            :data-source="filteredItems"
            size="small"
            :pagination="page"
            :scroll="{ y: 190 }"
            :style="{ pointerEvents: listDisabled ? 'none' : null }"
            :custom-row="
              ({ key, disabled: itemDisabled }) => ({
                on: {
                  click: () => {
                    if (itemDisabled || listDisabled) return
                    itemSelect(key, !selectedKeys.includes(key))
                  },
                },
              })
            "
          />
        </template>
      </a-transfer>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm">
        确定
      </el-button>
      <el-button type="" @click="close">
        取消
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  userSelectByPage,
  getServiceGroupUserList,
  serviceGroupAssocUser,
} from '@/api/capacityApi'
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
    const mockData = []
    const originTargetKeys = []
    const leftTableColumns = [
      {
        dataIndex: 'userName',
        title: '姓名',
      },
      {
        dataIndex: 'userType',
        title: '用户类型',
      },
      {
        dataIndex: 'acName',
        title: '用户名',
      },
    ]
    const rightTableColumns = [
      {
        dataIndex: 'userName',
        title: '姓名',
      },
      {
        dataIndex: 'userType',
        title: '用户类型',
      },
      {
        dataIndex: 'acName',
        title: '用户名',
      },
    ]
    return {
      transferVisible: false,
      mockData,
      targetKeys: originTargetKeys,
      disabled: false,
      leftColumns: leftTableColumns,
      rightColumns: rightTableColumns,
      relevanced: [], //已关联过的用户
      rigdata: [],
      totalRolesList: [],
      page: {
        // current: 1,
        // pageSize: 10,
        // total: 0,
        showTotal: (total) => `共 ${total} 条`,
        showSizeChanger: true, //是否可以改变每页显示的条数
        pageSizeOptions: ['10', '20', '30', '50'],
        defaultPageSize: 10, //默认每页几条
        // onChange: this.pageChange, //页码改变事件
        // showSizeChange: this.onShowSizeChange,
        // simple: true,
      },
    }
  },
  methods: {
    opened() {
      this.initData()
      this.getRightData()
    },
    onChange(nextTargetKeys, direction, moveKeys) {
      console.log(nextTargetKeys, direction, moveKeys)
      this.targetKeys = nextTargetKeys
      let tableDir = this.tableDir
      if (this.tableDir != this.tableDirs) {
        this.rigdata = []
        this.totalRolesList.forEach((item1) => {
          item1.modelList.forEach((item2) => {
            if (tableDir == item2.entityCnName) {
              this.umn = item2.fieldCount
            }
          })
        })
      }
      if (direction == 'right') {
        this.rigdata.push(moveKeys.length)
        this.umn = eval(this.rigdata.join('+'))
        this.tableDirs = tableDir
      } else {
        console.log(this.umn)
        this.umn = this.umn - moveKeys.length
      }
      this.totalRolesList.forEach((item1) => {
        item1.modelList.forEach((item2) => {
          if (tableDir == item2.entityCnName) {
            item2.fieldCount = this.umn
          }
        })
      })
    },
    getRowSelection({ disabled, selectedKeys, itemSelectAll, itemSelect }) {
      return {
        getCheckboxProps: (item) => ({
          //禁用之前已选的策略
          // props: {
          // disabled:
          //   this.relevanced.indexOf(item.userId) !== -1 || item.disabled,
          // },
        }),
        onSelectAll(selected, selectedRows) {
          if (selected == true) {
            const treeSelectedKeys = selectedRows
              .filter((item) => !item.disabled)
              .map(({ key }) => key)
            itemSelectAll(treeSelectedKeys, selected)
          } else if (selected == false) {
            let treeSelectedKeys = this.selectedRowKeys
            itemSelectAll(treeSelectedKeys, selected)
          }
        },
        onSelect({ key }, selected) {
          itemSelect(key, selected)
        },
        selectedRowKeys: selectedKeys,
      }
    },
    initData() {
      //左侧数据查询
      let params = {
        acName: '',
        // excludeServiceGroupId: this.dialogData.serviceGroupId,
        pageNum: this.page.current || 1,
        pageSize: this.page.pageSize || 9999,
        userName: '',
      }
      userSelectByPage(params).then((res) => {
        if (res.data.code === '0' && res.data.data?.records?.length > 0) {
          this.leftData = res.data.data.records
          this.page.total = Number(res.data.data.total)
          // this.mockData = this.leftData
          this.mockData = this.leftData.map((item, index) => {
            return {
              key: item.userId,
              userId: item.userId,
              acName: item.acName,
              userType: item.userType,
              userName: item.userName,
              disabled: false,
            }
          })
        }
      })
    },
    getRightData() {
      getServiceGroupUserList({
        serviceGroupId: this.dialogData.serviceGroupId,
      }).then((res) => {
        if (res.data.code === '0') {
          this.rightData = res.data.data
          res?.data?.data.map((item, index) => {
            this.targetKeys.push(item.userId)
            this.relevanced.push(item.userId)
          })
          // this.targetKeys = this.rightData.map((item, index) => {
          //   return item.userId
          // })
          // this.relevanced = JSON.parse(JSON.stringify(this.targetKeys))
        }
      })
    },
    //页码改变回调方法
    pageChange(page, pageSize) {
      this.page.current = page
      // this.page.pageSize = pageSize
      this.initData()
    },
    onShowSizeChange(current, size) {
      // this.page.current = page
      // this.page.pageSize = pageSize
      // this.initData()
    },
    confirm() {
      let params = {
        serviceGroupId: this.dialogData.serviceGroupId,
        userIdList: this.targetKeys,
      }
      console.log(params, '参数')
      serviceGroupAssocUser(params).then((res) => {
        if (res.data.code === '0') {
          this.$message.success('关联用户成功！')
          this.close(1)
        }
      })
    },
    //关闭弹窗事件
    close(num) {
      this.targetKeys = []
      this.relevanced = []
      this.$emit('dialogVisible', false, num)
    },
  },
}
</script>

<style lang="scss" scoped>
.title_box {
  font-weight: 900;
  margin: 10px 0;
}
</style>
