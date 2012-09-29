var websno = {
  views: {},
  models: {},
  collections: {},
  events: {},

  initialize: function(){
    websno.templateLoader.load(["Header","Home","Cmos","Screamers"],function() {
      websno.router = new websno.Router();
      _.extend(websno.events,Backbone.Events);
      Backbone.history.start();
      setInterval(function() {
        websno.events.trigger("increment");
      },1000);
    });
  }
}

$(function() {
  websno.initialize();
});
