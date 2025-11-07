import * as THREE from "three";

export class ModelLoader {
  // 模型加载器 设置加载器 支持glTF、FBX、OBJ、MTL格式
  constructor() {
    this.loader = {
      gtlf: new THREE.GLTFLoader(),
      fbx: new THREE.FBXLoader(),
      obj: new THREE.OBJLoader(),
      mtl: new THREE.MTLLoader(),
    };
  }
  // 异步加载模型 支持glTF、FBX、OBJ、MTL格式
  // @param {string} url - 模型文件的URL
  // @param {string} type - 模型类型，可选值为'gtlf'、'fbx'、'obj'、'mtl'，默认值为'gtlf'
  // @returns {Promise<THREE.Object3D>} - 加载完成的模型对象
  async loadModel(url, type = "gtlf") {
    return new Promise((resolve, reject) => {
      const loader = this.loader[type];
      if (!loader) {
        reject(new Error(`不支持的模型类型:${type}`));
        return;
      }
      loader.load(
        url,
        (model) => {
          resolve(model);
        },
        (progress) => {
          console.log("Loading progress:", progress);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  //材质处理
  // @param {THREE.Object3D} model - 加载完成的模型对象
  // @returns {THREE.Object3D} - 处理后的模型对象
  // 遍历模型中的所有材质，设置材质的side为THREE.DoubleSide
  // 这是因为OBJLoader加载的模型默认是单面的，而在Three.js中，双面渲染是默认开启的
  // 所以需要将模型中的所有材质的side设置为THREE.DoubleSide，以确保模型在渲染时能够正确显示
  applyMaterials(model, materialConfig) {
    model.traverse((child) => {
      if (child.isMesh) {
        if (materialConfig) {
          child.material = materialConfig;
        }
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }
  createMaterial(config) {
    const { type = "standard", color = 0xffffff, ...params } = config;

    switch (type) {
      case "basic":
        return new THREE.MeshBasicMaterial({ color, ...params });
      case "lambert":
        return new THREE.MeshLambertMaterial({ color, ...params });
      case "phong":
        return new THREE.MeshPhongMaterial({ color, ...params });
      default:
        return new THREE.MeshStandardMaterial({ color, ...params });
    }
  }
}
