class Menu{

    constructor(){
        document.getElementById('container').classList.remove('block');
        document.getElementById('menu').classList.add('block');
    }
}

module.exports= Menu;

//Exemple de module à exporter avec un serveur nodeJS