require('dotenv').config();
const fs = require('fs');
const axios = require('axios');
const moment = require('moment');
const Spotify = require('node-spotify-api');

const keys = require('./keys');

const spotify = new Spotify(keys.spotify);

const action = process.argv[2];
const data = process.argv.slice(3) ;

function spotify(song) {
    // TODO: Make sure to load correct song.
    if (!song) song = 'The Sign';
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


function movie(movieName) {
    if (movieName === undefined) {
      movieName = "Mr Nobody";
    }
  
    var urlHit =
      "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";
  
    axios.get(urlHit).then(
      function(response) {
        var jsonData = response.data;
  
        console.log("Title: " + jsonData.Title);
        console.log("Year: " + jsonData.Year);
        console.log("Rated: " + jsonData.Rated);
        console.log("IMDB Rating: " + jsonData.imdbRating);
        console.log("Country: " + jsonData.Country);
        console.log("Language: " + jsonData.Language);
        console.log("Plot: " + jsonData.Plot);
        console.log("Actors: " + jsonData.Actors);
        console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
      }
    );
  };
  

  function concert(artist) {
        var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
      
        axios.get(queryURL).then(
          function(response) {
            var bandData = response.data;
            if (!bandData.length) {
              console.log("No results found for " + artist);
              return;
            }
      
            console.log("Upcoming concerts for " + artist + ":");
            response.data.forEach(concert => {
                console.log('====================================')
                console.log('Venue Name: ', concert.venue.name);
                console.log('Venue Location: ', `${concert.venue.city}, ${concert.venue.country}`);
                console.log('Event Date: ', moment(concert.datetime).format('MM/DD/YYYY'));
            }); 
          }
        );
      };
      
      function doWhatItSays() {
        // read .txt file and set the parameter to input to the spotify API
        fs.readFile('random.txt', 'utf8', function(error, data) {
          if ( error ) {
            return console.log(error)
          }
          let arg = data.split(',')[1]
          callSpotifyApi(arg)
        })
      }
      

function parseInputs(action, data) {
    if (action === 'spotify-this-song') {
        spotify(data);
    } else if (action === 'movie-this') {
        movie(data);
    } else if (action === 'concert-this') {
        concert(data);
    } else if (action === 'do-what-it-says') {
        doWhatItSays();
    } else {
        console.error('Invalid Command');
    }
}
parseInputs(action,data);























