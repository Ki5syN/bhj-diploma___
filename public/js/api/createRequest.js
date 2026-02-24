/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = ({
	url,
	method = "GET",
	data = {},
	callback
}) => {
	const xhr = new XMLHttpRequest();
	xhr.responseType = "json";

	try {
		let finalUrl = url;

		if (method === "GET" && data && Object.keys(data).length) {
			const params = new URLSearchParams(data).toString();
			finalUrl += `?${params}`;
		}


		xhr.open(method, finalUrl);

		xhr.onload = () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				callback(null, xhr.response);
			} else {
				callback({
					status: xhr.status,
					message: xhr.statusText
				}, null);
			}
		};

		xhr.onerror = () => {
			callback({
				status: xhr.status,
				message: "Network Error"
			}, null);
		};

		if (method !== "GET") {
			const formData = new FormData();
			if (method !== "DELETE") {
				for (let key in data) {
					formData.append(key, data[key]);
				}
			}

			xhr.send(formData);
		} else {
			xhr.send();
		}



	} catch (err) {
		callback(err, null);
	}
};