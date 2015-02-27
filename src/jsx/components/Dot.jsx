var React = require('react');
var RadarAction = require('../actions/RadarAction');
var xmlns = "http://www.w3.org/2000/svg";
var smilSupport = false;
if (typeof(document) !== 'undefined') smilSupport = !!document.createElementNS(xmlns, 'animateTransform').beginElement;

var selectedTextStyle = {
  fontFamily: 'Arial',
  stroke: 'none',
  fill: '#ffffff',
  fontSize: '9px',
  dominantBaseline: 'text-before-edge',
  fontWeight: 'bold'
};

var Dot = React.createClass({
  componentWillReceiveProps: function(nextProps) {
    this._prevX = this.props.x;
    this._prevY = this.props.y;
  },
  componentDidUpdate: function() {
    if (!smilSupport) return;
    if (this._prevX === this.props.x && this._prevY === this.props.y) return;
    var el = document.createElementNS(xmlns, 'animateTransform');
    el.setAttributeNS(null, 'attributeName', 'transform');
    el.setAttributeNS(null, 'type', 'translate');
    el.setAttributeNS(null, 'dur', '1s');
    el.setAttributeNS(null, 'from', this._prevX + ',' + this._prevY);
    el.setAttributeNS(null, 'to', this.props.x + ',' + this.props.y);
    el.setAttributeNS(null, 'fill', 'freeze');
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
  _selectedCircle: function(key) {
    var circleStyle = {
      fill: 'none',
      strokeWidth: 3,
      stroke: this.props.fill
    };

    return this.props.product.id == this.props.selectedOssId ?
      <circle key={key + "-circle-selected"} r="13" style={circleStyle}></circle> : null;
  },
  _onMouseOver: function(e) {
    RadarAction.updateSelectedOss(this.props.product.id);
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
    if (!smilSupport || !this._prevX) {
      var transform = 'translate(' + this.props.x + ',' + this.props.y + ')';
    } else {
      var transform = 'translate(' + this._prevX + ',' + this._prevY + ')';
    }
    var key = "dot-" + this.props.num;
    return (
      <g key={key} ref="g" transform={transform}>
        {this._selectedCircle(key)}
        <circle key={key + '-circle'} r="8" style={circleStyle} onMouseOver={this._onMouseOver}></circle>
        <text key={key + '-text'} y="3" style={textStyle} onMouseOver={this._onMouseOver}>{this.props.num}</text>
      </g>
    );
  },

});

module.exports = Dot;
