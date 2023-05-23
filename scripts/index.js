document.getElementById('search-bar').addEventListener('focus', () => {
  document.getElementById('search-expand').classList.add('expand')
})

document.getElementById('search-bar').addEventListener('blur', () => {
  document.getElementById('search-expand').classList.remove('expand')
})

function getWeatherData(latitude, longitude, locationName) {
  const apiKey = '....';
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


const searchInput = document.querySelector("#search-bar");
const suggestionList = document.getElementById('suggestionList');

const cities = [
  'Antwerp',
  'Mechelen',
  'Ghent',
  'Bruges',
  'Liège',
  'Namur',
  'Amsterdam',
  'Paris',
  'London',
  'Berlin',
  'New York',
  'Rome'
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
  return matrix[b.length][a.length];
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

