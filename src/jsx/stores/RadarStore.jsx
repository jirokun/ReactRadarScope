var RadarDispatcher = require('../dispatchers/RadarDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../Constants');
var merge = require('react/lib/merge');
var async = require('async');
var request = require('superagent');
var Colr = require('colr');

var _selectedOss, _ranking, _categories, _products, _yearMonth, _positionCache = {}, _dotPosition = [], _colorCache = {};

function loadData(yearMonth) {
    async.map([
        Constants.ROOT_PATH + yearMonth +  '.json',
        Constants.ROOT_PATH + 'categories.json',
        Constants.ROOT_PATH + 'products.json'], function(url, cb) {
      request.get(url).end(function(res) { cb(null, res); });
    }, function(err, responses) {
      for (var i = 0, len = responses.length; i < len; i++) {
        if (responses[i].error) {
          return;
        }
      }
      _ranking = responses[0].body;
      _categories = responses[1].body;
      _products = responses[2].body;
      _yearMonth = yearMonth;
      _dotPosition = calcDotPosition();
      RadarStore.emitChange();
    }
  );
}
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

function countGenre() {
  var counter = 0;
  var categoryInfo = getCategoryInfo();
  for (var cname in categoryInfo) {
    for (var gname in categoryInfo[cname]) {
      counter++;
    }
  }
  return counter;
}
function getCategoryInfo() {
  var info = {};
  _ranking.forEach(function(p) {
    var cname = p.category.displayName;
    if (!info[cname]) info[cname] = {};
    var gname = p.genre.displayName;
    if (!info[cname][gname]) info[cname][gname] = true;
  });
  return info;
}

function makeColorTable() {
  var cacheKey= _categories.join('')
  if (_colorCache[cacheKey]) return _colorCache[cacheKey];
  var hsvDelta = Math.round(360 / countGenre());
  var colorTable = {};
  var categoryInfo = getCategoryInfo();
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

function calcDotPosition() {
  if (_positionCache[_yearMonth]) return _positionCache[_yearMonth];
  var categoryAngle = 2 * Math.PI / 6;
  var fullScore = 5;
  var coords = [];
  var minimumDistanceSquare = Math.pow(2 * 8, 2) * (Math.random() + 1.5);
  var dx, dy;
  var colorTable = makeColorTable();
  var positions = _ranking.map(function(product, index) {
    var distance = Constants.RADER_RADIUS / 4 * (fullScore - product.score);
    var genre_index = _categories.indexOf(product.category.displayName);
    var maxDistance = 0;
    for (var i = 0; i < 100; i++) {
      var theta = Math.random() * categoryAngle * 0.8 + categoryAngle * genre_index + categoryAngle * 0.1;
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
      color: colorTable[product.category.displayName][product.genre.displayName],
      x: dx,
      y: dy
    };
  });
  _positionCache[_yearMonth] = positions; // 一度計算したポジションはキャッシュする
  return positions;
}

var RadarStore = merge(EventEmitter.prototype, {
  getSelectedOss: function() { return _selectedOss; },
  getCategories: function() { return _categories; },
  getProducts: function() { return _products; },
  getRanking: function() { return _ranking; },
  getDotPosition: function() { return _dotPosition; },
  emitChange: function() {
    this.emit(Constants.RADAR_STORE_CHANGE);
  },
  addStoreChangeListener: function(callback) {
    this.on(Constants.RADAR_STORE_CHANGE, callback);
  },
  removeStoreChangeListener: function(callback) {
    this.removeListener(Constants.RADAR_STORE_CHANGE, callback);
  }
});
RadarStore.setMaxListeners(160);

RadarDispatcher.register(function(payload) {
  switch(payload.actionType) {
    case Constants.UPDATE_SELECTED_OSS:
      _selectedOss = payload.ossId;
      RadarStore.emitChange();
      break;
    case Constants.LOAD_DATA:
      loadData(payload.yearMonth);
      break;
    default:
      return true;
  }
  return true; // No errors.  Needed by promise in Dispatcher.
});

module.exports = RadarStore;
