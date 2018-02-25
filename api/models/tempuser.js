var mongoose = require('mongoose');
tempuserSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    verificationCode: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
}).index({ userId: 1, _id: 1 })
var TempUser = mongoose.model("TempUser", tempuserSchema);
exports.model = TempUser;