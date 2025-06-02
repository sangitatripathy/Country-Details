const countriesContainer = document.querySelector(".countries-container");
const filter = document.querySelector(".filter-by-region");
const searchInput = document.querySelector(".search input");
const themeChanger=document.querySelector(".theme-changer")


filter.addEventListener("change", (e) => {
  const region = e.target.value;
  const url =
    region === "all"
      ? "https://restcountries.com/v3.1/all"
      : `https://restcountries.com/v3.1/region/${region}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      renderCountries(data);
    })
    .catch((error) => console.error("Error fetching countries:", error));
});

let allCountriesData;

fetch("https://restcountries.com/v3.1/all")
  .then((res) => res.json())
  .then((data) => {
    renderCountries(data);
    allCountriesData=data
  })
  .catch((error) => console.error("Error fetching countries:", error));

function renderCountries(data) {
  countriesContainer.innerHTML = "";
  data.forEach((country) => {
    const countryCard = document.createElement("a");
    countryCard.classList.add("country-card");
    countryCard.href = `country.html?name=${country.name.common}`;
    countryCard.innerHTML = `
        <img src="${country.flags?.svg}" alt="${country.name.common}">
        <div class="card-text">
          <h3 class="card-title">${country.name.common}</h3>
          <p><b>Population: </b>${country.population.toLocaleString(
            "en-IN"
          )}</p>
          <p><b>Region: </b>${country.region}</p>
          <p><b>Capital: </b>${country.capital ? country.capital[0] : "N/A"}</p>
        </div>
      `;
    countriesContainer.append(countryCard);
  });
}

searchInput.addEventListener('input', (e) => {
  const filteredCountry = allCountriesData.filter((country) =>
    country.name.common.toLowerCase().includes(e.target.value.toLowerCase())
  );
  console.log(filteredCountry);
  renderCountries(filteredCountry);
});

themeChanger.addEventListener('click',()=>{
  document.body.classList.toggle('dark')
})
