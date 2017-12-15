import { normalizeSwagger2p0 } from "./normalize/swagger";


export const normalize = (data) => {
  if (data.hasOwnProperty('swagger') && data.swagger === '2.0') {
    return normalizeSwagger2p0(data);
  }
  return null;
};
