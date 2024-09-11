<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/customerManagement"
      >
        <el-tooltip
          class="item"
          effect="dark"
          content="营销基础能力平台"
          placement="right-start"
        >
          <img
            v-if="logo"
            title="营销基础能力平台"
            :src="logo2"
            class="sidebar-logo sidebar-logo2"
          />
        </el-tooltip>
        <!-- <h1 v-else class="sidebar-title">{{ title }}</h1> -->
      </router-link>
      <router-link
        v-else
        key="expand"
        class="sidebar-logo-link flex_"
        to="/customerManagement"
      >
        <img
          v-if="logo"
          :src="logo"
          class="sidebar-logo"
          object-fit="contain"
        />
        <!-- <div class="sidebar-title-box">
          <div class="sidebar-title1">{{ '浩 海' }}</div>
          <div class="sidebar-title2">{{ title }}</div>
        </div> -->
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      title: '营销基础能力',
      // logo: require('../../../assets/images/lanyou.png'),
      // logo: require('../../../assets/images/log.png'),
      logo: require('../../../assets/images/logo2.png'),
      logo2: require('../../../assets/images/logo3.png'),
    }
  },
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 55px;
  line-height: 60px;
  background: #e9f2ff;
  text-align: center;
  overflow: hidden;
  top: 5px;

  & .sidebar-logo-link {
    height: auto;
    width: 100%;
    display: flex !important;
    align-items: center !important;
    justify-content: center;
    padding-top: 3px;
    //logo--菜单展开时
    & .sidebar-logo {
      width: 90%;
      height: auto;
      vertical-align: middle;

      &.sidebar-logo2 {
        width: 75%;
        border-radius: 50%;
      }
    }

    & .sidebar-title-box {
      display: inline-flex;
      flex-direction: column;
      align-items: flex-start;
      color: #8b8a8a;

      & .sidebar-title1 {
        margin: 0;
        font-weight: 600;
        line-height: 20px;
        font-size: 14px;
        font-family: YouYuan;
        // margin-bottom: 3px;
      }

      & .sidebar-title2 {
        margin: 0;
        line-height: 15px;
        font-size: 16px;
        // -webkit-transform: scale(0.8);
        font-family: Source Han Serif SC, Avenir, Helvetica Neue, Arial,
          Helvetica, sans-serif;
        color: #444;
        font-weight: 600;
      }
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
