import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";

// 模型加载器类
export class ModelLoader {
  // 构造函数，初始化模型加载器
  constructor() {
    // 初始化模型加载器，包含GLTF、FBX、OBJ、MTL四种格式的加载器
    this.loader = {
      gltf: new GLTFLoader(),
      fbx: new FBXLoader(),
      obj: new OBJLoader(),
      mtl: new MTLLoader(),
    };
  }

  // 异步加载模型
  async loadModel(url, type = "gltf", options = {}) {
    // 返回一个Promise，异步加载模型
    return new Promise((resolve, reject) => {
      // 获取指定类型的加载器
      const loader = this.loader[type];
      // 如果没有对应的加载器，抛出错误
      if (!loader) {
        reject(new Error(`不支持的模型类型: ${type}`));
        return;
      }
      // 加载模型，处理进度、错误和成功回调
      const onProgress =
        options.onProgress ||
        ((progress) => {
          // 打印加载进度
          console.log(
            `Loading progress: ${(
              (progress.loaded / progress.total) *
              100
            ).toFixed(2)}%`
          );
        });
      // 加载模型，处理错误回调
      const onError =
        options.onError ||
        ((error) => {
          console.error("加载模型错误:", error);
        });
      // 加载模型，处理成功回调
      loader.load(
        url,
        (model) => {
          this.processModel(model, type, options);
          resolve(model);
        },
        onProgress,
        onError
      );
    });
  }

  // 处理加载的模型
  processModel(model, type, options = {}) {
    // 遍历模型并设置阴影
    model.traverse((child) => {
      if (child.isMesh) {
        // 开启阴影投射
        child.castShadow = options.castShadow !== false;
        // 开启阴影接收
        child.receiveShadow = options.receiveShadow !== false;
        // 应用材质配置
        if (options.material) {
          // 应用指定材质
          child.material = options.material;
        }
      }
    });

    // 特定类型的处理
    if (type === "gltf" && model.scene) {
      // 处理GLTF模型，返回场景
      return model.scene;
    }
    // 处理其他类型模型，返回模型本身
    return model;
  }

  // 加载OBJ+MTL组合
  async loadOBJWithMTL(objUrl, mtlUrl, options = {}) {
    // 异步加载OBJ+MTL组合模型
    return new Promise((resolve, reject) => {
      // 加载MTL材质，处理进度、错误和成功回调
      this.loader.mtl.load(
        // 加载MTL材质，处理进度、错误和成功回调
        mtlUrl,
        // 加载OBJ模型，处理进度、错误和成功回调
        (materials) => {
          materials.preload();
          // 应用MTL材质到OBJ模型
          this.loader.obj.setMaterials(materials);
          // 加载OBJ模型，处理进度、错误和成功回调
          this.loader.obj.load(
            // 加载OBJ模型，处理进度、错误和成功回调
            objUrl,
            (object) => {
              const processedModel = this.processModel(object, "obj", options);
              resolve(processedModel);
            },
            options.onProgress,
            options.onError
          );
        },
        options.onProgress,
        (error) => {
          reject(new Error(`加载MTL材质失败: ${error}`));
        }
      );
    });
  }
}