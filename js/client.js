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
function hostGame(){
  socket.emit('hostGame');
}

//setupgame
socket.on('setupgame', function(){
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

//send socket message to start game
function startTheGame(){
  console.log("in start game fn");
  socket.emit('startgame');
}

//show the form host
socket.on('showform1', function(){
   $("div#theJumbotron").empty();
   $("#input_section").empty();
    $.ajax({
        url: "http://localhost:8000/getStory",
        type: "GET",
        dataType: "json",
        success: function(result){
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
                    inputArray.push(""  +str.charAt(0)+ count + usageCount);
                   
                   //change the id to first char 
                    
                   //replacing space(s) with underscore
                   var str2 = str.split(' ').join('_');
                   str2 = str2.split('(').join(''); //omit '('
                   str2 = str2.split(')').join(''); // omit ')'
                   str2 = str2.split('\'').join(''); // omit single quote

                    $("#input_section").append("<div id='"  + str.charAt(0) + count + usageCount + "'>" + 
                                                 "<label>" + str + "</label>" + 
                                                 ": <input type=text name="+ str2 +" class=form-control required></div><br>");
                    count++;
                }

            });//end splitText.forEach
            console.log("strArray is", strArray);
            $("#input_section").append("<button type=submit id='submitButton' class='btn btn-default'>Submit</button>");
            
            //onclick() function for submitButton
            var submitButton = document.getElementById("submitButton");
            submitButton.addEventListener('click', function(){
              //build story
              var story = buildStoryFunction(storyID);
              //add to story array
              clientStoryArray.push(story);
              console.log("clientstoryarray1: " + clientStoryArray.length);
              //clear screen and have them wai
              $("div#theJumbotron").empty();
              $("#input_section").empty();
              $("div#theJumbotron").append(storysubmitwaitingscreen);

              //send the story and wait
              socket.emit('waitforothers', {story: story});
            });

        }//end success: function
    });//end ajax put
    
}) //end of show host form socket


//show the form to player 2
socket.on('showform2', function(){
   $("div#theJumbotron").empty();
   $("#input_section").empty();
    $.ajax({
        url: "http://localhost:8000/getStory",
        type: "GET",
        dataType: "json",
        success: function(result){
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
                    inputArray.push(""  +str.charAt(0)+ count + usageCount);
                   
                   //change the id to first char 
                    
                    //replacing space(s) with underscore
                   var str2 = str.split(' ([])').join('_');
                   str2 = str2.split('(').join(''); //omit '('
                   str2 = str2.split(')').join(''); // omit ')'
                   str2 = str2.split('\'').join(''); // omit single quote
                    
                    $("#input_section").append("<div id='"  + str.charAt(0) + count + usageCount + "'>" + 
                                                 "<label>" + str + "</label>" + 
                                                 ": <input type=text name="+ str2 +" class=form-control required></div><br>");
                    count++;
                }

            });//end splitText.forEach
            console.log("strArray is", strArray);
            $("#input_section").append("<button type=submit id='submitButton' class='btn btn-default'>Submit</button>");
            
            console.log("in show form 2");
            //onclick() function for submitButton
            var submitButton = document.getElementById("submitButton");
            submitButton.addEventListener('click', function(){
              //buildStoryFunction(storyID);
              //build story
              var story2 = buildStoryFunction(storyID);
              clientStoryArray.push(story2);
              console.log("clientstoryarray2: " + clientStoryArray);
              //clear screen and have them wait
              $("div#theJumbotron").empty();
              $("#input_section").empty();
              $("div#theJumbotron").append(storysubmitwaitingscreen);

              //send the story and wait
              socket.emit('waitforothers', {story: story2});
            });

        }//end success: function
    });//end ajax put
    
}) //end of show player 2 form socket

//show story
socket.on('showstory', function(){
  console.log("in client side of show story. length: " + clientStoryArray.length);
  //console.log(data.stories.length);
  //console.log("showstorydataL: " + data.storyArray[0]);
 // var storyHolder = JSON.parse(data);
  //console.log("storyholder: " + storyHolder);
  /*var storyArray = [];*/
  var i;
  for(i=0; i<clientStoryArray.length; i++){
    
    console.log("clientstoryArrayloop: " + clientStoryArray);
  }

  $("div#theJumbotron").empty();
  $("#input_section").empty();
  $("div#theJumbotron").append(showstoryheader);
  $("div#theJumbotron").append("</br></br>Stories: </br>" + clientStoryArray);
})
//end of show story


//vn: can comment this out
var storyID;
var inputArray = [];
var count = 0;
var strArray = [];
//Builds form based off of chosen story when
//the Play button is pressed.
$( "#playButton" ).click(function() {
    
    // find an available game to join
    $.get("http://localhost:8000/joinGame", function(data, status){
      console.log("Data:" + data + "\n Status: " + status);
      alert("Data:" + data + "\n Status: " + status);
      if(data !== null) { // if exist, join the game
        //join the game...
        $('#joinAGameModal').modal('show');
      }
      else { // if not, create a new game
        $.post("http://localhost:8000/createNewGame", function(data, status){
          console.log("Data:" + data + "\n Status: " + status);
          alert("Data:" + data + "\n Status: " + status);
        });
        $('#waitingModal').modal('show');
      }// end if - else
    });
    

    /*
    $("#playButton").hide();
    $("#theJumbotron").hide();
    $.ajax({
        url: "http://localhost:8000/getStory",
        type: "GET",
        dataType: "json",
        success: function(result){
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
                    inputArray.push(""  +str.charAt(0)+ count + usageCount);
                   */
                   //change the id to first char 
                    /*
                    $("#input_section").append("<div id='"  + str.charAt(0) + count + usageCount + "'>" + 
                                                 "<label>" + str + "</label>" + 
                                                 ": <input type=text class=form-control required></div><br>");
                    count++;
                }

            });//end splitText.forEach
            console.log("strArray is", strArray);
            $("#input_section").append("<button type=submit onclick='submitFunction()' id='submitButton' class='btn btn-default'>Submit</button>");
           
        }//end success: function
    });//end ajax put
    */
});//end click play



// ====================================  submit input ============================================
//can comment out
function submitFunction() {
    console.log("submit function");

  //get input value
   var totalInput = inputArray.length;
   var inputValue = [];
   //var totalInputValue = [];
   for (var i = 0; i <totalInput; i++) {
      inputValue[i] = $('#'+ inputArray[i] + ' .form-control').val();
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
}// end submitFunction

 // ====================================  Build Story ============================================
function buildStoryFunction($storyID) {
  //console.log(storyID);
  //alert('debug');
  alert($storyID);
  var index = 0;
  var finishedStory;

  $.ajax({url: "http://localhost:8000/getStoryById",
          data: {storyID : $storyID},
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

                    var input1 = $('input[name='+str2+']').val();

                    splitText[index] = input1;
                }
                index++;
            });//end splitText.forEach
          //console.log(splitText);
          finishedStory = splitText.toString();
          alert(finishedStory);
          }
        });
 
}