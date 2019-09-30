import DS from 'ember-data';
import {
  underscore
} from '@ember/string';

/*
This is the adapter for accessing the backend extansion. for setting up the system on
the backend and frontend not on the same system, the host need to be changend.
*/
export default DS.JSONAPIAdapter.extend({
  host: 'http://localhost:8085',
  namespace: 'v1/extension/dummy/widgets',

  //for calling the query function, the model gets pluralisized. we can prevent that
  //if we overwrite the method.
  pathForType(type) {
    return underscore(type);
  },
});
