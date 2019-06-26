import Component from '@ember/component';
import layout from '../templates/components/totalrequests';
import {
  task,
  timeout
} from 'ember-concurrency';


var data = [];
var recentData = [];

var chartAll;
var chartRecent;
var containerChartRecent;
var displayDataAmount = 10;

var containerChartAll;


export default Component.extend({

  store: Ember.inject.service(),

  pollServerForChanges: task(function*() {
    while (true) {
      yield timeout(10000);
      const myStore = this.get('store');

      myStore.query('totalrequests', {}).then(function(totalrequests) {
        totalrequests.forEach(function(element) {

          var x = element.get('timestamp');
          var y = element.get('totalRequests');

          data.push({
            x,
            y
          });

          recentData.push({
            x,
            y
          });


        });

      });




      chartAll.updateSeries([{
        data: data
      }]);



      resetRecentData();

      chartRecent.updateOptions({
        xaxis: {
          tickAmount: recentData.length - 1
        }
      });

      chartRecent.updateSeries([{
        data: recentData
      }]);

    }
  }).on('activate').cancelOn('deactivate').restartable(),

  initChartAll: task(function*() {
    containerChartAll = document.querySelector("#totalRequestsChartAll");
    chartAll = createChart(containerChartAll, optionsAll);

    containerChartAll.style.display = "none";

    const myStore = this.get('store');

    myStore.query('totalrequests', {
      action: 'all'
    }).then(function(totalrequests) {

      data = []

      totalrequests.forEach(function(item, index) {

        var x = item.get('timestamp');
        var y = item.get('totalRequests');

        data.push({
          x,
          y
        });

      });

      chartAll.updateSeries([{
        data: data
      }]);

    });
    //console.log("Done with getting the data!");

  }).on('activate').cancelOn('deactivate').restartable(),

  initChartRecent: task(function*() {
    containerChartRecent = document.querySelector("#totalRequestsChartRecent");
    containerChartRecent.style.display = "block";
    chartRecent = createChart(containerChartRecent, optionsRecent);

    recentData = [];

    const myStore = this.get('store');

    myStore.query('totalrequests', {
      action: 'recent'
    }).then(function(totalrequests) {

      totalrequests.forEach(function(item, index) {

        var x = item.get('timestamp');
        var y = item.get('totalRequests');

        recentData.push({
          x,
          y
        });

      });
    });


    chartRecent.updateSeries([{
      data: recentData
    }]);

  }).on('activate').cancelOn('deactivate').restartable(),



  init() {
    this._super(...arguments);
    let task = this.get('pollServerForChanges');
    let taskInstance = task.perform();
  },

  didInsertElement() {
    this._super(...arguments);
    let taskAll = this.get('initChartAll');
    let taskInstanceAll = taskAll.perform();

    let taskRecent = this.get('initChartRecent');
    let taskInstanceRecent = taskRecent.perform();

  },

  layout
});


function resetRecentData() {
  if (recentData.length >= displayDataAmount) {
    recentData = recentData.slice(recentData.length - displayDataAmount, recentData.length);
  }
}

var optionsRecent = {
  chart: {
    type: 'line',
    animations: {
      enabled: false,
      easing: 'linear',
      dynamicAnimation: {
        speed: 1000
      }
    },
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    }
  },
  dataLabels: {
    enabled: false
  },

  series: [{
    name: "Total Requests",
    data: recentData
  }],

  /*
  tooltip: {
    intersect: true,
    shared: false
  },
  */
  /*
  events: {
    dataPointSelection: function(event, chartContext, config) {
      console.log(config);
    }
  },
  */
  markers: {
    size: 0,
    colors: '#ea5454',
  },
  xaxis: {
    type: "categories",
    tickAmount: recentData.length - 1,

    labels: {
      rotate: -25,
      rotateAlways: true,
      formatter: function(value) {
        var date = new Date(value);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();

        var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

        return formattedTime;
      },

    }
    /*
    title: {
      text: 'Time',
    },
    */

  },
  yaxis: {
    title: {
      text: 'Total Requests',
    },
  },
  legend: {
    show: false
  },
}

var optionsAll = {
  chart: {
    type: 'line',
    animations: {
      enabled: false,
      easing: 'linear',
      dynamicAnimation: {
        speed: 1000
      }
    },
    toolbar: {
      show: false
    },
    zoom: {
      enabled: true
    }
  },
  dataLabels: {
    enabled: false
  },

  series: [{
    name: "Total Requests",
    data: data
  }],


  markers: {
    size: 0
  },
  xaxis: {
    type: "categories",
    tickAmount: 5,
    zoom: {
      enabled: true
    },
    labels: {
      formatter: function(value) {
        var date = new Date(value);
        var day = date.getUTCDay();
        var month = date.getUTCMonth();
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();

        var formattedTime = day + ' ' + month + ' - ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

        return date;
      }
    }

  },
  yaxis: {
    title: {
      text: 'Total Requests',
    },
  },
  legend: {
    show: false
  },
}

function createChart(chartdiv, options) {

  var chart = new ApexCharts(
    chartdiv,
    options
  );

  chart.render();



  document.querySelector("#recent").addEventListener('click', function(e) {
    containerChartRecent.style.display = "block";
    containerChartAll.style.display = "none";


    document.querySelector("#recent").classList.add('btn-primary');
    document.querySelector("#recent").classList.remove('btn-outline-primary');

    document.querySelector("#all").classList.add('btn-outline-primary');
    document.querySelector("#all").classList.remove('btn-primary');


  })


  document.querySelector("#all").addEventListener('click', function(e) {
    containerChartRecent.style.display = "none";
    containerChartAll.style.display = "block";


    document.querySelector("#all").classList.add('btn-primary');
    document.querySelector("#all").classList.remove('btn-outline-primary');

    document.querySelector("#recent").classList.add('btn-outline-primary');
    document.querySelector("#recent").classList.remove('btn-primary');

  })
  return chart;
}
