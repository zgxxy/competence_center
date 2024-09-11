<!-- 关联用户弹窗 -->
<template>
  <el-dialog
    title="关联用户"
    :visible="dialogVisible"
    width="85%"
    @opened="opened"
    @close="close"
  >
    <div>
      <table-transfer
        :data="leftData"
        v-model="rightData"
        row-key="userId"
        filterable
        :titles="['选择策略', '已选策略']"
        filterPlaceholder="输入用户名搜索"
        style="width: 100%;"
        :filter-method="filterMethod"
        :leftPage="page"
        @leftPageChanged="pageChanged"
        :selectable="selectable"
      >
        <template>
          <el-table-column label="姓名" prop="userName"></el-table-column>
          <el-table-column label="用户类型" prop="userType"></el-table-column>
          <el-table-column label="用户名" prop="acName"></el-table-column>
        </template>
      </table-transfer>
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
import tableTransfer from '@/components/tableTransfer/tableTransfer'
import pagination from '@/components/table/pagination'
export default {
  name: 'roleDetail',
  components: {
    tableTransfer,
    pagination,
  },
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
      leftData: [], //左侧表格数据
      rightData: [], //右侧表格数据
      page: {
        isPage: true,
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [5, 10, 20, 30],
        layout: 'total, prev, pager, next, sizes',
      },
      relevanced: [], //已关联过的用户
    }
  },
  mounted() {
    // this.initData()
  },
  methods: {
    opened() {
      this.initData()
      // this.rightData = this.dialogData?.rightData
      // this.rightData = ['1745737353024057346', '1745737353145692161']
      // console.log(this.rightData, '右侧数据')
      this.getRightData()
    },
    //搜索
    filterMethod(keyword, row) {
      return row.acName.indexOf(keyword) > -1
    },
    initData() {
      //左侧数据查询
      let params = {
        acName: '',
        // excludeServiceGroupId: this.dialogData.serviceGroupId,
        pageNum: this.page.pageIndex,
        pageSize: this.page.pageSize,
        userName: '',
      }
      userSelectByPage(params).then((res) => {
        if (res.data.code === '0' && res.data.data?.records?.length > 0) {
          this.leftData = res.data.data.records
          this.page.total = res.data.data.total
          // this.leftData = res.data.data.records.map((item, index) => {
          //   return {
          //     userId: item.userId,
          //     userName: item.userName,
          //     userType: item.userType,
          //     acName: item.acName,
          //     isSelected: '0',
          //   }
          // })
        }
      })
    },
    getRightData() {
      getServiceGroupUserList({
        serviceGroupId: this.dialogData.serviceGroupId,
      }).then((res) => {
        if (res.data.code === '0') {
          // this.rightData = res.data.data
          // this.relevanced = res.data.data
          res.data.data.map((item, index) => {
            this.rightData.push(item.userId)
            this.relevanced.push(item.userId)
          })
        }
      })
      console.log(this.rightData, '右侧数据')
    },
    selectable(row, index) {
      // return的是可选择的情况
      this.relevanced.forEach((el) => {
        if (row.userId === el) {
          row.isSelected = '1'
        }
      })
      return row.isSelected !== '1'
    },
    confirm() {
      console.log(this.rightData, '确定-右侧数据')
      let params = {
        serviceGroupId: this.dialogData.serviceGroupId,
        userIdList: this.rightData,
      }
      console.log(params, '参数')
      serviceGroupAssocUser(params).then((res) => {
        if (res.data.code === '0') {
          this.close(1)
        }
      })
    },
    //分页change事件
    pageChanged(val) {
      this.page.pageIndex = val.pageIndex
      this.page.pageSize = val.pageSize
      this.initData()
    },
    //关闭弹窗事件
    close(num) {
      this.leftData = []
      this.rightData = []
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
