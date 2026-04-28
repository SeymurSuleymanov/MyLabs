function FutureDays({ data }) {
    const daysArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const result = [];

    for (let i = 0; i < data.list.length && result.length < 6; i += 8) {
        const dayItems = data.list.slice(i, i + 8);
        
        const temps = dayItems.map(item => item.main.temp);
        const minTemp = Math.min(...temps);
        const maxTemp = Math.max(...temps);
        const maxTempItem = dayItems.reduce((max, item) => 
            item.main.temp > max.main.temp ? item : max, dayItems[0]
        );
        const iconCode = maxTempItem.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        
        const dateObject = new Date(dayItems[0].dt_txt);
        const dayName = daysArray[dateObject.getDay()];
        const dayMonth = dateObject.getDate();
        
        const minSign = minTemp > 0 ? "+" : "";
        const maxSign = maxTemp > 0 ? "+" : "";
        
        result.push(
            <div key={i} className="future-card">
                <div>{dayName}, {dayMonth}</div>
                <div>{maxSign}{Math.round(maxTemp)}° / {minSign}{Math.round(minTemp)}°</div>
                <img src={iconUrl} alt="weather-icon" />
            </div>
        );
    }
    
    return (
        <div className="future_days">
            <div className="days-list">
                {result}
            </div>
        </div>
    );
}

export default FutureDays;