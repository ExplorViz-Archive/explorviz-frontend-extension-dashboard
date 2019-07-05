import Component from '@ember/component';
import layout from '../templates/components/ramcpu';
import {
  task,
  timeout
} from 'ember-concurrency';
import {
  set
} from '@ember/object';





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
      console.log("ramcpu - pollServerForChanges: " +this.elementId);
    }
  }).on('activate').cancelOn('deactivate').drop(),


  queryData: task(function*() {
    console.log("task queryData ausgeführt");
    var myStore = this.get('store');

    /*
    var result = yield myStore.query('ramcpu', {});

    if(result != null && result.length != 0)
    {
      for(var i = 0; i < result.length; i++)
      {
        console.log(result.length);
        console.log(result[i]);
      }
    }
    */

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

          //console.log(selectedNode);

          var selectedNode = this.get('selectedNode');

          if (selectedNode == null) {
            console.log("selectedNode was null !");
            this.get('queryRamCpuSetting').perform();
            selectedNode = this.get('selectedNode');
            console.log(selectedNode);
          }

          //looking for the right node to set the data
          if (selectedNode == nodeName) {
            //console.log(selectedNode);
            console.log(nodeName);
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


        this.get('pieChartCPU').updateSeries([cpuUtilization * 100]);
        this.get('pieChartRAM').updateSeries([usedRam / totalRam * 100]);


        var displayTotalRam = totalRam / 1000000000;
        var displayUsedRam = usedRam / 1000000000;


        this.get('pieChartRAM').updateOptions({
          labels: ['Ram: ' + displayUsedRam.toFixed(1) + 'GB /' + displayTotalRam.toFixed(1) + 'GB'],
        });
      }

    });

  }).on('activate').cancelOn('deactivate').drop(),


  createPieChartCPU: task(function*() {
    console.log("create chart cpu");
    var options = {
      chart: {
        type: 'radialBar',
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        radialBar: {
          startAngle: 0,
          endAngle: 360,
          hollow: {
            margin: 0,
            size: '70%',
            background: '#fff',
            image: undefined,
            imageOffsetX: 0,
            imageOffsetY: 0,
            position: 'front',
            dropShadow: {
              enabled: true,
              top: 3,
              left: 0,
              blur: 4,
              opacity: 0.24
            }
          },
          track: {
            background: '#fff',
            strokeWidth: '67%',
            margin: 0, // margin is in pixels
            dropShadow: {
              enabled: true,
              top: -3,
              left: 0,
              blur: 4,
              opacity: 0.35
            }
          },

          dataLabels: {
            showOn: 'always',
            name: {
              offsetY: -10,
              show: true,
              color: '#888',
              fontSize: '17px'
            },
            value: {
              formatter: function(val) {
                return parseInt(val) + '%';
              },
              color: '#111',
              fontSize: '36px',
              show: true,
            }
          }
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0.5,
          //gradientToColors: ['#ABE5A1'],
          gradientToColors: ['#B80F0A'],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
      series: [0],
      stroke: {
        lineCap: 'round'
      },
      labels: ['Cpu Utilization'],
      /*
      legend: {
       show: true,

       floating: false,
       position: 'bottom', // whether to position legends in 1 of 4
       // direction - top, bottom, left, right
       horizontalAlign: 'center', // when position top/bottom, you can
       // specify whether to align legends
       // left, right or center
       verticalAlign: 'middle',
       fontSize: '12px',
       fontFamily: undefined,
       textAnchor: 'start',
       labels: {
         colors: undefined,
         useSeriesColors: false
       },
     }
     */

    }

    var pieChartCPU = new ApexCharts(
      document.querySelector("#cpuChart" + this.elementId),
      options
    );

    pieChartCPU.render();

    this.set('pieChartCPU', pieChartCPU);


  }).on('activate').cancelOn('deactivate').drop(),


  createPieChartRAM: task(function*() {
    console.log("createchartram");
    var options = {
      chart: {
        //height: 150,
        type: 'radialBar',
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        radialBar: {
          startAngle: 0,
          endAngle: 360,
          hollow: {
            margin: 0,
            size: '70%',
            background: '#fff',
            image: undefined,
            imageOffsetX: 0,
            imageOffsetY: 0,
            position: 'front',
            dropShadow: {
              enabled: true,
              top: 3,
              left: 0,
              blur: 4,
              opacity: 0.24
            }
          },
          track: {
            background: '#fff',
            strokeWidth: '67%',
            margin: 0, // margin is in pixels
            dropShadow: {
              enabled: true,
              top: -3,
              left: 0,
              blur: 4,
              opacity: 0.35
            }
          },

          dataLabels: {
            showOn: 'always',
            name: {
              offsetY: -10,
              show: true,
              color: '#888',
              fontSize: '17px'
            },
            value: {
              formatter: function(val) {
                return parseInt(val) + '%';
              },
              color: '#111',
              fontSize: '36px',
              show: true,
            }
          }
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0.5,
          //gradientToColors: ['#ABE5A1'],
          gradientToColors: ['#2ACB76'],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
      series: [0],
      stroke: {
        lineCap: 'round'
      },
      labels: ['Ram'],

    }


    var pieChartRAM = new ApexCharts(
      document.querySelector("#ramChart" + this.elementId),
      options
    );

    pieChartRAM.render();

    this.set('pieChartRAM', pieChartRAM)
  }).on('activate').cancelOn('deactivate').drop(),


  queryRamCpuSetting: task(function*() {

    var store = this.get('store');


    store.queryRecord('ramcpusetting', {
      instanceID: this.elementId
    }).then(backendData => {

      if (backendData != null) {
        var nodeName = backendData.get('nodeName');
        this.set('selectedNode', nodeName);
      }

    });
  }).on('activate').cancelOn('deactivate').drop(),

  layout
});
