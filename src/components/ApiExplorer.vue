<template>
  <div>
    <div class="container">
      <br>
      <b-form @submit="onSubmit"
              @reset="onReset"
              autocomplete="off">
        <b-form-group label="Swagger API Url:"
                      label-for="apiSpecUrl"
                      label-size="sm"
                      description="Enter the full URL to the swagger API definition json file">
          <b-input-group>
            <b-form-input id="apiSpecUrl"
                          type="url"
                          size="sm"
                          placeholder="http://domain.com/api/swagger.json"
                          v-model.trim="apiSpecUrl"
                          autocomplete="off"
                          required></b-form-input>
            <b-input-group-button>
              <b-button type="submit" :disabled="specLoading">Load API</b-button>
            </b-input-group-button>
          </b-input-group>
        </b-form-group>
      </b-form>
      <div v-if="endpoints.length">
        <url-auth :request-config.sync="requestConfig"></url-auth>
      </div>
      <hr>

      <b-alert variant="danger"
               dismissible
               :show="unsupportedApiAlert"
               @dismissed="unsupportedApiAlert=false">
        The API spec is unsupported. Only Swagger 2.0 spec is supported at this point.
      </b-alert>

      <b-alert variant="danger"
               dismissible
               :show="generalAlert"
               @dismissed="generalAlert=false">
        {{generalAlert}}
      </b-alert>

      <div role="tablist">
        <api-item v-for="(value) in endpoints"
                  :key="value.id"
                  :definition="value"
                  :request-config="requestConfig">

        </api-item>
      </div>

    </div>
  </div>
</template>

<script>
  import { normalize } from '../libs/normalize';
  import ApiItem from './ApiItem';
  import UrlAuth from './rest/UrlAuth';

  export default {
    components: {
      UrlAuth,
      ApiItem },
    name: 'ApiExplorer',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
        apiSpecUrl: 'http://127.0.0.1:8080/spec.json',
        apiSpec: {},
        endpoints: [],
        unsupportedApiAlert: false,
        generalAlert: false,
        specLoading: false,
        requestConfig: {
          authorizationMode: 'none',
          baseUrl: '',
          username: '',
          password: '',
          token: ''
        }
      };
    },
    methods: {
      onSubmit(e) {
        e.preventDefault();
        this.endpoints = [];
        this.baseUrl = '';
        this.unsupportedApiAlert = false;
        this.specLoading = true;
        this.$http.get(this.apiSpecUrl).then(response => {
          this.apiSpec = response.body;
          this.specLoading = false;
          const { endpoints, baseUrl } = normalize(response.body);
          if(!endpoints) {
            this.unsupportedApiAlert = true;
            return;
          }
          this.endpoints = endpoints;
          this.requestConfig.baseUrl = baseUrl;
        }, response => {
          this.unsupportedApiAlert = false;
          this.specLoading = false;
          this.generalAlert = `HTTP ${response.status} - ${response.statusText}`;
        });
      },
      onReset() {

      }
    }
  };
</script>

<style scoped>

</style>
