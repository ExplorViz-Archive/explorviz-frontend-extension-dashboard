import Route from '@ember/routing/route';
import {
  set
} from '@ember/object';

//var widgetName = "";

export default Route.extend({



  queryParams: {
    widget: '',
    instanceID: ''
  },



  model(params) {
    this.set('widgetName', params.widget);
    this.set('instanceID', params.instanceID);
  },


  setupController(controller, model) {
    this._super(controller, model);

    controller.set('widgetName', this.get('widgetName'));
    controller.set('instanceID', this.get('instanceID'));

    controller.set('model', model);
  },


  actions: {
    resetRoute() {
      const routeName = this.get('widgetsettings');

    }
  },
});
