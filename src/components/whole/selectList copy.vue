<template>
  <el-select
    size="mini"
    multiple
    filterable
    :disabled="disabled"
    v-model="selectedArr"
    :loading="mulSelectLoading"
    :collapse-tags="collapseTags"
    placeholder="请选择"
    @change="changeSelect"
    @remove-tag="removeTag"
  >
    <el-option
      label="全选"
      value="全选"
      @click.native="selectAll"
      v-if="selectOptions.length"
    ></el-option>
    <el-option
      v-for="item in selectOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    ></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'MultipleSelect',
  data() {
    return {
      selectedArr: [],
    }
  },
  props: {
    // 选项
    selectOptions: {
      type: Array,
      default() {
        return []
      },
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    // 已选中选项
    mulSelecteds: {
      type: Array,
      default() {
        return []
      },
    },
    mulSelectLoading: {
      type: Boolean,
      default: false,
    },
    collapseTags: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    selectAll() {
      if (this.selectedArr.length < this.selectOptions.length) {
        this.selectedArr = []
        this.selectOptions.map((item) => {
          this.selectedArr.push(item.value)
        })
        this.selectedArr.unshift('全选')
      } else {
        // 取消全选
        this.selectedArr = []
      }
      this.$emit('update:updateMultipleSelect', this.selectedArr)
    },
    changeSelect(val) {
      debugger
      if (!val.includes('全选') && val.length === this.selectOptions.length) {
        this.selectedArr.unshift('全选')
      } else if (
        val.includes('全选') &&
        val.length - 1 < this.selectOptions.length
      ) {
        this.selectedArr = this.selectedArr.filter((item) => {
          return item !== '全选'
        })
      }
      this.$emit('update:updateMultipleSelect', this.selectedArr)
    },
    removeTag(val) {
      if (val === '全选') {
        this.selectedArr = []
        this.$emit('update:updateMultipleSelect', this.selectedArr)
      }
    },
  },
  watch: {
    mulSelecteds: {
      handler(newVal, oldVal) {
        this.selectedArr = newVal
        if (
          !this.selectedArr.includes('全选') &&
          this.selectedArr.length &&
          this.selectedArr.length === this.selectOptions.length
        ) {
          this.selectedArr.unshift('全选')
        }
      },
      immediate: true,
    },
  },
}
</script>
