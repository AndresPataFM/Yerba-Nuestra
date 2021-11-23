//Agregar Productos
document.getElementById("npAdd").addEventListener("click", (e)=>{
    e.preventDefault()
    let name = document.getElementById("npName").value
    let type = document.getElementById("npType").value
    let code = Number(document.getElementById("npCode").value)
    let price = Number(document.getElementById("npPrice").value)
    let stock = Number(document.getElementById("npStock").value)
    store.addProduct(name, type, code, price, stock)
})
//Remover Productos
document.getElementById("rpRemove").addEventListener("click", (e)=>{
    e.preventDefault()
    let code = Number(document.getElementById("rpCode").value)
    store.remove(code)
})
//Reducir Stock
document.getElementById("rsRestock").addEventListener("click", (e)=>{
    e.preventDefault()
    let code = Number(document.getElementById("rsCode").value)
    let quantity = Number(document.getElementById("rsQuantity").value)
    store.restock(code, quantity)
})
//Cambia el available
document.getElementById("caChangeAvailable").addEventListener("click", (e)=>{
    e.preventDefault()
    let code = Number(document.getElementById("caCode").value)
    let available = Number(document.getElementById("caAvailable").value)===1
    let index = store.products.findIndex(item => item.code === code)
    store.products[index].available = available
    console.log(store.products[index])
})
//Lista de Productos
document.getElementById("backdoorList").addEventListener("click", (e)=>{
    e.preventDefault()
    console.log(store.products)
})