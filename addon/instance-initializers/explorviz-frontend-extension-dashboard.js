import Router from "explorviz-frontend/router";

export function initialize(appInstance) {

  const service = appInstance.lookup("service:page-setup");

  if (service) {
    service.get("navbarRoutes").push("dashboard");
    Chart.plugins.unregister(ChartDataLabels);
  }

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
