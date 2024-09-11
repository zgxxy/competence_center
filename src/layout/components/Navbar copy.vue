<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <!--
      <el-badge
        :value="msg"
        :max="99"
        class="item"
        style="margin: 0 30px 30px 0;"
      >
        <div style="font-size: 20px;" @click="toMessage">
          <i class="el-icon-bell"></i>
        </div>
      </el-badge>
    -->
      <el-dropdown class="avatar-container" trigger="click" size="small">
        <div class="avatar-wrapper">
          <img src="@/assets/images/headPortraits.svg" class="user-avatar" />
          <span style="font-size: 16px; font-weight: bold;">
            <!--{{ $store.state.user.userInfo.loginName }}-->
            {{ loginName }}
          </span>
          <!-- <i class="el-icon-caret-bottom" /> -->
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <!--
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          -->
          <router-link to="/userInfo">
            <el-dropdown-item>
              用户信息
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="dialogVisible = true">
            <span style="display: block;">修改密码</span>
          </el-dropdown-item>

          <el-dropdown-item divided @click.native="loginOut">
            <span style="display: block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      title="提示"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-form
        ref="form"
        :model="form"
        size="small"
        label-width="80px"
        :inline="true"
      >
        <el-form-item
          label="旧密码："
          prop="oldPassword"
          :rules="{ required: true, message: '不能为空', trigger: 'blur' }"
        >
          <el-input
            v-model="form.oldPassword"
            type="password"
            autocomplete="off"
            style="width: 110%;"
          />
        </el-form-item>
        <el-form-item
          label="输入新密码："
          prop="newPassword"
          :rules="{ required: true, validator: validatePass, trigger: 'blur' }"
        >
          <el-input
            v-model="form.newPassword"
            type="password"
            autocomplete="off"
            style="width: 110%;"
          />
        </el-form-item>
        <el-form-item
          label="确认新密码："
          prop="checkPass"
          :rules="{ required: true, validator: validatePass2, trigger: 'blur' }"
        >
          <el-input
            v-model="form.checkPass"
            type="password"
            autocomplete="off"
            style="width: 110%;"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="btnOk()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { updateUserPassword } from '@/api/user'
export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  data() {
    return {
      path:
        'ws://172.26.136.199:8080/amc/imserver/' +
        sessionStorage.getItem('uuid') +
        '1',
      socket: '',
      loginName: sessionStorage.getItem('loginName'),
      msg: '',
      dialogVisible: false,
      form: {
        oldPassword: '',
        newPassword: '',
        checkPass: '',
      },
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar']),
  },
  created() {
    // getNoReadLogNum().then((res) => {
    //   res == 0 ? (this.msg = '') : (this.msg = res)
    // })
  },
  mounted() {
    // this.init()
  },
  methods: {
    toMessage() {
      this.$router.push({
        path: `/message`,
        query: {},
      })
      this.msg = ''
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    //退出登录
    async loginOut() {
      // await this.$store.dispatch('user/loginOut')
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      const msg = this.$createElement
      this.$confirm('', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // type: 'warning',
        lockScroll: false,
        message: msg('div', null, [
          msg('i', {
            class: 'el-icon-warning',
            style: 'color:#E6A23C;font-size:30px;',
          }),
          msg(
            'span',
            {
              style:
                'margin-left:10px;font-size:16px;line-height:30px;font-weight:600;vertical-align:top;',
            },
            '提示',
          ),
          msg(
            'p',
            { style: 'margin:10px 0 0 40px;color:gray' },
            '请确认是否退出登录',
          ),
        ]),
      })
        .then(() => {
          // this.$store
          //   .dispatch('user/loginOut')
          //   .then(() => {})
          //   .catch(() => {})
          // this.$router.push('/login')
          this.$router.push(`/login?redirect=${this.$route.fullPath}`)
          this.$message({
            message: '退出登陆成功',
            type: 'success',
          })
          localStorage.clear()
          sessionStorage.clear()
        })
        .catch(() => {})
    },
    handleClose() {
      this.$refs.form.resetFields()
      this.dialogVisible = false
    },
    //确定更改密码
    async btnOk() {
      await this.$refs.form.validate()
      let res = await updateUserPassword({
        userId: sessionStorage.getItem('id'),
        oldPassword: this.form.oldPassword,
        newPassword: this.form.newPassword,
      })
      if (res.code == 200) {
        this.$message({ type: 'success', message: '密码修改成功' })
        this.handleClose()
      }
    },
    validatePass(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test(value)) {
        callback(new Error('密码应为8-16位的字母+数字组合'))
      } else {
        if (this.form.checkPass !== '') {
          this.$refs.form.validateField('checkPass')
        }
        callback()
      }
    },
    validatePass2(rule, value, callback) {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test(value)) {
        callback(new Error('密码应为8-16位的字母+数字组合'))
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: linear-gradient(90deg, #e9f0ff, #edffff) !important; //渐变
  // background: #e9f2ff;
  // box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    padding: 0 0 0 15px !important;
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    text-align: right;
    height: 100%;
    line-height: 50px;
    padding-right: 17px;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;
      cursor: pointer;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid #ddd;
          margin-right: 5px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
::v-deep .el-form-item__label {
  width: 130px !important;
  font-weight: 400;
}
::v-deep .el-form-item__error {
  width: 185px;
}
::v-deep .el-dialog__body {
  border-top: 1px solid #eee;
  .el-input {
    width: 280px;
  }
}
.el-badge {
  ::v-deep .el-badge__content {
    margin-top: 10px;
  }
}
</style>
