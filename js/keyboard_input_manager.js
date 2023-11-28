// Définition du constructeur KeyboardInputManager qui gère les entrées clavier
function KeyboardInputManager() {
  this.events = {};  // Liste des événements enregistrés

  // Méthode pour écouter les événements clavier
  this.listen();
}

// Méthode pour enregistrer un callback pour un événement donné
KeyboardInputManager.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

// Méthode pour déclencher un événement avec des données associées
KeyboardInputManager.prototype.emit = function (event, data) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function (callback) {
      callback(data);
    });
  }
};

// Méthode pour écouter les événements clavier
KeyboardInputManager.prototype.listen = function () {
  var self = this;

  // Mapping des codes de touche vers les directions du jeu
  var map = {
    38: 0, // Haut
    39: 1, // Droite
    40: 2, // Bas
    37: 3, // Gauche
    75: 0, // Raccourcis clavier vim
    76: 1,
    74: 2,
    72: 3
  };

  // Écouteur d'événement pour la touche enfoncée
  document.addEventListener("keydown", function (event) {
    var modifiers = event.altKey || event.ctrlKey || event.metaKey ||
                    event.shiftKey;
    var mapped    = map[event.which];

    if (!modifiers) {
      if (mapped !== undefined) {
        event.preventDefault();
        var feedbackContainer  = document.getElementById('feedback-container');
        feedbackContainer.innerHTML = ' ';
        self.emit("move", mapped);
      }

      if (event.which === 32) self.restart.bind(self)(event);
    }
  });

  // Écouteur d'événement pour le bouton de réessai
  var retry = document.getElementsByClassName("retry-button")[0];
  retry.addEventListener("click", this.restart.bind(this));

  // Écouteur d'événement pour le bouton d'astuce
  var hintButton = document.getElementById('hint-button');
  hintButton.addEventListener('click', function(e) {
    e.preventDefault();
    var feedbackContainer  = document.getElementById('feedback-container');
    feedbackContainer.innerHTML = '<img src=img/spinner.gif />';
    self.emit('think');
  });

  // Écouteur d'événement pour le bouton de démarrage
  var runButton = document.getElementById('run-button');
  runButton.addEventListener('click', function(e) {
    e.preventDefault();
    self.emit('run');
  });

  // Écoute des événements de balayage
  var gestures = [Hammer.DIRECTION_UP, Hammer.DIRECTION_RIGHT,
                  Hammer.DIRECTION_DOWN, Hammer.DIRECTION_LEFT];

  // Configuration du gestionnaire Hammer pour les événements de balayage
  var gameContainer = document.getElementsByClassName("game-container")[0];
  var handler       = Hammer(gameContainer, {
    drag_block_horizontal: true,
    drag_block_vertical: true
  });
  
  // Écouteur d'événement pour le geste de balayage
  handler.on("swipe", function (event) {
    event.gesture.preventDefault();
    mapped = gestures.indexOf(event.gesture.direction);

    if (mapped !== -1) self.emit("move", mapped);
  });
};

// Méthode pour redémarrer le jeu
KeyboardInputManager.prototype.restart = function (event) {
  event.preventDefault();
  this.emit("restart");
};
