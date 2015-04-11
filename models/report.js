var mongoose = require('mongoose');

module.exports = mongoose.model('Report', {
    report : {type : String, default: ''},
});