import Router from "explorviz-frontend/router";

export function initialize(appInstance) {

  const service = appInstance.lookup("service:page-setup");

  if(service){
    service.get("navbarRoutes").push("dashboard");
  }

  Router.map(function() {
    this.route("dashboard");
  });
}

export default {
  name: 'explorviz-frontend-extension-dashboard',
  initialize
};
