var React = require('react');
var Radar = require('./components/Radar.jsx');
var OssList = require('./components/OssList.jsx');
var Calendar = require('./components/Calendar.jsx');
var Constants = require('./Constants');
var RadarStore = require('./stores/RadarStore');
var RadarAction = require('./actions/RadarAction');
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
      products: [],
      dotPosition: []
    };
  },
  componentWillMount: function() {
    RadarStore.addStoreChangeListener(this._radarStoreChange);
  },
  componentWillUnmount: function() {
    RadarStore.removeStoreChangeListener(this._radarStoreChange);
  },
  componentDidMount: function() {
    var yearMonth = this.getParams().yearMonth;
    if (!yearMonth) {
      yearMonth = new Date().toFormat(Constants.YEAR_MONTH_FORMAT);
    }
    RadarAction.loadData(yearMonth);
  },
  componentWillReceiveProps: function() {
    RadarAction.loadData(this.getParams().yearMonth);
  },
  shouldComponentUpdate: function() {
    return true;
  },
  _radarStoreChange: function() {
    this.setState({
      categories: RadarStore.getCategories(),
      products: RadarStore.getProducts(),
      ranking: RadarStore.getRanking(),
      dotPosition: RadarStore.getDotPosition()
    });
  },
  _loadData: function() {
  },
  render: function() {
    return (
      <div key="rader-scope-main" className="radar-scope">
        <Calendar/>
        <span key="radar-scope-arrow1" className="glyphicon glyphicon-chevron-right"></span>
        <OssList products={this.state.products} ranking={this.state.ranking}/>
        <span key="radar-scope-arrow2" className="glyphicon glyphicon-chevron-right"></span>
        <Radar categories={this.state.categories} dotPosition={this.state.dotPosition}/>
      </div>
    );
  }
});

var routes = (
  <Route name="radar-scope" path={Constants.ROOT_PATH}>
    <Route name="radarScope" path="radarScope/:yearMonth" handler={Main}/>
    <DefaultRoute handler={Main} />
  </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler/>, document.body);
});
