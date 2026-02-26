/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = ({
    url,
    method = "GET",
    data = {},
    callback = () => {}
}) => {

    const xhr = new XMLHttpRequest();
    xhr.responseType = "json";

    let finalUrl = url;
    let formData = null;

    if (method === "GET" && Object.keys(data).length) {
        const params = new URLSearchParams(data).toString();
        finalUrl += `?${params}`;
    } else {
        formData = new FormData();
        for (let key in data) {
            formData.append(key, data[key]);
        }
    }

    try {

        xhr.open(method, finalUrl);

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    callback(null, xhr.response);
                } else {
                    callback(xhr.status, null);
                }
            }
        };

        xhr.onerror = () => {
            callback({
                status: xhr.status,
                message: "Network Error"
            }, null);
        };

        if (method !== "GET") {
            xhr.send(formData);
        } else {
            xhr.send();
        }

    } catch (err) {
        callback(err, null);
    }
};