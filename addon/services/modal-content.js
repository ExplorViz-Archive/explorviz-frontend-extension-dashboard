import Service from '@ember/service';

export default Service.extend({

  content: "",
  widgetName: "",

  init() {
    this._super(...arguments);
    this.set('content', "empty");
  },

  setWidget(name){
    this.set('widgetName', name);

    if(name === "activeclassinstances"){
      var con = "Heu heu heu";
      this.setContent(con);
    }
  },

  setContent(con) {
    this.set('content', con);
    $('#exampleModal').modal('show');
  },

  getContent() {
    return this.get('content');
  }
});
