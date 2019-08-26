import DS from 'ember-data';
import { underscore } from '@ember/string';

export default DS.JSONAPIAdapter.extend({
	host: 'http://localhost:8085',
	namespace: 'v1/extension/dummy/widgets',

	pathForType(type) {
    return underscore(type);
  },

	/*
	buildURL (modelName, id, snapshot, requestType, query){
		console.log(modelName);
		console.log(id);
		console.log(snapshot);
		console.log(requestType);
		console.log(query);
		return this.get('host') + "/" +this.get('namespace') + "/" + modelName + "?";
	}
	*/
});
