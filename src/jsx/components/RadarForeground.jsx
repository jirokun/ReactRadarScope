var React = require('react');
var uuid = require('node-uuid');
var Dot = require('./Dot');
var Colr = require('colr');
var RadarStore = require('../stores/RadarStore');
var Constants = require('../Constants');

var RadarForeground = React.createClass({
  shouldComponentUpdate: function() {
    return this._currentRanking.length === 0 || (JSON.stringify(this.props.ranking) !== JSON.stringify(this._currentRanking));
  },
  _countGenre: function() {
    var counter = 0;
    var categoryInfo = this._getCategoryInfo();
    for (var cname in categoryInfo) {
      for (var gname in categoryInfo[cname]) {
        counter++;
      }
    }
    return counter;
  },
  _getCategoryInfo: function() {
    var info = {};
    this.props.ranking.forEach(function(p) {
      var cname = p.category.displayName;
      if (!info[cname]) info[cname] = {};
      var gname = p.genre.displayName;
      if (!info[cname][gname]) info[cname][gname] = true;
    });
    return info;
  },
  _makeColorTable: function() {
    var hsvDelta = Math.round(360 / this._countGenre());
    var colorTable = {};
    var categoryInfo = this._getCategoryInfo();
    var counter = 0;
    for (var cname in categoryInfo) {
      colorTable[cname] = {};
      for (var gname in categoryInfo[cname]) {
        var color = Colr.fromHsv(hsvDelta * counter++, 80, 80).toHex();
        colorTable[cname][gname] = color
      }
    }
    return colorTable;
  },
  _calcDotPosition: function() {
    var _this = this;
    var categoryAngle = 2 * Math.PI / 6;
    var fullScore = 5;
    var coords = [];
    var minimumDistanceSquare = Math.pow(2 * 8, 2) * (Math.random() + 1.5);
    var dx, dy;
    return this.props.ranking.map(function(product, index) {
      var distance = Constants.RADER_RADIUS / 4 * (fullScore - product.score);
      var genre_index = _this.props.categories.indexOf(product.category.displayName);
      for (var i = 0; i < 100; i++) {
        var theta = Math.random() * categoryAngle * 0.8 + categoryAngle * genre_index + categoryAngle * 0.1;
        // 0.8を掛けているのは角度の深い方の境界線に被らないようにするため
        // 0.1を掛けて足しているのも角度の浅い方の境界線に被らないようにするため

        // 角度から座標を取得
        var x = Math.round(Constants.RADER_CENTER_X + distance * Math.sin(theta));
        var y = Math.round(Constants.RADER_CENTER_Y - distance * Math.cos(theta));

        var ret = _this._calcDistance(x, y, minimumDistanceSquare, coords);
        if (ret == -1) {
          dx = x;
          dy = y;
          maxDistance = 0;
          break;
        } else if (ret > maxDistance) {
          dx = x;
          dy = y;
          maxDistance = ret;
        }
      }
      coords.push({cx: dx, cy: dy});
      return {
        num: index + 1,
        product: product,
        x: dx,
        y: dy
      };
    });
  },
  _calcDistance: function(x, y, minimumDistanceSquare, coords) {
    var ret = -1;
    var min = Number.MAX_VALUE;
    var length = coords.length;
    if (length === 0)
      return -1;

    for (var i = 0; i < length; i++) {
      var cx = coords[i].cx;
      var cy = coords[i].cy;
      var d = Math.pow(cx - x, 2) + Math.pow(cy - y, 2);
      if (d < minimumDistanceSquare) {
        if (d < min) {
          ret = min = d;
        }
      }
    }
    return ret;
  },

  render: function() {
    this._makeColorTable();
    var cinfo = this._getCategoryInfo();
    var positions = this._calcDotPosition();
    var colorTable = this._makeColorTable();
    var selectedOssId = RadarStore.getSelectedOss();
    this._currentRanking = this.props.ranking;
    return (
      <g key="foreground">
        {positions.map(function(pos, i) {
          var p = pos.product;
          var color = colorTable[p.category.displayName][p.genre.displayName];
          return <Dot key={'dot-' + pos.product.id} num={pos.num} fill={color} product={pos.product} x={pos.x} y={pos.y}/>
        })}
      </g>
    );
  },

});

module.exports = RadarForeground;
