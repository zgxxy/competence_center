import { loginOut } from "@/api/user";
import { login, powerList } from "@/api/capacityApi";
import { resetRouter } from "@/router";
// import routerData from '/public/testData/routerData.json'

const getDefaultState = () => {
  return {
    userInfo: "", //用户数据
    routerList: [] //路由数据
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
    sessionStorage.token = token;
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo;
    state.routerList = userInfo.routerList
    sessionStorage.setItem("routerList", JSON.stringify(userInfo.routerList));
    // state.routerList = routerData
    // sessionStorage.setItem("routerList", JSON.stringify(routerData));
    sessionStorage.setItem("userInfo", userInfo);
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
};

const actions = {
  // 登陆
  login({ commit }, userInfo) {
    const { email, loginPwd } = userInfo;
    return new Promise((resolve, reject) => {
      login({ userAccount: email.trim(), password: loginPwd })
        .then((response) => {
          resolve(response.data.data);

          let response2 = response.data.data
          sessionStorage.setItem("id", response2.id);
          sessionStorage.setItem("token", response2.businessToken);
          commit("SET_USERINFO", response2);

          powerList({ pageNum: 1, pageSize: 100, powerName: '' })
            .then((response) => {
              resolve(response.data.data);
              let response3 = response.data.data
              localStorage.setItem('resourceList', JSON.stringify(response3.records))
            })
            .catch((error) => {
              reject(error);
            });

        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 登出
  loginOut({ commit, state }) {
    let userID = state.userInfo.id
    // let userID = sessionStorage.getItem("id");
    return new Promise((resolve, reject) => {
      loginOut({ userID: userID })
        .then((res) => {
          resetRouter();
          commit("RESET_STATE");
          resolve(res);
          // this.$router.push('/login')
        })
        .catch((error) => {
          commit("RESET_STATE");
          reject(error);
        });
    });
  },

  // 清空userInfo和routerList
  resetStore({ commit }) {
    commit("RESET_STATE");
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
