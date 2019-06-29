/* to do list
Put in required packages
set up initial q&a for user
take input from user and call appropriate api
display information from api to the screen
*/

//packages
require('dotenv').config();
const inquirer = require('inquirer');
const axios = require("axios");
var http = require("http");

//apikeys
const omdbKey = process.env.OMDB_apikey;
const bandsKey = process.env.BANDSinTOWN_app_id;
console.log(omdbKey);

const divider = "\n------------------------------------------------------------\n\n";
var fs = require("fs");

//ask the user what they would like to research
inquirer
    .prompt([{
        type: 'list',
        message: 'What can I help you with today?',
        choices: ['Song Request', 'Movie Information', 'Concert Information'],
        name: 'reqSel',
    }]).then(function (inquirerResponse) {
        console.log(inquirerResponse.reqSel);
        switch (inquirerResponse.reqSel) {
            case 'Movie Information':
                inquirer
                    .prompt([{
                        type: 'input',
                        message: 'What movie are you interested in?',
                        name: 'movieSel',
                    }]).then(function (inquirerResponse) {
                        let movieSel = inquirerResponse.movieSel
                        movieFun(movieSel);
                    })
                break;
            case 'Song Request':
                inquirer
                    .prompt([{
                        type: 'input',
                        message: 'Which song would you like information on?',
                        name: 'songSel',
                    }]).then(function (inquirerResponse) {
                        let songSel = inquirerResponse.songSel
                        songFun(songSel);
                    })
                break;
            case 'Concert Information':
                inquirer
                    .prompt([{
                        type: 'input',
                        message: 'What concert are you interested in?',
                        name: 'concertSel',
                    }]).then(function (inquirerResponse) {
                        let concertSel = inquirerResponse.concertSel
                        concertFun(concertSel);
                    });

        }
    })


//function for searching omdb
function movieFun(movieSel) {
    axios.get('http://www.omdbapi.com/?t=' + movieSel + '&apikey=' + omdbKey).then(
        function (response) {
            let omdbResponse = response.data;
            let movieData = [
                'title: ' + omdbResponse.Title,
                'year: ' + omdbResponse.Year,
                'imdb rating: ' + omdbResponse.imdbRating,
                //'rotten tomatoes rating: '+omdbResponse.
                'country: ' + omdbResponse.Country,
                'language: ' + omdbResponse.Language,
                'plot: ' + omdbResponse.Plot,
                'actors: ' + omdbResponse.Actors,
            ];
            console.log(movieData);
            fs.appendFileSync('log.txt', movieData + '\n', function (err) {
                if (err) throw err;
                console.log('Error adding to log.txt file' + err);
            });
        }).catch(function (error) {
        console.log("Error", error.message);
    })
}

function songFun(songSel) {
    axios.get('http://www.omdbapi.com/?t=' + movieSel + '&apikey=' + omdbKey).then(
        function (response) {
            let omdbResponse = response.data;
            let songData = [
                'title: ' + omdbResponse.Title,
                'year: ' + omdbResponse.Year,
                'imdb rating: ' + omdbResponse.imdbRating,
                //'rotten tomatoes rating: '+omdbResponse.
                'country: ' + omdbResponse.Country,
                'language: ' + omdbResponse.Language,
                'plot: ' + omdbResponse.Plot,
                'actors: ' + omdbResponse.Actors,
            ];
            console.log(songData);
            fs.appendFileSync('log.txt', songData + '\n', function (err) {
                if (err) throw err;
                console.log('Error adding to log.txt file' + err);
            });
        }).catch(function (error) {
        console.log("Error", error.message);
    })

}

function concertFun(concertSel) {
    axios.get("https://rest.bandsintown.com/artists/" + concertSel + "/events?app_id=" + bandsKey).then(
        function (response) {
            let bandsResponse = response.data;
            for (var i = 0; i < bandsResponse.length; i++) {
                let concertData = [
                    'name of venue: ' + bandsResponse[i].venue.name,
                    'venue location: ' + bandsResponse[i].venue.city,
                    'date: ' + bandsResponse[i].datetime
                ];
                console.log(concertData);
                fs.appendFileSync('log.txt', concertData + '\n', function (err) {
                    if (err) throw err;
                    console.log('Error adding to log.txt file' + err);
                });
            }
        }).catch(function (error) {
        console.log("Error", error.message);
    })

}