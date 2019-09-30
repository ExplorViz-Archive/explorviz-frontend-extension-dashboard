import {
  helper
} from '@ember/component/helper';

/*
This is a helper for the templates. it can translate a timestamp to a valid readable date.
*/
export function date(params) {
  //if the timestamp is invalid, like -1, then return the string "-"
  if (params == -1) {
    return "-";
  }

  let time = params / 1000;
  let formatted = moment.unix(time).format("MM/DD/YY - h:mm:ss");
  return formatted;
}

export default helper(date);
