<template>
  <div>
    <b-navbar type="dark" variant="dark" fixed="top">
      <b-container class="d-flex justify-content-between">
        <router-link to="/" class="navbar-brand">
          <img src="/static/branding/network_white.svg" width="30" height="30" class="d-inline-block align-top" alt="">
          REST Data Connector
        </router-link>
      </b-container>
    </b-navbar>
  </div>
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
  .navbar-brand > img {
    margin-right: 8px;
  }
  .navbar-brand {
    font-weight: 100 !important;
  }
  .list-unstyled a {
    text-decoration: none;
  }
</style>
