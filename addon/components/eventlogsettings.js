import Component from '@ember/component';
import layout from '../templates/components/eventlogsettings';
import {
  inject as service
} from '@ember/service';
import {
  task,
  timeout
} from 'ember-concurrency';

export default Component.extend({

  store: Ember.inject.service(),
  router: service(),

  didInsertElement() {
    this._super(...arguments);
    this.get('initTasks').perform();

  },

  initTasks: task(function*() {
    //yield this.get('queryEventLogSettings').perform();
  }).on('activate').cancelOn('deactivate').drop(),

  queryEventLogSettings: task(function*() {
    var store = this.get('store');

    store.queryRecord('eventlogsetting', {instanceID: this.elementId}).then(backendData => {

      //console.log(backendData);

    });
  }).on('activate').cancelOn('deactivate').drop(),

  postRequestEventLogSettings: task(function*() {
    var store = this.get('store');


    let post = store.createRecord('eventlogsetting', {
      instanceID: this.elementId,
      entries: this.get('entries'),
    });

    post.save();

  }).on('activate').cancelOn('deactivate').drop(),

  actions: {
    saveData() {
      this.get('queryEventLogSettings').perform();

    },

    cancel() {
      //redirect to the dashboard
      this.get('postRequestEventLogSettings').perform();
      //this.transitionToRoute('dashboard');
    }
  },
  layout
});
