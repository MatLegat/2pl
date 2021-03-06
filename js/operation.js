class Operation {
  constructor(type, data, tId = '') {
    this.type = type
    this.data = data
    this.tId = tId
  }

  get string() {
    if (this.type == 'd') {
      return 'DEADLOCK!'
    }
    return this.type + this.tId + '(' + this.data + ') '
  }
}
