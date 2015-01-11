var main = function () {

    var runs = 0;

    var intervalId = setInterval(function (jQuery) {

        runs++;

        // Get transaction history in reverse chronological order.
        var transactions = jQuery('table.card-activity tbody tr.summary').get().reverse();

        // Give up if transaction history has not loaded in 5 seconds.
        if (runs > 50) {
            clearInterval(intervalId);
            return;
        }

        // Return early while waiting for transaction history to load.
        if (transactions.length == 0) {
            return;
        }

        // Adjust activity table and add Balance column.
        jQuery('table.card-activity colgroup col:nth-child(6)').width = '5%';
        jQuery('table.card-activity colgroup').appendTo('<col width="13%"');
        jQuery('tr.divider').find('td').attr('colspan', 8);
        jQuery('table.card-activity thead tr').append('<th class="header"><span class="under">Balance</span>&nbsp;&nbsp;&nbsp;</th>');

        // Find balance last statement and use it as running balance.
        var runningBalance = parseFloat(jQuery('td:contains(Balance last statement)').last().next().text().replace(/[$,]+/g, ''));

        // Calculate and display running balance for each transaction.
        jQuery(transactions).each(function () {
            var transactionAmount = parseFloat(jQuery(this).find('td').last().text().replace(/[$,]+/g, ''));
            runningBalance += transactionAmount;
            jQuery(this).append('<td>$' + runningBalance.toFixed(2) + '</td>');
        });

        clearInterval(intervalId);

    }, 100, jQuery);

}

var script = document.createElement('script');
script.type = "text/javascript";
script.textContent = '(' + main.toString() + ')();';
document.body.appendChild(script);