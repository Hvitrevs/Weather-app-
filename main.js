import "./style.css"
import { getWeather } from "./weather"
import { ICON_MAP } from "./iconMap"
import { ICON_MAP_NIGHT } from "./ICON_MAP_NIGHT"

navigator.geolocation.getCurrentPosition(positionSuccess, positionError)

function positionSuccess({ coords }) {
  getWeather(
    coords.latitude,
    coords.longitude,
    Intl.DateTimeFormat().resolvedOptions().timeZone
  )
    .then(renderWeather)
    .catch(e => {
      console.error(e)
      alert("Error. Weather API is unavailable. Check your Internet connection. Contact your administrator for further assistance.")
    })
}

function positionError() {
  alert("Location service is offline. Weather API is unreachable. Please allow location services in your browser and reload the webpage.")
}

function renderWeather({ current, daily, hourly }) {
  renderCurrentWeather(current)
  renderDailyWeather(daily)
  renderHourlyWeather(hourly)
  document.body.classList.remove("blurred")
}

function setValue(selector, value, { parent = document } = {}) {
  parent.querySelector(`[data-${selector}]`).textContent = value
}



function getIconUrl(iconCode, day){
  console.log(day);
  if(day === 0){
      return `./icons/${ICON_MAP_NIGHT.get(iconCode)}.svg`
  }else{
      return `./icons/${ICON_MAP.get(iconCode)}.svg`
  }
}




// Function to convert Fahrenheit to Celsius
function fahrenheitToCelsius(fahrenheit) {
  return Math.round(((fahrenheit - 32) * 5) / 9);
}

const currentIcon = document.querySelector("[data-current-icon]")

function renderCurrentWeather(current) {
  dailySection.innerHTML = "";
  currentIcon.src = getIconUrl(current.iconCode);
  const currentTempFahrenheit = current.currentTemp;
  const currentTempCelsius = fahrenheitToCelsius(currentTempFahrenheit).toFixed();

  const currentHighFahrenheit = current.highTemp;
  const currentHighCelsius = fahrenheitToCelsius(currentHighFahrenheit).toFixed();

  const currentLowFahrenheit = current.lowTemp;
  const currentLowCelsius = fahrenheitToCelsius(currentLowFahrenheit).toFixed();

  const currentHighFeelsLikeFahrenheit = current.highFeelsLike;
  const currentHighFeelsLikeCelsius = fahrenheitToCelsius(currentHighFeelsLikeFahrenheit).toFixed();

  const currentLowFeelsLikeFahrenheit = current.lowFeelsLike;
  const currentLowFeelsLikeCelsius = fahrenheitToCelsius(currentLowFeelsLikeFahrenheit).toFixed();

  setValue("current-temp", `${currentTempFahrenheit}°F | ${currentTempCelsius}°C`);
  setValue("current-high", `${currentHighFahrenheit}°F | ${currentHighCelsius}°C`);
  setValue("current-low", `${currentLowFahrenheit}°F | ${currentLowCelsius}°C`);
  setValue("current-fl-high", `${currentHighFeelsLikeFahrenheit}°F | ${currentHighFeelsLikeCelsius}°C`);
  setValue("current-fl-low", `${currentLowFeelsLikeFahrenheit}°F | ${currentLowFeelsLikeCelsius}°C`);
  setValue("current-wind", current.windSpeed);
  setValue("current-precip", current.precip);
}

const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: "long" });
const dailySection = document.querySelector("[data-day-section]");
const dayCardTemplate = document.getElementById("day-card-template");

function renderDailyWeather(daily) {
  dailySection.innerHTML = "";
  daily.forEach(day => {
    const element = dayCardTemplate.content.cloneNode(true);
    
    // Calculate temperature in Celsius
    const maxTempFahrenheit = day.maxTemp;
    const maxTempCelsius = fahrenheitToCelsius(maxTempFahrenheit).toFixed();
    
    // Display both temperature units
    setValue("temp", `${maxTempFahrenheit}°F | ${maxTempCelsius}°C`, { parent: element });
    
    setValue("date", DAY_FORMATTER.format(day.timestamp), { parent: element });
    element.querySelector("[data-icon]").src = getIconUrl(day.iconCode);
    dailySection.append(element);
  });
}

const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, { hour: "numeric" })
const hourlySection = document.querySelector("[data-hour-section]")
const hourRowTemplate = document.getElementById("hour-row-template")

function renderHourlyWeather(hourly) {
  hourlySection.innerHTML = "";
  const limit = 10;
  const iterations = Math.min(limit, hourly.length);

  for (let i = 0; i < iterations; i++) {
    const hour = hourly[i];
    const element = hourRowTemplate.content.cloneNode(true);
    const tempFahrenheit = hour.temp;
    const tempCelsius = fahrenheitToCelsius(tempFahrenheit).toFixed();

    const feelsLikeFahrenheit = hour.feelsLike;
    const feelsLikeCelsius = fahrenheitToCelsius(feelsLikeFahrenheit).toFixed();

    setValue("temp", `${tempFahrenheit}°F | ${tempCelsius}°C`, { parent: element });
    setValue("fl-temp", `${feelsLikeFahrenheit}°F | ${feelsLikeCelsius}°C`, { parent: element });
    setValue("wind", hour.windSpeed, { parent: element });
    setValue("precip", hour.precip, { parent: element });
    setValue("day", DAY_FORMATTER.format(hour.timestamp), { parent: element });
    setValue("time", HOUR_FORMATTER.format(hour.timestamp), { parent: element });
    element.querySelector("[data-icon]").src = getIconUrl(hour.iconCode);
    hourlySection.append(element);
  }
}

