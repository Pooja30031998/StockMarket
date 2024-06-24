import { chart } from "/chart.js";

const stocks = [
  "AAPL",
  "MSFT",
  "GOOGL",
  "AMZN",
  "PYPL",
  "TSLA",
  "JPM",
  "NVDA",
  "NFLX",
  "DIS",
];

const timeButton = document.querySelectorAll(".time");
const header = document.querySelector(".detailsHeader");
const details = document.querySelector(".details p");
const aside = document.querySelector(".list ul");

let dur;
let stockName = stocks[0];

// fetching details
async function getDetails() {
  const response = await fetch(
    "https://stocks3.onrender.com/api/stocks/getstockstatsdata"
  );
  const data = await response.json();

  const responseDetails = await fetch(
    "https://stocks3.onrender.com/api/stocks/getstocksprofiledata"
  );
  const dataDetails = await responseDetails.json();

  stocks.forEach((name) => {
    let profit = data.stocksStatsData[0][name].profit.toFixed(2);
    let book = data.stocksStatsData[0][name].bookValue;
    let detail = dataDetails.stocksProfileData[0][name].summary;

    list(name, profit, book, detail);
  });

  headerSpan(
    stocks[0],
    data.stocksStatsData[0][stocks[0]].profit.toFixed(2),
    data.stocksStatsData[0][stocks[0]].bookValue,
    dataDetails.stocksProfileData[0][stocks[0]].summary
  );
  timeButton.forEach((element) => {
    if (element.innerHTML === "5 Years") {
      element.click();
    }
  });
}

async function getChartDetails(dur, name) {
  const responseChart = await fetch(
    "https://stocks3.onrender.com/api/stocks/getstocksdata"
  );
  const dataChart = await responseChart.json();
  let Xaxis;
  let Yaxis;
  if (dur) {
    Xaxis = dataChart.stocksData[0][name][dur].timeStamp;
    Yaxis = dataChart.stocksData[0][name][dur].value;
  } else {
    Xaxis = dataChart.stocksData[0][name]["5y"].timeStamp;
    Yaxis = dataChart.stocksData[0][name]["5y"].value;
  }
  chart(Xaxis, Yaxis);
}

// aside list
function list(name, profit, book, detail) {
  let li = document.createElement("li");
  let button = document.createElement("button");
  button.textContent = name;
  li.appendChild(button);
  let percent = document.createElement("span");
  if (profit <= 0) {
    percent.classList.add("percentLow", "inline");
  } else {
    percent.classList.add("percent", "inline");
  }
  percent.textContent = profit + "%";
  li.appendChild(percent);
  let bookValue = document.createElement("span");
  bookValue.classList.add("book", "inline");
  bookValue.textContent = "$" + book;
  li.appendChild(bookValue);
  aside.appendChild(li);

  button.addEventListener("click", () => {
    header.replaceChildren();
    headerSpan(name, profit, book, detail);
    getChartDetails("5y", name);
    stockName = name;
  });
}

// duration eventlistener
timeButton.forEach((element) => {
  element.addEventListener("click", () => {
    let durationTime = element.innerHTML;
    if (durationTime == "1 Month") {
      dur = "1mo";
    } else if (durationTime == "3 Months") {
      dur = "3mo";
    } else if (durationTime == "1 Year") {
      dur = "1y";
    } else if (durationTime == "5 Years") {
      dur = "5y";
    }
    getChartDetails(dur, stockName);
  });
});

// Details
function headerSpan(name, profit, book, detail) {
  details.textContent = detail;
  let headerName = document.createElement("span");
  headerName.textContent = name;
  headerName.classList.add("name", "inline");
  header.appendChild(headerName);
  let headerPercent = document.createElement("span");
  headerPercent.textContent = profit + "%";
  if (profit <= 0) {
    headerPercent.classList.add("percentLow", "inline");
  } else {
    headerPercent.classList.add("percent", "inline");
  }
  header.appendChild(headerPercent);
  let headerBookValue = document.createElement("span");
  headerBookValue.textContent = "$" + book;
  headerBookValue.classList.add("book", "inline");
  header.appendChild(headerBookValue);
}

getDetails();
