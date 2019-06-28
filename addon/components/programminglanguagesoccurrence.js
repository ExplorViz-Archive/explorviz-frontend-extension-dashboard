import Component from '@ember/component';
import layout from '../templates/components/programminglanguagesoccurrence';
import {
  task,
  timeout
} from 'ember-concurrency';

var data = [];
var labels = [];

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
    createChart();
    queryData(this.get('store'));
  },

  didRender() {
    this._super(...arguments);
    queryData(this.get('store'));
  },

  pollServerForChanges: task(function*() {
    while (true) {
      yield timeout(10000);
      queryData(this.get('store'));
    }
  }).on('activate').cancelOn('deactivate').restartable(),

  layout
});

function queryData(myStore) {

  //Promise wird asychnone aufgeführt !
  myStore.query('programminglanguagesoccurrence', {}).then(function(backendData) {
    if (backendData.length != 0) {

      data = [];
      labels = [];

      backendData.forEach(function(element) {

        //var timestamp = element.get('timestamp');
        var programminglanguage = element.get('programminglanguage');
        var occurs = element.get('occurs');


        data.push(occurs);
        labels.push(programminglanguage);
      });

      //console.log(chart);
      if (chart == null) {
        createChart();
      }

      chart.updateSeries(data);
      chart.updateOptions({
        labels: labels,
      });
    }
  });
}


function createChart() {
  var options = {
    chart: {
      type: 'donut',
      height: 275,
    },
    dataLabels: {
      enabled: true
    },
    series: [0],
    labels: ['no landscape found'],
    //series: data,
    //labels: labels,
    responsive: [{
      breakpoint: 480,

      options: {
        legend: {
          show: true,
          position: 'bottom'
        }
      }

    }],
    legend: {
      position: 'bottom',
      offsetY: 0,
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
          }
        }
      }
    }
  }

  chart = new ApexCharts(
    document.querySelector("#programminglanguagesoccurrenceChart"),
    options
  );

  chart.render();
}
