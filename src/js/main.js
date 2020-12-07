function submit(event) {
    event.preventDefault();
    let xhr = new XMLHttpRequest();
    let input = document.getElementById("text").value;
    let json = JSON.stringify({
        "name": input,
        "job": input
    });
    xhr.open("POST", "https://reqres.in/api/users", true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = function () {
        if(xhr.readyState === XMLHttpRequest.DONE && (xhr.status === 200 || xhr.status === 201)) {
            alert ("Запрос успешно выполнен (статус: " + xhr.status + ")");
        }
    };
    xhr.send(json);
}

const form = document.getElementById('form');
form.addEventListener('submit', submit);
