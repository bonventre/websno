var CrateScreamersBigView = Backbone.View.extend({
  tagName: 'td',
  className: 'screamers-view',
  template: _.template($('#screamersbig-view').html()),

  events: {
    "click": function(){this.focuscrate;}
  },

  initialize: function() {
    _.bindAll(this,'render','focuscrate');
    this.model.on('change',this.render);
  },

  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
  },

  focuscrate: function() {
  }
});

var CrateScreamersBigListView = Backbone.View.extend({
  tagName: 'table',
  className: 'screamersbiglist-view',
  template: _.template($('#screamerslist-view').html()),

  initialize: function() {
    this.socket = io.connect('/screamers');
    this.model = new CrateScreamersCollection(null,{socket: this.socket});
    _.bindAll(this,'render');
    this.model.on('reset',this.render);
    this.model.fetch();
  },

  render: function() {
    $(this.el).html(this.template());
    var counter = 0;
    _.each(this.model.models, function(crate) {
      var temp = new CrateScreamersBigView({model: crate});
      if (counter < 10){
        $(this.el).children(":first").append(temp.render().el);
      }else{
        $(this.el).children(":last").append(temp.render().el);
      }
      counter++;
    }, this);
    return this;
  },

  onClose: function() {
    this.model.ioUnbindAll(this.model.socket);
    this.model.socket.disconnect();
  }
});


/*

var CrateScreamersView = Backbone.View.extend({
  tagName: 'td',
  className: 'screamers-view',
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
  className: 'screamerslist-view',
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

  className: 'cmosrates-view',

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

  className: 'cmosrateslist-view',

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

var CmosRateTimesView = Backbone.View.extend({
  tagName: 'div',

  className: 'timeplot',

  initialize: function() {
    _.bindAll(this,'render','plot','onclose');
    this.model.on('change',this.plot);
  },

  render: function() {
    return this;
  },

  plot: function() {
    this.plot = $.plot($(this.el),[this.model.data],{series: {shadowSize: 0}});
    return this;
  },

  onclose: function() {
    this.model.ioUnbindAll(this.model.socket);
    this.model.socket.disconnect();
  }
});

var CmosRateDetailView = Backbone.View.extend({
  initialize: function(options) {
    _.bindAll(this,'render');
    this.screamers = new CrateScreamersCollection();
    this.screamersView = new CrateScreamersListView({model: this.screamers});
    this.screamers.fetch();
    this.crate = new CmosRatesCollection({id: options.id});
    this.crateView = new CmosRatesListView({model: this.crate});
    this.crate.fetch();
    this.channel = new CmosRateTimes({id: (options.id*512)};
    this.channelView = new CmosRateTimesView({model: this.channel}); 
    this.channel.fetch();
  },

  render: function() {
    $(this.el).append(this.screamersView.render().el);
    $(this.el).append(this.crateView.render().el);
    $(this.el).append(this.channelView.render().el);
    return this;
  },

  onClose: function() {
    this.channelView.onClose();
    this.crateView.onClose();
    this.screamersView.onClose();
  }
});

*/
