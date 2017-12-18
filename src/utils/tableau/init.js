import { json } from 'generate-schema';
import { forOwn, camelCase, mapValues } from 'lodash-es';
import store from '../../store';

/**
 * Map JSON schema types to Tableau data types
 * @type {{number: string, string: string, boolean: string}}
 */
const schemaMap = {
  number  : tableau.dataTypeEnum.float,
  string  : tableau.dataTypeEnum.string,
  boolean : tableau.dataTypeEnum.bool
};

/**
 * Get the property directly if supported by Tableau else serialize it to string
 *
 * @param object
 * @param key
 * @param propsSchema
 * @return {string}
 */
const getNativeOrSerialized = (object, key, propsSchema) => {
  return schemaMap.hasOwnProperty(propsSchema[key].type) ? object : JSON.stringify(object);
};

/**
 * Parse the connection data and get the init data
 *
 * @return {{connectorName, data, schema: output, propsSchema: {include: {type: string, items: {type: string}, minItems: number, uniqueItems: boolean}, exclude: {type: string, items: {type: string}, uniqueItems: boolean}, replace: {type: string, items: {type: string}, minItems: number, maxItems: number}}|items.properties|{include, exclude, replace}|{paths, patterns}|{}, dataKey}}
 */
const getInitData = () => {
  const { connectorName, data, dataKey } = JSON.parse(tableau.connectionData);
  const schema = json(connectorName, data);
  const fallbackObject = {};
  fallbackObject[dataKey] = schema.items;
  const propsSchema = schema.type === 'array'
    ? (schema.items.properties || fallbackObject)
    : schema.properties;
  return {
    connectorName, data, schema, propsSchema, dataKey
  };
};

/**
 * Initialize Tableau connector
 */
export const initTableau = () => {
  const connector = tableau.makeConnector();

  connector.init = function(callback) {
    store.commit('SET_IN_TABLEAU');
    window.inTableau = true;
    callback();
  };

  /**
   * Get the Tableau schema based on the data retrieved
   *
   * @param callback
   */
  connector.getSchema = function(callback) {
    const {
      connectorName, propsSchema, schema, dataKey
    } = getInitData();
    let columns = [];
    if (propsSchema) {
      forOwn(propsSchema, (value, key) => {
        columns.push({
          id       : key,
          dataType : schemaMap[value.type] || tableau.dataTypeEnum.string
        });
      });
    } else {
      columns.push({
        id       : dataKey,
        dataType : schemaMap[schema.type] || tableau.dataTypeEnum.string
      });
    }
    callback([
      {
        id    : camelCase(connectorName),
        alias : connectorName,
        columns
      }
    ]);
  };

  /**
   * Parse the request data into table rows.
   *
   * @param table
   * @param callback
   */
  connector.getData = function(table, callback) {
    const {
      data, schema, propsSchema, dataKey
    } = getInitData();

    let tableData = [];
    if (propsSchema) {
      if (schema.type === 'array') {
        for (const object of data) {
          let row = {};
          if (schema.items.type === 'object') {
            forOwn(object, (value, key) => {
              row[key] = getNativeOrSerialized(value, key, propsSchema);
            });
          } else {
            row[dataKey] = getNativeOrSerialized(object, dataKey, propsSchema);
          }
          tableData.push(row);
        }
      } else {
        tableData.push(mapValues(data, (value, key) => {
          return getNativeOrSerialized(value, key, propsSchema);
        }));
      }
    } else {
      const obj = {};
      obj[dataKey] = data;
      tableData.push(obj);
    }
    table.appendRows(tableData);
    callback();
  };

  tableau.registerConnector(connector);

  setTimeout(() => {
    if (!window.inTableau) {
      store.commit('SET_NOT_IN_TABLEAU');
    }
  }, 100);
};
