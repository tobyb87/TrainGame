$(document).ready(function() {
	// Initialize Firebase
        // Initialize Firebase
            var config = {
            apiKey: "AIzaSyBmN4EsDmmNq0kkYWhj9she6ih8YxIa8Zg",
            authDomain: "trainproject-25724.firebaseapp.com",
            databaseURL: "https://trainproject-25724.firebaseio.com",
            storageBucket: "trainproject-25724.appspot.com",
            messagingSenderId: "72691980238"
        };
        firebase.initializeApp(config);

        // Create a variable to reference the database
        var database = firebase.database();

        //User connections
        var connectionsRef = database.ref("/connections");

		var connectedRef = database.ref(".info/connected");

		// When the client's connection state changes...
		connectedRef.on("value", function(snap) {

		  // If they are connected..
		  if (snap.val()) {

		    // Add user to the connections list.
		    var con = connectionsRef.push(true);

		    // Remove user from the connection list when they disconnect.
		    con.onDisconnect().remove();
		  }
		});


        var trainName = "";
        var destination = "";
        var trainTime = "";
        var frequency = "";


        //Click event for Submit button
        $("#add-train").on("click", function() {
            trainName = $("#trainName-input").val().trim();
            destination = $("#destination-input").val().trim();
            trainTime = $("#trainTime-input").val().trim();
            frequency = $("#frequency-input").val().trim();

            database.ref().push({
              trainName: trainName,
              destination: destination,
              trainTime: trainTime,
              frequency: frequency
            });

            // Assumptions
            var tFrequency = frequency;
            console.log(tFrequency);

            // First train time
            var firstTime = trainTime;
            console.log(firstTime);

            // First Time (pushed back 1 year to make sure it comes before current time)
            var firstTimeConverted = moment(firstTime, "hh:mm A");
            console.log(firstTimeConverted);

            // Current Time
            var currentTime = moment();
            console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm A"));

            // Difference between the times
            var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
            console.log("DIFFERENCE IN TIME: " + diffTime);

            // Time apart (remainder)
            var tRemainder = diffTime % tFrequency;
            console.log(tRemainder);

            // Minute Until Train
            var tMinutesTillTrain = tFrequency - tRemainder;
            console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

            // Next Train
            var nextTrain = moment().add(tMinutesTillTrain, "minutes");
            console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm A"));

            database.ref().once("child_added", function(childSnapshot) {
              $(".trainInfo").append("<tr>" + "<td>" + childSnapshot.val().trainName + "</td>" + "<td>" + childSnapshot.val().destination + "</td>" + "<td>" + childSnapshot.val().frequency + "</td>" + "<td>" + moment(nextTrain).format("hh:mm A") + "<td>" + tMinutesTillTrain + "</tr>");
            });

            $("form").trigger("reset");

          return false;
        });
});