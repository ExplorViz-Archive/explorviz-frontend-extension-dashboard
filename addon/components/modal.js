import Component from '@ember/component';
import layout from '../templates/components/modal';

export default Component.extend({

  modalservice: Ember.inject.service('modal-content'),
  content: "loading",

  didInsertElement() {
    this._super(...arguments);
    //this.set('content', "fo bar");
    $(window).on('shown.bs.modal', () => {
        $('.exampleModal').modal('show');
        this.set('content', this.get('modalservice').getContent());
    });
  },

  layout
});
