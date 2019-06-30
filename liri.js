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
const qs = require('qs');
var http = require("http");

//apikeys
const omdbKey = process.env.OMDB_apikey;
const bandsKey = process.env.BANDSinTOWN_app_id;
const spotifyId = process.env.SPOTIFY_ID;
const spotifySecret = process.env.SPOTIFY_SECRET;
let accessToken;

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
    const authHeaders = {
        'Authorization': 'Basic ZmExMjZkYzNhNGIzNDZkNmFkMTJlNTYzNzY5YmJmMGU6ODI4NmNkZWQzODJhNDdiNGExMzIwMzBlMzIyMzFhMGI=',
        'Content-Type': 'application/x-www-form-urlencoded',
    };
    const authBody = {
        'grant_type': 'client_credentials',
    }
    axios.post('https://accounts.spotify.com/api/token', qs.stringify(authBody), {
        headers: authHeaders
        }).then(function (response) {
        // console.log(response.data);
        // console.log(response.data.access_token);
        accessToken = response.data.access_token;
        const getHeaders = {
            'Authorization': 'Bearer ' + accessToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
        console.log(accessToken);
            axios.get('https://api.spotify.com/v1/search?q=' + songSel + '&type=track', {
                headers: getHeaders
                }).then(function (response) {
                    console.log(response);
                    // let omdbResponse = response.data;
                    // let songData = [
                    //     'title: ' + omdbResponse.Title,
                    //     'year: ' + omdbResponse.Year,
                    //     'imdb rating: ' + omdbResponse.imdbRating,
                    //     'country: ' + omdbResponse.Country,
                    //     'language: ' + omdbResponse.Language,
                    //     'plot: ' + omdbResponse.Plot,
                    //     'actors: ' + omdbResponse.Actors,
                    // ];
                    // console.log(songData);
                    // fs.appendFileSync('log.txt', songData + '\n', function (err) {
                    //     if (err) throw err;
                    //     console.log('Error adding to log.txt file' + err);
                }).catch(function (error) {
                console.log("Error requesting song", error.message);
            });

    }).catch(function (error) {
        console.log("Error getting token", error.message);
    });

    // axios.get('https://api.spotify.com/v1/search?q=' + songSel + '&type=track" -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer ' + accessToken).then(
    //     function (response) {
    //         console.log(response);
    //         // let omdbResponse = response.data;
    //         // let songData = [
    //         //     'title: ' + omdbResponse.Title,
    //         //     'year: ' + omdbResponse.Year,
    //         //     'imdb rating: ' + omdbResponse.imdbRating,
    //         //     'country: ' + omdbResponse.Country,
    //         //     'language: ' + omdbResponse.Language,
    //         //     'plot: ' + omdbResponse.Plot,
    //         //     'actors: ' + omdbResponse.Actors,
    //         // ];
    //         // console.log(songData);
    //         // fs.appendFileSync('log.txt', songData + '\n', function (err) {
    //         //     if (err) throw err;
    //         //     console.log('Error adding to log.txt file' + err);
    //     }).catch(function (error) {
    //     console.log("Error", error.message);
    // });
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