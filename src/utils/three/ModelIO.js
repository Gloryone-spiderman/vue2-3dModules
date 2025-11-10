// 模型导入导出工具类
export class ModelIO {
  // 导出模型配置为JSON文件
  static exportToJSON(modelConfigs, filename = "model-configs.json") {
    const dataStr = JSON.stringify(modelConfigs, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = filename;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  }

  // 从JSON文件导入模型配置
  static importFromJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const configs = JSON.parse(event.target.result);
          resolve(configs);
        } catch (error) {
          reject(new Error("解析JSON文件失败"));
        }
      };
      reader.onerror = () => reject(new Error("读取文件失败"));
      reader.readAsText(file);
    });
  }

  // 验证模型文件类型
  static validateModelFile(file) {
    const validExtensions = [".gltf", ".glb", ".fbx", ".obj", ".mtl"];
    const fileName = file.name.toLowerCase();

    return validExtensions.some((ext) => fileName.endsWith(ext));
  }

  // 获取模型文件类型
  static getModelFileType(fileName) {
    const ext = fileName.toLowerCase().split(".").pop();
    const typeMap = {
      gltf: "gltf",
      glb: "gltf",
      fbx: "fbx",
      obj: "obj",
      mtl: "mtl",
    };
    return typeMap[ext] || null;
  }

  // 生成模型配置模板
  static generateModelConfigTemplate() {
    return {
      name: "模型名称",
      url: "/models/模型文件路径",
      type: "gltf", // gltf, fbx, obj
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      castShadow: true,
      receiveShadow: true,
    };
  }
}
