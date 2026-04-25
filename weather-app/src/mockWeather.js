// src/mockWeather.js
export default {
  "cod": "200",
  "message": 0,
  "cnt": 40,
  "list": [
    {
      "dt": 1647345600,
      "main": {
        "temp": 287.39,
        "feels_like": 286.38,
        "temp_min": 286.69,
        "temp_max": 287.39,
        "pressure": 1021,
        "sea_level": 1021,
        "grnd_level": 1018,
        "humidity": 58,
        "temp_kf": 0.7
      },
      "weather": [
        {
          "id": 803,
          "main": "Clouds",
          "description": "broken clouds",
          "icon": "04d"
        }
      ],
      "clouds": {
        "all": 71
      },
      "wind": {
        "speed": 3.08,
        "deg": 128,
        "gust": 4.3
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2022-03-15 12:00:00"
    },
    {
      "dt": 1647356400,
      "main": {
        "temp": 287.09,
        "feels_like": 286.13,
        "temp_min": 286.5,
        "temp_max": 287.09,
        "pressure": 1021,
        "sea_level": 1021,
        "grnd_level": 1016,
        "humidity": 61,
        "temp_kf": 0.59
      },
      "weather": [
        {
          "id": 803,
          "main": "Clouds",
          "description": "broken clouds",
          "icon": "04d"
        }
      ],
      "clouds": {
        "all": 81
      },
      "wind": {
        "speed": 3.28,
        "deg": 168,
        "gust": 3.96
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2022-03-15 15:00:00"
    }
    // Можешь оставить ещё пару записей, но для начала хватит
  ],
  "city": {
    "id": 2643743,
    "name": "London",
    "coord": {
      "lat": 51.5085,
      "lon": -0.1257
    },
    "country": "GB",
    "population": 1000000,
    "timezone": 0,
    "sunrise": 1647324902,
    "sunset": 1647367441
  }
};