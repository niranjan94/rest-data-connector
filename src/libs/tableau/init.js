import { json } from 'generate-schema';
import { forOwn, camelCase, mapValues } from 'lodash-es';

const schemaMap = {
  number: tableau.dataTypeEnum.float,
  string: tableau.dataTypeEnum.string,
  boolean: tableau.dataTypeEnum.bool
};

const getNativeOrSerialized = (object, key, propsSchema) => {
  return schemaMap.hasOwnProperty(propsSchema[key].type) ? object : JSON.stringify(object);
};

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
  }
};

export const initTableau = () => {
  const connector = tableau.makeConnector();

  connector.getSchema = function (callback) {
    const {
      connectorName, propsSchema, schema, dataKey
    } = getInitData();
    let columns = [];
    if (propsSchema) {
      forOwn(propsSchema, (value, key) => {
        columns.push({
          id: key,
          dataType: schemaMap[value.type] || tableau.dataTypeEnum.string
        });
      });
    } else {
      columns.push({
        id: dataKey,
        dataType: schemaMap[schema.type] || tableau.dataTypeEnum.string
      });
    }
    callback([
      {
        id: camelCase(connectorName),
        alias: connectorName,
        columns
      }
    ]);
  };

  connector.getData = function (table, callback) {
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
              row[key] = getNativeOrSerialized(value, key, propsSchema)
            });
          } else {
            row[dataKey] = getNativeOrSerialized(object, dataKey, propsSchema)
          }
          tableData.push(row);
        }
      } else {
        tableData.push(mapValues(data, (value, key) => {
          return getNativeOrSerialized(value, key, propsSchema)
        }))
      }
    } else {
      const obj = {};
      obj[dataKey] = data;
      tableData.push(obj)
    }
    table.appendRows(tableData);
    callback();
  };

  tableau.registerConnector(connector);
};
