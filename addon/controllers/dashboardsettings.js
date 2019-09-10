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


export default Controller.extend({

  store: Ember.inject.service(),
  modalservice: Ember.inject.service('modal-content'),


  actions: {
    loadWidgetInfo(widgetname){
      this.get('modalservice').setWidget(widgetname);
    },
    //action for the left list if its getting clicked.
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

    //action for the right list if its getting clicked.
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

    //action for the remove button
    removeWidget() {
      var list = this.get('instantiatedWidgets');
      var length = list.length;


      var newList = [];

      list.forEach(function(element) {
        if (!clickedWidgetsRightIDs.includes("" + element.id)) {
          newList.push({
            id: element.id,
            widget: element.widget,
            displayName: element.displayName
          });
        }
      });

      if (newList.length == 0) {
        newList = [{
          id: 0,
          widget: 'empty',
          displayName: "Select a available Widget"
        }];
      }

      clickedWidgetsRight = [];
      clickedWidgetsRightIDs = [];


      this.set('instantiatedWidgets', newList);

    },

    //metricgraphics.js

    //action for the add button (activate a widget).
    activateWidget() {
      var list = this.get('instantiatedWidgets');
      var first = list.get('firstObject').widget;

      if (first === "empty" && clickedWidgetsLeft.length != 0) {
        list.popObject({
          widget: 'empty',
          //displayName: "Empty"
        });
      }

      clickedWidgetsLeft.forEach(function(element) {
        var id = this.get('idGenerator');

        var model = this.get('model');
        var elementWidget = model.find(item => item.widget === element);

        var displayName = elementWidget.displayName;


        list.pushObject({
          id: id,
          widget: element,
          displayName: displayName
        });

        id++;
        this.set('idGenerator', id);
      }, this);


      //removing the active class from the left list, so its not selected anymore
      $(".active").removeClass("active");
      clickedWidgetsLeft = [];



    },

    //action for the save Button. save the active widget list in the backend
    saveData(event) {
      event.target.disabled = true;
      const myStore = this.get('store');
      var list = this.get('instantiatedWidgets');


      var date = new Date();
      var timestamp = date.getTime();

      list.forEach(function(element, index) {

        //sending each widget with a post request to the backend
        let post = myStore.createRecord('instantiatedwidget', {
          userID: this.get('userID'),
          timestamp: timestamp,
          widgetName: element.widget,
          instanceID: element.id,
          orderID: index
        });




        if (index == list.length - 1) {

          post.save().then(() => {



            //this.transitionToRoute('dashboard');
            window.location.href = "dashboard";
          });
          /*
          post.save().then(function(post) {

              this.transitionToRoute('dashboard');
          }, this);
          */


        } else {
          post.save();
        }

      }, this);

      //redirect to the dashboard
      //this.transitionToRoute('dashboard');

    },

    cancel(event) {
      //redirect to the dashboard
      event.target.disabled = true;
      //this.transitionToRoute('dashboard');
      window.location.href = "dashboard";
    }

  }
});

$(document).ready(function() {
  $('[data-toggle="popover"]').popover({
    placement: 'right',
    trigger: 'hover'
  });
});
