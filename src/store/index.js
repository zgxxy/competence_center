import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import loading from './modules/loading'
import persistedState from 'vuex-persistedstate'
import scrollTop from './modules/scrollTop'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    loading,
    scrollTop,
  },
  getters,
  plugins: [persistedState({
    storage: window.sessionStorage,
    reducer(val) {
      return {
        supplier: val.supplier,
        customer: val.customer,
        tag: val.tag
      }
    }
  })]
})

export default store
