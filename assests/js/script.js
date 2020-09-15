var cityInputEl = $("#cityNameInput");
var searchButtonEl = $("#search-button");
var cityListEl = $("#city-list");
var cityConditionIconEl = $("condition-icon");
var cityTemperatureEl = $("#city-temerature");
var cityHumidityEl = $("#city-humidity");
var cityWindSpeedEl = $("#city-windspeed");
var cityUVIndexEl = $("#city-uv-index");

function buildQueryURL(cityName, forcastType) {
    var queryURL = "";
    var baseURL = "https://api.openweathermap.org/data/2.5/";
    var apiKey = "37b169c6c553e6d620b06f52f0e2a54e";
    queryURL = baseURL + forcastType +
        "?q=" + cityName +
        "&appid=" + apiKey;
    return queryURL;

}

function getOpenWeather(cityName, forcastType) {
    var queryURL = buildQueryURL(cityName, forcastType);
    $.ajax({
        url: queryURL,
        method: "GET"
    })

}

function updateCurrentConditions() {

}

$(document).ready(function () {


});