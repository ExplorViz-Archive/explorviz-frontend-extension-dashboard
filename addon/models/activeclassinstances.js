import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  landscapeID: DS.attr('string'),
	className: DS.attr('string'),
	instances: DS.attr('number')
});
