import Vue from 'vue'
import Vuex from 'vuex'
import three from './modules/three'   // 引入three模块

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    three
  },
  state: {
    sceneData:null
  },
  mutations: {
    setSceneData(state,data){      // 设置场景数据
      state.sceneData=data              // 设置场景数据为传入的数据
    }
  },
  actions: {
    updateSceneData({commit},data){     // 更新场景数据
      commit('setSceneData',data)       // 提交setSceneData mutation，更新场景数据
    }
  }
})