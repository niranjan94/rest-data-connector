<template>
  <div id="app">
    <notifications position="bottom right"/>
    <nav-bar/>
    <router-view/>
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

  * {
    font-family: 'Lato', sans-serif;
  }

  .form-group {
    margin-bottom: 4px;
  }
  label {
    font-weight: 600 !important;
  }

</style>
