const mongoose = require('mongoose');
const Book = require('../models/book');
const seedBooks = require('./books');

mongoose.connect('mongodb://localhost:27017/bookApp', {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }).then(() => {
        console.log('db connected');
    }).catch(err => {
        console.log(err);
    });

const seedDB = async () => {
    await Book.deleteMany({});
    await Book.insertMany(seedBooks)
    .then(res => {
        console.log(res)
    })
    .catch(e => {
        console.log(e)
    })
}

seedDB();
