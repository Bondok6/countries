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

const getJson = async (url, errMsg) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(errMsg);
  const data = await res.json();
  return data;
};

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
