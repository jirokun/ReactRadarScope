var React = require('react');
var RadarAction = require('../actions/RadarAction');
var RadarStore = require('../stores/RadarStore');

var OssList = React.createClass({
  _lists: function() {
    var _this = this;
    var ranks = {};
    this.props.ranking.forEach(function(oss, i) {
      ranks[oss.id] = {
        rank: i + 1,
        top: i * 20
      };
    });
    return this.props.products.map(function(oss, i) {
      var style = {
        position: 'absolute',
        width: '100%',
        transition: 'top 1s',
        top: ranks[oss.id].top + 'px'
      };
      var label = ranks[oss.id].rank + '. ' + oss.name;
      return <li key={'oss-' + oss.id} style={style} onMouseOver={_this._onMouseOver} data-ossid={oss.id}>{label}</li>
    });
  },
  _onMouseOver: function(e) {
    var ossId = e.target.getAttribute('data-ossid');
    RadarAction.updateSelectedOss(ossId);
  },
  render: function() {
    var listStyle = {
      position: 'relative'
    };
    return (
      <div key="oss" className="list-container">
        <div key="oss-container" className="oss-container">
          <h3 key="oss-title">対象のOSS</h3>
          <ul key="oss-list" className="oss-list" style={listStyle}>
            { this._lists() }
          </ul>
        </div>
      </div>
    );
  },

});

module.exports = OssList;
