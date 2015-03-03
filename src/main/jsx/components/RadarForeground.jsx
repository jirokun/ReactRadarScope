var React = require('react');
var uuid = require('node-uuid');
var Dot = require('./Dot');
var RadarStore = require('../stores/RadarStore');
var Constants = require('../Constants');

var RadarForeground = React.createClass({
  render: function() {
    var _this = this;
    var positions = this.props.dotPosition;
    var x = {};
    return (
      <g key="foreground">
        {positions.map(function(pos, i) {
          return <Dot key={'dot-' + pos.product.id} num={pos.num} fill={pos.color} product={pos.product} x={pos.x} y={pos.y} selectedOssId={_this.props.selectedOssId}/>
        })}
      </g>
    );
  },

});

module.exports = RadarForeground;
