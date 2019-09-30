import {
  helper
} from '@ember/component/helper';

/*
This is a helper for templates. It can display a operation time given in nanoseconds
into a readable time (seconds, milliseconds, microseconds or nanoseconds)
*/
export function displayOperationTime(params /*, hash*/ ) {

  return displayNumber(params[0]);
}

function displayNumber(num) {
  var len = num.toString().length;

  //seconds
  if (len >= 10) {
    num = num / 1000000000;
    return num.toFixed(2) + "s";
  }

  //milliseconds
  if (len >= 7) {
    num = num / 1000000;
    return num.toFixed(2) + ' ms';
  }

  //microseconds
  if (len >= 4) {
    num = num / 1000;
    return num.toFixed(2) + ' μs';
  }

  return num + ' ns';
}

export default helper(displayOperationTime);
