import * as THREE from "three";

// 创建辅助工具
export class ThreeHelpers {
  // 创建坐标轴辅助器
  static createAxesHelper(size = 5) {
    return new THREE.AxesHelper(size);
  }

  // 创建网格辅助器
  static createGridHelper(size = 10, divisions = 10) {
    return new THREE.GridHelper(size, divisions);
  }

  // 创建相机辅助器
  static createCameraHelper(camera) {
    return new THREE.CameraHelper(camera);
  }

  // 创建光源辅助器
  static createDirectionalLightHelper(light, size = 1, color) {
    return new THREE.DirectionalLightHelper(light, size, color);
  }

  // 创建点光源辅助器
  static createPointLightHelper(light, sphereSize, color) {
    return new THREE.PointLightHelper(light, sphereSize, color);
  }
}

// 动画工具
export class AnimationUtils {
  // 旋转动画
  static createRotationAnimation(object, speed = 0.01) {
    return () => {
      if (object) {
        object.rotation.x += speed;
        object.rotation.y += speed;
      }
    };
  }

  // 上下浮动动画
  static createFloatAnimation(object, amplitude = 0.5, speed = 0.01) {
    let time = 0;
    const originalY = object.position.y;

    return () => {
      time += speed;
      object.position.y = originalY + Math.sin(time) * amplitude;
    };
  }

  // 缩放动画
  static createScaleAnimation(
    object,
    minScale = 0.5,
    maxScale = 1.5,
    speed = 0.01
  ) {
    let time = 0;

    return () => {
      time += speed;
      const scale =
        minScale + ((Math.sin(time) + 1) / 2) * (maxScale - minScale);
      object.scale.setScalar(scale);
    };
  }
}
