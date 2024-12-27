import React, { useEffect, useRef, useState } from 'react'
import './Weather.css'
import search_icon from '../assets/search.png'
import clear_icon from '../assets/clear.png'
import cloud_icon from '../assets/cloud.png'
import drizzle_icon from '../assets/drizzle.png'
import rain_icon from '../assets/rain.png'
import snow_icon from '../assets/snow.png'
import wind_icon from '../assets/wind.png'
import humidity_icon from '../assets/humidity.png'


const Weather = () => {

    const inputRef = useRef()
    const [weatherData, setWeatherData] = useState(false);
    const [forecastData, setForecastData] = useState([]);
    const [backgroundColor, setBackgroundColor] = useState('#010101')

    const allIcons = {
        "01d" : clear_icon,
        "01n" : clear_icon,
        "02d" : cloud_icon,
        "02n" : cloud_icon,
        "03d" : cloud_icon,
        "03n" : cloud_icon,
        "04d" : drizzle_icon,
        "04n" : drizzle_icon,
        "09d" : rain_icon,
        "09n" : rain_icon,
        "10d" : rain_icon,
        "10n" : rain_icon,
        "13d" : snow_icon,
        "13n" : snow_icon,
    }

    const weatherGradients = {
        "01d": "linear-gradient(45deg, #fff, #ffcc00, #ffcc00)", // Sunny day
        "01n": "linear-gradient(45deg, #000, #2c3e50, #2c3e50)", // Clear night
        "02d": "linear-gradient(45deg, #fff, #a3c9f8, #a3c9f8)", // Few clouds day
        "02n": "linear-gradient(45deg, #000, #34495e, #34495e)", // Few clouds night
        "03d": "linear-gradient(45deg, #fff, #d1d1d1, #d1d1d1)", // Scattered clouds day
        "03n": "linear-gradient(45deg, #000, #7f8c8d, #7f8c8d)", // Scattered clouds night
        "04d": "linear-gradient(45deg, #fff, #7f8c8d, #7f8c8d)", // Broken clouds day
        "04n": "linear-gradient(45deg, #000, #34495e, #34495e)", // Broken clouds night
        "09d": "linear-gradient(45deg, #fff, #5dade2, #5dade2)", // Shower rain day
        "09n": "linear-gradient(45deg, #000, #2980b9, #2980b9)", // Shower rain night
        "10d": "linear-gradient(45deg, #fff, #3498db, #3498db)", // Rain day
        "10n": "linear-gradient(45deg, #000, #2e4053, #2e4053)", // Rain night
        "13d": "linear-gradient(45deg, #fff, #e8f8f5, #e8f8f5)", // Snow day
        "13n": "linear-gradient(45deg, #000, #bdc3c7, #bdc3c7)", // Snow night
    };
       

    const search = async (city) => {
        if (city === "") {
            alert("Enter city name");
            return;
        }
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
    
            const [currentResponse, forecastResponse] = await Promise.all([
                fetch(url),
                fetch(forecastUrl)
            ]);
    
            const currentData = await currentResponse.json();
            const forecastDataJson = await forecastResponse.json();
    
            if (!currentResponse.ok || !forecastResponse.ok) {
                alert(currentData.message || "Error fetching forecast");
                return;
            }
    
            const icon = currentData.weather[0].icon;
            const iconImage = allIcons[icon] || clear_icon;
            backgroundColorUpdate(icon);
    
            setWeatherData({
                humidity: currentData.main.humidity,
                windSpeed: currentData.wind.speed,
                temperature: Math.floor(currentData.main.temp),
                location: currentData.name,
                icon: iconImage,
            });
    
            const forecast = forecastDataJson.list.filter((_, index) => index % 8 === 0).map((item) => ({
                date: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
                temperature: Math.floor(item.main.temp),
                icon: allIcons[item.weather[0].icon] || clear_icon,
            }));
    
            setForecastData(forecast);
        } catch (error) {
            console.error("Error fetching weather data:", error);
            setWeatherData(false);
        }
    };      

    useEffect(()=>{
        search("London");
    },[])

    function backgroundColorUpdate(icon) {
        if (weatherGradients[icon]) {
            setBackgroundColor(weatherGradients[icon]);
        }
    }

  return (
    <div className='weather'>
        <div className='weather-comb'>
            <div className="weather-sidebar" style={{ backgroundImage: backgroundColor }}>
                <div className="search-bar">
                    <input ref = {inputRef} type='text' placeholder='Search'/>
                    <img src={search_icon} alt=''onClick={()=>search(inputRef.current.value)}/>
                </div>
                {weatherData?<>
                <p className='location'>{weatherData.location}</p>
                <img src={weatherData.icon} alt="" className='weather-icon'/>
                <p className='temperature'>{weatherData.temperature}°c</p>
                <div className="weather-data">
                    <div className="col">
                        <img src={humidity_icon} alt="" />
                        <div>
                            <p>{weatherData.humidity} %</p>
                        </div>
                    </div>
                    <div className="col">
                        <img src={wind_icon} alt="" />
                        <div>
                            <p>{weatherData.windSpeed} Km/h</p>
                        </div>
                    </div>
                </div>
                <div className="forecast-section">
                    <div className="forecast-cards">
                        {forecastData.map((day, index) => (
                            <div key={index} className="forecast-card">
                                <p>{day.date}</p>
                                <img src={day.icon} alt="Weather icon" />
                                <p>{day.temperature}°C</p>
                            </div>
                        ))}
                    </div>
                </div>

                </>:<></>}
            </div>

            <div className="weather-main">
            <p className='temperature-main'>{weatherData.temperature}°c</p>
            <p className='location-main'>{weatherData.location}</p>
            </div>
        </div>

    </div>
  )
}

export default Weather