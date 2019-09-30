import DS from 'ember-data';
const {
  Model
} = DS;

/*
This is the model for the total overview widget. It has the same properties like the model
in the backend. This model is needed for ember, that ember can automatically parse the json into a
readable model.
*/
export default Model.extend({
  timestamp: DS.attr('string'),
  numberOfSystems: DS.attr('number'),
  numberOfNodes: DS.attr('number'),
  numberOfApplications: DS.attr('number')
});
