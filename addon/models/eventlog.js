import DS from 'ember-data';
const {
  Model
} = DS;

export default Model.extend({
  timestampLandscape:  DS.attr('number'),
  timestampEvent: DS.attr('number'),
  eventType: DS.attr('string'),
  eventMessage: DS.attr('string')
});
