import { login, loginOut } from '@/api/user'
import { resetRouter,asyncRoutes } from '@/router'
import adminRoutes from '@/router/modules/configure'
import router from '@/router'
const getDefaultState = () => {
  return {
    userInfo: {},
    avatar: '',
    token:'',
    role: sessionStorage.getItem('USER_TYPE') ||'',//是否管理员
    //最终展示的路由
    resultAsyncRoutes: JSON.parse(sessionStorage.getItem('USER_ASYNCROUTES'))||[],
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
    sessionStorage.token = token
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
    sessionStorage.setItem('userInfo', userInfo)
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, level) => {
    state.role = level
    sessionStorage.setItem('USER_TYPE', level)
  },
  SET_RESULTSYNCROUTES: (state, adminrouters) => {
    state.resultAsyncRoutes = adminrouters
    sessionStorage.setItem('USER_ASYNCROUTES', JSON.stringify(adminrouters))
    router.options.routes = state.resultAsyncRoutes
    router.addRoutes(state.resultAsyncRoutes)
    console.log('router',router)
  }
}

const actions = {
  // 登陆
  login({ commit }, userInfo) {
    const { email, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ loginName: email.trim(), password: password }).then(response => {
        resolve(response)
        // localStorage.setItem('token', response.xaccessToken)
        commit('SET_TOKEN', response.data.token)
        sessionStorage.setItem('token', response.data.token)
        // sessionStorage.setItem('uuid', response.uuid)
        sessionStorage.setItem('id', response.data.id)
        sessionStorage.setItem('loginName', response.data.userName)
        sessionStorage.setItem('isAdmin', response.data.isAdmin)
        commit('SET_ROLES',response.data.isAdmin)
        if (response.data.isAdmin == 1) {
          // 将两个路由合并
          commit('SET_RESULTSYNCROUTES', asyncRoutes.concat(adminRoutes))
        } else {
          commit('SET_RESULTSYNCROUTES', asyncRoutes)
        }
        commit('SET_USERINFO',response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 登出
  loginOut({ commit, state }) {
    // let userID = state.userInfo.id
    let userID = sessionStorage.getItem('id')
    return new Promise((resolve, reject) => {
      loginOut({userID:userID}).then(res => {
        // removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve(res)
        // this.$router.push('/login')
      }).catch(error => {
        commit('RESET_STATE')
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      // removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

