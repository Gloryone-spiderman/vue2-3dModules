import * as THREE from 'three';
import { sceneConfig, geometryTypes, materialConfig } from '@/data/sceneData.js';
import { ModelLoader } from '@/utils/three/loader.js';

// 3D引擎核心类 - 逻辑层
export default class ThreeEngine {
  constructor(container, config = sceneConfig) {
    this.container = container;
    this.config = config;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.lights = new Map();
    this.objects = new Map();
    this.animationId = null;
    this.isInitialized = false;
    
    // 对象池管理
    this.objectPool = new Map();
    
    // 资源加载器
    this.modelLoader = new ModelLoader();
    
    // 性能监控
    this.stats = this.initStats();
  }

  // 初始化引擎
  async init() {
    try {
      // 创建场景
      this.scene = new THREE.Scene();
      
      // 设置场景背景
      this.setBackground(this.config.environment.background);
      
      // 创建相机
      this.createCamera();
      
      // 创建渲染器
      this.createRenderer();
      
      // 创建控制器
      this.createControls();
      
      // 创建灯光系统
      this.createLights();
      
      // 创建基础几何体
      await this.createBaseObjects();
      
      // 启动渲染循环
      this.startAnimation();
      
      this.isInitialized = true;
      console.log('3D引擎初始化完成');
      
      return this;
    } catch (error) {
      console.error('3D引擎初始化失败:', error);
      throw error;
    }
  }

  // 创建相机
  createCamera() {
    const camConfig = this.config.camera;
    this.camera = new THREE.PerspectiveCamera(
      camConfig.fov,
      this.container.clientWidth / this.container.clientHeight,
      camConfig.near,
      camConfig.far
    );
    
    this.camera.position.set(
      camConfig.position.x,
      camConfig.position.y,
      camConfig.position.z
    );
    this.camera.lookAt(
      camConfig.lookAt.x,
      camConfig.lookAt.y,
      camConfig.lookAt.z
    );
  }

  // 创建渲染器
  createRenderer() {
    const rendererConfig = this.config.renderer;
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: rendererConfig.antialias,
      alpha: rendererConfig.alpha
    });
    
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.renderer.shadowMap.enabled = rendererConfig.shadowMapEnabled;
    this.renderer.shadowMap.type = THREE[rendererConfig.shadowMapType + 'ShadowMap'];
    
    this.container.appendChild(this.renderer.domElement);
  }

  // 创建控制器
  createControls() {
    // 使用OrbitControls实现相机控制
    const OrbitControls = require('three/examples/jsm/controls/OrbitControls').OrbitControls;
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
  }

  // 创建灯光系统
  createLights() {
    this.config.lights.forEach(lightConfig => {
      let light;
      
      switch(lightConfig.type) {
        case 'ambient':
          light = new THREE.AmbientLight(
            lightConfig.color,
            lightConfig.intensity
          );
          break;
        case 'directional':
          light = new THREE.DirectionalLight(
            lightConfig.color,
            lightConfig.intensity
          );
          light.position.set(
            lightConfig.position.x,
            lightConfig.position.y,
            lightConfig.position.z
          );
          light.castShadow = lightConfig.castShadow || false;
          break;
        case 'point':
          light = new THREE.PointLight(
            lightConfig.color,
            lightConfig.intensity,
            lightConfig.distance || 0
          );
          light.position.set(
            lightConfig.position.x,
            lightConfig.position.y,
            lightConfig.position.z
          );
          break;
      }
      
      if (light) {
        this.scene.add(light);
        this.lights.set(lightConfig.type, light);
      }
    });
  }

  // 创建基础几何体
  async createBaseObjects() {
    for (const objConfig of this.config.objects) {
      await this.addObject(objConfig);
    }
  }

  // 添加3D对象（支持内置几何体和外部模型）
  async addObject(config) {
    try {
      let object;
      
      // 检查是否为内置几何体
      if (geometryTypes[config.type]) {
        object = this.createBuiltinGeometry(config);
      } else {
        // 加载外部模型
        object = await this.loadExternalModel(config);
      }
      
      // 设置对象属性
      object.name = config.name || config.id;
      object.userData = { config };
      
      // 添加到场景和对象池
      this.scene.add(object);
      this.objects.set(config.id, object);
      
      console.log(`添加对象: ${config.name}`);
      return object;
      
    } catch (error) {
      console.error(`添加对象失败: ${config.name}`, error);
      throw error;
    }
  }

  // 创建内置几何体
  createBuiltinGeometry(config) {
    const geometry = geometryTypes[config.type].create(config.size);
    const materialConfig = config.material || materialConfig.default;
    const material = new THREE.MeshStandardMaterial(materialConfig);
    
    const mesh = new THREE.Mesh(geometry, material);
    
    // 设置位置、旋转、缩放
    mesh.position.set(
      config.position.x,
      config.position.y,
      config.position.z
    );
    
    mesh.rotation.set(
      (config.rotation?.x || 0) * Math.PI / 180,
      (config.rotation?.y || 0) * Math.PI / 180,
      (config.rotation?.z || 0) * Math.PI / 180
    );
    
    mesh.scale.set(
      config.scale?.x || 1,
      config.scale?.y || 1,
      config.scale?.z || 1
    );
    
    // 设置阴影
    mesh.castShadow = config.castShadow || false;
    mesh.receiveShadow = config.receiveShadow || false;
    
    return mesh;
  }

  // 加载外部模型
  async loadExternalModel(config) {
    const model = await this.modelLoader.loadModel(
      config.url,
      config.type,
      {
        castShadow: config.castShadow,
        receiveShadow: config.receiveShadow
      }
    );
    
    // 设置变换
    model.position.set(
      config.position.x,
      config.position.y,
      config.position.z
    );
    
    model.rotation.set(
      (config.rotation?.x || 0) * Math.PI / 180,
      (config.rotation?.y || 0) * Math.PI / 180,
      (config.rotation?.z || 0) * Math.PI / 180
    );
    
    model.scale.set(
      config.scale?.x || 1,
      config.scale?.y || 1,
      config.scale?.z || 1
    );
    
    return model;
  }

  // 移除对象
  removeObject(objectId) {
    const object = this.objects.get(objectId);
    if (object) {
      this.scene.remove(object);
      this.objects.delete(objectId);
      
      // 清理几何体和材质
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    }
  }

  // 设置场景背景
  setBackground(colorOrTexture) {
    if (typeof colorOrTexture === 'number') {
      this.scene.background = new THREE.Color(colorOrTexture);
    } else {
      this.scene.background = colorOrTexture;
    }
  }

  // 启动动画循环
  startAnimation() {
    const animate = () => {
      this.animationId = requestAnimationFrame(animate);
      
      // 更新控制器
      if (this.controls) {
        this.controls.update();
      }
      
      // 渲染场景
      this.renderer.render(this.scene, this.camera);
      
      // 更新性能统计
      if (this.stats) {
        this.stats.update();
      }
    };
    
    animate();
  }

  // 停止动画循环
  stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  // 初始化性能监控
  initStats() {
    // 在生产环境中可以禁用性能监控
    if (process.env.NODE_ENV === 'production') {
      return null;
    }
    
    try {
      const Stats = require('stats.js');
      const stats = new Stats();
      stats.showPanel(0); // 0: fps, 1: ms, 2: mb
      document.body.appendChild(stats.dom);
      return stats;
    } catch (error) {
      console.warn('性能监控初始化失败，继续运行');
      return null;
    }
  }

  // 处理窗口大小变化
  onWindowResize() {
    if (this.camera && this.renderer) {
      this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
  }

  // 清理资源
  dispose() {
    this.stopAnimation();
    
    // 清理所有对象
    this.objects.forEach((object, id) => {
      this.removeObject(id);
    });
    
    // 清理渲染器
    if (this.renderer) {
      this.renderer.dispose();
      this.container.removeChild(this.renderer.domElement);
    }
    
    // 清理控制器
    if (this.controls) {
      this.controls.dispose();
    }
    
    console.log('3D引擎资源清理完成');
  }
}