var inputEl = document.querySelector("#search-input")

var btnEl = document.querySelector(".search-btn")

var APIKey = "a19585eba1aa6a4d4761c459b2eb7c2c"

var cities =[]

var divdaylabel =document.createElement("h4") 

var container5Days = document.createElement("div")

function init() {
    var storedCity = JSON.parse(localStorage.getItem("cities"))
    if(storedCity!==null){
        cities=storedCity
    }
  
}


function handleSearchBtnClick(){
   
    searchInputVal = inputEl.value;
    if(!searchInputVal){
        console.log("You need a search input value!")
        return
    }
    searchQuerry(searchInputVal)
    saveHistory(searchInputVal)
    
}

function saveHistory(city) {
    if(!cities.includes(city)){
        var historyCity = $(`<div class="history__city text-center">${city}</div>`)
        $(".history").append(historyCity)
        cities.push(city)
        localStorage.setItem("cities",JSON.stringify(cities))
    }
}

function renderHistory() {
    $(".history").text("")
    for(var i=0; i < cities.length; i++){
        $(".history").append(`<div class="history__city text-center">${cities[i]}</div>`)
    }
}

function searchQuerry(cityName){
    var city = cityName
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=imperial";
    fetch(queryURL)
        .then(function(response){
            return response.json()
        })
        .then(function(data){
            displayToday(data)
            
            // Search querry 5day
            var lat = data.coord.lat
            var lon = data.coord.lon
            var queryUrl5day ="https://api.openweathermap.org/data/2.5/forecast?lat="+ lat +"&lon="+ lon +"&appid=" + APIKey + "&units=imperial";
            return fetch(queryUrl5day)
        })
        .then(function(response){
            return response.json()
        })
        .then(function(data){
            display5Days(data)
            
        })
        
    
}

function displayToday(data) {
    console.log(data)
    $(".result__today").text("")
    
    var cityName = data.name
    var temp = data.main.temp
    var wind = data.wind.speed
    var humidity = data.main.humidity
    var iconCode = data.weather[0].icon
    var iconUrl = "https://openweathermap.org/img/w/" + iconCode + ".png";
    
    var today = moment().format("MM/DD/YYYY")
    var resultToday = $(".result__today")
    resultToday.addClass("mt-2 p-2")
    resultToday.css('border',"2px #333 solid")
    // add city
    var cityNameEL = $(`<h4>${cityName} (${today}) <img src="${iconUrl}"></h4>`)
    
    
    
    // add Temp
    var tempEl = document.createElement("div")
    tempEl.classList.add('temp','mb-2');
    tempEl.textContent = "Temp: " + temp + "\u2109";

    // add Wind
    var windEL = document.createElement("div")
    windEL.classList.add('wind','mb-2')
    windEL.textContent = 'Wind: ' + wind + ' MPH'

    // add Humidity
    var humidityEL = document.createElement("div")
    humidityEL.classList.add('humidity','mb-2')
    humidityEL.textContent = 'Humidity: ' + humidity + ' %'

    $(".result__today").append(cityNameEL)
    resultToday.append(tempEl)
    resultToday.append(windEL)
    resultToday.append(humidityEL)
    
}
// display 5 Days
function display5Days(data){
    

    divdaylabel.classList.add("forecast_lable", "my-2")
    divdaylabel.textContent = "5-Day Forecast"
    document.querySelector(".result").appendChild(divdaylabel)

    
    container5Days.classList.add("5days__container", "container-fluid", "pt-2")
    container5Days.innerHTML = `<div class= "5days_wrap row justify-content-between" ></div>`
    
    
    for(var i=0; i < data.list.length; i+=8){
        
        container5Days.firstChild.innerHTML = container5Days.firstChild.innerHTML +
        `<div class="col col-2 bg-dark text-light">
            <h5 class="day">${moment(data.list[i].dt_txt).format("MM/DD/YYYY")}</h5>
            <img src="https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png">
            <div class="temp">temp: ${data.list[i].main.temp}\u2109</div>
            <div class="wind mt-2">wind: ${data.list[i].wind.speed} MPH</div>
            <div class="humidity mt-2 mb-2">humidity: ${data.list[i].main.humidity}%</div>
        </div>`
    }

    document.querySelector(".result").appendChild(container5Days)

}

btnEl.addEventListener("click",handleSearchBtnClick)

init();

renderHistory();

// click city history searched
var cityDiv = document.querySelectorAll(".history__city")

for(var i = 0; i < cityDiv.length; i++){
    cityDiv[i].addEventListener("click",function(e){
        var cityName= e.currentTarget.innerText
        searchQuerry(cityName)
    })
}
