import { ModelLoader } from '@/utils/three/loader.js'

const state = {
  currentModel: null,
  sceneSettings: {
    backgroundColor: '#000011',
    showGrid: true,
    showAxes: true
  },
  cameraSettings: {
    position: { x: 0, y: 5, z: 10 },
    fov: 75
  }
}

const mutations = {
  SET_CURRENT_MODEL(state, model) {
    state.currentModel = model
  },
  UPDATE_SCENE_SETTINGS(state, settings) {
    state.sceneSettings = { ...state.sceneSettings, ...settings }
  }
}

const actions = {
  async loadModel({ commit }, { url, type }) {
    try {
      const modelLoader = new ModelLoader()
      const model = await modelLoader.loadModel(url, type)
      commit('SET_CURRENT_MODEL', model)
      return model
    } catch (error) {
      console.error('Failed to load model:', error)
      throw error
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}