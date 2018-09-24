<template>
  <b-card no-body class="mb-1">
    <b-card-header header-tag="header" class="p-1" role="tab">
      <b-btn class="endpoint-btn" block href="#" v-b-toggle="uuid" variant="link">
        <b-badge variant="success" class="method-badge">{{method}}</b-badge>
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
            <tr v-for="(parameter, index) in definition.parameters" :key="index">
              <th scope="row">{{parameter.name}}</th>
              <td>
                <b-form-select v-if="parameter.enum"
                               v-model="parameter.value"
                               :options="parameter.enum"
                               size="sm"
                               :disabled="requestInProgress"
                               :required="parameter.required"></b-form-select>
                <b-form-input v-else
                              :type="parameter.htmlType"
                              size="sm"
                              v-model.trim="parameter.value"
                              :disabled="requestInProgress"
                              :required="parameter.required"></b-form-input>
              </td>
              <td>{{parameter.description}}</td>
              <td>{{parameter.in}}</td>
              <td>{{parameter.type}}</td>
            </tr>
            </tbody>
          </table>
          <b-button type="submit" size="sm" variant="secondary" :disabled="requestInProgress">
            {{requestInProgress ? 'Loading ...' : 'Get data'}}
          </b-button>
        </b-form>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
  import { makeRequest } from '../utils/make-request';
  import { getErrorMessage } from '../utils/errors';
  import Raven from 'raven-js';

  export default {
    name  : 'ApiItem',
    props : ['url', 'definition', 'requestConfig'],
    data() {
      return {
        method            : 'get',
        uuid              : this.$uuid.v4(),
        requestInProgress : false
      };
    },
    methods: {
      onSubmit(e) {
        e.preventDefault();
        this.requestInProgress = true;
        makeRequest(this.method, this.definition.endpoint, this.definition.parameters)
          .then(response => {
            this.requestInProgress = false;

            const contentType = response.headers.get('content-type').split(';')[0].toLowerCase();

            if (!['application/json', 'application/xml'].includes(contentType)) {
              return this.$notify({
                type  : 'error',
                title : 'Unsupported response type ' + contentType,
                text  : 'Only xml and json are supported'
              });
            }

            this.$emit('result', {
              contentType,
              data          : response.body,
              definition    : this.definition,
              requestConfig : this.requestConfig,
              url           : this.url
            });
          })
          .catch(e => {
            console.error(e);
            Raven.captureException(e);
            this.requestInProgress = false;
            this.$notify({
              type  : 'error',
              title : 'Request failed',
              text  : `<strong>Endpoint:</strong> ${this.definition.endpoint}<br><strong>Reason:</strong> ${getErrorMessage(e.body)}`
            });
          });
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
    text-transform: uppercase;
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
