let totalAmount = document.getElementById("total-amount");
let userAmount = document.getElementById("user-amount");
const checkAmountButton = document.getElementById("check-amount");
const totalAmountButton = document.getElementById("total-amount-button");
const productTitle = document.getElementById("product-title");
const errorMessage = document.getElementById("budget-error");
const productTitleError = document.getElementById("product-title-error");
const productCostError = document.getElementById("product-cost-error");
const amount = document.getElementById("amount");
const expenditureValue = document.getElementById("expenditure-value");
const balanceValue = document.getElementById("balance-amount");
const list = document.getElementById("list");
let catagory = document.getElementById("catagory-select");
let tempAmount = 0;
const colors = ['#ff7f50', '#6495ed', '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0', '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700'];
var selectedValue = -1;






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
        promisedDeliveryChart.update();
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
    expenditureValue.innerText = parseInt(currentExpense) - parseInt(parentAmount);
    parentDiv.remove();
};

// Create list function

const listCreator = (expenseName, expenseValue) => {
    let subListContent = document.createElement("div");
    subListContent.classList.add("sublist-content", "flex-space");
    // Randomly select a color from the array
    let colorChoice = colors[selectedValue];
    subListContent.style.borderColor = colorChoice;
    list.appendChild(subListContent);
    subListContent.innerHTML = `<p class="product">${expenseName}</p><p class="amount">${"$"+expenseValue}</p>`;
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
};



checkAmountButton.addEventListener("click", () => {
    // Check empty
    if (!userAmount.value || !productTitle.value) {
        productTitleError.classList.remove("hide");
        return false;
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
    expenditureValue.innerText =sum;
    // Total balance = budget - total expense
    const totalBalance = tempAmount - sum;
    balanceValue.innerText =totalBalance;
    //Create list
    listCreator(productTitle.value, expenditure);
    //Clear inputs
    productTitle.value = "";
    userAmount.value = "";


});




catagory.addEventListener("change", function() {
    // Get the selected value
    selectedValue = this.value;
    console.log(selectedValue);
});

// let myChart = new Chart(document.getElementById("myChart"), {
//     type: 'doughnut',
//     data: {
//         labels: [],
//         datasets: [{
//             data: [0,0,0,0,0,0,0,0,0,0,100],
//             backgroundColor: ["black"]
//         }]
//     },
//     options: {
//         title: {
//             display: true,
//             text: 'My Doughnut Chart'
//         },
//         plugins: {
//             datalabels: {
//                 display: true,
//                 color: 'black',
//                 align: 'center',
//                 font: {
//                     size: '20'
//                 },
//                 formatter: function(value, context) {
//                     return "100%";
//                 }
//             }
//         }
//     }
// });

var data = {
    labels: [],
    datasets: [{
      data: [0,0,0,0,0,0,0,0,0,0,100],
      backgroundColor: [
        "#FF6384",
        "#36A2EB",
        "#FFCE56"
      ],
      hoverBackgroundColor: [
        "#FF6384",
        "#36A2EB",
        "#FFCE56"
      ]
    }]
  };
  
  var promisedDeliveryChart = new Chart(document.getElementById('myChart'), {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      }
    },
    plugins: [{
      id: 'text',
      beforeDraw: function(chart, a, b) {
        var width = chart.width,
          height = chart.height,
          ctx = chart.ctx;
  
        ctx.restore();
        var fontSize = (height / 200).toFixed(2);
        
        ctx.font = fontSize + "em sans-serif";
        ctx.textBaseline = "middle";
  
        var text = "$" + balanceValue.innerText,
          textX = Math.round((width - ctx.measureText(text).width) / 2),
          textY = height / 2;
  
        ctx.fillText(text, textX, textY);
        ctx.save();
      }
    }]
  });