import * as THREE from "three";

// 模型工厂类，用于创建不同类型的3D模型
export class ModelFactory {
  // 创建一个立方体模型
  static createBox(config = {}) {
    // 创建一个立方体模型
    const {
      // 立方体模型的宽度
      width = 1,
      // 立方体模型的高度
      height = 1,
      // 立方体模型的深度
      depth = 1,
      // 立方体模型的颜色
      color = 0x00ff00,
      // 立方体模型的位置
      position = { x: 0, y: 0, z: 0 },
      // 立方体模型的旋转角度
      rotation = { x: 0, y: 0, z: 0 },
    } = config;
    // 创建一个立方体模型的几何体
    const geometry = new THREE.BoxGeometry(width, height, depth);
    // 创建一个立方体模型的材质
    const material = new THREE.MeshStandardMaterial({ color });
    // 创建一个立方体模型的网格
    const mesh = new THREE.Mesh(geometry, material);
    // 设置立方体模型的位置
    mesh.position.set(position.x, position.y, position.z);
    // 设置立方体模型的旋转角度
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    // 开启立方体模型的阴影投射
    mesh.castShadow = true;
    // 开启立方体模型的阴影接收
    mesh.receiveShadow = true;
    // 返回创建好的立方体模型
    return mesh;
  }

  // 创建一个球体模型
  static createSphere(config = {}) {
    const {
      // 球体模型的半径
      radius = 1,
      // 球体模型的颜色
      color = 0xff0000,
      // 球体模型的位置
      position = { x: 0, y: 0, z: 0 },
    } = config;
    // 创建一个球体模型的几何体
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    // 创建一个球体模型的材质
    const material = new THREE.MeshStandardMaterial({ color });
    // 创建一个球体模型的网格
    const mesh = new THREE.Mesh(geometry, material);
    // 设置球体模型的位置
    mesh.position.set(position.x, position.y, position.z);
    // 开启球体模型的阴影投射
    mesh.castShadow = true;
    // 开启球体模型的阴影接收
    mesh.receiveShadow = true;
    // 返回创建好的球体模型
    return mesh;
  }

  // 创建一个圆柱体模型
  static createCylinder(config = {}) {
    const {
      // 圆柱体模型的顶部半径
      radiusTop = 1,
      // 圆柱体模型的底部半径
      radiusBottom = 1,
      // 圆柱体模型的高度
      height = 2,
      // 圆柱体模型的颜色
      color = 0x0000ff,
      // 圆柱体模型的位置
      position = { x: 0, y: 0, z: 0 },
    } = config;
    // 创建一个圆柱体模型的几何体
    const geometry = new THREE.CylinderGeometry(
      // 圆柱体模型的顶部半径
      radiusTop,
      // 圆柱体模型的底部半径
      radiusBottom,
      // 圆柱体模型的高度
      height,
      // 圆柱体模型的分段数
      32
    );
    // 创建一个圆柱体模型的材质
    const material = new THREE.MeshStandardMaterial({ color });
    // 创建一个圆柱体模型的网格
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(position.x, position.y, position.z);
    // 开启圆柱体模型的阴影投射
    mesh.castShadow = true;
    // 开启圆柱体模型的阴影接收
    mesh.receiveShadow = true;
    // 返回创建好的圆柱体模型
    return mesh;
  }

  // 创建一个平面模型
  static createPlane(config = {}) {
    // 创建一个平面模型
    const {
      // 平面模型的宽度
      width = 10,
      // 平面模型的高度
      height = 10,
      // 平面模型的颜色
      color = 0x808080,
      // 平面模型的位置
      position = { x: 0, y: -2, z: 0 },
    } = config;
    // 创建一个平面模型的几何体
    const geometry = new THREE.PlaneGeometry(width, height);
    // 创建一个平面模型的材质
    const material = new THREE.MeshStandardMaterial({
      // 平面模型的颜色
      color,
      // 平面模型的双面渲染
      side: THREE.DoubleSide,
    });
    // 创建一个平面模型的网格
    const mesh = new THREE.Mesh(geometry, material);
    // 设置平面模型的位置
    mesh.position.set(position.x, position.y, position.z);
    // 设置平面模型的旋转角度
    mesh.rotation.x = -Math.PI / 2;
    // 开启平面模型的阴影接收
    mesh.receiveShadow = true;
    // 返回创建好的平面模型
    return mesh;
  }
}
