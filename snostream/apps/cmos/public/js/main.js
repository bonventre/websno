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
var clicked = -1;
var ev = _.extend({},Backbone.Events);

ev.on('screamers:click',function(id){
    if (clicked > -1){
      secondview.remove();
      secondview.unbind();
      secondview.onclose();
    }
    if (clicked != id){
      clicked = id;
      sockets['cmosrates'] = io.connect('/cmosrates');
      this.cmosRatesCollection = new CmosRatesCollection();
      secondview = new CmosRatesListView({model: this.cmosRatesCollection})
      this.cmosRatesCollection.fetch();
      $('#content').append(secondview.render().el);
    }else{
      clicked = -1;
    }
});

$(document).ready(function() {
  app = new AppRouter();
  Backbone.history.start();
});
