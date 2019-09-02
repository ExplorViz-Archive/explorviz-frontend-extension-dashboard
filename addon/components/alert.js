import Component from '@ember/component';
import layout from '../templates/components/alert';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

export default Component.extend(AlertifyHandler,{

  init() {
    this._super(...arguments);
      this.showAlertifyMessageWithDuration("You can add widgets to your dashboard inside your dashboard settings.", 200);

  },

  layout
});
