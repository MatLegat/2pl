class Transaction {
  constructor(id, operations = []) {
    this.id = id
    this.operations = operations
  }

  addOperation(operation, index = null) {
    if (index == null) {
      this.operations.push(operation)
      // this.updateLocks()
    } else {
      this.operations.splice(index, 0, operation)
    }
  }

  removeLocks() {
    //FIXME não está removendo locks e unlocks, não sei pq
    let newOps = this.operations.filter(
      (op) => (op.type == 'r' || op.type == 'w')
    )
    console.log(this.operations);
  }

  updateLocks() {
    this.removeLocks()
    let lx = []
    let ls = []
    
    // identify needed locks:
    this.operations.forEach((op) => {
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
    for (let i = 0; i < this.operations.length; i++) {
      const op = this.operations[i]
      if (op.type == 'r' || op.type == 'w') {
        if (ls.includes(op.data)) {
          const newOp = new Operation('ls', op.data)
          this.addOperation(newOp, i)
          // remove data from ls list:
          ls.splice(ls.indexOf(op.data), 1)
        } else if (lx.includes(op.data)) {
          const newOp = new Operation('lx', op.data)
          this.addOperation(newOp, i)
          // remove data from ls list:
          lx.splice(lx.indexOf(op.data), 1)
        }
      }
    }


  }

  get string() {
    let string = ""
    this.operations.forEach((op) => {
      string += op.string(this.id)
    })
    return string
  }

  get empty() {
    return this.operations.length == 0
  }
}
