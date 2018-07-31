let request = require('request');
let cheerio = require('cheerio');

request.get('https://vrmasterleague.com/Onward/Matches.aspx', function (err, res, body) {
    let $ = cheerio.load(body);

    $('#MatchesRecent_MatchesNode .matches_table td').each((index, element)=>{
        console.log($(element).children().first().text());
    })
})