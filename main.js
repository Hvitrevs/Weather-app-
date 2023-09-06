import "./style.css"
import { getWeather } from "./weather"
import { ICON_MAP } from "./iconMap"

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

function getIconUrl(iconCode) {
  return `icons/${ICON_MAP.get(iconCode)}.svg`
}

// Function to convert Fahrenheit to Celsius
function fahrenheitToCelsius(fahrenheit) {
  return Math.round(((fahrenheit - 32) * 5) / 9);
}

const currentIcon = document.querySelector("[data-current-icon]")

function renderCurrentWeather(current) {
  dailySection.innerHTML = ""
  currentIcon.src = getIconUrl(current.iconCode)
  const currentTempFahrenheit = current.currentTemp;
  const currentTempCelsius = fahrenheitToCelsius(currentTempFahrenheit).toFixed();

  setValue("current-temp", `${currentTempFahrenheit}°F | ${currentTempCelsius}°C`);
  setValue("current-high", current.highTemp)
  setValue("current-low", current.lowTemp)
  setValue("current-fl-high", current.highFeelsLike)
  setValue("current-fl-low", current.lowFeelsLike)
  setValue("current-wind", current.windSpeed)
  setValue("current-precip", current.precip)
}

const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: "long" })
const dailySection = document.querySelector("[data-day-section]")
const dayCardTemplate = document.getElementById("day-card-template")

function renderDailyWeather(daily) {
  dailySection.innerHTML = ""
  daily.forEach(day => {
    const element = dayCardTemplate.content.cloneNode(true)
    setValue("temp", day.maxTemp, { parent: element })
    setValue("date", DAY_FORMATTER.format(day.timestamp), { parent: element })
    element.querySelector("[data-icon]").src = getIconUrl(day.iconCode)
    dailySection.append(element)
  })
}

const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, { hour: "numeric" })
const hourlySection = document.querySelector("[data-hour-section]")
const hourRowTemplate = document.getElementById("hour-row-template")

function renderHourlyWeather(hourly) {
  hourlySection.innerHTML = ""
  const limit = 10;
  const iterations = Math.min(limit, hourly.length);
  for (let i = 0; i < iterations; i++) {
    const hour = hourly[i];
    const element = hourRowTemplate.content.cloneNode(true);
    const tempFahrenheit = hour.temp;
    const tempCelsius = fahrenheitToCelsius(tempFahrenheit).toFixed();

    setValue("temp", `${tempFahrenheit}°F ${tempCelsius}°C`, { parent: element });
    setValue("fl-temp", hour.feelsLike, { parent: element })
    setValue("wind", hour.windSpeed, { parent: element })
    setValue("precip", hour.precip, { parent: element })
    setValue("day", DAY_FORMATTER.format(hour.timestamp), { parent: element })
    setValue("time", HOUR_FORMATTER.format(hour.timestamp), { parent: element })
    element.querySelector("[data-icon]").src = getIconUrl(hour.iconCode)
    hourlySection.append(element)
  }
}

