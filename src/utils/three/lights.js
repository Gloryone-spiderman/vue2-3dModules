import * as THREE from "three";

// 灯光管理类
export class LightManager {
  // 创建环境光
  static createAmbientLight(config = {}) {
    // 配置环境光参数
    const { color = 0x404040, intensity = 0.6 } = config;
    // 创建环境光
    const light = new THREE.AmbientLight(color, intensity);
    // 返回环境光
    return light;
  }

  // 创建方向光
  static createDirectionalLight(config = {}) {
    // 配置方向光参数
    const {
      color = 0xffffff,
      intensity = 1,
      position = { x: 10, y: 10, z: 5 },
    } = config;
    // 创建方向光
    const light = new THREE.DirectionalLight(color, intensity);
    // 设置方向光位置
    light.position.set(position.x, position.y, position.z);
    // 开启方向光阴影投射
    light.castShadow = true;
    // 阴影设置
    light.shadow.mapSize.width = 2048;
    // 设置阴影相机参数
    light.shadow.mapSize.height = 2048;
    // 设置阴影相机近裁剪面
    light.shadow.camera.near = 0.5;
    // 设置阴影相机远裁剪面
    light.shadow.camera.far = 500;
    // 返回方向光
    return light;
  }

  // 创建点光
  static createPointLight(config = {}) {
    // 配置点光参数
    const {
      // 点光颜色
      color = 0xffffff,
      // 点光强度
      intensity = 1,
      // 点光位置
      position = { x: 0, y: 5, z: 0 },
      // 点光距离
      distance = 100,
      // 点光衰减
      decay = 2,
    } = config;
    // 创建点光
    const light = new THREE.PointLight(color, intensity, distance, decay);
    // 设置点光位置
    light.position.set(position.x, position.y, position.z);
    // 开启点光阴影投射
    light.castShadow = true;
    // 返回点光
    return light;
  }
  // 创建聚光灯
  static createSpotLight(config = {}) {
    // 配置聚光灯参数
    const {
      // 聚光灯颜色
      color = 0xffffff,
      // 聚光灯强度
      intensity = 1,
      // 聚光灯位置
      position = { x: 0, y: 10, z: 0 },
      // 聚光灯目标位置
      target = { x: 0, y: 0, z: 0 },
    } = config;
    // 创建聚光灯
    const light = new THREE.SpotLight(color, intensity);
    // 设置聚光灯位置
    light.position.set(position.x, position.y, position.z);
    // 设置聚光灯目标位置
    light.target.position.set(target.x, target.y, target.z);
    // 开启聚光灯阴影投射
    light.castShadow = true;
    // 返回聚光灯
    return light;
  }
}
