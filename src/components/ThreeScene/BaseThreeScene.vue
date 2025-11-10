<template>
  <div class="three-scene-container">
    <div ref="container" class="three-container"></div>
    <div class="controls-panel" v-if="showControls">
      <button @click="importModel">导入模型</button>
      <button @click="exportConfig">导出配置</button>
      <button @click="clearModels">清空模型</button>
      <input
        type="file"
        ref="fileInput"
        @change="handleFileImport"
        accept=".json,.gltf,.glb,.fbx,.obj,.mtl"
        multiple
        style="display: none"
      />
    </div>
  </div>
</template>

<script>
import { SceneManager } from "@/utils/three/SceneManager";
import { ModelFactory } from "@/utils/three/ModelFactory";
import { ModelManager } from "@/utils/three/ModelManager";
import { ModelIO } from "@/utils/three/ModelIO";

export default {
  name: "BaseThreeScene",
  props: {
    showControls: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      sceneManager: null,
      modelManager: null,
      isInitialized: false,
    };
  },
  mounted() {
    this.initScene();
  },
  beforeDestroy() {
    if (this.sceneManager) {
      this.sceneManager.cleanup();
    }
  },
  methods: {
    async initScene() {
      try {
        // 初始化场景管理器
        this.sceneManager = new SceneManager(this.$refs.container);
        this.sceneManager.init();

        // 初始化模型管理器
        this.modelManager = new ModelManager(this.sceneManager);

        // 设置场景背景色
        this.sceneManager.setBackgroundColor(0x87ceeb);

        // 添加基础几何体示例
        this.addExampleGeometry();

        // 启动渲染循环
        this.sceneManager.animate();

        this.isInitialized = true;
        this.$emit("sceneReady", this.sceneManager, this.modelManager);
      } catch (error) {
        console.error("初始化场景失败:", error);
      }
    },

    addExampleGeometry() {
      // 添加地面
      const ground = ModelFactory.createPlane({
        width: 20,
        height: 20,
        color: 0x808080,
        position: { x: 0, y: -2, z: 0 },
      });
      this.sceneManager.addObject("ground", ground);

      // 添加示例立方体
      const cube = ModelFactory.createBox({
        width: 1,
        height: 1,
        depth: 1,
        color: 0x00ff00,
        position: { x: -2, y: 0, z: 0 },
      });
      this.sceneManager.addObject("cube", cube);

      // 添加示例球体
      const sphere = ModelFactory.createSphere({
        radius: 0.5,
        color: 0xff0000,
        position: { x: 2, y: 0, z: 0 },
      });
      this.sceneManager.addObject("sphere", sphere);
    },

    // 导入模型
    importModel() {
      this.$refs.fileInput.click();
    },

    // 处理文件导入
    async handleFileImport(event) {
      const files = Array.from(event.target.files);

      for (const file of files) {
        if (ModelIO.validateModelFile(file)) {
          await this.handleModelFile(file);
        } else if (file.name.endsWith(".json")) {
          await this.handleConfigFile(file);
        }
      }

      // 清空文件输入
      event.target.value = "";
    },

    // 处理模型文件
    async handleModelFile(file) {
      try {
        // 将文件保存到public/models目录（实际项目中需要后端支持）
        const fileName = file.name;
        const modelType = ModelIO.getModelFileType(fileName);

        if (!modelType) {
          alert(`不支持的文件类型: ${fileName}`);
          return;
        }

        // 创建临时URL（实际项目中应该上传到服务器）
        const objectUrl = URL.createObjectURL(file);

        const modelConfig = {
          name: fileName.split(".")[0],
          url: objectUrl,
          type: modelType,
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
        };

        await this.modelManager.importModel(modelConfig);

        // 清理临时URL
        setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      } catch (error) {
        console.error("导入模型文件失败:", error);
        alert(`导入模型失败: ${error.message}`);
      }
    },

    // 处理配置文件
    async handleConfigFile(file) {
      try {
        const configs = await ModelIO.importFromJSON(file);
        await this.modelManager.importModelConfigs(configs);
        alert("配置文件导入成功");
      } catch (error) {
        console.error("导入配置文件失败:", error);
        alert(`导入配置文件失败: ${error.message}`);
      }
    },

    // 导出配置
    exportConfig() {
      const configs = this.modelManager.exportModelConfigs();
      ModelIO.exportToJSON(configs, "my-3d-scene-config.json");
    },

    // 清空模型
    clearModels() {
      this.modelManager.clearAllModels();
    },
  },
};
</script>

<style scoped>
.three-scene-container {
  position: relative;
  width: 100%;
  height: 100vh;
}

.three-container {
  width: 100%;
  height: 100%;
}

.controls-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 5px;
  z-index: 1000;
}

.controls-panel button {
  margin: 5px;
  padding: 8px 12px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.controls-panel button:hover {
  background: #45a049;
}
</style>
