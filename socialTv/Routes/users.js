var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var fs = require('fs');

var User = require('../models/user');

// Register
router.get('/register', function (req, res) {
    res.render('register');
});

// Login
router.get('/login', function (req, res) {
    res.render('login');
});

// Logout
router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success_msg', 'You are logged out.');
    
    res.redirect('/users/login');
});

// Register User
router.post('/register', function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Password do no match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors
        });
    } else {
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });

        User.CreateUser(newUser, function (err, user) {
            if (err)
                throw err;
            fs.mkdirSync(__dirname + '/../public/videos/' + user.id);
        });

        req.flash('success_msg', 'You are registered and can now login.');

        res.redirect('/users/login');
    }
});

passport.use(new LocalStrategy(
    function(username, password, done){
        User.getUserByUsername(username, function(err, user){
            if(err)
                throw err;
            if(!user)
                return done(null, false, {message: 'Incorrect username.'});
            User.comparePassword(password, user.password, function(err, isMatch){
                if(err)
                    throw err;
                if(isMatch){
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Invalid password'});
                }
            });
        });
    }
));

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.getUserById(id, function(err, user){
       done(err, user); 
    });
})

router.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    }),
    function (req, res) {
        res.redirect('/');
    }
);

module.exports = router;
