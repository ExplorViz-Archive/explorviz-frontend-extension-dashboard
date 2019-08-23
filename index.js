'use strict';

module.exports = {
  name: require('./package').name,

  isDevelopingAddon() {
    return true;
  },

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

    //new plugins_labels_label
    this.import('node_modules/chartjs-plugin-datalabels/dist/chartjs-plugin-datalabels.js');

    //this.import('vendor/chartjs-plugin-piechart-outlabels.js');




    this.import('node_modules/bootstrap/dist/css/bootstrap.css');

    //for chart js line charts: zoom on x axis and realtime data reload

    this.import('node_modules/chartjs-plugin-streaming/dist/chartjs-plugin-streaming.js');


    this.import('node_modules/hammerjs/hammer.js');
    this.import('node_modules/chartjs-plugin-zoom/dist/chartjs-plugin-zoom.js');


    this.import('node_modules/chartjs-plugin-colorschemes/dist/chartjs-plugin-colorschemes.js');




    //new new labels piechart
    this.import('node_modules/chartjs-plugin-piechart-outlabels/dist/chartjs-plugin-piechart-outlabels.js');


        this.import('node_modules/randomcolor/randomColor.js');


    //Bei zukünfiten imports auf // und \\ achten ! verwirrend
  }
};
