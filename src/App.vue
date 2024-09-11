<template>
  <div id="app">
    <!-- <router-view></router-view> 
    -->
    <a-config-provider :locale="locale">
      <router-view :key="key" />
    </a-config-provider>
  </div>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
  name: 'App',
  data() {
    return {
      loading: '',
      scrollTop: 0,
      locale: zhCN,
    }
  },
  computed: {
    key() {
      return this.$route.path + Math.random()
    },
  },
  created() {
    //在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem('store')) {
      //this.$store.replaceState：vue官方提供的一个api表示替换 store 的根状态
      //Object.assign()：将store中的状态和sessionStorage中的状态进行合并
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem('store')),
        ),
      )
    }

    //在页面刷新时将vuex里的信息保存到sessionStorage里
    //beforeunload：当浏览器窗口关闭或者刷新时触发的事件
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('store', JSON.stringify(this.$store.state))
    })
  },
  watch: {
    '$store.state.loading.isShowLoading': {
      handler(val) {
        if (val) {
          this.loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(255, 255, 255, 0.7)',
          })
        } else {
          this.loading && this.loading.close()
        }
      },
    },
  },
  beforeDestroy() {
    localStorage.clear()
    sessionStorage.clear()
  },
}
</script>
<style lang="scss">
//滚动条:hover
// .el-table__body-wrapper:hover::-webkit-scrollbar {
//   width: 6px; // 横向滚动条
//   height: 6px; // 纵向滚动条 必写
// }

// // ----------修改elementui表格的默认样式-----------
// .el-table__body-wrapper {
//   &::-webkit-scrollbar {
//     // 整个滚动条
//     width: 0; // 纵向滚动条的宽度
//     background: rgba(213, 215, 220, 0.3);
//     border: none;
//   }
//   &::-webkit-scrollbar-track {
//     // 滚动条轨道
//     border: none;
//   }
// }
// // --------------------隐藏table gutter列和内容区右侧的空白 start
// .el-table th.gutter {
//   display: none;
//   width: 0;
// }
// .el-table colgroup col[name='gutter'] {
//   display: none;
//   width: 0;
// }

// .el-table__body {
//   width: 100% !important;
// }
// --------------------隐藏table gutter列和内容区右侧的空白 end

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
