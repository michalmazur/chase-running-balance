var main = function () {

    var runs = 0;

    var intervalId = setInterval(function () {

        runs++;

        // Give up if transaction history has not loaded in 10 seconds.
        if (runs > 100) {
            clearInterval(intervalId);
            return;
        }

        // Return early while waiting for jQuery to load.
        if (typeof $ !== 'function') {
            return;
        }

        // Get transaction history.
        var transactions = $('#creditCardTransTable tbody tr.border').get();

        // Return early while waiting for transaction history to load.
        if (transactions.length == 0) {
            return;
        }

        // Add Balance column.
        $('#creditCardTransTable thead tr').append('<th scope="col" class="sortable amount">Balance</th>');

        // Find current balance and use it as running balance.
        var runningBalance = amountToNumber($('#accountCurrentBalance').text());

        // Calculate and display running balance for each transaction.
        $(transactions).each(function () {
            // Clone an Amount cell to easily create a similar-looking Balance cell.
            var balanceCell = $(this).find('td.amount').clone();
            balanceCell.find('span').text('$' + runningBalance.toLocaleString("en-US", {minimumFractionDigits: 2}));
            $(this).append(balanceCell);

            var transactionAmount = amountToNumber($(this).find('.amount').first().text());
            runningBalance -= transactionAmount;
        });

        clearInterval(intervalId);

    }, 100);

    function amountToNumber(text) {
        return parseFloat(text.replace('\u2212', '-').replace(/[$,]+/g, ''));
    }
};

var script = document.createElement('script');
script.type = "text/javascript";
script.textContent = '(' + main.toString() + ')();';
document.body.appendChild(script);