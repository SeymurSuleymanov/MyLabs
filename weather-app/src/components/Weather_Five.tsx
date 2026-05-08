function WeatherForFive({ data }) {
    const fiveHours = data.list.slice(0, 5);
    const timezoneOffset = data.city.timezone; 
    
    return (
        <div className="forecast">
            <div className="forecast-list">
                {fiveHours.map((item, index) => {
                    const temp = Math.round(item.main.temp);
                    const sign = temp > 0 ? "+" : "";
                    
                    const utcDate = new Date(item.dt_txt);
                    const localDate = new Date(utcDate.getTime() + timezoneOffset * 1000);
                    const hours = localDate.getUTCHours(); 
                    
                    const timeLabel = index === 0 ? "Now" : `${hours}:00`;
                    const iconCode = item.weather[0].icon;
                    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
                    
                    return (
                        <div key={index} className="forecast-card">
                            <div className="time">{timeLabel}</div>
                            <div className="temp">{sign}{temp}°C</div>
                            <img src={iconUrl} alt="Weather icon" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
export default WeatherForFive;