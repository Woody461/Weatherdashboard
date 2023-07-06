const apiKey = 'cf07ca83e9a14e77bb2102234230607'; // WeatherAPI API key

const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeatherContainer = document.getElementById('current-weather');
const forecastTodayContainer = document.getElementById('forecast-today');
const forecastFiveDayContainer = document.getElementById('forecast-five-day');
const historyList = document.getElementById('history-list');

searchForm.addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent form submission

  const cityName = cityInput.value;

  // Fetch current weather data
  fetchCurrentWeather(cityName)
    .then(data => {
      // Display current weather conditions
      displayCurrentWeather(data);

      // Add the city to the search history
      addToSearchHistory(cityName);
    })
    .catch(error => {
      console.log(error);
    });

  // Fetch forecast data
  fetchForecast(cityName)
    .then(data => {
      // Display today's forecast
      displayTodayForecast(data);

      // Display five-day forecast
      displayFiveDayForecast(data);
    })
    .catch(error => {
      console.log(error);
    });

  // Clear the search input
  cityInput.value = '';
});

function fetchCurrentWeather(city) {
  const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
  return fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Unable to fetch weather data.');
      }
      return response.json();
    })
    .then(data => {
      return data;
    });
}

function fetchForecast(city) {
  const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`;
  return fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Unable to fetch forecast data.');
      }
      return response.json();
    })
    .then(data => {
      return data;
    });
}

function displayCurrentWeather(data) {
  const cityName = data.location.name;
  const date = new Date(data.current.last_updated_epoch * 1000).toLocaleDateString();
  const icon = data.current.condition.icon;
  const temperature = data.current.temp_c;
  const humidity = data.current.humidity;
  const windSpeed = data.current.wind_kph;

  const currentWeatherHTML = `
    <h2>${cityName} - ${date}</h2>
    <img src="${icon}" alt="Weather Icon">
    <p>Temperature: ${temperature}°C</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${windSpeed} km/h</p>
  `;

  currentWeatherContainer.innerHTML = currentWeatherHTML;
}

function displayTodayForecast(data) {
  const forecastToday = data.forecast.forecastday[0];
  const date = new Date(forecastToday.date).toLocaleDateString();
  const icon = forecastToday.day.condition.icon;
  const temperature = forecastToday.day.avgtemp_c;
  const humidity = forecastToday.day.avghumidity;
  const windSpeed = forecastToday.day.maxwind_kph;

  const todayForecastHTML = `
    <h2>${date}</h2>
    <img src="${icon}" alt="Weather Icon">
    <p>Temperature: ${temperature}°C</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${windSpeed} km/h</p>
  `;

  forecastTodayContainer.innerHTML = todayForecastHTML;
}

function displayFiveDayForecast(data) {
  const forecastItems = data.forecast.forecastday.map(day => {
    const date = new Date(day.date).toLocaleDateString();
    const icon = day.day.condition.icon;
    const temperature = day.day.avgtemp_c;
    const windSpeed = day.day.maxwind_kph;
    const humidity = day.day.avghumidity;

    return `
      <div class="flex items-center space-x-4">
        <div>
          <p class="font-bold">${date}</p>
          <img src="${icon}" alt="Weather Icon" class="w-10 h-10">
          <p>Temperature: ${temperature}°C</p>
          <p>Wind Speed: ${windSpeed} km/h</p>
          <p>Humidity: ${humidity}%</p>
        </div>
      </div>
    `;
  });

  forecastFiveDayContainer.innerHTML = forecastItems.join('');
}

function addToSearchHistory(city) {
  const historyItem = document.createElement('li');
  historyItem.textContent = city;
  historyItem.addEventListener('click', function () {
    cityInput.value = city;
    searchForm.dispatchEvent(new Event('submit'));
  });

  historyList.appendChild(historyItem);
}