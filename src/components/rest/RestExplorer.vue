<template>
  <b-container>
    <br>
    <not-tableau-alert/>
    <url-auth :request-config.sync="requestConfig" :direct-mode="true" :with-method-picker="true"/>
    <custom-headers :request-headers.sync="requestConfig.headers"/>
    <body-editor :request-body.sync="requestBody" :method="requestConfig.method"/>
    <data-view v-if="openDataView" :open-data-view.sync="openDataView" :result="result"/>
    <br>
    <b-button type="button" variant="info" @click="makeRequest" :disabled="requestInProgress">Make request</b-button>
  </b-container>
</template>

<script>
  import NotTableauAlert from '../NotTableauAlert';
  import { merge, pick } from 'lodash-es';
  import UrlAuth from './UrlAuth';
  import CustomHeaders from './CustomHeaders';
  import DataView from './DataView';
  import BodyEditor from './BodyEditor';
  import { makeRequest } from '../../utils/make-request';
  import { modifyRequest } from '../../utils/interceptor';
  import { getErrorMessage } from '../../utils/errors';

  export default {
    components: {
      BodyEditor,
      DataView,
      NotTableauAlert, UrlAuth, CustomHeaders },
    name: 'RestExplorer',
    data() {
      let lastRequestConfig = localStorage.getItem('lastGenericRequestConfig');
      if (lastRequestConfig) {
        lastRequestConfig = JSON.parse(lastRequestConfig);
      }
      return {
        result       : {},
        openDataView : false,
        requestBody  : {
          value : null,
          type  : 'none'
        },
        requestInProgress : false,
        requestConfig     : merge({
          authorizationMode : 'none',
          method            : 'GET',
          baseUrl           : '',
          username          : '',
          password          : '',
          token             : '',
          headers           : []
        }, lastRequestConfig || {})
      };
    },
    methods: {
      makeRequest() {
        let body = null;
        const options = {
          params : {},
          before : request => {
            modifyRequest(this.requestConfig, request);
          }
        };
        switch (this.requestBody.type) {
          case 'raw':
            body = this.requestBody.value;
            break;
          case 'query':
            this.requestBody.value.forEach(item => body[item.name] = item.value);
            break;
          case 'form_data':
            body = new FormData();
            this.requestBody.value.forEach(item => body.append(item.name, item.value));
            break;
        }
        this.requestInProgress = true;
        makeRequest(this.requestConfig.method, this.requestConfig.baseUrl, null, body, options)
          .then(response => {
            this.requestInProgress = false;
            this.result = {
              data          : response.body,
              definition    : null,
              requestConfig : this.requestConfig,
              url           : this.requestConfig.baseUrl
            };
            this.openDataView = true;
          })
          .catch(e => {
            console.error(e);
            this.requestInProgress = false;
            let errorMessage = getErrorMessage(e.body);
            let text = `<strong>Reason:</strong> ${errorMessage}`;

            if (!errorMessage) {
              text = JSON.stringify(pick(e, ['status', 'statusText', 'body']));
            }

            this.$notify({
              type  : 'error',
              title : 'Request failed',
              text
            });
          });
      }
    },
    watch: {
      requestConfig: {
        handler(requestConfig) {
          if (requestConfig) {
            localStorage.setItem('lastGenericRequestConfig', JSON.stringify(requestConfig));
          }
        },
        deep: true
      }
    }
  };
</script>

<style scoped>

</style>
