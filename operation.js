class Operation {
  constructor(type, data) {
    this.type = type
    this.data = data
    // this.done = false
  }

  string(tId = '') {
    return this.type + tId + '(' + this.data + ') '
  }
}
