var CrateScreamersView = Backbone.View.extend({
  tagName: 'td',

  template: _.template($('#screamers-view').html()),

  initialize: function() {
    _.bindAll(this,'render');
    this.model.on('change',this.render);
  },

  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
  }
});

var CrateScreamersListView = Backbone.View.extend({
  tagName: 'table',

  template: _.template($('#screamerslist-view').html()),

  initialize: function() {
    _.bindAll(this,'render');
    this.model.on('reset',this.render);
  },

  render: function() {
    $(this.el).html(this.template());
    var counter = 0;
    _.each(this.model.models, function(crate) {
      var temp = new CrateScreamersView({model: crate});
      if (counter < 10){
        $(this.el).children(":first").append(temp.render().el);
      }else{
        $(this.el).children(":last").append(temp.render().el);
      }
      counter++;
    }, this);
    return this;
  }
});
