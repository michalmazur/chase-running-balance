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

        // Get transaction history in reverse chronological order.
        var transactions = $('#creditCardTransTable tbody tr.border').get().reverse();

        // Return early while waiting for transaction history to load.
        if (transactions.length == 0) {
            return;
        }

        // Add Balance column.
        $('#creditCardTransTable thead tr').append('<th scope="col" class="sortable amount">Balance</th>');

        // Find balance last statement and use it as running balance.
        var runningBalance = amountToNumber($('#accountLastStatementBalance').text());

        // Calculate and display running balance for each transaction.
        $(transactions).each(function () {
            var transactionAmount = amountToNumber($(this).find('.amount').text());
            runningBalance += transactionAmount;

            // Clone an Amount cell to easily create a similar-looking Balance cell.
            var balanceCell = $(this).find('td.amount').clone();
            balanceCell.find('span').text('$' + runningBalance.toLocaleString("en-US"));
            $(this).append(balanceCell);
        });

        clearInterval(intervalId);

    }, 100);

    function amountToNumber(text) {
        return parseFloat(text.replace('\u2013', '-').replace(/[$,]+/g, ''));
    }
};

var script = document.createElement('script');
script.type = "text/javascript";
script.textContent = '(' + main.toString() + ')();';
document.body.appendChild(script);