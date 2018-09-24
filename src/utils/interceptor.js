import Vue from 'vue';
import { isFunction, isEmpty } from 'lodash-es';
import urlJoin from 'url-join';

/**
 * Modify a request to match a specific request config
 *
 * @param requestConfig
 * @param request
 */
export const modifyRequest = (requestConfig, request) => {
  if (requestConfig.baseUrl && requestConfig.baseUrl.trim() !== '' && !request.url.startsWith('http')) {
    request.url = urlJoin(requestConfig.baseUrl.trim(), request.url.trim());
  }

  if (requestConfig.headers) {
    for (const header of requestConfig.headers) {
      if (header.name && !isEmpty(header.name.trim())) {
        request.headers.set(header.name, header.value);
      }
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
    case 'expanded_token': {
        let headerValue = `Token token="${requestConfig.password}"`;
        if (requestConfig.username && requestConfig.username.trim() !== '') {
            headerValue = `Token token="${requestConfig.password.trim()}", username="${requestConfig.username.trim()}"`;
        }
        request.headers.set('Authorization', headerValue);
        break;
    }
  }
};

/**
 * Set a Vue resource interceptor that adds the set request config globally to all requests
 *
 * @param requestConfig
 */
export const setInterceptor = requestConfig => {
  if (requestConfig) {
    localStorage.setItem('lastRequestConfig', JSON.stringify(requestConfig));
  }
  requestConfig = requestConfig || {};
  Vue.http.interceptor.before = function(request, next) {
    if (isFunction(request.before)) {
      request.before.call(this, request);
    } else {
      modifyRequest(requestConfig, request);
    }
    next();
  };
};
