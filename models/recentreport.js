var mongoose = require('mongoose');

module.exports = mongoose.model('RecentReport', {
    BSSID : {type : String, default: '00:00:00:00'},
    SSID : {type : String, default: 'Hidden Network'},
    frequency : {type : String, default: '0.0'},
    quality : {type : String, default: '0'},
    signal : {type : String, default: '0'},
    encrypted : {type : String, default: 'false'},
    cypher : {type : String, default: ''},
    channel : {type : String, default: '0'}
});