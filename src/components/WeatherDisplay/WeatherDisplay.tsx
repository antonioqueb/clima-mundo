import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { WiDaySunny } from "react-icons/wi";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
  }[];
}

const WeatherDisplay: React.FC = () => {
  const [city, setCity] = useState<string>("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string>("");

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
            <WiDaySunny size={60} color="#f8d63c" /> 
          </h1>
          <h1 className="mb-4">Wather-Lite</h1>
          <Form onSubmit={handleSubmit} className="mb-4">
            <Form.Group>
            <Form.Label className="font-weight-bold">Ingresa la ciudad...</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Campeche, Mexico"
                value={city}
                onChange={handleCityChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Descubrir
            </Button>
          </Form>
          {error && <p className="text-danger">{error}</p>}
          {weatherData && (
            <div>
              <h2 className="mt-4 mb-3">{weatherData.name}</h2>
              <p className="font-weight-bold mb-0">{weatherData.weather[0].description}</p>
              <p className="my-3">
                Temperatura: <span className="font-weight-bold">{weatherData.main.temp}°C</span>
              </p>
              <p className="mb-3">
                Humedad: <span className="font-weight-bold">{weatherData.main.humidity}%</span>
              </p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default WeatherDisplay;
