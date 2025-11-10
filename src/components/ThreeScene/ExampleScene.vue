<template>
  <BaseThreeScene 
    ref="baseScene"
    :backgroundColor="backgroundColor"
    @scene-ready="onSceneReady"
    @scene-error="onSceneError"
  >
    <div class="scene-controls">
      <button @click="addBox">添加立方体</button>
      <button @click="addSphere">添加球体</button>
      <button @click="addPlane">添加平面</button>
      <button @click="clearScene">清空场景</button>
    </div>
  </BaseThreeScene>
</template>

<script>
import BaseThreeScene from './BaseThreeScene.vue';

export default {
  name: 'ExampleScene',
  components: {
    BaseThreeScene
  },
  data() {
    return {
      backgroundColor: '#2c3e50',
      objects: []
    };
  },
  methods: {
    onSceneReady() {
      console.log('场景初始化完成');
      this.createDefaultScene();
    },
    
    onSceneError(error) {
      console.error('场景初始化失败:', error);
    },
    
    createDefaultScene() {
      // 添加地面
      this.addPlane({
        width: 20,
        height: 20,
        color: 0x808080,
        position: { x: 0, y: -2, z: 0 }
      });
      
      // 添加一些基础几何体
      this.addBox({
        color: 0x00ff00,
        position: { x: -2, y: 0, z: 0 }
      });
      
      this.addSphere({
        color: 0xff0000,
        position: { x: 2, y: 0, z: 0 }
      });
    },
    
    addBox() {
      const box = this.$refs.baseScene.addBox({
        color: Math.random() * 0xffffff,
        position: { 
          x: (Math.random() - 0.5) * 4,
          y: Math.random() * 3,
          z: (Math.random() - 0.5) * 4
        }
      });
      if (box) {
        this.objects.push(box);
      }
    },
    
    addSphere() {
      const sphere = this.$refs.baseScene.addSphere({
        color: Math.random() * 0xffffff,
        position: { 
          x: (Math.random() - 0.5) * 4,
          y: Math.random() * 3,
          z: (Math.random() - 0.5) * 4
        }
      });
      if (sphere) {
        this.objects.push(sphere);
      }
    },
    
    addPlane(config = {}) {
      return this.$refs.baseScene.addPlane(config);
    },
    
    clearScene() {
      this.objects.forEach(obj => {
        this.$refs.baseScene.getSceneManager().removeObject(obj.uuid);
      });
      this.objects = [];
    }
  }
};
</script>

<style scoped>
.scene-controls {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000;
}

.scene-controls button {
  margin: 5px;
  padding: 8px 16px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.scene-controls button:hover {
  background: #2980b9;
}
</style>