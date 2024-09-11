<!-- 新建/编辑服务组弹窗 -->
<template>
  <el-dialog
    :title="title"
    :visible="dialogVisible"
    :width="stepIndex == 1 ? '45%' : '60%'"
    @opened="opened"
    @close="close"
  >
    <div class="steps_box" v-if="!dialogData.edit">
      <el-steps :active="stepIndex" simple>
        <el-step title="填写服务信息" icon="el-icon-edit-outline" />
        <el-step title="关联服务" icon="el-icon-document-add" />
      </el-steps>
    </div>

    <!-- 表单表体 -->
    <div v-show="stepIndex == 1 && !dialogData.edit">
      <os-form ref="formData" :formFields="formFields" :formData="formData" />
    </div>
    <div v-show="stepIndex == 2" class="resource_box">
      <div>
        <os-form
          ref="resourceFormData"
          :formFields="resourceFormFields"
          :formData="resourceFormData"
        ></os-form>
        <div class="checkbox_box">
          <el-checkbox-group
            v-model="checkList"
            @change="resourceChage"
            v-if="resourceData.length > 0"
          >
            <el-checkbox
              v-for="(item, index) in resourceData"
              :label="item.value"
              :key="index + 'checkbox'"
            >
              <labelName
                :label-name="item.label"
                label-style="font-weight: 300;"
                tooltip-min-width="80px"
              />
            </el-checkbox>
          </el-checkbox-group>
          <el-empty v-else description="暂无数据" style="height: 100%;" />
        </div>
      </div>
      <div></div>
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
import {
  getAssocServiceList,
  addServiceGroup,
  updateServiceGroup,
} from '@/api/capacityApi'
export default {
  name: 'addDialog',
  components: {
    labelName: () => import('@/components/form/labelName'), //labelName组件
  },
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
      resourceData: [], //当前查询的资源选项数据
      checkList: [],
      checkData: [],
      formData: {
        serviceGroupName: '',
        remark: '',
      },
      formFields: [
        {
          labelName: '服务组名：',
          field: 'serviceGroupName',
          type: 'input',
          placeholder: '请输入服务组名称',
          position: 'center',
          span: 24,
          rules: [
            { required: true, message: '请输入服务组名称', trigger: 'blur' },
          ],
        },
        {
          labelName: '备注：',
          field: 'remark',
          type: 'input',
          position: 'center',
          span: 24,
        },
      ],
      resourceFormData: {
        resourceName: '',
        checkAll: false,
      },
      resourceFormFields: [
        {
          labelName: '选择服务资源：',
          labelWidth: '100px',
          field: 'resourceName',
          type: 'input',
          placeholder: '请输入服务名称',
          position: 'left',
          suffixOptions: {
            isSuffix: true,
            click: this.initData,
          },
          span: 12,
        },
        {
          checkboxLabel: '全部资源',
          field: 'checkAll',
          type: 'checkbox',
          isSingle: true,
          position: 'left',
          isIndeterminate: false,
          change: (row) => this.checkAllChange(row),
          span: 6,
        },
      ],
    }
  },
  computed: {
    title() {
      if (this.stepIndex == 1 && this.dialogData.edit) {
        return '编辑服务组'
      } else if (this.stepIndex == 1 && !this.dialogData.edit) {
        return '新建服务组'
      } else {
        return '关联服务资源'
      }
    },
  },
  methods: {
    opened() {
      if (this.dialogData.edit) {
        this.stepIndex = 2
        this.initData()
        setTimeout(() => {
          this.resourceData.map((el) => {
            if (el.isChecked) {
              this.checkList.push(el.value)
            }
          })
          this.resourceChage()
        }, 700)
      }
    },
    initData() {
      const params = {
        powerName: this.resourceFormData.resourceName, // 能力名称
        serviceGroupId: this.dialogData.serviceGroupId || '',
      }
      getAssocServiceList(params).then((res) => {
        if (res.data.code === '0') {
          this.resourceData = res.data?.data?.map((item, index) => {
            if (item.isChecked) {
              this.checkData.push({
                label: item.powerName,
                value: item.powerId,
              })
            }
            return {
              label: item.powerName,
              value: item.powerId,
              isChecked: item.isChecked,
            }
          })
        }
      })
      console.log(this.resourceData, '资源查询')
      this.resourceChage()
    },
    //全选资源
    checkAllChange(val) {
      this.checkList = val
        ? Array.from(this.resourceData, ({ value }) => value)
        : []
      this.$set(
        this.getComponent('checkAll', 'resourceFormFields'),
        'isIndeterminate',
        false,
      )
    },
    //资源选择
    resourceChage(val) {
      if (
        this.checkList.length > 0 &&
        this.checkList.length !== this.resourceData.length
      ) {
        this.$set(
          this.getComponent('checkAll', 'resourceFormFields'),
          'isIndeterminate',
          true,
        )
        this.resourceFormData.checkAll = false
      } else if (
        this.checkList.length > 0 &&
        this.checkList.length == this.resourceData.length
      ) {
        this.$set(
          this.getComponent('checkAll', 'resourceFormFields'),
          'isIndeterminate',
          false,
        )
        let label = this.resourceData?.map((item) => item.value)
        console.log(label, 'labelList')
        if (label.findIndex((v, i) => v !== this.checkList[i]) === -1) {
          this.resourceFormData.checkAll = false
        } else {
          this.resourceFormData.checkAll = true
        }
      } else {
        this.$set(
          this.getComponent('checkAll', 'resourceFormFields'),
          'isIndeterminate',
          false,
        )
        this.resourceFormData.checkAll = false
      }
    },
    //确定
    confirm() {
      if (this.stepIndex == 1) {
        this.$refs.formData.validate().then((valid) => {
          if (valid) {
            this.stepIndex = 2
            this.initData()
          } else {
            this.$message({
              type: 'warning',
              message: '请完善表单..',
            })
          }
        })
      } else {
        if (this.checkList.length === 0) {
          this.$message.warning('请选择服务资源')
          return
        }
        //编辑
        if (this.dialogData.edit) {
          let params = {
            powerIdList: this.checkList,
            serviceGroupId: this.dialogData.serviceGroupId,
          }
          updateServiceGroup(params).then((res) => {
            if (res.data.code === '0') {
              this.$message.success('编辑成功！')
              this.close(1)
            }
          })
        } else {
          //新增
          let params = {
            powerIdList: this.checkList,
            remark: this.formData.remark,
            serviceGroupName: this.formData.serviceGroupName,
          }
          addServiceGroup(params).then((res) => {
            if (res.data.code === '0') {
              this.$message.success('新建成功！')
              this.close(1)
            }
          })
        }
      }
    },
    //关闭弹窗事件
    close(num) {
      this.$emit('dialogVisible', false, num)
      this.stepIndex = 1
      this.checkList = []
      this.resourceFormData.checkAll = false
      this.$set(
        this.getComponent('checkAll', 'resourceFormFields'),
        'isIndeterminate',
        false,
      )
      this.$refs.formData.emptyFormData()
    },
  },
}
</script>

<style lang="scss" scoped>
.steps_box {
  padding: 0 15px 15px;
}
.resource_box {
  padding: 0 15px;
}
.checkbox_box {
  padding: 10px 15px;
  background: #f2f2f2;
  max-height: 170px;
  overflow: auto;
}
::v-deep .el-checkbox__label {
  width: 135px;
  line-height: 25px;
}
::v-deep .el-dialog__body {
  align-items: initial;
}
.list_box {
  display: flex;
  // justify-content: space-between;
  font-size: 12px;
}
</style>
