import Controller from '@ember/controller';

export default Controller.extend({


  isExpanded: false,


  totaloverviewwidget: Ember.computed(function(){
  const store = this.get('store');
  return store.queryRecord('totaloverviewwidget', {});
}).volatile(),



  actions: {
    toggleBody() {
      this.toggleProperty('isExpanded');
      //var ctx = document.getElementById('myChartt');
      var myPieChart = document.getElementById('myPieChart');





    }
  }


});
