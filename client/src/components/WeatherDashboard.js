import React, { useState } from 'react';
import { 
  Search, Wind, Droplets, ArrowDown, 
  Sunrise, Sunset, MapPin, 
  ThermometerSun, ThermometerSnowflake, 
  CloudRain, CloudSnow, CloudSun, CloudMoon
} from 'lucide-react';

const createCache = () => {
  const cache = {
    get: (key) => {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      // Check if cache is still valid (less than 30 minutes old)
      if (Date.now() - parsed.timestamp > 30 * 60 * 1000) {
        localStorage.removeItem(key);
        return null;
      }
      
      return parsed.data;
    },
    set: (key, data) => {
      const item = {
        timestamp: Date.now(),
        data: data
      };
      localStorage.setItem(key, JSON.stringify(item));
    },
    clear: (key) => {
      localStorage.removeItem(key);
    }
  };
  
  return cache;
};

const WeatherDashboard = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('fahrenheit');
  const [loading, setLoading] = useState(false);
  
  const cache = createCache();

  // Fetch weather by city name
  const fetchWeather = async (e) => {
    e.preventDefault();
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      // Check cache first
      const cacheKey = `weather_${city.toLowerCase()}`;
      const cachedData = cache.get(cacheKey);
      
      if (cachedData) {
        setWeather(cachedData.weather);
        setForecast(cachedData.forecast);
        setLoading(false);
        return;
      }
      
      // Fetch new data if not in cache
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      if (!response.ok) throw new Error('City not found');
      const data = await response.json();
      setWeather(data);
      
      // Fetch 5-day forecast
      const forecastResponse = await fetch(`/api/weather/forecast?city=${encodeURIComponent(city)}`);
      
      let forecastData = null;
      
      if (forecastResponse.ok) {
        forecastData = await forecastResponse.json();
        setForecast(forecastData);
      }
      
      
      // Cache the results
      cache.set(cacheKey, {
        weather: data,
        forecast: forecastData,
      });
    } catch (err) {
      setError(err.message);

    } finally {
      setLoading(false);

    }
  };

  // Celsius conversion
  const convertTemp = (temp) => {
    return unit === 'fahrenheit' ? (temp * 9/5) + 32 : temp;
  };

  // Weather icon
  const getWeatherIcon = (condition) => {
    const iconMap = {
      'clear': <CloudSun className="w-16 h-16 text-yellow-400" />,
      'clouds': <CloudMoon className="w-16 h-16 text-gray-400" />,
      'rain': <CloudRain className="w-16 h-16 text-blue-500" />,
      'snow': <CloudSnow className="w-16 h-16 text-white" />,
      'thunderstorm': <CloudRain className="w-16 h-16 text-purple-500" />
    };
    return iconMap[condition.toLowerCase()] || <CloudSun className="w-16 h-16 text-yellow-400" />;
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extralight">Weather Dashboard</h1>
          <div className="flex items-center space-x-4">
            <form onSubmit={fetchWeather} className="relative">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Search city..."
                className="bg-gray-800 text-white px-4 py-2 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                disabled={loading}
              >
                <Search />
              </button>
            </form>
            <button 
              onClick={() => setUnit(unit === 'celsius' ? 'fahrenheit' : 'celsius')}
              className="bg-gray-800 px-4 py-2 rounded-full hover:bg-gray-700"
            >
              {unit === 'celsius' ? '°C' : '°F'}
            </button>
          </div>
        </div>

        {error && (
          <div className="text-center text-red-400 mb-4">{error}</div>
        )}
        
        {loading && (
          <div className="text-center mb-4">Loading weather data...</div>
        )}

        {!weather && !loading && !error && (
          <div className="text-center p-10">
            <h2 className="text-2xl mb-4">Welcome to Weather Dashboard</h2>
            <p className="text-gray-400">Enter a city name to get weather information</p>
          </div>
        )}

        {weather && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Current Weather */}
            <div className="md:col-span-2 bg-gray-800 rounded-2xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-light flex items-center gap-2">
                    <MapPin /> {weather.name}
                  </h2>
                  <p className="text-gray-400 capitalize">
                    {weather.weather[0].description}
                  </p>
                </div>
                {getWeatherIcon(weather.weather[0].main)}
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-5xl font-thin">
                    {Math.round(convertTemp(weather.main.temp))}°
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <ThermometerSun className="text-red-400" />
                    <span>High: {Math.round(convertTemp(weather.main.temp_max))}°</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThermometerSnowflake className="text-blue-400" />
                    <span>Low: {Math.round(convertTemp(weather.main.temp_min))}°</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Wind className="text-blue-400" />
                    <span>Wind: {weather.wind.speed} m/s</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="text-blue-400" />
                    <span>Humidity: {weather.main.humidity}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowDown className="text-blue-400" />
                    <span>Pressure: {weather.main.pressure} hPa</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Sunrise className="text-yellow-400" />
                    <span>Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sunset className="text-orange-400" />
                    <span>Sunset: {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </div>


            {/* 5-Day Forecast */}
            {forecast && (
              <div className="md:col-span-3 bg-gray-800 rounded-2xl p-6 shadow-2xl">
                <h3 className="text-2xl font-light mb-6">5-Day Forecast</h3>
                <div className="grid grid-cols-5 gap-4">
                  {forecast.list.filter((item, index) => index % 8 === 0).map((day, index) => (
                    <div key={index} className="text-center bg-gray-700 rounded-xl p-4">
                      <div className="font-light mb-2">
                        {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      {getWeatherIcon(day.weather[0].main)}
                      <div className="text-xl font-thin mt-2">
                        {Math.round(convertTemp(day.main.temp))}°
                      </div>
                      <div className="text-xs text-gray-400 capitalize mt-1">
                        {day.weather[0].description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherDashboard;