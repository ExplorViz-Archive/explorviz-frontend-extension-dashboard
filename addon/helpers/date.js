import {
  helper
} from '@ember/component/helper';

export function date(params /*, hash*/ ) {
  let time = params / 1000;
  let formatted = moment.unix(time).format("MM/DD/YY @ h:mm:ss");
  return formatted;
}

export default helper(date);
