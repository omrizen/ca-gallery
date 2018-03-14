console.log('Starting up');

$("#mainNav").addClass("navbar-shrink");
var gProjs = [
    {
        "id": "sokoban",
        "name": "Sokoban",
        "title": "Better push those boxes",
        "desc": "lorem ipsum lorem ipsum lorem ipsum",
        "url": "projs/sokoban",
        "publishedAt": 1448693940000,
        "labels": ["Matrixes", "keyboard events"],
        image: 'img/portfolio/sokoban.jpg'

    },
    {
        "id": "minesweeper",
        "name": "Minesweeper",
        "title": "Be carefull, you are about to explode...",
        "desc": "lorem ipsum lorem ipsum lorem ipsum",
        "url": "projs/sokoban",
        "publishedAt": 1448693940000,
        "labels": ["Matrixes", "keyboard events"], 
        image: 'img/portfolio/minesweeper.jpg'
    }
]

renderPortfolio();


function renderPortfolio(){
    elPortObjs = document.querySelectorAll ('.portfolio-item');
    console.log ('portObjs' , elPortObjs );
    
    for (var i=0; i<elPortObjs.length;i++){
        if (gProjs[i]){
            renderPortObj (elPortObjs[i] , gProjs[i] );
        };
    }
}

function renderPortObj(elObj , proj){
    elPortCapt = elObj.querySelector('.portfolio-caption');
    var elName = $(elPortCapt).children()[0];
    var elTitle = $(elPortCapt).children()[1];
    var elImg = $(elObj).find('img');
    console.log ('elImg', elImg);

    elName.innerHTML = proj.name;
    elTitle.innerHTML = proj.title;
    elImg.attr('src' , proj.image);

    
    

    console.log ('elName' , elName);

}
