const searchBar = document.getElementById("search-bar");

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
        temp_min: data.list[0].main.temp_min,
<<<<<<< HEAD
        temp_max: data.list[0].main.temp_max,
        pressure: data.list[0].main.pressure,
        humidity: data.list[0].main.humidity,
        feelslike: data.list[0].main.feels_like,
        windspeed: data.list[0].wind.speed
=======
        temp_max: data.list[0].main.temp_max
>>>>>>> 65565f504292d9703ca638655e21b52dd5c4b998
      };
      return weatherData;
    });
}


function updateUI(weatherData) {
  const temperature = document.getElementById("temperature");
  const location = document.getElementById("location");
  const tempRange = document.getElementById("temp0Range");
  const pressure = document.getElementById("pressure");
  const humidity = document.getElementById("humidity");
  const feelsLike = document.getElementById("feelslike");
  const wind = document.getElementById("wind")

  temperature.textContent = `${weatherData.temperature}°C`;
  location.textContent = weatherData.location;
  pressure.textContent = `${weatherData.pressure} Pa`
  tempRange.textContent = "Today " + weatherData.temp_min + " - " + weatherData.temp_max;
  humidity.textContent = weatherData.humidity;
  feelsLike.textContent = weatherData.feelslike;
  wind.textContent = weatherData.windspeed + " km/h";
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

<<<<<<< HEAD
=======
const searchBar = document.getElementById("search-bar");
>>>>>>> 65565f504292d9703ca638655e21b52dd5c4b998

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


const searchInput = document.getElementById("search-bar");
const suggestionList = document.getElementById('suggestionList');

const cities = [
  'Aachen',
  'Antwerp',
  'Amsterdam',
  'Brussels',
  'Berlin',
  'Mechelen',
  'Ghent',
  'Bruges',
  'Liège',
  'Namur',
  'Paris',
  'London',
  'Berlin',
  'New York',
  'Rome',
  'Stockholm'
];

function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = Array.from(Array(b.length + 1), () => Array(a.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) {
    matrix[0][i] = i;
  }
  for (let j = 0; j <= b.length; j++) {
    matrix[j][0] = j;
  }
  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[j][i] = matrix[j - 1][i - 1];
      } else {
        matrix[j][i] = Math.min(
          matrix[j - 1][i] + 1,
          matrix[j][i - 1] + 1,
          matrix[j - 1][i - 1] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length]
}

searchInput.addEventListener('keyup', () => {
  const searchText = searchInput.value;
  if (searchText.length > 1) { 
    suggestionList.innerHTML = ''; 
    const matches = cities.filter(city => levenshteinDistance(searchText.toLowerCase(), city.toLowerCase()) < 5); 
    matches.forEach(city => {
      const suggestionItem = document.createElement('div');
      suggestionItem.textContent = city;
      suggestionItem.classList.add('suggestion-item');
      suggestionItem.addEventListener('click', () => {
        
        searchInput.value = city;
        suggestionList.innerHTML = '';
        searchInput.dispatchEvent(new Event('search'));
      });
      suggestionList.appendChild(suggestionItem);
    });
  } else {
    suggestionList.innerHTML = ''; 
  }
});

