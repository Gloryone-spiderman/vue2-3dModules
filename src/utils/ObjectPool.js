// 对象池管理器 - 优化内存使用
export class ObjectPool {
  constructor(createFn, resetFn) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.available = [];
    this.inUse = new Set();
  }

  // 获取对象
  acquire() {
    let object;
    
    if (this.available.length > 0) {
      object = this.available.pop();
    } else {
      object = this.createFn();
    }
    
    this.inUse.add(object);
    return object;
  }

  // 释放对象
  release(object) {
    if (this.inUse.has(object)) {
      this.inUse.delete(object);
      
      // 重置对象状态
      if (this.resetFn) {
        this.resetFn(object);
      }
      
      this.available.push(object);
    }
  }

  // 清空对象池
  clear() {
    this.available.length = 0;
    this.inUse.clear();
  }

  // 获取统计信息
  getStats() {
    return {
      available: this.available.length,
      inUse: this.inUse.size,
      total: this.available.length + this.inUse.size
    };
  }
}