var React = require('react');
var Constants = require('../Constants');
var Router = require('react-router'); 
var Link = Router.Link;
require('date-utils');

var Calendar = React.createClass({
  _dates: function() {
    var _this = this;
    return this.props.rankDates.map(function(d) {
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
