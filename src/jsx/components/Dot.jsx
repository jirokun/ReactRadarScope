var React = require('react');
var RadarStore = require('../stores/RadarStore');

var Dot = React.createClass({
  componentWillMount: function() {
    RadarStore.addStoreChangeListener(this._radarStoreChange);
  },
  componentWillUnmount: function() {
    RadarStore.removeStoreChangeListener(this._radarStoreChange);
  },
  componentWillReceiveProps: function(nextProps) {
    this._prevX = this.props.x;
    this._prevY = this.props.y;
  },
  componentDidUpdate: function() {
    if (this._prevX === this.props.x && this._prevY === this.props.y) return;
    var xmlns = "http://www.w3.org/2000/svg";
    var el = document.createElementNS(xmlns, 'animateTransform');
    el.setAttributeNS(null, 'attributeName', 'transform');
    el.setAttributeNS(null, 'type', 'translate');
    el.setAttributeNS(null, 'dur', '1s');
    el.setAttributeNS(null, 'from', this._prevX + ',' + this._prevY);
    el.setAttributeNS(null, 'to', this.props.x + ',' + this.props.y);
    el.setAttributeNS(null, 'begin', 'indefinite');
    el.setAttributeNS(null, 'end', 'indefinite');
    var g = this.refs.g.getDOMNode().appendChild(el);
    var animateTransforms = g.getElementsByTagName('animateTransform');
    for (var i = 0; i < animateTransforms.length; i++) {
      g.removeChild(animateTransforms[0]);
    }
    this.refs.g.getDOMNode().appendChild(el);
    el.beginElement();
  },
  _radarStoreChange: function() {
    this.forceUpdate();
  },
  _selectedCircle: function(key) {
    var circleStyle = {
      fill: 'none',
      strokeWidth: 3,
      stroke: this.props.fill
    };

    return this.props.product.id == RadarStore.getSelectedOss() ?
      <circle key={key + "-circle-selected"} r="13" style={circleStyle}></circle> : null;
  },
  render: function() {
    var circleStyle = {
      fill: this.props.fill,
      stroke: this.props.fill
    };
    var textStyle = {
      fontFamily: 'Arial',
      stroke: 'none',
      fill: '#ffffff',
      textAnchor: 'middle',
      fontSize: '9px',
      fontWeight: 'bold'
    };
    var transform = 'translate(' + this.props.x + ',' + this.props.y + ')';
    var key = "dot-" + this.props.num;
    var svg = '<circle r="8" style="fill: ' + this.props.fill + ';stroke: ' + this.props.fill + ';"></circle>'
      + '<text y="3" style="font-family: Arial; stroke: none; fill: #ffffff; text-anchor: middle; font-size: 9px; font-weight: bold">' + this.props.num + '</text>'
    return (
      <g key={key} ref="g" transform={transform} dangerouslySetInnerHTML={{__html: svg}}></g>
    );
  },

});

module.exports = Dot;
