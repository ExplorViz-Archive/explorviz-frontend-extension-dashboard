import Route from '@ember/routing/route';

//a list of all available widgets that are currently in the dashboard expension
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

  store: Ember.inject.service(),


  //return the widgetNameList in the model. in dashboardsettings.hbs we can create then the left list with it
  model() {
    return widgetNameList;
  },


  //in the setupController we need to load the instantiatedWidget list for the right list in the dashboardsettings.hbs file.
  setupController(controller, model) {
    this._super(controller, model);

    //temporär !!!
    var userID = 1991;
    controller.set('userID', userID);



    const myStore = this.get('store');

    //Doing a get request to the backend here to get a list of all instantiatedwidgets.
    myStore.query('instantiatedwidget', {
      userID: userID
    }).then(function(backendData) {

      var tempData = new Array(backendData.length);

      var highestID = 0;

      backendData.forEach(function(element) {

        var instanceID = element.get('instanceID');
        var widgetName = element.get('widgetName');
        var orderID = element.get('orderID')

        var insert = {
          id: instanceID,
          widget: widgetName
        };

        tempData.splice(orderID, 1, insert);

        //setting the highestID, that the idGenerator has always the max number that excist in the database.
        if (instanceID > highestID) {
          highestID = instanceID;
        }

      });

      //console.log(tempData);


      controller.set('instantiatedWidgets', tempData);
      controller.set('idGenerator', highestID + 1);

    });



    controller.set('model', model);
  },

  actions: {
    resetRoute() {
      const routeName = this.get('dashboardsettings');
    }

  },
});
