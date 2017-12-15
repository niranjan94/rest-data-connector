<template>
  <b-card no-body class="mb-1">
    <b-card-header header-tag="header" class="p-1" role="tab">
      <b-btn class="endpoint-btn" block href="#" v-b-toggle="uuid" variant="link">
        <b-badge variant="success" class="method-badge">GET</b-badge>
        <strong>{{definition.endpoint}}</strong>
        <span class="text-muted" style="float: right">{{definition.summary}}</span>
      </b-btn>
    </b-card-header>
    <b-collapse :id="uuid" accordion="my-accordion" role="tabpanel">
      <b-card-body>


        <b-form @submit="onSubmit" autocomplete="off">
          <table v-if="definition.parameters.length" class="table table-sm parameters-table">
            <thead>
            <tr>
              <th scope="col">Parameters</th>
              <th scope="col">Value</th>
              <th scope="col">Description</th>
              <th scope="col">Parameter Type</th>
              <th scope="col">Data Type</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(parameter) in definition.parameters">
              <th scope="row">{{parameter.name}}</th>
              <td>
                <b-form-select v-if="parameter.enum" v-model="parameter.value" :options="parameter.enum" size="sm"
                               :required="parameter.required"></b-form-select>
                <b-form-input v-else :type="parameter.htmlType" size="sm" v-model.trim="parameter.value"
                              :required="parameter.required"></b-form-input>
              </td>
              <td>{{parameter.description}}</td>
              <td>{{parameter.in}}</td>
              <td>{{parameter.type}}</td>
            </tr>
            </tbody>
          </table>
          <b-button type="submit" size="sm" variant="secondary">
            Get Data
          </b-button>
        </b-form>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
  export default {
    name: 'ApiItem',
    props: ['url', 'definition', 'requestConfig'],
    data() {
      return {
        uuid: this.$uuid.v4()
      };
    },
    methods: {
      onSubmit(e) {
        e.preventDefault();
      }
    }
  };
</script>

<style scoped>
  .endpoint-btn {
    text-align: left;
    text-decoration: none !important;
    color: inherit !important;
  }

  .method-badge {
    margin-right: 8px;
  }

  .card-body {
    padding: 1rem;
  }

  .parameters-table {
    font-size: small;
  }

  .parameters-table input, .parameters-table select {
    font-size: 10px;
  }

  .parameters-table td {
    vertical-align: middle;
  }
</style>
