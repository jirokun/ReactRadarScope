var React = require('react');
var Router = require('react-router'); 
var routes = require('./routes');
var async = require('async');
var request = require('superagent');
var Constants = require('./Constants');
var RadarStore = require('./stores/RadarStore');

Router.run(routes, Router.HistoryLocation, function (Handler, args) {
  console.log(args.params);
  var yearMonth = args.params.yearMonth;
  if (!yearMonth) yearMonth = new Date().toFormat('YYYYMM');
  async.map([
      Constants.ROOT_PATH + yearMonth +  '.json',
      Constants.ROOT_PATH + 'categories.json',
      Constants.ROOT_PATH + 'products.json'], function(url, cb) {
    request.get(url).end(function(res) { cb(null, res); });
  }, function(err, responses) {
    for (var i = 0, len = responses.length; i < len; i++) {
      if (responses[i].error) {
        return;
      }
    }
    var ranking = responses[0].body;
    var categories = responses[1].body;
    var products = responses[2].body;
    var props = {
      ranking: ranking,
      categories: categories,
      products: products,
      yearMonth: yearMonth,
      dotPosition: RadarStore.calcDotPosition(yearMonth, ranking, categories)
    };
    React.render(<Handler {...props}/>, document.body);
  });

});
