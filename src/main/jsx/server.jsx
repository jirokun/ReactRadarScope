var ranking = Java.from(rankingList);
var categories = Java.from(categoryList);
var products = Java.from(productList);
var rankDates = Java.from(rankDateList).map(function(time) { return new Date(time); });;
var props = {
  ranking: ranking,
  categories: categories,
  products: products,
  yearMonth: yearMonth,
  rankDates: rankDates,
  dotPosition: RadarStore.calcDotPosition(url, yearMonth, ranking, categories, isChildCategory)
};
var html;
Router.run(routes, url, function (Handler, args) {
  html = React.renderToString(<Handler {...props}/>);
});
html;
