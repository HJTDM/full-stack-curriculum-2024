import React, { useState, useEffect } from "react";
import "../styles/MainContainer.css"; // Import the CSS file for MainContainer

import ForecastCard from './ForecastCard';

function MainContainer(props) {

  function formatDate(daysFromNow = 0) {
    let output = "";
    var date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    output += date.toLocaleString("en-US", { weekday: "long" }).toUpperCase();
    output += " " + date.getDate();
    return output;
  }

  const getIcon = async (iconName) => {
    try {
      const icon = await import(`../icons/${iconName}.svg`);
      return icon.default;
    } 
    catch (err) {
      console.error(`Icon not found: ${iconName}`);
      return null;
    }
  };

  const [weather, setWeather] = useState(null);
  const [aqi, setAqi] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [iconSrc, setIconSrc] = useState(null);

  useEffect(() => {
    if (props.selectedCity) {
      let apiCallWeather = `http://api.openweathermap.org/data/2.5/weather/?lat=${props.selectedCity.lat}&lon=${props.selectedCity.lon}&appid=${props.apiKey}&units=imperial`;

      fetch(apiCallWeather)
        .then((response) => response.json())
        .then(async (data) => {
          setWeather({
            condition: data.weather[0].main,
            temperature: data.main.temp,
            icon: data.weather[0].icon
          });
          const icon = await getIcon(data.weather[0].icon);
          setIconSrc(icon);
        })

      let apiCallAQI = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${props.selectedCity.lat}&lon=${props.selectedCity.lon}&appid=${props.apiKey}`

      fetch(apiCallAQI)
          .then((response) => 
            response.json()
          )
          .then((data) => {
            setAqi({
              index: data.list[0].main.aqi
            })
          });
      
      let apiCallForecast = `http://api.openweathermap.org/data/2.5/forecast?lat=${props.selectedCity.lat}&lon=${props.selectedCity.lon}&appid=${props.apiKey}&units=imperial`

      fetch(apiCallForecast)
          .then((response) => 
            response.json()
          )
          .then((data) => {
            setForecast({list: data.list})
          });
    }
  }, [props.selectedCity, props.apiKey]);

  return (
    <div id="main-container">
      {weather && (
        <div id="weather-container">
          <h5 id="todays-date">{formatDate(0)}</h5>
          <h2 id="weather-for">Weather for {props.selectedCity.fullName}</h2>
          <div id='current-weather-container'>
            <div id='current-weather-info'>
              <h2 id="current-weather-condition">{weather.condition}</h2>
              <h1 id="current-temperature">{`${Math.round(weather.temperature)}\u00B0`}</h1>
              {aqi && <h5 id="current-aqi">AQI: {aqi.index}</h5>}
            </div>
            {iconSrc && <img id="current-weather-icon" src={iconSrc} alt="weather icon"/>}
          </div>
          <div id='forecast-container'>
            {[1, 2, 3, 4, 5].map(day => (
                <ForecastCard forecast={forecast} day={day} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MainContainer;

