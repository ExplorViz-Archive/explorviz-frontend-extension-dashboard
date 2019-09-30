'use strict';

module.exports = {
  name: require('./package').name,

  //this is for live reload ember on change
  isDevelopingAddon() {
    return true;
  },

  //addin dependecys into the project
  included() {
    this._super.included.apply(this, arguments);


    this.import('node_modules/startbootstrap-sb-admin-2/css/sb-admin-2.css');
    this.import('node_modules/startbootstrap-sb-admin-2/js/sb-admin-2.js');

    this.import('node_modules/startbootstrap-sb-admin-2/vendor/fontawesome-free/css/all.css');
    this.import('node_modules/startbootstrap-sb-admin-2/vendor/fontawesome-free/js/all.js');

    this.import('node_modules/apexcharts/dist/apexcharts.js');


    this.import('node_modules/moment/moment.js');
    this.import('node_modules/chart.js/dist/Chart.js');
    this.import('node_modules/chart.js/dist/Chart.css');

    this.import('node_modules/chartjs-plugin-labels/build/chartjs-plugin-labels.min.js');


    this.import('node_modules/chartjs-plugin-datalabels/dist/chartjs-plugin-datalabels.js');

    this.import('node_modules/bootstrap/dist/css/bootstrap.css');

    this.import('node_modules/chartjs-plugin-streaming/dist/chartjs-plugin-streaming.js');


    this.import('node_modules/hammerjs/hammer.js');
    this.import('node_modules/chartjs-plugin-zoom/dist/chartjs-plugin-zoom.js');


    this.import('node_modules/chartjs-plugin-colorschemes/dist/chartjs-plugin-colorschemes.js');


    //new new labels piechart
    this.import('node_modules/chartjs-plugin-piechart-outlabels/dist/chartjs-plugin-piechart-outlabels.js');


    //pictures for the different widget infos.
    this.import('vendor/assets/images/activeclassinstances_info.jpg');
    this.import('vendor/assets/images/aggregatedresponsetime_info.jpg');
    this.import('vendor/assets/images/eventlog_info.jpg');
    this.import('vendor/assets/images/operationresponsetime_info.jpg');
    this.import('vendor/assets/images/programminglanguagesoccurrence_info.jpg');
    this.import('vendor/assets/images/ramcpu_info.jpg');
    this.import('vendor/assets/images/totaloverview_info.jpg');
    this.import('vendor/assets/images/totalrequests_info.jpg');
    this.import('vendor/assets/images/aggregatedresponsetime_piechart_info.jpg');
    this.import('vendor/assets/images/operationresponsetime_table_info.jpg');

    //pictures for the dashboard settings popups.
    this.import('vendor/assets/images/widgetpreview/activeclassinstances.png');
    this.import('vendor/assets/images/widgetpreview/aggregatedresponsetime_piechart.png');
    this.import('vendor/assets/images/widgetpreview/aggregatedresponsetime.png');
    this.import('vendor/assets/images/widgetpreview/eventlog.png');
    this.import('vendor/assets/images/widgetpreview/operationresponsetime_table.png');
    this.import('vendor/assets/images/widgetpreview/operationresponsetime.png');
    this.import('vendor/assets/images/widgetpreview/programminglanguagesoccurrence.png');
    this.import('vendor/assets/images/widgetpreview/ramcpu.png');
    this.import('vendor/assets/images/widgetpreview/totaloverview.png');
    this.import('vendor/assets/images/widgetpreview/totalrequests.png');
  }
};
