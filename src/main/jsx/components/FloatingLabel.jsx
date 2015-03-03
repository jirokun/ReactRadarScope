var React = require('react');
var xmlns = "http://www.w3.org/2000/svg";

var FloatingLabel = React.createClass({
  getInitialProps: function() {
    return {
      dotPosition: []
    };
  },
  render: function() {
    var targetPos;
    for (var i = 0, len = this.props.dotPosition.length; i < len; i++) {
      var pos = this.props.dotPosition[i];
      if (pos.product.id === this.props.selectedOssId) {
        targetPos = pos;
        break;
      }
    }
    if (!targetPos) return <div></div>;
    var style = {
      backgroundColor: '#d9edf7',
      border: '1px solid #31708f',
      padding: '5px',
      position: 'absolute',
      top: targetPos.y + 10 + 'px',
      left: targetPos.x + 10 + 'px'
    };
    var key = "dot-" + this.props.num;
    return (
      <div key="floating-label" style={style}>
        <div>{targetPos.product.name}</div>
        <div>総合スコア: {targetPos.product.score}</div>
      </div>
    );
  },

});

module.exports = FloatingLabel;
