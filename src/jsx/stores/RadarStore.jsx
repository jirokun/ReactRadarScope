var RadarDispatcher = require('../dispatchers/RadarDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../Constants');
var merge = require('react/lib/merge');

var _selectedOss;

var RadarStore = merge(EventEmitter.prototype, {
  getSelectedOss: function() { return _selectedOss; },
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
    default:
      return true;
  }
  return true; // No errors.  Needed by promise in Dispatcher.
});

module.exports = RadarStore;
