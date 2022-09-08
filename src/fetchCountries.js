const BASE_URL = 'https://restcountries.com/v3.1';
const options = 'fields=name,capital,population,flags,languages';

function fetchCountry(countryName) {
  return fetch(`${BASE_URL}/name/${countryName}?${options}`)
    .then(response => response.json())
    .then(countries => countries)
    .catch();
}

export default { fetchCountry };
