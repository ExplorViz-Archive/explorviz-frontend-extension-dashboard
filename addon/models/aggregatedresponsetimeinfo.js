import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  timestampLandscape:  DS.attr('number'),
  entrys: DS.attr('number')
});
