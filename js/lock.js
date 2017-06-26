class Lock {
  constructor(data, transaction, type) {
    this.data = data
    this.transactions = [transaction]
    this.type = type
    this.waiting = []
  }

  add(transaction, type) {
    if (this.transactions.length == 0) {
      this.type = type
    }
    if (!this.transactions.includes(transaction)) {
      if (this.transactions.length > 0 && (type == 'lx' || this.type == 'lx')) {
        // block and wait
        this.waiting.push(new Lock(this.data, transaction, type))
        transaction.state = 'waiting'
        return false
      } else {
        this.transactions.push(transaction)
      }
    }

    return true
  }

  remove(transaction) {
    const index = this.transactions.indexOf(transaction)
    if (index == -1) {
      return false
    }
    // remove from array:
    this.transactions.splice(index, 1)
    if (this.waiting.length > 0) {
      const next = this.waiting[0]
      this.type = next.type
      if (next.type == 'ls') {
        // unblock every transaction waiting for ls
        const ls = this.waiting.filter((l) => l.type == 'ls')
        ls.forEach((l) => {
          l.transactions.forEach((t) => {
            this.transactions.push(t)
            t.state = 'running'
          })
        })
        // keep only lx waiting
        this.waiting = this.waiting.filter((l) => l.type == 'lx')
      } else {
        // unblock next transactions waiting for lx
        next.transactions.forEach((t) => {
          this.transactions.push(t)
          t.state = 'running'
        })
        // remove from waiting
        this.waiting.shift()
      }
    }
    return true
  }

}

class LockController {
  constructor() {
    this.locks = {}
  }

  lock(transaction, data, type) {
    if (this.locks[data] != null) {
      return this.locks[data].add(transaction, type)
    } else {
      this.locks[data] = new Lock(data, transaction, type)
      return true
    }
  }

  unlock(transaction, data) {
    if (this.locks[data]) {
      return this.locks[data].remove(transaction)
    }
    return false
  }


}
