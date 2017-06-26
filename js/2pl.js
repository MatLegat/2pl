let transactions = []
let count = 1
let newTransaction = new Transaction(count)
let locks = new LockController()

function getRandom(arr) {
  return arr[Math.floor((Math.random()*arr.length))]
}

function schedule() {
  reset();

  let runningTransactions = transactions.filter((t) => t.state == 'running')
  while (runningTransactions.length > 0) {
    const t = getRandom(runningTransactions)
    executeOperation(t.executeOp2PL(locks))
    runningTransactions = transactions.filter((t) => t.state == 'running')
  }
  if (transactions.filter((t) => t.state == 'waiting').length > 0) {
    // deadlock:
    executeOperation(new Operation('d'))
  }
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
    listHtml += '    <span class="T' + t.id + '">' + t.html2PL + '</span>'
    listHtml += '  </div>'
    listHtml += '</div>'

    removeHtml += '<option value="' + t.id + '">T' + t.id + '</option>'
  })
  $('#t-list').html(listHtml)
  $('#remove-t-id').html(removeHtml)
}

function reset() {
  locks = new LockController()
  transactions.forEach((t) => {
    t.reset()
  })
  // clear list:
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
  let classes = "op T" + operation.tId
  if (operation.type == 'r' || operation.type == 'w' || operation.type == 'd') {
    classes += ' font-weight-bold'
  }
  $("#data").append("<tr>");
  $("#data").append('<td class="' + classes + '">' + operation.string + "</td>");
  $("#data").append("</tr>");
}
