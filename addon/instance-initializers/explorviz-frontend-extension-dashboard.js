import Router from "explorviz-frontend/router";

/*
This instance initializer is adding our addon into explorvizs navbar
*/
export function initialize(appInstance) {

  //getting explorvizs service "page-setup"
  const service = appInstance.lookup("service:page-setup");

  if (service) {
    //push "dashboard" into the main navbar
    service.get("navbarRoutes").push("dashboard");

    //unregister a Chart.js plugin, that is activated by default
    Chart.plugins.unregister(ChartDataLabels);
  }

  //Setting up our routes.
  Router.map(function() {
    this.route("dashboard");
    this.route("widgetsettings")
    this.route("dashboardsettings")
  });
}

export default {
  name: 'explorviz-frontend-extension-dashboard',
  initialize
};
