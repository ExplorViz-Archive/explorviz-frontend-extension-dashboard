import BaseRoute from 'explorviz-frontend/routes/base-route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import {
  inject as injectService
} from '@ember/service';


var userID = 0;

/*
This is the route for the dashboard main page
*/
export default BaseRoute.extend(AuthenticatedRouteMixin, {

  store: injectService('store'),

  setupController(controller) {
    // Call _super for default behavior

    const myStore = this.get('store');

    //get the current users id
    let users = myStore.peekAll('user');
    users.forEach((item) => {
      if (item) {
        userID = item.get('id');
      }
    });

    //Doing a get request to the backend here to get a list of all instantiatedwidgets.
    myStore.query('instantiatedwidget', {
      userID: userID
    }).then(function(backendData) {

      var tempData = new Array(backendData.length);
      backendData.forEach(function(element) {

        var instanceID = element.get('instanceID');
        var widgetName = element.get('widgetName');
        var orderID = element.get('orderID')

        var insert = {
          instanceID: instanceID,
          widgetName: widgetName,
          orderID: orderID
        };

        tempData.splice(orderID, 1, insert);
      });



      //setting the widgets on load of the dashboard.
      controller.set('widgets', tempData);
    });
  },


  actions: {
    resetRoute() {
      window.location.href = "dashboard";
    },
  }

});
