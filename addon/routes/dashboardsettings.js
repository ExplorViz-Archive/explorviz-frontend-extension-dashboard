import Route from '@ember/routing/route';

//a list of all available widgets that are currently in the dashboard expension
var widgetNameList = [{
    widget: 'activeclassinstances',
    displayName: 'Active class instances',
    description: 'This Widget visualizes the instantiated classes inside a software landscape. It shows how often a class is instantiated. The visualisation is in form of a pie chart and it starts with the highest instantiated class. This widget only shows the newest landscape thats comming inside our system.'
  }, {
    widget: 'programminglanguagesoccurrence',
    displayName: 'Programming languages occurrence',
    description: 'This widget visualizes which programming languages are used inside the software landscape. The visualisation is in form of a doughnut chart. This widget only shows the newest landscape thats comming inside our system.'
  },
  /*{
  widget: 'ramcpu',
  displayName: 'RAM CPU'
},*/
  {
    widget: 'totaloverviewwidget',
    displayName: 'Total overview',
    description: 'This widget visualizes the amount of the different components (systems, nodes and applications). The visualisation is in form of a doughnut chart. This widget is usefull to get an overview over huge software landscapes. This widget only shows the newest landscape thats comming inside our system.'
  },
  /* {
    widget: 'totalrequests',
    displayName: 'Total requests'
  }, */
  {
    widget: 'totalrequests2',
    displayName: 'Total requests',
    description: ''
  }, {
    widget: 'ramcpu2',
    displayName: 'CPU RAM',
    description: ''
  }, {
    widget: 'eventlog',
    displayName: 'Eventlog',
    description: ''
  }, {
    widget: 'operationresponsetime',
    displayName: 'Operation response time',
    description: ''
  }
];

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
    var userID = 0;

    const myStore = this.get('store');

    let users = myStore.peekAll('user');

    users.forEach((item) => {

      if (item) {
        userID = item.get('id');
      }
    });

    controller.set('userID', userID);
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

        var element = widgetNameList.find(item => item.widget === widgetName);

        //if the list is empty set displayName zo empty
        if (element != null) {
          var displayName = element.displayName;
        } else {
          displayName = "Empty"
        }


        var insert = {
          id: instanceID,
          widget: widgetName,
          displayName: displayName
        };

        tempData.splice(orderID, 1, insert);

        //setting the highestID, that the idGenerator has always the max number that excist in the database.
        if (instanceID > highestID) {
          highestID = instanceID;
        }

      });

      //filter the list for empty elements (if someone deleted some)
      var filtered = tempData.filter(function(el) {
        return el != null;
      });


      controller.set('instantiatedWidgets', filtered);
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
