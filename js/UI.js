import Storage from './Storage.js'

class UI {
  constructor() {
    this.budgetFeedback = document.querySelector('.budget-feedback')
    this.expenseFeedback = document.querySelector('.expense-feedback')
    this.budgetForm = document.getElementById('budget-form')
    this.budgetInput = document.getElementById('budget-input')
    this.budgetAmount = document.getElementById('budget-amount')
    this.expenseAmount = document.getElementById('expense-amount')
    this.balance = document.getElementById('balance')
    this.balanceAmount = document.getElementById('balance-amount')
    this.expenseForm = document.getElementById('expense-form')
    this.expenseInput = document.getElementById('expense-input')
    this.amountInput = document.getElementById('amount-input')
    this.expenseList = document.getElementById('expense-list')
    this.feedbackTimeout = 5000

    this.itemList = Storage.getExpense()
    this.budget = Storage.getBudget()
  }

  // submit budget method
  submitBudgetForm() {
    const value = this.budgetInput.value

    if (value === '' || value < 0 || isNaN(value)) {
      this.#showFeedback(
        this.budgetFeedback,
        'value cannot be empty or negative'
      )
    } else {
      this.budgetAmount.textContent = value
      this.budget = Number(value)
      this.budgetInput.value = ''
      this.#calculateBalance()
      this.#renderListExpense()
      Storage.setBudget(this.budget)
    }
  }

  // submit expense method
  submitExpenseForm() {
    const expenseValue = this.expenseInput.value
    const amountValue = this.amountInput.value

    if (expenseValue === '' || amountValue === '' || Number(amountValue) <= 0) {
      this.#showFeedback(
        this.expenseFeedback,
        'value cannot be empty or negative'
      )
    } else {
      this.itemList.push({
        id: this.#generateUUID(),
        title: expenseValue,
        amount: amountValue,
      })

      Storage.setExpense(this.itemList)
      this.#calculateBalance()
      this.#renderListExpense()

      this.expenseInput.value = ''
      this.amountInput.value = ''
    }
  }

  // EDIT and DELETE
  handleEditOrDelete(e) {
    const icon = e.target.parentElement.getAttribute('class')
    const splitIcon = icon.split('-')[0]
    const id = e.target.parentElement.dataset.id

    if (splitIcon === 'edit') {
      this.#editElement(id)
    } else if (splitIcon === 'delete') {
      this.#deleteElement(id)
    }
  }

  loadData() {
    Storage.getExpense()
    this.#renderListExpense()
    this.#calculateBalance()
    this.budgetAmount.textContent = Storage.getBudget()
  }

  addEventListeners() {
    // new instance of UI Class

    // submit budget method
    this.budgetForm.addEventListener('submit', (event) => {
      event.preventDefault()
      this.submitBudgetForm()
    })

    // submit expense method
    this.expenseForm.addEventListener('submit', (event) => {
      event.preventDefault()
      this.submitExpenseForm()
    })

    //  expense click
    this.expenseList.addEventListener('click', (event) => {
      event.preventDefault()
      this.handleEditOrDelete(event)
    })

    this.loadData()
  }

  // PRIVATE
  #showFeedback(element, message) {
    element.classList.add('d-block')
    element.innerText = message
    setTimeout(() => {
      element.classList.remove('d-block')
    }, this.feedbackTimeout)
  }

  #generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      }
    )
  }
  // calculate balance
  #calculateBalance() {
    const budget = this.budget
    const expenses = JSON.parse(localStorage.getItem('expenses'))

    if (!expenses) {
      this.balanceAmount.textContent = budget
    } else {
      const totalExpenses = expenses.reduce((acc, curr) => {
        return (acc += Number(curr.amount))
      }, 0)
      this.balanceAmount.textContent = budget - totalExpenses
      this.expenseAmount.textContent = totalExpenses
    }
  }

  //render expense title & value
  #renderListExpense() {
    // Clear the existing list
    this.expenseList.innerHTML = ''

    if (this.itemList.length === 0) {
      this.expenseList.innerHTML = `
      <div class="expense">
          <div class="expense-item d-flex justify-content-center align-items-baseline mb-4">
              <h6 class="expense-title mb-0 text-uppercase list-item"> No expenses added yet</h6>              
          </div>
          <hr>
      </div> `
      return
    }

    this.itemList.forEach((item) => {
      const { id, title, amount } = item
      const singleExpense = `
        <div class="expense">
          <div class="expense-item d-flex justify-content-between align-items-baseline mb-4">
              <h6 class="expense-title mb-0 text-uppercase list-item"> ${title}</h6>
              <h5 class="expense-amount mb-0 list-item">${amount}</h5>
              <div class="expense-icons list-item">
                  <a href="#" class="edit-icon mx-2" data-id="${id}">
                      <i class="fas fa-edit"></i>
                  </a>
                  <a href="#" class="delete-icon" data-id="${id}">
                      <i class="fas fa-trash"></i>
                  </a>
              </div>
          </div>
          <hr>
      </div>  
      `
      this.expenseList.insertAdjacentHTML('beforeend', singleExpense)
    })
  }

  // edit element
  #editElement(id) {
    const findItem = this.itemList.find((item) => item.id === id)
    const removedItem = this.itemList.filter((item) => item.id !== id)

    this.expenseInput.value = findItem.title
    this.amountInput.value = findItem.amount

    this.itemList = removedItem
  }

  // delete element
  #deleteElement(id) {
    this.itemList = this.itemList.filter((item) => item.id !== id)
    Storage.deleteExpense(id)
    this.#calculateBalance()
    this.#renderListExpense()
  }
}

export default UI
