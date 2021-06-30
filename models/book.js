const mongoose = require('mongoose');
const categories = require('./categories')

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: String,
    author: {
        type: String,
        required: true
    },
    series: String,
    category: {
        type: String,
        required: true,
        enum: categories
    },
    location: String,
    timesRead: {
        type: Number
    }
})

const Book = mongoose.model('Book', bookSchema)
module.exports = Book