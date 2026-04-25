function Humid( {data} ) {
    const humid = data.list[0].main.humidity;
    const wind = data.list[0].wind.speed;
    const air_pressure = data.list[0].main.pressure;
    const pressureMmHg = Math.round(air_pressure * 0.750062);
    const UV = data.list[0].pop;

    return (
        <div className="weather-details">
            <div className="detail">
                <span>Humidity </span>
                <span>{humid}%</span>
            </div>
            <div className="detail">
                <span>Wind </span>
                <span>{wind} м/с</span>
            </div>
            <div className="detail">
                <span>Air Pressure </span>
                <span>{pressureMmHg} mm</span>
            </div>
            <div className="detail">
                <span>UV </span>
                <span>{UV}</span>
            </div>
        </div>
    );
}

export default Humid;