import Component from '@ember/component';
import layout from '../templates/components/ramcpusettings';
import { inject as service } from '@ember/service';

export default Component.extend({

  store: Ember.inject.service(),
  router: service(),

  init() {
    this._super(...arguments);
    console.log(this.elementId);

    queryRamCpuSetting(this.get('store'), this);
    queryRamCpu(this.get('store'), this);

  },

  /*wird ausgeführt beim rendern und beim re-rendern (controller.set) oder auch nicht*/
  didRender() {
    this._super(...arguments);
    updateActiveDivInList(this);
  },

  actions: {

    listClick(event) {
      var widgetName = event.target.id;
      this.set('nodeName', widgetName);
      updateActiveDivInList(this);

    },

    saveBtn() {
      console.log("save");
      postRequestRamCpuSetting(this.get('store'), this, this.get('nodeName'));
      this.get('router').transitionTo('dashboard');
    },

    cancelBtn() {
      console.log("cancel");
      this.get('router').transitionTo('dashboard');
    }
  },

  layout
});

/**
this function sets the active class for the current active node inside the list.
**/
function updateActiveDivInList(self) {

  var divs = document.getElementsByClassName('list-group-item');

  console.log(divs);
  console.log("length: " + divs.length);
  for (var i = 0; i < divs.length; i++) {

    divs[i].classList.remove("active");
    console.log(divs[i].id + "  x  " + self.get('nodeName'));
    if (divs[i].id === self.get('nodeName')) {
      console.log("true");
      divs[i].classList.add("active");
    }

  }

}

function queryRamCpu(store, self) {
  store.query('ramcpu', {}).then(function(backendData) {

    var nodeNameList = [];

    if (backendData != null) {

      backendData.forEach(function(element) {
        var nodeName = element.get('nodeName');

        var insert = {
          nodeName: nodeName
        }

        nodeNameList.push(insert);

      });

    }

    self.set('nodeNameList', nodeNameList)
    console.log(nodeNameList);
  });
}

function queryRamCpuSetting(store, self) {
  store.queryRecord('ramcpusetting', {
    instanceID: self.elementId
  }).then(function(backendData) {

    if (backendData != null) {
      var nodeName = backendData.get('nodeName');
      console.log(nodeName);
      self.set('nodeName', nodeName);
    }

  });
}



function postRequestRamCpuSetting(store, self, nodeName) {
  let post = store.createRecord('ramcpusetting', {
    instanceID: self.elementId,
    nodeName: nodeName,
  });

  post.save().then(() => {
    console.log('postRequestRamCpuSetting');
  });
}
