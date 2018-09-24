import Vue from 'vue';

const methodsWithBody = ['post', 'put', 'patch'];

/**
 * Make a request to the specific URL with the given parameters
 *
 * @param method
 * @param url
 * @param parameters
 * @param payload
 * @param options
 * @return {Promise}
 */
export const makeRequest = (method, url, parameters, payload, options) => {
  method = method.toLowerCase();
  parameters = parameters || [];
  options = options || {};
  if (!options.hasOwnProperty('params')) {
    options.params = {};
  }
  return new Promise((resolve, reject) => {
    for (const parameter of parameters) {
      if (parameter.value === '') {
        continue;
      }
      switch (parameter.in) {
        case 'path':
          url = url.replace(`{${parameter.name}}`, parameter.value);
          break;
        case 'query':
          options.params[parameter.name] = parameter.value;
          break;
      }
    }
    let responsePromise;
    if (methodsWithBody.includes(method)) {
      responsePromise = Vue.http[method](url, payload, options);
    } else {
      responsePromise = Vue.http[method](url, options);
    }
    responsePromise.then(resolve, reject);
  });
};
