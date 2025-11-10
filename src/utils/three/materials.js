import * as THREE from "three";

// 材质管理类
export class MaterialManager {
  // 创建基础材质
  static createBasicMaterial(config = {}) {
    // 创建基础材质
    const { color = 0xffffff, ...params } = config;
    // 返回基础材质
    return new THREE.MeshBasicMaterial({ color, ...params });
  }

  // 创建标准材质
  static createStandardMaterial(config = {}) {
    // 创建标准材质
    const {
      // 颜色
      color = 0xffffff,
      // 金属度
      metalness = 0.3,
      // 粗糙度
      roughness = 0.4,
      ...params
    } = config;
    // 返回标准材质
    return new THREE.MeshStandardMaterial({
      // 颜色
      color,
      // 金属度
      metalness,
      // 粗糙度
      roughness,
      ...params,
    });
  }

  // 创建高光材质
  static createPhongMaterial(config = {}) {
    // 创建高光材质
    const { color = 0xffffff, ...params } = config;
    // 返回高光材质
    return new THREE.MeshPhongMaterial({ color, ...params });
  }

  // 创建兰伯特材质
  static createLambertMaterial(config = {}) {
    // 创建兰伯特材质
    const { color = 0xffffff, ...params } = config;
    // 返回兰伯特材质
    return new THREE.MeshLambertMaterial({ color, ...params });
  }

  // 创建纹理材质
  static async createTextureMaterial(textureUrl, config = {}) {
    // 创建纹理材质
    return new Promise((resolve, reject) => {
      // 创建纹理加载器
      const textureLoader = new THREE.TextureLoader();
      // 加载纹理
      textureLoader.load(
        // 纹理加载成功回调
        textureUrl,
        // 纹理加载成功回调
        (texture) => {
          const material = new THREE.MeshStandardMaterial({
            // 映射纹理到材质
            map: texture,
            ...config,
          });
          resolve(material);
        },
        undefined,
        // 纹理加载失败回调
        (error) => {
          reject(error);
        }
      );
    });
  }
}
