import { normalizeSwagger2p0 } from './normalize/swagger';

/**
 * Normalize the API spec to a common Swagger 2.0 spec
 *
 * @param data
 * @return {*}
 */
export const normalize = data => {
  if (data.hasOwnProperty('swagger') && data.swagger === '2.0') {
    return normalizeSwagger2p0(data);
  }
  return null;
};
