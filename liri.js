/* to do list
Put in required packages
set up initial q&a for user
take input from user and call appropriate api
display information from api to the screen
*/

//packages
require('dotenv').config();
//const APIs = require('./keys');
const inquirer = require('inquirer');
const axios = require("axios");



//apikeys
const omdbKey = process.env.OMDB_apikey;
console.log(omdbKey);

const divider = "\n------------------------------------------------------------\n\n";
var fs = require("fs");

//ask the user what they would like to research
inquirer
    .prompt([
        {
        type: 'list',
        message: 'What can I help you with today?',
        choices: ['Song Request','Movie Information','Concert Information'],
        name: 'reqSel',
        }    
    ]).then(function(inquirerResponse){
        console.log(inquirerResponse.reqSel);
        switch(inquirerResponse.reqSel) {
            case 'Movie Information':
                inquirer
                    .prompt([
                        {
                        type: 'input',
                        message: 'What movie are you interested in?',
                        name: 'movieSel',
                        }
                    ]).then(function(inquirerResponse){
                        let movieSel=inquirerResponse.movieSel
                        movieFun(movieSel);
                    })
        }
    })


//function for searching omdb
function movieFun(movieSel) {
    axios.get('http://www.omdbapi.com/?t='+movieSel+'&apikey='+omdbKey).then(
        function(response) {
            let omdbResponse=response.data;
            let movieData = [
                'title: '+ omdbResponse.Title,
                'year: '+ omdbResponse.Year,
                'imdb rating: '+omdbResponse.imdbRating,
                //'rotten tomatoes rating: '+omdbResponse.
                'country: '+omdbResponse.Country,
                'language: '+omdbResponse.Language,
                'plot: '+omdbResponse.Plot,
                'actors: '+omdbResponse.Actors,
            ];
            console.log(movieData);
            fs.appendFile('log.txt',movieSel+movieData+divider,function(err){
                if (err) throw err;
                console.log('Error adding to log.txt file');
              });
    }).catch(function(error){
        console.log("Error", error.message);
    })
}