<!-- 新建角色弹窗 -->
<template>
  <el-dialog
    :title="title"
    :visible="dialogVisible"
    :width="stepIndex == 1 ? '45%' : '80%'"
    @close="close"
    @opened="opened"
  >
    <!-- 表单表体 -->
    <div v-show="stepIndex == 1 && !this.dialogData.edit">
      <os-form ref="formData" :formFields="formFields" :formData="formData" />
    </div>
    <div v-show="stepIndex == 2">
      <table-transfer
        :data="leftData"
        v-model="rightData"
        row-key="strategyId"
        filterable
        :titles="['选择策略', '已选策略']"
        filterPlaceholder="输入策略名搜索"
        style="width: 100%;"
        :filter-method="filterMethod"
        :selectable="selectable"
      >
        <template>
          <el-table-column label="策略姓名" prop="strategyName">
            <template slot-scope="scope">
              <div style="text-align: left; padding: 0 5px;">
                <div>
                  {{ scope.row.strategyName }}
                </div>
                <div
                  style="
                    color: gray;
                    font-size: 10px;
                    white-space: wrap;
                    line-height: 10px;
                  "
                >
                  {{ scope.row.strategyDesc }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="策略类型" prop="strategyType" width="60" />
        </template>
      </table-transfer>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm">
        {{ stepIndex == 1 ? '下一步' : '确认' }}
      </el-button>
      <el-button type="" @click="close">
        取消
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import store from '@/store'
import {
  addRole,
  updateRole,
  getStrategyItemListByCodition,
  getStrategyItemListByRole,
} from '@/api/capacityApi'
export default {
  name: 'addDialog',
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
    let validateName = (rule, value, callback) => {
      var reg = /^[a-zA-Z0-9_`~!@$^\u4e00-\u9fa5\.\-]+$/
      if (!reg.test(value)) {
        callback(new Error('输入的字符只能包含：中英文、数字或符号_-.`~!@$^'))
      } else {
        callback()
      }
    }
    return {
      stepIndex: 1, //步骤
      formData: {
        roleName: '',
        roleDescription: '',
      },
      formFields: [
        {
          labelName: '角色名称：',
          field: 'roleName',
          type: 'input',
          placeholder: '请输入角色名称',
          position: 'center',
          span: 24,
          rules: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
          ],
        },
        {
          labelName: '角色描述：',
          field: 'roleDescription',
          type: 'input',
          placeholder: '请输入角色描述',
          position: 'center',
          span: 24,
        },
      ],
      leftData: [], //左侧表格数据
      rightData: [], //右侧表格数据
      relevanced: [], //已关联策略
    }
  },
  computed: {
    title() {
      if (this.stepIndex == 1 && this.dialogData.edit) {
        return '编辑角色'
      } else if (this.stepIndex == 1 && !this.dialogData.edit) {
        return '新增角色'
      } else {
        return '策略关联'
      }
    },
  },
  methods: {
    opened() {
      Object.keys(this.formData).map((item) => {
        this.formData[item] = this.dialogData[item]
      })
      if (this.dialogData.edit) {
        this.stepIndex = 2
      }
      console.log(this.dialogData, '弹窗数据')
      this.initData()
      this.getRightData()
    },
    //搜索
    filterMethod(keyword, row) {
      return row.strategyName.indexOf(keyword) > -1
    },
    selectable(row, index) {
      // return的是可选择的情况
      this.relevanced?.forEach((el) => {
        //禁用之前已选的策略
        // if (row.strategyId === el) {
        //   row.isSelected = '1'
        // }
      })
      return row.isSelected !== '1'
    },
    initData() {
      // 获取左侧表格数据--全量策略
      getStrategyItemListByCodition({}).then((res) => {
        if (res.data.code === '0' && res.data.data?.length > 0) {
          this.leftData = res.data.data.map((item, index) => {
            return {
              strategyName: item.label,
              strategyId: item.value,
              strategyType: item.type,
              strategyDesc: item.remark,
            }
          })
        }
      })
    },
    //获取右侧表格数据
    getRightData() {
      getStrategyItemListByRole({
        roleId: this.dialogData.roleId,
      }).then((res) => {
        if (res.data.code === '0') {
          // this.rightData = res.data.data
          // this.relevanced = res.data.data
          res.data?.data?.assocList?.map((item, index) => {
            this.rightData.push(item.value)
            this.relevanced.push(item.value)
          })
        }
      })
      console.log(this.rightData, '右侧数据')
    },
    //确定
    confirm() {
      this.$refs.formData.validate().then((valid) => {
        if (valid) {
          if (this.stepIndex == 1) {
            this.stepIndex = 2
          } else if (this.stepIndex == 2) {
            if (this.rightData.length == 0) {
              this.$message.warning('请选择关联策略')
              return
            }
            //编辑
            let params1 = {
              roleId: this.dialogData.roleId,
              strategyId: this.rightData,
            }
            //新增
            let params2 = {
              roleDescription: this.formData.roleDescription,
              roleName: this.formData.roleName,
              strategyId: this.rightData,
            }
            if (this.dialogData.edit) {
              updateRole(params1).then((res) => {
                if (res.data.code === '0') {
                  this.$message.success('编辑成功！')
                  this.close(1)
                }
              })
            } else {
              addRole(params2).then((res) => {
                if (res.data.code === '0') {
                  this.$message.success('新建成功！')
                  this.close(1)
                }
              })
            }
          }
        } else {
          this.$message({
            type: 'warning',
            message: '请完善表单..',
          })
        }
      })
    },
    //关闭弹窗事件
    close(num) {
      this.$emit('dialogVisible', false, num)
      this.stepIndex = 1
      this.leftData = []
      this.rightData = []
      this.relevanced = []
      this.$refs.formData.emptyFormData()
    },
  },
}
</script>

<style lang="scss" scoped></style>
