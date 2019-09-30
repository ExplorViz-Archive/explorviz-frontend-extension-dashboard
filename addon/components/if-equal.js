import Component from '@ember/component';
import layout from '../templates/components/if-equal';

/*
component for the if-equal.
*/
export default Component.extend({

  isEqual: function() {
    return this.get('param1') === this.get('param2');
  }.property('param1', 'param2'),

  layout
});
