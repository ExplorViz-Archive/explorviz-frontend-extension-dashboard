import Route from '@ember/routing/route';
import {
  inject as injectService
} from '@ember/service';

//a list of all available widgets that are currently in the dashboard expension
//ever widget has a name, displayname, description, motivation and a picSrc. this information is used on diffrent part of the code
//and always need to be added for new widgets.
var widgetNameList = [{
    widget: 'activeclassinstances',
    displayName: 'Active class instances',
    description: "This Widget visualizes the instantiated classes inside a software landscape. It shows how often a class is instantiated. The visualisation is in form of a pie chart and it starts with the highest instantiated class. This widget only shows the newest landscape thats comming inside our system.",
    picsrc: 'assets/images/widgetpreview/activeclassinstances.png'
  }, {
    widget: 'programminglanguagesoccurrence',
    displayName: 'Programming languages occurrence',
    description: 'This widget visualizes which programming languages are used inside the software landscape. The visualisation is in form of a doughnut chart. This widget only shows the newest landscape thats comming inside our system.',
    picsrc: 'assets/images/widgetpreview/activeclassinstances.png'
  },
  {
    widget: 'totaloverviewwidget',
    displayName: 'Total overview',
    description: 'This widget visualizes the amount of the different components (systems, nodes and applications). The visualisation is in form of a doughnut chart. This widget is usefull to get an overview over huge software landscapes. This widget only shows the newest landscape thats comming inside our system.',
    picsrc: 'assets/images/widgetpreview/activeclassinstances.png'
  },
  {
    widget: 'totalrequests2',
    displayName: 'Total requests',
    description: 'This widget shows the total requests inside a software landscape. The visualisation is one with a linediagramm. It will load in automatically the newest landscape and shows the totale requests of older landscapes too. You can interact with the widget with scrolling and zooming.',
    picsrc: 'assets/images/widgetpreview/activeclassinstances.png'
  }, {
    widget: 'ramcpu2',
    displayName: 'CPU RAM',
    description: 'This widget shows the CPU and RAM utilisation of a selected node. You can change the selected node inside the widget settings (top right corner).',
    picsrc: 'assets/images/widgetpreview/activeclassinstances.png'
  }, {
    widget: 'eventlog',
    displayName: 'Eventlog',
    description: 'This widgets shows u a list of all landscapes that triggered events. If u select a a landscape it will show u a table, which is filled with the different events. You can change the maximal amount of events that is getting loaded inside, if you click the widget settings in the top right corner.',
    picsrc: 'assets/images/widgetpreview/activeclassinstances.png'
  }, {
    widget: 'operationresponsetime-info',
    displayName: 'Operation response time (table)',
    description: 'This widget shows u all response times of all operations for each landscape. The data will be shown inside a list/table.',
    picsrc: 'assets/images/widgetpreview/activeclassinstances.png'
  }, {
    widget: 'operationresponsetime',
    displayName: 'Operation response time (pie chart)',
    description: 'This widget shows u inside a pie chart the operations (functions) that needs the longest time to execute.',
    picsrc: 'assets/images/widgetpreview/activeclassinstances.png'
  }, {
    widget: 'aggregatedresponsetime',
    displayName: 'Aggregated response time (table)',
    description: 'This widget shows u inside a list all landscapes and the entries about the aggregated response time between classes. If classes call each others operation, it will count them together and show the time that is needed to execute these functions all together.',
    picsrc: 'assets/images/widgetpreview/activeclassinstances.png'
  }, {
    widget: 'aggregatedresponsetime-pie',
    displayName: 'Aggregated response time (pie chart)',
    description: 'This widget shows the aggregated response time between classes. It shows the five highest aggregated communications inside a pie chart.',
    picsrc: 'assets/images/widgetpreview/activeclassinstances.png'
  }
];

/*
This is the route for the dashboardsettings
*/
export default Route.extend({

  store: injectService('store'),

  //return the widgetNameList in the model. in dashboardsettings.hbs we can create then the left list with it
  model() {
    return widgetNameList;
  },

  //in the setupController we need to load the instantiatedWidget list for the right list in the dashboardsettings.hbs file.
  setupController(controller, model) {
    this._super(controller, model);

    var userID = 0;

    const myStore = this.get('store');

    //getting the current userid from the dashboard.
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
          displayName = "Select a available Widget"
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
      //stuff if the route is getting resetet can be done here
    }
  },
});
