var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');
var cookieSession = require('cookie-session');
var request = require('request');
var mysql = require('mysql');
var bodyParser = require('body-parser');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'authserver',
    database: 'eve'
});
var app = express();
var skillList;

var fits = [
    {
        "FitName": "Arazu fit",
        "ShipName": "Arazu",
        "LowSlot": ["1600mm Steel Plates II", "Reactive Armor Hardener", "Energized Adaptive Nano Membrane II", "Energized Adaptive Nano Membrane II", "Energized Adaptive Nano Membrane II", "Energized Adaptive Nano Membrane II"],
        "MidSlot": ["Shadow Serpentis Warp Scrambler", "Shadow Serpentis Warp Disruptor", "10MN Afterburner II", "Remote Sensor Dampener II, Targeting Range Dampening Script", "Remote Sensor Dampener II, Targeting Range Dampening Script", "Remote Sensor Dampener II, Targeting Range Dampening Script"],
        "HighSlot": ["Covert Ops Cloaking Device II", "[Empty High slot]", "[Empty High slot]", "[Empty High slot]"],
        "RigSlot": ["Medium Trimark Armor Pump II", "Medium Trimark Armor Pump II"],
        "Cargo": ["Warrior SW-300 x5"]
    }, {
        "FitName": " Arazu fit2",
        "ShipName": "Arazu",
        "LowSlot": ["1600mm Steel Plates II", "Reactive Armor Hardener", "Energized Adaptive Nano Membrane II", "Energized Adaptive Nano Membrane II"],
        "MidSlot": ["Shadow Serpentis Warp Scrambler", "Shadow Serpentis Warp Disruptor", "10MN Afterburner II", "Remote Sensor Dampener II, Targeting Range Dampening Script", "Remote Sensor Dampener II, Targeting Range Dampening Script", "Remote Sensor Dampener II, Targeting Range Dampening Script"],
        "HighSlot": ["Covert Ops Cloaking Device II", "[Empty High slot]", "[Empty High slot]", "[Empty High slot]"],
        "RigSlot": ["Medium Trimark Armor Pump II", "Medium Trimark Armor Pump II"],
        "Cargo": ["Warrior SW-300 x5"]
}];

connection.connect(function (error) {
    if (error) {
        console.error(error);
        return;
    }
});

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));
app.use(express.static('public'))
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.use(cookieSession({
    keys: ['password']
}));

app.get('/', function (req, res) {
    /*res.redirect('https://login.eveonline.com/oauth/authorize/?response_type=code' +
        '&redirect_uri=http://auth.sudden-impact.online/callback&client_id=377645b262b34c87a68bce8963ae2847' +
        '&scope=esi-skills.read_skills.v1&state=uniquestate123');*/
    connection.query("SELECT * FROM fit;", function (error, results, fields) {
        if (error) {
            console.error(error);
            return;
        }
        console.log(results.length);
        if (results.length != 0) {
            var fitJson = '[';
            results.forEach((result, index, array) => {
                fitJson += result['fitJson'];
                if (index == (array.length - 1)) {
                    fitJson += ']';
                } else {
                    fitJson += ',';
                }
            });
            fitJson = JSON.parse(fitJson);
            res.render('fits', {
                admin: true,
                fit: fitJson
            });
        }
    });
});

app.post('/editfit', function (req, res) {
    if (req.method != 'POST')
        return;

    var t3;
    if (req.body.T3) {
        t3 = 1;
    } else {
        t3 = 0;
    }
    var lines = req.body.fitJson.split('\n');
    parseFit(lines, t3, function (data) {
        console.log(data);
        var UpdateQuery = "UPDATE fit SET fitJson = '" + JSON.stringify(data) + "' WHERE fitName = '" + data['FitName'] + "';";
        connection.query(UpdateQuery, function (error, results, fields) {
            if (error) {
                console.error(error);
                return;
            }
            if (results['affectedRows'] == 0) {
                var InsertQuery = "INSERT INTO fit VALUES('" + data['FitName'] + "', '" + JSON.stringify(data) + "', '" + t3 + "');";
                connection.query(InsertQuery, function (error, results, fields) {
                    if (error) {
                        console.error(error);
                        return;
                    }
                    for (var i = 0; i < 1000; i++) {
                        if (i == 999) {
                            console.log('sending 200 status');
                            res.end(JSON.stringify({response: '200'}));
                        }
                    }
                });
            } else {
                for (var i = 0; i < 1000; i++) {
                    if (i == 999) {
                        console.log('sending 200 status');
                        res.end(JSON.stringify({response: '200'}));
                    }
                }
            }
        });
    });
});

app.get('/skill', function (req, res) {
    GetAccessCode(req, function () {
        var options = {
            method: 'GET',
            headers: {
                'User-Agent': 'rusherz ieatrusherz34@gmail.com',
                'Authorization': 'Bearer ' + req.session.access_token,
                'Accept': 'application/json',
                'Host': 'esi.tech.ccp.is'
            },
            url: 'https://esi.tech.ccp.is/latest/characters/' + req.session.charId + '/skills/'
        }
        MakeRequest(options, function (body) {
            skillList = JSON.parse(body)['skills'];
            HtmlString(function (html) {
                res.render('skills', {
                    skill: html
                });
            })
        });
    });
});

app.get('/callback', function (req, res) {
    if (req.session.refrresh_token == null)
        req.session.code = req.query.code;
    res.redirect('/skill');
});

app.listen(3000, function (error) {
    if (error) {
        console.error(error);
        return;
    }
    console.log('server started on port 3000');
});

function MakeRequest(options, callback) {
    request(options, function (error, response, body) {
        if (error) {
            console.error(error);
            return;
        }
        callback(body);
    });
}

function GetAccessCode(req, callback) {
    if (req.session.refresh_token == null) {
        var code = req.session.code;
        var options = {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + new Buffer('377645b262b34c87a68bce8963ae2847:LNZsrtvVaSWzvkXjss3YRiSrhv7AIMhvJAfO58Gf').toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded',
                'Host': 'login.eveonline.com'
            },
            url: 'https://login.eveonline.com/oauth/token',
            body: 'grant_type=authorization_code&code=' + code
        }
        console.log('getting new token');
    } else {
        var options = {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + new Buffer('377645b262b34c87a68bce8963ae2847:LNZsrtvVaSWzvkXjss3YRiSrhv7AIMhvJAfO58Gf').toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded',
                'Host': 'login.eveonline.com'
            },
            url: 'https://login.eveonline.com/oauth/token',
            body: 'grant_type=refresh_token&refresh_token=' + req.session.refresh_token
        }
        console.log('refreshing token');
    }
    MakeRequest(options, function (body) {
        req.session.access_token = JSON.parse(body)['access_token'];
        req.session.refresh_token = JSON.parse(body)['refresh_token'];
        var options = {
            method: 'GET',
            headers: {
                'User-Agent': 'rusherz ieatrusherz34@gmail.com',
                'Authorization': 'Bearer ' + req.session.access_token,
                'Host': 'login.eveonline.com'
            },
            url: 'https://login.eveonline.com/oauth/verify'
        }
        MakeRequest(options, function (body) {

            req.session.charId = JSON.parse(body)['CharacterID'];
            callback();
        });
    });
}

function HtmlString(callback) {
    var s = '';
    var html = new Array();
    fits.forEach(function (fit, index1) {
        s = 'SELECT * FROM Skills WHERE';
        var emptyFirstSlot = false;
        fit.LowSlot.forEach(function (item, index2) {
            if (item == '[Empty Low slot]') {
                return;
            }
            if (index2 == 0 && !emptyFirstSlot) {
                s += ' ItemName = "' + item + '"';
            } else {
                s += ' OR ItemName = "' + item + '"';
            }
        });
        fit.MidSlot.forEach(function (item) {
            if (item == '[Empty Mid slot]') {
                return;
            }
            s += ' OR ItemName = "' + item + '"';
        });
        fit.HighSlot.forEach(function (item) {
            if (item == '[Empty High slot]') {
                return;
            }
            s += ' OR ItemName = "' + item + '"';
        });
        fit.RigSlot.forEach(function (item) {
            if (item == '[Empty Rig slot]') {
                return;
            }
            s += ' OR ItemName = "' + item + '"';
        });
        s += ';';
        connection.query(s, function (error, results, fields) {
            if (error) {
                console.error(error);
                return;
            }


            var htmlstring = '<div data-role="collapsible">';
            htmlstring += '<h4>' + fit.FitName + '</h4>';
            htmlstring += '<ul data-role="listview">';
            fit.LowSlot.forEach(function (item) {
                if (item == '[Empty Low slot]') {
                    return;
                }
                htmlstring += StringFormat(results, item);
            });
            fit.MidSlot.forEach(function (item) {
                if (item == '[Empty Mid slot]') {
                    return;
                }
                htmlstring += StringFormat(results, item);
            });
            fit.HighSlot.forEach(function (item) {
                if (item == '[Empty High slot]') {
                    return;
                }
                htmlstring += StringFormat(results, item);
            });
            fit.RigSlot.forEach(function (item) {
                if (item == '[Empty Rig slot]') {
                    return;
                }
                htmlstring += StringFormat(results, item);
            });
            htmlstring += '</ul></div>';
            html.push(htmlstring);
            if (html.length == fits.length) {
                callback(html);
            }
        });
    });
}

function StringFormat(results, item) {
    var htmlstring = '';
    results.forEach((result) => {
        if (result.ItemName != item)
            return;
        skillList.forEach((skill) => {
            if (skill['skill_id'] == result.SkillId) {
                if (skill['current_skill_level'] == result.SkillLevel) {
                    htmlstring += '<li><a href="#" style="color: green">';
                } else {
                    htmlstring += '<li><a href="#" style="color: red">';
                }
            }
        });
        htmlstring += 'ItemName: ' + result.ItemName +
            '<ul>' +
            '<li>Skill Name: ' + result.SkillName + '</li>' +
            '<li>Skill level needed: ' + result.SkillLevel + '</li>' +
            '</ul>' +
            '</a></li>';
    });
    return htmlstring;
}

function parseFit(lines, t3, callback) {
    var fit;
    if (t3 == 1) {
        fit = {
            "FitName": "",
            "ShipName": "",
            "LowSlot": [],
            "MidSlot": [],
            "HighSlot": [],
            "RigSlot": [],
            "Mods": [],
            "Cargo": []
        }
    } else {
        fit = {
            "FitName": "",
            "ShipName": "",
            "LowSlot": [],
            "MidSlot": [],
            "HighSlot": [],
            "RigSlot": [],
            "Cargo": []
        }
    }
    var space = 0;
    lines.forEach((line, index, array) => {
        if (line != '') {
            if (space == 0) {
                var temp = line.replace('[', '').replace(']', '').split(', ');
                fit.FitName = temp[1];
                fit.ShipName = temp[0];
            } else if (space == 1) {
                fit.LowSlot.push(line);
            } else if (space == 2) {
                fit.MidSlot.push(line);
            } else if (space == 3) {
                fit.HighSlot.push(line);
            } else if (space == 4) {
                fit.RigSlot.push(line);
            } else if (t3 && space == 5) {
                fit.Mods.push(line);
            } else {
                fit.Cargo.push(line);
            }
        } else {
            space++;
        }
        if (index == (array.length - 1)) {
            callback(fit);
        }
    });

}
