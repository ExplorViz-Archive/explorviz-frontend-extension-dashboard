import Component from '@ember/component';
import layout from '../templates/components/modal';

export default Component.extend({

  content: "loading",

  didInsertElement() {
    this._super(...arguments);
    //this.set('content', "fo bar");

  },

  layout
});



$(window).on('shown.bs.modal', function() {
    $('.exampleModal').modal('show');
    console.log("shown");
});
