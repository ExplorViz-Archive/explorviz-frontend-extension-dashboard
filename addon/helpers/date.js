import {
  helper
} from '@ember/component/helper';

export function date(params /*, hash*/ ) {
  //falls kein gültiger timestamp angegeben ist, nämlich -1 gebe - zurück als Darstellung
  if(params == -1){
    return "-";
  }

  let time = params / 1000;
  let formatted = moment.unix(time).format("MM/DD/YY - h:mm:ss");
  return formatted;
}

export default helper(date);
