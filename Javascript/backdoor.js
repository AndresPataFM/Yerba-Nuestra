let productList
const check = function (){
        if (localStorage.getItem("productList") == null) {
        savedProducts();
    } else {
        productList = JSON.parse(localStorage.getItem("productList"));
        store.products = productList;
}
}
document.getElementById("npAdd").addEventListener("click", (e)=>{
    e.preventDefault()
    let name = document.getElementById("npName").value
    let type = document.getElementById("npType").value
    let code = Number(document.getElementById("npCode").value)
    let price = Number(document.getElementById("npPrice").value)
    let stock = Number(document.getElementById("npStock").value)
    store.addProduct(name, type, code, price, stock)
})
document.getElementById("rsRestock").addEventListener("click", (e)=>{
    e.preventDefault()
    let code = Number(document.getElementById("rsCode").value)
    let quantity = Number(document.getElementById("rsQuantity").value)
    store.restock(code, quantity)
})
document.getElementById("rpRemove").addEventListener("click", (e)=>{
    e.preventDefault()
    let code = Number(document.getElementById("rpCode").value)
    store.remove(code)
})
check()
