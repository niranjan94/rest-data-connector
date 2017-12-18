import { camelCase } from 'lodash-es';

/**
 * Set the connector data and send the connector info to Tableau
 *
 * @param data
 * @param connectorName
 * @param cleanedPath
 */
export const sendToTableau = (data, connectorName, cleanedPath) => {
  let dataKey = camelCase(cleanedPath || 'dataValue');
  if (!dataKey || dataKey === '') {
    dataKey = 'dataValue';
  }
  tableau.connectionData = JSON.stringify({ data, connectorName, dataKey });
  tableau.connectionName = connectorName;
  tableau.submit();
};
