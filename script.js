let totalAmount = document.getElementById("total-amount");
let userAmount = document.getElementById("user-amount");
const checkAmountButton = document.getElementById("check-amount");
const totalAmountButton = document.getElementById("total-amount-button");
const productTitle = document.getElementById("product-title");
const errorMessage = document.getElementById("budget-error");
const isBudgetErrorMessage = document.getElementById("isBudget-error");
const productTitleError = document.getElementById("product-title-error");
const productCostError = document.getElementById("product-cost-error");
const amount = document.getElementById("amount");
const expenditureValue = document.getElementById("expenditure-value");
const balanceValue = document.getElementById("balance-amount");

const list = document.getElementById("list");
let catagory = document.getElementById("catagory-select");
let tempAmount = 0;
let isBudget = false;

const colors = [
  "#b4dece",
  "#9bd1cb",
  "#86c3cb",
  "#78b4ca",
  "#72a4c8",
  "#7492c2",
  "#7c7fb6",
  "#856ba4",
  "#8c568c",
  "#8e426f",
  "#00fa9a",
  "#ffd700",
];

let colorChoice = colors[11];

const runningCatBudget = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 65];

var selectedValue = 11;

totalAmountButton.addEventListener("click", () => {
  tempAmount = totalAmount.value;
  
  // Bad input
  if (tempAmount === "" || tempAmount < 0) {
    errorMessage.classList.remove("hide");
  } else {
    errorMessage.classList.add("hide");
    // Set bidget
    amount.innerHTML = tempAmount;
    console.log(expenditureValue.innerText + " " + tempAmount);
    let tempBal = tempAmount - expenditureValue.innerText;
    balanceValue.innerText = tempBal;
    // Clear input
    totalAmount.value = "";
    //update donut chart
    promisedDeliveryChart.update();
    isBudget = true;
  }
});

const disableButtons = (bool) => {
  let editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = bool;
  });
};

const modifyElement = (element, edit = false) => {
  let parentDiv = element.parentElement;
  let currentBalance = balanceValue.innerText;
  let currentExpense = expenditureValue.innerText;
  let parentAmount = parentDiv.querySelector(".amount").innerText;
  if (edit) {
    let parentText = parentDiv.querySelector(".product").innerText;
    productTitle.value = parentText;
    userAmount.value = parentAmount;
    disableButtons(true);
  }

  balanceValue.innerText = parseInt(currentBalance) + parseInt(parentAmount);
  expenditureValue.innerText =
    parseInt(currentExpense) - parseInt(parentAmount);
  parentDiv.remove();
};

// Create list function

const listCreator = (expenseName, expenseValue) => {
  let catacolVal = "N/A";
  // switch statement wont frickin work so heres a bunch of if statements
  if (selectedValue == 0) {
    catacolVal = "Rent / Mortgage";
  }
  if (selectedValue == 1) {
    catacolVal = "Car Expenses";
  }
  if (selectedValue == 2) {
    catacolVal = "Food";
  }
  if (selectedValue == 3) {
    catacolVal = "Utilities";
  }
  if (selectedValue == 4) {
    catacolVal = "Clothing";
  }
  if (selectedValue == 5) {
    catacolVal = "Health Care";
  }
  if (selectedValue == 6) {
    catacolVal = "Insurance";
  }
  if (selectedValue == 7) {
    catacolVal = "House Items";
  }
  if (selectedValue == 8) {
    catacolVal = "Debt";
  }
  if (selectedValue == 9) {
    catacolVal = "savings";
  }
  if (selectedValue == 10) {
    catacolVal = "Entertainment";
  }

  let subListContent = document.createElement("div");
  subListContent.classList.add("sublist-content", "flex-space");
  // Randomly select a color from the array
  colorChoice = colors[selectedValue];
  subListContent.style.borderColor = colorChoice;
  list.appendChild(subListContent);
  subListContent.innerHTML = `<p class="product">${expenseName}</p><p class="catagory-column">${catacolVal}</p><p class="amount">${
    "$" + expenseValue
  }</p>`;
  /**
   * adding the catagory column
   */
  // let catagoryCol = document.createElement("p");
  // catagoryCol.classList.add("catagory-column");
  // catagoryCol.style.fontSize = "1.2em";
  // catagoryCol.innerText = "hhh";

  let editButton = document.createElement("button");
  editButton.classList.add("fa-solid", "fa-pen-to-square", "edit");
  editButton.style.fontSize = "1.2em";
  editButton.addEventListener("click", () => {
    modifyElement(editButton, true);
  });
  let deleteButton = document.createElement("button");
  deleteButton.classList.add("fa-solid", "fa-trash-can", "delete");
  deleteButton.style.fontSize = "1.2em";
  deleteButton.addEventListener("click", () => {
    modifyElement(deleteButton);
  });

  subListContent.appendChild(editButton);
  subListContent.appendChild(deleteButton);
  document.getElementById("list").appendChild(subListContent);

  let percentage = (expenseValue / amount.innerText) * 100;
  let dataUpdatePoint = data.datasets[0].data[selectedValue];
  let newPercent = dataUpdatePoint + percentage;

  // subtract from default 100 val
  data.datasets[0].data[11] = data.datasets[0].data[11] - percentage;

  data.datasets[0].data[selectedValue] = newPercent;
  data.datasets[0].backgroundColor[selectedValue] = colors[selectedValue];

  // update chart with new data
  promisedDeliveryChart.update();

  ////////////// TO DO /////////////
  // change the way the percentage updates, it should re-evaluate each catagories percentage each time relative to everything else
  // [0,0,0,0,100]
  // [10, 0, 0, 0, 90]
  // [10, 10, 0, 0, 80]
  // [20, 10, 0, 0, 70]
};

checkAmountButton.addEventListener("click", () => {
  productTitleError.classList.add("hide");
    isBudgetErrorMessage.classList.add("hide");
  // Check empty
  if (!userAmount.value || userAmount < 0 || !productTitle.value) {
    productTitleError.classList.remove("hide");
    return false;
  } else if (isBudget == false) {
    isBudgetErrorMessage.classList.remove("hide");
    return false;
  } else {
    productTitleError.classList.add("hide");
    isBudgetErrorMessage.classList.add("hide");
  }
  // Enable buttons
  disableButtons(false);
  //Expense
  let expenditure;
  if (userAmount.value.startsWith("$")) {
    expenditure = parseInt(userAmount.value.slice(1));
  } else {
    expenditure = parseInt(userAmount.value);
  }
  console.log(expenditure);
  // Total expense (existing + new)
  let sum = parseInt(expenditureValue.innerText) + expenditure;
  console.log(sum);
  expenditureValue.innerText = sum;
  // Total balance = budget - total expense
  const totalBalance = tempAmount - sum;
  balanceValue.innerText = totalBalance;
  //Create list
  listCreator(productTitle.value, expenditure);
  //Clear inputs
  productTitle.value = "";
  userAmount.value = "";
});

catagory.addEventListener("change", function () {
  // Get the selected value
  selectedValue = this.value;
  console.log(selectedValue);
});

var data = {
  labels: [],
  datasets: [
    {
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100],
      backgroundColor: ["", "", "", "", "", "", "", "", "", "", "", "#ffd700"],
      hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
    },
  ],
};

var promisedDeliveryChart = new Chart(document.getElementById("myChart"), {
  type: "doughnut",
  data: data,
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  },
  plugins: [
    {
      id: "text",
      beforeDraw: function (chart, a, b) {
        var width = chart.width,
          height = chart.height,
          ctx = chart.ctx;

        ctx.restore();
        var fontSize = (height / 200).toFixed(2);

        ctx.font = fontSize + "em sans-serif";
        ctx.textBaseline = "middle";

        var text = "$" + amount.innerText,
          textX = Math.round((width - ctx.measureText(text).width) / 2),
          textY = height / 2;

        ctx.fillText(text, textX, textY);
        ctx.save();
      },
    },
  ],
});
