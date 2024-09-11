<template>
  <div class="container">
    <!-- 表格展示 -->
    <el-card class="Content">
      <el-steps :active="stepIndex" finish-status="success" simple>
        <el-step title="填写资源基础信息" />
        <!-- <el-step title="填写计量计费信息"></el-step> -->
        <!-- <el-step title="关联供应商"></el-step> -->
      </el-steps>

      <template v-if="stepIndex == 1">
        <!-- <p class="h2">基础信息</p> -->
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="资源分类：" prop="type">
            <el-select v-model="ruleForm.type" placeholder="请选择资源分类">
              <el-option label="基础能力类" value="1" />
            </el-select>
          </el-form-item>

          <el-form-item label="资源名称：" prop="powerName">
            <el-input
              v-model="ruleForm.powerName"
              maxlength="15"
              placeholder="请输入资源名称"
            />
            <br />
            <p class="small">资源名称最长不超过15个字</p>
          </el-form-item>

          <el-form-item label="接口文档地址：" prop="documentLink">
            <el-input
              v-model="ruleForm.documentLink"
              maxlength="200"
              placeholder="请输入接口文档地址"
            />
            <br />
            <p class="small">
              文档地址需http或者https开头的格式，例如
              <span class="sp">https://www.xxxxx.com</span>
            </p>
          </el-form-item>

          <el-form-item label="交付方式：" prop="deliveryMode">
            <el-radio-group v-model="ruleForm.deliveryMode">
              <el-radio label="API">API</el-radio>
              <el-radio label="SAAS">SAAS</el-radio>
            </el-radio-group>
          </el-form-item>

          <ul class="lists">
            <li
              v-for="(item, index2) in ruleForm.authInfo"
              :key="index2 + 'cc'"
              class="lis flex_"
            >
              <el-form-item
                :class="index2 === 0 ? '' : 'noFirst'"
                :label="index2 === 0 ? '鉴权信息：' : ' '"
                :prop="'authInfo.' + index2 + '.key_'"
                :rules="rules.authInfo.key_"
                label-width="30"
              >
                <el-tooltip
                  :content="item.key_"
                  placement="top"
                  :disabled="item.key_ | showTooltip(inputWidth1)"
                >
                  <el-input
                    v-model="item.key_"
                    maxlength="50"
                    class="ipt"
                    id="inputWidth1"
                    placeholder="请输入key"
                  />
                </el-tooltip>
              </el-form-item>
              <span>:</span>
              <el-form-item
                :prop="'authInfo.' + index2 + '.value_'"
                :rules="rules.authInfo.value_"
              >
                <el-tooltip
                  :content="item.value_"
                  placement="top"
                  :disabled="item.value_ | showTooltip(inputWidth2)"
                >
                  <el-input
                    v-model="item.value_"
                    maxlength="50"
                    class="ipt"
                    id="inputWidth2"
                    placeholder="请输入value"
                  />
                </el-tooltip>
              </el-form-item>
              <i
                v-if="index2 == 0"
                class="el-icon-circle-plus icon add"
                @click="add"
              />
              <i v-else class="el-icon-remove icon del" @click="del(index2)" />
            </li>
          </ul>

          <!-- <el-form-item label="资源图片：" prop="name5">
            <el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card"
              :on-success="handlePictureCardPreview" :src="ruleForm.name5" :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
            <p class="small">支持PNG、JPEG、JPG 格式，图片规格建议120p × 120p，大小不超过500K</p>
          </el-form-item> -->

          <!-- <el-form-item label="接口文档：" prop="name7">
            <div class="group flex_">
              <el-button type="primary" plain>在线编辑</el-button>
              <el-button type="primary" plain>直接上传文档</el-button>
              <p class="small">支持PDF、JPG、Word 格式，文档不超过20M</p>
            </div>
          </el-form-item>

          <el-form-item label="操作手册：" prop="name8">
            <div class="group flex_">
              <el-button type="primary" plain>在线编辑</el-button>
              <el-button type="primary" plain>直接上传文档</el-button>
              <p class="small">支持PDF、JPG、Word 格式，文档不超过20M</p>
            </div>
          </el-form-item>

          <el-form-item label="资源地址：" prop="name9">
            <div class="box flex_">
              <el-input v-model="ruleForm.powerName" placeholder="请手动输入完整的资源地址"></el-input>
              <br>
              <el-button type="primary" plain style="margin-left: 20px;">自动生成地址</el-button>
            </div>
          </el-form-item> -->

          <el-form-item class="btnBox">
            <el-button
              class="btn"
              type="primary"
              @click="submitForm('ruleForm')"
            >
              提交
            </el-button>
            <el-button class="btn" @click="resetForm('ruleForm')">
              取消
            </el-button>
          </el-form-item>
        </el-form>
      </template>
      <!-- <template v-if="stepIndex == 2">
        <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
          <el-form-item label="计费方式：" prop="name1">
            <el-select v-model="ruleForm2.name1" placeholder="请选择计费方式">
              <el-option label="方式一" value="shanghai2"></el-option>
              <el-option label="方式二" value="beijing3"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="资源名称：" prop="powerName">
            <el-input v-model="ruleForm2.powerName" placeholder="请输入单位"></el-input>
            <br>
            <el-button type="primary" plain style="margin: 20px 0;">添加计费套餐</el-button>
          </el-form-item>

          <el-form-item class="btnBox">
            <el-button class="btn" type="primary" @click="submitForm2('ruleForm2')">下一步</el-button>
            <el-button class="btn" @click="resetForm">取消</el-button>
          </el-form-item>
        </el-form>
      </template> -->
      <!-- <template v-if="stepIndex == 3">
        第3步
      </template> -->
    </el-card>
  </div>
</template>

<script>
import { insertPowerPoolEntity } from '@/api/capacityApi'
export default {
  components: {},
  data() {
    const validateDocumentLink = (rule, value, callback) => {
      const regex = /^(https?)/i
      if (regex.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的文档地址'))
      }
    }
    return {
      inputWidth1: null,
      inputWidth2: null,
      stepIndex: 1, // 步骤
      radio: 1,
      value: '',
      ruleForm: {
        type: '1',
        powerName: '',
        deliveryMode: 'API',
        documentLink: '',
        authInfo: [
          {
            key_: '',
            value_: '',
          },
        ],
      },
      rules: {
        type: [{ required: true, message: '请选择资源分类', trigger: 'blur' }],
        documentLink: [
          { required: true, message: '请输入接口文档地址', trigger: 'blur' },
          {
            required: true,
            message: '',
            trigger: 'change',
            validator: validateDocumentLink,
          },
        ],
        powerName: [
          { required: true, message: '请输入资源名称', trigger: 'blur' },
        ],
        authInfo: {
          key_: [{ required: true, message: '请输入key', trigger: 'blur' }],
          value_: [{ required: true, message: '请输入value', trigger: 'blur' }],
        },
        deliveryMode: [
          { required: true, message: '请选择支付方式', trigger: 'blur' },
        ],
      },

      ruleForm2: {
        name1: '',
        powerName: '',
      },
      rules2: {
        name1: [{ required: true, message: '请选择计量方式', trigger: 'blur' }],
        powerName: [{ required: true, message: '请输入单位', trigger: 'blur' }],
      },
    }
  },
  created() {},
  mounted() {
    this.inputWidth1 = document.getElementById('inputWidth1').offsetWidth - 20
    this.inputWidth2 = document.getElementById('inputWidth2').offsetWidth - 20
  },
  methods: {
    // 新增鉴权栏目
    add() {
      const add_ = {
        key_: '',
        value_: '',
      }
      if (this.ruleForm.authInfo.length >= 10) {
        this.$message.warning('最多不能超过10项')
        return
      }
      this.ruleForm.authInfo.push(add_)
    },
    // 删除鉴权栏目
    del(index) {
      this.ruleForm.authInfo.splice(index, 1)
    },
    // 新增资源
    addData() {
      const str = this.ruleForm.authInfo.reduce((acc, item) => {
        acc[item.key_] = item.value_
        return acc
      }, {})
      const params = {
        deliveryMode: this.ruleForm.deliveryMode,
        documentLink: this.ruleForm.documentLink,
        powerName: this.ruleForm.powerName,
        powerPoolAuthInfos: [
          {
            authInfo: JSON.stringify(str),
          },
        ],
        type: this.ruleForm.type,
      }
      insertPowerPoolEntity(params)
        .then((res) => {
          if (res.data.code === '0') {
            this.$message.success('新增成功，请稍后')
            setTimeout(() => {
              this.$router.push('/resourceManagement')
            }, 800)
          }
        })
        .catch((err) => {})
    },
    // 下一步-1
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addData()
          // this.$router.push('/serviceAuthorization')
          // this.stepIndex = 2
        } else {
          return false
        }
      })
    },
    // 下一步-2
    submitForm2(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.$router.push('/serviceAuthorization')
          this.stepIndex = 3
        } else {
          return false
        }
      })
    },
    // 取消
    resetForm(formName) {
      this.$router.back()
    },
    handleRemove(file, fileList) {},
    handlePictureCardPreview(response, file, fileList) {
      // this.dialogImageUrl = file.url;
      // this.dialogVisible = true;
    },
  },
}
</script>

<style scoped lang="scss">
.el-card {
  min-height: 80vh;

  .el-form {
    margin: 30px 0;
  }
}

.btnBox {
  padding-left: 110px;
  box-sizing: border-box;
  margin-top: 30px;

  .btn {
    min-width: 90px;
    margin-right: 12px;
  }
}

.Content {
  width: 100%;

  .h1 {
    font-size: 16px;
    color: #333;
    font-weight: 600;
    margin: 6px 0 24px;
  }

  .h2 {
    font-size: 15px;
    color: #555;
    margin: 15px 0;
  }

  ::v-deep .el-form-item {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;

    .el-form-item__label {
      text-align: right;
      width: 110px !important;
      padding-right: 0;
    }

    .el-form-item__content {
      margin-left: 10px !important;
      width: 50%;

      .el-select {
        width: 100%;
      }

      .small {
        font-size: 12px;
        color: #999;
        padding-left: 10px;
        .sp {
          font-weight: 500;
          color: #222;
          margin-left: 3px;
          text-decoration: underline;
        }
      }

      .group {
      }

      .el-upload--picture-card {
        width: 80px;
        height: 80px;
        line-height: 80px;
      }

      .el-upload-list__item {
        width: 80px;
        height: 80px;
      }
    }
  }

  .lists {
    width: 100%;
    height: auto;

    .lis {
      margin-bottom: 24px;

      ::v-deep .el-form-item {
        margin-bottom: 0;
      }

      .ipt {
        width: 150px;
        height: auto;
        margin-right: 10px;
      }

      .icon {
        font-size: 22px;
        color: #409eff;
        cursor: pointer;
        margin-right: 10px;

        &.del {
          color: #999;
        }
      }
    }
    ::v-deep .noFirst .el-form-item__label:before {
      display: none;
    }
  }
}
</style>
