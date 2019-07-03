import BaseRoute from 'explorviz-frontend/routes/base-route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import {
  getOwner
} from '@ember/application';
import {
  inject as service
} from "@ember/service";

var userID = 1991;

export default BaseRoute.extend(AuthenticatedRouteMixin, {

  store: Ember.inject.service(),



  setupController(controller, model) {
    // Call _super for default behavior


    const myStore = this.get('store');

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

      console.log(tempData);


    });

  },




  actions: {
    resetRoute() {
      const routeName = this.get('dashboard');
    },

  }

});
