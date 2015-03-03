var React = require('react');
var uuid = require('node-uuid');
var Constants = require('../Constants');
var Router = require('react-router'); 
var Link = Router.Link;
require('date-utils');

var Calendar = React.createClass({
  getInitialState: function() {
    var d = new Date();
    var lounchDate = Constants.RADER_SCOPE_LAUNCH_DATE;
    var dates = [];
    while (d.getTime() > Constants.RADER_SCOPE_LAUNCH_DATE.getTime()) {
      dates.push(d);
      d = d.clone().addMonths(-1);
    }
    return {
      dates: dates
    };
  },
  _dates: function() {
    var _this = this;
    return this.state.dates.map(function(d) {
      var dateStr = d.toFormat('YYYY年MM月');
      var link = Constants.ROOT_PATH + 'radarScope/' + d.toFormat(Constants.YEAR_MONTH_FORMAT);
      return <li key={"calendar-month-" + dateStr}><Link to={link}>{dateStr}</Link></li>;
    });
  },
  render: function() {
    return (
      <div key="calendar" className="list-container">
        <div key="calendar-container">
          <h3 key="calendar-title">表示月</h3>
          <ul key="calendar-list">
            { this._dates() }
          </ul>
        </div>
      </div>
    );
  }
});

module.exports = Calendar;
