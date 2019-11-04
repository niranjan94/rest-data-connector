import { forOwn, keys, sortBy } from 'lodash-es';
import urlJoin from 'url-join';

/**
 * Get the shared sub-string from an array of strings
 *
 * @param array
 * @return {string}
 */
export const sharedStart = array => {
  let A = array.concat().sort(),
      a1 = A[0], a2 = A[A.length - 1], L = a1.length, i = 0;
  while (i < L && a1.charAt(i) === a2.charAt(i)) i++;
  return a1.substring(0, i);
};

/**
 * Normalize and understand the swagger 2.0 spec
 *
 * @param data
 * @return {{endpoints: *, baseUrl: *}}
 */
export const normalizeSwagger2p0 = data => {
  let endpoints = [];
  const base = sharedStart(keys(data.paths));
  forOwn(data.paths, (value, key) => {
    if (!value.hasOwnProperty('get')) {
      return;
    }
    const get = value.get;
    get.parameters = (get.parameters || []).map(parameter => {
      parameter.value = parameter.default || '';
      switch (parameter.type) {
        case 'integer':
        case 'float':
          parameter.htmlType = 'number';
          break;
        default:
          parameter.htmlType = 'text';
      }
      return parameter;
    });
    let endpoint = key.replace(base, '');
    if (endpoint.trim() === '') {
      endpoint = '/';
    }
    endpoints.push({
      endpoint,
      base,
      parameters : get.parameters,
      summary    : get.summary,
      id         : get.operationId
    });
  });

  const scheme = data.schemes.includes('https') ? 'https' : 'http';
  if (!data.basePath) {
    data.basePath = base
  }
  return {
    rawSpec   : data,
    endpoints : sortBy(endpoints, ['endpoint']),
    baseUrl   : urlJoin(`${scheme}://${data.host}`, data.basePath, base)
  };
};
