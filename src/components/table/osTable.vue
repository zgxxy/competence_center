<template>
  <section>
    <el-table
      ref="osTable"
      :key="tableKey"
      :row-class-name="tableRowClassName"
      :border="border"
      v-loading="tLoading"
      element-loading-background="rgba(0, 0, 0, 0.5)"
      element-loading-text="数据正在加载中"
      element-loading-spinner="el-icon-loading"
      :data="tableData"
      :height="height"
      :max-height="maxHeight"
      :show-header="showHeader"
      :cell-style="cellStyle"
      :header-cell-style="headerCellStyle"
      :default-sort="{ prop: 'id', order: null }"
      :row-key="rowKey"
      @row-click="handleTableRowChange"
      @row-dblclick="handleDbclick"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
      @expand-change="expandChange"
      style="width: 100%; font-size: 13px;"
    >
      <el-table-column
        v-if="tableOptions.multipleSelect"
        align="center"
        type="selection"
        :selectable="selectable"
      />
      <el-table-column
        v-if="tableOptions.isNumber !== false"
        align="center"
        type="index"
        label="序号"
        width="50"
      />
      <template v-for="(cols, index) in tableCols">
        <!-- 普通列表，只需要传字段prop，不需要特殊处理 -->
        <el-table-column
          :show-overflow-tooltip="cols.isTooltip !== false"
          v-if="
            !cols.hidden &&
            cols.type !== 'slot' &&
            cols.type !== 'expand' &&
            cols.comps == undefined &&
            tableCols[index][cols.prop] !== null
          "
          :key="'table' + index"
          :sortable="cols.sortable"
          :prop="cols.prop"
          :label="cols.label"
          :align="cols.align ? cols.align : 'center'"
          :width="cols.width"
          :min-width="cols.minWidth || 100"
          :fixed="cols.fixed"
          :callbackObj="callbackObj"
        >
          <template slot-scope="{ row }">
            <!-- 传isTransform时，1和true自动转化为“是”，其余为“否” -->
            <span
              v-if="cols.isTransform"
              :style="
                typeof cols.style == 'function' ? cols.style(row) : cols.style
              "
            >
              {{
                (row[cols.prop] == '' ||
                  row[cols.prop] == null ||
                  row[cols.prop] == undefined) &&
                row[cols.prop] !== false
                  ? '--'
                  : row[cols.prop] == '1' || row[cols.prop] == true
                  ? '是'
                  : '否'
              }}
            </span>
            <span
              v-else
              :style="
                typeof cols.style == 'function' ? cols.style(row) : cols.style
              "
            >
              <span v-if="cols.filter">
                {{ filterProp(row[cols.prop], cols.filter) }}
              </span>
              <span v-else-if="cols.phoneHide">
                {{ row[cols.prop] ? phoneHide(row[cols.prop]) : '--' }}
              </span>
              <span v-else-if="cols.nameHide">
                {{ row[cols.prop] ? nameHide(row[cols.prop]) : '--' }}
              </span>
              <span v-else-if="cols.idHide">
                {{ row[cols.prop] ? idHide(row[cols.prop]) : '--' }}
              </span>
              <span v-else-if="typeof row[cols.prop] == 'object'">
                <span v-if="cols.newLabel">
                  {{ arrComputed(row[cols.prop], cols.newLabel) }}
                </span>
                <span v-else>
                  {{ arrComputed(row[cols.prop]) }}
                </span>
              </span>
              <span v-else>
                {{
                  row[cols.prop] || row[cols.prop] == 0 ? row[cols.prop] : '--'
                }}
              </span>
            </span>
          </template>
        </el-table-column>
        <!-- 自定义列表插槽，示例：
          <template slot="字段名" slot-scope="props">
            <span>{{ props.row.对应字段 }}</span>
          </template>
         -->
        <el-table-column
          :show-overflow-tooltip="cols.isTooltip !== false"
          v-if="
            !cols.hidden &&
            cols.type == 'slot' &&
            cols.comps == undefined &&
            tableCols[index][cols.prop] !== null
          "
          :key="'slot' + index"
          :sortable="cols.sortable"
          :prop="cols.prop"
          :label="cols.label"
          :align="cols.align ? cols.align : 'center'"
          :width="cols.width"
          :min-width="cols.minWidth || 100"
          :fixed="cols.fixed"
          :callbackObj="callbackObj"
        >
          <template slot-scope="{ row }">
            <slot :name="cols.prop" :row="row"></slot>
          </template>
        </el-table-column>
        <!-- operate 操作栏-->
        <template v-if="!cols.hidden && cols.comps && cols.comps.length > 0">
          <el-table-column
            align="center"
            :key="'operate' + index"
            :width="cols.width || 93"
            :min-width="cols.minWidth || 100"
            :label="cols.label"
            :fixed="cols.fixed"
          >
            <template slot-scope="{ row }">
              <div class="operateBox">
                <div
                  v-for="(col, inx) in cols.comps"
                  style="display: flex; flex-wrap: nowrap;"
                >
                  <!-- 链接按钮 -->
                  <div
                    v-if="
                      col.type === 'link' &&
                      (typeof col.show == 'function'
                        ? col.show()
                        : col.show != undefined
                        ? col.show
                        : true)
                    "
                    v-show="showKey(row, col)"
                    class="btn_box"
                  >
                    <el-link
                      v-if="
                        (row[cols.prop] || col.labelName)
                        
                      "
                      :key="`link_${inx}`"
                      :icon="col.icon"
                      :disabled="col.disabled"
                      class="osInput"
                      :class="{
                        active:
                          row.isActive === true && row.currentIndex == index,
                      }"
                      style="color: #409eff;"
                      @click="
                        doChildEvent(
                          col.click || col.clickEvent,
                          { row: row, cols: cols, comp: col, index: index },
                          'click',
                        )
                      "
                    >
                      {{ row[cols.prop] || col.labelName }}
                    </el-link>
                    <div v-else>--</div>
                  </div>
                  <!-- 按钮 -->
                  <div
                    v-else-if="
                      col.type === 'button' &&
                      (typeof col.show == 'function'
                        ? col.show()
                        : col.show != undefined
                        ? col.show
                        : true)
                    "
                    v-show="showKey(row, col)"
                    class="btn_box"
                  >
                    <el-button
                      :key="`btn_${inx}`"
                      class="osInput"
                      :icon="col.icon"
                      :size="col.size || 'mini'"
                      :type="col.btnType || 'primary '"
                      :disabled="col.disabled"
                      :style="col.style"
                      :plain="col.isPlain"
                      :circle="col.isCircle"
                      @click="
                        doChildEvent(
                          col.click || col.clickEvent,
                          { row: row, cols: cols, comp: col, index: index },
                          'click',
                        )
                      "
                    >
                      {{ col.labelName }}
                    </el-button>
                  </div>
                  <!-- tag -->
                  <div
                    v-else-if="
                      col.type === 'tag' &&
                      (typeof col.show == 'function'
                        ? col.show()
                        : col.show != undefined
                        ? col.show
                        : true)
                    "
                    class="btn_box"
                    v-show="showKey(row, col)"
                  >
                    <el-tag
                      :key="`tag_${inx}`"
                      class="osInput"
                      :icon="col.icon"
                      :size="col.size || 'mini'"
                      :type="col.btnType || 'primary '"
                      :disabled="col.disabled"
                      :style="col.style"
                      plain
                      @click="
                        doChildEvent(
                          col.click || col.clickEvent,
                          { row: row, cols: cols, comp: col },
                          'click',
                        )
                      "
                    >
                      {{ col.labelName }}
                    </el-tag>
                  </div>
                  <!-- 文本输入框 -->
                  <el-tooltip
                    v-else-if="col.type === 'inputTxt'"
                    placement="top"
                    :content="row[cols.prop].toString()"
                    :disabled="!col.isTooltip"
                    :key="`inputTxt_${inx}`"
                  >
                    <el-input
                      v-model="row[cols.prop]"
                      :disabled="col.disabled"
                      :readonly="col.readonly"
                      :minlength="col.dataOptions.minlength"
                      :maxlength="col.dataOptions.maxlength"
                      :clearable="col.clearable || false"
                      :show-word-limit="col.dataOptions.showWord || false"
                      :prefix-icon="col.dataOptions.prefixIcon"
                      :suffix-icon="col.dataOptions.suffixIcon"
                      :size="col.size"
                      :placeholder="col.placeholder || '请输入'"
                      style="font-size: 13px; color: #409eff;"
                      @focus="
                        doChildEvent(
                          col.focus,
                          { row: row, cols: cols, comp: col },
                          'focus',
                        )
                      "
                      @blur="
                        doChildEvent(
                          col.blur,
                          { row: row, cols: cols, comp: col },
                          'blur',
                        )
                      "
                      @input="
                        doChildEvent(
                          col.input,
                          { row: row, cols: cols, comp: col },
                          'input',
                        )
                      "
                      @change="
                        doChildEvent(
                          col.change,
                          { row: row, cols: cols, comp: col },
                          'change',
                        )
                      "
                    />
                  </el-tooltip>
                  <!-- 文本域输入框 -->
                  <el-input
                    v-else-if="col.type === 'inputTxtArea'"
                    :key="`inputTxtArea_${inx}`"
                    v-model="row[cols.prop]"
                    :disabled="col.disabled"
                    :readonly="col.readonly"
                    :minlength="col.dataOptions.minlength"
                    :maxlength="col.dataOptions.maxlength"
                    :show-word-limit="col.dataOptions.showWord || false"
                    :placeholder="col.placeholder || '请输入'"
                    :autosize="col.dataOptions.autosize"
                    :rows="col.dataOptions.rows || 1"
                    type="textarea"
                    class="osInput"
                    @focus="
                      doChildEvent(
                        col.focus,
                        { row: row, cols: cols, comp: col },
                        'focus',
                      )
                    "
                    @blur="
                      doChildEvent(
                        col.blur,
                        { row: row, cols: cols, comp: col },
                        'blur',
                      )
                    "
                    @input="
                      doChildEvent(
                        col.input,
                        { row: row, cols: cols, comp: col },
                        'input',
                      )
                    "
                    @change="
                      doChildEvent(
                        col.change,
                        { row: row, cols: cols, comp: col },
                        'change',
                      )
                    "
                  />
                  <!-- 数字输入框 -->
                  <el-input
                    v-else-if="col.type === 'inputNum'"
                    :key="`inputTxtNum_${inx}`"
                    v-model="row[cols.prop]"
                    :disabled="col.disabled"
                    :readonly="col.readonly"
                    :minlength="col.dataOptions.minlength"
                    :maxlength="col.dataOptions.maxlength"
                    :prefix-icon="col.dataOptions.prefixIcon"
                    :suffix-icon="col.dataOptions.suffixIcon"
                    :clearable="col.clearable || false"
                    :size="col.size"
                    :placeholder="col.placeholder || '请输入'"
                    type="number"
                    class="osInput"
                    @focus="
                      doChildEvent(
                        col.focus,
                        { row: row, cols: cols, comp: col },
                        'focus',
                      )
                    "
                    @blur="
                      doChildEvent(
                        col.blur,
                        { row: row, cols: cols, comp: col },
                        'blur',
                      )
                    "
                    @input="
                      doChildEvent(
                        col.input,
                        { row: row, cols: cols, comp: col },
                        'input',
                      )
                    "
                    @change="
                      doChildEvent(
                        col.change,
                        { row: row, cols: cols, comp: col },
                        'change',
                      )
                    "
                  />
                  <!-- 日期选择器-->
                  <el-tooltip
                    v-else-if="col.type === 'inputDate'"
                    placement="top"
                    :content="row[cols.prop]"
                    :disabled="!col.isTooltip"
                    :key="`inputDate_${inx}`"
                  >
                    <el-date-picker
                      v-model="row[cols.prop]"
                      :type="col.dateType"
                      :picker-options="col.datePickerOptions"
                      class="osInput dateInput"
                      placeholder="选择日期"
                      :default-time="col.dataOptions.defaultTime"
                      :format="col.dataOptions.format || 'yyyy-MM-dd HH:mm:ss'"
                      :value-format="
                        col.dataOptions.valueFormat || 'yyyy-MM-dd HH:mm:ss'
                      "
                      :start-placeholder="'开始日期'"
                      :end-placeholder="'结束日期'"
                      :disabled="col.disabled"
                      :clearable="col.clearable || false"
                      @change="
                        doChildEvent(
                          col.change,
                          { row: row, cols: cols, comp: col },
                          'change',
                        )
                      "
                    />
                  </el-tooltip>
                  <!-- switch开关 -->
                  <!-- 注意：如果switch定义了change事件，需要手动给字段赋值row = !row，switch按钮才生效-->
                  <el-switch
                    v-else-if="col.type === 'switch'"
                    :value="row[cols.prop]"
                    :active-text="col.activeText"
                    :inactive-text="col.inactiveText"
                    :active-color="col.activeColor || '#66b1ff'"
                    :inactive-color="col.inactiveColor || '#ff4949'"
                    :active-value="col.activeValue"
                    :inactive-value="col.inactiveValue"
                    @change="
                      col.change
                        ? doChildEvent(
                            col.change,
                            { row: row, cols: cols, comp: col },
                            'change',
                          )
                        : (row[cols.prop] = !row[cols.prop])
                    "
                  ></el-switch>
                </div>
              </div>
            </template>
          </el-table-column>
        </template>
      </template>
      <!-- 抽屉二级嵌套table -->
      <el-table-column type="expand" key="expand" width="1" v-if="expand">
        <template slot-scope="{ row }">
          <div style="margin: 5px 15px;">
            <slot name="expand" :row="row"></slot>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :isPage="page.isPage"
      :pageIndex="page.pageIndex"
      :pageSize="page.pageSize"
      :pageSizes="page.pageSizes"
      :layout="page.layout"
      :total="Number(page.total)"
      :pagerCount="page.pagerCount"
      @pageChanged="pageChanged"
    />
  </section>
</template>
<script>
import { utilsMixins } from './mixins/utilsMixins'
import pagination from './pagination'
export default {
  name: 'osTable',
  components: {
    pagination,
  },
  provide() {
    // 这里定义provide 传递参数
    return {
      pagination: this.pages, // 分页属性
    }
  },
  mixins: [utilsMixins],
  props: {
    //网格字段内容
    tableCols: Array,
    //网格数据
    tableData: Array,
    //是否网格线
    border: {
      type: Boolean,
      default: true,
    },
    tableKey: {
      type: String,
      default: 'tableKey',
    },
    //是否显示表头
    showHeader: {
      type: Boolean,
      default: true,
    },
    //是否使用抽屉table
    expand: {
      type: Boolean,
      default: false,
    },
    //网格行设置css方法，用法参考官网
    tableRowClassName: Function,
    loading: Boolean,
    rowKey: String,
    //网格行样式
    cellStyle: {
      type: Function,
      default: () => {
        return { borderColor: '#d8e6fe', fontSize: '13px' }
      },
    },
    //表头样式
    headerCellStyle: {
      type: Object,
      default: () => {
        return {
          background: '#eef5ff',
          color: '#606266',
          borderColor: '#d8e6fe',
          fontSize: '13px',
        }
      },
    },
    height: Number, //网格内容高度
    maxHeight: Number, //网格最大高度
    //分页
    page: {
      type: Object,
      default: () => ({}),
    },
    tableOptions: {
      type: Object,
      default: () => {
        return {
          isNumber: true, //序号
          multipleSelect: false, //是否多选
        }
      },
    },
    //回调数据
    callbackObj: {
      type: Object,
      default: function () {
        return {}
      },
    },
    //禁选判断事件
    selectable: Function,
    //例子
    // selectable(row, index) {
    //   // return的是可选择的情况
    //   return row.isSelected !== '1'
    // },
  },
  mounted() {
    //清除link选中状态
    this.tableData.forEach((el) => {
      if (el.isActive) {
        delete el['isActive']
      }
    })
  },
  watch: {
    //分页组件
    page: {
      handler(newValue, oldValue) {
        setTimeout(() => {
          this.pages.isPage = newValue.isPage || true //是否启用分页组件
          this.pages.pageIndex = newValue.pageIndex || 1 //当前页码
          this.pages.pageSize = newValue.pageSize || 10 //每页几条
          this.pages.pageSizes = newValue.pageSizes || [10, 20, 30] //每页可显示条数
          this.pages.layout =
            newValue.layout || 'total, sizes, prev, pager, next, jumper' //分页组件显示内容
          this.pages.disabled = newValue.pageDisabled || false //是否禁用
          this.pages.total = newValue.total || 0 //数据总条数
          this.pages.pagerCount = newValue.pagerCount || 5 //显示的页码按钮个数（>5且单数）
        }, 500)
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      currentIndex: null,
      //分页配置
      pages: {
        isPage: true,
        pageIndex: 1,
        total: 0,
        pageSize: 10,
        pageSizes: [10, 20, 30],
        layout: 'total, sizes, prev, pager, next, jumper',
        disabled: false,
        pagerCount: 5,
      },
      tLoading: this.loading,
      currentRow: [],
      // 单选行数据
      clickRow: {},
    }
  },
  methods: {
    //字段值转换，数据示例：
    //val: '字段值'
    //filter: [{lable: '要显示的值',value: '字段的值'}] ————与prop同级
    filterProp(val, filter) {
      let res = val || '--'
      filter.find((el) => {
        if (el.value == val) {
          res = el.label
        }
      })
      return res
    },
    //手机号脱敏————传phoneHide: true
    phoneHide(val) {
      let res = ''
      res = this.encryptPhone(val)
      return res
    },
    //姓名脱敏————传nameHide: true
    nameHide(val) {
      let res = ''
      res = this.encryptName(val)
      return res
    },
    //id号脱敏————传idHide: true
    idHide(val) {
      let res = ''
      res = this.encryptId(val)
      return res
    },
    //对象数组数据的转换，数据示例：1、['数据1','数据2']；2、[{value:value,label:label}]；3、[{code:value,name:label}]
    //newLabel: '要显示的字段名name'，如果是数据是前两种就不用传
    arrComputed(arr, newLabel) {
      let res = ''
      if (arr && arr.length > 0) {
        if (newLabel) {
          res = arr
            .map((el) => el[newLabel])
            .filter(Boolean)
            .join('、')
        } else {
          res = arr
            .map((el) => el.label || el)
            .filter(Boolean)
            .join('、')
        }
      }

      return res || '--'
    },
    //隐藏按钮方法：注意放在comps里，数据示例：
    //comps: [
    //  dataOptions: {
    //    deleteName: '删除', ————按钮名称，和labelName保持一致
    //    deleteKey: '过滤字段', ————根据网格的某一个字段隐藏
    //    deleteVal: ['xxx'], ————当deleteKey=='xxx'时，该按钮隐藏
    //    deleteKey1: '过滤字段2',
    //    deleteVal1: ['xx'],
    //  }
    //]
    showKey(row, col) {
      if (
        (col.dataOptions?.deleteKey &&
          (row[col.dataOptions.deleteKey] == col.dataOptions.deleteVal[0] ||
            row[col.dataOptions.deleteKey] == col.dataOptions.deleteVal[1] ||
            row[col.dataOptions.deleteKey] == col.dataOptions.deleteVal[2] ||
            row[col.dataOptions.deleteKey] == col.dataOptions.deleteVal[3] ||
            row[col.dataOptions.deleteKey] == col.dataOptions.deleteVal[4] ||
            row[col.dataOptions.deleteKey] == col.dataOptions.deleteVal[5] ||
            row[col.dataOptions.deleteKey] == col.dataOptions.deleteVal[6] ||
            row[col.dataOptions.deleteKey] == col.dataOptions.deleteVal[7] ||
            row[col.dataOptions.deleteKey] == col.dataOptions.deleteVal[8]) &&
          col.labelName == col.dataOptions.deleteName) ||
        (col.dataOptions?.deleteKey1 &&
          (row[col.dataOptions.deleteKey1] == col.dataOptions.deleteVal1[0] ||
            row[col.dataOptions.deleteKey1] == col.dataOptions.deleteVal1[1] ||
            row[col.dataOptions.deleteKey1] == col.dataOptions.deleteVal1[2] ||
            row[col.dataOptions.deleteKey1] == col.dataOptions.deleteVal1[3] ||
            row[col.dataOptions.deleteKey1] == col.dataOptions.deleteVal1[4] ||
            row[col.dataOptions.deleteKey1] == col.dataOptions.deleteVal1[5] ||
            row[col.dataOptions.deleteKey1] == col.dataOptions.deleteVal1[6] ||
            row[col.dataOptions.deleteKey1] == col.dataOptions.deleteVal1[7] ||
            row[col.dataOptions.deleteKey1] == col.dataOptions.deleteVal1[8]) &&
          col.labelName == col.dataOptions.deleteName) ||
        (col.dataOptions?.deleteKey2 &&
          (row[col.dataOptions.deleteKey2] == col.dataOptions.deleteVal2[0] ||
            row[col.dataOptions.deleteKey2] == col.dataOptions.deleteVal2[1] ||
            row[col.dataOptions.deleteKey2] == col.dataOptions.deleteVal2[2] ||
            row[col.dataOptions.deleteKey2] == col.dataOptions.deleteVal2[3] ||
            row[col.dataOptions.deleteKey2] == col.dataOptions.deleteVal2[4] ||
            row[col.dataOptions.deleteKey2] == col.dataOptions.deleteVal2[5] ||
            row[col.dataOptions.deleteKey2] == col.dataOptions.deleteVal2[6] ||
            row[col.dataOptions.deleteKey2] == col.dataOptions.deleteVal2[7] ||
            row[col.dataOptions.deleteKey2] == col.dataOptions.deleteVal2[8]) &&
          col.labelName == col.dataOptions.deleteName) ||
        (col.dataOptions?.deleteKey3 &&
          (row[col.dataOptions.deleteKey3] == col.dataOptions.deleteVal3[0] ||
            row[col.dataOptions.deleteKey3] == col.dataOptions.deleteVal3[1] ||
            row[col.dataOptions.deleteKey3] == col.dataOptions.deleteVal3[2] ||
            row[col.dataOptions.deleteKey3] == col.dataOptions.deleteVal3[3] ||
            row[col.dataOptions.deleteKey3] == col.dataOptions.deleteVal3[4] ||
            row[col.dataOptions.deleteKey3] == col.dataOptions.deleteVal3[5] ||
            row[col.dataOptions.deleteKey3] == col.dataOptions.deleteVal3[6] ||
            row[col.dataOptions.deleteKey3] == col.dataOptions.deleteVal3[7] ||
            row[col.dataOptions.deleteKey3] == col.dataOptions.deleteVal3[8]) &&
          col.labelName == col.dataOptions.deleteName)
      ) {
        return false
      } else {
        return true
      }
    },
    //表格行单击事件
    handleTableRowChange(row, index) {
      // 网格单击后返回钩子
      this.execCallBack('onRowClick', row, index)
    },
    //表格行双击事件
    handleDbclick(row, column, event) {
      // 网格双击后返回钩子
      this.execCallBack('onRowDbClick', row, column, event)
    },
    handleSelectionChange(rows) {
      this.currentRow = rows
      // select change事件返回钩子
      this.execCallBack('onCheckSelectChange', rows)
    },
    //排序
    sortChange(filters) {
      this.$emit('sortChange', filters)
    },
    //打开抽屉table事件
    openChildTable(val, expand) {
      this.$refs.osTable.toggleRowExpansion(val, expand)
    },
    //抽屉tablechange事件
    expandChange(row, expandedRows) {
      if (!row.isActive && expandedRows.length > 0) {
        row.isActive = true
      } else {
        row.isActive = false
      }
      this.$emit('expandChange', row)
    },
    //表头字段过滤
    filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    doChildEvent(clickEvent, args, eventType, execTrigger) {
      const { row, cols, comp, index } = args
      if (eventType === 'click') {
        row ? (this.clickRow = [row]) : false
      }
      if (comp.type === 'link') {
        row ? (row.currentIndex = index) : false
      }
      if (eventType === 'change') {
        // 文本字段赋值
        if (comp && comp.textField && row[comp.prop]) {
          const options =
            row[comp.prop + 'Opt'] || comp.dataOptions?.dataSource?.options
          if (options?.length > 0) {
            const curOption = options.filter(
              (o) => o.value === row[comp.prop],
            )[0]
            if (curOption) {
              row[comp.textField] = curOption.label
            }
          }
        }
      }
      if (comp) {
        // 执行事件
        this.eventAdapter
          ? this.eventAdapter(
              clickEvent,
              { row: row, cols: cols },
              // { configObj: comp, row: row },
            )
          : false
      }
    },
    // 执行回调事件
    execCallBack(fun, row, index) {
      if (arguments && arguments.length > 0) {
        const funcName = arguments[0]
        if (typeof this.callbackObj[funcName] === 'function') {
          const args = []
          if (arguments.length > 1) {
            for (let i = 1; i < arguments.length; i++) {
              args.push(arguments[i])
            }
          }
          return this.callbackObj[funcName](...args)
        }
      }
      return 'null'
    },
    pageChanged(val) {
      this.$emit('pageChanged', val)
    },
    //获取上一级组件
    getParent() {
      var parent = this.$parent
      while (!parent.$refs[this.tableOptions.key]) {
        parent = parent.$parent
        if (!parent || parent.$refs?.refRouterView) {
          break
        }
      }
      return parent
    },
  },
}
</script>
<style lang="scss" scoped>
.osInput {
  font-size: 13px;
  width: 100%;
  cursor: pointer;
}
.active {
  border-radius: 3px;
  padding: 0 10px;
  background: #eee;
}
::v-deep .osInput.el-button span {
  font-size: 13px;
}
::v-deep .osInput.el-button {
  padding: 3px !important;
  height: 25px;
}
::v-deep .el-input__inner {
  height: 24px !important;
  line-height: 24px !important;
}
::v-deep .el-input__icon {
  line-height: 33px;
}
::v-deep .el-textarea__inner {
  height: 31.5px !important;
}
::v-deep .el-switch.is-disabled {
  opacity: 1;
}
::v-deep .el-switch.is-disabled .el-switch__core,
.el-switch.is-disabled .el-switch__label {
  cursor: pointer !important;
}
::v-deep .el-tag {
  font-size: 12px;
}
.operateBox {
  padding: 0 5px;
  display: flex;
  justify-content: center;
  .el-link {
    margin-right: 5px;
  }
  .btn_box {
    margin: 0 3px;
  }
}
</style>
