<template>
  <div>
    <div
      class="list_item"
      :class="{ item_2: dataFormatter(list) == 1 }"
      v-for="(item, index) in list"
      :key="index"
    >
      <el-tooltip
        :disabled="item.name.length < 5"
        effect="dark"
        :content="item.name"
        placement="top"
      >
        <div
          class="item_name firstName"
          :class="{ item_2: dataFormatter(list) == 2 }"
        >
          {{ item.name }}
        </div>
      </el-tooltip>
      <div
        v-if="item.children"
        class="children_item"
        :class="{ item_2: dataFormatter(list) == 1 }"
      >
        <div
          v-for="(child, inx) in item.children"
          :key="inx"
          style="display: flex;"
        >
          <!-- 有三层数据 -->
          <div
            class="item_name"
            style="margin-right: 10px;"
            v-if="child.children"
          >
            {{ child.name }}
          </div>
          <div class="checkbox" v-if="child.children">
            <li
              v-for="(item, index) in child.children"
              :key="index"
              class="nav_item"
              @click="clickItem(index, child.children)"
              :class="{ active: item.checked }"
            >
              {{ item.name }}
            </li>
          </div>
          <!-- 只有两层数据 -->
          <div
            v-else
            class="checkbox container"
            :class="item.fold == false ? 'fold' : 'unfold'"
          >
            <li
              class="nav_item"
              @click="clickItem(inx, item.children, item)"
              :class="{ active: child.checked }"
            >
              {{ child.name }}
            </li>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'List',
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    checkedList: {
      type: Array,
      default: () => [],
    },
    groupList: {
      type: Array,
      default: () => [],
    },
    maxTag: Number,
    provs: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    list: {
      deep: true,
      handler(newVal) {
        this.list = newVal
      },
    },
  },
  data() {
    return {
      fold: false, //字数溢出展开
    }
  },
  mounted() {
    // this.list.forEach((e, i) => {
    //   e.children.forEach((ele, index) => {
    //     // this.$set(this.list, index, Object.assign({}, ele, { status: null }))
    //     ele['fold'] = false
    //     ele['foldName'] = '展开'
    //   })
    // })
    // console.log(this.list, 'this.list')
  },
  methods: {
    //标签点击事件
    clickItem(index, list, item) {
      const temp = list[index]
      temp.checked = !list[index].checked
      this.$set(list, index, temp)
      if (list[index].checked) {
        this.groupList.push(item)
        for (let i = 0; i < this.groupList.length; i++) {
          for (let j = i + 1; j < this.groupList.length; j++) {
            if (this.groupList[i].name == this.groupList[j].name) {
              this.groupList.splice(j, 1)
              j--
            }
          }
        }
        if (this.maxTag && this.groupList.length > this.maxTag) {
          this.$message.warning(`最多只能选择${this.maxTag}个标签组合!`)
          list[index].checked = false
          this.groupList.pop()
        } else {
          this.checkedList.push(temp)
          //已选的省份在城市选择框中禁用
          this.checkedList.forEach((e) => {
            this.provs.forEach((val) => {
              if (val.label == e.name) {
                val.disable = true
              }
            })
          })
        }
      } else {
        //取消选择省份时选择框的disable改为false
        this.checkedList.forEach((e) => {
          this.provs.forEach((val) => {
            if (val.label == e.name && e.checked == false) {
              val.disable = false
            }
          })
        })
        this.checkedList.forEach((e, i) => {
          if (e.checked == false) {
            this.checkedList.splice(i, 1)
          }
        })
        let num = 0
        this.groupList.forEach((value, inx) => {
          value.children.forEach((val, i) => {
            if (val.checked == true) {
              num++
            }
          })
          if (num == 0) {
            this.groupList.splice(inx, 1)
          }
          num = 0
        })
      }
      // console.log(this.groupList, '选中的组合')
      console.log(this.checkedList, '选中的tag')
    },
    dataFormatter(data) {
      var num = 0
      data.forEach((item) => {
        if (item.children) {
          num = 1
          item.children.forEach((val) => {
            if (val.children) {
              num = 2
            }
          })
        }
      })
      return num
    },
    handleFold(val, i) {
      this.fold = !this.fold
      val.fold = !val.fold
      this.list.forEach((e, i) => {
        e.children[i].fold = val.fold
        val.fold == true
          ? (e.children[i].foldName = '收起')
          : (e.children[i].foldName = '展开')
      })

      // console.log(this.lists[i].fold,'val.fold')
    },
  },
}
</script>

<style lang="scss" scope>
.list_item {
  font-size: 12px;
  font-family: SourceHanSansCN-Medium, SourceHanSansCN;
  color: #333333;
  margin-top: 15px;
  text-align: right;
  .item_name {
    font-weight: 500;
    width: 80px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .firstName {
    padding-right: 10px;
  }
  :nth-child(n + 1) {
    line-height: 40px;
  }
}
.item_name.item_2 {
  font-weight: 600;
}
.list_item.item_2 {
  display: flex;
}
.children_item {
  text-align: right;
  font-weight: 400;
  // 标签框
  .checkbox {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
  }
}
.children_item.item_2 {
  display: flex;
  flex-wrap: wrap;
  text-align: right;
  font-weight: 400;
  width: 100%;
}
//标签样式
.nav_item {
  display: flex;
  min-width: 76px !important;
  height: 27px;
  line-height: 15px !important;
  background: #f8fafc;
  color: #999999;
  font-size: 12px;
  font-weight: 400;
  padding: 5px;
  text-align: center;
  display: inline-block;
  margin: 8px 12px 0 0;
  border-radius: 2px;
  border: 1px solid #cbcbcb;
  cursor: pointer;
}
.nav_item:hover,
.nav_item.active {
  color: #418ff6;
  background: rgba(65, 143, 246, 0.1);
  border-radius: 2px;
  border: 1px solid #418ff6;
}

.container {
  display: -webkit-box;
  -webkit-box-orient: vertical; // 伸缩框从上到下垂直排列
  overflow: hidden; //超出的文本隐藏
  text-overflow: ellipsis; // 溢出用省略号显示
}

//收起
.container.fold {
  -webkit-line-clamp: 1;
  // width: 60%;
}

//展开
.container.unfold {
  -webkit-line-clamp: 100;
  // width: 60%;
}
</style>
