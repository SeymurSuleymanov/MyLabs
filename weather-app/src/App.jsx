import { useState, useEffect } from "react";
import DayAndWeek from "./components/DayOfWeek";
import CityWeatherToday from "./components/CityWeather"
import WeatherForFive from "./components/Weather_Five"
import Humid from "./components/Humid"
import FutureDays from "./components/FutureDay"

//мок
import mockWeatherData from './mockWeather.js';

import './App.css';

const TOKEN_API = "c60df21b68b58bf755c7cf4825bb824e";

function App() {
  // useTheme();
  //мок
  // const USE_MOCK = true;

  const [city, setCity] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  
  const example_cty = "Черепаново ";

  useEffect(() => {
    async function getWeather() {
      //мок
      // setLoading(true);
      
      // if (USE_MOCK) {
      //     setWeatherData(mockWeatherData);
      //     setLoading(false);
      //     return; 
      // }


      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${example_cty}&limit=1&appid=${TOKEN_API}`;
      const geoResponse = await fetch(geoUrl);
      const geoData = await geoResponse.json();
      if (geoData && geoData.length > 0) {
      setCoordinates({ 
        lat: geoData[0].lat,
        lon: geoData[0].lon
  
      });
      const cityUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${geoData[0].lat}&lon=${geoData[0].lon}&units=metric&appid=${TOKEN_API}`;
      const cityRespone = await fetch(cityUrl);
      const cityData = await cityRespone.json();

    if (cityData && cityData.cod == "200") {
      setWeatherData(cityData);
    }
    }

      setLoading(false);
    }
    getWeather();
  }, [])
  
useEffect(() => {
  if (!weatherData || !weatherData.list || weatherData.list.length === 0) return;
  
  const timezoneOffset = weatherData.city.timezone; 
  
  const currentItem = weatherData.list[0];
  const utcDate = new Date(currentItem.dt_txt);
  const localDate = new Date(utcDate.getTime() + timezoneOffset * 1000);
  const hours = localDate.getUTCHours();
  
  const isNight = hours >= 21 || hours < 6;
  
  if (isNight) {
    document.body.classList.add("night");
    document.body.classList.remove("day");
  } else {
    document.body.classList.add("day");
    document.body.classList.remove("night");
  }
}, [weatherData]);
  if (loading) return <div>Загрузка...</div>;
  if (!weatherData || !weatherData.city) return <div>Нет данных</div>;

  return (
    <div className="app">
        <DayAndWeek data ={weatherData.list[0]} />
        <CityWeatherToday data ={weatherData} />
        <WeatherForFive data = {weatherData} />
        <Humid data = {weatherData} />
        <FutureDays data = {weatherData} />
    </div>
  );
}
export default App;