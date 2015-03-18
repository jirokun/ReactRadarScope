var React = require('react');
var Router = require('react-router');
var Constants = require('../Constants');

var RadarBackground = React.createClass({
  mixins: [ Router.Navigation ],
  componentDidMount: function() {
    // なぜかonClick属性でイベントリスなを登録できなかったため、ここでラベルクリックをハンドルする
    document.body.addEventListener('click', this._onCategoryClick, false);
  },
  componentWillUnmount: function() {
    document.body.removeEventListener('click', this._onCategoryClick);
  },
  _onCategoryClick: function(e) {
    if (e.target.tagName.toUpperCase() !== 'TEXT' || this.props.isChildCategory) return;
    var categoryId = e.target.getAttribute('data-categoryid');
    this.transitionTo(Constants.ROOT_PATH + 'radarScope/category/' + categoryId + '/' + this.props.yearMonth);
  },
  _categoryName: function() {
    var _this = this;
    return this.props.categories.map(function(category, i) {
      var textStyle = {
        fontSize: '14px',
        fontFamily: 'Arial',
        textAnchor: 'middle'
      };
      if (!_this.props.isChildCategory) textStyle.cursor = 'pointer';
      var translate = 'translate(' + Constants.RADER_CENTER_X + ',' + Constants.RADER_CENTER_Y + ')';
      var arc = 360 / _this.props.categories.length;
      var radian = arc * i + arc / 2;
      var rotate = 'rotate(' + radian + ')';
      var transform = translate + ' ' + rotate;
      // 下側に来たラベルは180度回転させる
      var labelRot = radian > 90 && radian < 270 ? 180 : 0;
      return (
        <g key={'category-label-group-' + i} transform={transform}>
          <text key={'category-label-' + i} className="category-label" data-categoryid={category.id} transform={'rotate(' + labelRot + ',0,-300)'} y="-300" stroke="none" fill="#666666" style={textStyle}>{category.displayName}</text>
        </g>
      );
    });
  },
  _circles: function() {
    var circles = [];
    for (var i = 0; i < 4; i++) {
      circles.push(<circle key={"circle-" + i} cx={Constants.RADER_CENTER_X} cy={Constants.RADER_CENTER_Y} r={(i + 1) * Constants.RADER_SPACING} fill={Constants.RADER_FILL} stroke={Constants.RADER_COLOR}></circle>);
    }
    return circles;
  },
  _borders: function() {
    var borders = [];
    for (var i = 0, len = this.props.categories.length; i < len; i++) {
      var seta = (2 * Math.PI / len) * i;
      var y = Constants.RADER_RADIUS * Math.sin(seta - Math.PI / 2);
      var x = Constants.RADER_RADIUS * Math.cos(seta - Math.PI / 2);
      borders.push(<path key={"borders-" + i} fill={Constants.RADER_FILL} stroke={Constants.RADER_COLOR} d={'M320,330l' + x + ',' + y + 'z'}></path>);
    }
    return borders;
  },
  _ranks: function() {
    var ranks = [];
    for (var i = 1; i <= 4; i++) {
      var y = Constants.RADER_CENTER_Y - (Constants.RADER_SPACING * i) + (Constants.RADER_SPACING / 2);
      ranks.push(<text key={"ranks-" + i} className="rank-text" x={Constants.RADER_CENTER_X} y={y} font="10px Arial">{i}</text>);
    }
    return ranks;
  },
  render: function() {
    return (
      <g>
        { this._circles() }
        { this._borders() }
        { this._ranks() }
        { this._categoryName() }
      </g>
    );
  },

});

module.exports = RadarBackground;
