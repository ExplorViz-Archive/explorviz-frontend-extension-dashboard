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

    backendData.forEach(function(element) {

      var timestamp = element.get('timestamp');
      var nodeName = element.get('nodeName');


      set(obj, "displayName", nodeName);

      cpuUtilization = element.get('cpuUtilization');
      var freeRam = element.get('freeRam');
      var usedRam = element.get('usedRam');

      data.push({
        timestamp,
        nodeName,
        cpuUtilization,
        freeRam,
        usedRam
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


    pieChartCPU.updateSeries([cpuUtilization * 100]);
    //pieChartCPU.updateSeries([100]);

  });
}



function createPieChartCPU() {

  var options = {
    chart: {
      height: 350,
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
              return parseInt(val);
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
    labels: ['Percent'],

  }

  pieChartCPU = new ApexCharts(
    document.querySelector("#cpuChart"),
    options
  );

  pieChartCPU.render();



}
