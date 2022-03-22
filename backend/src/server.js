const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');

// Allows us to use sessions
app.use(session({
    secret: "SESSION_SECRET", 
    resave: false, 
    saveUninitialized: false,
    cookie: {maxAge: 3600000}
}));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => res.json({message: 'Hello '}))

app.listen(8080);