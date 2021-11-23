export default function headerBuilder(){
    //Busca el header
    let header = document.getElementsByTagName("header")[0]
    //crea y agrega la primera img
    let linkIndex = document.createElement("a")
    linkIndex.href= "./../index.html"
    linkIndex.classList.add("headerLink")
    let imgMate = document.createElement("img")
    imgMate.classList.add("logo")
    imgMate.alt = "logo"
    imgMate.src = "./../img/mateLogo.svg"
    imgMate.classList.add("logo")
    linkIndex.appendChild(imgMate)
    header.appendChild(linkIndex)
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
    let menuToggle = document.createElement("div")
    menuToggle.classList="menuToggle"
    menuToggle.appendChild(menu)
    nav.appendChild(menuToggle)
    menuHolder.appendChild(nav)
    header.appendChild(menuHolder)
    //Crea link a backoffice
    let backoffice = document.createElement("a")
    backoffice.href= "./backdoor.html"
    backoffice.classList.add("headerLink")
    //Crea la segunda imagen
    let imgBeret = document.createElement("img")
    imgBeret.classList.add("boina")
    imgBeret.alt = "boina"
    imgBeret.src = "./../img/boina.svg"
    imgBeret.classList.add("boina")
    backoffice.appendChild(imgBeret)
    header.appendChild(backoffice)
    //hace que el menu collapse o apareza con slide toggle para mobile, si se usa el botton, no desaparece luego porque sobreescribe el css,
    $(".hamburgerButton").on("click", function (){
        $(".menuToggle").toggle(100)
        $(".hamburgerButton").css("display", "block")
    })
}
