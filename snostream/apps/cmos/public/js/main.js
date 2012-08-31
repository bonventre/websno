var AppRouter = Backbone.Router.extend({
  routes: {
    '': 'index'
  },

  index: function() {
    sockets['screamers'] = io.connect('/screamers');
    this.crateScreamersCollection = new CrateScreamersCollection();
    this.crateScreamersListView = new CrateScreamersListView({model: this.crateScreamersCollection});
    this.crateScreamersCollection.fetch();
    $('#content').html(this.crateScreamersListView.render().el);
  }
});

var sockets = {}
var cratefocus = -1;
var channelfocus = -1;
var ev = _.extend({},Backbone.Events);

ev.on('screamers:click',function(id){
  if (cratefocus > -1){
    secondview.remove();
    secondview.unbind();
    secondview.onclose();
  }
  if (channelfocus > -1){
    thirdview.remove();
    thirdview.unbind();
    thirdview.onclose();
  }
  channelfocus = -1;
  if (cratefocus != id){
    cratefocus = id;
    sockets['cmosrates'] = io.connect('/cmosrates');
    this.cmosRatesCollection = new CmosRatesCollection();
    secondview = new CmosRatesListView({model: this.cmosRatesCollection})
    this.cmosRatesCollection.fetch();
    $('#content').append(secondview.render().el);
  }else{
    cratefocus = -1;
  }
});

ev.on('cmosrates:click',function(id){
  if (channelfocus > -1){
    thirdview.undelegateEvents();
    thirdview.remove();
    thirdview.unbind();
    thirdview.onclose();
  }
  if (channelfocus != id){
    channelfocus = id;
    sockets['channelrates'] = io.connect('/channelrates');
    this.cmosRateTimes = new CmosRateTimes({id: id});
    thirdview = new CmosRateTimesView({model: this.cmosRateTimes});
    this.cmosRateTimes.fetch();
    $('#content').append(thirdview.render().el);
    thirdview.model.trigger("change");
  }else{
    channelfocus = -1;
  }
});

$(document).ready(function() {
  app = new AppRouter();
  Backbone.history.start();
});
