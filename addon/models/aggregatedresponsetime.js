import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  timestampLandscape:  DS.attr('number'),
  totalRequests: DS.attr('number'),
  averageResponseTime: DS.attr('number'),
  sourceClazzFullName: DS.attr('string'),
  targetClazzFullName: DS.attr('string'),

});
