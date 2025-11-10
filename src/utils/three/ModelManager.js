import { ModelLoader } from "./loader";
import * as THREE from "three";

// 模型管理器类，负责模型的导入、导出和管理
export class ModelManager {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.modelLoader = new ModelLoader();
    this.loadedModels = new Map(); // 存储已加载的模型
    this.modelConfigs = new Map(); // 存储模型配置信息
  }
  // 创建内置几何体
  createBuiltinGeometry(type, config = {}) {
    const {
      color = 0xffffff,
      width = 1,
      height = 1,
      depth = 1,
      radius = 1,
    } = config;

    let geometry, material, mesh;

    material = new THREE.MeshStandardMaterial({ color });

    switch (type) {
      case "box":
        geometry = new THREE.BoxGeometry(width, height, depth);
        break;
      case "sphere":
        geometry = new THREE.SphereGeometry(radius, 32, 32);
        break;
      case "cylinder":
        geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
        break;
      case "plane":
        geometry = new THREE.PlaneGeometry(width, height);
        break;
      default:
        throw new Error(`不支持的内置几何体类型: ${type}`);
    }

    mesh = new THREE.Mesh(geometry, material);
    return mesh;
  }
  // 导入外部模型
  async importModel(modelConfig) {
    const {
      name,
      url,
      type = "gltf",
      position = { x: 0, y: 0, z: 0 },
      rotation = { x: 0, y: 0, z: 0 },
      scale = { x: 1, y: 1, z: 1 },
      castShadow = true,
      receiveShadow = true,
      material = null,
    } = modelConfig;

    try {
      // 加载模型
      const model = await this.modelLoader.loadModel(url, type, {
        castShadow,
        receiveShadow,
        material,
        onProgress: (progress) => {
          console.log(
            `加载模型 ${name}: ${(
              (progress.loaded / progress.total) *
              100
            ).toFixed(2)}%`
          );
        },
      });

      // 设置模型变换
      model.position.set(position.x, position.y, position.z);
      model.rotation.set(rotation.x, rotation.y, rotation.z);
      model.scale.set(scale.x, scale.y, scale.z);

      // 添加到场景
      this.sceneManager.addObject(model);

      // 存储模型信息
      this.loadedModels.set(name, model);
      this.modelConfigs.set(name, modelConfig);

      console.log(`模型 ${name} 导入成功`);
      return model;
    } catch (error) {
      console.error(`导入模型 ${name} 失败:`, error);
      throw error;
    }
  }

  // 导入OBJ+MTL组合模型
  async importOBJWithMTL(modelConfig) {
    const {
      name,
      objUrl,
      mtlUrl,
      position = { x: 0, y: 0, z: 0 },
      rotation = { x: 0, y: 0, z: 0 },
      scale = { x: 1, y: 1, z: 1 },
    } = modelConfig;

    try {
      const model = await this.modelLoader.loadOBJWithMTL(objUrl, mtlUrl, {
        castShadow: true,
        receiveShadow: true,
        onProgress: (progress) => {
          console.log(
            `加载模型 ${name}: ${(
              (progress.loaded / progress.total) *
              100
            ).toFixed(2)}%`
          );
        },
      });

      model.position.set(position.x, position.y, position.z);
      model.rotation.set(rotation.x, rotation.y, rotation.z);
      model.scale.set(scale.x, scale.y, scale.z);

      this.sceneManager.addObject(model);
      this.loadedModels.set(name, model);
      this.modelConfigs.set(name, modelConfig);

      console.log(`OBJ+MTL模型 ${name} 导入成功`);
      return model;
    } catch (error) {
      console.error(`导入OBJ+MTL模型 ${name} 失败:`, error);
      throw error;
    }
  }

  // 导出模型配置（用于保存项目状态）
  exportModelConfigs() {
    const configs = {};
    this.modelConfigs.forEach((config, name) => {
      configs[name] = {
        ...config,
        // 添加当前变换信息
        position: {
          x: this.loadedModels.get(name).position.x,
          y: this.loadedModels.get(name).position.y,
          z: this.loadedModels.get(name).position.z,
        },
        rotation: {
          x: this.loadedModels.get(name).rotation.x,
          y: this.loadedModels.get(name).rotation.y,
          z: this.loadedModels.get(name).rotation.z,
        },
        scale: {
          x: this.loadedModels.get(name).scale.x,
          y: this.loadedModels.get(name).scale.y,
          z: this.loadedModels.get(name).scale.z,
        },
      };
    });
    return configs;
  }

  // 导入模型配置（用于加载项目状态）
  async importModelConfigs(configs) {
    for (const [name, config] of Object.entries(configs)) {
      try {
        if (config.objUrl && config.mtlUrl) {
          await this.importOBJWithMTL(config);
        } else {
          await this.importModel(config);
        }
      } catch (error) {
        console.error(`导入模型配置 ${name} 失败:`, error);
      }
    }
  }

  // 获取模型列表
  getModelList() {
    return Array.from(this.loadedModels.keys());
  }

  // 获取模型
  getModel(name) {
    return this.loadedModels.get(name);
  }

  // 移除模型
  removeModel(name) {
    const model = this.loadedModels.get(name);
    if (model) {
      this.sceneManager.removeObject(model);
      this.loadedModels.delete(name);
      this.modelConfigs.delete(name);
      console.log(`模型 ${name} 已移除`);
    }
  }

  // 更新模型变换
  updateModelTransform(name, transform) {
    const model = this.loadedModels.get(name);
    if (model) {
      if (transform.position) {
        model.position.set(
          transform.position.x,
          transform.position.y,
          transform.position.z
        );
      }
      if (transform.rotation) {
        model.rotation.set(
          transform.rotation.x,
          transform.rotation.y,
          transform.rotation.z
        );
      }
      if (transform.scale) {
        model.scale.set(
          transform.scale.x,
          transform.scale.y,
          transform.scale.z
        );
      }
    }
  }

  // 清空所有模型
  clearAllModels() {
    // 使用for...of循环遍历模型值，避免未使用参数的问题
    for (const model of this.loadedModels.values()) {
      this.sceneManager.removeObject(model);
    }
    this.loadedModels.clear();
    this.modelConfigs.clear();
    console.log("所有模型已清空");
  }
}
