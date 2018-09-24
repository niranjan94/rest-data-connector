<template>
  <div style="margin-top: 12px;">
    <b-form-group label="Body Type:"
                  label-for="bodyType"
                  label-size="sm">
      <b-form-radio-group
        buttons
        button-variant="outline-secondary"
        size="sm"
        id="bodyType" v-model="body.type" :options="filteredBodyTypes"/>
    </b-form-group>
    <b-form-group v-if="body.type === 'raw'"
                  label="Raw Body:"
                  label-size="sm"
                  label-for="rawBody">
      <b-form-textarea id="rawBody"
                       size="sm"
                       v-model="body.value"
                       :rows="5">
      </b-form-textarea>
    </b-form-group>

    <div v-if="this.body.type === 'query' || this.body.type === 'form_data'">
      <b-form-group :label="this.body.type === 'query' ? 'Query Parameters:' : 'Form data key-value pairs:'" label-for="headers" label-size="sm"> </b-form-group>
      <b-row  v-for="(item, index) in body.value" :key="index" style="margin-bottom: 8px;">
        <b-col md="4">
          <b-input-group prepend="Name" size="sm">
            <b-form-input type="text"
                          size="sm"
                          v-model.trim="item.name"
                          required>
            </b-form-input>
          </b-input-group>

        </b-col>
        <b-col md="7">
          <b-input-group prepend="Value" size="sm">
            <b-form-input type="text"
                          size="sm"
                          v-model.trim="item.value"
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
  </div>
</template>

<script>
  import { cloneDeep } from 'lodash-es';

  export default {
    name  : 'BodyEditor',
    props : ['requestBody', 'method'],
    data() {
      return {
        body      : cloneDeep(this.requestBody || { value: null, type: 'none' }),
        bodyTypes : [
          { text: 'None', value: 'none' },
          { text: 'Query Params', value: 'query' },
          { text: 'Form data', value: 'form_data' },
          { text: 'Raw', value: 'raw' }
        ],
        tempValue : '',
        tempName  : ''
      };
    },
    methods: {
      onSubmit(e) {
        e.preventDefault();
        this.body.value.push({
          name  : this.tempName,
          value : this.tempValue
        });
        this.tempName = '';
        this.tempValue = '';
      },
      remove(index) {
        this.body.value.splice(index, 1);
      }
    },
    computed: {
      filteredBodyTypes() {
        let allowed = ['query', 'none'];
        if (['POST', 'PATCH', 'PUT'].includes(this.method)) {
          allowed.push('form_data', 'raw');
        }
        return this.bodyTypes.filter(type => allowed.includes(type.value));
      }
    },
    watch: {
      body: {
        handler(body) {
          this.$emit('update:requestBody', body);
        },
        deep: true
      },
      requestBody: {
        handler(requestBody) {
          this.body = requestBody;
        },
        deep: true
      },
      method() {
        this.body.type = 'none';
      },
      'body.type'(type) {
        switch (type) {
          case 'query':
          case 'form_data':
            return this.body.value = [];
          default:
            return this.body.value = null;
        }
      }
    }
  };
</script>

<style scoped>

</style>
