Backbone.View.prototype.close = function(){
  if (this.onclose){
    this.onclose();
  }
  this.remove();
  this.unbind();
}

var AppRouter = Backbone.Router.extend({
  routes: {
    '': 'index',
    'crate/:id': 'detail'
  },

  initialize: function(options){
    this.appView = options.appView;
  },

  index: function() {
    var screamersView = new CrateScreamersBigListView();
    this.appView.showView(screamersView);
  },

  detail: function(id){
    var detailView = new DetailView({id: id}); 
    this.appView.showView(detailView);
  }
});

var sockets = {}
var ev = _.extend({},Backbone.Events);

function AppView() {
  this.showView = function(view) {
    if (this.currentView){
      this.currentView.close();
    }
    this.currentView = view;
    $('#content').html(this.currentView.render().el);
  }
}

$(document).ready(function() {
  sockets['screamers'] = io.connect('/screamers');
  appview = new AppView();
  app = new AppRouter({appView: appview});
  Backbone.history.start();
});

/*

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
*/


