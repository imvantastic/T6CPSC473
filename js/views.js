//different page values
//home screen to host game
var homescreen = "<div class=\"jumbotron\" id=\"theJumbotron\">" +
    "<h1>Mad Libs</h1>" +
    "<p class=\"lead\"> Come play a fun game of fill in the blank! </p>" +
    "<button onclick=\"hostGame()\" id=\"hostButton\" class=\"btn btn-lg btn-success\" role=\"button\">Host a Game</button>" +
    "</div>";

//set up screen to start game
var setupscreen = "<div class=\"jumbotron\" id=\"theJumbotron\">" +
    "<h1>Mad Libs</h1>" +
    "<p class=\"lead\"> Come play a fun game of fill in the blank! </p>" +
    "</br> Wait for some friends and then click start!</br>" +
    "<button onclick=\"startTheGame()\" id=\"startButton\" class=\"btn btn-lg btn-success\" role=\"button\">Start the Game</button>" +
    "</div>";

//set up waiting screen
var waitingscreen = "<div class=\"jumbotron\" id=\"theJumbotron\">" +
    "<h1>Mad Libs</h1>" +
    "<p class=\"lead\"> Waiting for the host to start the game...</p>" +
    "</br> Just wait it'll be fun!" +
    "</div>";

//screen to add story
var addstoryscreen = "<div class=\"jumbotron\" id=\"theJumbotron\">" +
    "<h1>Add Story</h1>" +
    "<p>Type a madlib into the textbox.</p>" +
    "Make sure to surround the word to be filled in with double brackets." +
    "</br></br>Example: [[Exclamation]], he said [[Adverb]] as he jumped into his car." +
    "</br></br><textarea type=\"text\" id=\"storyinput\" cols=\"50\" rows=\"5\"></textarea>" +
    "</br><button onclick=\"submitUserStory()\" id=\"startButton\" class=\"btn btn-lg btn-success\" role=\"button\">Submit Story</button>" +
    "</div>";

//screen after host disconnects
var resethomescreen = "<div class=\"jumbotron\" id=\"theJumbotron\">" +
    "<h1>Mad Libs</h1>" +
    "<p class=\"lead\">" +
    "Host disconnected! Oh noo. It's ok. Let's just pretend that didn't happen and try again.</br></br>" +
    "Come play a fun game of fill in the blank! </p>" +
    "<button onclick=\"hostGame()\" id=\"hostButton\" class=\"btn btn-lg btn-success\" role=\"button\">Host a Game</button>" +
    "</div>";

//set up waiting screen after story submission
var storysubmitwaitingscreen = "<div class=\"jumbotron\" id=\"theJumbotron\">" +
    "<h1>Mad Libs</h1>" +
    "<p class=\"lead\"> Waiting for everyone to finish their story</p>" +
    "</br> Don't worry it won't be as funny" +
    "</div>";

//set up waiting screen after story submission
var showstoryheader = "<div class=\"jumbotron\" id=\"theJumbotron\">" +
    "<h1>Mad Libs</h1>" +
    "<p class=\"lead\"> Here it is!</p>" +
    "Laugh it up!" +
    "</div>";

//about
var about = "<div class=\"jumbotron\" id=\"theJumbotron\">" +
    "<h1>Mad Libs</h1>" +
    "<p class=\"lead\"> About</p>" +
    "Mad Libs is a fun game that can be played by anyone. It takes your input and creates stories for everyone to read." +
    "</div>";

//how to play
var howtoplay = "<div class=\"jumbotron\" id=\"theJumbotron\">" +
    "<h1>Mad Libs</h1>" +
    "<p class=\"lead\">How to Play</p>" +
    "Wait for a host or host your own! Once the game starts, fill in the blanks" +
    " with the requested input and then hit submit. Once all of" +
    " the players have entered their words, your story and theirs will be sent back to you to read! You can play with as little or as many people as you want." +
    "</div>";

//about
var contact = "<div class=\"jumbotron\" id=\"theJumbotron\">" +
    "<h1>Mad Libs</h1>" +
    "<p class=\"lead\"> Contact Us</p>" +
    "Write down your thoughts, fold it into a paper airplane and toss it into the sky. Once we receive it, we'll be sure to read it!" +
    "</div>";
