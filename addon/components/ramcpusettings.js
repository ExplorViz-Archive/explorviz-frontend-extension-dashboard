import Component from '@ember/component';
import layout from '../templates/components/ramcpusettings';
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

  init() {
    this._super(...arguments);
  },


  didRender() {
    this._super(...arguments);
  },

  didInsertElement() {
    this._super(...arguments);
    this.get('initTasks').perform();

  },

  initTasks: task(function*() {
    yield this.get('queryRamCpu').perform();
    yield this.get('queryRamCpuSetting').perform();
  }).on('activate').cancelOn('deactivate').drop(),
  /**
  this task sets the active class for the current active node inside the list.
  **/
  updateActiveDivInList: task(function*() {
    var divs = document.getElementsByClassName('list-group-item');

    for (var i = 0; i < divs.length; i++) {

      divs[i].classList.remove("active");


      //if we dont have nodeName, then we need to get the data from backend
      //dont work :/
      if (this.get('nodeName') == null) {


        this.get('queryRamCpuSetting').perform();
      }

      if (divs[i].id === this.get('nodeName')) {

        divs[i].classList.add("active");
      }

    }
  }).on('activate').cancelOn('deactivate').drop(),

  queryRamCpu: task(function*() {
    var store = this.get('store');
    store.query('ramcpu', {}).then(backendData => {

      var nodeNameList = [];

      if (backendData != null) {

        backendData.forEach(element => {
          var nodeName = element.get('nodeName');

          var insert = {
            nodeName: nodeName
          }

          nodeNameList.push(insert);

        });

      }

      this.set('nodeNameList', nodeNameList)

    });
  }).on('activate').cancelOn('deactivate').drop(),

  queryRamCpuSetting: task(function*() {
    var store = this.get('store');
    yield store.queryRecord('ramcpusetting', {
      instanceID: this.elementId
    }).then(backendData => {

      if (backendData != null) {
        var nodeName = backendData.get('nodeName');

        this.set('nodeName', nodeName);
      }

    });

    this.get('updateActiveDivInList').perform();

  }).on('activate').cancelOn('deactivate').drop(),

  postRequestRamCpuSetting: task(function*(nodeName) {
    let post = store.createRecord('ramcpusetting', {
      instanceID: this.elementId,
      nodeName: nodeName,
    });

    post.save().then(() => {

    });
  }).on('activate').cancelOn('deactivate').drop(),

  actions: {

    listClick(event) {
      var widgetName = event.target.id;
      this.set('nodeName', widgetName);

      this.get('updateActiveDivInList').perform();

    },

    saveBtn() {

      //postRequestRamCpuSetting(this.get('store'), this, this.get('nodeName'));
      this.get('postRequestRamCpuSetting').perform(this.get('nodeName'));
      this.get('router').transitionTo('dashboard');
    },

    cancelBtn() {
    
      this.get('router').transitionTo('dashboard');
    }
  },

  layout
});
