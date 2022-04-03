const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type:String,
        required:true,
        unique: true,
    },
    password: {
        type:String,
        required:true,
    },
    name: {
        type:String,
        required:true,
    }, 

    date_created: {
        type:Date,
        default:Date.now
    },
})

module.exports = mongoose.model('users',UserSchema);