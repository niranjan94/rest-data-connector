<template>
  <b-container>
    <h1>Oops, the page you're<br>looking for does not exist.</h1>
    <p class="lead">
      You may want to head back to the <router-link to="/">Home Page</router-link>.<br>
      If you think something is broken, <a href="https://github.com/niranjan94/rest-data-connector/issues" target="_blank">report</a> a problem.
    </p>
  </b-container>
</template>

<script>
  export default {
    name: 'NavBar',
    data() {
      return {};
    }
  };
</script>

<style scoped>
  .container {
    padding-top: 30vh;
  }
  h1 {
    font-weight: 100;
  }
  .lead {
    margin-top: 19px;
  }
</style>
