import React, { useState, useEffect } from "react";
import axios from "axios";
import apiKeys from "./apiKeys";
import ReactAnimatedWeather from "react-animated-weather";

function Forecast(props) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [weather, setWeather] = useState({});
  const [dailyForecast, setDailyForecast] = useState([]);

  const defaults = {
    color: "white",
    size: 112,
    animate: true,
  };

  function getDayOfWeek(timestamp) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = new Date(timestamp * 1000);
    return daysOfWeek[date.getUTCDay()];
  }

  const search = (city) => {
    axios
      .get(
        `${apiKeys.base}weather?q=${city != "[object Object]" ? city : query}&units=metric&APPID=${apiKeys.key}`
      )
      .then((response) => {
        setWeather(response.data);
        setQuery("");
        getDailyForecast(response.data.coord); // Fetch the daily forecast
      })
      .catch(function (error) {
        console.log(error);
        setWeather("");
        setQuery("");
        setError({ message: "Not Found", query: query });
      });
  };

  const getDailyForecast = (coord) => {
    axios
      .get(
        `${apiKeys.base}onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=current,minutely,hourly&units=metric&APPID=${apiKeys.key}`
      )
      .then((response) => {
        setDailyForecast(response.data.daily);
      })
      .catch(function (error) {
        console.log(error);
        setDailyForecast([]);
      });
  };

  useEffect(() => {
    search("Delhi");
  }, []);

  return (
    <div className="forecast">
      {/* Background image for the location */}
      <div className="location-image" style={{ color: "white" }}>
  
      </div>
      <div className="forecast-icon">
        <ReactAnimatedWeather
          icon={props.icon}
          color={defaults.color}
          size={defaults.size}
          animate={defaults.animate}
        />
      </div>
      <div className="today-weather">
        <h3>{props.weather}</h3>
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search any city"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
          <div className="img-box">
            <img
              src="https://images.avishkaar.cc/workflow/newhp/search-white.png"
              onClick={() => search(query)}
            />
          </div>
        </div>
        <ul>
          {typeof weather.main !== "undefined" ? (
            <div>
              <li className="cityHead">
                <p style={{ color: "white" }}>
                  {weather.name}, {weather.sys.country}
                </p>
                <img
                  className="temp"
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                  alt="Weather Icon"
                />
              </li>
              <li>
                Temperature{" "}
                <span className="temp">
                  {Math.round(weather.main.temp)}°c ({weather.weather[0].main})
                </span>
              </li>
              <li>
                Humidity{" "}
                <span className="temp">
                  {Math.round(weather.main.humidity)}%
                </span>
              </li>
              <li>
                Visibility{" "}
                <span className="temp">
                  {Math.round(weather.visibility)} mi
                </span>
              </li>
              <li>
                Wind Speed{" "}
                <span className="temp">
                  {Math.round(weather.wind.speed)} Km/h
                </span>
              </li>
            </div>
          ) : (
            <li>
              {error.query} {error.message}
            </li>
          )}
        </ul>
      </div>
      <div className="weekly-forecast">
        <h3>Weekly Forecast</h3>
        <ul>
          {dailyForecast.map((day, index) => (
            <li key={index}>
              <p>{getDayOfWeek(day.dt)}</p>
              <img
                className="temp"
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                alt="Weather Icon"
              />
              <p>
                {Math.round(day.temp.day)}°c ({day.weather[0].main})
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Forecast;
