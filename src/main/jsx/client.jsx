var React = require('react');
var Router = require('react-router'); 
var routes = require('./routes');
var async = require('async');
var request = require('superagent');
var Constants = require('./Constants');
var RadarStore = require('./stores/RadarStore');

Router.run(routes, Router.HistoryLocation, function (Handler, args) {
  var urls, categoryId;
  var yearMonth = args.params.yearMonth;
  var isChildCategory = !!args.params.categoryId;
  if (!yearMonth) yearMonth = new Date().toFormat('YYYYMM');
  if (isChildCategory) {
    categoryId = args.params.categoryId;
    urls = [
      Constants.ROOT_PATH + 'radarScope/category/' + categoryId + '/' + yearMonth +  '.json',
      Constants.ROOT_PATH + 'radarScope/categories/' + categoryId + '.json',
      Constants.ROOT_PATH + 'radarScope/products.json'
    ];
  } else {
    categoryId = 'root';
    urls = [
      Constants.ROOT_PATH + 'radarScope/' + yearMonth +  '.json',
      Constants.ROOT_PATH + 'radarScope/categories/' + categoryId + '.json',
      Constants.ROOT_PATH + 'radarScope/products.json'
    ];
  }
  async.map(urls, function(url, cb) {
    request.get(url).end(function(res) {
      cb(null, res);
    });
  }, function(err, responses) {
    for (var i = 0, len = responses.length; i < len; i++) {
      if (responses[i].error) {
        return;
      }
    }
    var ranking = responses[0].body;
    var categories = responses[1].body;
    var products = responses[2].body;
    var dotPosition = RadarStore.calcDotPosition(args.path, yearMonth, ranking, categories, isChildCategory);
    var props = {
      isChildCategory: isChildCategory,
      ranking: ranking,
      categories: categories,
      products: products,
      yearMonth: yearMonth,
      dotPosition: dotPosition
    };
    React.render(<Handler {...props}/>, document.body);
  });
});
