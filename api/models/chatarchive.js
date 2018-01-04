var mongoose = require('mongoose');
var chatarchiveschema = new mongoose.Schema({
    dateArchived: {
        type: Date,
        default: Date.now
    },
    archivedChat: Object
})
var Chatarchive = mongoose.model('Chatarchives', chatarchiveschema);
module.exports = Chatarchive;