var cityInputEl = $("#cityNameInput");
var searchButtonEl = $("#search-button");
var cityListEl = $("#city-list");
var cityHeaderEl = $("#city-header");
var cityConditionIconEl = $("#condition-icon");
var cityConditionIconImgEl = $("#condition-icon-img");
var cityTemperatureEl = $("#city-temperature");
var cityHumidityEl = $("#city-humidity");
var cityWindSpeedEl = $("#city-windspeed");
var cityUVIndexEl = $("#city-uv-index");
var cityUVIndexBadgeEl = $("<span>").addClass("badge");

var baseURL = "https://api.openweathermap.org/data/2.5/";
var apiKey = "37b169c6c553e6d620b06f52f0e2a54e";


function renderUVButton(uvData) {
    console.log(uvData);
    var uvIndex = Math.round(uvData.value);
    cityUVIndexBadgeEl.text(uvIndex);
    if (uvIndex < 3) {
        cityUVIndexBadgeEl.addClass("badge-success");
    } else if (uvIndex < 7) {
        cityUVIndexBadgeEl.addClass("badge-warning");
    } else if (uvIndex > 6) {
        cityUVIndexBadgeEl.addClass("badge-danger");
    }
}

function getUVIndex(lat, lon) {
    var queryURL = baseURL + "uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(renderUVButton);
}
function updateCurrentConditions(weatherData) {
    console.log(weatherData);
    var conditionIconHtml = "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png";
    var cityTemperatureF = (weatherData.main.temp - 273.15) * 1.80 + 32;
    var cityHumidity = weatherData.main.humidity;
    var cityWindSpeed = weatherData.wind.speed;
    var lat = weatherData.coord.lat;
    var lon = weatherData.coord.lon;
    var uvBadge = getUVIndex(lat, lon);

    cityConditionIconImgEl
        .attr("src", conditionIconHtml)
        .attr("alt", weatherData.weather[0].description)
        .appendTo(cityConditionIconEl);
    cityHeaderEl.text(weatherData.name).append(cityConditionIconEl);
    cityTemperatureEl.text(`Temperature: ${cityTemperatureF.toFixed(2)} F`);
    cityHumidityEl.text(`Humidity: ${cityHumidity}`);
    cityWindSpeedEl.text(`Wind Speed: ${cityWindSpeed}`);
    cityUVIndexEl.text("UV Index:").append(cityUVIndexBadgeEl);

}

function buildQueryURL(cityName, forcastType) {
    var queryURL = "";
    queryURL = baseURL + forcastType +
        "?q=" + cityName +
        "&appid=" + apiKey;
    console.log(queryURL);
    return queryURL;

}

function getOpenWeather(cityName, forcastType) {
    var queryURL = buildQueryURL(cityName, forcastType);
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(updateCurrentConditions);

}

$(document).ready(function () {


});

searchButtonEl.on("click", function (event) {
    event.preventDefault();

    var cityName = cityInputEl.val().trim();
    getOpenWeather(cityName, "weather");
})