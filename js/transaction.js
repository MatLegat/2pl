class Transaction {
  constructor(id, operations = []) {
    this.id = id
    this.operations = operations
    this.operations2PL = []
    this.updateLocks()
  }

  addOperation(operation, index = null) {
    operation.tId = this.id
    if (operation.type == 'r' || operation.type == 'w') {
      if (index == null) {
        this.operations.push(operation)
      } else {
        this.operations.splice(index, 0, operation)
      }
      this.updateLocks()
    } else {
      if (index == null) {
        this.operations2PL.push(operation)
      } else {
        this.operations2PL.splice(index, 0, operation)
      }
    }
  }

  removeLocks() {
    this.operations = this.operations.filter(
      (op) => (op.type == 'r' || op.type == 'w')
    )
  }

  updateLocks() {
    this.operations2PL = this.operations.slice()
    let lx = []  // lock exclusive missing
    let ls = []  // lock shared missing
    let u = []  // unlock missing

    // identify needed locks:
    this.operations2PL.forEach((op) => {
      if (op.type == 'r') {
        if (!lx.includes(op.data) && !ls.includes(op.data)) {
          ls.push(op.data)
        }
      } else if (op.type == 'w') {
        if (!lx.includes(op.data)) {
          lx.push(op.data)
        }
        if (ls.includes(op.data)) {
          // remove data from ls list:
          ls.splice(ls.indexOf(op.data), 1)
        }
      }
    })

    // insert locks:
    for (let i = 0; i < this.operations2PL.length; i++) {
      const op = this.operations2PL[i]
      if (op.type == 'r' || op.type == 'w') {
        let type = null
        if (ls.includes(op.data)) {
          type = 'ls'
        } else if (lx.includes(op.data)) {
          type = 'lx'
        }
        if (type != null) {
          u.push(op.data)
          const newOp = new Operation(type, op.data)
          this.addOperation(newOp, i)
          let list = (type == 'ls' ? ls : lx)
          // remove data from ls or lx list:
          list.splice(list.indexOf(op.data), 1)
        }
      }
    }

    // insert unlocks:
    for (let i = this.operations2PL.length - 1; i >= 0; i--) {
      const op = this.operations2PL[i]
      if (op.type == 'r' || op.type == 'w') {
        if (u.includes(op.data)) {
          const newOp = new Operation('u', op.data)
          this.addOperation(newOp, i+1)
          // remove data from u list:
          u.splice(u.indexOf(op.data), 1)
        }
      } else if (op.type == 'lx' || op.type == 'ls') {
        // insert every remaining unlock right after:
        u.reverse().forEach((data) => {
          const newOp = new Operation('u', data)
          this.addOperation(newOp, i+1)
        })
        u = []
        break
      }
    }

  }

  toString(list) {
    let string = ""
    list.forEach((op) => {
      string += op.string
    })
    return string
  }

  get string() {
    return this.toString(this.operations)
  }

  get string2PL() {
    return this.toString(this.operations2PL)
  }

  get empty() {
    return this.operations.length == 0
  }
}
