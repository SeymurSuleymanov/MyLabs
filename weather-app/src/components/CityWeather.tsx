function CityWeatherToday( {data} ) {
    const city = data.city.name;
    const temp = data.list[0].main.temp;
    const temp_today = Math.round(temp);
    const sign = temp > 0 ? "+" : "-";

    return (
        <div className="city_temp">
            <h1>{city}</h1>
            <h2>{sign}{temp_today}°</h2>
        </div>
    );
}

export default CityWeatherToday;