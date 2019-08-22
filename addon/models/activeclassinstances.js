import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  timestampLandscape: DS.attr('number'),
	className: DS.attr('string'),
	instances: DS.attr('number')
});
