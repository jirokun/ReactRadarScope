var React = require('react');
var RadarForeground = require('./RadarForeground');
var RadarBackground = require('./RadarBackground');
var Constants = require('../Constants');

var Radar = React.createClass({
  render: function() {
    return (
      <svg key="Radar" width={Constants.RADER_WIDTH} height={Constants.RADER_HEIGHT}>
        <RadarBackground categories={this.props.categories}/>
        <RadarForeground categories={this.props.categories} products={this.props.products} ranking={this.props.ranking}/>
      </svg>
    );
  }
});

module.exports = Radar;
