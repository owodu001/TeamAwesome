// $(document).ready(function () {
// GLOBAL VARIABLES =====================================================================================================================
// Define goble variable for latitude and longitude
let latitude = "";
let longitude = "";
// Define global variable for search input element
const userInputEl = document.getElementById("search-term");
// Define global variable for search button element
const searchBtnEl = document.getElementById("search-btn");
// ======================================================================================================================================


// MAKE AUTOCOMPLETE ON SEARCH BOX AND GET LATITUDE & LONGITUDE OF THE SELECTED LOCATION ================================================
function autoComplete(inputEl) {
    // Create new object of Google places with the type of 'geocode'
    const places = new google.maps.places.Autocomplete(inputEl, { types: ['geocode'] });
    console.log("Google Places object: ", places);

    // Add event listener of 'Key Stroke / place_change' to the search box
    google.maps.event.addListener(places, 'place_changed', function () {
        const selectedPlace = places.getPlace();
        // Change global variables with the found lat & lng
        latitude = selectedPlace.geometry.location.lat();
        longitude = selectedPlace.geometry.location.lng();
    });
}

// GET USER CURRENT LOCATION AND GET THEIR LOCATION'S LATITUDE & LONGITUDE ===============================================================
function getCurrentLocation() {

    // If user allowed access to their current location, update the global lat & lng
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            console.log("User's current lat & lon: ", latitude, ", ", longitude);
            displayresto();
        }, function (error) { // Handle error
            switch (error.code) {
                case error.PERMISSION_DENIED: // User denied the access to their location
                    break;
                case error.POSITION_UNAVAILABLE: // Browser doesn't support location service
                    alert("Location information is unavailable.");
                    break;
                case error.TIMEOUT: // User has not responded to request for access to their location
                    alert("The request to get user location timed out.");
                    break;
                case error.UNKNOWN_ERROR: // Other unknown error
                    alert("An unknown error occurred.");
                    break;
            }
        });
    } else { return; }
}

// EXECUTE autoComplete() & getCurrentLocation() WHEN PAGE LOADS =====================================================================
autoComplete(userInputEl);
getCurrentLocation();

// ADD CLICK EVENT TO THE SEARCH BUTTON ==============================================================================================
searchBtnEl.addEventListener("click", function (event) {
    event.preventDefault();
    // Check if global latitude and longitude have been changed with new values
    console.log("User selected lat: ", latitude, " lng: ", longitude);
    displayresto();
});
//  Create a function to display the restaurant based on city 
function displayresto() {
    // Define an object 'settings' to store query url to API server
    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://developers.zomato.com/api/v2.1/search?lat=" +
            latitude + "&lon=" + longitude + "&count=100&sort=real_distance&order=asc", 
        "method": "GET", // use Get method
        "headers": {
            "user-key": "91ed3953ab67d3bc31054f6a0ee5a372",
            'Content-Type': 'application/x-www-form-urlencoded' // Return in JSON format
        }
    }// end of defining object 'settings'
    $.getJSON(settings, function (datares) { // make a request to API server
        console.log(datares);
        datares = datares.restaurants;
        console.log("Resto data returned from server: ", datares);
        let html = "";
        // loop through the returned data
        $.each(datares, function (index, value) {
            // define an object to store resto data
            let restoObj = datares[index];
            console.log(typeof restoObj);
            console.log("Resto data: ", restoObj);
            $.each(restoObj, function (index, value) {
                // show only restaurant that has picture
                if (value.thumb != ""){
                    let location = restoObj.restaurant.location;
                    let userRating = restoObj.restaurant.user_rating;
                    html += "<div class='data img-rounded'>";
                    html += "<div class='rating'>";
                    html += "<span title='" + userRating.rating_text + "'><p style='color:white;background-color:#" + userRating.rating_color + ";border-radius:4px;border:none;padding:2px 10px 2px 10px;text-align: center;text-decoration:none;display:inline-block;font-size:16px;float:right;'><strong>" + userRating.aggregate_rating + "</strong></p></span><br>";
                    html += "  <strong class='text-info'>" + userRating.votes + " votes</strong>";
                    html += "</div>";
                    html += "<img class='resimg img-rounded' src=" + value.thumb + " alt='Restaurant Image' height='185' width='185'>";
                    html += "<a href=" + value.url + " target='_blank' class='action_link'><h2 style='color:red;'><strong>" + value.name + "</strong></h2></a>";
                    html += "  <strong class='text-primary'>" + location.locality + "</strong><br>";
                    html += "  <h6 style='color:grey;'><strong>" + location.address + "</strong></h6><hr>";
                    html += "  <strong>CUISINES</strong>: " + value.cuisines + "<br>";
                    html += "  <strong>COST FOR TWO</strong>: " + value.currency + value.average_cost_for_two + "<br>";
                    html += "</div><br>";
                }
            });
        });
        $("#food-info").html(html);
    }); // end of request for getting data to API server
}// end of function


// });