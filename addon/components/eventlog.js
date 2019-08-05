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

    yield this.get('queryCurrent').perform();


  }).on('activate').cancelOn('deactivate').drop(),

  queryCurrent: task(function*() {



    const myStore = this.get('store');
    //geht ALLE datasets durch und setzt sie random

    var backendData = yield myStore.query('eventloginfo', {
      //action: 'current'
    });
    /* .then(backendData => {
      this.set('eventloginfo',backendData );
    });
    */
    this.set('eventloginfo', backendData);

  }).on('activate').cancelOn('deactivate').drop(),

  layout
});
