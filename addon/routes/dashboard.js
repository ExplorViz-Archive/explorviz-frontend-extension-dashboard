import BaseRoute from 'explorviz-frontend/routes/base-route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import {
  getOwner
} from '@ember/application';
import {
  inject as service
} from "@ember/service";


var userID = 0;

export default BaseRoute.extend(AuthenticatedRouteMixin, {

  store: Ember.inject.service(),



  setupController(controller, model) {
    // Call _super for default behavior



    const myStore = this.get('store');




    let users = myStore.peekAll('user');

    users.forEach((item) => {

      if(item)
      {
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




      controller.set('widgets', tempData);




    });

  },




  actions: {
    resetRoute() {
      //quick fix - some addons dont load cuz ember framework
      //location.reload();
      window.location.href = "dashboard";
      const routeName = this.get('dashboard');
    },
  }

});
