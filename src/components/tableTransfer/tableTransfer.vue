<template>
  <div class="fs-transfer">
    <transfer-panel
      v-bind="$props"
      ref="leftPanel"
      :data="sourceData"
      :title="titles[0] || ''"
      :default-checked="leftDefaultChecked"
      :height="180"
      @checked-change="onSourceCheckedChange"
      :page="leftPage"
      @pageChanged="leftPageChanged"
    >
      <slot v-if="$slots.default" slot="table" />
      <slot v-else name="left-table" slot="table" />
      <slot name="left-footer" slot="footer"></slot>
    </transfer-panel>
    <div class="fs-transfer-option">
      <el-button
        type="primary"
        :disabled="leftChecked.length === 0"
        @click.native="addToRight"
        style="margin-bottom: 10px;"
      >
        <span v-if="buttonTexts[1] !== undefined">{{ buttonTexts[1] }}</span>
        <i class="el-icon-arrow-right"></i>
      </el-button>
      <el-button
        type="primary"
        :disabled="rightChecked.length === 0"
        @click.native="addToLeft"
      >
        <i class="el-icon-arrow-left"></i>
        <span v-if="buttonTexts[0] !== undefined">{{ buttonTexts[0] }}</span>
      </el-button>
    </div>
    <transfer-panel
      v-bind="$props"
      ref="rightPanel"
      :data="targetData"
      :title="titles[1] || ''"
      :default-checked="rightDefaultChecked"
      @checked-change="onTargetCheckedChange"
      :page="rightPage"
      @pageChanged="rightPageChanged"
    >
      <slot v-if="$slots.default" slot="table" />
      <slot v-else name="right-table" slot="table" />
      <slot name="right-footer" slot="footer"></slot>
    </transfer-panel>
  </div>
</template>

<script>
import TransferPanel from './transferPanel.vue'
export default {
  name: 'TableTransfer',
  components: {
    TransferPanel,
  },
  props: {
    data: {
      type: Array,
      default() {
        return []
      },
    },
    rowKey: {
      type: String,
      required: true,
    },
    value: {
      type: Array,
      default() {
        return []
      },
    },
    buttonTexts: {
      type: Array,
      default() {
        return []
      },
    },
    leftDefaultChecked: {
      type: Array,
      default() {
        return []
      },
    },
    beforeRightButtonClick: Function,
    beforeLeftButtonClick: Function,
    rightDefaultChecked: {
      type: Array,
      default() {
        return []
      },
    },
    filterable: {
      type: Boolean,
      default: false,
    },
    filterPlaceholder: {
      type: String,
      default: '请输入搜索内容',
    },
    filterMethod: Function,
    selectable: Function,
    panelStyle: {
      type: Object,
      default() {
        return {}
      },
    },
    targetOrder: {
      type: String,
      default: 'original',
    },
    titles: {
      type: Array,
      default() {
        return []
      },
    },
    format: {
      type: Object,
      default() {
        return {}
      },
    },
    tableProps: Object,
    leftPage: Object,
    rightPage: Object,
  },
  data() {
    return {
      leftChecked: [],
      rightChecked: [],
    }
  },
  computed: {
    dataObj() {
      const key = this.rowKey
      return this.data.reduce((o, cur) => (o[cur[key]] = cur) && o, {})
    },
    sourceData() {
      return this.data.filter((i) => !this.value.includes(i[this.rowKey]))
    },
    targetData() {
      if (this.targetOrder === 'original') {
        // return this.value
        return this.data.filter((i) => this.value.includes(i[this.rowKey]))
      } else {
        return this.value.reduce((arr, cur) => {
          const val = this.dataObj[cur]
          if (val) {
            arr.push(val)
          }
          return arr
        }, [])
      }
    },
  },
  methods: {
    addToLeft() {
      if (this.beforeLeftButtonClick) {
        if (!this.beforeLeftButtonClick()) return
      }
      let currentValue = JSON.parse(JSON.stringify(this.value))
      // let currentValue = this.value.slice()
      const key = this.rowKey
      this.rightChecked.forEach((item) => {
        const index = currentValue.indexOf(item[key])
        if (index > -1) {
          currentValue.splice(index, 1)
        }
      })
      this.$emit('input', currentValue)
      this.$emit('change', currentValue, 'left', this.rightChecked)
    },
    addToRight() {
      if (this.beforeRightButtonClick) {
        if (!this.beforeRightButtonClick()) return
      }
      // let currentValue = this.value.slice()
      let currentValue = JSON.parse(JSON.stringify(this.value))
      const itemsToBeMoved = []
      const key = this.rowKey
      this.data.forEach((item) => {
        const itemKey = item[key]
        if (
          this.leftChecked.findIndex((i) => i[key] === itemKey) > -1 &&
          this.value.indexOf(itemKey) === -1
        ) {
          itemsToBeMoved.push(itemKey)
        }
      })
      currentValue =
        this.targetOrder === 'unshift'
          ? itemsToBeMoved.concat(currentValue)
          : currentValue.concat(itemsToBeMoved)
      this.$emit('input', currentValue)
      this.$emit('change', currentValue, 'right', this.leftChecked)
    },
    onSourceCheckedChange(val, movedKeys, checkedRows) {
      this.leftChecked = checkedRows || []
      if (movedKeys === undefined) return
      this.$emit('left-check-change', val, movedKeys, checkedRows)
    },
    onTargetCheckedChange(val, movedKeys, checkedRows) {
      this.rightChecked = checkedRows || []
      if (movedKeys === undefined) return
      this.$emit('right-check-change', val, movedKeys, checkedRows)
    },
    clearQuery(direction) {
      if (direction === 'left') {
        this.$refs.leftPanel.clearQuery()
      } else if (direction === 'right') {
        this.$refs.rightPanel.clearQuery()
      }
    },
    leftPageChanged(val) {
      this.$emit('leftPageChanged', val)
    },
    rightPageChanged(val) {
      this.$emit('rightPageChanged', val)
    },
    pageChanged(val) {
      this.$emit('pageChanged', val)
    },
  },
}
</script>

<style lang="scss" scoped>
.fs-transfer {
  text-align: left;
  height: 420px;
  display: flex;
  align-items: center;
  width: 950px;

  .fs-transfer-option {
    display: flex;
    flex-direction: column;
    vertical-align: middle;
    margin: 0 10px;
  }
  ::v-deep .el-button + .el-button {
    margin-left: 0;
  }
}
</style>
