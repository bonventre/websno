var CrateScreamers = Backbone.Model.extend({
  urlRoot: 'screamers',

  initialize: function() {
    _.bindAll(this,'update');
    this.ioBind('update',this.update,this);
  },

  update: function(data) {
    this.set(data);
  }
});

var CrateScreamersCollection = Backbone.Collection.extend({
  model: CrateScreamers,
  url: 'screamers'
});
