<template>
  <div class="home">
    <h1>3D模型导入导出演示</h1>
    <BaseThreeScene @sceneReady="onSceneReady" />
    
    <div class="instructions">
      <h3>使用说明：</h3>
      <ul>
        <li>点击"导入模型"按钮可以导入GLTF、FBX、OBJ等格式的3D模型文件</li>
        <li>点击"导出配置"按钮可以将当前场景中的模型配置导出为JSON文件</li>
        <li>点击"清空模型"按钮可以移除所有导入的模型</li>
        <li>也可以导入JSON配置文件来批量加载模型</li>
      </ul>
      
      <h3>部署说明：</h3>
      <p>将导出的JSON配置文件和模型文件放在public/models目录下即可部署运行</p>
    </div>
  </div>
</template>

<script>
import BaseThreeScene from '@/components/ThreeScene/BaseThreeScene.vue';

export default {
  name: 'Home',
  components: {
    BaseThreeScene
  },
  methods: {
    onSceneReady(sceneManager, modelManager) {
      console.log('场景已就绪', sceneManager, modelManager);
      // 可以在这里进行额外的场景设置
    }
  }
};
</script>

<style scoped>
.home {
  text-align: center;
}

.instructions {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  text-align: left;
}

.instructions h3 {
  color: #333;
  margin-bottom: 10px;
}

.instructions ul {
  margin-left: 20px;
}

.instructions li {
  margin-bottom: 8px;
  line-height: 1.5;
}
</style>