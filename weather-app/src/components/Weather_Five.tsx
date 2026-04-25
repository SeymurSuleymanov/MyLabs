function WeatherForFive({ data }) {
    
    const fiveHours = data.list.slice(0, 5);
    
    return (
        <div className="forecast">
            <div className="forecast-list">
                {fiveHours.map((item, index) => {
                    const temp = Math.round(item.main.temp);
                    const sign = temp > 0 ? "+" : "";
                    const date = new Date(item.dt_txt);
                    const hours = date.getHours();
                    const timeLabel = index === 0 ? "Now" : `${hours}:00`;
                    
                    return (
                        <div key={index} className="forecast-card">
                            <div className="time">{timeLabel}</div>
                            <div className="temp">{sign}{temp}°C</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default WeatherForFive;