var express = require('express');
var router = express.Router();
var fs = require('fs');

// Get Homepage
router.get('/', function(req, res){
    res.writeHead(200,{'Content-Type':'video/mpg'});
    var rs = fs.createReadStream(__dirname + "/../public/videos/58fce2343234a909d80681a9/example.mpg");
    rs.pipe(res);
});

router.get('/dashboard', IsLoggedIn, function(req, res){
    res.render('bashboard');
});

function IsLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash('error_msg', 'You are not loggedf in.');
        res.redirect('/users/login');
    }
}

module.exports = router;