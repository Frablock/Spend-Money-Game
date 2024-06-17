const default_file = "buyers.json";
const default_achats_file = "achats.json";

var buyersID = 0;

var selectElement;
var moneyElement;
var nameToShow;
var money;
var buyZone;
var headImg;

// Charger les données depuis les fichiers JSON
function loadJSON(filePath) {
    return new Promise((resolve, reject) => {
      fetch(filePath)
       .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
       .then(data => resolve(data))
       .catch(error => reject(error));
    });
  }

function sanitize(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    return text.replace(/[&<>"'/]/g, (match) => map[match]);
  }
  

function buy(item) {

}

function loadMoney() {
    loadJSON("./assets/data/"+default_file)
    .then(data => {
        moneyElement.textContent = data.buyers[buyersID].total_money+"€";
        money = data.buyers[buyersID].total_money;
        nameToShow.textContent = sanitize(data.buyers[buyersID].name);
        headImg.src = data.buyers[buyersID].img;
        headImg.alt = sanitize(data.buyers[buyersID].name);
    })
    .catch(error => {
        console.error('Erreur lors du chargement du fichier:', error);
    });
}

function createAchat(nom, prix, img) {
    var html = "<div class='achat_div' style='background-image: url(\"" + img + "\");'><p class=\"text_button\">" + sanitize(nom) + " - " + prix + "€</p></div>";
    buyZone.innerHTML += html;
}

function loadAchats() {
    loadJSON("./assets/data/"+default_achats_file)
    .then(data => {
        for (var i in data.achats) {
            createAchat(data.achats[i].nom, data.achats[i].prix, data.achats[i].img);
        }
    })
    .catch(error => {
        console.error('Erreur lors du chargement du fichier:', error);
    });
}

function load() {
    selectElement = document.getElementById('selectElement');
    moneyElement = document.getElementById('money');
    nameToShow = document.getElementById('name');
    buyZone = document.getElementById('buyZone');
    headImg = document.getElementById('headImg');

    var data = loadJSON("./assets/data/"+default_file);

    for (var i in data.buyers) {
        var newItem = "<li><img src=\""+data.buyers[i].img+"\" alt=\""+sanitize(data.buyers[i].name)+"\"><p>"+sanitize(data.buyers[i].name)+"</p></li>"
        selectElement.innerHTML += newItem;
    }

    loadAchats();
    loadMoney();
}