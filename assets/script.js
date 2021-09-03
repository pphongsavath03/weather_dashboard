var cities = [];

var citySearchEl = document.querySelector("#city-search-form");
var cityEl = document.querySelector("#city");
var currentWeatherEl = document.querySelector("#current-weather-container");
var searchInputEl = document.querySelector("#searched-city");
var showForecast = document.querySelector("#forecast");
var fiveDayForcast = document.querySelector("#fiveday-container");
var pastSearchBtn = document.querySelector("#past-search-buttons");

//api key
var apiKey = "8e2c8f13d0656ae12ccf74b7b312eb78"

var formSumbitHandler = function(event) {
    event.preventDefault();
    var city = cityEl.value.trim();
    if (city) {
        getCityWeather(city);
        get5Day(city);
        cities.unshift({ city });
        cityEl.value = "";
    }
    saveSearch();
    pastSearch(city);
}

var saveSearch = function() {
    localStorage.setItem("cities", JSON.stringify(cities));
};

var getCityWeather = function(city) {
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
        .then(function(response) {
            response.json().then(function(data) {
                displayWeather(data, city);
            });
        });
};

var displayWeather = function(weather, searchCity) {
    currentWeatherEl.textContent = "";
    searchInputEl.textContent = searchCity;

    var currentDate = document.createElement("span")
    currentDate.textContent = " (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
    searchInputEl.appendChild(currentDate);

    var weatherIcon = document.createElement("img")
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    searchInputEl.appendChild(weatherIcon);

    var temperatureEl = document.createElement("span");
    temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
    temperatureEl.classList = "list-group-item"

    var humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
    humidityEl.classList = "list-group-item"

    var windSpeedEl = document.createElement("span");
    windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    windSpeedEl.classList = "list-group-item"

    currentWeatherEl.appendChild(temperatureEl);

    currentWeatherEl.appendChild(humidityEl);

    currentWeatherEl.appendChild(windSpeedEl);

    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    getUvIndex(lat, lon)
}

var getUvIndex = function(lat, lon) {
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(apiURL)
        .then(function(response) {
            response.json().then(function(data) {
                displayUvIndex(data)
            });
        });
}

var displayUvIndex = function(index) {
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: "
    uvIndexEl.classList = "list-group-item"

    uvIndexValue = document.createElement("span")
    uvIndexValue.textContent = index.value

    if (index.value <= 2) {
        uvIndexValue.classList = "favorable"
    } else if (index.value > 2 && index.value <= 8) {
        uvIndexValue.classList = "moderate "
    } else if (index.value > 8) {
        uvIndexValue.classList = "severe"
    };

    uvIndexEl.appendChild(uvIndexValue);

    currentWeatherEl.appendChild(uvIndexEl);
}

var get5Day = function(city) {
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
        .then(function(response) {
            response.json().then(function(data) {
                display5Day(data);
            });
        });
};

var display5Day = function(weather) {
    fiveDayForcast.textContent = ""
    showForecast.textContent = "5-Day Forecast:";

    var forecast = weather.list;
    for (var i = 5; i < forecast.length; i = i + 8) {
        var dailyForecast = forecast[i];


        var forecastEl = document.createElement("div");
        forecastEl.classList = "card bg-success opacity-75 text-light m-2";

        var forecastDate = document.createElement("h5")
        forecastDate.textContent = moment.unix(dailyForecast.dt).format("MMM D, YYYY");
        forecastDate.classList = "card-header text-center"
        forecastEl.appendChild(forecastDate);

        var weatherIcon = document.createElement("img")
        weatherIcon.classList = "card-body text-center";
        weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);

        forecastEl.appendChild(weatherIcon);

        var forecastTempEl = document.createElement("span");
        forecastTempEl.classList = "card-body text-center";
        forecastTempEl.textContent = dailyForecast.main.temp + " °F";

        forecastEl.appendChild(forecastTempEl);

        var forecastHumEl = document.createElement("span");
        forecastHumEl.classList = "card-body text-center";
        forecastHumEl.textContent = dailyForecast.main.humidity + "  %";

        forecastEl.appendChild(forecastHumEl);

        fiveDayForcast.appendChild(forecastEl);
    }

}

var pastSearch = function(pastSearch) {

    pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastSearch;
    pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
    pastSearchEl.setAttribute("data-city", pastSearch)
    pastSearchEl.setAttribute("type", "submit");

    pastSearchBtn.prepend(pastSearchEl);
}


var pastSearchHandler = function(event) {
    var city = event.target.getAttribute("data-city")
    if (city) {
        getCityWeather(city);
        get5Day(city);
    }
}

citySearchEl.addEventListener("submit", formSumbitHandler);
pastSearchBtn.addEventListener("click", pastSearchHandler);