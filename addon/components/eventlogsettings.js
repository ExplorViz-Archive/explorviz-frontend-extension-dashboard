import Component from '@ember/component';
import layout from '../templates/components/eventlogsettings';
import {
  inject as service
} from '@ember/service';
import {
  task,
  timeout
} from 'ember-concurrency';

/*this is the component for the eventlog settings*/
export default Component.extend({

  store: Ember.inject.service(),
  router: service(),

  //start the init task
  didInsertElement() {
    this._super(...arguments);
    this.get('initTasks').perform();
  },

  //start the task for query for already set settings
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

  //query for already set settings for that widget
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

  //task for sending a post request for creating new settings for this widget
  postRequestEventLogSettings: task(function*() {
    var store = this.get('store');
    var text = document.getElementById('inputLimit').value;

    if (text == "") {
      text = document.getElementById('inputLimit').placeholder;
    }

    this.set('entries', text);

    let post = yield store.createRecord('eventlogsetting', {
      instanceID: this.elementId,
      entries: this.get('entries'),
    });

    post.save().then(() => {
      window.location.href = "dashboard";
    });

  }).on('activate').cancelOn('deactivate').drop(),

  //task for saving the new data
  saveData: task(function*() {
    yield this.get('postRequestEventLogSettings').perform();
  }).on('activate').cancelOn('deactivate').drop(),

  actions: {
    saveData() {
      this.get('saveData').perform();
    },

    cancel() {
      window.location.href = "dashboard";
    }
  },
  layout
});
