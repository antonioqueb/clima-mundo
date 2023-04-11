import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { WiNightClear } from "react-icons/wi";
import { WiDaySunny, WiRain, WiThunderstorm, WiSnow, WiCloudy, WiFog } from "react-icons/wi";


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
  const weatherIcons = {
        Clear: <WiDaySunny size={60} color="#f8d63c" />,
        Rain: <WiRain size={60} color="#a4b0be" />,
        Thunderstorm: <WiThunderstorm size={60} color="#f6c23e" />,
        Snow: <WiSnow size={60} color="#1abc9c" />,
        Clouds: <WiCloudy size={60} color="#95a5a6" />,
        Mist: <WiFog size={60} color="#636e72" />,
      };
  const [city, setCity] = useState<string>("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string>("");
  const [isNight, setIsNight] = useState<boolean>(false);

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

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.get<WeatherData>(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=da7a6371f2e1edbd76bc0de0c79b7c53&units=metric&lang=es`
      );
      setWeatherData(response.data);
      setError("");
    } catch (error) {
      setError("Error fetching weather data");
      setWeatherData(null);
    }
  };

  return (
    <Container className="text-center my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h1 className="mb-4">
            {isNight ? (
              <WiNightClear size={150} color="#f8d63c" />
            ) : (
              <WiDaySunny size={150} color="#f8d63c" />
            )}
          </h1>
          <h1 className="mb-4">Earth Therm</h1>
          <br/>
          
          <Form onSubmit={handleSubmit} className="mb-4">
            <Form.Group>
              <Form.Label className="font-weight-bold">Ingresa tu ciudad...</Form.Label>
              <br/>
              
              <Form.Control
                type="text"
                placeholder="e.g. Campeche, Mexico"
                value={city}
                onChange={handleCityChange}
              />
            </Form.Group>
            <br/>
           
            <Button variant="primary" type="submit">
              Descubrir
            </Button>
            <br/>
            <br/>
          </Form>
          {error && <p className="text-danger">{error}</p>}
          {weatherData && (
            <div>
            <h2 className="mt-4 mb-3">{weatherData.name}</h2>
            <Col className="text-center mb-3">
                <p className="font-weight-bold">{weatherData.weather[0].description.charAt(0).toUpperCase() + weatherData.weather[0].description.slice(1)}</p>

                </Col>
                <Container className="my-5">
                <Row className="justify-content-center">
                    <Col md={6} className="text-center mb-3">
                    <div className="rounded p-3" style={{ backgroundColor: "#fcdd3c" }}>
                        <h1 className="display-3 font-weight-bold">{weatherData.main.temp}°C</h1>
                        <h4 className="text-secondary mb-0">Temperatura</h4>
                    </div>
                    </Col>
                    <Col md={6} className="text-center mb-3">
                    <div className="rounded p-3" style={{ backgroundColor: "#f0a8c1" }}>
                        <h1 className="display-3 font-weight-bold">{weatherData.main.humidity}%</h1>
                        <h4 className="text-secondary mb-0">Humedad</h4>
                    </div>
                    </Col>
                </Row>
                </Container>




          </div>
        )}
      </Col>
    </Row>
    <footer className="text-center  py-3 mt-auto">
        <p>
          Creado por <a href="https://github.com/antonioqueb">Antonio Queb</a>
        </p>
      </footer>
  </Container>
  
);
};

export default WeatherDisplay;

