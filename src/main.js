import Vue from "vue"; // 引入vue框架
import App from "./App.vue"; // 引入根组件
import ElementUI from "element-ui"; // 引入element-ui框架
import "element-ui/lib/theme-chalk/index.css"; // 引入element-ui的默认样式表
import router from "./router"; // 引入路由模块
import store from "./store"; // 引入状态管理模块

Vue.use(ElementUI); // 注册element-ui框架

new Vue({
  // 创建vue实例
  router, // 注册路由模块
  store, // 注册状态管理模块
  render: (h) => h(App), // 渲染根组件到id为app的元素上
}).$mount("#app"); // 挂载vue实例到id为app的元素上
