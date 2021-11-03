export default function headerBuilder(){
    //Busca el header
    let header = document.getElementsByTagName("header")[0]
    //crea y agrega la primera img
    let imgMate = document.createElement("img")
    imgMate.classList.add("logo")
    imgMate.alt = "logo"
    imgMate.src = "./../img/mateLogo.svg"
    header.appendChild(imgMate)
    //crea el nav, menuuholder y sus componentes
    let nav = document.createElement("nav")
    let menuHolder = document.createElement("div")
    menuHolder.classList.add("menuHolder")
    let title = document.createElement("h1")
    title.innerText = "Yerba Nuestra"
    menuHolder.appendChild(title)
    //Crea el boton hamburguesa
    let hamburger = document.createElement("button")
    hamburger.innerText = "☰"
    hamburger.classList.add("hamburgerButton")
    nav.appendChild(hamburger)
    //crea el ul, li y a
    let menu = document.createElement("ul")
    menu.classList.add("barraMenu")
    let links = [{link:"./../index.html", name:"Home"}, {link:"./store.html", name:"Productos"}, {link:"./aboutUs.html", name:"Nosotros"}, {link:"./contact.html" , name:"Contacto"}]
    links.forEach(x =>{
        let li = document.createElement("li")
        let a = document.createElement("a")
        a.innerText = x.name
        a.href= x.link
        li.appendChild(a)
        menu.appendChild(li)
    })
    nav.appendChild(menu)
    let navContainer
    menuHolder.appendChild(nav)
    header.appendChild(menuHolder)
    //Crea la segunda imagen
    let imgBeret = document.createElement("img")
    imgBeret.classList.add("boina")
    imgBeret.alt = "boina"
    imgBeret.src = "./../img/boina.svg"
    header.appendChild(imgBeret)
    //hace que el menu collapse o apareza con slide toggle para mobile
    $(".hamburgerButton").on("click", function (){
        $(".barraMenu").toggle(100)
    })
}
