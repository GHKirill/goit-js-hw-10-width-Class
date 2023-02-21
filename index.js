const refInput = document.querySelector('input');
const refCountryList = document.querySelector('.country-list');
const refCountryInfo = document.querySelector('.country-info');

refInput.addEventListener('input', inputCountryName);

function inputCountryName(event) {
  refCountryInfo.innerHTML = '';
  refCountryList.innerHTML = '';
  let inputValue = refInput.value.trim();
  if (inputValue.length === 0) return;
  fetchInput(inputValue);
}
function fetchInput(input) {
  fetch(
    `https://restcountries.com/v2/name/${input}?fields=name,capital,population,flag,languages`,
  )
    .then(resolve => resolve.json())
    .then(resolve => {
      if (resolve.status == 404) {
        throw new Error('Oops, there is no country with that name');
      }
      if (resolve.length > 1) {
        const countryList = new MakeCountryList(resolve, refCountryList);
        countryList.createMarkupCountryList();
      } else {
        const country = new MakeCountryListWIthInfo(
          resolve,
          refCountryList,
          refCountryInfo,
        );
        country.createMarkupCountryList();
        country.createMarkupCountryInfo();
      }
    })
    .catch(error => console.log(error.message));
}

class MakeCountryList {
  constructor(countriesList, placeOfCountriesList) {
    this.countriesList = countriesList;
    this.placeOfCountriesList = placeOfCountriesList;
    this.markUpCountriesList = null;
  }
  createMarkupCountryList() {
    if (this.countriesList.length > 10) {
      console.log('number of countries is more than 10');
      return;
    }
    this.markUpCountriesList = this.countriesList
      .map(({ name, flag }) => {
        return `<li class='country-name'><img src ="${flag}" class='country-flag' width=45 height=36></img>${name}</li>`;
      })
      .join('');
    this.insertMarkUpToHTML(
      this.placeOfCountriesList,
      this.markUpCountriesList,
    );
  }
  insertMarkUpToHTML(place, markUp) {
    place.insertAdjacentHTML('beforeend', markUp);
  }
}
//==========================
class MakeCountryListWIthInfo extends MakeCountryList {
  constructor(countriesList, placeOfCountriesList, placeOfCountryInfo) {
    super(countriesList, placeOfCountriesList);
    this.placeOfCountryInfo = placeOfCountryInfo;
    this.markUpCountriesListInfo = null;
  }
  createMarkupCountryList() {
    super.createMarkupCountryList();
    refCountryList.classList.add('country-name-one');
  }
  createMarkupCountryInfo() {
    let { capital, population, languages } = this.countriesList[0];
    this.markUpCountriesListInfo = `
   <ul class=country-info>
   <li class='country-capital'> <b>Capital</b>: ${capital} </li>
   <li class='country-capital'> <b>Population</b> : ${population} </li>
   <li class='country-capital'> <b>Languages</b>: ${this.createLanguagesList(
     languages,
   )} </li>
   </ul>`;
    this.insertMarkUpToHTML(
      this.placeOfCountryInfo,
      this.markUpCountriesListInfo,
    );
  }
  createLanguagesList(languages) {
    return languages.map(item => item.name).join(', ');
  }
}
