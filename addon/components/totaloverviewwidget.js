import Component from '@ember/component';
import layout from '../templates/components/totaloverviewwidget';

export default Component.extend({
  //tagName = 'col-xl-4 col-lg-5',
  classNameBindings: ['col-xl-4', 'col-lg-5'],

  store: Ember.inject.service(),



  totaloverviewwidget: Ember.computed(function(){
    const myStore = this.get('store');
    return myStore.queryRecord('totaloverviewwidget', {});

  }).volatile(),


  didInsertElement()
  {
    this._super(...arguments);

    const myStore = this.get('store');

    myStore.queryRecord('totaloverviewwidget', {}).then(function(totaloverviewwidget) {
      let name = totaloverviewwidget.get('name');
      console.log(`Name: ${name}`);

      createChart( totaloverviewwidget.get('numberOfSystems'), totaloverviewwidget.get('numberOfNodes'), totaloverviewwidget.get('numberOfApplications'));

    });

  },





  layout
});

function createChart(numberOfSystems, numberOfNodes, numberOfApplications)
{

  Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
  Chart.defaults.global.defaultFontColor = '#858796';

  var myPieChart = document.getElementById('myPieChart');

  var myDoughnutChart = new Chart(myPieChart, {
    type: 'doughnut',
    data: {
      labels: ["Systems", "Nodes", "Applications"],
      datasets: [{
        data: [numberOfSystems, numberOfNodes, numberOfApplications],
        backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
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
        display: true
      },
      cutoutPercentage: 80,
    },
  });
}
