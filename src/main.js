import "./style.css";
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

input.value = 1;
let codeFrom = currencyCodeFrom.innerHTML;
let codeTo = currencyCodeTo.innerHTML;

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
  resultText.innerHTML = `${valueFrom} ${from} = ${
    valueFrom * rate.toFixed(2)
  } ${to}`;
};

//shows the initial data when the window is loaded
window.addEventListener("load", (codeFrom, codeTo) => {
  countryFrom.setAttribute(
    "src",
    `https://flagsapi.com/${country_list[codeFrom]}/shiny/24.png`
  );
  countryTo.setAttribute(
    "src",
    `https://flagsapi.com/${country_list[codeTo]}/shiny/24.png`
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
  let countryUrlFrom = `https://flagsapi.com/${country_list[codeFrom]}/shiny/24.png`;
  countryFrom.setAttribute("src", countryUrlFrom);
  let countryUrlTo = `https://flagsapi.com/${country_list[codeTo]}/shiny/24.png`;
  countryTo.setAttribute("src", countryUrlTo);
};

//swaps the countries
swapButton.addEventListener("click", () => swap());

//clicking this button performs conversion based on user preference
button.addEventListener("click", () => {
  const value = Number(input.value);
  if (isNaN(value)) {
    alert("Enter only Number");
    input.value = "";
  } else {
    resultText.innerHTML = "Getting Exchange Rate...";
    fetchData(value, codeFrom, codeTo);
  }
});
