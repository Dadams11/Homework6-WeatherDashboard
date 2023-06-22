var apiKey = '1e9cbae69e5062a0d8f5e832145475fa';
var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=';
var currentWeatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
var city = '';
var geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;

var geoLon, geoLat;

// Array to store city names
var cityNames = [];

function displayWeatherData(data) {
  var weatherInfoDiv = document.getElementById('weatherInfo');
  weatherInfoDiv.innerHTML = '';

  if (data.list) {
    // Handle forecast weather data
    for (var forecast of data.list) {
      //"2023-06-16 06:00:00"
      if (forecast.dt_txt.slice(11, 13)==='12'){
        console.log('date time', forecast.dt_txt.slice(11, 13))
      if (forecast.main && forecast.weather && forecast.weather.length > 0) {
        var dateTime = new Date(forecast.dt_txt);
        var date = dateTime.toDateString();
        var time = dateTime.toLocaleTimeString();
        var temperature = Math.round(forecast.main.temp - 273.15);
        var weatherDescription = forecast.weather[0].description;
        var weatherIcon= `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
        var forecastDiv = document.createElement('div');
        forecastDiv.innerHTML = `
          <p>Date: ${date}</p>
          <p>Time: ${time}</p>
          <img src= ${weatherIcon}>
          <p>Temperature: ${temperature}°C</p>
          <p>Description: ${weatherDescription}</p>
          <hr>
        `;

        weatherInfoDiv.appendChild(forecastDiv);
      }
    }
  }
  } else if (data.main && data.weather && data.weather.length > 0) {
    // Handle current weather data
    var dateTime = new Date(data.dt * 1000);
    var date = dateTime.toDateString();
    var time = dateTime.toLocaleTimeString();
    var temperature = Math.round(data.main.temp - 273.15);
    var weatherDescription = data.weather[0].description;

    var currentDiv = document.createElement('div');
    currentDiv.innerHTML = `
      <p>Date: ${date}</p>
      <p>Time: ${time}</p>
      <p>Temperature: ${temperature}°C</p>
      <p>Description: ${weatherDescription}</p>
      <hr>
    `;

    weatherInfoDiv.appendChild(currentDiv);
  } else {
    console.log('No weather data available for the specified city.');
  }
}

function getWeatherData(city) {
  fetch(apiUrl + city + '&appid=' + apiKey)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log('weather data', data);
      displayWeatherData(data);
    })
    .catch(function (error) {
      console.log('Error:', error);
    });
}

function getCurrentWeatherData(city) {
  fetch(currentWeatherApi)
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
            console.log('weather data', data);
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
searchButton.addEventListener('click', function (event) {
  event.preventDefault();
  var cityInput = document.getElementById('cityInput');
  city = cityInput.value.trim();

  if (city) {
    //create an array to store city names

    //save array into local storage
    localStorage.setItem('apiKey', apiKey);
    getWeatherData(city);
  }
});
// Function to retrieve data from local storage
function retrieveDataFromLocalStorage() {
  var storedData = localStorage.getItem('storedData');
  if (storedData) {
    return JSON.parse(storedData);
  } else {
    return [];
  }
}

// Function to save data to local storage
function saveDataToLocalStorage(data) {
  localStorage.setItem('storedData', JSON.stringify(data));
}

// Function to create buttons for each item in local storage
function createButtonsForLocalStorageData() {
  var storedData = retrieveDataFromLocalStorage();
  var buttonContainer = document.getElementById('buttonContainer');
  buttonContainer.innerHTML = '';

  storedData.forEach(function (item) {
    var button = document.createElement('button');
    button.textContent = item;
    button.setAttribute('value', item);
    button.addEventListener('click', function () {
      var city = this.value;
      getWeatherData(city);
    });
    buttonContainer.appendChild(button);
  });
}

// Function to handle search button click event
function handleSearchButtonClick() {
  var cityInput = document.getElementById('cityInput');
  city = cityInput.value.trim();

  if (city) {
    var storedData = retrieveDataFromLocalStorage();
    storedData.push(city);
    saveDataToLocalStorage(storedData);
    createButtonsForLocalStorageData();
    getWeatherData(city);
  }
}

// Attach event listener to search button
var searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', handleSearchButtonClick);

// Initial setup: Create buttons for existing data in local storage
createButtonsForLocalStorageData();


// Initialize with default city
getCurrentWeatherData(city);
