import Component from '@ember/component';
import layout from '../templates/components/alert';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

/*
component for the alert
*/
export default Component.extend(AlertifyHandler, {

  //if init, then show a message on dashboard screen
  init() {
    this._super(...arguments);
    this.showAlertifyMessageWithDuration("You can add widgets to your dashboard inside your dashboard settings.", 200);

  },

  layout
});
