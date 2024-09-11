<template>
  <el-select
    multiple
    clearable
    :collapse-tags="collapseTags"
    v-model="selectedArray"
    :loading="loading"
    :disabled="disabled"
    @change="changeSelect"
    @remove-tag="removeTag"
    :placeholder="placeholder"
    style="width: 100%;"
  >
    <el-option
      v-if="options.length > 0"
      label="全部"
      value="全部"
      @click.native="selectAll"
    ></el-option>
    <el-option
      v-for="(item, index) in options"
      :key="'select' + index"
      :label="item.label"
      :value="item.label"
    ></el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    //选项
    options: {
      type: Array,
      default: () => [],
    },
    //已选数组
    selectList: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: () => '请选择',
    },
    //是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    //加载中
    loading: {
      type: Boolean,
      default: false,
    },
    collapseTags: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      selectedArray: this.selectList,
    }
  },
  created() {
    if (
      this.selectedArray.includes('全部') &&
      this.selectedArray.length - 1 < this.options.length
    ) {
      this.selectedArray = this.selectedArray.filter((item) => {
        return item !== '全部'
      })
    }
  },
  methods: {
    selectAll() {
      if (this.selectedArray.length < this.options.length) {
        this.selectedArray = []
        this.options.map((item) => {
          this.selectedArray.push(item.label)
        })
        this.selectedArray.unshift('全部')
      } else {
        this.selectedArray = []
      }
      this.$emit('change', this.selectedArray)
    },
    changeSelect(val) {
      if (!val.includes('全部') && val.length === this.options.length) {
        this.selectedArray.unshift('全部')
      } else if (val.includes('全部') && val.length - 1 < this.options.length) {
        this.selectedArray = this.selectedArray.filter((item) => {
          return item !== '全部'
        })
      }
      this.$emit('change', this.selectedArray)
      console.log(this.selectedArray, 'mulselect')
    },
    removeTag(val) {
      if (val === '全部') {
        this.selectedArray = []
      }
      this.$emit('change', this.selectedArray)
    },
  },
}
</script>
