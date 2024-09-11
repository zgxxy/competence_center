const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  dynamicRoutes: state => state.app.dynamicRoutes,
  userInfo: state => state.user.userInfo,
  routerList: state => state.user.routerList,
  toBottom: state => state.scrollTop.toBottom
}
export default getters
