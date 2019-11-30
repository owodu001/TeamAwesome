$(document).ready(function() {

    $("#getMessage").on("click", function() {
    let valueSearchBox = $('#getText').val()
     if (valueSearchBox === "") {
      return;
     }
     select(valueSearchBox);
    });
    //--------------------------------------------------SEARCH BY CITY-----------------------------------------
   
    function select(valueSearch) {

       let settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://developers.zomato.com/api/v2.1/locations?query=" + valueSearch ,
            "method": "GET",
            "headers": {
             "user-key": "91ed3953ab67d3bc31054f6a0ee5a372"
            
            }
        }

    $.getJSON(settings, function(data) { 
    console.log("City Data: ", data);

    const lat = data.location_suggestions[0].latitude;
    const lon = data.location_suggestions[0].longitude;
    console.log("Lat: ", lat, " Lon: ", lon);
    if (data) {
    // let valueSearch = $('#getText').val()
    // let searchCity = "&q=" + valueSearch;
    let settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://developers.zomato.com/api/v2.1/search?lat=" +
      lat + "&lon=" + lon + "&count=100",
      "method": "GET",
      "headers": {
       "user-key": "91ed3953ab67d3bc31054f6a0ee5a372",
       'Content-Type': 'application/x-www-form-urlencoded'
      }
     }
     $.getJSON(settings, function(datares) {
      
          datares = datares.restaurants;
          console.log("datar", datares);
          let html = "";
    $.each(datares, function(index, value) {
   
      let x = datares[index];
        console.log(typeof x);
       $.each(x, function(index, value) {
       let location = x.restaurant.location;
       let userRating = x.restaurant.user_rating;
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
      $(".message").html(html);

    });
 } else {
        // if city was not found, do nothing
        return;
    }


});
    }
   });