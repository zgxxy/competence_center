import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { asyncRoutes } from '@/router'
import Layout from '@/layout'

NProgress.configure({ showSpinner: false }) // NProgress Configuration
var getRouter;
router.beforeEach(async (to, from, next) => {
  const url = to.path
  if (url === '/login') {
    next()
    return
  }
  // 后台拿到路由列表
  var routerList = JSON.parse(sessionStorage.getItem('routerList'))
  if(routerList){
    // 不加判断，路由会陷入死循环
    if (!getRouter) {
	    if (!getRouterList('router')) {
        getRouter = routerList
        saveRouterList('router', getRouter)
        routerGo(to, next) //执行路由跳转方法（导航到一个新的路由，详细解说看官网: https://www.cntofu.com/book/132/api/go.md）
      } else {
        getRouter = getRouterList('router')
        routerGo(to, next)
      }
    } else {
      if (!getRouterList('router')) {
        getRouter = routerList
        saveRouterList('router', getRouter)
        getRouter = filterAsyncRouter(getRouter)
        router.options.routes = asyncRoutes.concat(getRouter)
        next()
      } else {
        getRouter = getRouterList('router')
        getRouter = filterAsyncRouter(getRouter)
        router.options.routes = asyncRoutes.concat(getRouter)
        next()
      }  
    }
  }
  
  // const token = store.getters.userInfo.businessToken
  // 页面刷新时，重新赋值token  
  if (store.getters.userInfo.businessToken) {
    next();
  }
  const token = sessionStorage.getItem('token')
  // 没有登录，去跳转登录页
  if (!token) {
    next({
      path: '/login'
    })
    return
  }
})

// 导航到一个新的路由方法封装
function routerGo(to, next) {
  getRouter = filterAsyncRouter(getRouter)
  router.options.routes = asyncRoutes.concat(getRouter)
  router.addRoutes(asyncRoutes.concat(getRouter)) //动态添加路由
  next({ ...to, replace: true })
}

// 存储sessionStorage数组对象
function saveRouterList(name, data) {
  sessionStorage.setItem(name, JSON.stringify(data))
}

// 获取sessionStorage数组对象
function getRouterList(name) {
  return JSON.parse(window.sessionStorage.getItem(name));
}

function urlView(file){
  return (resolve) => require([`@/views/${file}`], resolve)
}

//过滤路由方法封装
function filterAsyncRouter(asyncRouterMap) { //遍历后台传来的路由字符串，转换为组件对象
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.component) {
      if (route.component === "Layout") {//Layout组件特殊处理
        route.component = Layout
      } else {
        route.component = urlView(route.component)
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
  return accessedRouters
}
router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
