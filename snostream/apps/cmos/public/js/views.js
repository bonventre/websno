var CrateScreamersView = Backbone.View.extend({
  tagName: 'td',

  template: _.template($('#screamers-view').html()),

  events: {
    "click": function(){ev.trigger("screamers:click",this.model.id);}
  },

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

var CmosRatesView = Backbone.View.extend({
  tagName: 'tr',

  template: _.template($('#cmosrates-view').html()),

  events: {
    "click": function(){ev.trigger("cmosrates:click",this.model.id);}
  },

  initialize: function() {
    _.bindAll(this,'render');
    this.model.on('change',this.render);
  },

  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
  }
});

var CmosRatesListView = Backbone.View.extend({
  tagName: 'table',

  template: _.template($('#cmosrateslist-view').html()),

  initialize: function() {
    _.bindAll(this,'render','populate','onclose');
    this.model.on('reset',this.populate);
    this.render();
  },

  render: function() {
    $(this.el).html(this.template());
    return this;
  },

  populate: function() {
    var counter = 0;
    _.each(this.model.models, function(channel) {
      var temp = new CmosRatesView({model: channel});
      var slot_el = '#slot-' + (counter % 16);
      $(slot_el).append(temp.render().el);
      counter++;
    }, this);
    return this;
  },

  onclose: function() {
    this.model.socket.disconnect();
  }
});
