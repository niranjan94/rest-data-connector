<template>
  <b-modal size="lg"
           v-model="openDataView"
           @ok="onOkay"
           title="Export Data"
           :ok-disabled="!inTableau"
           :ok-title="inTableau ? 'Load into Tableau' : 'Run connector from tableau to load'">
    <code>{{result.definition.endpoint}}</code> - <span class="text-muted">{{result.definition.summary}}</span>
    <hr>
    <tree-view :data="result.data" :options="options"/>
    <hr>
    <b-form @submit="onOkay">
      <b-form-group label="Path to export:"
                    label-for="pathToExport"
                    label-size="sm"
                    description="Enter the path to load into Tableau (eg. <code>root.data</code>, <code>root.meta</code>, <code>root</code>, <code>root.0</code>)">
        <b-form-input id="pathToExport"
                      type="text"
                      size="sm"
                      v-model="pathToExport">
        </b-form-input>
      </b-form-group>
      <b-form-group label="Name for the connector:"
                    label-for="connectorName"
                    label-size="sm">
        <b-form-input id="connectorName"
                      type="text"
                      size="sm"
                      v-model="connectorName">
        </b-form-input>
      </b-form-group>

    </b-form>
  </b-modal>

</template>

<script>
  import { keys, get } from 'lodash-es';
  import { sendToTableau } from '../../utils/tableau/send';

  export default {
    name  : 'DataView',
    props : ['openDataView', 'result'],
    data() {
      return {
        pathToExport  : '',
        connectorName : this.result.definition.summary
      };
    },
    methods: {
      onOkay(e) {
        e.preventDefault();
        const cleanedPath = this.pathToExport.trim().replace(/^root\./, '');
        let dataToExport = this.result.data;
        if (cleanedPath !== '' && cleanedPath !== 'root') {
          dataToExport = get(dataToExport, cleanedPath);
        }
        if (!dataToExport) {
          this.$notify({
            type  : 'error',
            title : 'Invalid data path',
            text  : `<code>${this.pathToExport}</code>&nbsp;&nbsp;is invalid. Try again.`
          });
          return;
        }
        sendToTableau(dataToExport, this.connectorName, cleanedPath);
      }
    },
    computed: {
      inTableau() {
        return this.$store.state.inTableau;
      },
      options() {
        if (keys(this.result.data) > 10 || this.result.data.length > 10) {
          return {
            maxDepth: 0
          };
        }
        return {
          maxDepth: 1
        };
      }
    },
    watch: {}
  };
</script>

<style scoped>

</style>
