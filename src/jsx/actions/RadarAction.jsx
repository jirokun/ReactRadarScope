var RadarDispatcher = require('../dispatchers/RadarDispatcher');
var Constants = require('../Constants');

var RadarAction = {
  updateSelectedOss: function(ossId) {
    RadarDispatcher.dispatch({
      actionType: Constants.UPDATE_SELECTED_OSS,
      ossId: ossId
    });
  }
};

module.exports = RadarAction;
