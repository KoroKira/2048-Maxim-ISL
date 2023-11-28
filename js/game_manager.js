// Définition du constructeur GameManager qui gère la logique du jeu
function GameManager(size, InputManager, Actuator) {
  this.size         = size;               // Taille de la grille
  this.inputManager = new InputManager;   // Gestionnaire d'entrée
  this.actuator     = new Actuator;       // Actuateur pour l'affichage

  this.running      = false;              // Indique si le jeu est en cours d'exécution

  // Écouteurs d'événements pour les mouvements et le redémarrage du jeu
  this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));

  // Écouteur d'événement pour l'IA (affiche une astuce)
  this.inputManager.on('think', function() {
    var best = AI_getBest(this.grid, true);
    this.actuator.showHint(best.move);
  }.bind(this));

  // Écouteur d'événement pour exécuter ou arrêter l'IA en continu
  this.inputManager.on('run', function() {
    if (this.running) {
      this.running = false;
      this.actuator.setRunButton('IA'); // Bouton pour démarrer l'IA
    } else {
      this.running = true;
      this.run(); // Exécute l'IA en continu
      this.actuator.setRunButton('Stop'); // Bouton pour arrêter l'IA
    }
  }.bind(this));

  // Initialisation du jeu
  this.setup();
}

// Méthode pour redémarrer le jeu
GameManager.prototype.restart = function () {
  this.actuator.restart(); // Efface le message de fin de jeu
  this.running = false;     // Arrête l'exécution continue de l'IA
  this.actuator.setRunButton('Auto-run'); // Bouton pour démarrer l'IA
  this.setup();             // Réinitialise le jeu
};

// Méthode pour initialiser le jeu
GameManager.prototype.setup = function () {
  this.grid         = new Grid(this.size); // Crée une nouvelle grille
  this.grid.addStartTiles();                // Ajoute les tuiles de départ

  this.score        = 0;                     // Score initialisé à 0
  this.over         = false;                 // Indique si le jeu est terminé (game over)
  this.won          = false;                 // Indique si le joueur a gagné

  // Met à jour l'affichage
  this.actuate();
};

// Méthode pour envoyer la grille mise à jour à l'actuateur
GameManager.prototype.actuate = function () {
  this.actuator.actuate(this.grid, {
    score: this.score,
    over:  this.over,
    won:   this.won
  });
};

// Méthode pour effectuer un mouvement donné et mettre à jour l'état du jeu
GameManager.prototype.move = function(direction) {
  var result = this.grid.move(direction); // Effectue le mouvement dans la grille
  this.score += result.score;              // Met à jour le score

  if (!result.won) {
    if (result.moved) {
      this.grid.computerMove(); // Effectue un mouvement de l'ordinateur
    }
  } else {
    // Le joueur a atteint 2048 (commenté pour continuer après avoir atteint 2048)
  }

  if (!this.grid.movesAvailable()) {
    this.over = true; // Plus de mouvements disponibles, fin de partie (game over)
  }

  // Met à jour l'affichage
  this.actuate();
};

// Méthode pour effectuer des mouvements continus jusqu'à la fin du jeu
GameManager.prototype.run = function() {
  var best = AI_getBest(this.grid, false); // Obtient le meilleur mouvement de l'IA
  this.move(best.move); // Effectue le mouvement
  var timeout = animationDelay;

  // Si le jeu est en cours, n'est pas terminé et le joueur n'a pas gagné, planifie le prochain mouvement
  if (this.running && !this.over && !this.won) {
    var self = this;
    setTimeout(function(){
      self.run();
    }, timeout);
  }
};
