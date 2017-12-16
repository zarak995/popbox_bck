var mongoose = require('mongoose');
var PostSchema = mongoose.Schema({
    avatar: {
        type:mongoose.Schema.Types.ObjectId, 
        ref:'Avatars'
    },
    chat: {
        type :mongoose.Schema.Types.ObjectId,
        ref:'Chats'
    },
    
    createdDate: {
        type: Date, 
        default: Date.now
    },
    body:{
        type: String,
        require:true
    },
    likes: {
        type: Number
    },
    tags: {
        type:[String]
    }
});
var Post  = mongoose.model('Posts',PostSchema);
module.exports = Post;