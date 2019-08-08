import Component from '@ember/component';
import layout from '../templates/components/eventlog';
import {
  task,
  timeout
} from 'ember-concurrency';


export default Component.extend({


  store: Ember.inject.service(),



  didInsertElement() {
    this._super(...arguments);

    var ctx = document.getElementById(this.elementId);

    ctx.classList.remove("col-xl-4");
    ctx.classList.remove("col-lg-5");
    ctx.classList.add("col-xl-8");

    this.get('initWidget').perform();
  },



  initWidget: task(function*() {
    yield this.get('queryEventLogSettings').perform();
    yield this.get('queryCurrent').perform();

  }).on('activate').cancelOn('deactivate').drop(),

  queryCurrent: task(function*() {
    const myStore = this.get('store');

    var backendData = yield myStore.query('eventloginfo', {
      entries: this.get('entries')
    });

    this.set('eventloginfo', backendData);

  }).on('activate').cancelOn('deactivate').drop(),

  queryEventLogSettings: task(function*() {
    var store = this.get('store');

    yield store.queryRecord('eventlogsetting', {
      instanceID: this.elementId
    }).then(backendData => {
      var entries = backendData.get('entries');
      this.set('entries', entries);
    });
  }).on('activate').cancelOn('deactivate').drop(),

  actions: {
    refresh() {
      this.get('queryCurrent').perform();
    },
    remove() {
      var ctx = document.getElementById(this.elementId);
      ctx.style.display = "none";

      const myStore = this.get('store');

      //getting the user id
      var userID = 0;
      let users = myStore.peekAll('user');
      users.forEach((item) => {
        if (item) {
          userID = item.get('id');
        }
      });

      //send post request with timestamp -1 => if timestamp is -1 the entry will be deleted
      let post = myStore.createRecord('instantiatedwidget', {
        userID: userID,
        timestamp: -1,
        widgetName: "",
        instanceID: this.elementId,
        orderID: 0
      });
      post.save();
    },
  },

  layout
});
