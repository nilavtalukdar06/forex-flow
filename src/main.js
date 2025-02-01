import { country_list } from "./country";
const apiKey = import.meta.env.VITE_API_KEY;
const input = document.querySelector(".input");
const button = document.querySelector(".result");
let currencyCodeFrom = document.querySelector(".currency-code-from");
let currencyCodeTo = document.querySelector(".currency-code-to");
const resultText = document.querySelector(".result-text");
const swapButton = document.querySelector(".swap");
const app = document.querySelector("#app");
const container = document.querySelector(".container");
const countryFrom = document.querySelector(".country-from");
const countryTo = document.querySelector(".country-to");
const optionFrom = document.querySelector(".option-from");
const optionTo = document.querySelector(".option-to");
const currencyFrom = document.querySelector(".currency-from");
const currencyTo = document.querySelector(".currency-to");

//Initial Values
input.value = 1;
let codeFrom = currencyCodeFrom.innerHTML;
let codeTo = currencyCodeTo.innerHTML;

//Appending countries dynamically based on the number of countries
const countries = Object.keys(country_list);
countries.forEach((country) => {
  const div = document.createElement("div");
  div.setAttribute("class", "option-container-from option-container");
  div.innerHTML = `<img
                      src="https://flagsapi.com/${country_list[country]}/flat/24.png" loading="lazy"
                    />
                   <p class="currency-code dynamic-currency-code-from">${country}</p>`;
  optionFrom.append(div);
});

countries.forEach((country) => {
  const div = document.createElement("div");
  div.setAttribute("class", "option-container option-container-to");
  div.innerHTML = `<img
                      src="https://flagsapi.com/${country_list[country]}/flat/24.png" loading="lazy"
                    />
                   <p class="currency-code dynamic-currency-code-to">${country}</p>`;
  optionTo.append(div);
});

// pop up select menus
optionFrom.style.display = "none";
optionTo.style.display = "none";

currencyFrom.addEventListener("click", (event) => {
  event.stopPropagation();
  optionFrom.style.display = "flex";
  document.addEventListener("click", (event) => {
    event.stopPropagation();
    optionFrom.style.display = "none";
  });
});

currencyTo.addEventListener("click", (event) => {
  event.stopPropagation();
  optionTo.style.display = "flex";
  document.addEventListener("click", (event) => {
    event.stopPropagation();
    optionTo.style.display = "none";
  });
});

//set values of currency and flag according to user
const optionContainerFrom = document.querySelectorAll(".option-container-from");
Array.from(optionContainerFrom).forEach((value) => {
  value.addEventListener("click", (event) => {
    event.stopPropagation();
    currencyCodeFrom.innerHTML = value.innerText;
    codeFrom = value.innerText;
    countryFrom.setAttribute(
      "src",
      `https://flagsapi.com/${country_list[value.innerText]}/flat/24.png`
    );
    optionFrom.style.display = "none";
  });
});

const optionContainerTo = document.querySelectorAll(".option-container-to");
Array.from(optionContainerTo).forEach((value) => {
  value.addEventListener("click", (event) => {
    event.stopPropagation();
    currencyCodeTo.innerHTML = value.innerText;
    codeTo = value.innerText;
    countryTo.setAttribute(
      "src",
      `https://flagsapi.com/${country_list[value.innerText]}/flat/24.png`
    );
    optionTo.style.display = "none";
  });
});

// Fetching api data
const fetchData = async (valueFrom = 1, from = "USD", to = "INR") => {
  try {
    const data = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${from}`,
      { method: "GET" }
    );
    if (!data.ok) {
      console.error("Error 404 Bad Request");
      resultText.innerHTML = "Data is not available";
    } else {
      const response = await data.json();
      calculate(response, valueFrom, from, to);
    }
  } catch (error) {
    console.error("Error 404 Bad Request");
    container.innerHTML = "Error 404 Bad Request";
    container.classList.add("error");
    app.style.backgroundColor = "#fff";
  }
};

//calculate the conversion using the api data
const calculate = (response, valueFrom, from, to) => {
  const { conversion_rates } = response;
  const rate = conversion_rates[to];
  resultText.innerHTML = `${valueFrom} ${from} = ${(valueFrom * rate).toFixed(
    2
  )} ${to}`;
};

//shows the initial data when the window is loaded
window.addEventListener("DOMContentLoaded", () => {
  countryFrom.setAttribute(
    "src",
    `https://flagsapi.com/${country_list[codeFrom]}/flat/24.png`
  );

  countryTo.setAttribute(
    "src",
    `https://flagsapi.com/${country_list[codeTo]}/flat/24.png`
  );
  resultText.innerHTML = "Getting Exchange Rate...";
  fetchData();
});

//swap the countries and it's currency values
const swap = () => {
  codeFrom = currencyCodeTo.innerHTML;
  codeTo = currencyCodeFrom.innerHTML;
  currencyCodeFrom.innerHTML = codeFrom;
  currencyCodeTo.innerHTML = codeTo;
  changeFlag(codeFrom, codeTo);
};

//change the flags of the country based on user selection
const changeFlag = (codeFrom, codeTo) => {
  let countryUrlFrom = `https://flagsapi.com/${country_list[codeFrom]}/flat/24.png`;
  countryFrom.setAttribute("src", countryUrlFrom);
  let countryUrlTo = `https://flagsapi.com/${country_list[codeTo]}/flat/24.png`;
  countryTo.setAttribute("src", countryUrlTo);
};

//swaps the countries
swapButton.addEventListener("click", () => swap());

//clicking this button performs conversion based on user preference
button.addEventListener("click", () => {
  const value = Number(input.value);
  if (isNaN(value) || value <= 0) {
    alert("Enter only Number");
    input.value = "";
  } else {
    resultText.innerHTML = "Getting Exchange Rate...";
    fetchData(value, codeFrom, codeTo);
  }
});
