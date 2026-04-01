const apiKey = "12e66aee9a7b5c3141fc50e34412d03b"; // Apni API Key yahan likhein

// 1. Initial Load
window.onload = () => {
    checkWeather("Malakand");
    new QRCode(document.getElementById("qrcode"), {
        text: window.location.href,
        width: 100, height: 100
    });
};

// 2. Fetch Weather
async function checkWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.cod === 200) {
            updateUI(data);
        } else {
            alert("Shehar nahi mil saka!");
        }
    } catch (e) { console.error(e); }
}

// 3. Update UI
function updateUI(data) {
    document.getElementById("cityName").innerText = data.name;
    document.getElementById("temp").innerText = Math.round(data.main.temp);
    document.getElementById("description").innerText = data.weather[0].main;
    document.getElementById("humidity").innerText = data.main.humidity + "%";
    document.getElementById("windSpeed").innerText = data.wind.speed + " km/h";
    
    // UV Index Mock
    const uvValue = (data.main.temp / 8).toFixed(1);
    document.getElementById("uvIndex").innerText = uvValue;
    document.getElementById("uvBar").style.width = (uvValue * 10) + "%";

    // AI Suggestions
    updateAI(data.main.temp, data.weather[0].main, data.name);
}

// 4. AI Logic
function updateAI(temp, cond, city) {
    const advice = document.getElementById("activityAdvice");
    const travel = document.getElementById("travelAdvice");
    let text = "";
    let cScore = 90, wScore = 100;

    if (temp > 30) {
        text = "☀️ Garmi zyada hai! Cotton ke kapray pehnein aur paani zyada piyein.";
        cScore = 40; 
    } else if (temp < 15) {
        text = "🧥 Thand hai! Sweater ya Jacket pehanna zaroori hai.";
        wScore = 40;
    } else {
        text = "🌤️ Maosam behtarein hai! Aaj bahar ghoomne ka maza lein.";
    }

    if (cond.includes("Rain")) {
        text += " ☔ Sath chatri (umbrella) rakhein.";
        cScore = 10; wScore = 0;
    }

    advice.innerText = text;
    travel.innerText = `${city} ke liye aaj ka safar behtarein rahega! 🚗`;
    document.getElementById("cricketScore").style.width = cScore + "%";
    document.getElementById("washScore").style.width = wScore + "%";
}

// 5. Menu & Theme
document.getElementById("menuBtn").onclick = (e) => {
    e.stopPropagation();
    document.getElementById("menuContent").classList.toggle("show");
};

document.getElementById("toggleTheme").onclick = () => {
    document.body.classList.toggle("light-theme");
};

// 6. Like/Dislike Logic
let likes = 124;
document.getElementById("likeBtn").onclick = function() {
    likes++;
    document.getElementById("likeCount").innerText = likes;
    document.getElementById("thanksMsg").style.display = "block";
    this.disabled = true;
};

// 7. Search Button
document.getElementById("searchBtn").onclick = () => {
    const city = document.getElementById("cityInput").value;
    if (city) checkWeather(city);
};
