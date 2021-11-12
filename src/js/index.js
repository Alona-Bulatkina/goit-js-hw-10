import '../css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './services/fetchCountries';
import countriesMarkupTml from '../templates/countriesMarkup.hbs';
import oneCountriesMarkupTml from '../templates/oneCountryMarkup.hbs';

const DEBOUNCE_DELAY = 300;


const searchbox = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

let markup = '';

searchbox.addEventListener('input', debounce(() => {
    if (searchbox.value.trim() === '') {
        countryListEl.innerHTML = '';
        countryInfoEl.innerHTML = '';
        return;
    };
    fetchCountries(searchbox.value.trim())
      .then(userdata => showCountries(userdata))
      .catch(error => showError(error));
  }, DEBOUNCE_DELAY));


function showCountries(counrtries) {
    countryListEl.innerHTML = '';
    countryInfoEl.innerHTML = '';

     if (counrtries.length > 10) {
     return Notify.success("Too many matches found. Please enter a more specific name.");
    }

    if ((counrtries.length >= 2) && (counrtries.length <= 10)) {
        markup = countriesMarkup(counrtries);
        return countryListEl.insertAdjacentHTML('beforeend', markup);
    }

    markup = oneCountryMarkup(counrtries);
    return countryInfoEl.insertAdjacentHTML('beforeend', markup);
}

function countriesMarkup(counrtries) {
    return countriesMarkupTml(counrtries);
}

function oneCountryMarkup(counrtries) {
    return oneCountriesMarkupTml(counrtries);
}

function showError() {
    countryListEl.innerHTML = '';
    countryInfoEl.innerHTML = '';
  return Notify.failure("Oops, there is no country with that name");
}