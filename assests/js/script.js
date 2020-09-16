// Search Box
var cityInputEl = $("#cityNameInput");
var searchButtonEl = $("#search-button");
//history list
var cityListEl = $("#city-list");

// Current conditions
var cityHeaderEl = $("#city-header");
var cityConditionIconEl = $("#condition-icon");
var cityConditionIconImgEl = $("#condition-icon-img");
var cityTemperatureEl = $("#city-temperature");
var cityHumidityEl = $("#city-humidity");
var cityWindSpeedEl = $("#city-windspeed");
var cityUVIndexEl = $("#city-uv-index");
var cityUVIndexBadgeEl = $("<span>").attr("class", "badge");

// Five-day forecast
var forecastGroupEl = $("#five-day-forecast-card-group");
var forecastCardEl = $("<div>")
    .attr("class", "card text-white bg-primary mb-3 forecast-card");
var forecastCardHeaderEl = $("<div>")
    .attr("class", "card-header");
var forecastCardBodyEl = $("<div>")
    .attr("class", "card-body");
var forecastCardIconEl = $("<p>")
    .attr("class", "card-text");
var forecastCardTempEl = $("<p>")
    .attr("class", "card-text");
var forecastCardHumidityEl = $("<p>")
    .attr("class", "card-text");

//local storage
var cityList = JSON.parse(localStorage.getItem("cityList")) || [];

//open weather basics
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

function saveCity(cityName) {
    if (cityList.includes(cityName)) {
        return;
    } else {

        cityList.push(cityName);
        localStorage.setItem("cityList", JSON.stringify(cityList));
    }
}

function updateSidebar() {
    cityListEl.empty();
    for (var city of cityList) {
        $("<button>")
            .attr("class", "btn btn-light city-list-btn")
            .attr("data-city", city)
            .text(city).appendTo(cityListEl);

    }
}

function getUVIndex(lat, lon) {
    var queryURL = baseURL + "uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(renderUVButton);
}

function updateFiveDayForecast(weatherData) {
    console.log(weatherData);
    forecastGroupEl.empty();
    for (var i = 0; i < 5; i++) {
        var forecastDate = moment.unix(weatherData.list[i].dt)
            .utcOffset(weatherData.city.timezone / 60)
            .format("MM/DD/YYYY");
        console.log(forecastDate);
        var forecastIcon = weatherData.list[i].weather[0].icon;
        var forecastIconSrc = "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png"
        var forecastCondition = weatherData.list[i].weather.main;
        var forecastTempF = (weatherData.list[i].main.temp - 273.15) * 1.8 + 32;
        var forecastHumidty = weatherData.list[1].main.humidity;

        forecastCardEl.attr("id", `forcast-day-${i}`);
        forecastCardHeaderEl.text(forecastDate).appendTo(forecastCardEl);
        forecastCardIconEl.html(`<span><img src=${forecastIconSrc} alt=${forecastCondition}></span>`).appendTo(forecastCardEl);
        forecastCardTempEl.text(`Temp: ${forecastTempF.toFixed(2)}`).appendTo(forecastCardEl);
        forecastCardHumidityEl.text(`Humidity: ${forecastHumidty}%`).appendTo(forecastCardEl);
        forecastGroupEl.append(forecastCardEl.clone());


    }
    updateSidebar();
}

function updateCurrentConditions(weatherData) {
    console.log(weatherData);
    var cityName = weatherData.name
    var cityDate = moment.unix(weatherData.dt).utcOffset(weatherData.timezone / 60).format("MM/DD/YYYY");
    var conditionIconSrc = "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png";
    var cityCondition = weatherData.weather[0].description;
    var cityTemperatureF = (weatherData.main.temp - 273.15) * 1.80 + 32;
    var cityHumidity = weatherData.main.humidity;
    var cityWindSpeed = weatherData.wind.speed;
    var lat = weatherData.coord.lat;
    var lon = weatherData.coord.lon;
    var uvBadge = getUVIndex(lat, lon);

    cityConditionIconImgEl
        .attr("src", conditionIconSrc)
        .attr("alt", cityCondition)
        .appendTo(cityConditionIconEl);
    cityHeaderEl.text(`${cityName} (${cityDate})`).append(cityConditionIconEl);
    cityTemperatureEl.text(`Temperature: ${cityTemperatureF.toFixed(1)} F`);
    cityHumidityEl.text(`Humidity: ${cityHumidity}`);
    cityWindSpeedEl.text(`Wind Speed: ${cityWindSpeed}`);
    cityUVIndexEl.text("UV Index:").append(cityUVIndexBadgeEl);

    saveCity(cityName);
    getFiveDayForecast(cityName, "forecast");

}

function buildQueryURL(cityName, forecastType) {
    var queryURL = "";
    queryURL = baseURL + forecastType +
        "?q=" + cityName +
        "&appid=" + apiKey;
    console.log(queryURL);
    return queryURL;

}

function getCurrentWeather(cityName) {
    var forecastType = "weather";
    var queryURL = buildQueryURL(cityName, forecastType);
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(updateCurrentConditions);

}

function getFiveDayForecast(cityName) {
    var forecastType = "forecast";
    var queryURL = buildQueryURL(cityName, forecastType);
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(updateFiveDayForecast);

}

function buildPage() {
    if (cityList.length === 0) {
        getCurrentWeather("New York");
    } else {
        updateSidebar();
        getCurrentWeather(cityList[cityList.length - 1])
    }

}

buildPage();

searchButtonEl.on("click", function (event) {
    event.preventDefault();

    var cityName = cityInputEl.val().trim();
    getCurrentWeather(cityName);
})

$(document).on("click", ".city-list-btn", function () {
    var cityButtonName = $(this);
    console.log(cityButtonName.data().city);
    getCurrentWeather(cityButtonName.data().city);
})