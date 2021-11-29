function formatDate() {
  let date = new Date();

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  let hour = date.getHours();
  if (hour > 11 && hour < 24) {
    let hours = [
      "12",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
    ];
    hour = hours[date.getHours()];
    return `${day} ${hour}:${minutes} pm`;
  } else {
    return `${day} ${hour}:${minutes} am`;
  }
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();

  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#weather-forecast");
  let forecast = response.data.daily;

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
                  <div class="forecast-temperatures">
                    <span class="max-temperature">
                      ${Math.round(forecastDay.temp.max)}°
                    </span>
                    <span class="min-temperature">
                      ${Math.round(forecastDay.temp.min)}°
                    </span>
                  </div>
                  <img src="http://openweathermap.org/img/wn/${
                    forecastDay.weather[0].icon
                  }@2x.png" alt="" width="68">
                    <div class="forecast-description">
                  ${forecastDay.weather[0].main}
                  </div>
                  <div class="forecast-date">
                  ${formatDay(forecastDay.dt)}
                  </div>
                </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
  console.log(forecastHTML);
}

function getForecastWeather(coordinates) {
  let apiKey = "9f3c311a8dbd4994ebe8b2c451deabb9";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayForecast);
}

function displayWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let iconElement = document.querySelector("#icon");
  let dateElement = document.querySelector("#date");

  celsiusTemperature = response.data.main.temp;
  console.log(response.data);
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", `${response.data.weather[0].description}`);
  dateElement.innerHTML = formatDate();

  getForecastWeather(response.data.coord);
}

function retrievePosition(position) {
  let latitdue = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "9f3c311a8dbd4994ebe8b2c451deabb9";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitdue}&lon=${longitude}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(displayWeather);
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(retrievePosition);
}
let locationButton = document.querySelector("#temp-of-location");
locationButton.addEventListener("click", getCurrentPosition);

function searchCity(city) {
  let apiKey = "9f3c311a8dbd4994ebe8b2c451deabb9";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayWeather);
}

function submit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input");
  searchCity(city.value);
}

function changeToFarenheit(event) {
  event.preventDefault();
  farenheitLink.classList.add("active");
  celsiusLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");
  let farenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(farenheitTemperature);
}

function changeToCelsius(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  farenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", submit);

let farenheitLink = document.querySelector("#farenheit");
farenheitLink.addEventListener("click", changeToFarenheit);

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", changeToCelsius);

searchCity("Brisbane");
displayForecast();
