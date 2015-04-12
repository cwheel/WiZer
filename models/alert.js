var mongoose = require('mongoose');

module.exports = mongoose.model('Alert', {
    trigger : {type : Number, default: ''},
    gain : {type : String, default: 'Any'},
    SSID : {type : String, default: ''},
});