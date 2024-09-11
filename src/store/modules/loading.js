const state = {
  // 控制页面是否正在显示loading
  isShowLoading: false
}

const SET_SHOWLOADING = 'SET_SHOWLOADING'
const mutations = {
  // 设置是否正在加载，显示loading
  [SET_SHOWLOADING](state, data) {
    state.isShowLoading = data
  }
}
export default {
  namespaced: true,
  state,
  mutations
}
