import Component from '@ember/component';
import layout from '../templates/components/programminglanguagesoccurrence';
import {
  task,
  timeout
} from 'ember-concurrency';

var data = [];
var chart;

export default Component.extend({

  store: Ember.inject.service(),

  init() {
    this._super(...arguments);
    let task = this.get('pollServerForChanges');
    let taskInstance = task.perform();
  },

  didInsertElement() {
    this._super(...arguments);
    queryData(this.get('store'));
    createChart(getOccursAsArray(data));
  },

  pollServerForChanges: task(function*() {
    while (true) {
      yield timeout(10000);

      queryData(this.get('store'));

      chart.updateSeries(getOccursAsArray(data));



    }
  }).on('activate').cancelOn('deactivate').restartable(),

  layout
});

function queryData(myStore) {
  myStore.query('programminglanguagesoccurrence', {}).then(function(backendData) {

    data = [];

    backendData.forEach(function(element) {

      var timestamp = element.get('timestamp');
      var programminglanguage = element.get('programminglanguage');
      var occurs = element.get('occurs');


      data.push({
        timestamp,
        programminglanguage,
        occurs
      });


    });

  });
}

function getOccursAsArray(temp) {

  var newData = [];


  for (var i = 0; i < temp.length; i++) {

    var occurs = temp[i].occurs;

    newData.push({
      occurs
    });
  }

  return newData;
}



function createChart(currentData) {
  var options = {
    chart: {
      type: 'donut',
    },
    dataLabels: {
      enabled: false
    },
    series: currentData,
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          show: false
        }
      }
    }],
    legend: {
      position: 'right',
      offsetY: 0,
      height: 230,
    }
  }

  chart = new ApexCharts(
    document.querySelector("#programminglanguagesoccurrenceChart"),
    options
  );

  chart.render();
}
