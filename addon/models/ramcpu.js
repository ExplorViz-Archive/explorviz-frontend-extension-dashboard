import DS from 'ember-data';
const {
  Model
} = DS;

/*
This is the model for the ram and cpu widget. It has the same properties like the model
in the backend. This model is needed for ember, that ember can automatically parse the json into a
readable model.
*/
export default Model.extend({
  timestamp: DS.attr('number'),
  nodeName: DS.attr('string'),
  cpuUtilization: DS.attr('number'),
  freeRam: DS.attr('number'),
  usedRam: DS.attr('number')

});
