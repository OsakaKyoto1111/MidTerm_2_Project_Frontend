let isCelsius = true; // Boolean to keep track of whether the temperature unit is Celsius or Fahrenheit.

function toggleTempUnit() { // Function to toggle between Celsius and Fahrenheit.
    isCelsius = !isCelsius; // Toggle the isCelsius boolean.
    const unit = isCelsius ? 'Celsius (°C)' : 'Fahrenheit (°F)'; // Set the temperature unit string based on isCelsius.
    alert(`Temperature unit changed to ${unit}`); // Alert the user about the unit change.

    const city = document.getElementById('city').value; // Get the city name from the input field.
    if (city) { // If a city is entered, fetch the weather data again.
        getWeather();
    } else { // If no city is entered, only update the wind speed display if it exists.
        const windSpeedElement = document.querySelector('#weather-info p:nth-child(4)'); // Select the wind speed paragraph.
        if (windSpeedElement) { // If the wind speed element is found, update it.
            let windSpeed = parseFloat(windSpeedElement.textContent.split(' ')[2]); // Parse the existing wind speed value.
            if (isCelsius) { // If switching to Celsius, convert mph to m/s.
                windSpeed = (windSpeed / 2.237).toFixed(1); // Convert and round to one decimal place.
                windSpeedElement.textContent = `Wind Speed: ${windSpeed} m/s`; // Update the wind speed display to m/s.
            } else { // If switching to Fahrenheit, convert m/s to mph.
                windSpeed = (windSpeed * 2.237).toFixed(1); // Convert and round to one decimal place.
                windSpeedElement.textContent = `Wind Speed: ${windSpeed} mph`; // Update the wind speed display to mph.
            }
        }
    }
}

function getWeather() { // Function to fetch the weather data for the entered city.
    const apiKey = '31e53df5cfd327b66e6018d77c8036b1'; // API key for accessing the weather data.
    const city = document.getElementById('city').value; // Get the city name from the input field.
    const errorMessageElement = document.getElementById('error-message'); // Get the element for displaying error messages.

    errorMessageElement.textContent = ''; // Clear any previous error message.

    if (!city) { // If no city name is entered, show an error message.
        errorMessageElement.textContent = 'Please enter a city name';
        return; // Exit the function if no city name is provided.
    }

    const units = isCelsius ? 'metric' : 'imperial'; // Set the units based on the current temperature unit.
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`; // URL for the current weather data.
    const hourlyForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey}`; // URL for the hourly forecast data.

    fetch(currentWeatherUrl) // Fetch current weather data.
        .then(response => {
            if (!response.ok) { // If response is not successful...
                if (response.status === 404) { // If city is not found, show an appropriate error.
                    throw new Error('City not found');
                }
                throw new Error('Error fetching weather data'); // General error if fetch fails.
            }
            return response.json(); // Parse the JSON data from the response.
        })
        .then(data => {
            displayWeather(data); // Display the current weather data.
            return fetch(hourlyForecastUrl); // Fetch the hourly forecast data.
        })
        .then(response => {
            if (!response.ok) { // If response is not successful, throw an error.
                throw new Error('Error fetching hourly forecast');
            }
            return response.json(); // Parse the JSON data from the response.
        })
        .then(data => {
            displayHourlyForecast(data); // Display the hourly forecast data.
            displayDailyForecast(data); // Display the daily forecast data.
        })
        .catch(error => { // Handle any errors during the fetch process.
            console.error('Error fetching weather data:', error); // Log the error to the console.
            errorMessageElement.textContent = error.message; // Display the error message on the page.
        });
}

function displayWeather(data) { // Function to display current weather information.
    const tempDivInfo = document.getElementById('temp-div'); // Get the temperature display div.
    const weatherInfoDiv = document.getElementById('weather-info'); // Get the weather info div.
    const weatherIcon = document.getElementById('weather-icon'); // Get the weather icon element.

    tempDivInfo.innerHTML = ''; // Clear the temperature display.
    weatherInfoDiv.innerHTML = ''; // Clear the weather info display.

    const cityName = data.name; // Get the city name from the data.
    const temperature = Math.round(data.main.temp); // Get the temperature and round it to the nearest integer.
    const description = data.weather[0].description; // Get the weather description.
    const iconCode = data.weather[0].icon; // Get the weather icon code.
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // Construct the icon URL.

    let windSpeed = data.wind.speed; // Get the wind speed.
    if (!isCelsius) { // If in Fahrenheit, convert wind speed from m/s to mph.
        windSpeed = (windSpeed * 2.237).toFixed(1); // Convert and round to one decimal place.
    }

    tempDivInfo.innerHTML = `<p>Temperature: ${temperature}°${isCelsius ? 'C' : 'F'}</p>`; // Display temperature.
    weatherInfoDiv.innerHTML = `
        <p>City: ${cityName}</p>
        <p>Description: ${description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${windSpeed} ${isCelsius ? 'm/s' : 'mph'}</p>
    `; // Display city, description, humidity, and wind speed.
    weatherIcon.src = iconUrl; // Set the source of the weather icon.
    weatherIcon.alt = description; // Set the alt text of the icon to the weather description.
    showImage(); // Ensure the weather icon is visible.
}

function displayHourlyForecast(data) { // Function to display the hourly forecast.
    const hourlyForecastDiv = document.getElementById('hourly-forecast'); // Get the hourly forecast container.
    hourlyForecastDiv.innerHTML = '<h3>Hourly Forecast</h3>'; // Add a header to the hourly forecast section.

    data.list.slice(0, 5).forEach(forecast => { // Loop over the first 5 hours of forecast data.
        const date = new Date(forecast.dt * 1000); // Convert forecast time to a Date object.
        const temperature = Math.round(forecast.main.temp); // Get and round the temperature.
        const iconCode = forecast.weather[0].icon; // Get the icon code for the weather.
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // Construct the icon URL.

        const forecastDiv = document.createElement('div'); // Create a div for each forecast entry.
        forecastDiv.classList.add('hourly-forecast'); // Add a class for styling.
        forecastDiv.innerHTML = `
            <p>${date.getHours()}:00</p>
            <img src="${iconUrl}" alt="Weather icon" width="40">
            <p>${temperature}°${isCelsius ? 'C' : 'F'}</p>
        `; // Display the hour, icon, and temperature.
        hourlyForecastDiv.appendChild(forecastDiv); // Add the forecast div to the hourly forecast container.
    });
}

function displayDailyForecast(data) { // Function to display the daily forecast.
    const dailyForecastDiv = document.getElementById('daily-forecast'); // Get the daily forecast container.
    dailyForecastDiv.innerHTML = '<h3>Daily Forecast</h3>'; // Add a header to the daily forecast section.

    data.list.filter((_, index) => index % 8 === 0).forEach(forecast => { // Select every 8th entry for daily forecasts.
        const date = new Date(forecast.dt * 1000); // Convert forecast time to a Date object.
        const temperature = Math.round(forecast.main.temp); // Get and round the temperature.
        const description = forecast.weather[0].description; // Get the weather description.
        const iconCode = forecast.weather[0].icon; // Get the icon code for the weather.
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // Construct the icon URL.

        const forecastDiv = document.createElement('div'); // Create a div for each forecast entry.
        forecastDiv.classList.add('daily-forecast'); // Add a class for styling.
        forecastDiv.innerHTML = `
            <h4>${date.toDateString()}</h4>
            <img src="${iconUrl}" alt="Weather icon" width="40">
            <p>${description}</p>
            <p>${temperature}°${isCelsius ? 'C' : 'F'}</p>
        `; // Display the date, icon, description, and temperature.
        dailyForecastDiv.appendChild(forecastDiv); // Add the forecast div to the daily forecast container.
    });
}

function showImage() { // Function to display the weather icon.
    const weatherIcon = document.getElementById('weather-icon'); // Get the weather icon element.
    weatherIcon.style.display = 'block'; // Set the display style to 'block' to make it visible.
}
