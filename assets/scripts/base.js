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

function formatPrice(price) {
    let str = price.toString();
    str = str.split('').reverse().join('');
    let result = '';
    for (let i = 0; i < str.length; i += 3) {
        result += str.substr(i, 3) + '.';
    }
    str = result.split('').reverse().join('');
    str = str.substring(1);
    return str;
}

function change(itemId, event) {
    let cost = liste_prix[itemId];
    let numberInput = document.getElementById("numberInput"+itemId);
    if (event.target.value > achats_liste[itemId]) {
        let calc = event.target.value - achats_liste[itemId];
        if (money >= cost * calc) {
            money -= cost * calc;
            moneyElement.textContent = formatPrice(money) +"€";
            achats_liste[itemId] +=calc;
        } else {
            alert("Félicitations, Vous avez réussi à dépenser tout l'argent de "+nameToShow); // à changer
        }
    } else {
        let calc = achats_liste[itemId] - event.target.value;
        money += cost * calc;
        moneyElement.textContent = formatPrice(money) +"€";
        achats_liste[itemId] -=calc;
    }
    numberInput.valueAsNumber = achats_liste[itemId];
}

function sell(itemId) {
    let numberInput = document.getElementById("numberInput"+itemId);
    let cost = liste_prix[itemId];
    let a = achats_liste[itemId];
    if (a > 0) {
        money += cost;
        moneyElement.textContent = money +"€";
        numberInput.valueAsNumber -= 1;
        achats_liste[itemId] -=1;
    }
}

function buy(itemId) {
    let cost = liste_prix[itemId];
    let numberInput = document.getElementById("numberInput"+itemId);
    if (money >= cost) {
        money -= cost;
        moneyElement.textContent = money +"€";
        numberInput.valueAsNumber += 1;
        achats_liste[itemId] +=1;
    } else {
        alert("Félicitations, Vous avez réussi à dépenser tout l'argent de "+nameToShow); // à changer
    }
}

function loadMoney() {
    loadJSON("./assets/data/"+default_file)
    .then(data => {
        moneyElement.textContent = formatPrice(data.buyers[buyersID].total_money)+"€";
        money = data.buyers[buyersID].total_money;
        nameToShow.textContent = sanitize(data.buyers[buyersID].name);
        headImg.src = data.buyers[buyersID].img;
        headImg.alt = sanitize(data.buyers[buyersID].name);

        achats_liste = Array(length_achats).fill(0)
    })
    .catch(error => {
        console.error('Erreur lors du chargement du fichier:', error);
    });
}

function createAchat(id, nom, prix, img) {
    liste_prix[id] = prix;
    let html = "<div class='achat_div' style='background-image: url(\"" + img + "\");' id=\"achat_div"+id+"\"><p class=\"text_button\">" + sanitize(nom) + " - " + formatPrice(prix) + "€</p><div class=\"action\"><button class=\"item-sell\" onclick=\"sell("+id+");\">Vendre</button> <input type=\"number\" class=\"item-input\" id=\"numberInput"+id+"\" onchange=\"change("+id+", event);\" value=\"0\" min=\"0\"> <button class=\"item-buy\" onclick=\"buy("+id+");\">Acheter</button></div></div>";
    buyZone.innerHTML += html;
}

function loadAchats() {
    liste_prix = new Array(length_achats);
    loadJSON("./assets/data/"+default_achats_file)
    .then(data => {
        for (var i in data.achats) {
            createAchat(i, data.achats[i].nom, data.achats[i].prix, data.achats[i].img);
        }
        length_achats = data.achats.length;
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