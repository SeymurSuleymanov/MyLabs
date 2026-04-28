function CityWeatherToday( {data} ) {
    const city = data.city.name;
    const temp = data.list[0].main.temp;
    const temp_today = Math.round(temp);

    const ar_url = data.list[0].weather[0].icon;
    const icon_url = `https://openweathermap.org/img/wn/${ar_url}@2x.png`;
    const sign = temp > 0 ? "+" : "-";

    return (
        <div className="city_temp">
            <h1>{city}</h1>
            <h2>{sign}{temp_today}°</h2>
            <img src={icon_url} alt="Weather state" />
        </div>
    );
}

export default CityWeatherToday;