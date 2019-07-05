import Component from '@ember/component';
import layout from '../templates/components/activeclassinstances';
import {
  task,
  timeout
} from 'ember-concurrency';

//import 'chartjs-plugin-labels';


var numberDisplayed = 5;

export default Component.extend({

  store: Ember.inject.service(),



  queryDataLoop: task(function*() {
    while (true) {
      yield timeout(10000); // wait 10 seconds
      yield this.get('queryData').perform();
    }
  }).on('activate').cancelOn('deactivate').restartable(),


  didInsertElement() {
    this._super(...arguments);
    this.get('initWidget').perform();
  },

  initWidget: task(function*() {
    yield this.get('createChart').perform();
    yield this.get('queryData').perform();
    this.get('queryDataLoop').perform();

  }).on('activate').cancelOn('deactivate').drop(),

  queryData: task(function*() {
    const myStore = this.get('store');

    myStore.query('activeclassinstances', {
      amount: numberDisplayed
    }).then(activeclassinstances => {


      var labels = [];
      var data = [];
      activeclassinstances.forEach(element => {
        labels.push(element.get('className'));
        data.push(element.get('instances'));
      });


      var chart = this.get('chart');

      if (chart != null) {
        chart.data.labels = labels;
        chart.data.datasets[0].data = data;
        chart.update();
      }

      var displayLegend = true;
      if (data.length >= 5) {
        displayLegend = false;
      }

      //hier update statt createChart
      //
      //
      //
      //hier weitermachen !!
      createChart(labels, data, displayLegend);

    });
  }).on('activate').cancelOn('deactivate').drop(),

  createChart: task(function*() {
    Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    //Chart.defaults.global.defaultFontColor = '#858796';

    var myPieChart = document.getElementById('activeclassinstancesCanvas');

    //console.log(myPieChart);

    var chart = new Chart(myPieChart, {
      type: 'pie',
      data: {
        labels: ['no landscape available'],
        datasets: [{
          data: [1],
          //backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
          backgroundColor: randomColorArray(myData.get('length')),
          hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
          hoverBorderColor: "rgba(234, 236, 244, 1)",
        }],
      },
      options: {
        maintainAspectRatio: false,
        tooltips: {
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#858796",
          borderColor: '#dddfeb',
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          caretPadding: 10,
        },
        legend: {
          display: true
        },
        cutoutPercentage: 0,

        plugins: {
          labels: [{
              // render 'label', 'value', 'percentage', 'image' or custom function, default is 'percentage'
              render: 'label',

              // precision for percentage, default is 0
              precision: 0,

              // identifies whether or not labels of value 0 are displayed, default is false
              showZero: true,

              // font size, default is defaultFontSize
              fontSize: 12,

              // font color, can be color array for each data or function for dynamic color, default is defaultFontColor
              fontColor: '#3b4049',

              // font style, default is defaultFontStyle
              fontStyle: 'normal',

              // font family, default is defaultFontFamily
              fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

              // draw text shadows under labels, default is false
              textShadow: false,

              // text shadow intensity, default is 6
              shadowBlur: 10,

              // text shadow X offset, default is 3
              shadowOffsetX: -5,

              // text shadow Y offset, default is 3
              shadowOffsetY: 5,

              // text shadow color, default is 'rgba(0,0,0,0.3)'
              shadowColor: 'rgba(255,0,0,0.75)',

              // draw label in arc, default is false
              // bar chart ignores this
              arc: false,

              // position to draw label, available value is 'default', 'border' and 'outside'
              // bar chart ignores this
              // default is 'default'
              position: 'outside',

              // draw label even it's overlap, default is true
              // bar chart ignores this
              overlap: true,

              // show the real calculated percentages from the values and don't apply the additional logic to fit the percentages to 100 in total, default is false
              showActualPercentages: true,

              // add padding when position is `outside`
              // default is 2
              outsidePadding: 4,

              // add margin of text when position is `outside` or `border`
              // default is 2
              textMargin: 4
            },
            {
              render: 'value',
              // font color, can be color array for each data or function for dynamic color, default is defaultFontColor
              fontColor: '#3b4049',

              // font style, default is defaultFontStyle
              fontStyle: 'normal',

              // font family, default is defaultFontFamily
              fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            }

          ]
        }

      },
    });
    this.set('chart', chart);

  }).on('activate').cancelOn('deactivate').drop(),

  layout
});




var colorPalette = ['#8883FD', '#7AE6CC', '#DBFA8E', '#EBC791', '#FD83A7'];

function randomColor() {
  var r = Math.floor(Math.random() * 255);
  var g = Math.floor(Math.random() * 255);
  var b = Math.floor(Math.random() * 255);
  return "rgb(" + r + "," + g + "," + b + ")";
}

function randomColorArray(length) {
  var array = [];
  for (var i = 0; i <= length; i++) {
    //array.push(randomColor());
    array.push(colorPalette[i % 5]);
  }
  return array;
}
