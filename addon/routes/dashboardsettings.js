import Route from '@ember/routing/route';


var widgetNameList = [{
  widget: 'activeclassinstances'
}, {
  widget: 'programminglanguagesoccurrence'
}, {
  widget: 'ramcpu'
}, {
  widget: 'totaloverviewwidget'
}, {
  widget: 'totalrequests'
}];

export default Route.extend({


  model() {
    return widgetNameList;
  },

  setupController(controller, model) {
    this._super(controller, model);

    //works too if i want :) access with this.get('activeWidgetList')
    controller.set('instantiatedWidgets', [{
      id: 0,
      widget: 'empty'
    }]);
    controller.set('model', model);
  },

  actions: {
    resetRoute() {
      const routeName = this.get('dashboardsettings');
    }

  },
});
