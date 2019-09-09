import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  timestampLandscape:  DS.attr('number'),
  amount: DS.attr('number')
});
