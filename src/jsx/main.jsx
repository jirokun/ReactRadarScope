var React = require('react');
var Radar = require('./components/Radar.jsx');
var OssList = require('./components/OssList.jsx');
var Calendar = require('./components/Calendar.jsx');
var FloatingLabel = require('./components/FloatingLabel');
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
    var yearMonth = this.getParams().yearMonth;
    if (!yearMonth) yearMonth = new Date().toFormat(Constants.YEAR_MONTH_FORMAT);
    return {
      categories: [],
      ranking: [],
      products: [],
      dotPosition: [],
      yearMonth: yearMonth
    };
  },
  componentWillMount: function() {
    RadarStore.addStoreChangeListener(this._radarStoreChange);
  },
  componentWillUnmount: function() {
    RadarStore.removeStoreChangeListener(this._radarStoreChange);
  },
  componentDidMount: function() {
    RadarAction.loadData(this.state.yearMonth);
  },
  componentWillReceiveProps: function() {
    var yearMonth = this.getParams().yearMonth;
    RadarAction.loadData(yearMonth);
    this.setState({
      yearMonth: yearMonth
    });
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
    var radarContainerStyle = {
      position: 'relative'
    };
    return (
      <div key="rader-scope-main" className="radar-scope">
        <Calendar/>
        <span key="radar-scope-arrow1" className="glyphicon glyphicon-chevron-right"></span>
        <OssList products={this.state.products} ranking={this.state.ranking} dotPosition={this.state.dotPosition} yearMonth={this.state.yearMonth}/>
        <span key="radar-scope-arrow2" className="glyphicon glyphicon-chevron-right"></span>
        <div style={radarContainerStyle}>
          <Radar categories={this.state.categories} dotPosition={this.state.dotPosition}/>
          <FloatingLabel dotPosition={this.state.dotPosition}/>
        </div>
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
