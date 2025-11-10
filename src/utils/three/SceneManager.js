// 创建基础场景管理器
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// 场景管理类
export class SceneManager {
  // 构造函数，初始化场景管理类
  constructor(container) {
    // 场景容器DOM元素
    this.container = container;
    // 场景对象
    this.scene = null;
    // 相机对象
    this.camera = null;
    // 渲染器对象
    this.renderer = null;
    // 轨道控制器对象
    this.controls = null;
    // 存储所有模型对象
    this.objects = new Map();
    // 存储所有动画对象
    this.animations = [];
  }

  // 初始化场景
  init() {
    // 初始化场景
    this.initScene();
    // 初始化相机
    this.initCamera();
    // 初始化渲染器
    this.initRenderer();
    // 初始化轨道控制器
    this.initControls();
    // 初始化光源
    this.initLights();
    // 初始化窗口 resize 事件处理
    this.initResizeHandler();
    // 返回当前实例，支持链式调用
    return this;
  }
  
  initScene() {
    // 创建场景
    this.scene = new THREE.Scene();
    // 设置场景背景颜色
    this.scene.background = new THREE.Color(0xf0f0f0);
  }
  
  initCamera() {
    // 创建相机
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    // 设置相机位置和目标
    this.camera.position.set(5, 5, 5);
    // 设置相机目标点为场景中心
    this.camera.lookAt(0, 0, 0);
  }
  
  initRenderer() {
    // 创建渲染器
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    // 设置渲染器大小为容器大小
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    // 开启渲染器阴影贴图
    this.renderer.shadowMap.enabled = true;
    // 设置渲染器阴影贴图类型为 PCFSoftShadowMap
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // 将渲染器的 DOM 元素添加到场景容器中
    this.container.appendChild(this.renderer.domElement);
  }
  
  initControls() {
    // 创建轨道控制器
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // 开启轨道控制器阻尼效果
    this.controls.enableDamping = true;
    // 设置轨道控制器阻尼因子
    this.controls.dampingFactor = 0.25;
  }
  
  initLights() {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    // 添加环境光到场景中
    this.scene.add(ambientLight);

    // 方向光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    // 设置方向光位置
    directionalLight.position.set(10, 10, 5);
    // 开启方向光阴影投射
    directionalLight.castShadow = true;
    // 添加方向光到场景中
    this.scene.add(directionalLight);
  }
  
  initResizeHandler() {
    // 初始化窗口 resize 事件处理
    window.addEventListener("resize", () => this.onWindowResize());
  }

  onWindowResize() {
    // 更新相机宽高比
    this.camera.aspect =
      this.container.clientWidth / this.container.clientHeight;
    // 更新相机投影矩阵
    this.camera.updateProjectionMatrix();
    // 更新渲染器大小为容器大小
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
  }

  // 创建颜色对象
  createColor(colorValue) {
    return new THREE.Color(colorValue);
  }
  //设置场景背景颜色
  setBackgroundColor(colorValue) {
    if (this.scene) {
      this.scene.background = new THREE.Color(colorValue);
    }
  }
  // 清理场景资源
  cleanup() {
    this.dispose();
  }
  // 添加模型到场景
  addObject(name, object) {
    // 检查是否已存在同名模型
    if (this.objects.has(name)) {
      console.warn(`Model with name ${name} already exists.`);
      return this;
    }
    this.objects.set(name, object);
    this.scene.add(object);
    return this;
  }

  // 移除模型
  removeObject(name) {
    // 检查是否存在该模型
    const object = this.objects.get(name);
    //如果存在该模型
    if (object) {
      // 从场景中移除模型
      this.scene.remove(object);
      // 从存储中删除模型
      this.objects.delete(name);
    }
    //
    return this;
  }

  // 获取模型
  getObject(name) {
    // 返回指定名称的模型对象
    return this.objects.get(name);
  }

  // 添加动画
  addAnimation(animation) {
    //添加动画到动画数组
    this.animations.push(animation);
  }
  
  // 渲染循环
  animate() {
    // 递归调用 animate 方法，实现循环渲染
    requestAnimationFrame(() => this.animate());
    // 更新所有动画
    this.animations.forEach((animation) => animation());
    // 更新轨道控制器
    this.controls.update();
    // 渲染场景
    this.renderer.render(this.scene, this.camera);
  }

  // 清理资源
  dispose() {
    // 移除所有模型
    this.objects.forEach((object, name) => {
      this.removeObject(name);
    });
    // 移除所有动画
    this.animations = [];
    // 移除渲染器
    if (this.renderer) {
      // 释放渲染器资源
      this.renderer.dispose();
    }
    // 移除轨道控制器
    if (this.controls) {
      // 释放轨道控制器资源
      this.controls.dispose();
    }
    // 移除窗口 resize 事件处理
    window.removeEventListener("resize", () => this.onWindowResize());
  }
}