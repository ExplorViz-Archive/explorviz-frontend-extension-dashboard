import Route from '@ember/routing/route';

/*
This is the route for the widgetsettings.
*/
export default Route.extend({

  //this route is only called with query params. the widget and the instanceID of that widget.
  queryParams: {
    widget: '',
    instanceID: ''
  },

  //setting up the model of that route. setting the widgetName and instanceID for later access.
  model(params) {
    this.set('widgetName', params.widget);
    this.set('instanceID', params.instanceID);
  },

  //setup the controller for the widgetsettings. 
  setupController(controller, model) {
    this._super(controller, model);

    controller.set('widgetName', this.get('widgetName'));
    controller.set('instanceID', this.get('instanceID'));
    controller.set('model', model);
  }

});
