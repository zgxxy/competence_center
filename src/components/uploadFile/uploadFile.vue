<template>
  <div>
    <div v-if="!disabled">
      <div>
        <span class="label">{{ uploadTitle }}</span>
        <el-checkbox
          style="margin-left: 30px;"
          label="使用MD5加密"
          v-model="btnChecked"
          @change="handleChange(btnChecked)"
        ></el-checkbox>
      </div>
      <div class="uploadBox">
        <el-upload
          ref="upload"
          class="upload-demo"
          :limit="limit"
          action
          drag
          multiple
          :accept="accept"
          :on-change="onChange"
          :auto-upload="false"
          :show-file-list="false"
          :file-list="fileList"
          :on-exceed="handleExceed"
          :fileSize="fileSize"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
            <div style="color: red;">
              单个文件不得少于100条样本大小不超过{{ fileSize }}M
            </div>
          </div>
        </el-upload>
        <span style="cursor: pointer;" @click="download">导入模板下载</span>
      </div>
    </div>
    <div class="tableBox">
      <div class="label" v-if="fileList.length > 0">
        上传文件列表
      </div>
      <!-- 上传文件列表 -->
      <el-table
        ref="table"
        v-if="fileList.length > 0"
        :data="fileList"
        style="width: 100%;"
        border
        stripe
        :header-cell-style="{ background: '#eef5ff', color: '#606266' }"
      >
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column prop="fileName" label="文件名称" align="left">
          <template slot-scope="scope">
            <div>
              {{ scope.row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="fileType" label="文件类型">
          <template slot-scope="scope">
            <div>
              {{ matchFileType(scope.row.name) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="fileSize" label="文件大小">
          <template slot-scope="scope">
            <div>
              {{ computeFileZise(scope.row.size) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sampleSize" label="原始样本量" />
        <el-table-column prop="dataType" label="数据类型" />
        <el-table-column prop="uploadState" label="上传状态">
          <template slot-scope="scope">
            <div>
              {{ scope.row.status | status }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="operation">
              <el-button type="text" @click="handleDelete(scope.row)">
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="btn" v-if="fileList.length > 0 && failRes.length == 0">
        <el-button type="" @click="upload">上传</el-button>
      </div>
    </div>
    <!-- 上传文件成功列表 -->
    <div>
      <div class="label" v-if="successRes.length > 0">
        上传文件成功列表
      </div>
      <el-table
        ref="table"
        v-if="successRes.length > 0"
        :data="successRes"
        style="width: 100%;"
        border
        stripe
        :header-cell-style="{ background: '#eef5ff', color: '#606266' }"
      >
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column prop="fileName" label="文件名称" align="left" />
        <el-table-column prop="fileType" label="文件类型">
          <template slot-scope="scope">
            <div>
              {{ matchFileType(scope.row.fileName) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="fileSize" label="文件大小">
          <template slot-scope="scope">
            <div>
              {{ computeFileZise(scope.row.fileSize) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sampleSize" label="原始样本量" />
        <el-table-column prop="dataType" label="数据类型" />
        <el-table-column prop="uploadStatus" label="上传状态" />
      </el-table>
    </div>
    <!-- 上传文件失败列表 -->
    <div v-if="failRes.length > 0">
      <div class="label">
        上传文件失败列表
      </div>
      <el-table
        ref="table"
        :data="failRes"
        style="width: 100%;"
        border
        stripe
        :header-cell-style="{ background: '#eef5ff', color: '#606266' }"
      >
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column prop="fileName" label="文件名称" align="left" />
        <el-table-column prop="fileType" label="文件类型">
          <template slot-scope="scope">
            <div>
              {{ matchFileType(scope.row.fileName) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="fileSize" label="文件大小">
          <template slot-scope="scope">
            <div>
              {{ computeFileZise(scope.row.fileSize) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sampleSize" label="原始样本量" />
        <el-table-column prop="dataType" label="数据类型" />
        <el-table-column prop="uploadStatus" label="上传状态" />
        <el-table-column prop="causeError" label="失败原因" />
        <!--
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="operation">
              <el-button type="text" @click="failDelete(scope.row)">
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
        -->
      </el-table>
    </div>
    <div class="btn" v-if="failRes.length > 0">
      <el-button type="primary" @click="upload">重新上传失败文件</el-button>
      <el-button type="" @click="clean">直接提交</el-button>
    </div>
  </div>
</template>

<script>
//引入上传图片接口
// import { uploadImg } from '@/api/public/api'
import { downloadFile, matchFileType, computeFileZise } from '@/utils/file'
import axios from '@/utils/request'
export default {
  data() {
    return {
      failShow: false,
    }
  },
  props: {
    limit: {
      type: Number,
      default: 5,
    },
    fileSize: Number,
    uploadTitle: {
      type: String,
      default: '',
    },
    accept: {
      type: String,
      default: '',
    },
    fileList: {
      type: Array,
      default: () => [],
    },
    checked: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    downloadUrl: {
      type: String,
      default: '',
    },
    uploadFile: {
      type: Function,
      default: () => () => {},
    },
    successRes: {
      type: Array,
      default: () => [],
    },
    failRes: {
      type: Array,
      default: () => [],
    },
  },
  filters: {
    status(status) {
      let res = ''
      if (status == 'fail') res = '上传成功'
      else if (status == 'ready') res = '待上传'
      else if (status == 'error') res = '上传失败'
      return res
    },
  },
  data() {
    return {
      matchFileType: matchFileType,
      computeFileZise: computeFileZise,
      btnChecked: true,
      showList: true,
    }
  },
  methods: {
    handleChange(index) {
      this.$emit('handleChange', index)
    },
    //文件状态改变时的函数(主要逻辑函数)
    onChange(file, fileList) {
      let repeat = false
      const that = this
      //选中文件重复判断
      if (this.fileList.length > 0) {
        this.fileList.forEach((val, i) => {
          if (file.name == val.name) {
            setTimeout(() => {
              this.$message({
                message: val.name + '为传重复文件,已更新为新上传的文件',
                type: 'warning',
                // duration: 5000,
                showClose: true,
              })
            }, 1000)
            this.fileList.splice(i, 1)
          }
        })
      }
      //判断文件是否为已上传成功的文件
      this.successRes.forEach((item) => {
        if (file.name == item.fileName) {
          setTimeout(() => {
            this.$message({
              message: item.fileName + '文件已上传,请重新选择',
              type: 'warning',
              showClose: true,
            })
          }, 1000)
          repeat = true
        }
      })

      if (this.fileSize && !repeat) {
        const isLt = file.size / 1024 / 1024 < this.fileSize
        const name = file.name.length
        if (!isLt) {
          //文件大小判断
          setTimeout(() => {
            this.$message({
              message: `文件 ${file.name}大小超过 ${this.fileSize} MB,请重新上传！`,
              type: 'warning',
              // duration: 5000,
              showClose: true,
            })
          }, 1000)
          return false
        } else if (name > 100) {
          //判断文件命字数是否大于200字符
          setTimeout(() => {
            this.$message({
              message: `文件 ${file.name}名称超过100字符,请重新上传！`,
              type: 'warning',
              // duration: 5000,
              showClose: true,
            })
          }, 1000)
          return false
        } else {
          this.fileList.push(file)
        }
      }
    },
    //文件超出个数限制时的函数
    handleExceed(files, fileList) {
      this.$message.info(`最多只允许上传${this.limit}个文件`)
    },
    //上传列表--移除文件
    handleDelete(file) {
      for (var i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].name == file.name) {
          this.fileList.splice(i, 1)
        }
      }
    },
    //上传失败列表--移除文件
    failDelete(file) {
      console.log(file)
      for (var i = 0; i < this.failRes.length; i++) {
        if (this.failRes[i].fileName == file.fileName) {
          this.failRes.splice(i, 1)
        }
      }
    },
    //更新
    update() {},
    //上传
    upload() {
      this.uploadFile()
    },
    //下载文件模板
    download() {
      let config = {
        url: this.downloadUrl,
        method: 'GET',
        responseType: 'blob',
      }
      axios(config).then((res) => {
        if (res) {
          const resData = res.data
          if (resData.size == 0) {
            this.$message.warning('暂无下载文件')
            return
          }
          downloadFile(res).then((e) => {
            if (e.code !== 200) {
              this.$message.error(`${e.msg}`)
            }
          })
        } else {
          this.$message.error('下载失败')
        }
      })
    },
    clean() {
      this.failRes = []
    },
  },
}
</script>

<style lang="scss" scope>
.uploadBox {
  display: flex;
  :nth-child(2) {
    align-self: flex-end;
    margin: -15px 0 5px 10px !important;
    color: #138dff;
  }
}
.label {
  font-weight: 900;
  font-size: 14px;
}
.operation .el-button {
  padding: 0;
}
.btn {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
.el-icon-upload:before {
  color: #cae0fc;
}
::v-deep .el-upload-dragger {
  width: 400px;
  height: 180px;
}
</style>
