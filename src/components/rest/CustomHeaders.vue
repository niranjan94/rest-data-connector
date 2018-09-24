<template>
  <div style="margin-top: 4px;">
    <b-form-group label="Custom Headers:" label-for="headers" label-size="sm"> </b-form-group>
    <b-row  v-for="(header, index) in headers" :key="index" style="margin-bottom: 8px;">
      <b-col md="4">
        <b-input-group prepend="Name" size="sm">
          <b-form-input type="text"
                        size="sm"
                        v-model.trim="header.name"
                        required>
          </b-form-input>
        </b-input-group>

      </b-col>
      <b-col md="7">
        <b-input-group prepend="Value" size="sm">
          <b-form-input type="text"
                        size="sm"
                        v-model.trim="header.value"
                        required>
          </b-form-input>
        </b-input-group>
      </b-col>
      <b-col md="1">
        <b-button size="sm" variant="danger" @click="remove(index)" style="width: 100%">
          Remove
        </b-button>
      </b-col>
    </b-row>

    <b-form @submit="onSubmit">
      <b-row>
        <b-col md="4">
          <b-input-group prepend="Name" size="sm">
            <b-form-input type="text"
                          size="sm"
                          v-model.trim="tempName"
                          required>
            </b-form-input>
          </b-input-group>

        </b-col>
        <b-col md="7">
          <b-input-group prepend="Value" size="sm">


            <b-form-input type="text"
                          size="sm"
                          v-model.trim="tempValue"
                          required>
            </b-form-input>
          </b-input-group>
        </b-col>
        <b-col md="1">
          <b-button type="submit" size="sm" variant="success" style="width: 100%">
            Add
          </b-button>
        </b-col>
      </b-row>
    </b-form>
  </div>
</template>

<script>
  import { cloneDeep } from 'lodash-es';

  export default {
    name  : 'CustomHeaders',
    props : ['requestHeaders'],
    data() {
      return {
        headers   : cloneDeep(this.requestHeaders || []),
        tempValue : '',
        tempName  : ''
      };
    },
    methods: {
      onSubmit(e) {
        e.preventDefault();
        this.headers.push({
          name  : this.tempName,
          value : this.tempValue
        });
        this.tempName = '';
        this.tempValue = '';
      },
      remove(index) {
        this.headers.splice(index, 1);
      }
    },
    watch: {
      headers: {
        handler(headers) {
          this.$emit('update:requestHeaders', headers);
        },
        deep: true
      },
      requestHeaders: {
        handler(requestHeaders) {
          this.headers = requestHeaders;
        },
        deep: true
      }
    }
  };
</script>

<style scoped>

</style>
