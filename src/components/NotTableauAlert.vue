<template>
  <div>
    <b-alert v-if="!inTableau" show variant="info" class="text-center">
      <h5>This is a Web Data Connector for Tableau</h5>
      Please open this page inside Tableau to connect to your data<br>
      <a href="https://onlinehelp.tableau.com/current/pro/desktop/en-us/examples_web_data_connector.html" target="_blank">Learn more</a><br>
      <a class="btn btn-outline-secondary btn-sm" href="tableau://rest-data-connector">Open Tableau</a>
    </b-alert>
  </div>
</template>

<script>
  export default {
    name: 'NotTableauAlert',
    data() {
      return {};
    },
    computed: {
      inTableau() {
        return this.$store.state.inTableau;
      }
    }
  };
</script>

<style scoped>
  .alert {
    margin-bottom: 2rem;
  }
  a.btn {
    margin-top: 12px;
  }
</style>
