// Retrieve API key from localStorage or prompt user to enter it
var apiKey = localStorage.getItem('apiKey') || prompt('Enter your OpenWeatherMap API key:');

// Function to retrieve weather data from the API
function getWeatherData(city) {
  var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Process the retrieved weather data and display it
      displayWeatherData(data);
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

// Function to display weather data in the browser
function displayWeatherData(data) {
  var weatherInfoDiv = document.getElementById('weatherInfo');
  weatherInfoDiv.innerHTML = '';

  // Loop through the retrieved data and display relevant information
  for (const forecast of data.list) {
    var dateTime = new Date(forecast.dt_txt);
    var date = dateTime.toDateString();
    var time = dateTime.toLocaleTimeString();
    var temperature = Math.round(forecast.main.temp - 273.15); // Convert from Kelvin to Celsius
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

// Event listener for the search button
var searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', () => {
  var cityInput = document.getElementById('cityInput');
  var city = cityInput.value.trim();

  if (city) {
    // Store the API key in localStorage for future use
    localStorage.setItem('apiKey', apiKey);

    // Get weather data for the entered city
    getWeatherData(city);
  }
});
