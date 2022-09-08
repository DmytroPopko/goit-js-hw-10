import './css/styles.css';
import API from './fetchCountries';
import getRefs from './get-refs';
import debounce from 'lodash/debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const refs = getRefs();

function findCountryInf() {
  refs.searchInput.addEventListener(
    'input',
    debounce(onSearch, DEBOUNCE_DELAY)
  );

  function onSearch(e) {
    clearCountryContainer();
    const searchQuery = e.target.value.trim();
    if (searchQuery === '') {
      return;
    }

    API.fetchCountry(searchQuery).then(appendCountryMarkup);
  }

  function appendCountryMarkup(countries) {
    console.log(countries.status);
    if (countries.status === 404) {
      onFetchError();
    }

    if (countries.length === 1) {
      let languages = Object.values(countries[0].languages).join(', ');

      refs.countryContainer.insertAdjacentHTML(
        'beforeend',
        `<h1><img src="${countries[0].flags.svg}" alt="flag" width="30">&nbsp${countries[0].name.official}</h1>
      <span>Capital: ${countries[0].capital}</span><br>
      <span>Population: ${countries[0].population}</span><br>
      <span>Languages: ${languages}</span>`
      );
    } else if (countries.length > 1 && countries.length <= 10) {
      refs.countryContainer.insertAdjacentHTML(
        'beforeend',
        countries.reduce((acc, country) => {
          acc += `<li><img src="${country.flags.svg}" alt="flag" width="30">
      &nbsp${country.name.official}</li>`;
          return acc;
        }, '')
      );
    } else if (countries.length > 10) {
      toManyMatches();
    }
  }

  function onFetchError() {
    Notiflix.Notify.failure('Oops, there is no country with that name');
  }

  function toManyMatches() {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }

  function clearCountryContainer() {
    refs.countryContainer.innerHTML = '';
  }
}

findCountryInf();
