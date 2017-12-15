<template>
  <div>
    <b-row>
      <b-col md="6">
        <b-form-group label="Base URL:"
                      label-for="baseUrl"
                      label-size="sm"
                      description="Base URL to use for all API calls">
          <b-form-input id="baseUrl"
                        type="url"
                        size="sm"
                        v-model.trim="config.baseUrl"
                        required
                        placeholder="https://example.com/api/v1">
          </b-form-input>
        </b-form-group>

      </b-col>
      <b-col md="6">
        <b-form-group label="Authorization Mode:"
                      label-for="authorizationMode"
                      label-size="sm"
                      description="Specify mode of authentication to use for all API requests">
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

    <b-row v-if="config.authorizationMode === 'basic'">
      <b-col md="6">
        <b-form-group label="Username:"
                      label-size="sm"
                      label-for="username">
          <b-form-input id="username"
                        type="text"
                        size="sm"
                        v-model.trim="config.username"
                        required>
          </b-form-input>
        </b-form-group>

      </b-col>
      <b-col md="6">
        <b-form-group label="Password:"
                      label-size="sm"
                      label-for="password">
          <b-form-input id="password"
                        type="password"
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
    name: 'UrlAuth',
    props: ['requestConfig'],
    data() {
      return {
        config:  cloneDeep(this.requestConfig || {}),
        authorizationModes: [
          { text: 'None', value: 'none' },
          { text: 'Basic HTTP Auth', value: 'basic' },
          { text: 'OAuth Bearer Token', value: 'bearer' },
          { text: 'Basic Token', value: 'token' }
        ]
      };
    },
    watch: {
      config: {
        handler (config) {
          this.$emit('update:requestConfig', config)
        },
        deep: true
      }
    }
  };
</script>

<style scoped>

</style>
