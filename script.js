const apiKey = "ff04f8feacf2d3c9b1712075a626e087";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
function renderSearchHistory() {
  const recentBox = document.querySelector(".recent-searches");
  if (searchHistory.length === 0) {
    recentBox.style.display = "none";
  } else {
    recentBox.style.display = "block";
  }
  const historyList = document.querySelector(".history-list");

  historyList.innerHTML = "";

  searchHistory.forEach((city) => {
    const li = document.createElement("li");
    li.addEventListener("click", () => {
      console.log("Clicked:", city);

      searchBox.value = city;
      checkWeather(city);
    });

    const cityName = document.createElement("span");
    cityName.textContent = city;

    const deleteBtn = document.createElement("span");
    deleteBtn.innerHTML = "&times;";
    deleteBtn.classList.add("delete-city");

    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      searchHistory = searchHistory.filter((item) => item !== city);

      localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

      renderSearchHistory();
    });

    li.appendChild(cityName);
    li.appendChild(deleteBtn);

    historyList.appendChild(li);
  });
}
async function checkWeather(city) {
  document.body.style.cursor = "wait";
  const response = await fetch(
    apiUrl + encodeURIComponent(city) + `&appid=${apiKey}`,
  );
  if (response.status == 404) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
    document.body.style.cursor = "default";
  } else {
    let data = await response.json();
    localStorage.setItem("lastCity", city);
    city = city.trim();

    searchHistory = searchHistory.filter(
      (item) => item.toLowerCase() !== city.toLowerCase(),
    );

    searchHistory.unshift(
      city.charAt(0).toUpperCase() + city.slice(1).toLowerCase(),
    );

    searchHistory = searchHistory.slice(0, 4);

    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    renderSearchHistory();
    document.querySelector(".city").innerHTML =
      data.name + ", " + data.sys.country;
    document.querySelector(".description").innerHTML =
      data.weather[0].description;
    const now = new Date();

    document.querySelector(".updated-time").innerHTML =
      "Updated: " +
      now.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    document.querySelector(".temp").innerHTML =
      Math.round(data.main.temp) + "°C";

    document.querySelector(".humidity").innerHTML = data.main.humidity + " %";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
    document.querySelector(".feels-like").innerHTML =
      Math.round(data.main.feels_like) + "°C";
    if (data.weather[0].main == "Clouds") {
      weatherIcon.src = "images/clouds.png";
    } else if (data.weather[0].main == "Clear") {
      weatherIcon.src = "images/clear.png";
    } else if (data.weather[0].main == "Drizzle") {
      weatherIcon.src = "images/drizzle.png";
    } else if (data.weather[0].main == "Mist") {
      weatherIcon.src = "images/mist.png";
    } else if (data.weather[0].main == "Rain") {
      weatherIcon.src = "images/rain.png";
    } else if (data.weather[0].main == "Snow") {
      weatherIcon.src = "images/snow.png";
    }
    document.querySelector(".weather").style.display = "block";
    document.querySelector(".error").style.display = "none";
    document.body.style.cursor = "default";
  }
}

searchBtn.addEventListener("click", () => {
  if (searchBox.value.trim() !== "") {
    checkWeather(searchBox.value);
  }
});
searchBox.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkWeather(searchBox.value);
  }
});
const lastCity = localStorage.getItem("lastCity");

if (lastCity) {
  searchBox.value = lastCity;
  checkWeather(lastCity);
}
renderSearchHistory();
