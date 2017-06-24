function schedule() {
  clearList();

  executeOperation("r1(Y)");
  executeOperation("r2(X)");
  executeOperation("w1(Y)");
  executeOperation("w1(Z)");
}

function clearList() {
  $("#dTable > tbody:last").children().remove();
}

function executeOperation(operation) {
  $("#data").append("<tr>");
  $("#data").append("<td>" + operation + "</td>");
  $("#data").append("</tr>");
}
