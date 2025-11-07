<template>
  <div class="home-page">
    <div class="header">
      <h1>3D模型展示平台</h1>
    </div>
    <div class="content">
      <div class="scene-container">
        <ThreeScene ref="threeScene" />
      </div>
      <div class="control-panel">
        <h3>控制面板</h3>
        <!-- 控制组件将在这里添加 -->
      </div>
    </div>
  </div>
</template>

<script>
import ThreeScene from '@/components/ThreeScene.vue'

export default {
  name: 'Home',
  components: {
    ThreeScene
  }
}
</script>

<style scoped>
.home-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 20px;
  background: #2c3e50;
  color: white;
}

.content {
  flex: 1;
  display: flex;
}

.scene-container {
  flex: 3;
  position: relative;
}

.control-panel {
  flex: 1;
  padding: 20px;
  background: #f8f9fa;
  border-left: 1px solid #ddd;
}
</style>