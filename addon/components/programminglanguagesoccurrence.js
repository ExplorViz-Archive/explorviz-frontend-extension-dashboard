import Component from '@ember/component';
import layout from '../templates/components/programminglanguagesoccurrence';
import {
  task,
  timeout
} from 'ember-concurrency';

/*
This is the component for the programming languages occurence widget.
*/
export default Component.extend({

  store: Ember.inject.service(),
  modalservice: Ember.inject.service('modal-content'),

  //start the init widget task
  didInsertElement() {
    this._super(...arguments);
    this.get('initWidget').perform();
  },

  //start the queryData task if the widget is getting rendered
  didRender() {
    this._super(...arguments);
    this.get('queryData').perform();
  },

  //init the widget -> create chart and start query for data tasks
  initWidget: task(function*() {
    yield this.get('createChart').perform();
    yield this.get('queryData').perform();
    this.get('pollServerForChanges').perform();
  }).on('activate').cancelOn('deactivate').drop(),

  //requests every 10 seconds new data from the backend
  pollServerForChanges: task(function*() {
    while (true) {
      yield timeout(10000);
      this.get('queryData').perform();
    }
  }).on('activate').cancelOn('deactivate').drop(),

  //requests the newest data from the backend
  queryData: task(function*() {
    var myStore = this.get('store');
    myStore.query('programminglanguagesoccurrence', {}).then(backendData => {
      if (backendData.length != 0) {

        this.set('data', []);
        this.set('labels', []);

        backendData.forEach(element => {

          var programminglanguage = element.get('programminglanguage');
          var occurs = element.get('occurs');
          this.set('timestamp', element.get('timestamp'));

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
      } else {
        this.set('timestamp', -1);
      }
    });

  }).on('activate').cancelOn('deactivate').drop(),

  //create the chart for this widget
  createChart: task(function*() {
    var options = {
      chart: {
        type: 'donut',
        height: 300,
        fontFamily: 'Arial',
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
        position: 'top',
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
    loadWidgetInfo() {
      this.get('modalservice').setWidget("programminglanguagesoccurrence");
    },

    //action to remove this widget from the dashboard
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
