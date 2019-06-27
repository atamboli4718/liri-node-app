/* to do list
Put in required packages
set up initial q&a for user
take input from user and call appropriate api
display information from api to the screen
*/

//packages
const APIs = require('./keys');
const inquirer = require('inquirer');
const axios = require("axios");


//apikeys
const omdbKey = keys.omdb.id


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
                console.log("movieStatement");
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
    axios.get('http://www.omdbapi.com/?t='+movieSel+'"&apikey='+omdbKey).then(
        function (response) {
            console.log(response);
    })
}