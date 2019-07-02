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
var clickedWidgetsRightIDs = [];

var idGenerator = 1;

var userID = 1991; // temp

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
  store: Ember.inject.service(),



  actions: {
    listClickLeft(event) {

      var widgetName = event.target.id;

      if ($(event.target).hasClass('active')) {

        $(event.target).removeClass("active");

        var index = clickedWidgetsLeft.indexOf(widgetName);

        if (index > -1) {
          clickedWidgetsLeft.splice(index, 1);
        }

      } else {
        $(event.target).addClass("active");
        clickedWidgetsLeft.push(widgetName);
      }

    },

    listClickRight(event) {
      if ($(event.target).hasClass('active')) {
        $(event.target).removeClass("active");

        var nameAndID = event.target.id;
        var array = nameAndID.split(" ");

        var index = clickedWidgetsRightIDs.indexOf(array[1]);

        if (index > -1) {
          clickedWidgetsRight.splice(index, 1);
          clickedWidgetsRightIDs.splice(index, 1);
        }

      } else {
        $(event.target).addClass("active");

        var nameAndID = event.target.id;
        var array = nameAndID.split(" ");

        clickedWidgetsRightIDs.push(array[1]);
        clickedWidgetsRight.push(array[0]);

      }

    },

    removeWidget() {
      var list = this.get('instantiatedWidgets');
      var length = list.length;


      var newList = [];

      list.forEach(function(element) {
        if (!clickedWidgetsRightIDs.includes("" + element.id)) {
          newList.push({
            id: element.id,
            widget: element.widget
          });
        }
      });

      if (newList.length == 0) {
        newList = [{
          id: 0,
          widget: 'empty'
        }];
      }

      clickedWidgetsRight = [];
      clickedWidgetsRightIDs = [];

      console.log(newList);
      this.set('instantiatedWidgets', newList);

    },
    //metricgraphics.js
    activateWidget() {
      var list = this.get('instantiatedWidgets');
      var first = list.get('firstObject').widget;

      if (first === "empty" && clickedWidgetsLeft.length != 0) {
        list.popObject({
          widget: 'empty'
        });
      }

      clickedWidgetsLeft.forEach(function(element) {
        list.pushObject({
          id: idGenerator,
          widget: element
        });
        idGenerator++;
      });

    },

    saveData() {
      const myStore = this.get('store');
      var list = this.get('instantiatedWidgets');

      var test = [];

      var date = new Date();
      var timestamp = date.getTime();

      list.forEach(function(element) {
        let post = myStore.createRecord('instantiatedwidget', {
          userID: userID,
          timestamp: timestamp,
          widgetName: element.widget,
          instanceID: element.id
        });

        //post.save().then(transitionToPost).catch(failure);
        post.save();


        test.push({
          userID: userID,
          timestamp: timestamp,
          widgetName: element.widget,
          instanceID: element.id
        });


      });

      console.log(test);


    }

  }
});

function transitionToPost(self, post) {
  console.log("success " + post);
  self.transitionTo('dashboard');
}

function failure(reason) {
  console.log("error " + reason);
}
