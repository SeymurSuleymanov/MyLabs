import { useState, useEffect } from "react";
import DayAndWeek from "./components/DayOfWeek";
import CityWeatherToday from "./components/CityWeather"
import WeatherForFive from "./components/Weather_Five"
import Humid from "./components/Humid"
import FutureDays from "./components/FutureDay"

const TOKEN_API = "c60df21b68b58bf755c7cf4825bb824e";

function App() {
  const [city, setCity] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const example_cty = "Barnaul";

  useEffect(() => {
    async function getWeather() {
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${example_cty}&limit=1&appid=${TOKEN_API}`;
      const geoResponse = await fetch(geoUrl);
      const geoData = await geoResponse.json();
      console.log("Ответ API:", geoData);
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