require('dotenv').config();
const fs = require('fs');
const axios = require('axios');
const moment = require('moment');
const Spotify = require('node-spotify-api');

const keys = require('./keys');

const spotify = new Spotify(keys.spotify);

const action = process.argv[2];
const data = process.argv.slice(3) ;

function callSpotifyApi(song) {
    // TODO: Make sure to load correct song.
    if (!song) song = 'The Sign by Ace of Base';
    spotify
        .search({ type: 'track', query: song })
        .then(response => {
            // console.log('response: ', JSON.stringify(response));
            spotify
                .request(response.tracks.items[0].href)
                .then(data => {
                    // console.log('data: ', JSON.stringify(data));
                    console.log('Album name: ', data.album.name);
                    console.log('Artist name: ', data.artists[0].name);
                    console.log('Song name: ', data.name);
                    console.log('Preview url: ', data.preview_url);
                })
                .catch(err => {
                    console.error('Error occurred: ' + err);
                });
        });
}

function callOmbdApi(movieTitle) {
    if (movieTitle) {
        axios.get(`http://www.omdbapi.com/?apikey=${keys.OMDB.secret}&t=${movieTitle}`)
            .then(response => {
                // console.log('response: ', JSON.stringify(response.data));
                console.log('Movie Title: ', response.data.Title);
                console.log('Year: ', response.data.Year);
                console.log('IMDB rating: ', response.data.imdbRating);
                console.log('Rotten Tomatoes Rating: ', response.data.Ratings[1].Value); // TODO: Search array
                console.log('Country: ', response.data.Country);
                console.log('Language: ', response.data.Language);
                console.log('Movie plot: ', response.data.Plot);
                console.log('Actors: ', response.data.Actors);
            })
            .catch(err => {
                console.log('Error occurred: ', err);
            });
    } else {
        axios.get(`http://www.omdbapi.com/?apikey=${keys.OMDB.secret}&t=Mr. Nobody`)
            .then(response => {
                console.log('Mr. Nobody', response.data);
            });
    }
}

function callBandsInTownApi(bandName) {
    axios.get(`https://rest.bandsintown.com/artists/${bandName}/events?app_id=codingbootcamp`)
        .then(response => {
            // console.log('response: ', JSON.stringify(response.data));
            response.data.forEach(concert => {
                console.log('Venue Name: ', concert.venue.name);
                console.log('Venue Location: ', `${concert.venue.city}, ${concert.venue.country}`);
                console.log('Event Date: ', moment(concert.datetime).format('MM/DD/YYYY'));
            });
        })
        .catch(err => {
            console.log('Error occurred: ' + err);
        });
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }
        console.log(data);

            var command = data.split(',');
            console.log(command);
            parseInputs(command[0], command[1])
            //not sure what to do with the const action now to finish running the line from random.txt
    });

}

function parseInputs(action, data) {
    if (action === 'spotify-this-song') {
        callSpotifyApi(data);
    } else if (action === 'movie-this') {
        callOmbdApi(data);
    } else if (action === 'concert-this') {
        callBandsInTownApi(data);
    } else if (action === 'do-what-it-says') {
        doWhatItSays();
    } else {
        console.error('Invalid Command');
    }
}
parseInputs(action,data);























// require("dotenv").config();
// const Spotify = require("node-spotify-api");
// const keys = require("./keys");
// const axios = require("axios");
// const moment = require("moment");
// const fs = require("fs");

// grab command line arguments
// const command = process.argv[2]
// let search = process.argv.slice(3).join(' ')

// check for first argument to match accepted commands
// switch (command) {
//   case 'concert-this':
//     concert(search)
//     break;
//   case 'spotify-this-song':
//     song(search)
//     break;
//   case 'movie-this':
//     movie(search)
//     break;
//   case 'do-what-it-says':
//     whatItSays(search)
//     break;
//   default:
//     noCommand()
// }

// const rawInput = process.argv;

// // Function to parse user input
// function parse() {
//     var parsedInputArray = [];
//     for (var i = 3; i < rawInput.length; i++) {
//       parsedInputArray.push(rawInput[i]);
//     }
//     return parsedInputArray.join(' ');
//   }

// concert this search bands in town api 
// var concert = function(artist) {
//     var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
  
//     axios.get(queryURL).then(
//       function(response) {
//         var bandData = response.data;
//         if (!bandData.length) {
//           console.log("No results found for " + artist);
//           return;
//         }
  
//         console.log("Upcoming concerts for " + artist + ":");
  
//         for (var i = 0; i < bandData.length; i++) {
//           var show = bandData[i];
//           console.log(
//             show.venue.city +
//               "," +
//               (show.venue.region) +
//               " at " +
//               show.venue.name +
//               " " +
//               moment(show.datetime).format("MM/DD/YYYY")
//           );
//         }
//       }
//     );
//   };
  

// spotify this searches spotify api 


// function spotifySong(parsedInput) {
//     var spotify = new Spotify(keys.spotifyKeys);
  
//     if (!parsedInput.length) { 
//       parsedInput = "The sign";
//     }
  
//     spotify.search({ type: 'track', query: parsedInput, market: "from_token", limit: "1" }, function(error, data) {
//       var dataShort = data.tracks.items[0]; 
  
//       if (error) {
//         console.log('Error occurred:\n' + error);
//       }
//       else if (data.tracks.total === 0) {
//         console.log('No Song Found!\n');
//       }
//       else {
//         console.log('Top Result for: ' + parsedInput + '\n');
//         console.log(
//           'Artist: ' + dataShort.artists[0].name +
//           '\nSong Name: ' + dataShort.name +
//           '\nPreview: ' + dataShort.preview_url +
//           '\nAlbum: ' + dataShort.album.name + '\n'
//         );
//       }
//     });
//   }



// movie this searches ombd api



// function movie(parsedInput) {
//     if (!parsedInput) {
//       parsedInput = "Mr. Nobody";
//     }
  
//     var url = 'https://www.omdbapi.com/?apikey=trilogy&type=movie&t=' + encodeURI(parsedInput);
  
//     request(url, function(error, response, body) {
//       var bodyParsed = JSON.parse(body); // The request npm callback argument 'body' is a string.  Needs JSON.parse().
//       var rottenTomatoes = "There is no Rotten Tomatoes rating for this movie"; // Default message if rating does not exist.
  
//       if (error) {
//         console.log('Error Occurred:\n' + error);
//       }
//       else if (bodyParsed.Response === 'False') {
//         console.log(bodyParsed.Error + '\n');
//       }
//       else {
  
//         for (var i = 0; i < bodyParsed.Ratings.length; i++) { //Checks if a Rotten Tomatoes rating exists and replaces default message with rating.
//           if (bodyParsed.Ratings[i].Source === 'Rotten Tomatoes') {
//             rottenTomatoes = bodyParsed.Ratings[i].Value;
//           }
//         }
  
//         console.log(
//           'Movie Title: ' + bodyParsed.Title +
//           '\nRelease Year: ' + bodyParsed.Year +
//           '\nIMDB Rating: ' + bodyParsed.imdbRating +
//           '\nRotten Tomatoes Rating: ' + rottenTomatoes + //See above for handling of rottenTomatoes
//           '\nCountries: ' + bodyParsed.Country +
//           '\nMovie Language: ' + bodyParsed.Language +
//           '\nActors: ' + bodyParsed.Actors +
//           '\nShort Plot: ' + bodyParsed.Plot + '\n'
//         );
//       }
//     });
//   }


// do what it says uses the text inside of Random text to run spotify this song I want it that way 
// function whatItSays() {
//     var textArray;
  
//     fs.readFile("./random.txt", "utf8", function(error, data) {
  
//       if (error) {
//         console.log("Error Occurred:\n" + error);
//       }
//       else {
//         textArray = data.split(","); 
        
//         if (textArray.length > 1) { 
//           textArray[1] = textArray[1].trim().substring(1, textArray[1].trim().length - 1); 
//         }
        
//         switch (textArray[0]) {
//             case 'concert-this':
//             concert();
//             break;
//           case 'spotify-this-song':
//             spotifySong(parse());
//             break;
//           case 'movie-this':
//             movie(parse());
//             break;
//         }
//       }
//     });
//   }



// Determins wich command user has requested 

// var request = rawInput[2];
//if process.argv.length > 3
//var search = parse()
//if process.argv.length = 3 then search = ""
// switch (request) {
//     case 'concert-this':
//       concert();
//       break;
//     case 'spotify-this-song':
//       spotifySong(parse());
//       break;
//     case 'movie-this':
//       movie(parse());
//       break;
//     case 'do-what-it-says':
//       whatItSays();
//       break;
//     default:
    // console.error('Command can not be run.');
    
  // }
