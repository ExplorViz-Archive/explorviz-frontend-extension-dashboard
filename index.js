'use strict';

module.exports = {
  name: require('./package').name,

  included() {
    this._super.included.apply(this, arguments);

    this.import('node_modules/startbootstrap-sb-admin-2/css/sb-admin-2.css');
    this.import('node_modules/startbootstrap-sb-admin-2/js/sb-admin-2.js');

    this.import('node_modules/startbootstrap-sb-admin-2/vendor/fontawesome-free/css/all.css');
    this.import('node_modules/startbootstrap-sb-admin-2/vendor/fontawesome-free/js/all.js');

    this.import('node_modules/apexcharts/dist/apexcharts.js');


    this.import('node_modules/chart.js/dist/Chart.js');
    this.import('node_modules/chart.js/dist/Chart.css');

    this.import('node_modules/chartjs-plugin-labels/build/chartjs-plugin-labels.min.js');

    //Bei zukünfiten imports auf // und \\ achten ! verwirrend
  }
};
