<template>
  <div class="box">
    <el-badge :value="checkedList.length" class="item">
      <el-button
        size="small"
        @click="drawer = true"
        icon="el-icon-collection-tag"
      >
        编辑标签
      </el-button>
    </el-badge>
    <el-drawer
      title=""
      :visible.sync="drawer"
      direction="btt"
      :modal="false"
      :wrapperClosable="false"
      :modal-append-to-body="false"
    >
      <div class="tag_box" v-if="checkedList.length > 0">
        <el-tag
          :key="i"
          v-for="(tag, i) in checkedList"
          closable
          :disable-transitions="false"
          @close="handleDelete(tag)"
          class="tag"
        >
          {{ tag.name }}
        </el-tag>
      </div>
      <el-empty v-else description="暂无数据" style="height: 50px;" />
    </el-drawer>
  </div>
</template>
<script>
export default {
  props: {
    checkedList: {
      type: Array,
      default: () => [],
    },
    groupList: {
      type: Array,
      default: () => [],
    },
    //为button时，为标签圈人模板
    type: {
      type: String,
      default: '',
    },
    tabActive: {
      type: String,
      default: '0',
    },
  },
  data() {
    return { drawer: false }
  },
  methods: {
    //删除标签
    handleDelete(tag) {
      tag.checked = !tag.checked
      this.checkedList.splice(this.checkedList.indexOf(tag), 1)
      this.groupList?.forEach((e) => {
        e.children.forEach((val) => {
          if (tag.name == val.name) {
            val.checked = tag.checked
          }
          if (val.children) {
            val.children.forEach((i) => {
              if (tag.name == i.name) {
                i.checked = tag.checked
              }
            })
          }
        })
      })
      //地图删除地址事件
      this.$emit('addrDelete', this.checkedList)
      if (this.type == 'button') {
        this.$emit('change', false)
        this.tabActive = this.tabActive
        let num = 0
        this.groupList.forEach((value, inx) => {
          value.children.forEach((val, i) => {
            if (value.name == '城市' && val.name == tag.name) {
              val.checked = false
              // value.children.splice(i, 1)
            }
            if (val.checked == true) {
              num++
            }
          })
          if (num == 0) {
            this.groupList.splice(inx, 1)
          }
          num = 0
        })
        this.$nextTick(() => {
          this.$emit('change', true) //销毁之后重新渲染,走的是子组件的整套周期函数
        })
      }
      console.log(this.groupList, '删除-标签组')
    },
  },
}
</script>

<style lang="scss" scope>
.tag_box {
  padding: 0 20px;
  .tag {
    margin: 5px;
  }
}
.el-empty__image svg {
  height: 80%;
  width: 50%;
  margin-top: 45px;
}
.el-drawer__header {
  margin: 0;
  padding: 2px !important;
}
</style>
