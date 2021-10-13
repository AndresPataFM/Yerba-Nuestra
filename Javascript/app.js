const pata = {
    round2: function(num){
        //redondea a 2 cifras
        return Math.round((num + Number.EPSILON) * 100) / 100
    },
    rounder: function(num, order){
        //redondea al orden elegido
        return Math.round((num + Number.EPSILON) * Math.pow(10, order)) / Math.pow(10, order)
    },
}


class Product{
    //Crea al producto
    constructor(name, type, code, price, stock){
        this.name = name;
        this.type = type;
        this.code = code;
        this.baseCost = price;
        this.profit = this.markUp(price)
        this.price = this.profit+price;
        this.tax = this.taxes(this.price)
        this.totalPrice = Math.round((this.price + this.tax + Number.EPSILON) * 100) / 100
        this.stock = stock;
        this.available = false;
    }
    //Cambia el booleano available dependiendo si hay stock o no
    empty = function(){
        if(this.stock<1){
            return this.available=false
        }
        if(this.stock>1){
            return this.available=true
        }
    }
    //agrega stock al producto y checkea si esta disponible
    //calcula el precio del markUp
    markUp= function(baseCost){
        let profit = 0.2
        return Math.round((profit + Number.EPSILON) * 100) / 100
    }
    // costo de impuestos
    taxes= function(sellCost){
        //por ahora solo hay IVA
        let taxIVA = 0.21
        let taxHolder = taxIVA*sellCost
        //return asi para q tenga 2 decimales
        return Math.round((taxHolder + Number.EPSILON) * 100) / 100
    }
    restock = function(x){
            this.stock+=x
            this.empty()
        }
}
/* A Agregar
1- Listo -Terminar sellproduct (importante el mejorar los prompts)
2- Listo -Terminar addproduct(mejorar validaciones con métodos de array y revisar validaciones de price) 
3-Agregar destinos de entrega, precios y metodos de agregar nuevos destinos
4- Listo -Agregar metodo de impuesto
5- Listo -Fijarse como hacer para comprar multiples mates sin hacer un choclo de codigo
6-Agregar un helper para la clase
*/
const store = {
    //Array que contiene todos los productos
    products: [],
    //Cantidad de productos en el array
    productQuantity: 0,
    validators: false,
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
        if(!Number.isInteger(stock)||stock<1){
            return console.log("Error: todos los stock son numeros integrales mayores a 0")
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
        this.products.push(new Product(name, type, code, price, stock));
        this.products[this.products.length-1].empty();
        this.productQuantity++;
        printer.changeProdList()
        return console.log(this.products[this.products.length-1])
    },
    //Contiene el precio de los delivery con IVA incluido
    locations: [
        {site: "Tienda", cost: 0, code:0},
        {site: "Capital federal Argentina", cost: 500, code:1},
        {site: "Provincia Argentina", cost: 1500, code:2},
        {site: "Mercosur", cost: 2500, code:3},
        {site: "Resto de Sudamérica", cost: 5000, code:4},
    ],
    location: {
        Location: class{
            constructor(site, cost, code){
                this.site = site;
                this.cost = cost;
                this.code = code;
            }
        },
        add: function(site, cost, code){
            //Luego le agrego validators, en estos momentos confiamos en el que agregue locations q sepa lo q hace
            locations.push(new this.Location(site, cost, code))
        },
    },
    sell: {
        //canasta con los productos a comprar
        basket: [],
        //guarda el precio total de la venta
        basketTotal: 0,
        //guarda el precio individual de cada sección
        basketPriceTotal: 0,
        basketProfit: 0,
        basketTaxesTotal: 0,
        deliveryTotal: 0,
        //crea los productos y cantidades a para que luego lo agreguen a la canasta
        BasketProduct: class {
            constructor(newProduct, newQuantity){
                this.product=newProduct;
                this.quantity=newQuantity;
                this.purchaseProfit=newQuantity*newProduct.profit;
                this.purchaseTax=newQuantity*newProduct.tax;
                this.purchaseTotal=newQuantity*newProduct.totalPrice;
            }
        },
        //si matchea el codigo trae el producto
        getProduct: function(code){
            let toBuy = {};
            toBuy = store.products.find(prod => prod.code === code)
            return toBuy
        },
        //agrega producto a la canasta
        addBasket: function(code, quantity){
            let productDesired = this.getProduct(code)
            let temporary = new this.BasketProduct(productDesired, quantity)
            this.basket.push(temporary)
            //el return solo esta para comprobar x consola
            return console.log(temporary)
        },
        //Actualiza los precios totales de la canasta
        updateBasket: function(){
            this.basket.forEach(x =>{
                this.basketPriceTotal+=x.purchaseTotal
                this.basketProfit+=x.purchaseProfit
                this.basketTaxesTotal+=x.purchaseTax
            })
            this.basketTotal = this.basketPriceTotal + this.basketProfit + this.basketTaxesTotal + this.deliveryTotal
            return console.log(this.basketTotal)
        },
        //Calcula el precio del delivery
        deliveryFind: function(deliveryCode){
            if(store.locations.some(loc =>{
                loc.code === code
            })){
                this.deliveryTotal=loc.price
                return loc.price
            }
        },
        //calcula el precio total de la canasta
        productPriceCalc: function(){
            let priceHolder = 0;
            for(let i=0; i<this.basket.length; i++){
                priceHolder+= basket[i].product.price * basket[i].quantity;
            };
            this.productPriceTotal = priceHolder
            return this.productPriceTotal
        },
        //calcula los impuestos totales de la compra
        taxCalc: function(){
            let taxHolder = 0
            this.basket.forEach(x =>{
                taxHolder += x.tax
            })
        },
        //Crea la lista de productos a vender que tengan stock
        deliveryList: function(){
            let list = "Los lugares de delivery son:"
            store.locations.forEach(x =>{
                list+= ` [${x.code}]${x.site},`
            })
            return list
        },
        //Crea la lista para el prompt de delivery
        productList: function(){
            let list = "Los productos en venta son:"
            store.products.forEach(x =>{
                if(x.stock>0){
                    list+= ` [${x.code}]${x.name} por ${x.totalPrice} pesos,`
                }
            })
            return list
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
        },
        reduceStock: function(){
            for(let i=0; i<store.products.length; i++){
                this.basket.forEach(x => {
                    if(store.products[i].code===x.product.code){
                        store.products[i].stock-=x.quantity
                    }
                })
            }
        },
        sellOne: function(){
            //Pedir un codigo de producto valido
            let codeValidator= true
            let codeToBuy = Number(prompt(`Gracias por comprar en Yerba Nuestra, por favor ingrese el codigo del producto que desea comprar([codigo]Nombre). ${this.productList()}`))
            //Se fija si el codigo esta en la lista de productos
            if(store.products.some(x => x.code === codeToBuy)){
                codeValidator = false
            }
            if(this.basket.some(x => x.product.code === codeToBuy)){
                codeToBuy = Number(prompt(`Ya tiene ese producto en canasta, por favor ingrese el codigo un producto distinto que desea comprar([codigo]Nombre). ${this.productList()}`))
                codeValidator = true
            }
            while(codeValidator){
                codeToBuy = Number(prompt(`Lo lamentamos, el codigo ingresado no es valido, por favor ingrese el codigo del producto que desea comprar([codigo]Nombre). ${this.productList()}`))
                if(store.products.some(x => x.code === codeToBuy)){
                    codeValidator = false
                }
                if(this.basket.some(x => x.product.code === codeToBuy)){
                    codeToBuy = Number(prompt(`Ya tiene ese producto en canasta, por favor ingrese el codigo un producto distinto que desea comprar([codigo]Nombre). ${this.productList()}`))
                    codeValidator = true
                }   
            }
            let productToBuy = this.getProduct(codeToBuy)
            let productToBuyStock = productToBuy.stock
            let quantityToBuy = Number(prompt(`Actualmente hay ${productToBuyStock} de ${productToBuy.name} a $${productToBuy.totalPrice}. Por favor ingrese la cantidad del producto que desea comprar.`))
            while(quantityToBuy<0||quantityToBuy>productToBuyStock){
                quantityToBuy = Number(prompt(`El valor ingresado no es valido. Actualmente hay ${productToBuyStock} de ${productToBuy.name}.Por favor ingrese la cantidad del producto que desea comprar.`))
            }
            if(confirm(`¿Desea agregar ${quantityToBuy} de ${productToBuy.name} por $${productToBuy.totalPrice*quantityToBuy} pesos (de esos $${productToBuy.tax*quantityToBuy} pesos son impuestos)?`)){
                this.addBasket(codeToBuy, quantityToBuy)
                this.updateBasket()
                return console.log(this.basket)
            }
            return console.log("Compra abortada")
        },
        selling: function(){
            this.sellOne()
            let validateMore = confirm("¿Desea agregar otro producto a la canasta?")
            while(validateMore){
                this.sellOne()
                validateMore = confirm("¿Desea agregar otro producto a la canasta?")
            }
            let deliveryCode = Number(prompt(`Por favor elija el código de su delivery ([codigo]Sitio precio). ${this.deliveryList()}`))
            while(!Number.isInteger(deliveryCode)||deliveryCode<0||deliveryCode>=store.locations.length){
                deliveryCode = Number(prompt(`Ese no es un codigo válido, por favor elija el código de su delivery ([codigo]Sitio precio). ${this.deliveryList()}`))
            }
            let locationIntermediary = store.locations.find(x => x.code === deliveryCode)
            let locationCost = locationIntermediary.cost*4
            this.deliveryTotal = locationIntermediary.cost
            if(locationCost<this.basketProfit){
                alert("¡Felicitaciones, usted califica para un delivery gratis!")
                this.deliveryTotal = 0
            }
            if(confirm(`Desea realizar esta compra de ${this.basket.length} tipo/s productos por $${this.basketTotal} pesos de los cuales $${this.basketTaxesTotal} pesos son por impuestos y $${this.deliveryTotal} pesos son del delivery.`)){
                alert("¡Gracias por su compra, vuelva pronto!")
                this.reduceStock()
                this.reset()
                return console.log("compra realizada")
            } else if(confirm("¿Desea volver a intentar la compra?")){
                this.selling()
            }
            return alert("¡Por favor vuelva pronto!")
        },
    },
    sort: function(order){
        switch(order){
            case 1:
                //ordenar por codigo
                store.products.sort((x, y)=>{
                    if(x.code>y.code){return 1}
                    if(x.code<y.code){return -1}
                    return 0
                })
                return console.log(store.products)
                break;
            case 2:
                 //ordenar por baseCost, por como estan codeado todos los precios, price, tax, profit, etc se ordenarian igual
                store.products.sort((x, y)=>{
                    if(x.baseCost>y.baseCost){return 1}
                    if(x.baseCost<y.baseCost){return -1}
                    return 0
                })
                return console.log(store.products)
                break;
                case 1:
            case 3:
            //ordenar por stock
                store.products.sort((x, y)=>{
                    if(x.stock>y.stock){return 1}
                    if(x.stock<y.stock){return -1}
                    return 0
                })
                return console.log(store.products)
                break;
            case 4:
                //ordenar por name
                store.products.sort((x, y)=>{return x.name.localeCompare(y.name)})
                return console.log(store.products)
                break;
            case 5:
                //ordenar por type
                store.products.sort((x, y)=>{return x.type.localeCompare(y.type)})
                return console.log(store.products)
                break;
            default:
                //ordenar por codigo
                console.log("ordenar por [parametro]: [1]code; [2]cost,price,etc; [3]stock; [4]name; [5]type")
                break;
        }
    }
}

const printer = {
    changeProdList: function(){
        let lista = document.getElementById("productList")
        lista.innerHTML = "";
        for (const item of store.products){
            let li = document.createElement("li")
            li.innerHTML = `[${item.code}]${item.name} a $${item.totalPrice} pesos`
            lista.appendChild(li);
        }
    },
}

function savedProducts(){
    store.addProduct("Playadito 1kg", "yerba", 1, 534, 99)
    store.addProduct("Nobleza Gaucha 1kg", "yerba", 2, 407, 99)
    store.addProduct("Mañanita 1kg", "yerba", 3, 501, 99)
    store.addProduct("Taragüi 1kg", "yerba", 4, 501, 99)
    store.addProduct("Unión Liviana 1kg", "yerba", 5, 516.55, 89)
    store.addProduct("Union Suave 1kg", "yerba", 6, 496.9, 99)
    store.addProduct("La Tranquera 1kg", "yerba", 7, 452.9, 99)
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
savedProducts()
// store.sell.selling()