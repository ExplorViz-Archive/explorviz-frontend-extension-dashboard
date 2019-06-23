import BaseRoute from 'explorviz-frontend/routes/base-route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { getOwner } from '@ember/application';
import { inject as service } from "@ember/service";

export default BaseRoute.extend(AuthenticatedRouteMixin, {

  /*
  model: function() {
    console.log('model init...');


    return Ember.RSVP.hash({
        totaloverviewwidget:  this.store.queryRecord('totaloverviewwidget', {})
      });



    return this.store.queryRecord('totaloverviewwidget', {}).then(function(totaloverviewwidget) {
      let name = totaloverviewwidget.get('name');
      let numberOfSystems = totaloverviewwidget.get('numberOfSystems');
      let numberOfNodes = totaloverviewwidget.get('numberOfNodes');
      let numberOfApplications = totaloverviewwidget.get('numberOfApplications');

      console.log(`Name: ${name}`);
      console.log(`numberOfSystems: ${numberOfSystems}`);
      console.log(`numberOfNodes: ${numberOfNodes}`);
      console.log(`numberOfApplications: ${numberOfApplications}`);
    });

	},
  */
  /*
  noch nicht getestet das
  model() {
    // returns a model
  },

  setupController(controller, model) {
    controller.set('model', model);
  }
  */

  setupController(controller, model) {
    // Call _super for default behavior

  },

  actions: {
    // @Override BaseRoute
    resetRoute() {
      const routeName = this.get('dashboard');

   },

  }

});
