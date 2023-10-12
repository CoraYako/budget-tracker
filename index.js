const form = document.querySelector(".add"); // selecting the form to add transaction
const incomeList = document.querySelector("ul.income-list");
const expenseList = document.querySelector("ul.expense-list");

let transactions = localStorage.getItem("transactions") !== null ?
    JSON.parse(localStorage.getItem("transactions")) : []

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
    console.log(transactions)
}

loadTransactionsToDOM();

/**
 * Creates a transaction with the values
 * passed through the source and amount input
 * in the application form.
 */
form.addEventListener("submit", event => {
    event.preventDefault();
    const transaction = generateAndAddTransactionToList(form.source.value, form.amount.value);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    addTransactionDOM(transaction.id, transaction.source, transaction.amount, transaction.time);
    form.reset();
});