import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({

  nodeName: DS.attr('string'),
  instanceID: DS.attr('number')
});
