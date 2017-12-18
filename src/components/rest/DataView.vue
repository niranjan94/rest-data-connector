<template>
  <b-modal size="lg"
           v-model="isModelOpen"
           @ok="onOkay"
           title="Export Data"
           :ok-disabled="!inTableau"
           :ok-title="inTableau ? 'Load into Tableau' : 'Run connector from tableau to load'">
    <div v-if="result.definition">
      <code>{{result.definition.endpoint}}</code> - <span class="text-muted">{{result.definition.summary}}</span>
      <hr>
    </div>
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
  import { get, keys, isEmpty } from 'lodash-es';
  import { sendToTableau } from '../../utils/tableau/send';

  export default {
    name  : 'DataView',
    props : ['openDataView', 'result'],
    data() {
      let connectorName = (this.result.definition ? this.result.definition.summary : this.result.url);
      if (isEmpty(connectorName)) {
        connectorName = this.$uuid.v4();
      }
      return {
        isModelOpen  : !!this.openDataView,
        pathToExport : '',
        connectorName
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
    watch: {
      isModelOpen(isModelOpen) {
        this.$emit('update:openDataView', isModelOpen);
      },
      openDataView(openDataView) {
        this.isModelOpen = !!openDataView;
      }
    }
  };
</script>

<style scoped>

</style>
