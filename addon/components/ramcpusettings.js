import Component from '@ember/component';
import layout from '../templates/components/ramcpusettings';
import {
  task,
  timeout
} from 'ember-concurrency';
import {
  inject as injectService
} from '@ember/service';

/*
this is the component for the ram cpu settings
*/
export default Component.extend({

  store: injectService('store'),
  router: injectService(),

  init() {
    this._super(...arguments);
  },


  didRender() {
    this._super(...arguments);
  },

  //start the init task
  didInsertElement() {
    this._super(...arguments);
    this.get('initTasks').perform();

  },

  //init this component -> query for avaiable nodes and the already set settings
  initTasks: task(function*() {
    yield this.get('queryRamCpu').perform();
    yield this.get('queryRamCpuSetting').perform();
  }).on('activate').cancelOn('deactivate').drop(),


  //this task sets the active class for the current active node inside the list.
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

  //query for the avaiable nodes
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

  //query for already set settings
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

  //send a post request to the backend to set new settings
  postRequestRamCpuSetting: task(function*(nodeName) {
    var store = this.get('store');
    let post = store.createRecord('ramcpusetting', {
      instanceID: this.elementId,
      nodeName: nodeName,
    });

    post.save().then(() => {
      window.location.href = "dashboard";
    });
  }).on('activate').cancelOn('deactivate').drop(),

  actions: {
    //a item on the left list is clicked
    listClick(event) {
      var widgetName = event.target.id;
      this.set('nodeName', widgetName);

      this.get('updateActiveDivInList').perform();

    },

    //save button is clicked
    saveBtn() {
      this.get('postRequestRamCpuSetting').perform(this.get('nodeName'));
    },
    //cancel button is clicked
    cancelBtn() {
      window.location.href = "dashboard";
    }
  },

  layout
});
