//CONECTANDO A API OPENWEATHERMAP

const api = {
    key: "da3b477bbf0b6fcd5bb4600d5418ccb4",
    base_url: "https://api.openweathermap.org/data/2.5/",
    lang: "pt_br",
    units: "metric"
}

//SELECIONANDO ELEMENTOS DO HTML (MANIPULANDO DOM)

const city = document.querySelector('.city');
const date = document.querySelector('.date');
const container_img = document.querySelector('.container-img');
const container_temp = document.querySelector('.container-temp');
const weather_t = document.querySelector('.weather');
const temp_number = document.querySelector('.container-temp div');
const temp_unit = document.querySelector('.container-temp span');
const search_input = document.querySelector('.form-control');
const search_button = document.querySelector('.btn');
const low_high = document.querySelector('.low-high')

//OBTENDO DADOS VIA GEOLOCALIZAÇÃO

window.addEventListener('load', () => {
    if ("geolocation" in navigator){
        navigator.geolocation.getCurrentPosition(setPosition, showError);
    }
    else {
        alert('Não foi possível verificar sua localização!');
    }

    function setPosition(position){
        let lat = position.coords.latitude;
        let long = position.coords.longitude;

        coordResults(lat, long);
        console.log(position);
    }
    function showError(error) {
        alert(`erro: ${error.message}`)
    }
})

function coordResults(lat, long){
    fetch(`${api.base_url}/weather?lat=${lat}&lon=${long}&lang=${api.lang}&units=${api.units}&APPID=${api.key}`)
        .then(response => {
            //console.log(response)
            if(!response.ok){
                throw new Error(`http error: status ${response.status}`)
            }
            return response.json();
        })
        .catch(error => {
            alert(error.message)
        })
        .then(response => {
            displayResults(response)
        });
}

//EVENTOS BOTÃO DE BUSCA - CLICANDO EM "BUSCAR"

search_button.addEventListener('click', function(){
    searchResults(search_input.value)
})

//EVENTOS BOTÃO DE BUSCA - PRESSIONANDO "ENTER"

search_input.addEventListener('keypress', enter)
function enter(event){
    key = event.keyCode
    if (key === 13){
        searchResults(search_input.value)
    }
}

//FAZENDO REQUISIÇÃO PARA API

function searchResults(city){
    fetch(`${api.base_url}/weather?q=${city}&lang=${api.lang}&units=${api.units}&APPID=${api.key}`)
        .then(response => {
            console.log(response);
            if(!response.ok){ 
                throw new Error(`http error: status ${response.status}`)
            }//VERIFICANDO SE A CHAMADA DA API FUNCIONA E CASO NÃO, RETORNANDO ERRO ^^^^^^
            return response.json();
        })//CASO A CHAMADA FUNCIONE, RETORNA RESPOSTA EM FORMATO JSON ^^^
        .catch(error => {
            alert(error.message)
        })//EXIBINDO MENSAGEM DE ERRO ^^^^^^^^^
        .then(response => {
            displayResults(response)
        });//EXIBINDO RESULTADOS ^^^^^^^^^^
}

//OBTENDO RESULTADOS DA API
function displayResults(weather){
    console.log(weather)

    city.innerText = `${weather.name}, ${weather.sys.country}`;

    let now = new Date();
    date.innerText = dateBuilder(now);

    let iconName = weather.weather[0].icon;
    container_img.innerHTML = `<img src=./icons/${iconName}.png>`;

    let temperature = `${Math.round(weather.main.temp)}`
    temp_number.innerHTML = temperature;
    temp_unit.innerHTML = `ºC`; // Descomentar essa linha de código, não exibe dados do tempo agora e mín/máx

    weather_tempo = weather.weather[0].description;
    weather_t.innerText = capitalizeFirstLetter(weather_tempo)

    low_high.innerText = `${Math.round(weather.main.temp_min)}ºC / ${Math.round(weather.main.temp_max)}ºC`;
}

//CONFIGURANDO DIA, MÊS E ANO E EXIBINDO NA TELA
function dateBuilder(d){
    let days = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
    let months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    let day = days = days[d.getDay()]; //NUMERAÇÃO DO DIA COMEÇANDO EM 0 E TERMINANDO EM 6
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day}, ${date} de ${month} de ${year}`
}

//CONVERTENDO A TEMPERATURA °F P/ °C E VICE VERSA
container_temp.addEventListener('click', changeTemp)
function changeTemp() {
    temp_number_now = temp_number.innerHTML

    if (temp_unit.innerHTML === "°c") {
        let f = (temp_number_now * 1.8) + 32
        temp_unit.innerHTML = "°f"
        temp_number.innerHTML = Math.round(f)
    }
    else {
        let c = (temp_number_now - 32) / 1.8
        temp_unit.innerHTML = "°c"
        temp_number.innerHTML = Math.round(c)
    }
}

//DEIXAR A PRIMEIRA LETRA MAIÚSCULA
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

