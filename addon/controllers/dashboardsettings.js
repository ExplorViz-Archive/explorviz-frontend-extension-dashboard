import Controller from '@ember/controller';
import {
  set
} from '@ember/object';
import {
  task,
  timeout
} from 'ember-concurrency';

var clickedWidget;

export default Controller.extend({

  /*
    activeWidgetList: [{
      widget: 'empty'
    }],
    */
  /*
  test: task(function*() {
    console.log(this.get('activeWidgetList'));
    var list = this.get('activeWidgetList');
    list.push([{
      widget: 'test'
    }]);

    this.set('activeWidgetList', list);

    console.log(this.get('activeWidgetList'));
  },this).on('activate').cancelOn('deactivate').restartable(),
  */


  init() {
    console.log("init ausgeführt controller");
    //let task = this.get('test');
    //let taskInstance = task.perform();

    //set(this.model, "test", "Hallo welt");
  },
  actions: {
    listClick(event) {
      if ($(event.target).hasClass('active')) {
        $(event.target).removeClass("active");
      } else {
        $(event.target).addClass("active");
      }


    },

    removeWidget() {
      console.log("removed");
    },

    activateWidget() {
      console.log("activated");

      var list = this.get('activeWidgetList');

      list.forEach(function(element) {
        console.log(element);

        var widget = element.widget;

        if (widget == 'empty') {
          list.pop();
        }



      }, this);

      list.push([{
        widget: 'test'
      }]);

      this.set('activeWidgetList', list);
      //list.set('activeWidgetList', list);
      //set(this.get('model'), 'activeWidgetList', list)      //this ist nicht verfügbar, da es eine eigene function ist !!!!!!!!

      console.log(this.get('activeWidgetList'));

    }
  }
});
