var CrateScreamers = Backbone.Model.extend({
  urlRoot: 'screamers',

  initialize: function() {
    _.bindAll(this,'update');
    this.socket = this.collection.socket;
    this.ioBind('update',this.update,this);
  },

  update: function(data) {
    this.set(data);
  }
});

var CrateScreamersCollection = Backbone.Collection.extend({
  model: CrateScreamers,
  url: 'screamers',

  initialize: function(models,options){
    this.socket = options.socket;
  }
});

var CmosRates = Backbone.Model.extend({
  urlRoot: 'cmosrates',

  initialize: function(options) {
    _.bindAll(this,'update');
    this.socket = this.collection.socket;
    this.ioBind('update',this.update,this);
  },

  update: function(data) {
    this.set(data);
  }
});

var CmosRatesCollection = Backbone.Collection.extend({
  model: CmosRates,
  url: 'cmosrates',

  initialize: function(models, options){
    this.socket = options.socket;
    this.ioBindChained('update',this);
  }
});


var CmosRateTimes = Backbone.Model.extend({
  urlRoot: 'channelrates',
  
  initialize: function(options) {
    this.data = [];
    _.bindAll(this,'update');
    this.socket = options.socket;
    this.on('reset',this.update);
  },

  update: function(data) {
    if (this.data.length > 10){
      this.data = this.data.slice(1);
    }
    this.data.push.apply(this.data,data);
    this.trigger("change");
  }
});

