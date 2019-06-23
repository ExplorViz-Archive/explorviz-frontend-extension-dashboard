import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
	name: DS.attr('string'),
	numberOfSystems: DS.attr('number'),
	numberOfNodes: DS.attr('number'),
	numberOfApplications: DS.attr('number')
});
