var React = require('react');
var RadarAction = require('../actions/RadarAction');

var OssList = React.createClass({
  componentDidUpdate: function() {
    // 選択されているOSSが表示されるようにscrollTopを変更する
    if (!this.props.selectedOssId) return;
    var el = this.refs[this.props.selectedOssId].getDOMNode();
    var listContainer = this.refs.listContainer.getDOMNode();
    var scrollTop = parseInt(listContainer.scrollTop, 10);
    var targetTop = parseInt(el.style.top, 10);
    if (scrollTop > targetTop || scrollTop + 610 < targetTop) {
      listContainer.scrollTop = targetTop;
    }
  },
  _lists: function() {
    var _this = this;
    var ranks = {};
    this.props.dotPosition.forEach(function(pos, i) {
      ranks[pos.product.id] = {
        rank: i + 1,
        color: pos.color,
        top: i * 20
      };
    });

    return this.props.products.map(function(oss, i) {
      var style = {
        position: 'absolute',
        color: ranks[oss.id].color,
        width: '100%',
        transition: 'top 1s',
        top: ranks[oss.id].top + 'px'
      };
      if (_this.props.selectedOssId === oss.id) style.backgroundColor = '#f2dede';
      var label = ranks[oss.id].rank + '. ' + oss.name;
      var url = "http://radar.oss.scsk.info/product/" + oss.id + "/summary/" + _this.props.yearMonth;
      return <li ref={oss.id} key={'oss-' + oss.id} style={style} onMouseOver={_this._onMouseOver} data-ossid={oss.id}>
        <a href={url}>{label}</a>
      </li>
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
          <ul ref="listContainer" key="oss-list" className="oss-list" style={listStyle}>
            { this._lists() }
          </ul>
        </div>
      </div>
    );
  },

});

module.exports = OssList;
