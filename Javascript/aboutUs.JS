// Este JS va a crear una lista de nombres que saca de una API
// URL de la API
let URLJSON = "https://jsonplaceholder.typicode.com/users"
// Llama a la API, si lo logra llamar, consigue una lista de 10 nombres
$.getJSON(URLJSON, function (answer, state) {
    if(state === "success"){
        let donerList = answer;
        // Crea la lista de nombres
        for(let i = 0; i<donerList.length; i++){
            let user = donerList[i]
            $("#donerList").append(`<li>${user.username} (${user.name})</li>`)
        }
    }
});
