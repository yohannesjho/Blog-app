require('dotenv').config();
const mongoose = require('mongoose')
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const session = require('express-session');


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    res.locals.userId = req.session.userId;
    res.locals.isAuthenticated = req.session && req.session.userId;
    next();
});


//database configuration
mongoose.connect(process.env.MONGO_DB_URI).then(
    ()=>{console.log('connected to db')}
) 

const PORT = process.env.PORT || 2000;

app.use(express.static('public'))

// Templates engine
app.use(expressLayout);
app.set('layout', './layout/main');
app.set('view engine', 'ejs');

// Route import and usage
const mainRoutes = require('./server/routes/main');
app.use('/', mainRoutes);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
