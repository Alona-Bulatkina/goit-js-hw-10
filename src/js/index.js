import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/services/fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('country-info');

searchBox.addEventListener('input', debounce(() => {
    if (searchBox.value.trim() === '') {
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
        return;
    };
    fetchCountries(searchBox.value.trim())
      .then(userdata => showCountries(userdata))
      .catch(error => showError(error));
  }, DEBOUNCE_DELAY));

  function showCountries(counrtries) {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';

     if (counrtries.length > 10) {
     return Notify.success("Too many matches found. Please enter a more specific name.");
    }

    if ((counrtries.length >= 2) && (counrtries.length <= 10)) {
        countriesMarkup(counrtries);
        return countryList.insertAdjacentHTML('beforeend', markup);
    }

    oneCountryMarkup(...counrtries);
    return countryInfo.insertAdjacentHTML('beforeend', markup);
}

function countriesMarkup (counrtries) {
    markup = counrtries.map(item => 
            `<li>
            <img src="${item.flags.svg}" class="avatar" alt="flag" width="30" />
            <span>${item.name.official}</span></li>`
        ).join('');
}

function oneCountryMarkup ({flags, name,  capital, population, languages}) {
    markup = `<img src="${flags.svg}" class="avatar" alt="flag" width="30" />
            <span class = 'title'>${name.official}</span>
            <ul class = 'text'>
            <li>Capital: <span class = 'text__normal'>${capital}</span></li>
            <li>Population: <span class = 'text__normal'>${population}</span></li>
            <li>Languages: <span class = 'text__normal'>${Object.keys(languages).join(', ')}</span></li>
            </ul>`;
}

function showError() {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
  return Notify.failure("Oops, there is no country with that name");
}