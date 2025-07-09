const ipElem = document.getElementById('ip');
const cityElem = document.getElementById('city');
const regionElem = document.getElementById('region');
const countryElem = document.getElementById('country');
const postalElem = document.getElementById('postal');
const ispElem = document.getElementById('isp');
const timezoneElem = document.getElementById('timezone');
const localtimeElem = document.getElementById('localtime');
const currencyElem = document.getElementById('currency');
const orgElem = document.getElementById('org');
const langElem = document.getElementById('languages');
const ipTypeElem = document.getElementById('ip_type');
const asnElem = document.getElementById('asn');
const weatherElem = document.getElementById('weather');
const osElem = document.getElementById('os_info');
const browserElem = document.getElementById('browser_info');
const copyBtn = document.getElementById('copy');

function getBrowserInfo() {
  const ua = navigator.userAgent;
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  if (ua.includes("Edg")) return "Edge";
  return "未知";
}

function getOSInfo() {
  const platform = navigator.platform.toLowerCase();
  if (platform.includes("win")) return "Windows";
  if (platform.includes("mac")) return "macOS";
  if (platform.includes("linux")) return "Linux";
  if (/android/.test(navigator.userAgent.toLowerCase())) return "Android";
  if (/iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())) return "iOS";
  return "未知";
}

function updateMap(lat, lon) {
  const map = L.map('map').setView([lat, lon], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; Leaflet',
    maxZoom: 18,
  }).addTo(map);
  L.marker([lat, lon]).addTo(map);
}

function fetchIPData() {
  fetch('https://ipapi.co/json/')
    .then(res => res.json())
    .then(data => {
      ipElem.textContent = data.ip;
      cityElem.textContent = data.city;
      regionElem.textContent = data.region;
      countryElem.textContent = data.country_name;
      postalElem.textContent = data.postal;
      ispElem.textContent = data.org;
      timezoneElem.textContent = data.timezone;
      localtimeElem.textContent = new Date().toLocaleString("zh-CN", { timeZone: data.timezone });
      currencyElem.textContent = data.currency;
      orgElem.textContent = data.org;
      langElem.textContent = data.languages;
      ipTypeElem.textContent = data.version;
      asnElem.textContent = data.asn;
      osElem.textContent = getOSInfo();
      browserElem.textContent = getBrowserInfo();
      updateMap(data.latitude, data.longitude);
      fetchWeather(data.latitude, data.longitude);
    });
}

function fetchWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.current && data.current.temperature_2m !== undefined) {
        weatherElem.textContent = `${data.current.temperature_2m}°C`;
      } else {
        weatherElem.textContent = '暂无数据';
      }
    })
    .catch(() => {
      weatherElem.textContent = '获取失败';
    });
}

// 复制按钮
copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(ipElem.textContent).then(() => {
    copyBtn.textContent = "✅";
    setTimeout(() => {
      copyBtn.textContent = "📋";
    }, 1000);
  });
});

fetchIPData();
