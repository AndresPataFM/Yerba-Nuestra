export default function footerBuilder(){
    const multimedia = [{name:"Twitter", svg:"./../img/multimedia/twitter.svg", link:"#"}, {name:"Github", svg:"./../img/multimedia/github.svg", link:"https://github.com/AndresPataFM"}, {name:"instagram", svg:"./../img/multimedia/instagram.svg", link:"#"}, {name:"linkedin", svg:"./../img/multimedia/linkedin.svg", link:"https://www.linkedin.com/in/andr%C3%A9s-pata-fraile-de-manterola-b50ba9191/"}]
    for(let i=0; i<multimedia.length; i++){
        let media = multimedia[i]
        $("footer:first").append(`<a href="${media.link}" target="_blank"><img src="${media.svg}" alt="${media.name}" class="svgMultimedia multi${i}"></a>`)
    }
}