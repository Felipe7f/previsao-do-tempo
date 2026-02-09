const html = document.querySelector('html');
const trilho = document.getElementById('trilho');
const indicador = document.getElementById('indicador')
// Container Principal
const container = document.getElementById('container');
// Imagem Clima
const imgClima = document.getElementById('imgClima');
// Imagem de Carregamento
const loadingNameCity = document.getElementById('loading-nameCity');
const loadingCeuStats = document.getElementById('loading-ceuStats');
const loadingTempC = document.getElementById('loading-tempC');
const loadingTempF = document.getElementById('loading-tempF');
const loadingVento = document.getElementById('loading-vento');
const loadingUmidade = document.getElementById('loading-umidade');
// Hide
const containerTitle = document.getElementById('container-title');
const containerCeu = document.getElementById('container-ceu');
const containerClima = document.getElementById('container-clima');
const containerInput = document.getElementById('container-input');
// Caixas de informações
const tempC = document.getElementById('tempC');
const tempF = document.getElementById('tempF');
const vento = document.getElementById('vento');
const umidade = document.getElementById('umidade');
const ceu = document.getElementById('ceu');
// Nome da cidade
const titleNameCity = document.getElementById('titleNameCity');
// Inputs
const cityInput = document.getElementById('cityName');
const btnSearch = document.getElementById('btnSearch');

const apiKey = '5055e12782e84afcc6b40f3c9adea697';

const resetData = () => {
    titleNameCity.textContent = '';
    tempC.textContent = '';
    tempF.textContent = '';
    vento.textContent = '';
    umidade.textContent = '';
    ceu.textContent = '';

    imgClima.src = '';

    containerTitle.classList.add('hide');
    containerCeu.classList.add('hide');
    containerClima.classList.add('hide');
};

const fetchApi = (value) => {

    resetData();

    showElement(loadingNameCity);
    showElement(loadingCeuStats);
    showElement(loadingTempC);
    showElement(loadingTempF);
    showElement(loadingVento);
    showElement(loadingUmidade);

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${value}&appid=${apiKey}&units=metric`)
        .then((res) => {
            if (!res.ok) {
                throw new Error('Cidade não encontrada');
            }
            return res.json();
        })
        .then((data) => {
            updateUI(data);

            hideElement(loadingNameCity);
            hideElement(loadingCeuStats);
            hideElement(loadingTempC);
            hideElement(loadingTempF);
            hideElement(loadingVento);
            hideElement(loadingUmidade);

            containerCeu.classList.remove('hide');
            containerClima.classList.remove('hide');
        })
        .catch((error) => {
            alert(error.message);
            console.log('Erro ao buscar dados:', error);

            hideElement(loadingNameCity);
            hideElement(loadingCeuStats);
            hideElement(loadingTempC);
            hideElement(loadingTempF);
            hideElement(loadingVento);
            hideElement(loadingUmidade);

            resetData();
        });
};

const updateUI = (data) => {

    const nameCity = data.name;
    const country = data.sys.country;
    titleNameCity.textContent = `${nameCity} - ${country}`.toUpperCase();

    const statsPT = {
        Clear: { desc: "Céu limpo" },
        Clouds: { desc: "Nublado" },
        Rain: { desc: "Chuva" },
        Drizzle: { desc: "Garoa" },
        Thunderstorm: { desc: "Tempestade" },
        Snow: { desc: "Neve" },
        Mist: { desc: "Névoa" },
        Smoke: { desc: "Fumaça" },
        Haze: { desc: "Bruma" },
        Dust: { desc: "Poeira" },
        Fog: { desc: "Nevoeiro" },
        Sand: { desc: "Areia" },
        Ash: { desc: "Cinzas" },
        Squall: { desc: "Rajada de Vento" },
        Tornado: { desc: "Tornado" }
    };

    const statsCeu = data.weather[0].main;

    const statsInfo = statsPT[statsCeu] || { desc: statsCeu };
    ceu.textContent = statsInfo.desc;
    imgClima.alt = statsInfo.desc;

    const icon = data.weather[0].icon;
    imgClima.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    const temperaturaC = data.main.temp;
    const temperaturaFormatadoEmC = temperaturaC.toFixed(0);
    tempC.textContent = `${temperaturaFormatadoEmC} °C`;

    const temperaturaF = data.main.temp;
    const temperaturaCalculo = (temperaturaF * 1.8) + 32;
    const temperaturaFormatadoEmF = temperaturaCalculo.toFixed(0);
    tempF.textContent = `${temperaturaFormatadoEmF} °F`

    const ventoSpeedInMeter = data.wind.speed;
    const ventoSpeedInKM = Math.round(ventoSpeedInMeter * 3.6);
    vento.textContent = `${ventoSpeedInKM}`;

    const umidadeValue = data.main.humidity;
    umidade.textContent = `${umidadeValue}`;

    console.log(data);
    return(data);
};

const hideElement = (element) => {
    element.classList.add('hide');
};

const showElement = (element) => {
    element.classList.remove('hide');
};

btnSearch.addEventListener('click', (event) => {
    event.preventDefault();

    if (cityInput.value.trim() === "") {
        resetData();
        alert("Por favor, insira o nome da cidade para prosseguir!");
    } else {
        fetchApi(cityInput.value);

        containerTitle.classList.remove('hide');
        containerClima.classList.remove('hide');
        ceu.classList.remove('hide');
    }
});

cityInput.addEventListener('input', () => {
    if (cityInput.value.trim() === "") {
        resetData();
        containerTitle.classList.add('hide');
        containerCeu.classList.add('hide');
        containerClima.classList.add('hide');
        ceu.classList.add('hide');
    }
});

trilho.addEventListener('click', function() {
    html.classList.toggle('dark-mode');
    indicador.classList.toggle('indicador-dir')
});

cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();

        if (cityInput.value.trim() === "") {
            resetData();
            alert("Por favor, insira o nome da cidade para prosseguir!");
        } else {
            fetchApi(cityInput.value);

            containerTitle.classList.remove('hide');
            containerClima.classList.remove('hide');
            ceu.classList.remove('hide');
        }
    }
});