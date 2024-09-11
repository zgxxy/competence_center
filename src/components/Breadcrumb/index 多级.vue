<template>
  <el-breadcrumb class="app-breadcrumb" separator-class="el-icon-arrow-right">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span
          v-if="item.redirect === 'noRedirect' || index == levelList.length - 1"
          class="no-redirect"
        >
          {{ item.meta.title }}
        </span>
        <a class="first-breadcrumb" v-else @click.prevent="handleLink(item)">
          {{ item.meta.title }}
        </a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'

export default {
  data() {
    return {
      levelList: [],
      pathList: [],
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    },
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      console.log(this.$route, '面包屑获取路径')
      const matched = this.$route.matched.filter(
        (item) => item.meta && item.meta.title,
      )
      // sessionStorage.setItem('routerList', JSON.stringify(routerData))
      // for (let i = 0; i < matched.length; i++) {
      //   if (i > 0) {
      //     if (matched[i].meta?.title !== matched[i - 1].meta?.title) {
      //       this.levelList.push(matched[i])
      //     }
      //   } else {
      //     this.levelList.push(matched[i])
      //   }
      // }
      let pathList = this.getList('pathList')
      //当前路径层级
      this.pathList = this.$route.path
        .split('/')
        .map((name, index, array) => ({
          name,
          path: array.filter((item, subIndex) => subIndex <= index).join('/'),
          query: name == this.$route.name ? this.$route.query : {},
        }))
        .filter((elm) => elm.name)
      if (pathList) {
        for (let i = 0; i < pathList.length; i++) {
          this.pathList.forEach((el) => {
            if (el.name == pathList[i].name) {
              el.query = pathList[i].query
            }
          })
        }
      }
      this.setList('pathList', this.pathList)
      const storeList = this.$store.getters.routerList
      //匹配最外层数据
      let list1 = []
      storeList.forEach((el) => {
        if (el.name == this.pathList[0].name) {
          list1 = el.children
        }
      })
      for (let i = 0; i < list1.length; i++) {
        this.pathList.map((e) => {
          if (list1[i].name == e.name) {
            this.levelList.push({
              name: e.name,
              path: e.path,
              meta: list1[i].meta,
              query: e.query || {},
            })
          }
        })
      }
      // console.log(list1, 'list1')
      // console.log(this.pathList, 'this.pathList')
      console.log(this.levelList, 'levelList')
    },
    // 存储sessionStorage数组对象
    setList(name, data) {
      sessionStorage.setItem(name, JSON.stringify(data))
    },
    // 获取sessionStorage数组对象
    getList(name) {
      return JSON.parse(window.sessionStorage.getItem(name))
    },
    pathCompile(path) {
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { redirect, path, query } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      // this.$router.push(this.pathCompile(path))
      this.$router.push({ path: path, query: query })
    },
  },
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
  .first-breadcrumb {
    font-size: 16px;
  }
}
</style>
