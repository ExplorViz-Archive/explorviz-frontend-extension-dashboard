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
    yield this.get('queryEventLogSettings').perform();

    //allows only postive numbers in the input field
    document.getElementById('inputLimit').addEventListener('keydown', function(e) {
      var key = e.keyCode ? e.keyCode : e.which;

      if (!([8, 9, 13, 27, 46, 110, 190].indexOf(key) !== -1 ||
          (key == 65 && (e.ctrlKey || e.metaKey)) ||
          (key >= 35 && key <= 40) ||
          (key >= 48 && key <= 57 && !(e.shiftKey || e.altKey)) ||
          (key >= 96 && key <= 105)
        )) e.preventDefault();
    });

  }).on('activate').cancelOn('deactivate').drop(),

  queryEventLogSettings: task(function*() {
    var store = this.get('store');

    store.queryRecord('eventlogsetting', {
      instanceID: this.elementId
    }).then(backendData => {
      var entries = backendData.get('entries');
      document.getElementById('inputLimit').placeholder = entries;
      this.set('entries', entries);
    });
  }).on('activate').cancelOn('deactivate').drop(),

  postRequestEventLogSettings: task(function*() {
    var store = this.get('store');
    var text = document.getElementById('inputLimit').value;

    if (text == "") {
      text = document.getElementById('inputLimit').placeholder;
    }

    this.set('entries', text);

    let post = store.createRecord('eventlogsetting', {
      instanceID: this.elementId,
      entries: this.get('entries'),
    });

    post.save();

  }).on('activate').cancelOn('deactivate').drop(),

  actions: {
    saveData() {
      this.get('postRequestEventLogSettings').perform();
      this.get('router').transitionTo('dashboard');
    },

    cancel() {
      //redirect to the dashboard
      this.get('router').transitionTo('dashboard');
    }
  },
  layout
});
