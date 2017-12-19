import { normalizeSwagger2p0 } from './normalize/swagger';
import { convertOpenApiToSwagger } from './normalize/converters/openapi3_to_swagger2';
import { isPlainObject, isString } from 'lodash-es';
import { safeLoad } from 'js-yaml';

/**
 * Normalize the API spec to a common Swagger 2.0 spec
 *
 * @param data
 * @param sourceType
 * @return {*}
 */
export const normalize = async(data, sourceType) => {
  if (data.hasOwnProperty('swagger') && data.swagger === '2.0') {
    return normalizeSwagger2p0(data);
  }
  if (sourceType === 'openapi_3') {
    return normalizeSwagger2p0(convertOpenApiToSwagger(data));
  }
  return null;
};


/**
 * Get an object representation of a body that could be either object, string (json/yaml)
 *
 * @param body
 * @return {*}
 */
export const getObjectFromBody = body => {
  if (!body) {
    return null;
  }
  if (isPlainObject(body)) {
    return body;
  }
  if (isString(body)) {
    let parsedBody;
    try {
      parsedBody = safeLoad(body);
    } catch (ignored) {
      try {
        parsedBody = JSON.parse(body);
      } catch (ignored) { /* ignored */  }
    }
    return parsedBody;
  }
  return null;
};
