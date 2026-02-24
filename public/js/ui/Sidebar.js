/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
	/**
	 * Запускает initAuthLinks и initToggleButton
	 * */
	static init() {
		this.initAuthLinks();
		this.initToggleButton();
	}

	/**
	 * Отвечает за скрытие/показа боковой колонки:
	 * переключает два класса для body: sidebar-open и sidebar-collapse
	 * при нажатии на кнопку .sidebar-toggle  
	 * */
	static initToggleButton() {
		document.addEventListener("click", event => {
			const bodyEl = document.querySelector(".skin-blue")

			if (event.target.closest(".sidebar-toggle")) {
				bodyEl.classList.toggle("sidebar-open");
				bodyEl.classList.toggle("sidebar-collapse");

			}
		})
	}

	/**
	 * При нажатии на кнопку входа, показывает окно входа
	 * (через найденное в App.getModal)
	 * При нажатии на кнопку регастрации показывает окно регистрации
	 * При нажатии на кнопку выхода вызывает User.logout и по успешному
	 * выходу устанавливает App.setState( 'init' )
	 * */
	static initAuthLinks() {

		document.addEventListener("click", event => {
			if (event.target.closest(".menu-item_register")) {
				App.getModal("register").open();
			}

			if (event.target.closest(".menu-item_login")) {
				App.getModal("login").open();
			}

			if (event.target.closest(".menu-item_logout")) {
				User.logout((err, response) => {
					if (response.success) {
						App.setState("init");
					}
				})

			}
		})
	}
}