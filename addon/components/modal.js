import Component from '@ember/component';
import layout from '../templates/components/modal';

/*
component for the modal.
*/
export default Component.extend({

  modalservice: Ember.inject.service('modal-content'),
  content: "loading",

  //init the modal
  didInsertElement() {
    this._super(...arguments);

    //if modal is getting set to show, then set the content for this modal for a widget.
    $(window).on('shown.bs.modal', () => {
      $('.exampleModal').modal('show');

      this.set('content', this.get('modalservice').getContent());
    });
  },

  layout
});
