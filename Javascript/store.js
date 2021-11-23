/* =================== GUÍA DE USO ===================
    La funcionalidad de esta pagina esta dada por 3 objetos: pata, store y storeBuilder

    || pata ||
        el objeto pata tiene 3 metodos para facilitar el codigo de la página
        pata.round2(numero)
            recibe un número y lo redondea a 2 cifras
        pata.rounder(numero, cifras)
            recibe un numero y la cantidad de cifras a la que se desea redondear
        pata.removeArrayItem(array, index)
            recibe un array y un index del elemento a remover del arrat. Remueve el elemento del array y te devuelve el array reducido

    || store ||
        es el objeto principal detras de la funcionalidad de la tienda. Aca es donde se manejan tanto los productos, como la canasta, como las funciones de sorteo.
        store.Product
            es una clase que utiliza nombre, tipo, codigo, precio y stock para crear un producto
            store.Product.empty()
                un metodo del objeto que se fija si tiene stock disponible [se pierde en local storage]
            store.Product.markUp(costoBase)
                es el metodo que calcula la ganancia al revender el producto, es mas facil cambiar la ganancia modificandolo
            store.Product.taxes(precioVenta)
                un metodo calcula todos los impuestos del producto
        store.products
            array que contiene todos los productos
        store.sold
            array que guarda las ventas realizadas
        store.productQuantity
            cuenta la cantidad total de productos
        store.addProduct(nombre, tipo, codigo, precio, stock)
            agrega un nuevo Product al array de store.products validando los valores ingresados
        store.checkStock(codigo)
            se fija si el producto con el codigo seleccionado tiene stock, cambiando el booleano available del producto
        store.restock(codigo, cantidad)
            aumenta el stock del producto por la cantidad seleccionada
        store.remove(codigo)
            remueve el producto con el codigo seleccionado
        store.sell
            contiene todo el proceso de venta
            store.sell.BasketProduct({Product}, cantidad)
                crea un producto con la cantidad a comprar a la canasta, calculando precios
            store.sell.basket
                un array que guarda todos los productos a comprar
            store.sell.basketTotal
                guarda el total a pagar de la canasta y delivery
            store.sell.basketPriceTotal
                guarda el total de la canasta de productos
            store.sell.basketProfit
                guarda la ganancia sacada de lso productos de la canasta
            store.sell.basketTaxesTotal
                guarda el total a impuestos a pagar
            store.sell.deliveryTotal
                guarda el total de delivery a pagar
            store.sell.getProduct(codigo)
                devuelve el {producto} con el codigo ingresado
            addBasket(codigo, cantidad)
                agrega  al array sore.sell.basket un BasketProduct con el codigo ingresado junto con la cantidad ingresada, cambiando los valores de precios mencionados (con updateBasket), guarda la canasta en local storage y llama una funcion para cambiar los productos que se muestran al usuario en la canasta.
            updateBasket()
                calcula los valores de basketTotal, basketPriceTotal, basketProfit, basketTaxesTotal con los valores de store.sell.basket
            removeBasket(codigo)
                remueve un producto de la canasta que tenga el codigo ingresado
            store.deliveryFind(codigo)
                deprecated, tendra uso si se vuelven a implemetar deliveries
            store.reset
                vacia store.sell.basket e iguala los valores a 0 de las sumatorias
            store.reduceStock
                reduce el stock de los productos en store.products con sus correspondientes en canasta(con respecto a la cantidad de estos)
            store.selling
                vende todos los productos dentro de la canasta
        store.rearrange(nro)
            ordena store.products dependiendo el nro ingresado, si no se agrega el valor para ordenar, envia un console.log con ayuda

    || storeBuilder ||
        storeBuilder.checkBasketTotal()
            metodo que cambia en store.html el valor total de la canasta
        store.changeBasketList
            metodo que imprime en store.html la canasta
        stoe.card
            metodo que imprime las cartas de los productos de store.products si estan disponibles(available===true)

*/ 
/*=================== ENTIDADES ===================*/

//Facilita calculos
const pata = {
    round2: function(num){
        //redondea a 2 cifras
        return Math.round((num + Number.EPSILON) * 100) / 100
    },
    rounder: function(num, order){
        //redondea al orden elegido
        return Math.round((num + Number.EPSILON) * Math.pow(10, order)) / Math.pow(10, order)
    },
    removeArrayItem: function(array, index){
        array.splice(index, 1)
        return array;
    },
}

const store = {
    Product: class{
        //Crea al producto
        constructor(name, type, code, price, stock){
            this.name = name;
            this.type = type;
            this.code = code;
            this.baseCost = price;
            this.profit = this.markUp(price)
            this.price = this.profit+price;
            this.tax = this.taxes(this.price)
            this.totalPrice = pata.round2(this.price + this.tax) 
            this.stock = stock;
            this.available = false;
        }
        //Cambia el booleano available dependiendo si hay stock o no
        empty = function(){
            if(this.stock<1){
                this.available=false
                return this.available
            }
            if(this.stock>=1){
                this.available=true
                return this.available
            }
        }
        //agrega stock al producto y checkea si esta disponible
        //calcula el precio del markUp
        markUp= function(baseCost){
            let profit = 0.2
            return pata.round2(baseCost*profit) 
        }
        // costo de impuestos
        taxes= function(sellCost){
            //por ahora solo hay IVA
            let taxIVA = 0.21
            let taxHolder = taxIVA*sellCost
            //return asi para q tenga 2 decimales
            return pata.round2(taxHolder) 
        }
    },
    //Array que contiene todos los productos
    products: [],
    //array que guarda las ventas realizadas
    sold: [],
    //Cantidad de productos en el array
    productQuantity: 0,
    //Agrega productos, aumenta la cantidad de productos y checkea si tiene en stock
    addProduct: function(name, type, code, price, stock){
        //validador de parametros ingresados
        let holder = [{parameter: "name", value: name}, {parameter: "type", value: type}, {parameter: "code", value: code},  {parameter: "price", value: price}, {parameter: "stock", value: stock}]
        let tester = []
        //pushea los undefined a un nuevo array
        for(let i=0; i<holder.length; i++){
            if(typeof holder[i].value === 'undefined'){
                tester.push(holder[i].parameter)
            }
        }
        //Dice los errores undefined al usuario en un console log en return, asi no crea un produto roto
        if(tester.length>0){
            let error = ""
            tester.forEach(obj => {
                error+=" " + obj + ","
            })
            return console.log("Hay parametros no definidos: "+error)
        }
        //Valida name
        if (typeof name !== 'string'){
            return console.log("Error: name tiene que ser un string")
        }
        //Valida type
        if(typeof(type) !== 'string'){
            return console.log("Error: type tiene que ser un string")
        }
        //Valida stock (se valida antes que codigo porque codigo tarda mas en validar)
        if(!Number.isInteger(stock)||stock<0){
            return console.log("Error: todos los stock son numeros integrales iguales o mayores a 0")
        }
        //Valida price
        if(price<=0){
            return console.log("Error: todos los price son numeros  mayores a 0")
        }
        if(!Number.isInteger(price*100)){
            price=Math.round((price + Number.EPSILON) * 100) / 100
            console.log(`Price fue redondeado a ${price} a los 2 decimales`)
        }
        //Valida el codigo
        if(!Number.isInteger(code)||code<1){
            return console.log("Error: todos los codigos son numeros integrales mayores o iguales a 0")
        }
        //¿Por que no funca? => No funca por los corchetes
        // if(store.products.some(prod =>{
        //     prod.code === code
        // })){
        //     return console.log("Error: ese codigo ya esta en uso")
        // }
        for(let i=0; i<this.products.length; i++){
            if(this.products[i].code === code){
                return console.log(`Error: el codigo ${code} ya esta en uso`)
            }
        }
        this.products.push(new this.Product(name, type, code, price, stock));
        this.products[this.products.length-1].empty();
        this.productQuantity++;
        store.rearrange(4)
        localStorage.setItem("productList", JSON.stringify(store.products))
        return console.log(this.products[this.products.length-1])
    },
    // se fija el stock del producto y marca si esta disponible
    checkStock: function(code){
        let productIndex = store.products.findIndex(item => item.code === code)
        store.products[productIndex].available = store.products[productIndex].stock>1
    },
    //Aumenta el stock de un producto
    restock: function(code, quantity){
        quantity = Number(quantity)
        if(!Number.isInteger(quantity) || quantity<1){
            return console.log("al aumentar el stock se tienen que usar números enteros mayores a 1")
        }
        let productIndex = this.products.findIndex(item => item.code === code)
        if(productIndex === -1){
            return console.log(`No hay producto con código ${code}`)
        }
        this.products[productIndex].stock += quantity
        store.checkStock(code)
        localStorage.setItem("productList", JSON.stringify(store.products))
        return console.log(`El nuevo stock de producto codigo ${this.products[productIndex].code} es de ${this.products[productIndex].stock}`)
    },
    remove: function(code){
        let productIndex = this.products.findIndex(item => item.code === code)
        if(productIndex === -1){
            return console.log(`No hay producto con código ${code}`)
        }
        pata.removeArrayItem(store.products, productIndex)
        localStorage.setItem("productList", JSON.stringify(store.products))
        return console.log(store.products)
    },
    sell: {
        // Es el constructor de productos apra la canasta
        BasketProduct: class {
            constructor(newProduct, newQuantity){
                this.product=newProduct;
                this.quantity=newQuantity;
                this.purchaseProfit=pata.round2(newQuantity*newProduct.profit);
                this.purchaseTax=pata.round2(newQuantity*newProduct.tax);
                this.purchaseTotal=pata.round2(newQuantity*newProduct.totalPrice);
            }
        },
        //canasta con los productos a comprar
        basket: [],
        //guarda el precio total de la venta
        basketTotal: 0,
        //guarda el precio individual de cada sección
        basketPriceTotal: 0,
        basketProfit: 0,
        basketTaxesTotal: 0,
        deliveryTotal: 0,
        //si matchea el codigo trae el producto
        getProduct: function(code){
            let toBuy = {};
            toBuy = store.products.find(prod => prod.code === code)
            return toBuy
        },
        //agrega producto a la canasta
        addBasket: function(code, quantity){
            if(store.sell.basket.some(x => x.product.code === code)){
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ya agregaste ese producto a tu canasta',
                })
                return console.log("error: duplicado en canasta")
            }
            let productDesired = this.getProduct(code)
            let temporary = new this.BasketProduct(productDesired, quantity)
            this.basket.push(temporary)
            localStorage.setItem("savedBasket", JSON.stringify(store.sell.basket))
            this.updateBasket()
            storeBuilder.changeBasketList()
            storeBuilder.card()
        },
        updateBasket: function(){
            this.basketPriceTotal = 0
            this.basketProfit = 0
            this.basketTaxesTotal = 0
            this.basketTotal = 0
            this.basket.forEach(x =>{
                this.basketPriceTotal+=x.purchaseTotal
                this.basketProfit+=x.purchaseProfit
                this.basketTaxesTotal+=x.purchaseTax
            })
            this.basketTotal = pata.round2(this.basketPriceTotal) + this.deliveryTotal
            storeBuilder.changeBasketTotal()
        },
        removeBasket: function(code){
            let indexToRemove = this.basket.findIndex(item => item.product.code === code)
            let newBasket = pata.removeArrayItem(store.sell.basket, indexToRemove);
            this.basket = newBasket
            localStorage.setItem("savedBasket", JSON.stringify(store.sell.basket))
            storeBuilder.changeBasketList()
        },
        //Actualiza los precios totales de la canasta
        //Calcula el precio del delivery
        deliveryFind: function(deliveryCode){
            //Actualmente se removio el delivery, se mantiene solo por si se desea volver a agregar
            if(store.locations.some(loc =>{
                loc.code === code
            })){
                this.deliveryTotal=loc.price
                return loc.price
            }
        },
        //Lleva la canasta al estado inicial (para cuando finaliza la compra)
        reset: function(){
            this.basket= []
            //guarda el precio total de la venta
            this.basketTotal= 0
            //guarda el precio individual de cada sección
            this.basketPriceTotal= 0
            this.basketProfit= 0
            this.basketTaxesTotal= 0
            this.deliveryTotal= 0
            localStorage.setItem("savedBasket", JSON.stringify(store.sell.basket))
        },
        reduceStock: function(){
            for(let i=0; i<store.products.length; i++){
                this.basket.forEach(x => {
                    if(store.products[i].code===x.product.code){
                        store.products[i].stock-=x.quantity
                        store.checkStock(store.products[i].code)
                    }
                })
            }
            localStorage.setItem("productList", JSON.stringify(store.products))
        },
        selling: function(){
            this.reduceStock()
            store.sold.push(store.sell.basket)
            localStorage.setItem("sold", JSON.stringify(store.sold))
            this.reset()
            storeBuilder.changeBasketList()
            storeBuilder.card()
            // mensaje de sweetAlert 2
            return Swal.fire('Venta realizada',
            '¡Muchas gracias por su compra!',
            'success')
        },
    },
    rearrange: function(order){
        switch(order){
            case 1:
                //ordenar por codigo
                store.products.sort((x, y)=>{
                    if(x.code>y.code){return 1}
                    if(x.code<y.code){return -1}
                    return 0
                })
                break;
            case 2:
                 //ordenar por baseCost, por como estan codeado todos los precios, price, tax, profit, etc se ordenarian igual
                store.products.sort((x, y)=>{
                    if(x.baseCost>y.baseCost){return 1}
                    if(x.baseCost<y.baseCost){return -1}
                    return 0
                })
                break;
            case 3:
                //ordenar por stock
                store.products.sort((x, y)=>{
                    if(x.stock>y.stock){return 1}
                    if(x.stock<y.stock){return -1}
                    return 0
                })
                break;
            case 4:
                //ordenar por name
                store.products.sort((x, y)=>{return x.name.localeCompare(y.name)})
                break;
            case 5:
                //ordenar por type
                store.products.sort((x, y)=>{return x.type.localeCompare(y.type)})
                break;
            case 6:
                //ordenar precio de mayor a menor
                store.products.sort((x, y)=>{
                    if(x.baseCost<y.baseCost){return 1}
                    if(x.baseCost>y.baseCost){return -1}
                    return 0
                })
            default:
                //ayuda
                console.log("ordenar por [parametro]: [1]code; [2]cost,price,etc; [3]stock; [4]name; [5]type; [6]cost decreciente")
                break;
        }
    }
}

// Es un objeto que crea los elementos html de la pagina con distintos metodos
const storeBuilder = {
    changeBasketTotal:function(){
        document.getElementById("totalPrice").innerText = `Total: $${store.sell.basketTotal}`
    },
    changeBasketList: function(){
        let lista = document.getElementById("basketHolder")
        lista.innerHTML = "";
        for (let i = 0; i<store.sell.basket.length; i++){
            let item = store.sell.basket[i]
            let li = document.createElement("li")
            li.textContent = `${item.quantity} unidades de ${item.product.name}($${item.product.totalPrice}) pro un total de ${item.purchaseTotal}   `
            let x = document.createElement("button")
            x.innerHTML= "X"
            x.addEventListener("click", (e)=>{
                e.preventDefault()
                store.sell.removeBasket(item.product.code)
                store.sell.updateBasket()
            })
            li.appendChild(x)
            lista.appendChild(li);
        }
    document.getElementById("totalPrice").innerText = `Total: $${store.sell.basketTotal}`
    },
    card: function(){
        let cardHolder = document.getElementById("productHolder")
        cardHolder.innerHTML = ""
        if(!store.products.some(x => x.available=== true)){
            Swal.fire({
                icon: 'error',
                title: 'Falta stock',
                text: 'Nos quedamos sin productos, conseguiremos stock a la brevedad',
            })
            return console.log("error: no hay productos disponibles")
        }
        store.rearrange(Number(document.getElementById("sort").value))
        for(let i=0; i<store.products.length; i++){
            //solo muestra el producto si esta dispononible
            if(store.products[i].available){
                //crea el esqueleto principal y le pone clase
                let card = document.createElement("div")
                card.classList.add("productCard")
                //crea la imagen del producto y la agrega
                let img = document.createElement("img")
                //esta de palceholder
                img.src = `./../img/products/${store.products[i].code}.webp`
                img.alt = `${store.products[i].name}`
                img.id = `img${store.products[i].code}`
                img.addEventListener("error", ()=>{
                    let temp = document.getElementById(`img${store.products[i].code}`)
                    temp.src = "./../img/yerbaPlaceholder.png"
                })
                card.appendChild(img)
                //crea un contenedor para el nombre, precio, submit para comprar y boton de compra
                let dataHolder = document.createElement("div")
                dataHolder.classList.add("dataHolder")
                //crea el nombre del producto y lo agrega a dataHolder
                let name = document.createElement("h4")
                name.textContent = `${store.products[i].name}`
                dataHolder.appendChild(name)
                //Muestra el stock
                let stock = document.createElement("p")
                stock.textContent = `${store.products[i].stock} en stock`
                dataHolder.appendChild(stock)
                //crea el precio y lo agrega a dataHolder despues del nombre
                let price = document.createElement("p")
                price.textContent = `$${store.products[i].totalPrice}`
                dataHolder.appendChild(price)
                // Se fija si hay stock
                if(store.products[i].stock>0){
                    //crea un form con un input y un boton si hay stock
                    // form
                    let form = document.createElement("form")
                    form.classList.add("productForm")
                    // input
                    let input = document.createElement("input")
                    input.type = "number"
                    input.placeholder = "Ingrese cantidad";
                    input.id = `sellProductInput${store.products[i].code}`
                    form.appendChild(input)
                    // boton
                    let button = document.createElement("button")
                    button.id = `sellProduct${store.products[i].code}`
                    button.dataset.target = `#addProductBtn${store.products[i].code}`;
                    button.addEventListener("click", (e)=>{
                        e.preventDefault()
                        let quantity = Number(document.getElementById(`sellProductInput${store.products[i].code}`).value)
                        if(store.products[i].stock<quantity){
                            error.innerText = "No podes comprar mas de lo que tenemos en stock"
                            return console.log("se trato de comprar mas de lo que hay")
                        } else if (quantity<1 || quantity == NaN){
                            error.innerText = "Las cantidades a comprar son números mayores a 1"
                        }
                        store.sell.addBasket(store.products[i].code, quantity)
                    })
                    button.innerText = "Comprar"
                    form.appendChild(button)
                    let error = document.createElement("p")
                    dataHolder.appendChild(form)
                    dataHolder.appendChild(error)
                } else{
                    let p = document.createElement("p")
                    p.classList.add("sinStock")
                    p.textContent = "Sin stock"
                    dataHolder.appendChild(p)
                }
                card.appendChild(dataHolder)
                cardHolder.appendChild(card)
            }
        }
    },
}

/*=================== VARIABLES ===================*/

//Variables de local storage
let productList;
let savedBasket;
let savedSold;

/*=================== FUNCIONES ===================*/

function savedProducts(){
    store.addProduct("Playadito 1kg", "yerba", 1, 534, 99)
    store.addProduct("Nobleza Gaucha 1kg", "yerba", 2, 407, 99)
    store.addProduct("Mañanita 1kg", "yerba", 3, 501, 99)
    store.addProduct("Taragüi 1kg", "yerba", 4, 501, 99)
    store.addProduct("Unión Liviana 1kg", "yerba", 5, 516.55, 89)
    store.addProduct("Union Suave 1kg", "yerba", 6, 496.9, 99)
    store.addProduct("La Tranquera 1kg", "yerba", 7, 452.9, 1)
    console.log(store.products)
}
function test(){
    console.log("agregar 1 producto")
    store.addProduct("test1", "yerba", 12, 54.24, 99)
    console.log("no definir 1")
    store.addProduct("test2", "yerba", 54.24, 99)
    console.log("codigo repetido")
    store.addProduct("test3", "yerba", 12, 54.24, 99)
    console.log("nombre no es string")
    store.addProduct(4, "yerba", 13, 54.24, 99)
    console.log("tipo no es string")
    store.addProduct("test5", 5, 14, 54.24, 99)
    console.log("costo mas de 2 decimales")
    store.addProduct("test6", "yerba", 15, 54.242, 99)
    console.log("stock negativo")
    store.addProduct("test7", "yerba", 16, 54.24, -99)
    console.log(store.products)
}

//hace local storage
if (localStorage.getItem("productList") == null) {
    savedProducts();
} else {
    productList = JSON.parse(localStorage.getItem("productList"));
    store.products = productList;
}

if (localStorage.getItem("savedBasket") == null) {
    savedBasket = store.sell.basket
} else {
    savedBasket = JSON.parse(localStorage.getItem("savedBasket"));
    store.sell.basket = savedBasket;
}

if(localStorage.getItem("sold") == null){
    savedSold = store.sold
    localStorage.setItem("sold", JSON.stringify(store.sold))
} else {
    savedSold =  JSON.parse(localStorage.getItem("sold"));
    store.sold = savedSold
}

// Como se utiliza tambien en el backdoor, esto se asegura que no trate de dar funcionalidad a componentes que no existen
if(document.getElementById("totalPrice") !== null){
    // Pone el precio a la canasta
    document.getElementById("totalPrice").innerText = `Total: $${store.sell.basketTotal}`
    // Botones
    document.getElementById("purchaseButton").onclick = ()=>{
        store.sell.selling()
    }
    document.getElementById("emptyBasket").onclick = ()=>{
        store.sell.reset()
        window.location.reload()
    }
    document.getElementById("sort").addEventListener("change", ()=>{
        store.rearrange(Number(document.getElementById("sort").value))
        storeBuilder.card()
    })
    storeBuilder.card()
    storeBuilder.changeBasketList()
    store.sell.updateBasket()
} else {console.log("Estas en el backdoor")}
