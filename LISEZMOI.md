# Atelier souris et clavier

Site local d'apprentissage de la souris et du clavier pour grands débutants.
Aucune installation, aucun serveur, aucune connexion internet.

## Lancer le site

Ouvrez `index.html` par un double-clic. Firefox ou Chrome, au choix.

## Arborescence

```
index.html                  la page, et la liste des scripts à charger
css/style.css               toute la mise en forme
js/outils.js                fonctions de base, sons, confettis
js/scores.js                mémoire des résultats et des réglages
js/registre.js              liste des exercices + mode d'emploi pour en ajouter
js/moteurs.js               moteur de clic, moteur de frappe, clavier AZERTY
js/exercices-souris.js      les 6 exercices de souris
js/exercices-clavier.js     les 8 exercices de clavier
js/ecrans.js                accueil, liste, écran d'exercice
js/demarrage.js             branchement final (à garder en dernier)
ressources/familles/        les deux images de l'accueil
ressources/images/          les images à découvrir
ressources/icones/          une icône par exercice
ressources/jeu/             bulles, cadenas, dossiers
ressources/formes/          formes du glisser-déposer
```

Toutes les images sont des fichiers SVG : elles se modifient dans n'importe
quel éditeur de texte ou dans Inkscape, et se remplacent par des PNG ou des
JPEG en changeant simplement le nom du fichier dans le code.

## Ajouter un exercice

Le mode d'emploi complet est en commentaire en haut de `js/registre.js`.
En résumé, dans `js/exercices-souris.js` ou `js/exercices-clavier.js` :

```js
ajouterExercice({
  id: 'mon-exercice',
  famille: 'clavier',
  titre: 'Les voyelles',
  resume: 'a, e, i, o, u, y',
  consigne: 'Tapez la voyelle affichée.',
  icone: 'icones/lettre-min.svg',
  demarrer: function(scene, jeu){
    exerciceDeFrappe(scene, jeu, { suites: tirer(['a','e','i','o','u','y'], 12) });
  }
});
```

L'exercice apparaît aussitôt sur l'accueil, avec son score et ses étoiles.
Pour un exercice de souris, remplissez `scene` avec vos propres éléments et
servez-vous de `jeu.point()`, `jeu.avance()`, `jeu.dire()` et `jeu.terminer()`.

### Les trois niveaux de difficulté

Chaque exercice reçoit un troisième paramètre, `niveau` (`'facile'`,
`'moyen'` ou `'fort'`), choisi par la personne juste avant de démarrer.
Utilisez `parNiveau()` pour faire varier vos réglages :

```js
demarrer: function(scene, jeu, niveau){
  var taille = parNiveau(niveau, { facile: 100, moyen: 80, fort: 60 });
  ...
}
```

C'est exactement ainsi que le labyrinthe fait varier la taille de ses
cases (60, 40 puis 30 pixels). Le chronomètre et le score par niveau
sont gérés automatiquement par l'écran d'exercice : rien à faire de
votre côté pour ça.

### Les lettres ë, ï, ô, î, û

Sur un clavier français, ces lettres ne sont pas des touches directes :
il faut presser la touche accent (^ pour ô/î/û, Maj ⇧+^ pour ë/ï), qui
ne produit rien à l'écran, puis la voyelle. `exerciceDeFrappe` gère ça
tout seul dès que l'une de ces cinq lettres apparaît dans une suite,
qu'il s'agisse d'une lettre isolée ou d'un mot entier ("hôtel", "île") :
la touche accent est surlignée en premier, la voyelle ensuite, et la
première touche n'est jamais comptée comme une erreur.

### L'adaptation à l'écran

Le site s'ajuste à la résolution de l'écran et à la taille de la
fenêtre du navigateur, pas seulement à un ou deux formats prévus
d'avance :

- Les cibles des exercices de clic (`exerciceDeClic`) se placent
  d'après la taille réellement affichée du terrain (mesurée avec
  `mesureBoite()`), jamais d'après un nombre de pixels fixe. Si la
  fenêtre est redimensionnée pendant l'exercice, la cible en cours
  est ramenée dans les nouvelles limites.
- Le labyrinthe resserre ses cases si la fenêtre est trop étroite
  pour la taille demandée par le niveau, sans jamais descendre sous
  14 pixels ni changer le trajet déjà tracé.
- Le canvas de « Découvrir l'image » dessine à la densité de pixels
  de l'écran (`devicePixelRatio`) : net sur un moniteur haute
  résolution, sans changer sa taille affichée.
- La mise en page (accueil, police du texte à taper, clavier virtuel)
  utilise des tailles fluides (`clamp`, `auto-fit`) plutôt qu'un seul
  point de rupture, pour s'ajuster en continu entre un petit écran de
  PC portable et un grand moniteur.

Si vous ajoutez un exercice qui dessine dans `scene` avec des
coordonnées en pixels, utilisez `mesureBoite(scene, largeurDefaut,
hauteurDefaut)` plutôt qu'un nombre fixe, pour qu'il profite de la
même adaptation.

Si vous créez un nouveau fichier `js/exercices-xxx.js`, ajoutez sa ligne
`<script src="js/exercices-xxx.js"></script>` dans `index.html`, avant
`demarrage.js`.

## Les scores

Ils sont enregistrés dans le navigateur du poste (`localStorage`), par
navigateur et par session Windows. Rien ne sort de la machine. Un bouton
« Remettre les scores à zéro » se trouve en bas de l'accueil : utile entre
deux apprenants sur le même poste.

Les scores sont gardés **par niveau** : réussir le labyrinthe en facile
n'efface pas le score obtenu en fort, et inversement. La tuile de la
liste affiche le meilleur des trois.

## Réglages

- **Facile / Moyen / Fort** : en haut de chaque exercice. Le niveau choisi
  est mémorisé et repris la prochaine fois que l'exercice est ouvert.
- **Chronomètre** : démarre avec l'exercice, s'arrête au bilan final. Le
  meilleur temps par niveau est gardé et affiché sur la tuile.
- **Son activé / Son coupé** : en haut à droite.
- **Masquer / afficher le clavier** : sous la zone de frappe, dans chaque
  exercice de clavier. Le choix est mémorisé.
- **Prénom** : en haut, sert uniquement à l'accueil.
