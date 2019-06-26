import DS from 'ember-data';
const {
  Model
} = DS;

export default Model.extend({
  timestamp: DS.attr('number'),
  nodeName: DS.attr('string'),
  cpuUtilization: DS.attr('number'),
  freeRam: DS.attr('number'),
  usedRam: DS.attr('number')




});
