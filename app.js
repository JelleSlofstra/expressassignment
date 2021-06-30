    const express = require('express');
    const mongoose = require('mongoose');
    const ejsMate = require('ejs-mate');
    const session = require('express-session');
    const ExpressError = require('express-error');
    const mongoSanitize = require('express-mongo-sanitize');
    const MongoDBStore = require("connect-mongo")(session);
    const path = require('path');
    const router = express.Router();
    const bodyParser = require("body-parser");
    const assert = require('assert');
    const methodOverride = require('method-override')

    const app = express();

    const Book = require('./models/book');
    const categories = require('./models/categories')
    const { captureRejectionSymbol } = require('events');

    mongoose.connect('mongodb://localhost:27017/bookApp', {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }).then(() => {
        console.log('db connected');
    }).catch(err => {
        console.log(err);
    });

    app.set('view engine', 'ejs')
    app.set('views', path.join(__dirname, '/views'))

    // set public folder to include CSS and JS in your main template
    // like href="css/main.css"
    // see index.ejs template
    app.use(express.static(__dirname + '/public'));

    // paths for including Bootstrap, jQuery and Popper
    app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
    app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
    app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
    app.use('/popper', express.static(__dirname + '/node_modules/popper.js/dist/'));

    // retrieve data from posts in JSON format
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(methodOverride('_method'))

    // put your routes here
    app.get('/', (req, res) => {
        res.render('layouts/index', { page: 'home' })
    });

    app.get('/books', async (req,res) => {
        const { category } = req.query
        if (category){
            const books = await Book.find({category})
            res.render('layouts/index', { page: 'books', books, categories } )
        } else {
            const books = await Book.find({})
            res.render('layouts/index', { page: 'books', books, categories } )
        }        
    })

    app.get('/new', (req,res) => {
        res.render('layouts/index', { page: 'new', categories})   
    })

    app.post('/books', async (req,res) => {
        const newBook = new Book(req.body)
        await newBook.save()
        res.redirect(`books/${newBook._id}`)
    })

    app.get('/books/:id', async (req, res) => {
        const { id } = req.params;
        const foundBook = await Book.findById(id)
        res.render('layouts/detailspage', { foundBook })
    });

    app.get('/series', async (req, res) => {
        const { series } = req.query
        const books = await Book.find({series})
        res.render('layouts/index', { page: 'books', books, categories })
    });

    app.get('/author', async (req, res) => {
        const { author } = req.query
        const books = await Book.find({author})
        res.render('layouts/index', { page: 'books', books, categories })
    });

    app.get('/books/:id/edit', async (req,res) => {
        const { id } = req.params;
        const foundBook = await Book.findById(id)
        res.render('layouts/editpage', { foundBook, categories})   
    })

    app.put('/books/:id', async(req,res) => {
        const { id } = req.params;
        const foundBook = await Book.findByIdAndUpdate(id, req.body, {runValidators: true})
        res.redirect(`/books/${foundBook._id}`)
    })

    app.delete('/books/:id', async(req,res) => {
        const { id } = req.params;
        const deletedBook = await Book.findByIdAndDelete(id)
        res.redirect('/books')
    })
    

    // set up a port for your localhost
    app.listen(8080, () => {
        console.log('Hi! :-) I\'m listening to port 8080')
    }); 