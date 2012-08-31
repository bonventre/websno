var AppRouter = Backbone.Router.extend({
  routes: {
    '': 'index'
  },

  index: function() {
    this.crateScreamersCollection = new CrateScreamersCollection();
    this.crateScreamersListView = new CrateScreamersListView({model: this.crateScreamersCollection});
    this.crateScreamersCollection.fetch();
    $('#content').html(this.crateScreamersListView.render().el);
  }
});
window.socket = io.connect('/cmos');

$(document).ready(function() {
  app = new AppRouter();
  Backbone.history.start();
});
