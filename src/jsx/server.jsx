var React = require('react');
var Router = require('react-router'); 
var RadarStore = require('./stores/RadarStore');
var routes = require('./routes');

var ranking = Java.from(rankingList);
var categories = Java.from(categoryList);
var products = Java.from(productList);
var props = {
  ranking: ranking,
  categories: categories,
  products: products,
  yearMonth: yearMonth,
  dotPosition: RadarStore.calcDotPosition(yearMonth, ranking, categories)
};
Router.run(routes, url, function (Handler, args) {
  module.exports = React.renderToString(<Handler {...props}/>);
});
