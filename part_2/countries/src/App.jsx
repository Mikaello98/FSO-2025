import { useEffect, useState } from "react"

const api_key = import.meta.env.VITE_SOME_KEY

export default function App() {
  const [query, setQuery] = useState("")
  const [countries, setCountries] = useState([])
  const [filtered, setFiltered] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)
  const [loadingWeather, setLoadingWeather] = useState(false)
  const [weatherError, setWeatherError] = useState(null)

  useEffect(() => {
    fetch("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((res) => res.json())
      .then((data) => setCountries(data))
  }, [])

  useEffect(() => {
    if (query.trim() === "") {
      setFiltered([]);
      setSelectedCountry(null)
      setWeather(null)
      return
    }

    const matches = countries.filter((country) =>
      country.name.common.toLowerCase().includes(query.toLowerCase())
    )

    setFiltered(matches)
    if (matches.length === 1) {
      setSelectedCountry(matches[0])
      fetchWeather(matches[0].capital?.[0])
    } else {
      setSelectedCountry(null)
      setWeather(null)
      setWeatherError(null)
    }
  }, [query, countries]);

  const handleShow = (country) => {
    setSelectedCountry(country)
    fetchWeather(country.capital?.[0])
  }

  const fetchWeather = (city) => {
    if (!city) return
    setLoadingWeather(true)
    setWeather(null)
    setWeatherError(null)

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`
    )
      .then((res) => res.json())
      .then((data) => {
        setLoadingWeather(false)
        if (data.cod === 200) {
          setWeather({
            temp: data.main.temp,
            wind: data.wind.speed,
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
            description: data.weather[0].description,
          })
        } else {
          setWeatherError("Weather data unavailable")
        }
      })
      .catch(() => {
        setLoadingWeather(false);
        setWeatherError("Error fetching weather");
      })
  }

  const countryToShow = selectedCountry

  return (
    <div>
      <h1>Country Information</h1>
      <input
        type="text"
        placeholder="Search for a country..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {filtered.length > 10 && <p>Too many matches, specify another filter</p>}

      {filtered.length <= 10 && filtered.length > 1 && (
        <ul>
          {filtered.map((country) => (
            <li key={country.cca3}>
              {country.name.common}{" "}
              <button onClick={() => handleShow(country)}>Show</button>
            </li>
          ))}
        </ul>
      )}

      {countryToShow && (
        <div>
          <h2>{countryToShow.name.common}</h2>
          <p>Capital: {countryToShow.capital?.[0] || "N/A"}</p>
          <p>Population: {countryToShow.population.toLocaleString()}</p>

          <h3>Languages</h3>
          <ul>
            {Object.values(countryToShow.languages || {}).map((lang, i) => (
              <li key={i}>{lang}</li>
            ))}
          </ul>

          <img
            src={countryToShow.flags.png}
            alt={countryToShow.name.common}
            style={{ width: "150px", marginTop: "10px" }}
          />

          <div>
            <h3>Weather in {countryToShow.capital?.[0]}</h3>
            {loadingWeather && <p>Loading weather...</p>}
            {weather && (
              <>
                <p>Temperature: {weather.temp} °C</p>
                <p>Wind: {weather.wind} m/s</p>
                <img src={weather.icon} alt={weather.description} />
                <p>{weather.description}</p>
              </>
            )}
            {weatherError && <p>{weatherError}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
