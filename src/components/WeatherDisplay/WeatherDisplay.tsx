import React, { useState, useEffect } from "react";
import axios from "axios";
import { WiNightClear, WiDaySunny, WiRain, WiThunderstorm, WiSnow, WiCloudy, WiFog } from "react-icons/wi";
import './WeatherDisplay.css';

const unsplashAccessKey = 'fO3fdA1DzFS7KGC8m3j0oess--p20HKnIQC3JQvD2qs'; // Reemplaza con tu clave API de Unsplash

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
  }[];
  sys: {
    sunrise: number;
    sunset: number;
  };
}

const WeatherDisplay: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [city, setCity] = useState<string>("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string>("");
  const [isNight, setIsNight] = useState<boolean>(false);
  const [backgroundImage, setBackgroundImage] = useState<string>("defaultBackground.png");

  const toggleDarkMode = () => { // Función para alternar el modo nocturno
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const getSunriseAndSunset = async () => {
      try {
        const response = await axios.get<WeatherData>(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=da7a6371f2e1edbd76bc0de0c79b7c53&units=metric&lang=es`
        );
        const sunrise = response.data.sys.sunrise * 1000;
        const sunset = response.data.sys.sunset * 1000;
        const now = Date.now();
        setIsNight(now < sunrise || now > sunset);
      } catch (error) {
        console.log("Error fetching sunrise and sunset data", error);
      }
    };
    if (city) {
      getSunriseAndSunset();
    }
  }, [city]);

  useEffect(() => {
    const fetchBackgroundImage = async () => {
      try {
        // Combina la ciudad con 'day' o 'night' para la búsqueda de imágenes
        const keyword = `${city} ${isNight ? 'night' : 'day'}`;
        const response = await axios.get(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&client_id=${unsplashAccessKey}`);
        
        // Asegúrate de que hay resultados antes de intentar acceder a ellos
        if(response.data.results.length > 0) {
          setBackgroundImage(response.data.results[0].urls.regular);
        } else {
          // Puedes establecer una imagen predeterminada en caso de que no haya resultados
          setBackgroundImage("defaultBackground.png");
        }
      } catch (error) {
        console.error('Error fetching image from Unsplash', error);
        setBackgroundImage("defaultBackground.png"); // En caso de error, usa una imagen predeterminada
      }
    };
  
    if (city && weatherData) {
      fetchBackgroundImage();
    }
  }, [weatherData, isNight, city]);
  

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.get<WeatherData>(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=da7a6371f2e1edbd76bc0de0c79b7c53&units=metric&lang=en`
      );
      setWeatherData(response.data);
      setError("");
    } catch (error) {
      setError("Error fetching weather data");
      setWeatherData(null);
    }
  };

  return (
    <div className={`body ${darkMode ? 'dark-mode' : ''}`} style={{ backgroundImage: `url(${backgroundImage})` }}>
      
      <div className={`weather-container ${darkMode ? 'dark-mode' : ''}`}>
      <label className="switch">
            <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
            <span className="slider"></span>
          </label>
        <div className="weather-row">
          
          <div className="weather-col">
         

            <h1 className="weather-title">
              {isNight ? (
                <WiNightClear size={150} color="#f8d63c" />
              ) : (
                <WiDaySunny size={150} color="#f8d63c" />
              )}
            </h1>
            <strong><h1 className="Title">Clima Online</h1></strong>
            <br/>
            <form onSubmit={handleSubmit}>
              <div className="weather-form-group">
                <br/>
                <input
                  type="text"
                  className="weather-form-control"
                  placeholder="e.g. Mérida, Mexico"
                  value={city}
                  onChange={handleCityChange}
                />
              </div>
              <br/>
              <button type="submit">
                Discover
              </button>
              <br/>
              <br/>
            </form>
            {error && <p className="weather-error">{error}</p>}
            {weatherData && (
              <div>
                <h2>{weatherData.name}</h2>
                <div className={`weather-info ${darkMode ? 'dark-mode' : ''}`}>
                  <p>{weatherData.weather[0].description.charAt(0).toUpperCase() + weatherData.weather[0].description.slice(1)}</p>
                </div>
                <div className="weather-details">
                  <div className="weather-col">
                    <div className={`weather-box ${darkMode ? 'dark-mode' : ''}`}>
                      <h1>{weatherData.main.temp}°C</h1>
                      <h4 className="title-box">Temperature</h4>
                    </div>
                  </div>
                  <div className="weather-col ">
                  <div className={`weather-box ${darkMode ? 'dark-mode' : ''}`}>
                      <h1>{weatherData.main.humidity}%</h1>
                      <h4 className="title-box">Humidity</h4>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
  );
};

export default WeatherDisplay;