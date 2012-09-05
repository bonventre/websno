var CrateScreamersBigView = Backbone.View.extend({
  tagName: 'td',
  className: 'screamers-view',
  template: _.template($('#screamersbig-view').html()),

  events: {
    "click": function(){this.focuscrate();}
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
    var address = 'crate/' + this.model.id;
    app.navigate(address,true);
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

  onclose: function() {
    this.model.ioUnbindAll(this.model.socket);
    this.model.socket.disconnect();
  }
});

var CrateScreamersView = Backbone.View.extend({
  tagName: 'td',
  className: 'screamers-view',
  template: _.template($('#screamers-view').html()),

  events: {
    "click": function(){this.focuscrate();}
  },

  initialize: function() {
    _.bindAll(this,'render','focuscrate','onclose');
    this.model.on('change',this.render);
  },

  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
  },

  focuscrate: function() {
    var address = 'crate/' + this.model.id;
    app.navigate(address,false);
    ev.trigger("screamers:click",this.model.id);
  },

  onclose: function() {
    this.model.ioUnbindAll(this.model.socket);
    this.model.socket.disconnect();
  }
});

var CrateScreamersListView = Backbone.View.extend({
  tagName: 'table',
  className: 'screamerslist-view',
  template: _.template($('#screamerslist-view').html()),

  events: {
    "click #zoomout": function(){this.focusall();}
  },

  initialize: function() {
    this.socket = io.connect('/screamers');
    this.model = new CrateScreamersCollection(null,{socket: this.socket});
    _.bindAll(this,'render','focusall');
    this.model.on('reset',this.render);
    this.model.fetch();
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
    if (counter > 0){
      $(this.el).children(":last").append("<div id='zoomout'>All</div>");
    }
    return this;
  },

  focusall: function() {
    app.navigate("",true);
  },

  onclose: function() {
    this.model.ioUnbindAll(this.model.socket);
    this.model.socket.disconnect();
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

  initialize: function(options) {
    _.bindAll(this,'render','populate','onclose','setcrate');
    this.socket = io.connect('/cmosrates');
    this.setcrate(options.id);
    this.model = new CmosRatesCollection(null,{socket: this.socket});
    this.model.on('reset',this.populate);
    this.model.fetch();
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

  setcrate: function(id) {
    this.id = id;
    this.socket.emit("setcrate",{crate: this.id}); 
    if (this.model){
      _.each(this.model.models, function(channel) {
        channel.set({'rate':0});
      },this);
    }
  },

  onclose: function() {
    this.model.socket.disconnect();
  }
});

var CmosRateTimesView = Backbone.View.extend({
  tagName: 'div',
  className: 'timeplot',

  initialize: function(options) {
    _.bindAll(this,'render','plot','onclose','setchannel');
    this.socket = io.connect('/channelrates');
    this.setchannel(options.id);
    this.model.on('change',this.plot);
  },

  render: function() {
    return this;
  },

  plot: function() {
    this.plot = $.plot($(this.el),[this.model.data],{series: {shadowSize: 0}});
    return this;
  },

  setchannel: function(id) {
    this.id = id;
    if (this.model){
      this.model.ioUnbindAll(this.model.socket);
      this.model.id = id;
      this.model.attributes.id = id;
    }else{
      this.model = new CmosRateTimes({id: this.id, socket: this.socket});
    }
    this.model.ioBind('update',this.model.update,this);
    this.model.data = [];
    this.model.trigger("change");
    this.model.fetch();
  },


  onclose: function() {
    this.model.ioUnbindAll(this.model.socket);
    this.model.socket.disconnect();
  }
});


var CmosRateDetailView = Backbone.View.extend({
  initialize: function(options) {
    this.id = options.id;
    _.bindAll(this,'render','onclose','switchcrate');
    this.screamersView = new CrateScreamersListView();
    this.crateView = new CmosRatesListView({id: this.id});
    this.channelView = new CmosRateTimesView({id: (this.id*512)}); 
    ev.on("cmosrates:click",this.channelView.setchannel);
    ev.on("screamers:click",this.switchcrate);
  },

  render: function() {
    $(this.el).append("<div id='crate-id'>Crate " + this.id + "</div><br>");
    $(this.el).append(this.screamersView.render().el);
    $(this.el).append(this.crateView.render().el);
    $(this.el).append(this.channelView.render().el);
    return this;
  },

  switchcrate: function(id) {
    this.id = id;
    $(this.el).children("#crate-id").html("Crate " + this.id);
    this.crateView.setcrate(id);
    this.channelView.setchannel(id*512);
  },

  onclose: function() {
    this.channelView.onclose();
    this.crateView.onclose();
    this.screamersView.onclose();
  }
});




