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

    <b-form @submit="onOkay">

      <b-form-group v-if="result.contentType === 'application/xml'" label="XML Parsing options" label-size="sm" label-for="parsingOptions">
        <b-form-checkbox-group id="parsingOptions" name="parsingOptions" v-model="parsingOptions">
          <b-form-checkbox value="ignoreAttributes">Skip attributes</b-form-checkbox>
          <b-form-checkbox value="collapseText">Collapse Text</b-form-checkbox>
        </b-form-checkbox-group>
      </b-form-group>

      <tree-view :data="parsedData" :options="treeViewOptions"/>
      <hr>

      <b-form-group label="Path to export:"
                    label-for="pathToExport"
                    label-size="sm"
                    description="Enter the <a href='http://goessner.net/articles/JsonPath/'>JSONPath</a> to load into Tableau (eg. <code>$.data</code>, <code>$.meta</code>). Leave blank to load everything. <br> Preview the data below before proceeding.">
        <b-form-input id="pathToExport"
                      type="text"
                      size="sm"
                      v-model="pathToExport">
        </b-form-input>
      </b-form-group>


      <tree-view :data="dataToExport" :options="dataToExportTreeViewOptions"/>

      <hr>

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
  import { isEmpty, keys } from 'lodash-es';
  import { sendToTableau } from '../../utils/tableau/send';
  import { xml2js } from 'xml-js';
  import { collapseKey } from '../../utils/parsing';
  import jp from 'jsonpath';

  export default {
    name: 'DataView',
    props: ['openDataView', 'result'],
    data() {
      let connectorName = (this.result.definition ? this.result.definition.summary : this.result.url);
      if(isEmpty(connectorName)) {
        connectorName = this.$uuid.v4();
      }
      return {
        isModelOpen: !!this.openDataView,
        pathToExport: '',
        connectorName,
        parsingOptions: ['ignoreAttributes', 'collapseText']
      };
    },
    methods: {
      onOkay(e) {
        e.preventDefault();
        const cleanedPath = this.pathToExport.trim();
        if(!this.dataToExport) {
          this.$notify({
            type: 'error',
            title: 'Invalid data path',
            text: `<code>${this.pathToExport}</code>&nbsp;&nbsp;is invalid. Try again.`
          });
          return;
        }
        sendToTableau(this.dataToExport, this.connectorName, cleanedPath);
      }
    },
    computed: {
      parsedData() {
        switch (this.result.contentType) {
          case 'application/json':
            return this.result.data;
          case 'application/xml': {
            let object = xml2js(this.result.data, {
              compact           : true,
              ignoreCdata       : true,
              ignoreDoctype     : true,
              ignoreInstruction : true,
              ignoreAttributes : this.parsingOptions.includes('ignoreAttributes'),
              ignoreDeclaration : true,
              nativeType        : true,
              trim              : true,
            });
            if (this.parsingOptions.includes('collapseText')) {
              object = collapseKey(object, '_text');
            }
            return object;
          }
        }
        return {};
      },
      dataToExport() {
        const cleanedPath = this.pathToExport.trim();
        let data = this.parsedData;
        if(cleanedPath !== '') {
          data = jp.query(data, cleanedPath);
        }
        return data;
      },
      inTableau() {
        return this.$store.state.inTableau;
      },
      treeViewOptions() {
        if(keys(this.parsedData) > 10 || this.parsedData.length > 10) {
          return {
            maxDepth: 0
          };
        }
        return {
          maxDepth: 1
        };
      },
      dataToExportTreeViewOptions() {
        if(keys(this.dataToExport) > 10 || this.dataToExport.length > 10) {
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
