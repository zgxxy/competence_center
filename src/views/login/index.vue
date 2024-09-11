<template>
  <div class="login-container">
    <div id="building" />
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <div class="title flex_">
          <img src="@/assets/images/logo2.png" alt="" class="logo" />
          <!-- <div>
            <div class="literal1">浩 海</div>
            <div class="literal2">营销基础能力</div>
          </div> -->
        </div>
      </div>

      <el-form-item prop="email">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="email"
          v-model="loginForm.email"
          placeholder="账号"
          name="email"
          type="text"
          tabindex="1"
          auto-complete="on"
          clearable
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.loginPwd2"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          clearable
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>
      <el-col :span="12">
        <el-form-item prop="verifycode">
          <span class="svg-container">
            <svg-icon icon-class="lock" />
          </span>
          <el-input
            ref="verifycode"
            v-model="loginForm.verifycode"
            placeholder="验证码"
            name="verifycode"
            clearable
            auto-complete="off"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <div class="identifybox">
          <div @click="refreshCode">
            <s-identify
              :identifyCode="identifyCode"
              :contentHeight="48"
            ></s-identify>
          </div>
          <el-button @click="refreshCode" type="text" class="textbtn">
            看不清，换一张
          </el-button>
        </div>
      </el-col>
      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px; height: 48px;"
        @click="handleLogin"
      >
        登录
      </el-button>
    </el-form>
  </div>
</template>

<script>
// import { validUser } from '@/utils/validate'
// import JSEncrypt from "jsencrypt"; //引入模块
import { encryptDate } from '@/utils/public'
import { forgetPassword } from '@/api/user'
import SIdentify from './identify'
export default {
  name: 'Login',
  components: {
    SIdentify,
  },
  data() {
    // const validateUserEmail = (rule, value, callback) => {
    //   if (!value) {
    //     callback(new Error('请输入用户账号'))
    //   }
    //   if (
    //     !/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(value)
    //   ) {
    //     callback(new Error('账号格式有误，请重新输入'))
    //   } else {
    //     callback()
    //   }
    // }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码格式不正确(数字+字母不少于8位)'))
      } else {
        callback()
      }
    }
    // 123456@qq.com  12345678
    const validateVerifycode = (rule, value, callback) => {
      let newVal = value.toLowerCase()
      let identifyStr = this.identifyCode.toLowerCase()
      if (newVal === '') {
        callback(new Error('请输入验证码'))
      } else if (newVal !== identifyStr) {
        callback(new Error('验证码不正确!'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        email: '',
        password: '',
        verifycode: '',
      },
      identifyCode: '',
      identifyCodes: '1234567890ABCDEFGHIGKLMNoPQRSTUVWXYZ',
      loginRules: {
        email: [
          // { required: true, trigger: 'blur', validator: validateUserEmail },
          { required: true, trigger: 'blur', message: '账户名不能为空' },
        ],
        loginPwd2: [
          {
            required: true,
            trigger: 'blur',
            message: '密码不能为空',
            validator: validatePassword,
          },
        ],
        verifycode: [
          { required: true, trigger: 'blur', validator: validateVerifycode },
        ],
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true,
    },
  },
  mounted() {
    this.identifyCode = ''
    this.makeCode(this.identifyCodes, 4)
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    // 切换验证码
    refreshCode() {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    // 生成四位随机验证码
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ]
      }
    },
    // 登录
    async handleLogin() {
      let flag = true
      this.$refs.loginForm.validate((valid, item) => {
        if (!valid) {
          flag = false
        }
        // if (
        //   this.loginForm.email != 'admin' &&
        //   this.loginForm.password != 'admin'
        // ) {
        //   flag = false
        //   this.$message.error('账号或密码错误！')
        // }else{
        //   this.$router.push('/customerManagement')
        // }
      })
      if (flag) {
        this.loginForm.loginPwd = encryptDate(this.loginForm.loginPwd2)
        const res = await this.$store.dispatch('user/login', this.loginForm)
        if (res) {
          // this.$router.push('/customerManagement')
          let path = ''
          if (this.$store.getters.routerList.length > 0) {
            path = this.$store.getters.routerList[0]?.path
          } else {
            path = '/404'
          }
          this.$router.push(path)
        }
      }
    },

    forgetPassword() {
      this.$prompt('请输入你的账号邮箱', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: '邮箱格式不正确',
      }).then(async ({ value }) => {
        // 向后台发送至你的邮箱
        await forgetPassword({ email: value })
        this.$message.success('已发送至你的邮箱: ' + value + '请查收！')
      })
    },
  },
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #fff;
$light_gray: #fff;
$cursor: #aaa;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    // height: 35px;
    width: 85%;

    input {
      background: transparent;
      border: 0;
      height: 30px;

      &:-webkit-autofill {
        box-shadow: 0 0 0 1000px #fff inset !important;
        -webkit-text-fill-color: #aaa !important; //input框输入内容颜色
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    background: #fff;
    border-radius: 5px;
    // color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

//背景图
#building {
  background: url('../../assets/images/loginImg.jpg');
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;
}

//整体大背景
.login-container {
  min-height: 100%;
  width: 100%;
  // background-color: #f5f7fa;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 90px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  //忘记密码
  .tips {
    float: right;
    font-size: 14px;
    color: #aaa;
    margin: 0 10px 10px 0;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .identifybox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 10px;
  }
  .textbtn {
    padding: 0 5px;
    margin-bottom: 5px;
  }

  //底部帮助 隐私 条款（暂不使用）
  .footer {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 10%;
    text-align: center;
    color: #fff;
  }

  //input框图标
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: #909399;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  //全部标题
  .title-container {
    display: flex;
    flex-direction: column;
    align-items: center; //侧轴居中
    justify-content: center; //主轴居中
    color: #3e3939;
    margin: 0 auto 10px auto;
  }

  //大标题
  .title {
    display: flex;
    align-items: center;
    font-size: 26px;
    color: #8b8a8a;
    margin: 0 auto 10px auto;

    .logo {
      width: 80%;
      height: auto;
      vertical-align: middle;
      margin: 0 auto;
    }

    .literal1 {
      font-size: 24px;
      font-family: YouYuan;
      font-weight: 900;
      margin-bottom: 5px;
    }

    .literal2 {
      font-size: 14px;
      font-family: Source Han Serif SC;
    }
  }
}
</style>
