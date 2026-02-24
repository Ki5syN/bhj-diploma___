/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
	/**
	 * Если переданный элемент не существует,
	 * необходимо выкинуть ошибку.
	 * Сохраняет переданный элемент и регистрирует события
	 * через registerEvents()
	 * */
	constructor(element) {
		if (!element) {
			throw new Error("Ошибка")
		}

		this.element = element;

		this.registerEvents()
	}

	/**
	 * Вызывает метод render для отрисовки страницы
	 * */
	update() {
		if (this.lastOptions) {
			this.render(this.lastOptions);
		} else {
			return
		}
	}

	/**
	 * Отслеживает нажатие на кнопку удаления транзакции
	 * и удаления самого счёта. Внутри обработчика пользуйтесь
	 * методами TransactionsPage.removeTransaction и
	 * TransactionsPage.removeAccount соответственно
	 * */
	registerEvents() {
		this.element.addEventListener("click", event => {
			if (event.target.closest(".btn-danger")) {
				this.removeAccount()
			}
			if (event.target.closest(".transaction__remove")) {
				const button = event.target.closest(".transaction__remove");
				const id = button.dataset.id;
				this.removeTransaction(id);
			}
		})

	}

	/**
	 * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
	 * Если пользователь согласен удалить счёт, вызовите
	 * Account.remove, а также TransactionsPage.clear с
	 * пустыми данными для того, чтобы очистить страницу.
	 * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
	 * либо обновляйте только виджет со счетами и формы создания дохода и расхода
	 * для обновления приложения
	 * */
	removeAccount() {
		const result = confirm("Вы действительно хотите удалить счёт?");
		if (!result) return;
		const accountId = this.element.lastOptions.account_id
		console.log(accountId)


		Account.remove(accountId, (err, response) => {
			if (err) return;

			this.clear()
			App.updateWidgets();
			App.updateForms()
		})
	}

	/**
	 * Удаляет транзакцию (доход или расход). Требует
	 * подтверждеия действия (с помощью confirm()).
	 * По удалению транзакции вызовите метод App.update(),
	 * либо обновляйте текущую страницу (метод update) и виджет со счетами
	 * */
	removeTransaction(id) {

		const result = confirm("Вы действительно хотите удалить эту транзакцию?");
		if (!result) return;

		Transaction.remove(id, (err, response) => {
			if (err) return;
			if (response.success) {
				App.update()
			}

		})

	}

	/**
	 * С помощью Account.get() получает название счёта и отображает
	 * его через TransactionsPage.renderTitle.
	 * Получает список Transaction.list и полученные данные передаёт
	 * в TransactionsPage.renderTransactions()
	 * */
	render(options) {
		if (!options) return;
		this.element.lastOptions = options;
		const accountId = options.account_id;
		console.log(accountId)


		Account.get(accountId, (err, response) => {
			if (err || !response.success) return;
			console.log(response)
			this.renderTitle(response.data.name);


			Transaction.list({
				account_id: accountId
			}, (err, response) => {
				if (err || !response.success) return;
				console.log("Transactions:", response.data);
				this.renderTransactions(response.data);
			});
		});
	}

	/**
	 * Очищает страницу. Вызывает
	 * TransactionsPage.renderTransactions() с пустым массивом.
	 * Устанавливает заголовок: «Название счёта»
	 * */
	clear() {
		this.renderTransactions([]);
		this.renderTitle("Название счёта");
		this.lastOptions = null;
	}

	/**
	 * Устанавливает заголовок в элемент .content-title
	 * */
	renderTitle(name) {
		const title = this.element.querySelector(".content-title");
		title.textContent = name;
	}

	/**
	 * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
	 * в формат «10 марта 2019 г. в 03:20»
	 * */
	formatDate(date) {
		const [data, time] = date.split("T");
		const [year, namberMonth, day] = data.split("-");
		const [hour, min] = time.split(":");
		const months = [
			"января",
			"февраля",
			"марта",
			"апреля",
			"мая",
			"июня",
			"июля",
			"августа",
			"сентября",
			"октября",
			"ноября",
			"декабря"
		]

		const month = months[Number(namberMonth) - 1];
		return `${day} ${month} ${year} г. в ${hour}:${min}`
	}

	/**
	 * Формирует HTML-код транзакции (дохода или расхода).
	 * item - объект с информацией о транзакции
	 * */
	getTransactionHTML(item) {
		const {
			account_id,
			created_at,
			id,
			name,
			sum,
			type,
			user_id
		} = item;
		const data = this.formatDate(created_at);

		return `
      <div class="transaction transaction_${type} row">
        <div class="col-md-7 transaction__details">
          <div class="transaction__icon">
              <span class="fa fa-money fa-2x"></span>
          </div>
          <div class="transaction__info">
              <h4 class="transaction__title">${name}</h4>
              <div class="transaction__date">${data}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="transaction__summ">
            ${sum}
            <span class="currency">₽</span>
          </div>
        </div>
        <div class="col-md-2 transaction__controls">
            <button class="btn btn-danger transaction__remove" data-id="${id}">
                <i class="fa fa-trash"></i>  
            </button>
        </div>
      </div>
      `
	}

	/**
	 * Отрисовывает список транзакций на странице
	 * используя getTransactionHTML
	 * */
	renderTransactions(data) {
		const contentPlace = this.element.querySelector(".content");
		console.log(data)
		console.log(contentPlace)

		contentPlace.innerHTML = "";

		data.forEach(e => {
			contentPlace.insertAdjacentHTML(
				"beforeend",
				this.getTransactionHTML(e)
			);
		});

	};


}