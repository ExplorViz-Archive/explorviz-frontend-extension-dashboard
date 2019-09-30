import DS from 'ember-data';
const {
  Model
} = DS;

/*
This is the model for the aggregated respone time widget. It has the same properties like the model
in the backend. This model is needed for ember, that ember can automatically parse the json into a
readable model.
*/
export default Model.extend({
  timestampLandscape: DS.attr('number'),
  totalRequests: DS.attr('number'),
  averageResponseTime: DS.attr('number'),
  sourceClazzFullName: DS.attr('string'),
  targetClazzFullName: DS.attr('string')
});
