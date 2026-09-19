/* ==========================================================
   registre.js — la liste des exercices du site

   POUR AJOUTER UN EXERCICE
   ------------------------
   Appelez ajouterExercice({...}) depuis n'importe quel fichier
   js/exercices-*.js. Il apparaîtra tout seul sur l'accueil,
   avec son score et ses étoiles. Rien d'autre à modifier.

   ajouterExercice({
     id: 'mon-exercice',          // identifiant unique, sert à ranger le score
     famille: 'souris',           // 'souris' ou 'clavier'
     titre: 'Nom affiché',
     resume: 'Une ligne sur la tuile de la liste',
     consigne: 'Ce que la personne doit faire',
     icone: 'icones/mon-icone.svg',   // fichier du répertoire ressources
     demarrer: function(scene, jeu, niveau){
       // scene  : la zone de jeu, vide, à remplir avec vos éléments
       // niveau : 'facile', 'moyen' ou 'fort' — choisi par la personne
       //          juste avant de démarrer. Utilisez parNiveau() pour
       //          faire varier vos réglages :
       //            var taille = parNiveau(niveau, {facile:100, moyen:80, fort:60});
       //
       // jeu.max(n)             nombre total de points possibles
       // jeu.point(n)           ajoute n points (n peut être négatif)
       // jeu.avance(fait, total) remplit la jauge de progression
       // jeu.dire(texte, 'ok')  message vert ; 'non' pour un message rouge
       // jeu.terminer()         affiche le bilan, les étoiles et le temps mis
       // jeu.auMenage(fn)       fonction appelée quand on quitte l'exercice
       //                        (indispensable pour vos setInterval et
       //                         vos écouteurs posés sur document)
     }
   });

   Le chronomètre et le choix du niveau sont gérés automatiquement par
   l'écran d'exercice : vous n'avez rien à faire pour ça, seulement à
   lire le paramètre "niveau" pour ajuster la difficulté.

   Si vous créez un nouveau fichier d'exercices, ajoutez sa ligne
   <script src="..."> dans index.html, avant demarrage.js.
   ========================================================== */

var EXERCICES = [];

function ajouterExercice(definition){
  EXERCICES.push(definition);
}

function exercicesDe(famille){
  return EXERCICES.filter(function(e){ return e.famille === famille; });
}

/* Les deux familles affichées sur l'accueil. */
/* Les trois niveaux de difficulté proposés pour chaque exercice. */
var NIVEAUX = [
  { cle: 'facile', libelle: 'Facile' },
  { cle: 'moyen',  libelle: 'Moyen' },
  { cle: 'fort',   libelle: 'Fort' }
];

var FAMILLES = [
  { cle: 'souris',  titre: 'La souris',  image: 'familles/souris.svg',
    texte: 'Déplacer, cliquer, double-cliquer, faire glisser.' },
  { cle: 'clavier', titre: 'Le clavier', image: 'familles/clavier.svg',
    texte: 'Lettres, majuscules, chiffres, accents et touches spéciales.' }
];
