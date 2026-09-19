/* ==========================================================
   exercices-clavier.js
   Tous ces exercices reposent sur exerciceDeFrappe : il suffit de
   fournir la liste de ce qu'il faut taper. Le clavier à l'écran,
   le surlignage de la touche et le bouton Masquer sont automatiques.
   Le niveau change la longueur (ou la difficulté) de la liste.
   ========================================================== */

var LETTRES = 'abcdefghijklmnopqrstuvwxyz'.split('');

ajouterExercice({
  id: 'clavier-minuscules',
  famille: 'clavier',
  icone: 'icones/lettre-min.svg',
  titre: 'Les lettres minuscules',
  resume: 'Trouver une lettre sur le clavier.',
  consigne: 'Appuyez sur la lettre affichée en gros.',
  demarrer: function(scene, jeu, niveau){
    exerciceDeFrappe(scene, jeu, {
      suites: tirer(LETTRES, parNiveau(niveau, {facile:8, moyen:12, fort:18})),
      indice: "Quand le clavier est affiché, la touche à presser s'allume en orange."
    });
  }
});

ajouterExercice({
  id: 'clavier-majuscules',
  famille: 'clavier',
  icone: 'icones/lettre-maj.svg',
  titre: 'Les majuscules',
  resume: 'Deux touches en même temps : Maj et la lettre.',
  consigne: 'Gardez la touche Maj ⇧ appuyée, puis tapez la lettre.',
  demarrer: function(scene, jeu, niveau){
    exerciceDeFrappe(scene, jeu, {
      suites: tirer(LETTRES, parNiveau(niveau, {facile:6, moyen:10, fort:14}))
                .map(function(l){ return l.toUpperCase(); }),
      indice: "Maj ⇧ d'abord, sans la lâcher, puis la lettre.",
      rappel: 'Gardez bien la touche Maj ⇧ enfoncée pendant que vous tapez la lettre.'
    });
  }
});

ajouterExercice({
  id: 'clavier-chiffres',
  famille: 'clavier',
  icone: 'icones/chiffre.svg',
  titre: 'Les chiffres',
  resume: 'Sur la rangée du haut, avec la touche Maj.',
  consigne: "Sur un clavier français, les chiffres s'obtiennent avec Maj ⇧.",
  demarrer: function(scene, jeu, niveau){
    exerciceDeFrappe(scene, jeu, {
      suites: tirer('0123456789'.split(''), parNiveau(niveau, {facile:6, moyen:10, fort:14})),
      indice: "Le pavé numérique à droite du clavier marche aussi, s'il y en a un.",
      rappel: 'Maj ⇧ enfoncée, puis la touche de la rangée du haut.'
    });
  }
});

var ACCENTS_SIMPLES = ['é', 'è', 'à', 'ç', 'ù'];
var ACCENTS_COMPOSES_LISTE = ['ô', 'î', 'û', 'ë', 'ï'];

ajouterExercice({
  id: 'clavier-accents',
  famille: 'clavier',
  icone: 'icones/accent.svg',
  titre: 'Les lettres accentuées',
  resume: 'é, è, à, ç, ù, puis ô, î, û, ë, ï.',
  consigne: 'Certaines lettres accentuées se tapent directement, d\'autres demandent deux touches.',
  demarrer: function(scene, jeu, niveau){
    var pool = parNiveau(niveau, {
      facile: ACCENTS_SIMPLES,
      moyen: ACCENTS_SIMPLES.concat(['ô', 'î']),
      fort: ACCENTS_SIMPLES.concat(ACCENTS_COMPOSES_LISTE)
    });
    exerciceDeFrappe(scene, jeu, {
      suites: tirer(pool, parNiveau(niveau, { facile: 6, moyen: 10, fort: 14 })),
      indice: parNiveau(niveau, {
        facile: 'Elles se trouvent sur la rangée des chiffres.',
        moyen: 'é, è, à, ç, ù se trouvent sur la rangée des chiffres. Pour ô et î : ' +
               'appuyez sur la touche accent (^), puis sur la lettre.',
        fort: 'Pour ô, î, û : la touche accent circonflexe (^) puis la lettre. ' +
              'Pour ë, ï : Maj ⇧ + la touche accent (¨), puis la lettre.'
      })
    });
  }
});

ajouterExercice({
  id: 'clavier-ponctuation',
  famille: 'clavier',
  icone: 'icones/ponctuation.svg',
  titre: 'La ponctuation',
  resume: "Le point, la virgule, le point d'interrogation.",
  consigne: 'Certains signes demandent la touche Maj ⇧, d\'autres non.',
  demarrer: function(scene, jeu, niveau){
    exerciceDeFrappe(scene, jeu, {
      suites: tirer([',', ';', ':', '!', '?', '.', '/', '-', '_', '(', ')', '=', '+'],
                    parNiveau(niveau, {facile:8, moyen:12, fort:16})),
      indice: 'Quand le signe est écrit en petit en haut de la touche, il faut presser Maj ⇧.'
    });
  }
});

var MOTS_FACILES = ['chat', 'vélo', 'café', 'pain', 'jour', 'fleur', 'main', 'porte'];
var MOTS_MOYENS  = ['maison', 'école', 'jardin', 'bonjour', 'famille', 'soleil', 'merci', 'cahier'];
var MOTS_FORTS   = ['ordinateur', 'téléphone', 'anniversaire', 'bibliothèque',
                     'extraordinaire', 'dictionnaire', 'hôtel', 'île', 'flûte', 'maïs'];

ajouterExercice({
  id: 'clavier-mots',
  famille: 'clavier',
  icone: 'icones/mot.svg',
  titre: 'Écrire des mots',
  resume: 'Enchaîner plusieurs lettres, sans se presser.',
  consigne: 'Tapez le mot lettre par lettre. Les lettres déjà tapées passent au vert.',
  demarrer: function(scene, jeu, niveau){
    var pool = parNiveau(niveau, { facile: MOTS_FACILES, moyen: MOTS_MOYENS, fort: MOTS_FORTS });
    var n = parNiveau(niveau, { facile: 4, moyen: 6, fort: 6 });
    exerciceDeFrappe(scene, jeu, {
      suites: melanger(pool).slice(0, n),
      indice: "Inutile d'aller vite : la justesse compte, pas la vitesse."
    });
  }
});

ajouterExercice({
  id: 'clavier-touches-speciales',
  famille: 'clavier',
  icone: 'icones/touches.svg',
  titre: 'Les touches spéciales',
  resume: 'Espace, Entrée, Retour arrière.',
  consigne: "Ces touches n'écrivent pas de lettre, elles servent à agir.",
  demarrer: function(scene, jeu, niveau){
    var ESPACE = { valeur: ' ', libelle: "Barre d'espace" };
    var ENTREE = { valeur: 'Enter', libelle: 'Entrée ⏎' };
    var RETOUR = { valeur: 'Backspace', libelle: 'Retour arrière ⌫' };
    var n = parNiveau(niveau, { facile: 4, moyen: 8, fort: 12 });
    exerciceDeFrappe(scene, jeu, {
      suites: tirer([ESPACE, ENTREE, RETOUR], n).map(function(t){ return [t]; }),
      indice: "L'espace sépare les mots, Entrée valide, Retour arrière efface la lettre précédente."
    });
  }
});

var PHRASES_FACILES = ['Le chat dort.', 'Il fait beau.'];
var PHRASES_MOYENNES = ['Bonjour à tous.', 'Je bois un café.', 'Le chien court vite.'];
var PHRASES_FORTES = ['Les enfants jouent dans le jardin.', 'Elle regarde un film ce soir.',
                       'Nous partons en vacances demain.', 'Le facteur passe tous les matins.'];

ajouterExercice({
  id: 'clavier-phrases',
  famille: 'clavier',
  icone: 'icones/phrase.svg',
  titre: 'Une phrase entière',
  resume: 'Majuscule, mots, espaces et point : tout à la fois.',
  consigne: 'Tapez la phrase en entier, y compris la majuscule et le point.',
  demarrer: function(scene, jeu, niveau){
    var pool = parNiveau(niveau, { facile: PHRASES_FACILES, moyen: PHRASES_MOYENNES, fort: PHRASES_FORTES });
    var n = parNiveau(niveau, { facile: 2, moyen: 3, fort: 4 });
    exerciceDeFrappe(scene, jeu, {
      suites: melanger(pool).slice(0, n),
      indice: 'Pour la majuscule du début : Maj ⇧ plus la lettre. Pour l\'espace : la grande barre.'
    });
  }
});
