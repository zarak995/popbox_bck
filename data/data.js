var env = process.env.NODE_ENV || 'production';
var config = require('../env/config')[env];
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(config.dburl,{useMongoClient:true});
