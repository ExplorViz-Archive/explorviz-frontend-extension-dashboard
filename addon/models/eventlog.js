import DS from 'ember-data';
const {
  Model
} = DS;

export default Model.extend({
  timestampEvent: DS.attr('number'),
  eventType: DS.attr('string'),
  eventMessage: DS.attr('string')
});
