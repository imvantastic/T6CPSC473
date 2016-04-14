var storyID;
var inputArray = [];
var count = 0;
//Builds form based off of chosen story when
//the Play button is pressed.
$( "#playButton" ).click(function() {
    $( "#playButton" ).hide();
    $("#theJumbotron").hide()
    $.ajax({
        url: "http://localhost:8000/getStory",
        type: "GET",
        dataType: "json",
        success: function(result){
            var splitText = result.story.split(/\[([^\]]+)]/),
                strArray = [],
                str,
                usageCount;
            
            storyID = result.id;
//console.log("result of splitText:", splitText);

            $("#input_section").append("<h2>Please fill in the blanks below!");

            splitText.forEach(function(entry) {
                if (entry[0] === "[") {
//console.log("entry is", entry);
                    usageCount = 1;
                    str = entry.substring(1, entry.length);
//console.log("str is:", str);
                    strArray.forEach(function(entry) {
                        if (entry === str) {
                            usageCount = usageCount + 1;
                        }
                    });
                   // strArray.push(str);
                    //inputArray.push(str + usageCount);
                     
                    strArray.push(str);
                    inputArray.push(""  +str.charAt(0)+ count + usageCount);
                    
                    $("#input_section").append("<div id='"  + str.charAt(0) + count + usageCount + "'>" + 
                                                 "<label>" + str + "</label>" + 
                                                 ": <input type=text class=form-control required></div><br>");
                    count++;
                }

            });//end splitText.forEach

            $("#input_section").append("<button type=submit onclick='submitFunction()' id='submitButton' class='btn btn-default'>Submit</button>");
            console.log("submit button added.");
        }//end success: function
    });//end ajax put
});//end click play



// ====================================  submit input ============================================
function submitFunction() {
    console.log("submit function");

  
   var totalInput = inputArray.length;
   var inputValue = [];

   for (var i = 0; i <totalInput; i++) {
      inputValue[i] = $('#'+ inputArray[i] + ' .form-control').val();

      console.log("i="+i+", "+inputArray[i]);
      console.log("i="+i+", "+inputValue[i]);
   }    

}// end submitFunction

 
