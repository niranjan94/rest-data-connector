<template>
  <div id="app">
    <nav-bar></nav-bar>
    <router-view></router-view>
  </div>
</template>

<script>
  import NavBar from "./components/NavBar";

  export default {
    components: {NavBar},
    name: 'app'
  };
</script>

<style>

  @import "bootstrap/dist/css/bootstrap.css";
  @import "bootstrap-vue/dist/bootstrap-vue.css";

  #app {

  }
</style>
