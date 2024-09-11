<template>
  <div class="searchBox">
    <div class="box">
      <!-- 一级 -->
      <ul v-loading="loading" class="parent">
        <li
          v-for="(item, index) in dataList"
          :key="item.value"
          :class="{ active: activeIndex == index }"
          @click="getSecondList(item, index)"
        >
          <div class="firstOrder">
            <el-image :src="item.img" @click="dialogVisible = true"></el-image>
            <span>{{ item.name }}</span>
            <i class="el-icon-arrow-right" />
          </div>
        </li>
      </ul>
      <!-- 二级 -->
      <div v-loading="sonLoading" class="son">
        <el-empty
          v-if="secondList.length == 0"
          description="暂无数据"
          style="height: 100%;"
        />
        <div v-else>
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="checkedAll"
          >
            全选
          </el-checkbox>
          <div v-for="(item, index) in secondList" :key="index + item.value">
            <el-checkbox
              class="site"
              :indeterminate="item.isIndeterminate1"
              v-model="item.checked"
              @change="handleChecked('1', item)"
            >
              {{ item.name }}
            </el-checkbox>
            <i
              v-if="item.children.length > 0 && !item.thirdShow"
              class="el-icon-arrow-right fold"
              @click="foldSwitch(item, index)"
            />
            <i
              v-if="item.children.length > 0 && item.thirdShow"
              class="el-icon-arrow-down fold"
              @click="foldSwitch(item, index)"
            />
            <div
              v-if="item.children.length > 0 && item.thirdShow"
              v-for="(value, index) in item.children"
              :key="index + value.value"
              class="second_order"
            >
              <el-checkbox
                class="site"
                v-model="value.checked"
                @change="handleChecked('2', value)"
              >
                {{ value.name }}
              </el-checkbox>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    dataList: {
      type: Array,
      default: () => [],
    },
    maxTag: Number,
    nowTag: Number,
  },
  watch: {
    dataList: {
      deep: true,
      immediate: true,
      handler(newVal) {
        this.dataList = newVal
        this.opreationData()
      },
    },
  },
  data() {
    return {
      checkAll: false,
      isIndeterminate: false,
      isIndeterminate1: false,
      loading: false,
      sonLoading: false,
      // 当前选中的父级索引
      activeIndex: -1,
      // dataList: [], //标签数据
      secondList: [], // 第二级列表
      thirdList: [], //第三级列表
      cityChecked: [], // 区块城市选中列表
    }
  },
  created() {
    this.dataList.forEach((e) => {
      if (e.children) {
        e.children.forEach((val) => {
          val['thirdShow'] = false
          val['isIndeterminate1'] = false
        })
      }
    })
    console.log(this.dataList)
  },
  methods: {
    // 获取二级数据
    getSecondList(item, index) {
      this.sonLoading = true
      this.activeIndex = index
      if (item.children) {
        this.sonLoading = false
        this.secondList = item.children
      } else {
        this.sonLoading = false
        this.secondList = []
      }
      this.opreationData()
    },
    //展开收起
    foldSwitch(val, index) {
      let temp = this.secondList[index]
      temp.thirdShow = !val.thirdShow
      this.$set(this.secondList, index, temp)
      console.log(this.secondList)
    },
    //全选按钮
    checkedAll(val) {
      //计算该全选列下的标签数是否大于剩余可选的标签数，大于则不可选
      let residue = this.maxTag - this.nowTag
      let num = 0
      this.secondList.forEach((e) => {
        if (e.value != null) {
          num += 1
        }
        if (e.children && e.children.length > 0) {
          e.children.forEach((p) => {
            if (p.value) {
              num += 1
            }
          })
        }
      })
      if (this.maxTag && this.nowTag && num > residue && val == true) {
        this.$message.warning(`最多只能选择${this.maxTag}个标签!`)
        this.checkAll = false
        return
      }
      this.secondList.forEach((e) => {
        e.checked = val
        if (e.children && e.children.length > 0) {
          e.children.forEach((p) => {
            p.checked = val
          })
        }
      })
      this.opreationData()
    },
    //标签选择事件
    handleChecked(level, item) {
      let isChecked = item.checked
      //计算二级菜单下的子标签总数是否大于剩余可选标签数
      let residue = this.maxTag - this.nowTag
      let num = 0
      if (item?.children?.length > 0) {
        item.children.forEach((p) => {
          if (p.value) {
            num += 1
          }
        })
        if (num > residue && item.checked) {
          this.$message.warning(`最多只能选择${this.maxTag}个标签!`)
          item.checked = !item.checked
          return
        }
      }
      if (this.nowTag > this.maxTag - 1 && item.checked) {
        this.$message.warning(`最多只能选择${this.maxTag}个标签!`)
        item.checked = !item.checked
        return
      }
      switch (level) {
        case '1':
          if (item && item.children) {
            item.children.forEach((c) => {
              c.checked = isChecked
            })
          }
          break
        case '2':
          break
      }
      console.log(this.dataList, 'dataList')
      this.opreationData()
    },
    //选择框联动处理
    opreationData() {
      this.secondList.forEach((i) => {
        if (i.children && i.children.length > 0) {
          i.checked = i.children.every((i) => i.checked)
        }
      })
      let fnum1 = 0 //记录未勾选的数量--全部
      let snum1 = 0 //记录已勾选的数量--全部
      let fnum2 = 0 //记录未勾选的数量--第三层
      let snum2 = 0 //记录已勾选的数量--第三层
      this.secondList.forEach((c) => {
        if (c.checked == false) {
          fnum1++
        } else {
          snum1++
        }
        if (c.children && c.children.length > 0) {
          c.children.forEach((p) => {
            if (p.checked == false) {
              fnum1++
              fnum2++
            } else {
              snum2++
            }
          })
        }
        if (fnum2 > 0) {
          c.isIndeterminate1 = true
        } else {
          c.isIndeterminate1 = false
        }
        if (snum2 == 0) {
          c.isIndeterminate1 = false
        }
        fnum2 = 0
        snum2 = 0
      })
      //全选状态改变 checkAll：勾 isIndeterminate：减
      if (fnum1 > 0) {
        this.checkAll = false
        this.isIndeterminate = true
      } else {
        this.checkAll = true
        this.isIndeterminate = false
      }
      //不勾选任何选项时，全选框无任何状态
      if (snum1 == 0) {
        this.isIndeterminate = false
      }
      fnum1 = 0
      snum1 = 0
      this.$emit('change', this.dataList)
    },
    // 二级数据选择
    chooseContry(val, item, type) {
      if (item.children && type == 2) {
        setTimeout(() => {
          this.sonLoading = false
          this.thirdList = item.children
        }, 500)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.searchBox {
  .box {
    display: flex;
    // height: 160px;
    // overflow: hidden;
    li {
      padding: 0 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &:hover {
        color: #1c8ffe;
      }
      .firstOrder {
        width: 100%;
        // width: 300px;
        // height: 50px;
        // line-height: 50px;
        margin: 12px 0;
        padding: 15px 10px;
        font-size: 14px;
        background: #f2f5fd;
        border: 1px solid rgba(104, 183, 255, 0.13);
        border-radius: 3px;
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          margin-left: 10px;
        }
        i {
          margin-right: 0px;
          margin-left: auto;
        }
      }
    }
    .parent {
      flex: 1;
      height: 400px;
      overflow-y: auto;
      margin-top: 10px;
      padding: 10px 30px 0 0;
      li {
        cursor: pointer;
      }
      .active {
        color: #1c8ffe;
      }
    }
    .son {
      flex: 1;
      height: 400px;
      overflow-y: auto;
      margin-top: 10px;
      padding: 10px 35px;
      // border-left: solid 1px #e4e7ed;
      .fold {
        font-size: 14px;
        margin-left: 10px;
        cursor: pointer;
      }
    }
    .second_order {
      margin-left: 22px;
    }
  }
}
.el-checkbox.site {
  margin-top: 10px;
}
</style>
