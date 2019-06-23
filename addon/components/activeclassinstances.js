import Component from '@ember/component';
import layout from '../templates/components/activeclassinstances';
import { task, timeout } from 'ember-concurrency';

//import 'chartjs-plugin-labels';

var chart;
var numberDisplayed = 5;

export default Component.extend({

  store: Ember.inject.service(),



  pollServerForChanges: task(function * () {
    while (true) {
      yield timeout(10000); // wait 10 seconds
      //this.get('store').query(...)
      //console.log("hello from task");

      const myStore = this.get('store');

      myStore.query('activeclassinstances', {amount: numberDisplayed}).then(function(activeclassinstances) {


      var labels = [];
      var data = [];

      if(activeclassinstances != null){

        activeclassinstances.forEach(function(element) {
          labels.push(element.get('className'));
          data.push(element.get('instances'));
          //console.log(element.get('className'));
          //console.log(element.get('instances'));
        });
      }

      if(chart != null)
      {
        //console.log("chart nicht null");
        //console.log(chart);
        chart.data.labels = labels;
        chart.data.datasets[0].data = data;
        //color hier ändern falls daten hinzu/wegfallen ?!

        chart.update();

      }

      });

    }
  }).on('activate').cancelOn('deactivate').restartable(),

  init(){
      this._super(...arguments);
      //pollServerForChanges();
       let task = this.get('pollServerForChanges');
       let taskInstance = task.perform();
  },

  didInsertElement()
  {
    this._super(...arguments);

    const myStore = this.get('store');

    myStore.query('activeclassinstances', {amount: numberDisplayed}).then(function(activeclassinstances) {


    var labels = [];
    var data = [];
    activeclassinstances.forEach(function(element) {
      labels.push(element.get('className'));
      data.push(element.get('instances'));
      //console.log(element.get('className'));
      //console.log(element.get('instances'));
    });

    //var l = labels.slice(0,3);
    //var d = data.slice(0,3);

    //console.log(d);

    var displayLegend = true;
    if(data.length >= 5)
    {
      displayLegend = false;
    }

    createChart(labels, data, displayLegend);

      });
  },

  layout
});


function createChart(myLabels, myData, displayLegend)
{

  Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
  Chart.defaults.global.defaultFontColor = '#858796';

  var myPieChart = document.getElementById('activeclassinstancesCanvas');

  //console.log(myPieChart);

  chart = new Chart(myPieChart, {
    type: 'pie',
    data: {
      labels: myLabels,
      datasets: [{
        data: myData,
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
        display: displayLegend
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
        textShadow: true,

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



}

var colorPalette = ['#8883FD', '#7AE6CC', '#DBFA8E' , '#EBC791', '#FD83A7'];

function randomColor() {
  var r = Math.floor(Math.random() * 255);
  var g = Math.floor(Math.random() * 255);
  var b = Math.floor(Math.random() * 255);
  return "rgb(" + r + "," + g + "," + b + ")";
}

function randomColorArray(length)
{
  var array = [];
  for(var i = 0; i <= length; i++)
  {
    //array.push(randomColor());
    array.push(colorPalette[i%5]);
  }
  return array;
}
