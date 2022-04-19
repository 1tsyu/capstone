// const API_KEY ="98d6e6dd9efef7249b1d1b8bee926168";


// function onGeoOk(position){
//     const lat = position.coords.latitude;
//     const lng = position.coords.longitude;
//     //console.log("You live in", lat, lng);
//     const url =  `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`;
//     fetch(url).then((response) => response.json()).then((data) => {
//     const weather = document.querySelector("#weather span:first-child");
//     const city = document.querySelector("#weather span:last-child");
//     city.innerText = data.name;
//     weather.innerText =  `${data.weather[0].main}/ ${data.main.temp}`;
//     });
  
// }
// function onGeoError(){
//     alert("can't find you. No weather for you");
// }



// navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);

$(document).ready(function() {
let weatherIcon = {
'01' : 'fas fa-sun',
'02' : 'fas fa-cloud-sun',
'03' : 'fas fa-cloud',
'04' : 'fas fa-cloud-meatball',
'09' : 'fas fa-cloud-sun-rain',
'10' : 'fas fa-cloud-showers-heavy',
'11' : 'fas fa-poo-storm',
'13' : 'far fa-snowflake',
'50' : 'fas fa-smog'
};
$.ajax({
url:'http://api.openweathermap.org/data/2.5/weather?q=daegu&APPID=98d6e6dd9efef7249b1d1b8bee926168&units=metric',
dataType:'json',
type:'GET',
success:function(data){
var $Icon = (data.weather[0].icon).substr(0,2);
var $Temp = Math.floor(data.main.temp) + 'º';
var $city = data.name;
$('.CurrIcon').append('<i class="' + weatherIcon[$Icon] +'"></i>');
$('.CurrTemp').prepend($Temp);
$('.City').append($city);
}
})
});