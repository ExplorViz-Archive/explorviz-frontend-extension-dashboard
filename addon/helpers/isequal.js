import { helper } from '@ember/component/helper';

export function isequal(params/*, hash*/) {
  if(params[0] === params[1]){
    return true;
  }
  return false;
}

export default helper(isequal);
