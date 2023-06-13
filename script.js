var apiKey = '1e9cbae69e5062a0d8f5e832145475fa';
var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=';
var city = 'your_city_name';
var geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;

var geoLon, geoLat;

function displayWeatherData(data) {
  var weatherInfoDiv = document.getElementById('weatherInfo');
  weatherInfoDiv.innerHTML = '';

  for (var forecast of data.list) {
    var dateTime = new Date(forecast.dt_txt);
    var date = dateTime.toDateString();
    var time = dateTime.toLocaleTimeString();
    var temperature = Math.round(forecast.main.temp - 273.15);
    var weatherDescription = forecast.weather[0].description;

    var forecastDiv = document.createElement('div');
    forecastDiv.innerHTML = `
      <p>Date: ${date}</p>
      <p>Time: ${time}</p>
      <p>Temperature: ${temperature}°C</p>
      <p>Description: ${weatherDescription}</p>
      <hr>
    `;

    weatherInfoDiv.appendChild(forecastDiv);
  }
}

function getWeatherData(city) {
  fetch(apiUrl + city + '&appid=' + apiKey)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      displayWeatherData(data);
    })
    .catch(function (error) {
      console.log('Error:', error);
    });
}

function searchWeatherData() {
  fetch(geoUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.length > 0) {
        geoLon = data[0].lon;
        geoLat = data[0].lat;

        var weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${geoLat}&lon=${geoLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`;

        fetch(weatherUrl)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            displayWeatherData(data);
          })
          .catch(function (error) {
            console.log('Error:', error);
          });
      } else {
        console.log('No data available for the specified city.');
      }
    })
    .catch(function (error) {
      console.log('Error:', error);
    });
}

var searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', function () {
  var cityInput = document.getElementById('cityInput');
  city = cityInput.value.trim();

  if (city) {
    localStorage.setItem('apiKey', apiKey);
    getWeatherData(city);
  }
});

// Initialize with default city
getWeatherData(city);