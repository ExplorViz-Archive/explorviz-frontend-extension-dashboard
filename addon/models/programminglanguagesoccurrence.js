import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  timestamp: DS.attr('number'),
  programminglanguage: DS.attr('string'),
  occurs: DS.attr('number')
});
