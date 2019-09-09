import Component from '@ember/component';
import layout from '../templates/components/operationresponsetime-info';
import {
  task,
  timeout
} from 'ember-concurrency';

export default Component.extend({
  store: Ember.inject.service(),
  modalservice: Ember.inject.service('modal-content'),
  paused: false,

  didInsertElement() {
    this._super(...arguments);

    var ctx = document.getElementById(this.elementId);

    ctx.classList.remove("col-xl-4");
    ctx.classList.remove("col-lg-5");
    ctx.classList.add("col-xl-8");

    this.get('initWidget').perform();
  },



  initWidget: task(function*() {
    this.get('queryLoop').perform();

  }).on('activate').cancelOn('deactivate').drop(),

  queryLoop: task(function*() {
    while (!this.get('paused')) {
      yield this.get('queryCurrent').perform();
      yield timeout(10000);
    }

  }).on('activate').cancelOn('deactivate').drop(),

  queryCurrent: task(function*() {
    const myStore = this.get('store');

    var backendData = yield myStore.query('operationresponsetimeinfo', {});

    this.set('operationresponsetimeinfo', backendData);

  }).on('activate').cancelOn('deactivate').drop(),

  actions: {

    pause() {
      this.set('paused', true);
    },

    refresh() {
      if (this.get('paused')) {
        this.set('paused', false);
        //starts the "thread" if its already closed
        this.get('queryLoop').perform();
      } else {
        this.set('paused', true);
      }
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
