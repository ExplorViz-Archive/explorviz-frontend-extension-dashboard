import Component from '@ember/component';
import layout from '../templates/components/aggregatedresponsetimetable';
import {
  task,
  timeout
} from 'ember-concurrency';

export default Component.extend({
  store: Ember.inject.service(),


  didInsertElement() {
    this._super(...arguments);

    var ctxID = this.elementId;
    var timestampLandscape = ctxID.split('_')[2];
    this.set('timestampLandscape', timestampLandscape);

    //trigger if show class is added - then start query for data
    var $div = $("#" + this.elementId);
    var observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === "class") {
          var attributeValue = $(mutation.target).prop(mutation.attributeName);

          var splitClass = attributeValue.split(' ');
          for (var i = 0; i < splitClass.length; i++) {
            if (splitClass[i] == "show") {
              this.get('queryCurrent').perform();
            }
          }
        }
      });
    });
    observer.observe($div[0], {
      attributes: true
    });
  },

  queryCurrent: task(function*() {
    if (this.get('timestampLandscape')) {
      const myStore = this.get('store');
      myStore.query('aggregatedresponsetime', {
        timestampLandscape: this.get('timestampLandscape')
      }).then(backendData => {
        this.set('tableData', backendData);
      });
    }

  }).on('activate').cancelOn('deactivate').drop(),

  layout
});
