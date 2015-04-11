var mongoose = require('mongoose');

module.exports = mongoose.model('Device', {
    key : {type : String, default: ''},
    name : {type : String, default: ''}
});