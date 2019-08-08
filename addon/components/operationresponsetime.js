import Component from '@ember/component';
import layout from '../templates/components/operationresponsetime';
import {
  task,
  timeout
} from 'ember-concurrency';

export default Component.extend({
  store: Ember.inject.service(),

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
  }).on('activate').cancelOn('deactivate').restartable(),

  queryData: task(function*() {
    const myStore = this.get('store');

    myStore.query('operationresponsetime', {
      limit: 5
    }).then(backendData => {


      var labels = [];
      var data = [];
      backendData.forEach(element => {
        labels.push(element.get('operationName'));
        data.push(element.get('averageResponseTime'));
      });

      var chart = this.get('chart');

      if (chart != null) {
        chart.data.labels = labels;
        chart.data.datasets[0].data = data;
        chart.update();
      }

    });
  }).on('activate').cancelOn('deactivate').drop(),

  createChart: task(function*() {
    Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    //Chart.defaults.global.defaultFontColor = '#858796';

    var myPieChart = document.getElementById('operationresponsetimeCanvas_' + this.elementId);
    var chart = new Chart(myPieChart, {
      type: 'pie',
      data: {
        labels: ['no landscape available'],
        datasets: [{
          data: [1],
          //backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
          //backgroundColor: randomColorArray(1),
          //hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
          //hoverBorderColor: "rgba(234, 236, 244, 1)",
        }],
      },
      options: {
        maintainAspectRatio: false,
        aspectRatio: 1,
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

              // identifies whether or not labels of value 0 are displayed, default is false
              showZero: true,
              fontSize: 12,
              fontColor: '#3b4049',
              fontStyle: 'normal',
              fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
              shadowBlur: 10,
              shadowOffsetX: -5,
              shadowOffsetY: 5,
              shadowColor: 'rgba(255,0,0,0.75)',



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

          ],
          colorschemes: {
            scheme: 'tableau.ClassicCyclic13'
          }
        }

      },
    });
    this.set('chart', chart);

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
