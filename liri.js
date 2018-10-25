require("dotenv").config();
var keys = require("./keys.js");

var fs = require("fs");
var request = require("request");
var Twitter = require("twitter");
var Spotify = require ("node-spotify-api");
var liriArgument = process.argv[2];

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

switch(liriArgument) {
    case "my-tweets": myTweets();
    break;
    case "spotify-this-song": spotifyThisSong();
    break;
    case "movie-this": movieThis();
    break;
    case "do-what-it-says": doWhatItSays();
    break;
    default: console.log(
        "\r\n" + "Please type on of the following commands after 'node liri.js' : " + "\r\n" +
        "1) my-tweets 'any twitter name' " + "\r\n" +
        "2) spotify-this-song 'any song name' " + "\r\n" +
        "3) movie-this 'any movie name' " + "\r\n" +
        "4) do-what-it-says 'any any' " + "\r\n" +
        "Kindly put the movie or song name in quotation marks if it's more than one word."
    );
};

function movieThis() {
    var movie = process.argv[3];
    if (!movie) {
        movie = "Mr. Nobody"
    }
    parameter = movie
    request("http://www.omdbapi.com/?apikey=7d62cc20&t=" + parameter + "&y=&plot=short&r=json&tomatoes=true", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var movieObject = JSON.parse(body);
            // console.log(movieObject);
            var movieResults = 
            "------------------------------ commencer ici ------------------------------" + "\r\n" + 
            "Title: " + movieObject.Title + "\r\n" + 
            "Year: " + movieObject.Year + "\r\n" + 
            "Imdb Rating: " + movieObject.imdbRating + "\r\n" +
            "Country: " + movieObject.Country + "\r\n" +
            "Language: " + movieObject.Language + "\r\n" +
            "Plot: " + movieObject.Plot + "\r\n" +
            "Actors: " + movieObject.Actors + "\r\n" +
            "Rotten Tomatoes Rating: " + movieObject.Ratings[1].Value + "\r\n" +
            "Rotten Tomatoes URL: " + movieObject.tomatoURL + "\r\n" + 
            "------------------------------ se termine ici -----------------------------" + "\r\n";
            console.log(movieResults);
            log(movieResults);
        } else {
            console.log("Error :" + error);
            return;
        }
    });
};

function myTweets() {
    var twitterUsername = process.argv[3];
    if (!twitterUsername) {
        twitterUsername = "JecoLantern";
    }
    parameter = {screen_name: twitterUsername};
    client.get("statuses/user_timeline/", parameter, function(error, data, response) {
        if (!error) {
            data.forEach(t => {
                console.log(
                    `\t'${t.created_at}'
                    '${t.user.name}':
                    ${t.text}`
                );
            });

        } else {
            console.log("Error: " + error);
            return;
        }
    });
}

function spotifyThisSong(songName) {
    var songName = process.argv[3];
    if (!songName) {
        songName = "Whenever Wherever"
    }
    params = songName;
    spotify.search({type: "track", query: params}, function(error, data) {
        if (!error) {
            var songInfo = data.tracks.items;
            for (var i=0; i< 5; i++) {
                if (songInfo[i] != undefined) {
                    var spotifyResults = 
                    "Artist: " + songInfo[i].artists[0].name + "\r\n" +
                    "Song: " + songInfo[i].name + "\r\n" +
                    "Album the song is from: " + songInfo[i].album.name + "\r\n" +
                    "Preview URL: " + songInfo[i].preview_url + "\r\n" +
                    "--------------------------------" + i + "--------------------------------" + "\r\n";
                    console.log(spotifyResults);
                    log(spotifyResults);
                }
            }
        } else {
            console.log("Error: " + error);
            return;
        }
    });
};

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (!error) {
            doWhatItSaysResults = data.split(",");
            spotifyThisSong(doWhatItSaysResults[0], doWhatItSaysResults[1]);
        } else {
            console.log("Error occured: " + error);
        }
    });
};

function log(logResults) {
    fs.appendFile("log.txt", logResults, function (error) {
        if (error) {
            throw error;
        }
    });
}