import Route from '@ember/routing/route';
import {
  set
} from '@ember/object';

//var widgetName = "";

export default Route.extend({

  showRamCpuSettings: false,
  queryParams: {
    widget: ''
  },
  model(params) {

    //widgetName = params.widget;
    if (params.widget == 'ramcpu') {
      set(this, "showRamCpuSettings", true);
      console.log("showRamCpuSettings: " + this.showRamCpuSettings); //output: showRamCpuSettings: true
    }
    return this.showRamCpuSettings;

  },
  /*
  init()
  {
      this._super(...arguments);

      console.log(widgetName);
      if (widgetName == 'ramcpu') {
        set(this, "showRamCpuSettings", true);
        console.log("showRamCpuSettings: " + this.showRamCpuSettings);
      }
  },
  */


  actions: {
    resetRoute() {
      const routeName = this.get('widgetsettings');

    }
  },
});
