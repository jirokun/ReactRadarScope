var React = require('react');
var Radar = require('./Radar');
var OssList = require('./OssList');
var Calendar = require('./Calendar');
var FloatingLabel = require('./FloatingLabel');
var Constants = require('../Constants');
var RadarStore = require('../stores/RadarStore');
var RadarAction = require('../actions/RadarAction');
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
      selectedOssId: null
    };
  },
  componentDidMount: function() {
    RadarStore.addStoreChangeListener(this._radarStoreChange);
  },
  componentWillUnmount: function() {
    RadarStore.removeStoreChangeListener(this._radarStoreChange);
  },
  _radarStoreChange: function() {
    this.setState({
      selectedOssId: RadarStore.getSelectedOss()
    });
  },
  render: function() {
    var radarContainerStyle = {
      position: 'relative'
    };
    return (
      <div key="radar-scope-main" className="radar-scope">
        <div className="radar-scope-header">
          <span>{this.props.yearMonth.substr(0, 4)}</span>
          <span>&nbsp;年&nbsp;</span>
          <span>{this.props.yearMonth.substr(4)}</span>
          <span>&nbsp;月のレーダースコープ</span>
        </div>
        <div className="radar-scope-body">
          <Calendar rankDates={this.props.rankDates}/>
          <span key="radar-scope-arrow1" className="glyphicon glyphicon-chevron-right"></span>
          <OssList products={this.props.products} dotPosition={this.props.dotPosition} yearMonth={this.props.yearMonth} selectedOssId={this.state.selectedOssId}/>
          <span key="radar-scope-arrow2" className="glyphicon glyphicon-chevron-right"></span>
          <div style={radarContainerStyle}>
            <Radar yearMonth={this.props.yearMonth} categories={this.props.categories} dotPosition={this.props.dotPosition} selectedOssId={this.state.selectedOssId} isChildCategory={this.props.isChildCategory}/>
            <FloatingLabel dotPosition={this.props.dotPosition} selectedOssId={this.state.selectedOssId}/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Main;
