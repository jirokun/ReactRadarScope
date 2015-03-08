var RadarDispatcher = require('../dispatchers/RadarDispatcher');
var EventEmitter = require('event-emitter'); // node.jsのeventsを使用しないこと。Nashornでは使用できない
var Constants = require('../Constants');
var merge = require('react/lib/merge');
var async = require('async');
var Colr = require('colr');

var _selectedOss, _positionCache = {}, _colorCache = {};

// Dotの中心からの距離を計算する
function calcDistance(x, y, minimumDistanceSquare, coords) {
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
}

// displayNameがcategoriesの中の何番目のデータなのか取得する
function findCategoryIndex(categories, displayName) {
  for (var i = 0, len = categories.length; i < len; i++) {
    if (categories[i].displayName === displayName) return i;
  }
  return -1;
}
function calcDotPosition(yearMonth, ranking, categories) {
  if (_positionCache[yearMonth]) return _positionCache[yearMonth];
  var categoryAngle = 2 * Math.PI / 6;
  var fullScore = 5;
  var coords = [];
  var minimumDistanceSquare = Math.pow(2 * 8, 2) * (Math.random() + 1.5);
  var dx, dy;
  var colorTable = makeColorTable(ranking, categories);
  var positions = ranking.map(function(product, index) {
    var distance = Constants.RADER_RADIUS / 4 * (fullScore - product.score);
    var categoryIndex = findCategoryIndex(categories, product.category.displayName);
    var maxDistance = 0;
    for (var i = 0; i < 100; i++) {
      var theta = Math.random() * categoryAngle * 0.8 + categoryAngle * categoryIndex + categoryAngle * 0.1;
      // 0.8を掛けているのは角度の深い方の境界線に被らないようにするため
      // 0.1を掛けて足しているのも角度の浅い方の境界線に被らないようにするため

      // 角度から座標を取得
      var x = Math.round(Constants.RADER_CENTER_X + distance * Math.sin(theta));
      var y = Math.round(Constants.RADER_CENTER_Y - distance * Math.cos(theta));

      var ret = calcDistance(x, y, minimumDistanceSquare, coords);
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
      color: colorTable[product.category.displayName][product.childCategory.displayName],
      x: dx,
      y: dy
    };
  });
  _positionCache[yearMonth] = positions; // 一度計算したポジションはキャッシュする
  return positions;
}

function countChildCategories(ranking) {
  var counter = 0;
  var categoryInfo = getCategoryInfo(ranking);
  for (var cname in categoryInfo) {
    for (var gname in categoryInfo[cname]) {
      counter++;
    }
  }
  return counter;
}
function getCategoryInfo(ranking) {
  var info = {};
  ranking.forEach(function(p) {
    var cname = p.category.displayName;
    if (!info[cname]) info[cname] = {};
    var gname = p.childCategory.displayName;
    if (!info[cname][gname]) info[cname][gname] = true;
  });
  return info;
}

function makeColorTable(ranking, categories) {
  var cacheKey= categories.join('')
  if (_colorCache[cacheKey]) return _colorCache[cacheKey];
  var hsvDelta = Math.round(360 / countChildCategories(ranking));
  var colorTable = {};
  var categoryInfo = getCategoryInfo(ranking);
  var counter = 0;
  for (var cname in categoryInfo) {
    colorTable[cname] = {};
    for (var gname in categoryInfo[cname]) {
      var color = Colr.fromHsv(hsvDelta * counter++, 80, 80).toHex();
      colorTable[cname][gname] = color
    }
  }
  _colorCache[cacheKey] = colorTable;
  return colorTable;
}

var RadarStore = EventEmitter({
  getSelectedOss: function() { return _selectedOss; },
  calcDotPosition: calcDotPosition,
  emitChange: function() {
    this.emit(Constants.RADAR_STORE_CHANGE);
  },
  addStoreChangeListener: function(callback) {
    this.on(Constants.RADAR_STORE_CHANGE, callback);
  },
  removeStoreChangeListener: function(callback) {
    this.off(Constants.RADAR_STORE_CHANGE, callback);
  }
});

RadarDispatcher.register(function(payload) {
  switch(payload.actionType) {
    case Constants.UPDATE_SELECTED_OSS:
      _selectedOss = parseInt(payload.ossId, 10);
      RadarStore.emitChange();
      break;
    default:
      return true;
  }
  return true; // No errors.  Needed by promise in Dispatcher.
});

module.exports = RadarStore;
