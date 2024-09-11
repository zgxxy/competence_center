import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
function RepairProps(cmp) {
  (cmp.mixins || []).forEach(mixin => {
  if (mixin.props && mixin.props.placement) {
  const defaultValue = mixin.props.placement.default
  mixin.data = new Proxy(mixin.data, {
  apply(target, thisArg, argArray) {
  const res = Reflect.apply(target, thisArg, argArray)
  return {
  ...(res || {}),
  placement: defaultValue
  }
  }
  })
  delete mixin.props.placement
  }
  if (mixin.mixins && mixin.mixins.length > 0) {
  RepairProps(mixin)
  }
  })
  }
  
  RepairProps(ElementUI.DatePicker)
  RepairProps(ElementUI.TimePicker)
  RepairProps(ElementUI.TimeSelect)
  
  Vue.use(ElementUI, {
  size: 'medium'
  }) 

import echarts from 'echarts'
Vue.prototype.$echarts = echarts

// //引入高德地图
// import VueAMap from 'vue-amap';
// Vue.use(VueAMap);
// VueAMap.initAMapApiLoader({
//   key: 'ea68ed391acf7c2f0ce0eaa82b0cc977', //申请的key码需要填写的地方，格式为长串字符数字
//   plugin: [//按照你的需要，引入地图的哪些功能，不需要下面这么多
//     "AMap.Autocomplete", //输入提示插件
//     "AMap.PlaceSearch", //POI搜索插件
//     "AMap.Scale", //右下角缩略图插件 比例尺
//     "AMap.OverView", //地图鹰眼插件
//     "AMap.ToolBar", //地图工具条
//     "AMap.MapType", //类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
//     "AMap.PolyEditor", //编辑 折线多，边形
//     "AMap.CircleEditor", //圆形编辑器插件
//     "AMap.Geolocation", //定位控件，用来获取和展示用户主机所在的经纬度位置
//   "AMap.ControlBar"
//   ],
//   v: '1.4.4' // 默认高德 sdk 版本为 1.4.4
// });

//引入百度地图
import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap, {
  ak: 'g36OYKooC96hL3YtOIwNUsvB62jjZwTx'
})

const messages = ['success', 'warning', 'info', 'error']
messages.forEach(type => {
  ElementUI.Message[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options
      }
      // 默认配置
      options.duration = 2000
      // options.showClose = true
    }
    options.type = type
    return ElementUI.Message(options)
  }
})
// Vue.use(ElementUI)

import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import './assets/css/base.css'
// import 'default-passive-events'

/* if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
} */

// 一键置顶组件
import toTopIcon from './components/goTop/goTop'
Vue.use(toTopIcon)

import Button from 'ant-design-vue/lib/button';
import {  Transfer, Table, Switch,ConfigProvider } from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css';
Vue.use(Button)
Vue.use(Transfer)
Vue.use(Table)
Vue.use(Switch)
Vue.use(ConfigProvider);

//引入mock
// import './mock/index'

//注册全局组件
import Components from './components'
Vue.use(Components)

import global from './utils/global'
Vue.use(global);

//Tooltip全局过滤器--文本超出设置的宽度添加Tooltip
Vue.filter('showTooltip', (msg, width) => {
  let app = document.querySelector('#app')
  // 这里需要用span，div默认是父盒子的宽度
  let span = document.createElement('span')
  span.innerHTML = msg
  // 必须要添加到DOM树里面才有宽度
  app.appendChild(span)
  let isShow = span.offsetWidth > width
  // 销毁
  app.removeChild(span)
  return !isShow
})

// 如果想要中文版 element-ui，按如下方式声明
ElementUI.Dialog.props.lockScroll.default = false // 打开弹窗防止页面抖动
ElementUI.Dialog.props.closeOnClickModal.default = false // 打开弹窗防止误关

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.co
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
