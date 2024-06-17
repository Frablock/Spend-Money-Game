const default_file = "buyers.json";
const default_achats_file = "achats.json";

var buyersID = 0;

var length_achats;
var achats_liste;
var liste_prix;

var moneyElement;
var nameToShow;
var money;
var buyZone;
var headImg;
var menu;

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

function changeBuyer(id) {
    buyersID = id;
    menu.style.display = 'none';
    loadMoney();
}

function change(itemId, event) {
    let elem = document.getElementById('numberInput'+itemId);
    console.log(event.target.value);

}

function sell(itemId) {
    let cost = liste_prix[itemId];
    money += cost;
    moneyElement.textContent = money +"€";
}

function buy(itemId) {
    let cost = liste_prix[itemId];
    if (money >= cost) {
        money -= cost;
        moneyElement.textContent = money +"€";
    } else {
        alert("Félicitations, Vous avez réussi à dépenser tout l'argent de "+nameToShow); // à changer
    }
}

function loadMoney() {
    loadJSON("./assets/data/"+default_file)
    .then(data => {
        moneyElement.textContent = data.buyers[buyersID].total_money+"€";
        money = data.buyers[buyersID].total_money;
        nameToShow.textContent = sanitize(data.buyers[buyersID].name);
        headImg.src = data.buyers[buyersID].img;
        headImg.alt = sanitize(data.buyers[buyersID].name);

        achats_liste = new Array(length_achats);
    })
    .catch(error => {
        console.error('Erreur lors du chargement du fichier:', error);
    });
}

function createAchat(id, nom, prix, img) {
    liste_prix[id] = prix;
    let html = "<div class='achat_div' style='background-image: url(\"" + img + "\");' id=\"achat_div"+id+"\"><p class=\"text_button\">" + sanitize(nom) + " - " + prix + "€</p><div><button disabled=\"disabled\" class=\"item-sell\" onclick=\"sell("+id+");\">Vendre</button> <input type=\"number\" class=\"item-input\" id=\"numberInput"+id+"\" onchange=\"change("+id+", event);\"> <button class=\"item-buy\" onclick=\"buy("+id+");\">Acheter</button></div></div>";
    buyZone.innerHTML += html;
}

function loadAchats() {
    liste_prix = new Array(length_achats);
    loadJSON("./assets/data/"+default_achats_file)
    .then(data => {
        for (let i in data.achats) {
            createAchat(i, data.achats[i].nom, data.achats[i].prix, data.achats[i].img);
        }
        length_achats = i+1;
    })
    .catch(error => {
        console.error('Erreur lors du chargement du fichier:', error);
    });
}

function load() {
    moneyElement = document.getElementById('money');
    nameToShow = document.getElementById('name');
    buyZone = document.getElementById('buyZone');
    headImg = document.getElementById('headImg');
    menu = document.getElementById('selectElement');

    loadJSON("./assets/data/"+default_file)
    .then(data => {
        for (let i in data.buyers) {
            let newItem = "<li onclick=\"changeBuyer("+i+");\" class=\"inline-container\"><img src=\""+data.buyers[i].img+"\" alt=\""+sanitize(data.buyers[i].name)+"\"><p>"+sanitize(data.buyers[i].name)+"</p></li>"
            menu.innerHTML += newItem;
        }
    })
    .catch(error => {
        console.error('Erreur lors du chargement du fichier:', error);
    });

    loadAchats();
    loadMoney();
}

function showMenu() {
    if (menu.style.display == 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
}