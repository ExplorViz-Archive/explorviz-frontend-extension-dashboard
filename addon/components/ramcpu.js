import Component from '@ember/component';
import layout from '../templates/components/ramcpu';
import {
  task,
  timeout
} from 'ember-concurrency';
import {
  set
} from '@ember/object';



var selectedNode; //string

export default Component.extend({
  store: Ember.inject.service(),
  router: Ember.inject.service(),

  displayName: 'no landscape found',

  //starts the task for getting the data from the backend every 10s.
  init() {
    this._super(...arguments);

    let task = this.get('pollServerForChanges');
    let taskInstance = task.perform();
  },

  //getting new data on every render operation
  didRender() {
    this._super(...arguments);

    queryData(this.get('store'), this);
  },

  didInsertElement() {
    this._super(...arguments);

    createPieChartCPU(this);
    createPieChartRAM(this);
    queryData(this.get('store'), this);

    //console.log(this.elementId);

    //Ember.getOwner(this).lookup('router:main').transitionTo('widgetsettings');
    //this.get('router').transitionTo('widgetsettings');
  },


  pollServerForChanges: task(function*() {
    while (true) {
      yield timeout(10000);
      //console.log("pollServerForChanges: ID: " + this.elementId);

      queryData(this.get('store'), this);

    }
  }).on('activate').cancelOn('deactivate').restartable(),

  layout
});






function queryData(myStore, self) {

  //Promise wird asychnone aufgeführt !
  myStore.query('ramcpu', {}).then(function(backendData) {

    if (backendData.length != 0) {
      //data = [];
      var cpuUtilization;
      var usedRam;
      var totalRam;
      var freeRam;

      backendData.forEach(function(element) {



        //getting the data for each element
        var timestamp = element.get('timestamp');
        var nodeName = element.get('nodeName');


        //console.log(selectedNode);

        if (selectedNode == null) {
          console.log("was null !");
          selectedNode = nodeName;
        }

        //looking for the right node to set the data
        if (selectedNode == nodeName) {
          //console.log(selectedNode);
          set(self, "displayName", nodeName);

          cpuUtilization = element.get('cpuUtilization');
          usedRam = element.get('usedRam');
          freeRam = element.get('freeRam');

          totalRam = freeRam + usedRam;
        }





        /*
        data.push({
          timestamp,
          nodeName,
          cpuUtilization,
          usedRam,
          totalRam
        });
        */



      });



      /*
          var result = data.map(function(a) {
            return a.nodeName;
          })[0];
          console.log(result);
          */


      if (self.get('pieChartCPU') == null) {
        //console.log("pieChartCPU was null");
        createPieChartCPU(self);
      }

      if (self.get('pieChartRAM') == null) {
        createPieChartRAM(self);
      }


      self.get('pieChartCPU').updateSeries([cpuUtilization * 100]);
      self.get('pieChartRAM').updateSeries([usedRam / totalRam * 100]);


      var displayTotalRam = totalRam / 1000000000;
      var displayUsedRam = usedRam / 1000000000;


      self.get('pieChartRAM').updateOptions({
        labels: ['Ram: ' + displayUsedRam.toFixed(1) + 'GB /' + displayTotalRam.toFixed(1) + 'GB'],
      });
    }

  });
}



function createPieChartCPU(self) {

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
    document.querySelector("#cpuChart" + self.elementId),
    options
  );

  pieChartCPU.render();

  self.set('pieChartCPU', pieChartCPU);

}

function createPieChartRAM(self) {

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
    document.querySelector("#ramChart" + self.elementId),
    options
  );

  pieChartRAM.render();

  self.set('pieChartRAM', pieChartRAM)

}
