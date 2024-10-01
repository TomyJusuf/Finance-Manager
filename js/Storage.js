class Storage {
  static getBudget(defaultLimit = 0) {
    let limitBudget
    if (localStorage.getItem('budget') === null) {
      limitBudget = defaultLimit
    } else {
      limitBudget = JSON.parse(localStorage.getItem('budget'))
    }
    return limitBudget
  }

  static setBudget(limit) {
    localStorage.setItem('budget', limit)
  }

  // Cache expenses when retrieved
  static getExpense() {
    if (!Storage.expensesCache) {
      Storage.expensesCache = JSON.parse(localStorage.getItem('expenses')) || []
    }
    return Storage.expensesCache
  }

  // Reset cache after updating expenses
  static setExpense(expense) {
    Storage.expensesCache = expense
    localStorage.setItem('expenses', JSON.stringify(expense))
  }

  static deleteExpense(id) {
    const expense = JSON.parse(localStorage.getItem('expenses') || [])
    const filteredExpense = expense.filter((item) => item.id !== id)
    localStorage.setItem('expenses', JSON.stringify(filteredExpense))
  }
}

export default Storage
