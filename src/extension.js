var main = function () {
  log("Enter main()");

  var SUPPORTED_VIEWS = [
    "Activity since last statement",
    "All transactions",
    "Year to date",
  ];
  var getActivityTable = () =>
    $ ? $("#activityTablesingleOVDAccountActivity") : null;

  var runs = 0;

  var intervalId = setInterval(function () {
    runs++;

    // Give up if activity table has not loaded in 10 seconds.
    if (runs > 100) {
      log("Clear interval (table missing)");
      clearInterval(intervalId);
      return;
    }

    // Return early while waiting for jQuery to load.
    if (typeof $ !== "function") {
      return;
    }

    function loadMoreTransactionsOrRenderBalance() {
      const seeMore$ = $("#seeMore");
      if (seeMore$.length) {
        // keep loading those table rows
        seeMore$.click();
      } else {
        displayRunningBalance();
      }
    }
    // Configure MutationObserver and try to display running balance.
    var table = getActivityTable();
    if (table.length > 0) {
      loadMoreTransactionsOrRenderBalance();

      log("Configure MutationObserver");
      var observer = new MutationObserver(loadMoreTransactionsOrRenderBalance);

      observer.observe(table[0], {
        attributes: true,
        subtree: true,
      });
    } else {
      // try again later
      return;
    }

    log("Clear interval");
    clearInterval(intervalId);
  }, 100);

  function displayRunningBalance() {
    log("Enter displayRunningBalance()");

    // Remove Balance column if it already exists.
    $(".running-balance-ext").remove();

    // Find the account activity table (exclude pending transactions)
    var activityTable = getActivityTable();

    // Get transaction history.
    var transactions = activityTable.find("tbody tr").get();

    // Return early while waiting for transaction history to load.
    if (transactions.length == 0) {
      log("No transactions");
      return;
    }

    // Return early if an unsupported view is active.
    var currentViewName = $(
      "#header-transactionTypeOptions .header-text"
    ).text();
    if (!SUPPORTED_VIEWS.includes(currentViewName)) {
      log("Unsupported view");
      return;
    }

    // Add Balance column.
    activityTable
      .find("thead tr th.amount")
      .after(
        '<th class="amount running-balance-ext"><span class="TABLEHEADER">Balance</span></th>'
      );

    const currentValue = $(".current-balance-value").text();

    // Find current balance and use it as running balance.
    // The following ID exists on the page if the user has more than one credit card.
    var runningBalance = amountToNumber(currentValue);

    // The following ID exists on the page if the user has only one credit card.
    if (isNaN(runningBalance)) {
      runningBalance = amountToNumber($("#accountCurrentBalanceValue").text());
    }

    if (isNaN(runningBalance)) {
      log("Unable to determine current balance");
    }

    log("Calculate and display running balance");

    // Calculate and display running balance for each transaction.
    $(transactions).each(function () {
      // Clone an Amount cell to easily create a similar-looking Balance cell.
      var balanceCell = $(this).find("td.amount").clone();
      balanceCell.addClass("running-balance-ext");
      balanceCell
        .find("span")
        .text(
          "$" +
            runningBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })
        );
      balanceCell.insertBefore($(this).find("td.util"));

      var transactionAmount = amountToNumber(
        $(this).find(".amount").first().text()
      );
      runningBalance -= transactionAmount;
    });
  }

  function amountToNumber(text) {
    return parseFloat(text.replace("\u2212", "-").replace(/[$,]+/g, ""));
  }

  function log(message) {
    console.info("CRB: " + message);
  }
};

var script = document.createElement("script");
script.type = "text/javascript";
script.textContent = "(" + main.toString() + ")();";
document.body.appendChild(script);
