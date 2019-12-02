// GLOBAL VARIABLES =====================================================================================================================
// Define goble variable for latitude and longitude
let latitude ="";
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
function getCurrentLocation(){

    // If user allowed access to their current location, update the global lat & lng
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            console.log("User's current lat & lon: ", latitude, ", ", longitude);
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
searchBtnEl.addEventListener("click", function(event){
    event.preventDefault();
    // Check if global latitude and longitude have been changed with new values
    console.log("User selected lat: ", latitude, " lng: ", longitude);
});