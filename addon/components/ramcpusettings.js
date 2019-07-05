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
    console.log("ramcpusettings init: " + this.elementId);
  },


  didRender() {
    this._super(...arguments);
    console.log("ramcpusettings didRender: " + this.elementId);
  },

  didInsertElement() {
    this._super(...arguments);
    console.log("ramcpusettings didInsertElement: " + this.elementId);
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

    console.log(divs);
    console.log("length: " + divs.length);
    for (var i = 0; i < divs.length; i++) {

      divs[i].classList.remove("active");
      console.log(divs[i].id + "  x  " + this.get('nodeName'));

      //if we dont have nodeName, then we need to get the data from backend
      //dont work :/
      if (this.get('nodeName') == null) {
        console.log("nodename was null");

        this.get('queryRamCpuSetting').perform();
      }

      if (divs[i].id === this.get('nodeName')) {
        console.log("true");
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
      console.log(nodeNameList);
    });
  }).on('activate').cancelOn('deactivate').drop(),

  queryRamCpuSetting: task(function*() {
    var store = this.get('store');
    yield store.queryRecord('ramcpusetting', {
      instanceID: this.elementId
    }).then(backendData => {

      if (backendData != null) {
        var nodeName = backendData.get('nodeName');
        console.log(nodeName);
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
      console.log('postRequestRamCpuSetting');
    });
  }).on('activate').cancelOn('deactivate').drop(),

  actions: {

    listClick(event) {
      var widgetName = event.target.id;
      this.set('nodeName', widgetName);

      this.get('updateActiveDivInList').perform();

    },

    saveBtn() {
      console.log("save");
      //postRequestRamCpuSetting(this.get('store'), this, this.get('nodeName'));
      this.get('postRequestRamCpuSetting').perform(this.get('nodeName'));
      this.get('router').transitionTo('dashboard');
    },

    cancelBtn() {
      console.log("cancel");
      this.get('router').transitionTo('dashboard');
    }
  },

  layout
});
