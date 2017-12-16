import Vue from 'vue';
import { isFunction } from 'lodash-es';
import urlJoin from 'url-join';

export const setInterceptor = (requestConfig) => {
  requestConfig = requestConfig || {};
  console.log('requestConfig', requestConfig);
  Vue.http.interceptor.before = function(request, next) {
    console.log('requestConfig', requestConfig, request);
    if (isFunction(request.before)) {
      request.before.call(this, request);
    } else {
      if (requestConfig.baseUrl && requestConfig.baseUrl.trim() !== '' && !request.url.startsWith('http')) {
        request.url = urlJoin(requestConfig.baseUrl.trim(), request.url.trim());
      }

      if (requestConfig.headers) {
        for (const header of requestConfig.headers) {
          request.headers.set(header.name, header.value);
        }
      }

      switch (requestConfig.authorizationMode) {
        case 'basic':
          request.headers.set(
            'Authorization',
            'Basic ' + btoa(requestConfig.username.trim() + ':' + requestConfig.password.trim())
          );
          break;
        case 'bearer':
          request.headers.set('Authorization', `Bearer ${requestConfig.token.trim()}`);
          break;
        case 'token':
          request.headers.set('Authorization', `Token ${requestConfig.token.trim()}`);
          break;
        case 'expanded_token':
          let headerValue = `Token token="${requestConfig.password}"`;
          if (requestConfig.username && requestConfig.username.trim() !== '') {
            headerValue = `Token token="${requestConfig.password.trim()}", username="${requestConfig.username.trim()}"`
          }
          request.headers.set('Authorization', headerValue);
          break;
      }
    }
    next();
  };
};
