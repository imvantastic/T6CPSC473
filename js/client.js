var storyID;

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

            $("#input_section").append("<h2>Please fill in the blanks below!");

            splitText.forEach(function(entry) {
                if (entry[0] === "[") {

                    usageCount = 1;
                    str = entry.substring(1, entry.length);

                    strArray.forEach(function(entry) {
                        if (entry === str) {
                            usageCount = usageCount + 1;
                        }
                    });
                    strArray.push(str);

                    $("#input_section").append("<div id='" + str + usageCount + "'>" + "<label>" + str + "</label>" + ": <input type=text class=form-control required></div><br>");
                }

            });
            $("#input_section").append("<button type=submit id='submitButton' class='btn btn-default'>Submit</button>");
        }
    });
});
