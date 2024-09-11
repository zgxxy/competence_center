import axios from 'axios'
import { Message } from 'element-ui'
// import { Loading } from 'element-ui'

// let loadingInstance = ''
import store from '@/store'
// import { getToken } from '@/utils/auth'
import router from '@/router'
// create an axios instance
const service = axios.create({

  baseURL: process.env.VUE_APP_BASE_API // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 5000, // 请求超时时间
  // headers: {
  //   'Content-Type': 'application/json;',
  //   'x-access-token': token
  // }
})

let loadingCount = 0
const addLoading = () => {
  // 开始请求时，添加数量，并且设置为显示loading
  loadingCount++
  store.commit('loading/SET_SHOWLOADING', true)
}
const isCloseLoading = () => {
  // 请求完成或者请求失败时,减少正在请求的数量,并且判断是否还有未完成的请求,如果没有了,则设置为隐藏loading
  loadingCount--
  if (loadingCount === 0) {
    setTimeout(() => {
      loadingCount === 0 && store.commit('loading/SET_SHOWLOADING', false)
    }, 100)
  }
}

// request interceptor请求拦截器
service.interceptors.request.use(
  config => {
    const businessToken = store.getters.userInfo.businessToken
    config.headers.common['Content-Type'] = 'application/json;'
    config.headers.common['businessToken'] = businessToken
    addLoading()
    // 超时关闭loading
    // setTimeout(() => {
    //   store.commit('loading/SET_SHOWLOADING', false)
    //   // clearInterval(loadingTime)
    // }, 10000)
    return config
  },
  error => {
    isCloseLoading()
    console.log('request', error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    isCloseLoading()
    const { data, code, msg } = response.data
    code === 1001 && router.push('/login') && Message({
      type: 'warning',
      duration: 3 * 1000,
      message: `${msg}`
    })
    if (response.request.responseURL.split('?')[1] === 'loginOut') return
    if (code === 0) {
      if (msg !== '操作成功!') {
        Message({
          type: 'success',
          duration: 5 * 1000,
          message: `${msg}`
        })
      }
      return response.data
    } else if (code === 500) {
      Message({
        type: 'error',
        duration: 3 * 1000,
        message: `${msg}`
      })
      return Promise.reject(msg)
    } else if (code === '250') {
      console.log('250-token过期')
      Message({
        type: 'warning',
        duration: 3 * 1000,
        message: `${msg}`
      })
    } else {
      if (code) {
        // Message({
        //   type: 'warning',
        //   duration: 5 * 1000,
        //   message: `${msg}`
        // })
      }
      return response
      // return Promise.reject(msg)
    }
  },
  error => {
    isCloseLoading()
    console.log('err' + error) // for debug
    const err = JSON.stringify(error.response)
    console.log('response' + err)
    const response = JSON.parse(err)

    Message({
      message: response.data.message || response.data.msg || error.message,
      type: 'error',
      duration: 3 * 1000
    })
    setTimeout(() => {
      if (error.response.data.code === '-1' || error.response.data.code === '444') {
        // token过期
        console.log('过期了')
        router.push('/login')
      }
    }, 800)
    return Promise.reject(response.data)
  }
)

export default service
