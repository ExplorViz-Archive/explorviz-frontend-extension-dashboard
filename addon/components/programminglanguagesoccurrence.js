import Component from '@ember/component';
import layout from '../templates/components/programminglanguagesoccurrence';
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



  didRender() {
    this._super(...arguments);
    this.get('queryData').perform();
  },

  initWidget: task(function*() {
    yield this.get('createChart').perform();
    yield this.get('queryData').perform();
    this.get('pollServerForChanges').perform();
  }).on('activate').cancelOn('deactivate').drop(),

  pollServerForChanges: task(function*() {
    while (true) {
      yield timeout(10000);
      this.get('queryData').perform();
    }
  }).on('activate').cancelOn('deactivate').drop(),

  queryData: task(function*() {
    var myStore = this.get('store');
    myStore.query('programminglanguagesoccurrence', {}).then(backendData => {
      if (backendData.length != 0) {

        this.set('data', []);
        this.set('labels', []);


        backendData.forEach(element => {

          //var timestamp = element.get('timestamp');
          var programminglanguage = element.get('programminglanguage');
          var occurs = element.get('occurs');


          this.get('data').push(occurs);
          this.get('labels').push(programminglanguage);
        });


        if (this.get('chart') == null) {
          this.get('createChart').perform();
        }

        this.get('chart').updateSeries(this.get('data'));
        this.get('chart').updateOptions({
          labels: this.get('labels'),
        });
      }
    });

  }).on('activate').cancelOn('deactivate').drop(),

  createChart: task(function*() {
    var options = {
      chart: {
        type: 'donut',
        height: 275,
      },
      dataLabels: {
        enabled: true
      },
      series: [0],
      labels: ['no landscape found'],
      responsive: [{
        breakpoint: 480,

        options: {
          legend: {
            show: true,
            position: 'bottom'
          }
        }

      }],
      legend: {
        position: 'bottom',
        offsetY: 0,
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
            }
          }
        }
      }
    }

    var chart = new ApexCharts(
      document.querySelector("#programminglanguagesoccurrenceChart" + this.elementId),
      options
    );

    chart.render();
    this.set('chart', chart)
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
