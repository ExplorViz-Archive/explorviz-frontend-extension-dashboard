import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  userID: DS.attr('string'),
  timestamp: DS.attr('number'),
  widgetName: DS.attr('string'),
  instanceID: DS.attr('number'),
  orderID: DS.attr('number')

});
