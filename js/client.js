var clientStoryArray = [];

var socket = io.connect('http://localhost:8000');


//reset game on disconnect
socket.on('reset game', function(data) {
    $("div#theJumbotron").empty();
    $("#input_section").empty();
    $("div#theJumbotron").append(resethomescreen);
})

//load lobby
//creates the html to create the lobby
socket.on('reload lobby', function(data) {
    $("div#theJumbotron").empty();
    $("#input_section").empty();
    $("div#theJumbotron").append(homescreen);
})

//host game
//when host game button is clicked
function hostGame() {
    socket.emit('hostGame');
}

//setupgame
socket.on('setupgame', function() {
    $("div#theJumbotron").empty();
    $("#input_section").empty();
    $("div#theJumbotron").append(setupscreen);

})

//tell other players to wait
socket.on('waitingforhost', function() {
    $("div#theJumbotron").empty();
    $("#input_section").empty();
    $("div#theJumbotron").append(waitingscreen);

})

//IS 2016-05-09
socket.on('checkOtherPlayerInput', function() {
    socket.emit('waitforothers');
})

//send socket message to start game
function startTheGame() {
    console.log("in start game fn");
    socket.emit('startgame');
}

//show the form host
socket.on('showform1', function() {

        $("div#wordgenerator").empty();
        $("div#wordgenerator").append(wordgen);

        $("div#theJumbotron").hide();
        $("#input_section").empty();

        // defining random number to pull story from DB
        if (typeof fixedInt != 'defined') {
            var i = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
            console.log(i);
            var fixedInt = i;
            console.log('fixedInt is UNDEFINED');
        }

        $.ajax({
            url: "http://localhost:8000/getStory",
            type: "GET",
            data: {
                randomNum: fixedInt
            },
            dataType: "json",
            success: function(result) {
                    var splitText = result.story.split(/\[([^\]]+)]/),

                        str,
                        usageCount;

                    storyID = result.id;
                    console.log("storyID is", storyID);
                    console.log("result of splitText:", splitText);

                    $("#input_section").append("<h2>Please fill in the blanks below!");

                    splitText.forEach(function(entry) {
                        if (entry[0] === "[") {
                            console.log("entry is", entry);
                            usageCount = 1;
                            str = entry.substring(1, entry.length);
                            console.log("str is:", str);
                            strArray.forEach(function(entry) {
                                if (entry === str) {
                                    usageCount = usageCount + 1;
                                }
                            });

                            strArray.push(str);
                            inputArray.push("" + str.charAt(0) + count + usageCount);

                            //change the id to first char

                            //replacing space(s) with underscore
                            var str2 = str.split(' ').join('_');
                            str2 = str2.split('(').join(''); //omit '('
                            str2 = str2.split(')').join(''); // omit ')'
                            str2 = str2.split('\'').join(''); // omit single quote

                            $("#input_section").append("<div id='" + str.charAt(0) + count + usageCount + "'>" +
                                "<label>" + str + "</label>" +
                                ": <input type=text name=" + str2 + " class=form-control required></div><br>");
                            count++;
                        }

                    }); //end splitText.forEach
                    console.log("strArray is", strArray);
                    $("#input_section").append("<div id='btnContainer'><button type=submit id='submitButton' class='btn btn-default'>Submit</button>");
                    $("#input_section").append("</div>");

                    //onclick() function for submitButton
                    var submitButton = document.getElementById("submitButton");
                    submitButton.addEventListener('click', function() {
                        // ========check if no empty input, then build story
                        if (!checkInput(inputArray)) {
                            return;
                        }
                        //build story
                        var story;
                        buildStoryFunction(storyID, function(newstory) {
                            story = newstory
                            clientStoryArray.push(story);
                            console.log(story);

                            //add to story array

                            console.log("clientstoryarrayhost: " + clientStoryArray.length);
                            //clear screen and have them wai
                            $("div#theJumbotron").show().empty();
                            $("#input_section").empty();
                            $("div#theJumbotron").append(storysubmitwaitingscreen);

                            //send the story and wait
                            socket.emit('waitforothers', {
                                story: story
                            });
                        });
                    });



                } //end success: function
        }); //end ajax put

    }) //end of show host form socket


//show the form to player 2
socket.on('showform2', function() {
        $("div#wordgenerator").empty();
        $("div#wordgenerator").append(wordgen);

        $("div#theJumbotron").hide();
        $("#input_section").empty();
        var num = 7;
        $.ajax({
            url: "http://localhost:8000/getStory",
            type: "GET",
            data: {
                randomNum: num
            },
            dataType: "json",
            success: function(result) {
                    var splitText = result.story.split(/\[([^\]]+)]/),

                        str,
                        usageCount;

                    storyID = result.id;
                    console.log("storyID is", storyID);
                    console.log("result of splitText:", splitText);

                    $("#input_section").append("<h2>Please fill in the blanks below!");

                    splitText.forEach(function(entry) {
                        if (entry[0] === "[") {
                            console.log("entry is", entry);
                            usageCount = 1;
                            str = entry.substring(1, entry.length);
                            console.log("str is:", str);
                            strArray.forEach(function(entry) {
                                if (entry === str) {
                                    usageCount = usageCount + 1;
                                }
                            });

                            strArray.push(str);
                            inputArray.push("" + str.charAt(0) + count + usageCount);

                            //change the id to first char

                            //replacing space(s) with underscore
                            var str2 = str.split(' ').join('_');
                            str2 = str2.split('(').join(''); //omit '('
                            str2 = str2.split(')').join(''); // omit ')'
                            str2 = str2.split('\'').join(''); // omit single quote

                            $("#input_section").append("<div id='" + str.charAt(0) + count + usageCount + "'>" +
                                "<label>" + str + "</label>" +
                                ": <input type=text name=" + str2 + " class=form-control required></div><br>");
                            count++;
                        }

                    }); //end splitText.forEach
                    console.log("strArray is", strArray);
                    $("#input_section").append("<div id='btnContainer'><button type=submit id='submitButton' class='btn btn-default'>Submit</button>");
                    $("#input_section").append("</div>");

                    console.log("in show form 2");
                    //onclick() function for submitButton
                    var submitButton = document.getElementById("submitButton");
                    submitButton.addEventListener('click', function() {
                        // ========check if no empty input, then build story
                        if (!checkInput(inputArray)) {
                            return;
                        }
                        //buildStoryFunction(storyID);
                        //build story
                        var story2;
                        buildStoryFunction(storyID, function(newstory) {
                            story2 = newstory;
                            clientStoryArray.push(story2);
                            //add to story array

                            console.log("clientstoryarray2: " + clientStoryArray.length);
                            //clear screen and have them wai
                            $("div#theJumbotron").empty().show();
                            $("#input_section").empty();
                            $("div#theJumbotron").append(storysubmitwaitingscreen);

                            //send the story and wait
                            socket.emit('waitforothers', {
                                story: story2
                            });
                        });

                    });

                } //end success: function
        }); //end ajax put

    }) //end of show player 2 form socket

var countInterval = 0;

//show story
socket.on('showstory', function(data) {
        console.log("in client side of show story. length: " + clientStoryArray.length);
        console.log("DEBUG - stories array = " + data);
        //console.log(data.stories.length);
        //console.log("showstorydataL: " + data.storyArray[0]);
        // var storyHolder = JSON.parse(data);
        //console.log("storyholder: " + storyHolder);
        /*var storyArray = [];*/

        // IS 2016-05-09 : commented out

        var i;
        var storyString = " ";
        var j = 0;
        for (i = 0; i < data.length; i++) {
            j++;
            storyString = storyString + "<div class=\"story\"><h4>Story " + j + "</h4>" + data[i] + "</div></br>";
            console.log("clientstoryArrayloop: " + storyString);
        }

        $("div#wordgenerator").empty();
        $("div#theJumbotron").show().empty();
        $("#input_section").empty();
        //$("div#theJumbotron").append(showstoryheader);
        $("div#theJumbotron").append("<div class=\"jumbotron\" id=\"theJumbotron\">" +
            "<h1>Mad Libs</h1>" +
            "<p class=\"lead\"> Everyone is done! Read their stories and see what your friends came up with.</p>" +
            "</div>" + storyString);
        //"Stories: </br>" +
        //"<div>" + data[0] + "</div> <br/>" +
        //"<div>" + data[1] + "</div>");

        countInterval++;

        //terminate set interval if both stories are printed
        if (countInterval == 2) {
            socket.emit('terminateSetInterval');
        }

    })
    //end of show story


//Submit user created story
function submitUserStory() {

    if ($("#storyinput").val() != "") {
        if ($("#storyinput").val().indexOf("[[") != -1 && $("#storyinput").val().indexOf("]]") != -1) {
            console.log("Story being submitted: " + $("#storyinput").val());
            $.post("http://localhost:8000/submitStory", {
                userStory: $("#storyinput").val()
            }, function(data, status) {
                console.log("Data:" + data + "\n Status: " + status);
                alert("Story submitted");
            })
        } else {
            alert("Madlib must contain at least one fill in the blank.");
        }
    } else {
        alert("You have not entered a story yet.");
    }
}


//vn: can comment this out
var storyID;
var inputArray = [];
var count = 0;
var strArray = [];
//Builds form based off of chosen story when
//the Play button is pressed.
$("#playButton").click(function() {

    // find an available game to join
    $.get("http://localhost:8000/joinGame", function(data, status) {
        console.log("Data:" + data + "\n Status: " + status);
        alert("Data:" + data + "\n Status: " + status);
        if (data !== null) { // if exist, join the game
            //join the game...
            $('#joinAGameModal').modal('show');
        } else { // if not, create a new game
            $.post("http://localhost:8000/createNewGame", function(data, status) {
                console.log("Data:" + data + "\n Status: " + status);
                alert("Data:" + data + "\n Status: " + status);
            });
            $('#waitingModal').modal('show');
        } // end if - else
    });
}); //end click play

// =========  Form Validation ===========================
function checkInput(inputArray) {
    console.log("inputArray is", inputArray[0]);
    var totalInput = inputArray.length;
    console.log("totalInput is:", totalInput);
    var inputValue = [];
    for (var i = 0; i < totalInput; i++) {
        inputValue[i] = $('#' + inputArray[i] + ' .form-control').val();
        console.log("inputValue is", inputValue);
        if (inputValue[i] === "") {
            alert("SOORY, Please fill out the form");
            return false;
        }
        //console.log("i="+i+", "+ inputValue[i]);
    }
    return true;
}

// ====================================  submit input ============================================
//can comment out
function submitFunction() {
    console.log("submit function");

    //get input value
    var totalInput = inputArray.length;
    var inputValue = [];
    //var totalInputValue = [];
    for (var i = 0; i < totalInput; i++) {
        inputValue[i] = $('#' + inputArray[i] + ' .form-control').val();
        // console.log("i="+i+", "+inputArray[i]);
        // console.log("i="+i+", "+inputValue[i]);
    }
    console.log("inputValue are:", inputValue);

    //post input value
    var storyUrl = "http://localhost:8000/inputs";

    var newInput = {
        "id": storyID,
        "inputs": inputValue
    };

    $.ajax({
        type: 'POST',
        url: storyUrl,
        data: newInput,
        success: function(result) {
            console.log("post, result= ", result);
        },
        dataType: 'json',
        async: false
    }); // end post
} // end submitFunction

// ====================================  Build Story ============================================
function buildStoryFunction($storyID, callback) {
    //console.log(storyID);
    //alert('debug');
    //alert($storyID);
    var index = 0;
    var completeStory;

    $.ajax({
        url: "http://localhost:8000/getStoryById",
        data: {
            storyID: $storyID
        },
        dataType: "json",
        type: "GET",
        success: function(result) {
            console.log(result);
            var splitText = result.story.split(/\[([^\]]+)]/);

            storyID = result.id;
            console.log("storyID is", storyID);
            console.log("result of splitText:", splitText);

            splitText.forEach(function(entry) {
                if (entry[0] === "[") {
                    str = entry.substring(1, entry.length);

                    //replacing space(s) with underscore
                    var str2 = str.split(' ').join('_');
                    str2 = str2.split('(').join(''); //omit '(''
                    str2 = str2.split(')').join(''); //omit ')'
                    str2 = str2.split('\'').join(''); //omit single quote

                    var input1 = "<strong>" + $('input[name=' + str2 + ']').val() + "</strong>";
                    splitText[index] = input1;
                }
                index++;
            }); //end splitText.forEach
            //console.log(splitText);
            completeStory = splitText.join("");
            completeStory = completeStory.replace(/(\])/g, " ");
            //alert(completeStory);
            callback(completeStory);

        }
    });


}

//NAVIGATION BAR-------------------------

//onclick() function for how to play
$("#howtoplay").on('click', function() {
    $("div#theJumbotron").empty();
    $("#input_section").empty();
    $("div#theJumbotron").append(howtoplay);
});

//onclick() function for about
$("#about").on('click', function() {
    $("div#theJumbotron").empty();
    $("#input_section").empty();
    $("div#theJumbotron").append(about);
});

//onclick() function for contact
$("#contact").on('click', function() {
    $("div#theJumbotron").empty();
    $("#input_section").empty();
    $("div#theJumbotron").append(contact);
});

//onclick() function for contact
$("#addstory").on('click', function() {
    $("div#theJumbotron").empty();
    $("div#wordgenerator").empty();
    $("#input_section").empty();
    $("div#theJumbotron").append(addstoryscreen);
});

//Generate a Random Word---------------------------
socket.on('generateWord', function() {

})

function generateWord() {
    socket.emit('generateWord');
}

socket.on('wordGenerated', function(data) {
    $("div#wordHolder").empty();
    $("div#wordHolder").append(data.word);
})