function formatDate() {
  let date = new Date();

  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
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

  return `${day} ${hour}:${minutes}`;
}

function displayForecast() {
  let forecastElement = document.querySelector("#weather-forecast");
  let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  let forecastHTML = `<div class="row">`;
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `<div class="col-2">
                  <div class="forecast-temperatures">
                    <span class="max-temperature">
                      21°
                    </span>
                    <span class="min-temperature">
                      18°
                    </span>
                  </div>
                  <img src="http://openweathermap.org/img/wn/09d@2x.png" alt="" width="68">
                    <div class="forecast-description">
                  Cloudy
                  </div>
                  <div class="forecast-date">
                  ${day}
                  </div>
                </div>`;
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
  console.log(forecastHTML);
}

function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let iconElement = document.querySelector("#icon");
  let dateElement = document.querySelector("#date");

  celsiusTemperature = response.data.main.temp;

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
}

function searchCity(city) {
  let apiKey = "9f3c311a8dbd4994ebe8b2c451deabb9";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayTemperature);
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
