package com.weather.weda.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ForecastResponse {
    private List<ForecastItem> list;
    private City city;

    public List<ForecastItem> getList() {
        return list;
    }

    public void setList(List<ForecastItem> list) {
        this.list = list;
    }

    public City getCity() {
        return city;
    }

    public void setCity(City city) {
        this.city = city;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ForecastItem {
        private long dt;
        private WeatherResponse.Main main;
        private List<WeatherResponse.Weather> weather;
        private WeatherResponse.Wind wind;

        public long getDt() {
            return dt;
        }

        public void setDt(long dt) {
            this.dt = dt;
        }

        public WeatherResponse.Main getMain() {
            return main;
        }

        public void setMain(WeatherResponse.Main main) {
            this.main = main;
        }

        public List<WeatherResponse.Weather> getWeather() {
            return weather;
        }

        public void setWeather(List<WeatherResponse.Weather> weather) {
            this.weather = weather;
        }

        public WeatherResponse.Wind getWind() {
            return wind;
        }

        public void setWind(WeatherResponse.Wind wind) {
            this.wind = wind;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class City {
        private String name;
        private String country;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getCountry() {
            return country;
        }

        public void setCountry(String country) {
            this.country = country;
        }
    }
}