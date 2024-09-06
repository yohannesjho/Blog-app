const mongoose = require('mongoose')

const user = new mongoose.Schema(
    {
        userName: String,
        email:String,
        password:String,


    }
)

module.exports = mongoose.model('User', user)