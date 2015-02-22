var React = require('react');
var Radar = require('./components/Radar.jsx');
var OssList = require('./components/OssList.jsx');
var Calendar = require('./components/Calendar.jsx');
var request = require('superagent');
var async = require('async');
var Constants = require('./Constants');
require('date-utils');

var Router = require('react-router'); 
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var Main = React.createClass({
  mixins: [ Router.State ],
  getInitialState: function() {
    return {
      categories: [],
      ranking: [],
      products: []
    };
  },
  componentDidMount: function() {
    this._loadData();
  },
  componentWillReceiveProps: function() {
    this._loadData();
  },
  shouldComponentUpdate: function() {
    return this.state.yearMonth === undefined || (this.state.yearMonth !== this.getParams().yearMonth);
  },
  _loadData: function() {
    var _this = this;
    var yearMonth = this.getParams().yearMonth;
    if (!yearMonth) {
      yearMonth = new Date().toFormat(Constants.YEAR_MONTH_FORMAT);
    }
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
      _this.setState({
        yearMonth: yearMonth,
        products: products,
        ranking: ranking,
        categories: categories
      });
    });
  },
  render: function() {
    return (
      <div key="rader-scope-main" className="radar-scope">
        <Calendar/>
        <span key="radar-scope-arrow1" className="glyphicon glyphicon-chevron-right"></span>
        <OssList products={this.state.products} ranking={this.state.ranking}/>
        <span key="radar-scope-arrow2" className="glyphicon glyphicon-chevron-right"></span>
        <Radar categories={this.state.categories} products={this.state.products} ranking={this.state.ranking}/>
      </div>
    );
  }
});

var routes = (
  <Route name="radar-scope" path={Constants.ROOT_PATH}>
    <Route name="radarScope" path="radarScope/">
      <Route name="yearMonth" path=":yearMonth" handler={Main}/>
      <Route name="category" path="category/:categoryNum/:yearMonth" handler={Main}/>
    </Route>
    <DefaultRoute handler={Main} params={{yearMonth: '201502'}}/>
  </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler/>, document.body);
});
