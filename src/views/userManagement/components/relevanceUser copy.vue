<!-- 关联用户弹窗 -->
<template>
  <el-dialog
    title="关联用户"
    :visible="dialogVisible"
    width="60%"
    @opened="opened"
    @close="close"
  >
    <div>
      <a-transfer
        :titles="['选择策略', '已选策略']"
        :operations="['添加', '撤回']"
        :data-source="mockData"
        :target-keys="targetKeys"
        :show-search="true"
        :filter-option="
          (inputValue, item) => item.title.indexOf(inputValue) !== -1
        "
        :show-select-all="false"
        :locale="{
          itemUnit: '项',
          itemsUnit: '项',
          notFoundContent: '列表为空',
          searchPlaceholder: '请输入搜索内容',
        }"
        @change="onChange"
        @search="handleSearch"
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
            :style="{ pointerEvents: listDisabled ? 'none' : null }"
            :pagination="{ defaultPageSize: 5 }"
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
    const leftTableColumns = [
      {
        dataIndex: 'name',
        title: '姓名',
      },
      {
        dataIndex: 'userType',
        title: '用户类型',
      },
      {
        dataIndex: 'userName',
        title: '用户名',
      },
    ]
    const rightTableColumns = [
      {
        dataIndex: 'name',
        title: '姓名',
      },
      {
        dataIndex: 'userType',
        title: '用户类型',
      },
      {
        dataIndex: 'userName',
        title: '用户名',
      },
    ]
    return {
      transferVisible: false,
      mockData: [],
      targetKeys: [],
      disabled: false,
      showSearch: false,
      leftColumns: leftTableColumns,
      rightColumns: rightTableColumns,
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    opened() {},
    onChange(nextTargetKeys) {
      this.targetKeys = nextTargetKeys
    },
    handleSearch(dir, value) {
      console.log('search:', dir, value)
    },
    getRowSelection({ disabled, selectedKeys, itemSelectAll, itemSelect }) {
      return {
        getCheckboxProps: (item) => ({
          props: { disabled: disabled || item.disabled },
        }),
        // onSelectAll(selected, selectedRows) {
        //   debugger
        //   const treeSelectedKeys = selectedRows
        //     // .filter((item) => !item.disabled)
        //     .map(({ key }) => key)
        //   const diffKeys = selected
        //     ? difference(treeSelectedKeys, selectedKeys)
        //     : difference(selectedKeys, treeSelectedKeys)
        //   itemSelectAll(diffKeys, selected)
        // },
        onSelect({ key }, selected) {
          itemSelect(key, selected)
        },
        selectedRowKeys: selectedKeys,
      }
    },
    initData() {
      // getAppAll()
      //   .then((res) => {
      //     if (res.data && res.data.length > 0) {
      let data = [
        {
          name: '张三',
          userType: '内部',
          userName: 'zhangs',
        },
        {
          name: '李四',
          userType: '内部',
          userName: 'lis',
        },
        {
          name: '王五',
          userType: '外部客户',
          userName: 'wangw',
        },
      ]
      // this.mockData = data
      this.mockData = data.map((item, index) => {
        return {
          key: index,
          name: item.name || '暂无',
          userType: item.userType || '暂无',
          userName: item.userName || '暂无',
          // disabled: false,
        }
      })
      //     }
      //   })
      //   .catch(() => {})
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
</style>
