/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
	/**
	 * Вызывает родительский конструктор и
	 * метод renderAccountsList
	 * */
	constructor(element) {
		super(element)
	}

	/**
	 * Получает список счетов с помощью Account.list
	 * Обновляет в форме всплывающего окна выпадающий список
	 * */
	renderAccountsList() {
		let user = User.current()
		Account.list(user, (err, response) => {
			if (err) return;

			let accountList = this.element.querySelector(".accounts-select")

			response.data.forEach(e => {
				const {
					id,
					name,
					sum
				} = e
				accountList.insertAdjacentHTML("beforeEnd",
					`<option value="${id}">${name}</option>`
				)

			});
		})
	}

	/**
	 * Создаёт новую транзакцию (доход или расход)
	 * с помощью Transaction.create. По успешному результату
	 * вызывает App.update(), сбрасывает форму и закрывает окно,
	 * в котором находится форма
	 * */
	onSubmit(data) {
		Transaction.create(data, (err, response) => {
			if (err) return;
			if (response.success) {
				App.update()
				
				this.element.reset()

				if (this.element.id === "new-income-form") {
					App.getModal("newIncome").close();
				}

				if (this.element.id === "new-expense-form") {
					App.getModal("newExpense").close();
				}
			}
		})


	}
}