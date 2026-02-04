function updateTime() {
  const now = new Date();
  const options = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Europe/Moscow'
  };
  return now.toLocaleString('en-EN', options);
}

async function updateWeather() {
  const lat = 68.97; // Мурманск latitude
  const lon = 33.08; // Мурманск longitude

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
    );
    const data = await response.json();

    const temp = data.current.temperature_2m.toFixed(1);
    const wind = data.current.wind_speed_10m.toFixed(1);
    const humidity = data.current.relative_humidity_2m;
    const weatherCode = data.current.weather_code;

    const weatherIcon = getWeatherIcon(weatherCode);

    const weatherDiv = document.querySelector('.weather');
    weatherDiv.innerHTML = `𝙼𝚞𝚛𝚖𝚊𝚗𝚜𝚔 ${temp}°C ${weatherIcon} ${humidity}% <i class="fas fa-wind"></i> ${wind} м/с • ${updateTime()}`;
  } catch (error) {
    console.error('Ошибка загрузки погоды:', error);
    document.querySelector('.weather').innerHTML = '𝙼𝚞𝚛𝚖𝚊𝚗𝚜𝚔: weather widget error :( • ' + updateTime();
  }
}

function getWeatherIcon(code) {
  if ([0].includes(code)) return '<i class="fas fa-sun"></i>';
  if ([1, 2].includes(code)) return '<i class="fas fa-cloud-sun"></i>';
  if ([3].includes(code)) return '<i class="fas fa-cloud"></i>';
  if ([45, 48].includes(code)) return '<i class="fas fa-smog"></i>';
  if ([51, 53, 55, 56, 57].includes(code)) return '<i class="fas fa-cloud-rain"></i>';
  if ([61, 63, 65, 66, 67].includes(code)) return '<i class="fas fa-cloud-showers-heavy"></i>';
  if ([71, 73, 75, 77].includes(code)) return '<i class="fas fa-snowflake"></i>';
  if ([80, 81, 82].includes(code)) return '<i class="fas fa-cloud-showers-heavy"></i>';
  if ([95, 96, 99].includes(code)) return '<i class="fas fa-bolt"></i>';
  return '<i class="fas fa-question"></i>';
}

updateWeather();
setInterval(updateWeather, 10 * 60 * 1000); // Обновление погоды каждые 10 минут

// Обновление времени каждую секунду
setInterval(() => {
  const weatherDiv = document.querySelector('.weather');
  if (weatherDiv.innerHTML.includes('•')) {
    const parts = weatherDiv.innerHTML.split(' • ');
    weatherDiv.innerHTML = `${parts[0]} • ${updateTime()}`;
  }
}, 1000);