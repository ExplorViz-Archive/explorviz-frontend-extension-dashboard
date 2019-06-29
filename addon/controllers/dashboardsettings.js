import Controller from '@ember/controller';
import {
  set
} from '@ember/object';
import {
  task,
  timeout
} from 'ember-concurrency';

var clickedWidgetsLeft = [];
var clickedWidgetsRight = [];
var idGenerator = 1;

export default Controller.extend({

  //activeWidgetList property is set in the route. setupController().

  /*
  askQuestion: task(function*() {
    yield timeout(1000);
    this.set('result', Math.random());

    this.get('instantiatedWidgets').pushObject({
      widget: 'test'
    });

  }).drop(),

  result: null,
  */




  actions: {
    listClickLeft(event) {
      if ($(event.target).hasClass('active')) {
        $(event.target).removeClass("active");

        var id = event.target.id;

        clickedWidgetsLeft.pop({
          id
        });


      } else {
        $(event.target).addClass("active");

        var id = event.target.id;
        clickedWidgetsLeft.push({
          widget: id
        });

      }


    },

    listClickRight(event) {
      console.log("right");
      if ($(event.target).hasClass('active')) {
        $(event.target).removeClass("active");

        var nameAndID = event.target.id;
        var array = nameAndID.split(" ");

        clickedWidgetsRight.pop({
          id: array[1],
          widget: array[0]
        });


      } else {
        $(event.target).addClass("active");

        var nameAndID = event.target.id;
        var array = nameAndID.split(" ");

        clickedWidgetsRight.push({
          id: array[1],
          widget: array[0]
        });

      }


    },

    removeWidget() {
      console.log("removed");

      var list = this.get('instantiatedWidgets');

      if(clickedWidgetsRight.length == list.length)
      {

      }

      clickedWidgetsRight.forEach(function(element) {
        var widget = element.widget;


        list.popObject({
          id: idGenerator,
          widget: widget
        });
        idGenerator++;
      });

    },

    activateWidget() {
      console.log("activated");

      var list = this.get('instantiatedWidgets');

      var first = list.get('firstObject').widget;

      if (first === "empty") {
        list.popObject({
          widget: 'empty'
        });
      }

      clickedWidgetsLeft.forEach(function(element) {
        var widget = element.widget;
        list.pushObject({
          id: idGenerator,
          widget: widget
        });
        idGenerator++;
      });



    }
  }
});
