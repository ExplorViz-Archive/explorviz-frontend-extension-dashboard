import Component from '@ember/component';
import layout from '../templates/components/totaloverviewwidget';
import {
  task,
  timeout
} from 'ember-concurrency';

export default Component.extend({

  store: Ember.inject.service(),
  modalservice: Ember.inject.service('modal-content'),
  
  didInsertElement() {
    this._super(...arguments);
    this.get('initWidget').perform();

  },

  initWidget: task(function*() {
    yield this.get('createChart').perform();
    yield this.get('queryData').perform();
    this.get('queryDataLoop').perform();

  }).on('activate').cancelOn('deactivate').drop(),

  queryDataLoop: task(function*() {
    while (true) {
      yield timeout(10000); // wait 10 seconds

      yield this.get('queryData').perform();
    }

  }).on('activate').cancelOn('deactivate').drop(),

  queryData: task(function*() {
    const myStore = this.get('store');

    myStore.queryRecord('totaloverviewwidget', {}).then(data => {

      if (data.length != 0) {

        let name = data.get('name');
        var chart = this.get('chart');

        if (data.get('numberOfSystems') == 0 && data.get('numberOfNodes') == 0 && data.get('numberOfApplications') == 0) {
          this.set('timestampLandscape', -1);
          chart.data.labels = ["nothing found for the latest landscape"];
          chart.data.datasets[0].data = [1];
        } else {

          chart.data.labels = ["Systems", "Nodes", "Applications"];
          chart.data.datasets[0].data = [data.get('numberOfSystems'), data.get('numberOfNodes'), data.get('numberOfApplications')];
          this.set('timestampLandscape', data.get('timestamp'));
        }
        chart.update();
      } else {
        this.set('timestampLandscape', -1);
      }

    });

  }).on('activate').cancelOn('deactivate').drop(),

  createChart: task(function*() {
    Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    //Chart.defaults.global.defaultFontColor = '#000000';

    var myPieChart = document.getElementById('totaloverviewChart' + this.elementId);

    var myDoughnutChart = new Chart(myPieChart, {
      type: 'doughnut',
      data: {
        labels: ["no landscape available"],
        datasets: [{
          data: [1],
          backgroundColor: ['#FFC107', '#1E88E5', '#D81B60'],
          //hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
          //hoverBorderColor: "rgba(234, 236, 244, 1)",
        }],
      },
      options: {
        maintainAspectRatio: false,
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
        },
        legend: {
          display: true,
          fontColor: "#000000"
        },
        cutoutPercentage: 60,

        plugins: {
          outlabels: false,
          labels: [{
              render: 'value',
              // font color, can be color array for each data or function for dynamic color, default is defaultFontColor
              fontColor: '#000000',

              // font style, default is defaultFontStyle
              fontStyle: 'normal',

              // font family, default is defaultFontFamily
              fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            }

          ]
        }
      },
    });

    this.set('chart', myDoughnutChart);

  }).on('activate').cancelOn('deactivate').drop(),

  actions: {
    loadWidgetInfo(){
      this.get('modalservice').setWidget("totaloverviewwidget");
    },
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
