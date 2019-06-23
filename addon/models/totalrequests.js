import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  landscapeID: DS.attr('string'),
	totalRequests: DS.attr('number'),
	timestamp: DS.attr('number')
});
