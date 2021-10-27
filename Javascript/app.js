if (localStorage.getItem("productList") == null) {
    localStorage.setItem("productList", JSON.stringify([{"name":"Playadito 1kg","type":"yerba","code":1,"baseCost":534,"profit":0.2,"price":534.2,"tax":112.18,"totalPrice":646.38,"stock":99,"available":true},{"name":"Nobleza Gaucha 1kg","type":"yerba","code":2,"baseCost":407,"profit":0.2,"price":407.2,"tax":85.51,"totalPrice":492.71,"stock":99,"available":true},{"name":"Mañanita 1kg","type":"yerba","code":3,"baseCost":501,"profit":0.2,"price":501.2,"tax":105.25,"totalPrice":606.45,"stock":99,"available":true},{"name":"Taragüi 1kg","type":"yerba","code":4,"baseCost":501,"profit":0.2,"price":501.2,"tax":105.25,"totalPrice":606.45,"stock":99,"available":true},{"name":"Unión Liviana 1kg","type":"yerba","code":5,"baseCost":516.55,"profit":0.2,"price":516.75,"tax":108.52,"totalPrice":625.27,"stock":89,"available":true},{"name":"Union Suave 1kg","type":"yerba","code":6,"baseCost":496.9,"profit":0.2,"price":497.09999999999997,"tax":104.39,"totalPrice":601.49,"stock":99,"available":true},{"name":"La Tranquera 1kg","type":"yerba","code":7,"baseCost":452.9,"profit":0.2,"price":453.09999999999997,"tax":95.15,"totalPrice":548.25,"stock":1,"available":false}]))
} 

//Collapsa el menu con un slide toggle
$(".hamburgerButton").on("click", function (){
    $(".barraMenu").toggle(100)
})