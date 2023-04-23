document.getElementById('search-bar').addEventListener('focus', () => {
  document.getElementById('search-expand').classList.add('expand')
})

document.getElementById('search-bar').addEventListener('blur', () => {
  document.getElementById('search-expand').classList.remove('expand')
})

function getWeatherData(latitude, longitude, locationName) {
  const apiKey = '6f07e888433a7ac0d0fecb73ca6a0127';
  let url;
  if (latitude && longitude) {
    url = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  } else {
    url = `http://api.openweathermap.org/data/2.5/forecast?q=${locationName}&units=metric&appid=${apiKey}`;
  }
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      const weatherData = {
        temperature: data.list[0].main.temp,
        location: data.city.name,
      };
      return weatherData;
    });
}

function updateUI(weatherData) {
  const temperature = document.querySelector("#temperature");
  const location = document.querySelector("#location");

  temperature.textContent = `${weatherData.temperature}°C`;
  location.textContent = weatherData.location;
}

window.addEventListener("load", () => {
  navigator.geolocation.getCurrentPosition(position => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    getWeatherData(latitude, longitude)
      .then(weatherData => {
        updateUI(weatherData);
      })
      .catch(error => {
        console.log(error);
      });
  });
});

const searchBar = document.querySelector("#search-bar");

searchBar.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    const location = searchBar.value;
  if (location === "") {
    navigator.geolocation.getCurrentPosition(position => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      getWeatherData(latitude, longitude)
        .then(weatherData => {
          updateUI(weatherData);
        })
        .catch(error => {
          console.log(error);
        });
    });
  } else {
    getWeatherData(null, null, location)
      .then(weatherData => {
        updateUI(weatherData);
      })
      .catch(error => {
        console.log(error);
      });
  }
  }
});
