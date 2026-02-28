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
        xhr.onload = () => {            
            callback(null, xhr.response);                
        };

        xhr.onerror = () => {
            callback({
                status: xhr.status,
                message: "Network Error"
            }, null);
        
    }

    try {

        xhr.open(method, finalUrl);        

        xhr.send(formData);
        
    } catch (err) {
        callback(err, null);
    }
}
