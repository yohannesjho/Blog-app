const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title:String,
    content:String,
    author: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'User',
        required: true
    },
    createdAt:{type:Date, default:Date.now}
})


module.exports = mongoose.model('Blog',blogSchema)