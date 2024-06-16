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

const default_file = "BernardArnaud.json";
const default_achats_file = "achats.json";
var selectElement;
var moneyElement;
var nameToShow;
var money;

function buy(item) {

}

function loadMoney() {
    loadJSON("./assets/data/"+selectElement.value)
    .then(data => {
        moneyElement.textContent = ""+data.total_money;
        money = data.total_money;
    })
    .catch(error => {
        console.error('Erreur lors du chargement du fichier:', error);
    });
}

function load() {
    selectElement = document.getElementById('select');
    moneyElement = document.getElementById('money');
    nameToShow = document.getElementById('name');

    var items = [
        {text: "Bernard Arnaud", value: "BernardArnaud.json"},
        {text: "Vincent Bolloré", value: "Bollore.json"}
    ];

    for (var i in items) {
        var newItem = new Option(items[i].text, items[i].value);
        selectElement.options.add(newItem);
    }

    loadJSON("./assets/data/"+default_file)
    .then(data => {
        moneyElement.textContent = ""+data.total_money;
        money = data.total_money;
    })
    .catch(error => {
        console.error('Erreur lors du chargement du fichier:', error);
    });
}