//different page values

//home screen to host game
var homescreen = "<div class=\"jumbotron\" id=\"theJumbotron\">" +
			"<h1>Mad Libs</h1>" + 
			"<p class=\"lead\"> Come play a fun game of fill in the blank! </p>"+
			"<button onclick=\"hostGame()\" id=\"hostButton\" class=\"btn btn-lg btn-success\" role=\"button\">Host a Game</button>" +
		    "</div>";

//set up screen to start game
var setupscreen = "<div class=\"jumbotron\" id=\"theJumbotron\">" +
			"<h1>Mad Libs</h1>" + 
			"<p class=\"lead\"> Come play a fun game of fill in the blank! </p>"+
			"</br> Wait for some friends and then click start!</br>" +
			"<button onclick=\"startTheGame()\" id=\"startButton\" class=\"btn btn-lg btn-success\" role=\"button\">Start the Game</button>" +
		    "</div>";

//set up waiting screen
var waitingscreen = "<div class=\"jumbotron\" id=\"theJumbotron\">" +
			"<h1>Mad Libs</h1>" + 
			"<p class=\"lead\"> Waiting for the host to start the game...</p>"+
			"</br> Just wait it'll be fun!" +
		    "</div>";

//screen after host disconnects
var resethomescreen = "<div class=\"jumbotron\" id=\"theJumbotron\">" +
			"<h1>Mad Libs</h1>" + 
			"<p class=\"lead\">" + 
			"Host disconnected! Oh noo. It's ok. Let's just pretend that didn't happen and try again.</br></br>" +
			"Come play a fun game of fill in the blank! </p>"+
			"<button onclick=\"hostGame()\" id=\"hostButton\" class=\"btn btn-lg btn-success\" role=\"button\">Host a Game</button>" +
		    "</div>";

//set up waiting screen after story submission
var storysubmitwaitingscreen = "<div class=\"jumbotron\" id=\"theJumbotron\">" +
			"<h1>Mad Libs</h1>" + 
			"<p class=\"lead\"> Waiting for everyone to finish their story</p>"+
			"</br> Don't worry it won't be as funny" +
		    "</div>";		   

//set up waiting screen after story submission
var showstoryheader = "<div class=\"jumbotron\" id=\"theJumbotron\">" +
			"<h1>Mad Libs</h1>" + 
			"<p class=\"lead\"> Here it is!</p>"+
			"</br> Laugh it up!" +
		    "</div>";		     		    