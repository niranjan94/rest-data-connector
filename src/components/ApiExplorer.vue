<template>
  <div>
    <div class="container">
      <br>
      <b-form @submit="onSubmit"
              @reset="onReset"
              autocomplete="off">
        <b-form-group label="API Spec URL:"
                      label-for="apiSpecUrl"
                      label-size="sm"
                      description="Enter the full URL to the API definition file (Supports Swagger 2.0)">
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
              <b-button type="reset" variant="outline" :disabled="specLoading">&times;</b-button>
            </b-input-group-button>
          </b-input-group>
        </b-form-group>
      </b-form>
      <div v-if="endpoints.length">
        <url-auth :request-config.sync="requestConfig"/>
        <custom-headers :request-headers.sync="requestConfig.headers"/>
      </div>
      <hr>

      <data-view v-if="openDataView" :open-data-view="openDataView" :result="result" />

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
                  @result="onResult"
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
  import CustomHeaders from './rest/CustomHeaders';
  import { setInterceptor } from '../libs/interceptor';
  import DataView from './rest/DataView';
  import { merge } from 'lodash-es';

  export default {
    components: {
      DataView,
      CustomHeaders,
      UrlAuth,
      ApiItem },
    name: 'ApiExplorer',
    data() {
      let lastApiSpecUrl = localStorage.getItem('lastApiSpecUrl') || '';
      let lastRequestConfig = localStorage.getItem('lastRequestConfig');
      if (lastRequestConfig) {
        lastRequestConfig = JSON.parse(lastRequestConfig);
      }
      setInterceptor(lastRequestConfig);
      return {
        apiSpecUrl: lastApiSpecUrl,
        apiSpec: {},
        endpoints: [],
        unsupportedApiAlert: false,
        generalAlert: false,
        specLoading: false,
        result: {},
        openDataView: false,
        requestConfig: merge({
          authorizationMode: 'none',
          baseUrl: '',
          username: '',
          password: '',
          token: '',
          headers: []
        }, lastRequestConfig || {})
      };
    },
    methods: {
      onSubmit(e) {
        e.preventDefault();
        this.endpoints = [];
        this.baseUrl = '';
        this.unsupportedApiAlert = false;
        this.specLoading = true;
        this.$http.get(this.apiSpecUrl, { before: () => {} }).then(response => {
          this.apiSpec = response.body;
          this.specLoading = false;
          const { endpoints, baseUrl } = normalize(response.body);
          if(!endpoints) {
            this.unsupportedApiAlert = true;
            return;
          }
          localStorage.setItem('lastApiSpecUrl', this.apiSpecUrl);
          this.endpoints = endpoints;
          this.requestConfig.baseUrl = baseUrl;
        }, response => {
          this.unsupportedApiAlert = false;
          this.specLoading = false;
          this.generalAlert = `HTTP ${response.status} - ${response.statusText}`;
        });
      },
      onReset(e) {
        e.preventDefault();
        Object.assign(this.$data, this.$options.data());
      },
      onResult(result) {
        console.log(result);
        this.openDataView = true;
        this.result = result;
      }
    },
    watch: {
      requestConfig: {
        handler (requestConfig) {
          setInterceptor(requestConfig);
        },
        deep: true
      }
    }
  };
</script>

<style scoped>

</style>
