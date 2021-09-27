//Globales horribles que no merecen existir
let basket = 0;

function mateSelector(itemNumber){
    // Esta Funcion retorna el nombre del mate que se eligio a comprar con el prompt
    let validator = true;
    let order = Number(itemNumber)
    while(validator){
        switch(order){
            case 1:
                validator = false;
                return "Playadito";
                break;
            case 2:
                validator = false;
                return "Nobleza Gaucha";
                break;
            case 3:
                validator = false;
                return "Mañanita";
                break;
            case 4:
                validator = false;
                return "Taragüi";
                break;
            case 5:
                validator = false;
                return "Unión Liviana";
                break;
            case 6:
                validator = false;
                return "Union Suave";
                break;
            case 7:
                validator = false;
                return "La Tranquera";
                break;
            default:
                order=Number(prompt("El codigo no es válido: Por favor ingrese el código del mate que desea comprar: [1]Playadito, [2]Nobleza Gaucha, [3]Mañanita, [4]Taragüi, [5]Unión Liviana, [6]Union Suave, [7]La Tranquera"));
                break;
        }
    }
}
function quantity(){
    let validator = true
    let cantidad = Number(prompt(`¿Cuantos packetes de yerba desea comprar?`))
    do{
        if(Number.isInteger(cantidad)&&cantidad>0){
            validator = false
        } else{
            cantidad = Number(prompt("Ingrese un número válido por favor."))
        }
    } while(validator){}
    return cantidad;
}
function baseCost(item){
    // Esta función retorna el precio base del mate seleccionado a comprar que paga la tienda para comprarlo
    switch(item){
        case "Playadito":
            return 534;
            break;
        case "Nobleza Gaucha":
            return 407;
            break;
        case "Mañanita":
            return 501;
            break;
        case "Taragüi":
            return 501;
            break;
        case "Unión Liviana":
            return 516.55;
            break;
        case "Union Suave":
            return 496.9;
            break;
        case "La Tranquera":
            return 452.9;
            break;
        default:
            return alert("Lo sentimos, el programa se encontro con un error, por favor reinicie la página e intente nuevamente.");
            break;
    }
}

// Aumenta el precio para que la tienda tenga ganancia
const markUp = basePrice => Math.round(basePrice*0.2);

//Agrega el IVA
const impuestos = midPrice => Math.round(midPrice*0.21);

//Calcula el costo del envio
function shippingCost(destination){
    switch(destination){
        case 1:
            return 500
            break;
        case 2: 
            return 1500
            break;
        case 3:
            return 2000
            break;
        case 4:
            return 5000
            break;
        default:
            return 0
            break;
    }
}

//Combierte el numero de destination a palabras
function destinationName(destination){
    switch(destination){
        case 1:
            return "Capital federal Argentina"
            break;
        case 2: 
            return "Provincia Argentina"
            break;
        case 3:
            return "Mercosur"
            break;
        case 4:
            return "Resto de Sudamérica"
            break;
        default:
            return "Tienda"
            break;
    }
}

//Comprar 1 tipo de mate
function buyingMate(){
    let currentCost = 0;
    let elegirMate = Number(prompt("Por favor ingrese el código del mate que desea comprar: [1]Playadito, [2]Nobleza Gaucha, [3]Mañanita, [4]Taragüi, [5]Unión Liviana, [6]Union Suave, [7]La Tranquera"))
    let currentMate = mateSelector(elegirMate);
    costs=baseCost(currentMate)
    let cantidad = 0;
    cantidad = quantity()
    currentCost += costs*cantidad;
    let taxes= impuestos(currentCost);
    let winings= markUp(currentCost);
    let locationCode = Number(prompt("Elija la opción de su delivery: [1]Capital federal Argentina [2]Provincia Argentina [3]Mercosur [4]Resto de Sudamérica [0]Deseo buscarlo en la tienda"))
    let validatorDestination =  true
    do{
        if(locationCode===0||locationCode===1|locationCode===2||locationCode===3||locationCode===4){
            validatorDestination=false
        } else {
            locationCode = Number(prompt("Elija la opción de su delivery: [1]Capital federal Argentina [2]Provincia Argentina [3]Mercosur [4]Resto de Sudamérica [0]Deseo buscarlo en la tienda"))
        }
    }while(validatorDestination){}
    let shipping= shippingCost(locationCode);
    let locationName= destinationName(locationCode)
    if((shipping*4)<winings){
        alert("¡Felicitaciones, califica para envio grátis a su destino!")
        shipping=0;
    }
    currentCost+=taxes+winings+shipping
    let finalTest = ""
    
        finalTest= confirm(`El precio de ${cantidad} bolsas de ${currentMate} es de ${currentCost} pesos de los cuales ${taxes} pesos son impuestos con entrega a ${locationName}, desea proceder con el pago?`)
        if(finalTest){
            alert(`Gracias por su compra, los ${currentCost} pesos se agregaran a la canasta para que prosiga con su pago.`)
            return basket+=currentCost
        }else{
            if(confirm("¿Desea volver a comprar?")){
                buyingMate()
            }else{
                alert("¡Esperamos que vuelva pronto!")
            }
        }
}

buyingMate()