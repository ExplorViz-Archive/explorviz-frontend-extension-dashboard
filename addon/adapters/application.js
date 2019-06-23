import DS from 'ember-data';
import { underscore } from '@ember/string';

export default DS.JSONAPIAdapter.extend({
	host: 'http://localhost:8085',
	namespace: 'v1/extension/dummy/widgets',

	pathForType(type) {
    return underscore(type);
  }
});
