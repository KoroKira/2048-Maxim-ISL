// Définition des délais d'animation et de recherche minimale
animationDelay = 150; // Délai entre les animations (en millisecondes)
minSearchTime = 100;   // Temps minimal de recherche (en millisecondes)

// Attend que le navigateur soit prêt à rendre le jeu (évite les problèmes d'affichage)
window.requestAnimationFrame(function () {
  // Crée une instance du gestionnaire de jeu (GameManager) avec le clavier comme gestionnaire d'entrée et HTML comme actuateur
  window.manager = new GameManager(4, KeyboardInputManager, HTMLActuator);
});
