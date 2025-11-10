<template>
  <div id="app">
    <!-- 根组件的div容器 -->
    <router-view></router-view>
    <!-- 路由视图，用于渲染当前路由对应的组件 -->
  </div>
</template>

<script>
export default {
  // 根组件的vue实例
  name: "App", // 根组件的名称
};
</script>

<style>
#app {
  width: 100%; /* 根组件的宽度为100%*/
  height: 100vh; /* 根组件的高度为100vh*/
  margin: 0 auto; /*根组件的margin为0 auto，实现水平居中*/
  padding: 0 10px; /* 根组件的padding为0 10px，实现左右内边距*/
  overflow: hidden; /* 根组件的overflow为hidden，实现隐藏超出部分*/
}
</style>
