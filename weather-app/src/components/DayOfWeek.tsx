function DayAndWeek({data}: {data: {dt_txt: string}}) {
    
    const dateString = data.dt_txt;
    const dateObject = new Date(dateString);
    
    const dayNumber = dateObject.getDay();
    const daysArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = daysArray[dayNumber];
    
    const dayMonth = dateObject.getDate();  
    
    return (
        <div className="Week_day">
            <h1>
            {dayName}, {dayMonth}
            </h1>
        </div>
    );
}

export default DayAndWeek;