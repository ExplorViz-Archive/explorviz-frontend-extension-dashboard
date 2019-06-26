import Component from '@ember/component';
import layout from '../templates/components/ramcpu';
import {
  task,
  timeout
} from 'ember-concurrency';
import {
  set
} from '@ember/object';

var data = [];
var pieChartCPU;
var pieChartRAM;

var selectedNode; //string

export default Component.extend({
  store: Ember.inject.service(),
  displayName: 'placeholder',

  init() {
    this._super(...arguments);
    let task = this.get('pollServerForChanges');
    let taskInstance = task.perform();
  },

  didRender() {
    this._super(...arguments);

    queryData(this.get('store'), this);
  },

  didInsertElement() {
    this._super(...arguments);

    createPieChartCPU();
    createPieChartRAM();
    queryData(this.get('store'), this);
  },


  pollServerForChanges: task(function*() {
    while (true) {
      yield timeout(10000);

      queryData(this.get('store'), this);

    }
  }).on('activate').cancelOn('deactivate').restartable(),

  layout
});






function queryData(myStore, obj) {

  //Promise wird asychnone aufgeführt !
  myStore.query('ramcpu', {}).then(function(backendData) {

    data = [];
    var cpuUtilization;
    var usedRam;
    var totalRam;

    backendData.forEach(function(element) {

      var timestamp = element.get('timestamp');
      var nodeName = element.get('nodeName');


      set(obj, "displayName", nodeName);

      cpuUtilization = element.get('cpuUtilization');
      var freeRam = element.get('freeRam');
      usedRam = element.get('usedRam');

      totalRam = freeRam + usedRam;

      data.push({
        timestamp,
        nodeName,
        cpuUtilization,
        usedRam,
        totalRam
      });



    });



    /*
        var result = data.map(function(a) {
          return a.nodeName;
        })[0];
        console.log(result);
        */


    if (pieChartCPU == null) {
      //console.log("pieChartCPU was null");
      createPieChartCPU();
    }

    if (pieChartRAM == null) {
      createPieChartRAM();
    }


    pieChartCPU.updateSeries([cpuUtilization * 100]);

    pieChartRAM.updateSeries([usedRam / totalRam * 100]);


    var displayTotalRam = totalRam / 1000000000;
    var displayUsedRam = usedRam / 1000000000;


    pieChartRAM.updateOptions({
      labels: ['Ram: ' + displayUsedRam.toFixed(1) + 'GB /' + displayTotalRam.toFixed(1) + 'GB'],
      fill: {
        gradient: {
          stops: [0, 100]
        }
      },
    });


  });
}



function createPieChartCPU() {

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
    series: [75],
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

  pieChartCPU = new ApexCharts(
    document.querySelector("#cpuChart"),
    options
  );

  pieChartCPU.render();



}

function createPieChartRAM() {

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
    series: [75],
    stroke: {
      lineCap: 'round'
    },
    labels: ['Ram'],

  }

  pieChartRAM = new ApexCharts(
    document.querySelector("#ramChart"),
    options
  );

  pieChartRAM.render();



}
