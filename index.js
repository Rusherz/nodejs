let request = require('request');
let cheerio = require('cheerio');

request.get('https://vrmasterleague.com/Onward/Matches.aspx', function (err, res, body) {
    let $ = cheerio.load(body);
    let string = ''
    $('#MatchesRecent_MatchesNode .matches_table tr').each((index, element) => {
        $(element).find('td').each((i, elm) => {
            if (i == 2) {
                string += i + ' ' + $(elm).children().last().text() + ' '
            } else {
                string += i + ' ' + $(elm).children().first().text() + ' '
            }
        })
        string += '\n';
    })
    console.log(string);
})