const state = {
  scrollTop: 0,
  toBottom: false
}
const mutations = {
  SETSCROLLTOP: (state, data) => {
    state.scrollTop = data
  },
  TOBOTTOM: (state, data) => {
    state.toBottom = data
  }
}
const actions = {
  setScrollTop({ commit }, data) {
    commit('SETSCROLLTOP', data)
  },
  setToBottom({ commit }, data) {
    commit('TOBOTTOM', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
