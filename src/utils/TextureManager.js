import * as THREE from 'three';

// 纹理资源管理器 - 按需加载和缓存
export class TextureManager {
  constructor() {
    this.textures = new Map();
    this.loader = new THREE.TextureLoader();
  }

  // 加载纹理
  async loadTexture(url, options = {}) {
    if (this.textures.has(url)) {
      return this.textures.get(url);
    }

    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (texture) => {
          // 应用配置选项
          if (options.wrapS) texture.wrapS = options.wrapS;
          if (options.wrapT) texture.wrapT = options.wrapT;
          if (options.repeat) texture.repeat.set(options.repeat.x, options.repeat.y);
          
          this.textures.set(url, texture);
          resolve(texture);
        },
        undefined,
        (error) => {
          reject(new Error(`纹理加载失败: ${url}`));
        }
      );
    });
  }

  // 获取纹理
  getTexture(url) {
    return this.textures.get(url);
  }

  // 清理纹理
  disposeTexture(url) {
    const texture = this.textures.get(url);
    if (texture) {
      texture.dispose();
      this.textures.delete(url);
    }
  }

  // 清理所有纹理
  disposeAll() {
    this.textures.forEach((texture, url) => {
      texture.dispose();
    });
    this.textures.clear();
  }
}