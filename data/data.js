/* var env = process.env.NODE_ENV || 'development';
var config = require('../env/config')[env];*/
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://zarak995:ZaraKhumba23@cluster0-shard-00-00-wxeue.mongodb.net:27017,cluster0-shard-00-01-wxeue.mongodb.net:27017,cluster0-shard-00-02-wxeue.mongodb.net:27017/suggestionBoxDB?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin",{useMongoClient:true});
