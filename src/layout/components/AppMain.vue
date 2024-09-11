<template>
  <section :style="autoHeight" class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
    <go-top />
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  data() {
    return {
      clientHeight: '',
      autoHeight: {
        height: '',
      },
    }
  },
  computed: {
    key() {
      return this.$route.path
    },
  },
  watch: {
    // 如果 `clientHeight` 发生改变，这个函数就会运行
    clientHeight: function () {
      this.changeFixed(this.clientHeight)
    },
  },
  mounted() {
    this.clientHeight = `${document.documentElement.clientHeight}`
    window.onresize = function temp() {
      this.clientHeight = `${document.documentElement.clientHeight}`
    }
  },
  methods: {
    //  动态修改container高度
    changeFixed(clientHeight) {
      this.autoHeight.height = clientHeight - 110 + 'px'
    },
  },
}
</script>

<style></style>

<style lang="scss" scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 60px);
  width: 100%;
  padding: 0 15px 5px;
  position: relative;
  overflow: auto;
}
.fixed-header + .app-main {
  margin-top: 60px;
}
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
/* 滚动条样式修改 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}
/* 滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #aaa;
}
</style>
