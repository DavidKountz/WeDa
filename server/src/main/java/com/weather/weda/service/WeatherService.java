package com.weather.weda.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.weather.weda.exception.WeatherServiceException;
import com.weather.weda.model.WeatherResponse;

@Service
public class WeatherService {

    private static final String BASE_URL = "https://api.openweathermap.org/data/2.5";

    @Value("${weather.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public WeatherService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Cacheable(value = "weatherCache", key = "#city")
    public WeatherResponse getWeather(String city) {
        String url = String.format("%s/weather?q=%s&appid=%s&units=metric", 
            BASE_URL, city, apiKey);
        try {
            return restTemplate.getForObject(url, WeatherResponse.class);
        } catch (Exception e) {
            throw new WeatherServiceException("Error fetching weather data: " + e.getMessage());
        }
    }

    @Cacheable(value = "forecastCache", key = "#city")
    public Object getForecast(String city) {
        String url = String.format("%s/forecast?q=%s&appid=%s&units=metric", 
            BASE_URL, city, apiKey);
        try {
            return restTemplate.getForObject(url, Object.class);
        } catch (Exception e) {
            throw new WeatherServiceException("Error fetching forecast data: " + e.getMessage());
        }
    }
}