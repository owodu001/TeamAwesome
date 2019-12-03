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
function getCurLocation() {
    // This function is based on geoFindMe function found at
    //https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
    //this function return an object with the lat and lon of current location
   

    let location = {};

    function success(position) {
      

      location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        success: true
      }
     
      getCurWeather(location);
      getForecastWeather(location);
    }

    function error() {
      location = { success: false }
      console.log('Could not get location');
      return location;
    }

    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser');
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };


// EXECUTE autoComplete() & getCurrentLocation() WHEN PAGE LOADS =====================================================================
autoComplete(userInputEl);


// ADD CLICK EVENT TO THE SEARCH BUTTON ==============================================================================================
searchBtnEl.addEventListener("click", function (event) {
    event.preventDefault();
    // Check if global latitude and longitude have been changed with new values
    console.log("User selected lat: ", latitude, " lng: ", longitude);
    getCurWeather(location);
    displayresto();

});
// Amiraaaaaaaa =====================================================================
function convertDate(epoch) {
    // function to convert unix epoch to local time
    // returns arr ["MM/DD/YYYY, HH:MM:SS AM", "MM/DD/YYYY", "HH:MM:SS AM"]

    let readable = [];
    let myDate = new Date(epoch * 1000);

    // local time
    // returns string "MM/DD/YYYY, HH:MM:SS AM"
    readable[0] = (myDate.toLocaleString());
    readable[1] = ((myDate.toLocaleString().split(", "))[0]);
    readable[2] = ((myDate.toLocaleString().split(", "))[1]);


    return readable;
}
function getCurWeather(loc) {

    
  
    const apiKey = "166a433c57516f51dfab1f7edaed8413";
    let requestType = "";
    let query = "";  
    let url = 'https://api.openweathermap.org/data/2.5/';
    if (typeof loc === "object") {
        city = `lat=${loc.latitude}&lon=${loc.longitude}`;
      } else {
        city = `q=${loc}`;
      }
  
      // set queryURL based on type of query
      requestType = 'weather';
      query = `?${city}&units=imperial&appid=${apiKey}`;
      queryURL = `${url}${requestType}${query}`;
    query = `?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`;
    queryURL = `${url}${requestType}${query}`;
    // Create an AJAX call to retrieve data Log the data in console
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function (response) {


        weatherObj = {
            city: `${response.name}`,
            wind: response.wind.speed,
            humidity: response.main.humidity,
            temp: response.main.temp,
            date: (convertDate(response.dt))[1],
            icon: `http://openweathermap.org/img/w/${response.weather[0].icon}.png`,
            desc: response.weather[0].description
        }

        // calls function to draw results to page
        drawCurWeather(weatherObj);

    });
};

function drawCurWeather(cur) {
    // function to draw  weather for day 

    $('#weather').empty();
    let $cardTitle = $('<h5 class="card-title">');
    $cardTitle.text(cur.city + " (" + cur.date + ")");


    let $ul = $('<ul>');

    let $iconLi = $('<li>');
    let $iconI = $('<img>');
    $iconI.attr('src', cur.icon);

    let $weathLi = $('<li>');
    $weathLi.text(cur.weather);

    let $temp = $('<li>');
    $temp.text('Temp: ' + cur.temp + " F");

    let $curWind = $('<li>');
    $curWind.text('Windspeed: ' + cur.wind + " MPH");

    let $humLi = $('<li>');
    $humLi.text('Humidity: ' + cur.humidity + "%");

    // assemble element
    $iconLi.append($iconI);

    $ul.append($iconLi);
    $ul.append($weathLi);
    $ul.append($temp);
    $ul.append($curWind);
    $ul.append($humLi);

    $cardTitle.append($ul);
    $('#weather').append($cardTitle);


};


//  Create a function to display the restaurant based on city 
function displayresto() {
    // Define an object 'settings' to store query url to API server
    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://developers.zomato.com/api/v2.1/search?lat=" +
            latitude + "&lon=" + longitude + "&count=100",
        "method": "GET", // use Get method
        "headers": {
            "user-key": "91ed3953ab67d3bc31054f6a0ee5a372",
            'Content-Type': 'application/x-www-form-urlencoded' // Return in JSON format
        }
    }

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
            });
        });
        $("#food-info").html(html);

    });
}
// mira







// });