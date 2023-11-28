// Fonction pour obtenir le nom du mouvement en fonction de l'indice
function moveName(move) {
  return {
    0: 'haut',
    1: 'droite',
    2: 'bas',
    3: 'gauche'
  }[move];
}

// Variables globales pour stocker le meilleur score et les mouvements associés
var global_max_score;
var global_max_score_moves;

// Fonction pour obtenir le meilleur mouvement en effectuant plusieurs exécutions aléatoires
function getBestMove(grid, runs, debug) {
  var bestScore = 0; 
  var bestMove = -1;
  var bestAvgMoves;

  // Parcours des quatre mouvements possibles
  for (var i = 0; i < 4; i++) {
    // Score du mouvement pour une position donnée
    var res = multiRandomRun(grid, i, runs);
    var score = res.score;
    
    // Met à jour le meilleur score et le meilleur mouvement si nécessaire
    if (score >= bestScore) {
      bestScore = score;
      bestMove = i;
      bestAvgMoves = res.avg_moves;
    }
    
    // Affichage du score supplémentaire si le mode débogage est activé
    if (debug) {
      console.log('Mouvement ' + moveName(i) + ": Score supplémentaire - " + score);
    }
  }

  // Vérification des mouvements disponibles dans la grille (débogage)
  if (!grid.movesAvailable()) console.log('bug2');    
    
  // Assertion : un mouvement a été trouvé
  if (bestMove == -1) {
    console.log('ERREUR...'); 
    errorGrid = grid.clone();
  } 

  // Affiche les détails du meilleur mouvement
  console.log('Mouvement ' + moveName(bestMove) + ": Score supplémentaire - " + bestScore + " Nombre moyen de mouvements " + bestAvgMoves);        

  return {move: bestMove, score: bestScore};
}

// Fonction pour effectuer plusieurs exécutions aléatoires et retourner la moyenne des scores et le nombre moyen de mouvements
function multiRandomRun(grid, move, runs) {
  var total = 0.0;
  var min = 1000000;
  var max = 0;
  var total_moves = 0;
  
  // Boucle sur le nombre d'exécutions spécifié
  for (var i = 0; i < runs; i++) {
    var res = randomRun(grid, move);
    var s = res.score;
    if (s == -1) return -1;
      
    total += s;
    total_moves += res.moves;
    if (s < min) min = s;
    if (s > max) max = s;
  }
  
  var avg = total / runs;
  var avg_moves = total_moves / runs;

  // Retourne la moyenne des scores et le nombre moyen de mouvements
  return {score: avg, avg_moves: avg_moves};
}

// Fonction pour effectuer une exécution aléatoire
function randomRun(grid, move) {  
  var g = grid.clone();
  var score = 0;
  var res = moveAndAddRandomTiles(g, move);
  
  // Vérifie si le mouvement initial a été effectué
  if (!res.moved) {
    return -1; // Ne peut pas commencer
  }  
  score += res.score;

  // Exécution jusqu'à ce qu'il n'y ait plus de mouvements disponibles
  var moves = 1;
  while (true) {
    if (!g.movesAvailable()) break;
    
    var res = g.move(Math.floor(Math.random() * 4));
    if (!res.moved) continue;
    
    score += res.score;
    g.addRandomTile();
    moves++;
  }
  // Grille terminée.
  return {score: score, moves: moves};
}

// Fonction pour effectuer un mouvement et ajouter des tuiles aléatoires
function moveAndAddRandomTiles(grid, direction) {
  var res = grid.move(direction);
  if (res.moved) grid.addRandomTile();
  return res;
}

// Fonction principale qui effectue une recherche et retourne le meilleur mouvement
function AI_getBest(grid, debug) {
  var runs = document.getElementById('run-count').value;
  return getBestMove(grid, runs, debug);  
}
