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
                    :description="pathDescription + ' <br> Preview the data below before proceeding.'">


        <b-input-group size="sm">
          <b-form-input id="pathToExport"
                        type="text"
                        v-model="pathToExport">
          </b-form-input>
          <b-input-group-append>
            <b-btn :pressed="useJsonPath" variant="info" v-on:click="onPathTypeToggle">JSON Path</b-btn>
            <b-btn :pressed="!useJsonPath" variant="info" v-on:click="onPathTypeToggle">Dot-notation</b-btn>
          </b-input-group-append>
        </b-input-group>

      </b-form-group>

      <b-form-group label="Export options" label-size="sm" label-for="exportOptions">
        <b-form-checkbox-group id="exportOptions" name="exportOptions" v-model="exportOptions">
          <b-form-checkbox value="flattenObject">Flatten Object</b-form-checkbox>
        </b-form-checkbox-group>
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
  import { isEmpty, keys, get } from 'lodash-es';
  import { sendToTableau } from '../../utils/tableau/send';
  import { xml2js } from 'xml-js';
  import { collapseKey, collapseObject } from '../../utils/parsing';
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
        useJsonPath: true,
        connectorName,
        parsingOptions: ['ignoreAttributes', 'collapseText'],
        exportOptions: []
      };
    },
    methods: {
      onOkay(e) {
        e.preventDefault();
        let cleanedPath = this.pathToExport.trim();
        if (!this.useJsonPath) {
          cleanedPath = cleanedPath.replace(/^root\./, '');
        }

        if(!this.dataToExport) {
          this.$notify({
            type: 'error',
            title: 'Invalid data path',
            text: `<code>${this.pathToExport}</code>&nbsp;&nbsp;is invalid. Try again.`
          });
          return;
        }
        sendToTableau(this.dataToExport, this.connectorName, cleanedPath);
      },
      onPathTypeToggle() {
        this.useJsonPath = !this.useJsonPath;
      }
    },
    computed: {
      pathDescription() {
        return this.useJsonPath ? 'Enter the <a href=\'http://goessner.net/articles/JsonPath/\'>JSONPath</a> to load into Tableau (eg. <code>$.data</code>, <code>$.meta</code>). Leave blank to load everything.': 'Enter the path to load into Tableau (eg. <code>root.data</code>, <code>root.meta</code>, <code>root</code>)';
      },
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
        let cleanedPath = this.pathToExport.trim();
        if (!this.useJsonPath) {
          cleanedPath = cleanedPath.replace(/^root\./, '');
        }
        let data = this.parsedData;
        if(cleanedPath !== '') {
          if (this.useJsonPath) {
            data = jp.query(data, cleanedPath);
          } else {
            data = get(data, cleanedPath);
          }
        }

        if (this.exportOptions.includes('flattenObject')) {
          data = collapseObject(data);
        }

        return data;
      },
      inTableau() {
        return this.$store.state.inTableau;
      },
      treeViewOptions() {
        if(!this.parsedData || keys(this.parsedData) > 10 || this.parsedData.length > 10) {
          return {
            maxDepth: 0
          };
        }
        return {
          maxDepth: 1
        };
      },
      dataToExportTreeViewOptions() {
        if(!this.dataToExport || keys(this.dataToExport) > 10 || this.dataToExport.length > 10) {
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
