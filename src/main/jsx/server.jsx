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
var html;
Router.run(routes, url, function (Handler, args) {
  html = React.renderToString(<Handler {...props}/>);
});
html;
