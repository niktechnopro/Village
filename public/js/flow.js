// Define our Node object
// Node has value, responses array, children, and a parent
console.log('loading flow.js');
console.log('sent email', email);
console.log('greeting is here', greeting);
// loading clock
const date = new Date().toDateString();
$('#date').text(date); //today's date
//ajax post - to send our chatbot transcript
function mailer(payload, email){
    $.post("/send", 
            
        { transcript: payload,
            email: email },               //this is json to be send

        (result)=>{
        console.log('expecting results after successful ajax')
        if(result == 'success'){
            console.log("successfuly sent a transcript")
            swal({
                title: "Thank You for sharing this with me!",
                text: "Press OK button to exit",
                icon: "success",
                button: "OK!"
                }).then(()=>{
                    console.log('we are about to exit')
                    location.href = "/";//redirects back to homepage
                })
        }else{
            console.log('something went wrong - transcript was not sent')
        }

    });
}
function Node(value) {

    this.value = value;
    this.responses = [];
    this.children = [];
    this.parent = null;

    this.setParentNode = function(node) {
        this.parent = node;
    }

    this.getParentNode = function() {
        return this.parent;
    }

    this.addChild = function(node) {
        node.setParentNode(this);
        this.children[this.children.length] = node;
    }

    this.getChildren = function() {
        return this.children;
    }

    this.removeChildren = function() {
        this.children = [];
    }
    this.getValue = function() {
        return this.value;
    }
    this.getResponses = function() {
        return this.responses;
    }
}

function addQuestion(parent, question, responseList){
    parent.addChild(new Node(question));
    // Add possible responses
    var child = parent.getChildren()[0];
    child.responses = responseList;
    return child;
}

////////////////////////////////// Create question flow

// Create root with first question;
// had to remove first question here because we use child's name in chatBot.ejs line 65
var root = new Node(`${greeting} What's up? Did something happen?`);

// Add possible responses
root.responses = ["yes", "no"];

// Create conversation sequence
var newNode = addQuestion(root, "Did it involve another person?", ["Mom", "Dad", "Sister", "Friend", "Other"]);
newNode = addQuestion(newNode, "Where were you?", ["Home", "School", "Online", "Other"]);
newNode = addQuestion(newNode, "When did it happen?", ["Today", "Yesterday", "Earlier"]);
newNode = addQuestion(newNode, "At what time?", ["Morning", "Middle of Day", "Afternoon", "Evening"]);
newNode = addQuestion(newNode, "What was it about?", ["Another person", "An event", "Other"]);
newNode = addQuestion(newNode, "What happened?", ["Argument", "Something physical", "Teasing", "I'm not sure", "Other"]);
newNode = addQuestion(newNode, "Sorry to hear that. Thank you for sharing this with me. How do you feel now?", ["Same", "Better", "Worse"]);
newNode = addQuestion(newNode, "Thank you for letting me know.", []);

// Create an array to store the contents of our conversation
//first question is in it
var chatLog = [];

function logChat(text) {
    chatLog.push(text);
}

// When the document is ready, do this:
$( document ).ready(function() {

    // Identify the root of our conversation tree
    var currentNode = root;

    // Update the chat bot dialogue to display the next question
    function updateBot(currentNode) {

        // Get the bot's next question
        value = currentNode.getValue();

        // Update bot to current statement
        $( "#bot" ).text(value);

        return
    }

    // Clears the response bubbles
    function clearResponses() {
        $( "#responses" ).empty();
    }

    // Clears the kid's chat bubble of text
    function clearKidBubble() {
        $( "#kid span" ).empty();
    }

    // Update the kid message bubble
    function updateKidBubble(text) {
        // $( "#kid span" ).animate({width: 'toggle'}, "050");
        $( "#kid span" ).text( text );
        // $( "#kid span" ).animate({width: 'toggle'}, "slow");
    }

    // Update the response buttons to reflect the new question from the bot
    function updateResponses(currentNode) {

        // Clear previous response options
            clearResponses();

        // Grab the possible responses for this question
        responses = currentNode.getResponses();

        // HTML for the chat bubbles
        var responseBubbleHTML = "<a href='#' id='chatBubbles'><div class='col-sm-4 text-center'> <p class='coloredBackground'></p> </div> "

        // For each possible response, add a chat bubble then
        // append the response to it
        var responseArrayLength = responses.length;
        for (var i = 0; i < responseArrayLength; i++) {
            $( "#responses" ).append( responseBubbleHTML );
            $( "#responses p" ).last().append( responses[i] );

        }
    }

    // Begin our conversation with initial calls to our update functions
    updateBot(currentNode);
    updateResponses(currentNode);

    // Performed when user clicks on a response button
    // Steps to the next question in the tree
    function iterate() {

        children = currentNode.getChildren();

        // Traverse to first child if exists
        if (children.length > 0) {
            updateBot(currentNode);
            updateResponses(currentNode);
        }
        else { // We are at the end of the tree

            // Update the bot's message bubble
            updateBot(currentNode);

            // Clear the response buttons
            clearResponses();

            // Print the conversation log
            var chatLogLength = chatLog.length;
            var speaker = "";

            // Iterate though chat log array
            for (var i = 0; i < chatLogLength; i++) {
                console.log(speaker + chatLog[i]);
            }
            //sending it to function mailer that will forward transcript to server
            mailer(chatLog, email);
            return false;
        }
    }

    // When user clicks on a response, iterate down in the tree
    $( "#responses" ).click(function(e) {

        // Grab the response that was chosen
        var responseText = $(e.target).text();

        // Make the selected response appear in the chat bubble
        updateKidBubble( responseText );
        setTimeout(clearKidBubble,600);

        // Log the question the user clicked in response to
        logChat("Bot: " + currentNode.getValue());

        // Add the user's response to the chat log
        logChat("Child: " + responseText);

        // Move to the next node in the tree
        children = currentNode.getChildren();
        currentNode = children[0];
        setTimeout(iterate,600);

        

    });

});