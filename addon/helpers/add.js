import {
  helper
} from '@ember/component/helper';

/*
This is a helper for the templates. is can add two numbers together
*/
export function add(params) {
  return params[0] + params[1];
}

export default helper(add);
