<template>
  <b-container>
    <br>
    <not-tableau-alert/>
    <b-form @submit="onSubmit"
            @reset="onReset"
            autocomplete="off">
      <b-form-group :label="`${specInfo.title} API Spec URL`"
                    label-for="apiSpecUrl"
                    label-size="sm"
                    :description="`Enter the full URL to the ${specInfo.title} compatible API definition file.`">
        <b-input-group>
          <b-form-input id="apiSpecUrl"
                        type="url"
                        size="sm"
                        :placeholder="`http://domain.com/api/${specInfo.specIdentifier}_spec`"
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

    <data-view v-if="openDataView" :open-data-view.sync="openDataView" :result="result"/>

    <!--suppress PointlessBooleanExpressionJS -->
    <b-alert variant="danger"
             dismissible
             :show="!!unsupportedApiAlert"
             @dismissed="unsupportedApiAlert=false">
      Invalid API Spec. Please ensure the URL given points to a {{specInfo.title}} compatible API specification.
    </b-alert>

    <!--suppress PointlessBooleanExpressionJS -->
    <b-alert variant="danger"
             dismissible
             :show="!!generalAlert"
             v-html="generalAlert"
             @dismissed="generalAlert=false">
    </b-alert>

    <div role="tablist">
      <api-item v-for="(value) in endpoints"
                @result="onResult"
                :key="value.id"
                :definition="value"
                :request-config="requestConfig">
      </api-item>
    </div>
  </b-container>
</template>

<script>
  import { getObjectFromBody, normalize } from '../utils/normalize';
  import ApiItem from './ApiItem';
  import UrlAuth from './rest/UrlAuth';
  import CustomHeaders from './rest/CustomHeaders';
  import { setInterceptor } from '../utils/interceptor';
  import DataView from './rest/DataView';
  import { find, merge } from 'lodash-es';
  import NotTableauAlert from './NotTableauAlert';
  import { supportedSpecs } from '../utils/specs';

  export default {
    components: {
      NotTableauAlert,
      DataView,
      CustomHeaders,
      UrlAuth,
      ApiItem
    },
    name: 'ApiExplorer',
    data() {
      let lastApiSpecUrl = localStorage.getItem('lastApiSpecUrl') || '';
      let lastRequestConfig = localStorage.getItem('lastRequestConfig');
      if (lastRequestConfig) {
        lastRequestConfig = JSON.parse(lastRequestConfig);
      }
      setInterceptor(lastRequestConfig);
      return {
        apiSpecUrl          : lastApiSpecUrl,
        apiSpec             : {},
        endpoints           : [],
        unsupportedApiAlert : false,
        generalAlert        : false,
        specLoading         : false,
        result              : {},
        openDataView        : false,
        requestConfig       : merge({
          authorizationMode : 'none',
          baseUrl           : '',
          username          : '',
          password          : '',
          token             : '',
          headers           : []
        }, lastRequestConfig || {})
      };
    },
    methods: {
      onSubmit(e) {
        e.preventDefault();
        this.endpoints = [];
        this.baseUrl = '';
        this.unsupportedApiAlert = false;
        this.generalAlert = false;
        this.specLoading = true;
        this.$http.get(this.apiSpecUrl, {
          before: () => {
          }
        }).then(response => {
          const body = getObjectFromBody(response.body);
          if (!body) {
            this.unsupportedApiAlert = true;
            return;
          }
          normalize(body, this.specInfo.specIdentifier)
            .then(normalized => {
              const { endpoints, baseUrl, rawSpec } = normalized;
              this.apiSpec = rawSpec;
              this.specLoading = false;
              if (!endpoints) {
                this.unsupportedApiAlert = true;
                return;
              }
              localStorage.setItem('lastApiSpecUrl', this.apiSpecUrl);
              this.endpoints = endpoints;
              this.requestConfig.baseUrl = baseUrl;
            })
            .catch(console.error);
        }, response => {
          console.error(response);
          this.unsupportedApiAlert = false;
          this.specLoading = false;
          if (response.status > 0) {
            this.generalAlert = `HTTP ${response.status} - ${response.statusText}`;
          } else {
            this.generalAlert = 'Request failed. <a href="https://tableau.github.io/webdataconnector/docs/wdc_cors" target="_blank" style="color: inherit;"><small>Could be a CORS issue.</small></a>';
          }
        });
      },
      onReset(e) {
        e.preventDefault();
        Object.assign(this.$data, this.$options.data());
      },
      onResult(result) {
        this.openDataView = true;
        this.result = result;
      }
    },
    computed: {
      specInfo() {
        return find(supportedSpecs, ['identifier', this.$route.params.type]);
      }
    },
    watch: {
      requestConfig: {
        handler(requestConfig) {
          setInterceptor(requestConfig);
        },
        deep: true
      }
    }
  };
</script>

<style scoped>

</style>
