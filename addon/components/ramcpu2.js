import Component from '@ember/component';
import layout from '../templates/components/ramcpu2';
import {
  task,
  timeout
} from 'ember-concurrency';
import {
  set
} from '@ember/object';


const chartColors = {
  GREEN: 'rgba(66, 245, 123, 1)',
  YELLOW: 'rgba(239, 245, 66, 1)',
  RED: 'rgba(245, 66, 93, 1)',
}


export default Component.extend({
  store: Ember.inject.service(),
  router: Ember.inject.service(),

  displayName: 'no landscape found',

  didInsertElement() {
    this._super(...arguments);

    this.get('initWidget').perform();
  },

  initWidget: task(function*() {
    //setting the nodeName of this widget

    yield this.get('queryRamCpuSetting').perform();
    yield this.get('createPieChartCPU').perform();
    yield this.get('createPieChartRAM').perform();
    yield this.get('queryData').perform();
    //starting the infinite task for query data every 10s
    this.get('pollServerForChanges').perform();
  }).on('activate').cancelOn('deactivate').drop(),

  pollServerForChanges: task(function*() {
    while (true) {
      yield timeout(10000);
      yield this.get('queryData').perform();
    }
  }).on('activate').cancelOn('deactivate').drop(),


  queryData: task(function*() {
    var myStore = this.get('store');

    myStore.query('ramcpu', {}).then(backendData => {

      if (backendData.length != 0) {
        //data = [];
        var cpuUtilization;
        var usedRam;
        var totalRam;
        var freeRam;


        backendData.forEach(element => {

          //getting the data for each element
          var timestamp = element.get('timestamp');
          var nodeName = element.get('nodeName');

          this.set('timestampLandscape', timestamp);

          var selectedNode = this.get('selectedNode');

          if (selectedNode == null) {
            this.get('queryRamCpuSetting').perform();
            selectedNode = this.get('selectedNode');
          }

          //looking for the right node to set the data
          if (selectedNode == nodeName) {
            this.set('displayName', nodeName);

            cpuUtilization = element.get('cpuUtilization');
            usedRam = element.get('usedRam');
            freeRam = element.get('freeRam');

            totalRam = freeRam + usedRam;
          }

        });


        if (this.get('pieChartCPU') == null) {


          this.get('createPieChartCPU').perform();
        }

        if (this.get('pieChartRAM') == null) {
          this.get('createPieChartRAM').perform();
        }

        this.get('pieChartCPU').chart.data.datasets[0].data = [cpuUtilization * 100, 100 - (cpuUtilization * 100)];

        this.get('pieChartCPU').chart.data.datasets[0].backgroundColor[0] = chartColors.GREEN;
        this.get('pieChartCPU').chart.data.datasets[0].borderColor[0] = chartColors.GREEN;

        if (cpuUtilization  > 0.75 && cpuUtilization  <= 0.85) {
          this.get('pieChartCPU').chart.data.datasets[0].backgroundColor[0] = chartColors.YELLOW;
          this.get('pieChartCPU').chart.data.datasets[0].borderColor[0] = chartColors.YELLOW;
        }

        if (cpuUtilization  > 0.85 && cpuUtilization  <= 1) {
          this.get('pieChartCPU').chart.data.datasets[0].backgroundColor[0] = chartColors.RED;
          this.get('pieChartCPU').chart.data.datasets[0].borderColor[0] = chartColors.RED;
        }

        this.get('pieChartCPU').update();

        //this.get('pieChartCPU').updateSeries([cpuUtilization * 100]);
        //this.get('pieChartRAM').updateSeries([usedRam / totalRam * 100]);



        var displayTotalRam = totalRam / 1000000000;
        var displayUsedRam = usedRam / 1000000000;

        this.get('pieChartRAM').chart.data.datasets[0].data = [usedRam, totalRam - usedRam];



        this.get('pieChartRAM').chart.data.datasets[0].backgroundColor[0] = chartColors.GREEN;
        this.get('pieChartRAM').chart.data.datasets[0].borderColor[0] = chartColors.GREEN;

        if (usedRam / totalRam > 0.5 && usedRam / totalRam <= 0.75) {
          this.get('pieChartRAM').chart.data.datasets[0].backgroundColor[0] = chartColors.YELLOW;
          this.get('pieChartRAM').chart.data.datasets[0].borderColor[0] = chartColors.YELLOW;
        }

        if (usedRam / totalRam > 0.75 && usedRam / totalRam <= 1) {
          this.get('pieChartRAM').chart.data.datasets[0].backgroundColor[0] = chartColors.RED;
          this.get('pieChartRAM').chart.data.datasets[0].borderColor[0] = chartColors.RED;
        }

        this.get('pieChartRAM').update();

        /*
        this.get('pieChartRAM').updateOptions({
          labels: ['Ram: ' + displayUsedRam.toFixed(1) + 'GB /' + displayTotalRam.toFixed(1) + 'GB'],
        });
        */
      }else{
        this.set('timestampLandscape', -1);
      }

    });

  }).on('activate').cancelOn('deactivate').drop(),


  createPieChartCPU: task(function*() {

    var ctx = document.getElementById("cpuChart" + this.elementId);

    var pieChartCPU = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ["CPU Utilisation", "not used"],
        datasets: [{
          label: 'CPU Utilisation',
          data: [0, 100],
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(112, 112, 112, 0.8)'

          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(112, 112, 112, 1)'

          ],
          borderWidth: 1
        }]
      },
      options: {
        rotation: 1 * Math.PI,
        circumference: 1 * Math.PI,

        //legende oben über chart
        legend: {
          display: false,
        },

        tooltips: {
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#000000",
          //bodyFontColor: "#858796",
          borderColor: '#dddfeb',
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          caretPadding: 10,
          callbacks: {
            label: function(tooltipItem, data) {
              var indice = tooltipItem.index;
              return data.labels[indice] + ': ' + data.datasets[0].data[indice].toFixed(1) + ' %';
            }
          }
        },

        elements: {
          center: {
            text: 'CPU',
            //color: '#FF6384', // Default is #000000
            color: '#190707',
            fontStyle: 'Arial', // Default is Arial
            sidePadding: 20 // Defualt is 20 (as a percentage)
          }
        },
        plugins: {
          labels: [plugins_labels_value_cpu],
          outlabels: false,
        }

      },


    });



    this.set('pieChartCPU', pieChartCPU);


  }).on('activate').cancelOn('deactivate').drop(),


  createPieChartRAM: task(function*() {

    var ctx = document.getElementById("ramChart" + this.elementId);

    var pieChartRAM = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ["RAM", "not used"],
        datasets: [{
          label: 'RAM',
          data: [0, 100],
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(112, 112, 112, 0.8)'

          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(112, 112, 112, 1)'

          ],
          borderWidth: 1
        }]
      },
      options: {
        rotation: 1 * Math.PI,
        circumference: 1 * Math.PI,

        //legende oben über chart
        legend: {
          display: false,
        },

        tooltips: {
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#000000",
          //bodyFontColor: "#858796",
          borderColor: '#dddfeb',
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          caretPadding: 10,
          callbacks: {
            label: function(tooltipItem, data) {
              var indice = tooltipItem.index;
              var used = data.datasets[0].data[0] / (1024*1024*1024);  // 4* 1024
              var total = data.datasets[0].data[1] /  (1024*1024*1024) + used;

              return data.labels[indice] + ': ' + used.toFixed(1) + ' GB / ' + total.toFixed(1) + ' GB';
            }
          }
        },

        elements: {
          center: {
            text: 'RAM',
            //color: '#FF6384', // Default is #000000
            color: '#190707',
            fontStyle: 'Arial', // Default is Arial
            sidePadding: 20 // Defualt is 20 (as a percentage)
          }
        },

        plugins: {
          labels: [plugins_labels_value_ram],
          outlabels: false,
        }


      },


    });



    this.set('pieChartRAM', pieChartRAM)
  }).on('activate').cancelOn('deactivate').drop(),


  queryRamCpuSetting: task(function*() {

    var store = this.get('store');


    yield store.queryRecord('ramcpusetting', {
      instanceID: this.elementId
    }).then(backendData => {

      if (backendData != null) {
        var nodeName = backendData.get('nodeName');
        this.set('selectedNode', nodeName);
      }

    });
  }).on('activate').cancelOn('deactivate').drop(),

  actions: {
    remove() {
      var ctx = document.getElementById(this.elementId);
      ctx.style.display = "none";

      const myStore = this.get('store');

      //getting the user id
      var userID = 0;
      let users = myStore.peekAll('user');
      users.forEach((item) => {
        if (item) {
          userID = item.get('id');
        }
      });

      //send post request with timestamp -1 => if timestamp is -1 the entry will be deleted
      let post = myStore.createRecord('instantiatedwidget', {
        userID: userID,
        timestamp: -1,
        widgetName: "",
        instanceID: this.elementId,
        orderID: 0
      });
      post.save();
    },
  },

  layout
});

const plugins_labels_value_cpu = {
  render: 'percentage',
  // font color, can be color array for each data or function for dynamic color, default is defaultFontColor
  fontColor: '#000000',
  overlap: true,
  // font style, default is defaultFontStyle
  fontStyle: 'normal',
  position: 'border',
  // font family, default is defaultFontFamily
  fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

};

const plugins_labels_value_ram = {
  render: 'value',
  // font color, can be color array for each data or function for dynamic color, default is defaultFontColor
  fontColor: '#000000',
  overlap: true,
  // font style, default is defaultFontStyle
  fontStyle: 'normal',
  position: 'border',
  // font family, default is defaultFontFamily
  fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

  render: function (args) {
    var result = args.value / (1024*1024*1024)
    return result.toFixed(1) + ' GB';
  }
};

Chart.pluginService.register({
  beforeDraw: function(chart) {
    if (chart.config.options.elements.center) {
      //Get ctx from string
      var ctx = chart.chart.ctx;

      //Get options from the center object in options
      var centerConfig = chart.config.options.elements.center;
      var fontStyle = centerConfig.fontStyle || 'Arial';
      var txt = centerConfig.text;
      var color = centerConfig.color || '#000';
      var sidePadding = centerConfig.sidePadding || 20;
      var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
      //Start with a base font of 30px
      ctx.font = "30px " + fontStyle;

      //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
      var stringWidth = ctx.measureText(txt).width;
      var txtHeight = parseInt(ctx.font);
      var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

      // Find out how much the font can grow in width.
      var widthRatio = elementWidth / stringWidth;
      var newFontSize = Math.floor(30 * widthRatio);
      var elementHeight = (chart.innerRadius * 2);

      // Pick a new font size so it will not be larger than the height of label.
      var fontSizeToUse = Math.min(newFontSize, elementHeight);

      //Set font settings to draw it correctly.
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
      var centerY = chart.chartArea.bottom - (fontSizeToUse / 2) + ((sidePadding / 100) * chart.innerRadius * 0.8);
      ctx.font = fontSizeToUse + "px " + fontStyle;
      ctx.fillStyle = color;

      //Draw text in center
      ctx.fillText(txt, centerX, centerY);
    }
  }
});