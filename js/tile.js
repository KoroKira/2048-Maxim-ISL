// Définition du constructeur Tile qui crée un objet Tile avec une position (x, y) et une valeur (value)
function Tile(position, value) {
  // Attributs de l'objet Tile
  this.x = position.x;           // Coordonnée x
  this.y = position.y;           // Coordonnée y
  this.value = value || 2;       // Valeur de la tuile (par défaut 2)

  // Attributs pour le suivi des mouvements
  this.previousPosition = null;  // Position précédente (avant un déplacement)
  this.mergedFrom = null;        // Suivi des tuiles fusionnées
}

// Méthode pour sauvegarder la position actuelle dans previousPosition
Tile.prototype.savePosition = function () {
  this.previousPosition = { x: this.x, y: this.y };
};

// Méthode pour mettre à jour la position de la tuile
Tile.prototype.updatePosition = function (position) {
  this.x = position.x;
  this.y = position.y;
};

// Méthode pour cloner une tuile
Tile.prototype.clone = function () {
  // Création d'une nouvelle tuile avec la même position et valeur
  newTile = new Tile({ x: this.x, y: this.y }, this.value);
  // Copie des positions précédentes et des tuiles fusionnées
  // (commenté car non utilisé dans le code actuel)
  // newTile.previousPosition = { x: this.previousPosition.x, y: this.previousPosition.y };
  // newTile.mergedFrom = { x: this.previousPosition.x, y: this.previousPosition.y };
  return newTile;  // Retourne la nouvelle tuile clonée
}
