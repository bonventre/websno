var CrateScreamers = Backbone.Model.extend({
  urlRoot: 'screamers',

  initialize: function() {
    _.bindAll(this,'update');
    this.socket = sockets['screamers'];
    this.ioBind('update',this.update,this);
  },

  update: function(data) {
    this.set(data);
  }
});

var CrateScreamersCollection = Backbone.Collection.extend({
  model: CrateScreamers,
  url: 'screamers',

  initialize: function(){
    this.socket = sockets['screamers'];
  }
});

var CmosRates = Backbone.Model.extend({
  urlRoot: 'cmosrates',

  initialize: function() {
    _.bindAll(this,'update');
    this.socket = sockets['cmosrates'];
    this.ioBind('update',this.update,this);
  },

  update: function(data) {
    this.set(data);
  }
});

var CmosRatesCollection = Backbone.Collection.extend({
  model: CmosRates,
  url: 'cmosrates',

  initialize: function(){
    this.socket = sockets['cmosrates'];
    this.ioBindChained('update',this);
  }
});

var CmosRateTimes = Backbone.Model.extend({
  urlRoot: 'channelrates',
  
  initialize: function() {
    this.data = [];
    _.bindAll(this,'update');
    this.socket = sockets['channelrates'];
    this.ioBind('update',this.update,this);
    this.on('reset',this.update);
  },

  update: function(data) {
    if (this.data.length > 0){
      this.data = this.data.slice(1);
    }
    this.data.push.apply(this.data,data);
    this.trigger("change");
  }
});
