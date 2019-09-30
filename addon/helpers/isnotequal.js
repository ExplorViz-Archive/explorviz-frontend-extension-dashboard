import {
  helper
} from '@ember/component/helper';

/*
This is a helper for the templates. It can check if two parameters are not equal and return a boolean.
*/
export function isnotequal(params) {
  if (params[0] === params[1]) {
    return false;
  }
  return true;
}

export default helper(isnotequal);
