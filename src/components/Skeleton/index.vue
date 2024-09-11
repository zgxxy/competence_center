<template>
  <!-- 决定组件的宽高 -->
  <div class="skeleton shan" :style="{ width, height }">
    <!-- 决定组件的背景色 -->
    <div class="block" :style="{ backgroundColor: bg }" />
  </div>
</template>
<script>
export default {
  name: 'Skeleton',
  props: {
    // 宽度定制
    width: {
      type: String,
      default: '100%',
    },
    // 高度定制
    height: {
      type: String,
      default: '100%',
    },
    // 背景颜色定制
    bg: {
      type: String,
      default: '#eee',
    },
  },
}
</script>
<style scoped lang="scss">
.skeleton {
  display: inline-block;
  position: relative;
  overflow: hidden;
  vertical-align: middle;
  .block {
    width: 100%;
    height: 100%;
    border-radius: 2px;
  }
}
.shan {
  &::after {
    content: '';
    position: absolute;
    animation: shan 1.5s ease 0s infinite;
    top: 0;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      to left,
      rgba(255, 255, 255, 0) 0,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: skewX(-45deg);
  }
}
@keyframes shan {
  0% {
    left: -100%;
  }
  100% {
    left: 120%;
  }
}
</style>
