<template>
  <div
    v-show="visible"
    class="topIcon"
    @click="scrollTop"
    @mouseenter="Show"
    @mouseleave="noShow"
  >
    <!-- <p v-if="isShow">置顶</p> -->
    <i v-if="isShow" style="font-size: 24px;" class="el-icon-upload2" />
    <img v-else src="../../assets/images/top.png">
  </div>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      isShow: true
    }
  },
  mounted() {
    // 获取当前总高度 和内容所占高度 如果内容大于原始高度 那就绑定事件
    document
      .querySelector('.app-main')
      .addEventListener('scroll', this.scrollEvent)
  },
  methods: {
    // 滚动事件
    scrollEvent() {
      const root = document.querySelector('.app-main')
      root.scrollTop > 350 ? (this.visible = true) : (this.visible = false)
      root.scrollTop + root.clientHeight >= root.scrollHeight * 0.9 &&
        this.$store.dispatch('scrollTop/setToBottom', true)
      root.scrollTop + root.clientHeight < root.scrollHeight * 0.9 &&
        this.$store.dispatch('scrollTop/setToBottom', false)

      this.$store.dispatch('scrollTop/setScrollTop', root.scrollTop)
    },
    // 滚动到顶部
    scrollTop() {
      document.querySelector('.app-main').scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    },
    Show() {
      this.isShow = false
    },
    noShow() {
      this.isShow = true
    }
  }
}
</script>
<style lang="scss" scoped>
.topIcon {
  width: 50px;
  height: 50px;
  border: 2px solid #bfbec3;
  position: fixed;
  bottom: 30px;
  right: 20px;
  background-color: #fff;
  color: #111;
  opacity: 0.5;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  border-radius: 50%;
  img {
    width: 30px;
    height: 30px;
  }
  p {
    font: 900 16px '宋体';
    color: #111;
  }
}
</style>
