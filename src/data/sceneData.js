// 场景数据配置 - 纯数据层
export const sceneConfig = {
  // 场景基本信息
  name: "3D模型展示场景",
  version: "1.0.0",

  // 场景对象配置
  objects: [
    {
      id: "floor-1",
      name: "地面",
      type: "plane",
      position: { x: 0, y: 0, z: 0 },
      size: { width: 100, height: 100 },
      material: {
        color: 0x808080,
        roughness: 0.8,
        metalness: 0.2,
      },
      receiveShadow: true,
    },
    {
      id: "cube-1",
      name: "示例立方体",
      type: "cube",
      position: { x: 0, y: 10, z: 0 },
      size: { width: 20, height: 20, depth: 20 },
      material: {
        color: 0x00ff00,
        roughness: 0.4,
        metalness: 0.6,
      },
      castShadow: true,
      receiveShadow: true,
    },
    {
      id: "sphere-1",
      name: "示例球体",
      type: "sphere",
      position: { x: 30, y: 15, z: 0 },
      size: { radius: 10 },
      material: {
        color: 0xff0000,
        roughness: 0.3,
        metalness: 0.7,
      },
      castShadow: true,
      receiveShadow: true,
    },
  ],

  // 相机配置
  camera: {
    type: "perspective",
    position: { x: 0, y: 50, z: 100 },
    lookAt: { x: 0, y: 0, z: 0 },
    fov: 75,
    near: 0.1,
    far: 1000,
  },

  // 灯光配置
  lights: [
    {
      type: "ambient",
      color: 0x404040,
      intensity: 0.6,
    },
    {
      type: "directional",
      color: 0xffffff,
      intensity: 0.8,
      position: { x: 50, y: 50, z: 50 },
      castShadow: true,
    },
  ],

  // 渲染器配置
  renderer: {
    antialias: true,
    alpha: false,
    shadowMapEnabled: true,
    shadowMapType: "PCFSoft",
  },

  // 场景环境配置
  environment: {
    background: 0x87ceeb, // 天蓝色背景
    fog: {
      enabled: false,
      color: 0xcccccc,
      near: 1,
      far: 300,
    },
  },
};

// 内置几何体类型配置
export const geometryTypes = {
  cube: {
    create: (size) =>
      new THREE.BoxGeometry(size.width, size.height, size.depth),
  },
  sphere: {
    create: (size) => new THREE.SphereGeometry(size.radius, 32, 32),
  },
  plane: {
    create: (size) => new THREE.PlaneGeometry(size.width, size.height),
  },
  cylinder: {
    create: (size) =>
      new THREE.CylinderGeometry(
        size.radiusTop || 5,
        size.radiusBottom || 5,
        size.height || 20,
        32
      ),
  },
};

// 材质配置系统
export const materialConfig = {
  default: {
    color: 0xffffff,
    roughness: 0.7,
    metalness: 0.3,
  },
  metallic: {
    color: 0x888888,
    roughness: 0.1,
    metalness: 0.9,
  },
  plastic: {
    color: 0xffffff,
    roughness: 0.8,
    metalness: 0.2,
  },
};

// 导出默认配置
export default sceneConfig;
