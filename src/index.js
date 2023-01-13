import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const countriesInput = document.querySelector('#search-box');
const countriesList = document.querySelector('.country-list');

countriesInput.addEventListener(
  'input',
  debounce(debounceFetchCountries, DEBOUNCE_DELAY)
);

function debounceFetchCountries(e) {
  const name = e.target.value.trim();

  if (name !== '') {
    fetchCountries(name)
      .then(country => renderCountry(country))
      .catch(error => {
        switch (error.message) {
          case '404': {
            Notiflix.Notify.failure('Oops, there is no country with that name');
            break;
          }
        }
      });
  }
  countriesList.innerHTML = '';
}

function renderCountry(country) {
  if (country.length === 1) {
    const markup = country
      .map(({ name, capital, population, flags, languages }) => {
        return `<li>  
        <div class="country-info">
        <img src="${flags.svg}" width="25" height="20"/>
        <h2> ${name}</h2>
        </div>       
          <p><b>Capital</b>: ${capital}</p>
          <p><b>Population</b>: ${population}</p>
          <p><b>Languages</b>: ${languages.map(a => a.name)} </p>
        </li>`;
      })
      .join('');
    countriesList.innerHTML = markup;
  } else if (country.length >= 2 && country.length < 10) {
    const markup = country
      .map(({ name, flags }) => {
        return `<li>  
        <div class="country-info">
        <img src="${flags.svg}" width="25" height="20"/>
        <h2> ${name}</h2>        
        </li>`;
      })
      .join('');
    countriesList.innerHTML = markup;
  } else {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }
}
