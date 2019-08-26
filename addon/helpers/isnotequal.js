import { helper } from '@ember/component/helper';

export function isnotequal(params/*, hash*/) {
  if(params[0] === params[1]){
    return false;
  }
  return true;
}

export default helper(isnotequal);
