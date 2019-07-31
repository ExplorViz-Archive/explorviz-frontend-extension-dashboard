import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  timestampLandscape: DS.attr('number'),
  amountEvents: DS.attr('number'),
  eventlogs: DS.hasMany('eventlog')
});
