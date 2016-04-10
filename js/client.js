var storyID;

//Builds form based off of chosen story when
//the Play button is pressed.
$( "#playButton" ).click(function() {
    $( "#playButton" ).hide();
    $.ajax({
        url: "http://localhost:8000/getStory",
        type: "GET",
        dataType: "json",
        success: function(result){
            var splitText = result.story.split(/\[([^\]]+)]/),
                str,
                strArray,
                usageCount;
            storyID = result.id;

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

                    $("#input_section").append("<div id='" + str + usageCount + "'>" + str + ": <input type=text></div><br>");
                }

            });
            $("#input_section").append("<button type=submit id='submitButton'>Submit</button>");
        }
    });
});
