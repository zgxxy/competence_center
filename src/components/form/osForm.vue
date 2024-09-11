<template>
  <section class="content_box">
    <el-form
      :ref="myConfig.ref"
      :model="myFormData"
      :size="myConfig.size"
      class="text-left"
      :rules="formRules"
      :label-width="myConfig.labelWidth || '80px'"
      :validate-on-rule-change="false"
      :inline="myConfig.inline"
      hide-required-asterisk
    >
      <el-row :gutter="20">
        <template v-for="(item, $index) in formFields">
          <el-col
            v-if="(typeof(item.show)=='function'?item.show():(item.show!=undefined?item.show:true))"
            :span="item.span || 6"
            :offset="item.offset"
            :push="item.push"
            :pull="item.pull"
            :key="'col' + $index"
          >
            <!-- 空白框 -->
            <template v-if="item.type == 'empty'"></template>
            <!-- 自定义插槽 -->
            <slot name="custom" v-if="item.type == 'custom'" :data="item" />
            <div
              v-else
              class="list_box"
              :class="
                item.slotOptions && item.slotOptions.isOnline ? 'online' : ''
              "
              :style="{
                justifyContent:
                  item.position == 'left'
                    ? 'flex-start'
                    : item.position == 'center'
                    ? 'center'
                    : 'flex-end',
              }"
            >
              <!-- 
                labelName：labelName
                isShowLabel：是否显示labelName组件（labelName），和*号区分开
                labelWidth：label宽度
                labelMaxlength：label显示长度，超过部分显示为“…”
                requiredIcon：是否显示必选的*号（rules.required为true时也显示*号,若rules.required==true，不想显示*，传requiredIcon:false）
               -->
              <div
                class="label_box"
                v-show="item.labelName"
                :style="{ width: item.labelWidth ? item.labelWidth : '80px' }"
              >
                <div
                  v-if="
                    (item.rules &&
                      (item.rules.required == true ||
                        isRequired(item.rules))) ||
                    item.requiredIcon
                  "
                  style="margin: -3px 3px 0 0; color: #f56c6c;"
                >
                  {{ item.requiredIcon == false ? '' : '*' }}
                </div>
                <div
                  v-else-if="
                    (item.type !== 'button' || item.type !== 'switch') &&
                    item.labelName
                  "
                  style="width: 10px;"
                ></div>
                <labelName
                  :isShowLabel="item.isShowLabel"
                  :labelMaxlength="item.labelMaxlength"
                  :labelName="item.labelName"
                  :isRequire="
                    (item.rules && item.rules.required) || item.requiredIcon
                  "
                />
              </div>
              <!-- position:默认居右，可传入left、right、center -->
              <el-form-item
                :class="item.class"
                :style="{
                  width: item.width,
                }"
                :prop="item.field"
                :key="$index"
                :rules="item.show !== false ? item.rules : []"
              >
                <!--表单前缀-->
                <template
                  v-if="
                    item.slotOptions &&
                    item.slotOptions.slot &&
                    (item.slotOptions.slotType == 'prepend' ||
                      (typeof item.slotOptions.slotType == 'object' &&
                        item.slotOptions.slotType.indexOf('prepend') != -1))
                  "
                >
                  <slot
                    :name="
                      (item.slotOptions.slotName
                        ? item.slotOptions.slotName
                        : item.field) + '-prepend'
                    "
                    :data="item"
                  />
                </template>
                <!-- 输入框 -->
                <el-input
                  v-if="item.type === 'input'"
                  v-model="myFormData[item.field]"
                  :suffix-icon="item.suffixIcon"
                  :clearable="item.clearable == false ? item.clearable : true"
                  :maxlength="item.maxlength"
                  :minlength="item.minlength"
                  :disabled="(typeof(item.disabled)=='function'?item.disabled():item.disabled)"
                  :placeholder="item.placeholder ? item.placeholder : ''"
                  :auto-complete="item.autocomplete"
                  :style="{ width: item.width || '100%' }"
                  @change="item.change && item.change(myFormData[item.field])"
                  @blur="item.blur && item.blur(myFormData[item.field])"
                  @keyup.enter.native="
                    item.enter && item.enter(myFormData[item.field])
                  "
                >
                  <!-- 自定义前置按钮———参数例子：
                    suffixOptions: {
                      isPrepend: true,（必传）
                      click: this.getList（有click方法就传）
                      icon: 'icon',（需要其他icon就传，默认查询icon）
                    }
                   -->
                  <template
                    slot="prepend"
                    v-if="item.suffixOptions && item.suffixOptions.isPrepend"
                  >
                    <i
                      :class="item.suffixOptions.icon || 'el-icon-search'"
                      @click="
                        item.suffixOptions.click &&
                          item.suffixOptions.click(myFormData[item.field])
                      "
                    ></i>
                  </template>
                  <!-- 自定义后置按钮 -->
                  <template
                    slot="append"
                    v-if="item.suffixOptions && item.suffixOptions.isAppend"
                  >
                    <i
                      :class="item.suffixOptions.icon || 'el-icon-search'"
                      @click="
                        item.suffixOptions.click &&
                          item.suffixOptions.click(myFormData[item.field])
                      "
                    ></i>
                  </template>
                  <i
                    v-if="item.suffixOptions && item.suffixOptions.isSuffix"
                    class="el-input__icon"
                    :class="item.suffixOptions.class || 'el-icon-search'"
                    slot="suffix"
                    @click="
                      item.suffixOptions.click &&
                        item.suffixOptions.click(myFormData[item.field])
                    "
                  ></i>
                </el-input>
                <!-- 数字输入框 -->
                <el-input
                  v-else-if="item.type === 'number'"
                  v-model="myFormData[item.field]"
                  :suffix-icon="item.suffixIcon"
                  :clearable="item.clearable == false ? item.clearable : true"
                  :maxlength="item.maxlength"
                  :minlength="item.minlength"
                  type="number"
                  :disabled="item.disabled"
                  :placeholder="item.placeholder ? item.placeholder : ''"
                  :auto-complete="item.autocomplete"
                  :style="{ width: item.width || '100%' }"
                  @change="item.change && item.change(myFormData[item.field])"
                  @blur="item.blur && item.blur(myFormData[item.field])"
                ></el-input>
                <!-- 密码框 -->
                <el-input
                  v-else-if="item.type === 'password'"
                  type="password"
                  show-password
                  v-model="myFormData[item.field]"
                  :suffix-icon="item.suffixIcon"
                  :clearable="item.clearable == false ? item.clearable : true"
                  :maxlength="item.maxlength"
                  :minlength="item.minlength"
                  :disabled="item.disabled"
                  :placeholder="item.placeholder ? item.placeholder : ''"
                  :auto-complete="item.autocomplete"
                  :style="{ width: item.width || '100%' }"
                  @change="item.change && item.change(myFormData[item.field])"
                  @blur="item.blur && item.blur(myFormData[item.field])"
                ></el-input>
                <!-- 文本域 -->
                <el-input
                  v-else-if="item.type === 'textarea'"
                  type="textarea"
                  :disabled="item.disabled"
                  :clearable="item.clearable == false ? item.clearable : true"
                  v-model="myFormData[item.field]"
                  :maxlength="item.maxlength"
                  :minlength="item.minlength"
                  :show-word-limit="item.showWord || false"
                  :rows="item.rows || 1"
                  :autosize="item.autosize || { minRows: 1, maxRows: 8 }"
                  :placeholder="item.placeholder ? item.placeholder : ''"
                  :style="{ width: item.width || '100%' }"
                  @change="item.change && item.change(myFormData[item.field])"
                  @blur="item.blur && item.blur(myFormData[item.field])"
                ></el-input>
                <!-- 下拉框 -->
                <el-select
                  v-else-if="item.type === 'select'"
                  :filterable="item.filterable ? item.filterable : false"
                  :clearable="item.clearable == false ? item.clearable : true"
                  :multiple="item.multiple"
                  :multiple-limit="item.limit"
                  :collapse-tags="item.collapseTags || true"
                  :reserve-keyword="item.reserveKeyword"
                  v-model="myFormData[item.field]"
                  :placeholder="item.placeholder ? item.placeholder : ''"
                  :disabled="(typeof(item.disabled)=='function'?item.disabled():item.disabled)"
                  :class="item.class"
                  :style="{ width: item.width || '100%' }"
                  @change="item.change && item.change(myFormData[item.field])"
                >
                  <el-option
                    v-for="(op, index) in item.options"
                    :key="index + 'options'"
                    :label="
                      item.optionLabel
                        ? op[item.optionLabel]
                        : op.label
                        ? op.label
                        : op
                    "
                    :value="
                      item.optionValue
                        ? op[item.optionValue]
                        : op.value
                        ? op.value
                        : op
                    "
                    :disabled="op.disabled"
                  ></el-option>
                </el-select>
                <!-- 单选组 -->
                <el-radio-group
                  v-else-if="item.type === 'radio'"
                  v-model="myFormData[item.field]"
                  :disabled="item.disabled"
                  @change="item.change && item.change(myFormData[item.field])"
                >
                  <el-radio
                    v-for="(ra, index) in item.radios"
                    :label="ra.value ? ra.value : ra"
                    :key="index"
                  >
                    {{ ra.label ? ra.label : ra }}
                  </el-radio>
                </el-radio-group>
                <!-- 复选框-->
                <template v-else-if="item.type == 'checkbox' && item.isSingle">
                  <el-checkbox
                    v-model="myFormData[item.field]"
                    :disabled="item.disabled"
                    :indeterminate="item.isIndeterminate"
                    @change="item.change && item.change(myFormData[item.field])"
                  >
                    <template v-if="item.slot">
                      <slot :name="item.field" :data="item" />
                    </template>
                    <template v-else>
                      {{
                        item.checkboxLabel ? item.checkboxLabel : item.labelName
                      }}
                    </template>
                  </el-checkbox>
                </template>
                <!-- 复选框组-->
                <el-checkbox-group
                  @change="item.change && item.change(myFormData[item.field])"
                  v-else-if="item.type === 'checkbox' && !item.isSingle"
                  v-model="myFormData[item.field]"
                  :disabled="item.disabled"
                  :indeterminate="item.isIndeterminate"
                >
                  <el-checkbox
                    v-for="(ch, index) in item.checkboxs"
                    :label="
                      item.checkboxLabel
                        ? ch[item.checkboxLabel]
                        : ch.value
                        ? ch.value
                        : ch
                    "
                    :key="index"
                  >
                    {{
                      item.checkboxLabel
                        ? ch[item.checkboxLabel]
                        : ch.label
                        ? ch.label
                        : ch
                    }}
                  </el-checkbox>
                </el-checkbox-group>
                <!-- 日期 dateType:year/month/week/date  多选类型dates/months/years-->
                <!-- pickerOptions_preset.shortcuts:快捷键按钮，dateTime同理 例：显示昨天、今天、明天的按钮————shortcuts:[-1,0,1] -->
                <!-- pickerOptions_preset.disabledDate:禁用范围规则，看方法pickerOptions_date -->
                <el-date-picker
                  v-else-if="item.type === 'date'"
                  v-model="myFormData[item.field]"
                  :type="item.dateType"
                  :placeholder="item.placeholder ? item.placeholder : ''"
                  :disabled="item.disabled"
                  :format="item.format"
                  :value-format="item.valueFormat || 'yyyy-MM-dd'"
                  :picker-options="
                    item.dateType !== 'dates' &&
                    item.dateType !== 'months' &&
                    item.dateType !== 'years' &&
                    item.pickerOptions_preset
                      ? pickerOptions_date({
                          shortcut: item.pickerOptions_preset.shortcuts,
                          disabled: item.pickerOptions_preset.disabledDate,
                        })
                      : typeof item.pickerOptions == 'function'
                      ? item.pickerOptions(myFormData[item.field])
                      : item.pickerOptions
                  "
                  :style="{ width: item.width || '100%' }"
                ></el-date-picker>
                <!-- 时间 -->
                <el-time-picker
                  v-else-if="item.type === 'time'"
                  v-model="myFormData[item.field]"
                  :placeholder="item.placeholder ? item.placeholder : ''"
                  :disabled="item.disabled"
                  :value-format="item.valueFormat || 'HH:mm:ss'"
                  :picker-options="item.pickerOptions"
                  :style="{ width: item.width || '100%' }"
                ></el-time-picker>
                <!-- 日期时间 -->
                <el-date-picker
                  v-else-if="item.type === 'datetime'"
                  v-model="myFormData[item.field]"
                  :type="item.dateType"
                  :placeholder="item.placeholder ? item.placeholder : ''"
                  :disabled="item.disabled"
                  :format="item.format"
                  :value-format="item.valueFormat || 'yyyy-MM-dd HH:mm:ss'"
                  :picker-options="
                    item.dateType !== 'dates' &&
                    item.dateType !== 'months' &&
                    item.dateType !== 'years' &&
                    item.pickerOptions_preset
                      ? pickerOptions_date({
                          shortcut: item.pickerOptions_preset.shortcuts,
                          disabled: item.pickerOptions_preset.disabledDate,
                        })
                      : typeof item.pickerOptions == 'function'
                      ? item.pickerOptions(myFormData[item.field])
                      : item.pickerOptions
                  "
                  :style="{ width: item.width || '100%' }"
                ></el-date-picker>
                <!-- 日期范围 dateType:/datetimerange/daterange/monthrange -->
                <el-date-picker
                  v-else-if="item.type === 'daterange'"
                  :type="item.dateType || 'daterange'"
                  v-model="myFormData[item.field]"
                  :range-separator="item.rangeSeparator || '至'"
                  :start-placeholder="item.startPlaceholder || '开始日期'"
                  :end-placeholder="item.endPlaceholder || '结束日期'"
                  :disabled="item.disabled"
                  :unlink-panels="item.unlinkPanels"
                  :default-time="item.defaultTime || ['00:00:00', '23:59:59']"
                  :value-format="item.valueFormat || 'yyyy-MM-dd HH:mm:ss'"
                  :picker-options="item.pickerOptions"
                  :style="{ width: item.width || '100%' }"
                  @change="item.change && item.change(myFormData[item.field])"
                ></el-date-picker>
                <!-- 开关 -->
                <el-switch
                  v-else-if="item.type === 'switch'"
                  v-model="myFormData[item.field]"
                  :disabled="item.disabled"
                ></el-switch>
                <!-- 自定义列表插槽，示例：
                  <template slot="字段名" slot-scope="props">
                    <span>{{ props.data.对应字段 }}</span>
                  </template>
                -->
                <template v-else-if="item.type === 'slot'">
                  <slot
                    :name="item.slotName ? item.slotName : item.field"
                    :data="item"
                  />
                </template>
                <!-- 按钮 -->
                <div class="btn_box" v-else-if="item.type === 'button'">
                  <template v-for="btn in item.btnList">
                    <el-button
                      v-if="(typeof(btn.show)=='function'?btn.show():(btn.show!=undefined?btn.show:true))"
                      :key="btn.label"
                      :disabled="
                        typeof btn.disabled == 'function'
                          ? btn.disabled()
                          : btn.disabled
                      "
                      :type="btn.type || ''"
                      :size="btn.size || size"
                      :icon="btn.icon"
                      :plain="btn.plain"
                      :style="btn.style"
                      @click="
                        btn.click && btn.click == 'reset'
                          ? emptyFormData()
                          : btn.click(item)
                      "
                    >
                      {{ btn.label }}
                    </el-button>
                  </template>
                </div>
                <!--form表单 append后置插槽-->
                <template
                  v-if="
                    item.slotOptions &&
                    item.slotOptions.slot &&
                    (item.slotOptions.slotType == 'append' ||
                      (typeof item.slotOptions.slotType == 'object' &&
                        item.slotOptions.slotType.indexOf('append') != -1))
                  "
                >
                  <slot
                    :name="
                      (item.slotOptions.slotName
                        ? item.slotOptions.slotName
                        : item.field) + '-append'
                    "
                    :data="item"
                  />
                </template>
              </el-form-item>
            </div>
          </el-col>
        </template>
      </el-row>
    </el-form>
  </section>
</template>

<script>
export default {
  components: {
    labelName: () => import('./labelName'), //labelName组件
  },
  name: 'osForm',
  props: {
    config: {
      type: Object,
      default: () => ({
        labelWidth: '100px',
        ref: 'formRef',
        inline: true,
        size: 'mini',
      }),
    },
    formFields: {
      type: Array,
      default: () => [],
    },
    formData: {
      type: Object,
      default: () => {},
    },
    formRules: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      myFormData: this.formData,
      myConfig: Object.assign(
        { labelWidth: '100px', ref: 'formRef', inline: true, size: 'mini' },
        this.config,
      ),
      confirmLoading: false,
      ellipsisshow: false,
      lableWidth: 80,
    }
  },
  mounted() {},
  methods: {
    isRequired(rules) {
      let result = ''
      result = rules.some(function (item) {
        return item.required == true
      })
      if (result == '') {
        return false
      } else {
        return true
      }
    },
    validate() {
      let form = this.$refs[this.myConfig.ref]
      return new Promise(function (resolve, reject) {
        form
          .validate((valid, error) => {
            resolve(valid)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    pickerOptions_date({ shortcut, disabled }) {
      var obj = {
        disabledDate(time) {
          const curDate = new Date().getTime()
          if (disabled instanceof Array && disabled.length) {
            const day1 = disabled[0] * 24 * 3600 * 1000
            const dateRegion1 = curDate + day1
            const day2 = disabled[1] * 24 * 3600 * 1000
            const dateRegion2 = curDate + day2
            //disabled为Array，区间形式[number,number]数字一定要从大到小
            if (disabled[0] < 0 && disabled[1] == 1) {
              //可选区间：[-xx,今天(1)]（包含今天）
              return time.getTime() < dateRegion1 || time.getTime() > Date.now()
            } else if (disabled[0] == 1 && disabled[1] > 0) {
              //可选区间：[今天(1),yy]（包含今天）
              return (
                time.getTime() < Date.now() - 8.64e7 ||
                time.getTime() > dateRegion2
              )
            } else if (disabled[0] < 0 && disabled[1] == 0) {
              //可选区间：[-xx,今天(0)]（不包含今天）
              return (
                time.getTime() < dateRegion1 ||
                time.getTime() > Date.now() - 8.64e7
              )
            } else if (disabled[0] == 0 && disabled[1] > 0) {
              //可选区间：[今天(0),yy]（不包含今天）
              return time.getTime() < Date.now() || time.getTime() > dateRegion2
            } else if (
              typeof disabled[0] == 'number' &&
              typeof disabled[1] == 'number'
            ) {
              //可选范围[-xx,yy]
              return (
                time.getTime() < dateRegion1 || time.getTime() > dateRegion2
              )
            } else if (
              typeof disabled[0] == 'number' &&
              typeof disabled[1] == 'string'
            ) {
              //disabled:[number,'+']、[number,'-']
              if (disabled[1] == '+') {
                //禁用指定时间之后的时间
                return time.getTime() > dateRegion1
              } else if (disabled[1] == '-') {
                //禁用指定时间之前的时间
                return time.getTime() < dateRegion1 - 8.64e7
              }
            } else {
              //disabled:['yyyy-mm-dd','0+']、['yyyy-mm-dd','0-']、['yyyy-mm-dd','1+']、['yyyy-mm-dd','1-']
              const day = new Date(disabled[0]).getTime()
              if (disabled[1] == '0+') {
                //禁用指定时间之后的时间（不包含指定时间）
                return time.getTime() > day - 8.64e7
              } else if (disabled[1] == '0-') {
                //禁用指定时间之前的时间（不包含指定时间）
                return time.getTime() < day
              } else if (disabled[1] == '1+') {
                //禁用指定时间之后的时间（包含指定时间）
                return time.getTime() > day
              } else if (disabled[1] == '1-') {
                //禁用指定时间之前的时间（包含指定时间）
                return time.getTime() < day - 8.64e7
              } else {
                const day3 = new Date(disabled[1]).getTime()
                //指定日期区间，该区间内可选，如['2024-03-07', '2024-03-18']
                return time.getTime() < day - 8.64e7 || time.getTime() > day3
              }
            }
          } else {
            //disabled为string形式，禁用指定时间之前或之后的时间
            //disabled:'0+'、'0-'、'1+'、'1-'
            if (disabled == '0+') {
              //禁用今天之后的时间（不包含今天）
              return time.getTime() > Date.now() - 8.64e7
            } else if (disabled == '0-') {
              //禁用今天之前的时间（不包含今天）
              return time.getTime() < Date.now()
            } else if (disabled == '1+') {
              //禁用今天之后的时间（包含今天）
              return time.getTime() > Date.now()
            } else if (disabled == '1-') {
              //禁用今天之前的时间（包含今天）
              return time.getTime() < Date.now() - 8.64e7
            } else if (disabled == 0) {
              return time.getTime()
            }
          }
        },
      }
      //快捷按钮
      if (shortcut && shortcut.length > 0) {
        var shortcuts = [
          {
            text: shortcut.indexOf(0) > -1 ? '今天' : '',
            onClick(picker) {
              picker.$emit('pick', new Date())
            },
          },
          {
            text: shortcut.indexOf(-1) > -1 ? '昨天' : '',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            },
          },
          {
            text: shortcut.indexOf(1) > -1 ? '明天' : '',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24)
              picker.$emit('pick', date)
            },
          },
          {
            text: shortcut.indexOf(-7) > -1 ? '一周前' : '',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            },
          },
          {
            text: shortcut.indexOf(7) > -1 ? '一周后' : '',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            },
          },
          {
            text: shortcut.indexOf(-30) > -1 ? '一个月前' : '',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', date)
            },
          },
          {
            text: shortcut.indexOf(30) > -1 ? '一个月前' : '',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 30)
              picker.$emit('pick', date)
            },
          },
          {
            text: shortcut.indexOf(-60) > -1 ? '两个月前' : '',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 60)
              picker.$emit('pick', date)
            },
          },
          {
            text: shortcut.indexOf(60) > -1 ? '两个月后' : '',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 60)
              picker.$emit('pick', date)
            },
          },
          {
            text: shortcut.indexOf(-90) > -1 ? '三个月前' : '',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', date)
            },
          },
          {
            text: shortcut.indexOf(90) > -1 ? '三个月后' : '',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 90)
              picker.$emit('pick', date)
            },
          },
          {
            text: shortcut.indexOf(-180) > -1 ? '半年前' : '',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 180)
              picker.$emit('pick', date)
            },
          },
          {
            text: shortcut.indexOf(180) > -1 ? '半年后' : '',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 180)
              picker.$emit('pick', date)
            },
          },
        ]
        obj.shortcuts = shortcuts
      }
      return obj
    },
    //清空表单
    emptyFormData() {
      this.$refs[this.myConfig.ref].resetFields()
    },
  },
}
</script>
<style lang="scss" scoped>
.content_box {
  // width: calc(100% - 8px);
  overflow: hidden;
}
.list_box {
  display: flex;
  .form_item_box {
    // width: 100%;
    // flex: 1;
  }
}
.btn_box {
  white-space: nowrap;
}
.label_box {
  font-weight: bold;
  font-size: 14px;
  margin: 5px 8px 0 0;
  display: flex;
  justify-content: flex-end;
  flex-wrap: nowrap;
  white-space: nowrap;
}
.el-input-group__append,
.el-input-group__prepend {
  padding: 0 15px;
}
.el-checkbox-button__inner,
.el-radio {
  font-weight: normal;
}
::v-deep .el-col,
.el-col-12 {
  padding-right: 0 !important;
}
::v-deep .online .el-form-item__content {
  white-space: nowrap;
}
::v-deep .el-textarea__inner {
  // min-height: 34px !important;
}
::v-deep .el-range-input {
  width: 100%;
}
::v-deep .el-range__icon {
  line-height: 25px;
}

::v-deep .el-date-editor .el-range-separator {
  line-height: 25px;
  width: 8%;
}
::v-deep .el-form-item__error {
  white-space: nowrap;
}
</style>
