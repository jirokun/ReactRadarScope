var React = require('react');
var RadarForeground = require('./RadarForeground');
var RadarBackground = require('./RadarBackground');
var Constants = require('../Constants');

var Radar = React.createClass({
  render: function() {
    return (
      <svg key="Radar" width={Constants.RADER_WIDTH} height={Constants.RADER_HEIGHT}>
        <RadarBackground categories={this.props.categories}/>
        <RadarForeground dotPosition={this.props.dotPosition} selectedOssId={this.props.selectedOssId}/>
      </svg>
    );
  }
});

module.exports = Radar;
