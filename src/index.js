import './style.css';

const countriesContainer = document.querySelector('.countries');
const countryInput = document.querySelector('#input');

const renderCountry = (data, className = '') => {
  const [lang] = Object.values(data.languages);

  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${data.flags.svg}" />
    <div class="country__data">
      <h3 class="country__name">${data.name.common}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>🌆</span>${data.capital}</p>
      <p class="country__row"><span>👫</span>${(
    +data.population / 1000000
  ).toFixed(1)} people</p>
      <p class="country__row"><span>🗣️</span>${lang}</p>

    </div>
  </article>
  `;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const getJson = (url, errMsg) => fetch(url).then((res) => {
  if (!res.ok) throw new Error(errMsg);
  return res.json();
});

// Using Fetch
const getCountryData = (country) => {
  countriesContainer.innerHTML = '';

  // Get Country
  getJson(`https://restcountries.com/v3.1/name/${country}`, 'Country Not Found')
    .then((data) => {
      const [countryData] = data;

      renderCountry(countryData);

      if (!countryData.borders) throw new Error('No Neighbour Found');

      const [neighbour] = countryData.borders;

      // Get neighbour
      return getJson(
        `https://restcountries.com/v3.1/alpha/${neighbour}`,
        'Neighbour Not Found',
      );
    })
    .then((data) => {
      const [neighbourData] = data;
      renderCountry(neighbourData, 'neighbour');
    })
    .catch((err) => alert(err));
};

countryInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const countryInp = countryInput.value;

    if (!countryInp) return;

    getCountryData(countryInp);

    countryInput.value = '';
  }
});

// Old Way using XMLHttpRequest()

// const getCountry = function (country) {
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
//   request.send();

//   request.addEventListener('load', function () {
//     const [data] = JSON.parse(this.responseText);
//     console.log(data);

//     renderCountry(data);

//     // Get neighbours
//     const [neighbours] = data.borders;

//     if (!neighbours) return;

//     const request2 = new XMLHttpRequest();
//     request2.open('GET', `https://restcountries.com/v3.1/alpha/${neighbours}`);
//     request2.send();

//     request2.addEventListener('load', function () {
//       const [neighbourData] = JSON.parse(this.responseText);
//       console.log(neighbourData);
//       renderCountry(neighbourData, 'neighbour');
//     });
//   });
// };

// getCountry('egypt');
