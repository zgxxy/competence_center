<!-- labelName配置 -->
<template>
  <label
    ref="companyStyle"
    @mouseenter="ellipsvisible(labelName, labelMaxlength, isRequired)"
    @mouseleave="ellipsinvisible"
    class="labelName"
    :style="labelStyle"
    v-if="isShowLabel"
  >
    <span>
      {{ labelName | ellipsis(labelMaxlength) }}
    </span>
    <div
      class="ellipsisshowName"
      :class="{
        right_ellipsiss: tooltipPosition === 'right',
        left_ellipsiss: tooltipPosition === 'left',
        top_ellipsiss: tooltipPosition === 'top',
        bottom_ellipsiss: tooltipPosition === 'bottom',
      }"
      :style="{ 'min-width': tooltipMinWidth }"
      v-show="ellipsisshow"
    >
      {{ labelName ? labelName.replace('：', '').replace(':', '') : '' }}
      <i></i>
    </div>
  </label>
</template>
<script>
export default {
  name: 'labelName',
  props: {
    // 控件label名称
    labelName: { type: String, default: '' },
    //是否显示labelName
    isShowLabel: { type: Boolean, default: true },
    // 是否为必填
    isRequired: { type: Boolean, default: false },
    // 最大显示文字数
    labelMaxlength: { type: Number, default: 7 },
    labelWidth: { type: Number, default: 80 },
    labelStyle: [Object, String],
    tooltipPosition: { type: String, default: 'right' },
    tooltipMinWidth: { type: String, default: '135px' },
  },
  data() {
    return {
      // 是否显示字数溢出提示
      ellipsisshow: false,
    }
  },
  filters: {
    ellipsis(value, labelMaxlength) {
      const cNumber = labelMaxlength // 设置限定字数
      if (!value) return ''
      if (value.length > cNumber) {
        return value.slice(0, cNumber) + '...'
      }
      return value
    },
  },
  methods: {
    // 是否溢出显示
    ellipsvisible(labelName, labelMaxlength, isRequired) {
      let zjl = labelName.length //字节长度
      let zdz = labelMaxlength //最大值
      if (isRequired) {
        zjl = zjl + 1
      }
      if (zjl > zdz) {
        //兼容两种模式
        this.ellipsisshow = true
      } else {
        this.ellipsisshow = false
      }
      //判断超过N个字或宽度的显示溢出效果
    },
    ellipsinvisible() {
      this.ellipsisshow = false
    },
  },
}
</script>
<style lang="scss" scoped>
.labelName {
  position: relative;
}
.ellipsisshowName {
  float: right;
  display: flex;
  align-items: center;
  max-width: 350px;
  width: auto;
  white-space: normal;
  background: #00000095;
  color: #fff;
  padding: 3px 5px;
  border-radius: 2px;
  z-index: 9999;
  position: absolute;
  pointer-events: none;
  min-height: 30px;
  height: auto;
  line-height: 20px;
  margin-top: 24px;
  margin-right: 12px;
  text-align: center;
  pointer-events: none;
}
.right_ellipsiss {
  // min-width: 80px;
  left: 95px;
  top: -30px;
}
.left_ellipsiss {
  right: 95px;
  top: -30px;
}
.top_ellipsiss {
  bottom: 20px;
}
.bottom_ellipsiss {
  top: -3px;
}
</style>
