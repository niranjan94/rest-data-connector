<template>
  <div>
    <b-row>
      <b-col md="6">
        <b-form-group :label="directMode ? 'Endpoint:' : 'Base URL:'"
                      label-for="baseUrl"
                      label-size="sm"
                      :description="directMode ? 'The endpoint to make a request to' : 'Base URL to use for all API calls'">
          <b-form-input id="baseUrl"
                        type="url"
                        size="sm"
                        v-model.trim="config.baseUrl"
                        required
                        :placeholder="directMode ? 'https://example.com/api/v1/flights.json' : 'https://example.com/api/v1'">
          </b-form-input>
        </b-form-group>
      </b-col>
      <b-col md="2" v-if="withMethodPicker">
        <b-form-group label="Method:"
                      label-for="method"
                      label-size="sm"
                      description="The request method to use">
          <b-form-select id="method"
                         size="sm"
                         v-model="config.method"
                         :options="methods"
                         required>
          </b-form-select>
        </b-form-group>
      </b-col>

      <b-col :md="withMethodPicker ? 4 : 6">
        <b-form-group label="Authorization Mode:"
                      label-for="authorizationMode"
                      label-size="sm"
                      description="Specify mode of authentication to use for the API Request">
          <b-form-select id="authorizationMode"
                         size="sm"
                         v-model="config.authorizationMode"
                         :options="authorizationModes"
                         required>
          </b-form-select>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row v-if="config.authorizationMode === 'bearer' || config.authorizationMode === 'token'">
      <b-col md="12">
        <b-form-group label="Token:"
                      label-size="sm"
                      label-for="token">
          <b-form-input id="token"
                        type="text"
                        size="sm"
                        v-model.trim="config.token"
                        required>
          </b-form-input>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row v-if="config.authorizationMode === 'basic' || config.authorizationMode === 'expanded_token'">
      <b-col md="6">
        <b-form-group label="Username:"
                      label-size="sm"
                      label-for="username">
          <b-form-input id="username"
                        type="text"
                        size="sm"
                        v-model.trim="config.username"
                        :required="config.authorizationMode === 'basic'">
          </b-form-input>
        </b-form-group>

      </b-col>
      <b-col md="6">
        <b-form-group :label="config.authorizationMode === 'basic' ? 'Password:' : 'Token:'"
                      label-size="sm"
                      label-for="password">
          <b-form-input id="password"
                        :type="config.authorizationMode === 'basic' ? 'password' : 'text'"
                        size="sm"
                        v-model.trim="config.password"
                        required>
          </b-form-input>
        </b-form-group>

      </b-col>
    </b-row>
  </div>
</template>

<script>
  import { cloneDeep } from 'lodash-es';

  export default {
    name  : 'UrlAuth',
    props : ['requestConfig', 'directMode', 'withMethodPicker'],
    data() {
      return {
        config             : cloneDeep(this.requestConfig || {}),
        authorizationModes : [
          { text: 'None', value: 'none' },
          { text: 'Basic HTTP Auth', value: 'basic' },
          { text: 'OAuth Bearer Token', value: 'bearer' },
          { text: 'Basic Token', value: 'token' },
          { text: 'Expanded Token', value: 'expanded_token' }
        ],
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
      };
    },
    watch: {
      config: {
        handler(config) {
          this.$emit('update:requestConfig', config);
        },
        deep: true
      },
      requestConfig: {
        handler(requestConfig) {
          this.config = requestConfig;
        },
        deep: true
      }
    }
  };
</script>

<style scoped>
</style>
