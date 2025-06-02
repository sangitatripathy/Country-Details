const countryname = new URLSearchParams(window.location.search).get('name');
const flagImage = document.querySelector('.country-details img'); 
const countryHeading = document.querySelector('.country-details h1');

fetch(`https://restcountries.com/v3.1/name/${countryname}?fullText=true`)
  .then((res) => res.json())  
  .then(([country]) => {

    flagImage.src = country.flags.svg;
    countryHeading.innerText = country.name.common;

    const countryAbout = document.createElement('div');
    countryAbout.classList.add('details-text');

    const nativeName = country.name.nativeName 
      ? country.name.nativeName[Object.keys(country.name.nativeName)[0]].common || country.name.common 
      : country.name.common;

    const capital = Array.isArray(country.capital) ? country.capital.join(', ') : country.capital || 'N/A';
    
    countryAbout.innerHTML = `
        <p><b>Native Name: </b>${nativeName}</p>
        <p><b>Population: </b>${country.population.toLocaleString()}</p>
        <p><b>Region: </b>${country.region}</p>
        <p><b>Sub Region: </b>${country.subregion || 'N/A'}</p>
        <p><b>Capital: </b>${capital}</p>
        <p><b>Top Level Domain: </b>${country.tld ? country.tld[0] : 'N/A'}</p>
        <p><b>Currencies: </b>${country.currencies ? Object.values(country.currencies).map(c => c.name).join(', ') : 'N/A'}</p>
        <p><b>Languages: </b>${country.languages ? Object.values(country.languages).join(', ') : 'N/A'}</p>
     `;
    document.querySelector('.details-text-container').appendChild(countryAbout);

    
    const borderCountries = document.createElement('div');
    borderCountries.classList.add('border-countries');

    const heading = document.createElement('p');
    heading.innerHTML = '<b>Border Countries:  </b>';
    borderCountries.appendChild(heading);

    if (Array.isArray(country.borders) && country.borders.length > 0) {
      const fetchBorderPromises = country.borders.map((borderCode) =>
        fetch(`https://restcountries.com/v3.1/alpha/${borderCode}`)
          .then((res) => res.json())
          .catch(() => null)
      );

      Promise.all(fetchBorderPromises).then((borders) => {
        borders.forEach((borderData) => {
          if (borderData && borderData[0]) {
            const borderCountryLink = document.createElement('a');
            borderCountryLink.textContent = borderData[0].name.common;
            borderCountryLink.href = `country.html?name=${borderData[0].name.common}`;
            borderCountries.appendChild(borderCountryLink);
            borderCountries.appendChild(document.createTextNode(' '));
          }
        });
      });
    } else {
      const noBorder = document.createElement('span');
      noBorder.innerText = 'No Border Countries';
      heading.appendChild(noBorder);
    }

    document.querySelector('.details-text-container').appendChild(borderCountries);

  })
  .catch((error) => {
    console.error('Error fetching country data:', error);
  });
