import Vue from 'vue';

const methodsWithBody = ['post', 'put', 'patch'];

export const makeRequest = (method, url, parameters) => {
  parameters = parameters || [];
  return new Promise((resolve, reject) => {
    const options = {
      params: {}
    };
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
      responsePromise = Vue.http[method](url, null, options);
    } else {
      responsePromise = Vue.http[method](url, options);
    }
    responsePromise.then(resolve, reject);
  });
};
