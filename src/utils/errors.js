import { isArray, isNumber, isObjectLike, isString, isEmpty } from 'lodash-es';

/**
 * A recursive method to parse and retrieve an error string from a BE response
 *
 * Usage: import { getErrorMessage } from 'canopy-fresh/utils/errors';
 *
 * @param input {any}
 * @param defaultError {string}
 * @return {string}
 */
export const getErrorMessage = (input, defaultError = null) => {
  if (!input || isEmpty(input)) {
    return defaultError;
  }
  if (isString(input) || isNumber(input)) {
    let error = input;
    try {
      error = JSON.parse(input);
    } catch (ignored) { /* ignored */
    }
    if (isString(error) || isNumber(isNumber)) {
      return error;
    }
    return getErrorMessage(error);
  }

  if (!isArray(input) && isObjectLike(input)) {
    input = input.error ? input.error : (input.message ? input.message : input);
  } else if (isArray(input)) {
    return input.join('. ');
  }

  return getErrorMessage(input);
};
