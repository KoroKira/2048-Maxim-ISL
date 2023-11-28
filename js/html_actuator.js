// Définition du constructeur HTMLActuator qui gère l'affichage des éléments HTML du jeu
function HTMLActuator() {
  // Éléments HTML utilisés pour afficher le jeu
  this.tileContainer    = document.getElementsByClassName("tile-container")[0];
  this.scoreContainer   = document.getElementsByClassName("score-container")[0];
  this.messageContainer = document.getElementsByClassName("game-message")[0];
  this.sharingContainer = document.getElementsByClassName("score-sharing")[0];

  // Score initialisé à 0
  this.score = 0;
}

// Méthode pour effectuer l'action d'affichage en fonction de l'état de la grille et des métadonnées
HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  // Utilisation de requestAnimationFrame pour effectuer des animations en douceur
  window.requestAnimationFrame(function () {
    // Nettoie le conteneur des tuiles avant de les afficher à nouveau
    self.clearContainer(self.tileContainer);

    // Parcours de la grille pour afficher chaque tuile
    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    // Mise à jour du score affiché
    self.updateScore(metadata.score);

    // Affichage du message de fin de jeu si le jeu est terminé (gagné ou perdu)
    if (metadata.over) self.message(false); // Vous avez perdu
    if (metadata.won) self.message(true);   // Vous avez gagné !
  });
};

// Méthode pour redémarrer le jeu en effaçant le message de fin de jeu
HTMLActuator.prototype.restart = function () {
  // Envoie d'un événement à Google Analytics si disponible
  if (ga) ga("send", "event", "game", "restart");
  this.clearMessage();
};

// Méthode pour vider le contenu d'un conteneur HTML
HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

// Méthode pour ajouter une tuile à l'affichage
HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  // Création d'un élément div pour représenter la tuile
  var element   = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  positionClass = this.positionClass(position);

  // Construction des classes CSS de la tuile
  var classes = ["tile", "tile-" + tile.value, positionClass];
  this.applyClasses(element, classes);

  // Affichage de la valeur de la tuile dans l'élément
  element.textContent = tile.value;

  if (tile.previousPosition) {
    // Assurez-vous que la tuile est rendue dans la position précédente d'abord
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(element, classes); // Met à jour la position
    });
  } else if (tile.mergedFrom) {
    // Si la tuile provient d'une fusion, ajoute une classe spéciale et rend les tuiles fusionnées
    classes.push("tile-merged");
    this.applyClasses(element, classes);

    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    // Sinon, c'est une nouvelle tuile, ajoute une classe spéciale
    classes.push("tile-new");
    this.applyClasses(element, classes);
  }

  // Ajoute la tuile au conteneur
  this.tileContainer.appendChild(element);
};

// Méthode pour appliquer des classes CSS à un élément
HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

// Méthode pour normaliser la position d'une tuile (ajoute 1 aux coordonnées pour correspondre aux classes CSS)
HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

// Méthode pour obtenir la classe CSS associée à une position
HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

// Méthode pour mettre à jour le score affiché
HTMLActuator.prototype.updateScore = function (score) {
  this.clearContainer(this.scoreContainer);

  // Calcul de la différence pour afficher le score additionnel le cas échéant
  var difference = score - this.score;
  this.score = score;

  // Affichage du score
  this.scoreContainer.textContent = this.score;

  // Affichage du score additionnel le cas échéant
  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;

    this.scoreContainer.appendChild(addition);
  }
};

// Méthode pour afficher un message de fin de jeu
HTMLActuator.prototype.message = function (won) {
  var type    = won ? "game-won" : "game-over";
  var message = won ? "Vous avez gagné !" : "Partie terminée !";

  // Envoie d'un événement à Google Analytics si disponible
  if (ga) ga("send", "event", "game done", this.score, document.getElementById('run-count').value);

  // Modification des classes et du texte du message
  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;

  // Nettoyage du conteneur de partage et ajout d'un bouton de partage Twitter
  this.clearContainer(this.sharingContainer);
  this.sharingContainer.appendChild(this.scoreTweetButton());
  twttr.widgets.load(); // Chargement du widget Twitter
};

// Méthode pour effacer le message de fin de jeu
HTMLActuator.prototype.clearMessage = function () {
  this.messageContainer.classList.remove("game-won", "game-over");
};

// Méthode pour afficher une astuce dans le conteneur de rétroaction
HTMLActuator.prototype.showHint = function (hint) {
  document.getElementById('feedback-container').innerHTML = ['↑','→','↓','←'][hint];
};

// Méthode pour définir le texte du bouton de démarrage
HTMLActuator.prototype.setRunButton = function (message) {
  document.getElementById('run-button').innerHTML = message;
};
