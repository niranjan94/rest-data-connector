import { transpose, untranspose } from 'dataobject-parser';
import { mapKeys } from 'lodash-es';

export const expandObject = (object) => {
  return transpose(object)._data;
};

export const collapseObject = (object) => {
  return untranspose(object);
};

export const collapseKey = (object, key) => {
  object = collapseObject(object);
  const keyRegex = new RegExp(`\\.${key}$`);
  object = mapKeys(object, (value, _key) => {
    return _key.replace(keyRegex, '');
  });
  return expandObject(object);
};
