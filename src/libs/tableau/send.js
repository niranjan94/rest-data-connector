import { camelCase } from 'lodash-es';

export const sendToTableau = (data, connectorName, cleanedPath) => {
  let dataKey = camelCase(cleanedPath || 'dataValue');
  if (!dataKey || dataKey === '') {
    dataKey = 'dataValue';
  }
  tableau.connectionData = JSON.stringify({ data, connectorName, dataKey });
  tableau.connectionName = connectorName;
  tableau.submit();
};
