const form = document.querySelector(".add"); // selecting the form to add transaction

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
}

/**
 * Creates a transaction with the values
 * passed through the source and amount input
 * in the application form.
 */
form.addEventListener("submit", event => {
    event.preventDefault();
    generateAndAddTransactionToList(form.source.value, form.amount.value);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    form.reset();
});