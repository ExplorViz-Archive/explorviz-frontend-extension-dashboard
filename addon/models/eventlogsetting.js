import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  instanceID: DS.attr('number'),
  entries: DS.attr('number'),
});
