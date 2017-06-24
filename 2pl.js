let transactions = []
let count = 1
let newTransaction = new Transaction(count, [new Operation('r', 'A'), new Operation('r', 'B'), new Operation('w', 'B')])
newTransaction.updateLocks()
console.log(newTransaction);

function schedule() {
  clearList();

  executeOperation("r1(Y)");
  executeOperation("r2(X)");
  executeOperation("w1(Y)");
  executeOperation("w1(Z)");
}

function cancel() {
  $('#create').addClass('well-hidden')
  $('#remove').addClass('well-hidden')
  if (!newTransaction.empty) {
    newTransaction = new Transaction(count)
    $('#new-t-operations').text('')
  }
}

function addOperation() {
  let type = $('#new-t-type').val()
  let data = $('#new-t-data').val()

  newTransaction.addOperation(new Operation(type, data))
  $('#new-t-operations').text(newTransaction.string)
}

function addTransaction() {
  if (!newTransaction.empty) {
    transactions.push(newTransaction)
    console.log(transactions)
    count++
    cancel()
  }
  updateTransactions()
}

function clearList() {
  $("#dTable > tbody:last").children().remove();
}

function executeOperation(operation) {
  $("#data").append("<tr>");
  $("#data").append("<td>" + operation + "</td>");
  $("#data").append("</tr>");
}
