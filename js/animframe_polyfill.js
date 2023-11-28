// Fonction anonyme auto-exécutante qui gère la compatibilité de requestAnimationFrame
(function() {
  var lastTime = 0; // Dernier temps de rafraîchissement

  // Liste des préfixes de navigateurs pour requestAnimationFrame
  var vendors = ['webkit', 'moz'];

  // Parcourt les préfixes et assigne requestAnimationFrame et cancelAnimationFrame si disponibles
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  // Si requestAnimationFrame n'est toujours pas disponible, crée une version basée sur setTimeout
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  // Si cancelAnimationFrame n'est pas disponible, crée une version basée sur clearTimeout
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
}());
