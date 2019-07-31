import Component from '@ember/component';
import layout from '../templates/components/totalrequests2';
import {
  task,
  timeout
} from 'ember-concurrency';


export default Component.extend({

  store: Ember.inject.service(),

  init() {
    this._super(...arguments);
    this.set('debug', false);
  },

  didInsertElement() {
    this._super(...arguments);

    var ctx = document.getElementById(this.elementId);

    ctx.classList.remove("col-xl-4");
    ctx.classList.remove("col-lg-5");
    ctx.classList.add("col-xl-6");

    this.get('initWidget').perform();

    if (this.get('debug')) {

      var config = this.get('config');
      var chart = this.get('chart');
      document.getElementById('duration').addEventListener(isIE ? 'change' : 'input', function() {
        config.options.scales.xAxes[0].realtime.duration = +this.value;
        chart.update({
          duration: 0
        });
        document.getElementById('durationValue').innerHTML = this.value;
      });

      document.getElementById('ttl').addEventListener(isIE ? 'change' : 'input', function() {
        config.options.scales.xAxes[0].realtime.ttl = +this.value;
        chart.update({
          duration: 0
        });
        document.getElementById('ttlValue').innerHTML = this.value;
      });

      document.getElementById('refresh').addEventListener(isIE ? 'change' : 'input', function() {
        config.options.scales.xAxes[0].realtime.refresh = +this.value;
        chart.update({
          duration: 0
        });
        document.getElementById('refreshValue').innerHTML = this.value;
      });

      document.getElementById('delay').addEventListener(isIE ? 'change' : 'input', function() {
        config.options.scales.xAxes[0].realtime.delay = +this.value;
        chart.update({
          duration: 0
        });
        document.getElementById('delayValue').innerHTML = this.value;
      });

      document.getElementById('frameRate').addEventListener(isIE ? 'change' : 'input', function() {
        config.options.plugins.streaming.frameRate = +this.value;
        chart.update({
          duration: 0
        });
        document.getElementById('frameRateValue').innerHTML = this.value;
      });

      document.getElementById('pause').addEventListener('change', function() {
        config.options.scales.xAxes[0].realtime.pause = this.checked;
        chart.update({
          duration: 0
        });
        document.getElementById('pauseValue').innerHTML = this.checked;
      });

    }

  },

  initWidget: task(function*() {
    this.set('lastTimestamp', -99);
    yield this.get('createChart').perform();
    yield this.get('queryAll').perform();
    //  yield this.get('queryData').perform();
    this.get('queryDataLoop').perform();

  }).on('activate').cancelOn('deactivate').drop(),

  createChart: task(function*() {
    console.log("createchart method");
    var config = {
      type: 'line',
      data: {
        datasets: [{
            label: 'Total Requests',
            backgroundColor: color(chartColors.red).alpha(0.5).rgbString(),
            borderColor: chartColors.red,
            fill: false,
            lineTension: 0,
            borderDash: [8, 4],
            data: []
          }
          /*, {
                    label: 'Dataset 2 (cubic interpolation)',
                    backgroundColor: color(chartColors.blue).alpha(0.5).rgbString(),
                    borderColor: chartColors.blue,
                    fill: false,
                    cubicInterpolationMode: 'monotone',
                    data: []
                  }*/
        ]
      },

      options: {
        title: {
          display: false,
          text: 'Data labels plugin sample'
        },
        scales: {
          xAxes: [{
            type: 'realtime',
            realtime: {
              duration: 29100, //20000 default
              //ttl: 1800000, //hold data for 30 min
              ttl: 86400000, //hold data for 1 day
              refresh: 10000,
              delay: 15000
            }
          }],
          yAxes: [{
            type: 'linear',
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'value'
            }
          }]
        },
        tooltips: {
          mode: 'nearest',
          intersect: false
        },
        hover: {
          mode: 'nearest',
          intersect: false
        },
        pan: {
          enabled: true,
          mode: 'x',
          rangeMax: {
            x: undefined
          },
          rangeMin: {
            x: 0
          }
        },
        zoom: {
          enabled: true,
          mode: 'x',
          rangeMax: {
            x: undefined
          },
          rangeMin: {
            x: 1000
          }
        }

      }

    };
    this.set('config', config);
    var ctx = document.getElementById('totalrequests2Chart' + this.elementId).getContext('2d');

    var chart = new Chart(ctx, config);

    this.set('chart', chart);
    console.log("chart set to chart (end of chartcreate)");


  }).on('activate').cancelOn('deactivate').drop(),

  queryAll: task(function*() {
    console.log("query data method");

    var chart = this.get('chart');

    if (chart == null) {
      yield this.get('createChart').perform();
    }

    if (chart != null) {

      const myStore = this.get('store');
      //geht ALLE datasets durch und setzt sie random

      var tempArray = [];

      myStore.query('totalrequests', {
        action: 'all'
      }).then(backendData => {

        backendData.forEach(item => {

          var last = this.get('lastTimestamp')
          var x = item.get('timestamp');
          var y = item.get('totalRequests');

          if (last != x) {

            tempArray.push({
              x: new Date(x),
              y: y
            });

            this.set('lastTimestamp', x);
            //item.deleteRecord();

          }


        });
      });





      chart.data.datasets[0].data = tempArray;
      chart.update();
      this.get('deleteAll').perform("totalrequests");

    } else {
      console.log("chart was null... (totalrequest2)");
    }

  }).on('activate').cancelOn('deactivate').drop(),

  queryData: task(function*() {
    console.log("query data method");

    var chart = this.get('chart');
    if (chart != null) {

      const myStore = this.get('store');
      //geht ALLE datasets durch und setzt sie random
      chart.config.data.datasets.forEach(dataset => {

        myStore.query('totalrequests', {
          //  action: 'recent'
        }).then(backendData => {

          backendData.forEach(item => {
            var last = this.get('lastTimestamp')
            var x = item.get('timestamp');
            var y = item.get('totalRequests');

            if (last != x) {

              dataset.data.push({
                x: new Date(x),
                y: y
              });
              chart.update();
              this.set('lastTimestamp', x)
            }

          });
        });


      });






    } else {
      console.log("chart was null... (totalrequest2)");
    }

  }).on('activate').cancelOn('deactivate').drop(),

  queryDataLoop: task(function*() {
    while (true) {
      yield timeout(10000);
      this.get('queryData').perform();
    }

  }).on('activate').cancelOn('deactivate').drop(),

  deleteAll: task(function*(deleteName) {
    this.get('store').findAll(deleteName).then(function(record) {
      record.content.forEach(function(rec) {
        Ember.run.once(this, function() {
          rec.deleteRecord();
          rec.save();
        });
      }, this);
    });
  }).on('activate').cancelOn('deactivate').drop(),

  actions: {
    removeBtn(event) {
      var ctx = document.getElementById(this.elementId);
      ctx.style.display = "none";
    },
  },

  layout
});


var chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)'
};

function randomScalingFactor() {
  return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
}




var color = Chart.helpers.color;
var colorNames = Object.keys(chartColors);

var isIE = navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.indexOf('Trident') !== -1;
