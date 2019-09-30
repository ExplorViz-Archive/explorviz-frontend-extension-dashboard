import {
  helper
} from '@ember/component/helper';

/*
This is a helper for templates. It can check if the two params are equal and return a boolean
*/
export function isequal(params) {
  if (params[0] === params[1]) {
    return true;
  }
  return false;
}

export default helper(isequal);
