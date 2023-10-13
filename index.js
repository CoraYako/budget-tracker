const form = document.querySelector(".add"); // selecting the form to add transaction
const incomeList = document.querySelector("ul.income-list");
const expenseList = document.querySelector("ul.expense-list");

const income = document.getElementById("income")
const expense = document.getElementById("expense");
const balance = document.getElementById("balance");

const errorMessage = document.querySelector("form p.message"); // <p> element to show error messages if the inputs are invalid

let transactions = localStorage.getItem("transactions") !== null ?
    JSON.parse(localStorage.getItem("transactions")) : []

/**
 * Updates the values for balance, income and expense
 * in the statistics field.
 */
function updateStatistics() {
    const updatedIncome = transactions
        .filter(transaction => transaction.amount > 0)
        .reduce((total, transaction) => total += transaction.amount, 0);

    const updatedExpense = transactions
        .filter(transaction => transaction.amount < 0)
        .reduce((total, transaction) => total += Math.abs(transaction.amount), 0);

    balance.textContent = updatedIncome - updatedExpense;
    income.textContent = updatedIncome;
    expense.textContent = updatedExpense;
}
updateStatistics();

function generateFormatedtLocalDateTime() {
    const time = new Date();

    const date = time.toLocaleDateString();
    const hours = time.getHours() % 12 || 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const amOrPm = time.getHours() < 12 ? 'AM' : 'PM';

    return `${date} at ${hours}:${minutes}:${seconds} ${amOrPm}`;
}

function generateHtmlTemplate(id, source, amount, time) {
    return `<li data-id="${id}">
                <p>
                    <span>${source}</span>
                    <span id="time">${time}</span>
                </p>
                <span>$${Math.abs(amount)}</span>
                <i class="bi bi-trash delete"></i>
            </li>`;
}

function addTransactionDOM(id, source, amount, time) {
    amount > 0 ?
        incomeList.innerHTML += generateHtmlTemplate(id, source, amount, time)
        :
        expenseList.innerHTML += generateHtmlTemplate(id, source, amount, time)

}

function generateID() {
    return Math.round(Math.random() * 1000000);
}

function generateAndAddTransactionToList(source, amount) {
    const transaction = {
        id: generateID(),
        source: source,
        amount: amount,
        time: generateFormatedtLocalDateTime()
    };

    transactions.push(transaction);
    return transaction;
}

function deleteTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

/**
 * Take each transaction and show it in income or expenses.
 */
function loadTransactionsToDOM() {
    transactions.forEach(transaction =>
        transaction.amount > 0 ?
            incomeList.innerHTML += generateHtmlTemplate(transaction.id, transaction.source, transaction.amount, transaction.time)
            :
            expenseList.innerHTML += generateHtmlTemplate(transaction.id, transaction.source, transaction.amount, transaction.time)
    );
}
loadTransactionsToDOM();

// --------------------------------------------------------------------

/**
 * Creates a transaction with the values
 * passed through the source and amount input
 * in the application form and updates the
 * statistics (balance, income, expense).
 */
form.addEventListener("submit", event => {
    event.preventDefault();
    if (form.source.value.trim() === "" || form.amount.value.trim() === "" || form.amount.value.trim() === "0") {
        errorMessage.classList.remove("hide");
        errorMessage.textContent = "Please, add proper values.";
        errorMessage.classList.add("error-message");
        return;
    }
    errorMessage.classList.add("hide");
    const transaction = generateAndAddTransactionToList(form.source.value.trim(), Number.parseInt(form.amount.value));
    localStorage.setItem("transactions", JSON.stringify(transactions));
    addTransactionDOM(transaction.id, transaction.source, transaction.amount, transaction.time);
    form.reset();
    updateStatistics();
});

/**
 * Remove the selected transaction in the
 * income list and updates the statistics
 */
incomeList.addEventListener("click", event => {
    if (event.target.classList.contains("delete")) {
        event.target.parentElement.remove();
        deleteTransaction(Number.parseInt(event.target.parentElement.dataset.id));
    }
    updateStatistics();
});

/**
 * Remove the selected transaction in the
 * expense list and updates the statistics
 */
expenseList.addEventListener("click", event => {
    if (event.target.classList.contains("delete")) {
        event.target.parentElement.remove();
        deleteTransaction(Number.parseInt(event.target.parentElement.dataset.id));
    }
    updateStatistics();
});