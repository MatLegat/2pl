let transactions = []
let count = 1
let newTransaction = new Transaction(count)

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
    $('#new-t-operations-2pl').text('')
    $('.new-t-name').text('T' + count)
  }
}

function addOperation() {
  let type = $('#new-t-type').val()
  let data = $('#new-t-data').val()

  if (data != '') {
    newTransaction.addOperation(new Operation(type, data))
    $('#new-t-operations').text(newTransaction.string)
    $('#new-t-operations-2pl').text(newTransaction.string2PL)
    $('#new-t-data').val('')
  }
}

function updateList() {
  let listHtml = ''
  let removeHtml = ''
  transactions.forEach((t) => {
    listHtml += '<div class="row">'
    listHtml += '  <div class="col">'
    listHtml += '    <span class="T' + t.id + '">T' + t.id + '</span>'
    listHtml += '  </div>'
    listHtml += '  <div class="col">'
    listHtml += '    <span class="T' + t.id + '">' + t.string2PL + '</span>'
    listHtml += '  </div>'
    listHtml += '</div>'

    removeHtml += '<option value="' + t.id + '">T' + t.id + '</option>'
  })
  $('#t-list').html(listHtml)
  $('#remove-t-id').html(removeHtml)
}

function clearList() {
  $("#dTable > tbody:last").children().remove();
}

function addTransaction() {
  if (!newTransaction.empty) {
    transactions.push(newTransaction)
    count++
    updateList()
    cancel()
  }
}

function removeTransaction() {
  let id = $('#remove-t-id').val()

  if (id != null && id != '') {
    transactions = transactions.filter((t) => t.id != id)
    updateList()
    cancel()
  }
}

function executeOperation(operation) {
  $("#data").append("<tr>");
  $("#data").append("<td>" + operation + "</td>");
  $("#data").append("</tr>");
}
