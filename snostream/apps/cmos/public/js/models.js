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


