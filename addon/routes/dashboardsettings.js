import Route from '@ember/routing/route';


var widgetNameList = [{widget: 'activeclassinstances'}, {widget:'programminglanguagesoccurrence'}, {widget:'ramcpu'}, {widget:'totaloverviewwidget'}, {widget:'totalrequests'}];

export default Route.extend({


  model()
  {
    return widgetNameList;
  },

  actions: {
    resetRoute() {
      const routeName = this.get('dashboardsettings');

    },

    //hier weitermachen not found error
  listClick(event){
      // Only when assigning the action to an inline handler, the event object
    // is passed to the action as the first parameter.
    console.log("hallo welt");
    console.log(event.target);
  }

  },
});
