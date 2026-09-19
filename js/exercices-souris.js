/* ==========================================================
   exercices-souris.js
   ========================================================== */

/* ---------- 1. Découvrir l'image ----------
   L'image est un vrai fichier du répertoire ressources, posé sous
   un brouillard peint sur un canvas. La souris efface le brouillard. */
var IMAGES_A_DECOUVRIR = [
  { fichier: 'images/maison.svg',  nom: 'Une maison',   leurres: ['Une église', 'Une tente'] },
  { fichier: 'images/soleil.svg',  nom: 'Un soleil',    leurres: ['Une roue', 'Une fleur'] },
  { fichier: 'images/bateau.svg',  nom: 'Un bateau',    leurres: ['Un avion', 'Un camion'] },
  { fichier: 'images/poisson.svg', nom: 'Un poisson',   leurres: ['Un oiseau', 'Un papillon'] },
  { fichier: 'images/voiture.svg', nom: 'Une voiture',  leurres: ['Un train', 'Un autobus'] },
  { fichier: 'images/etoile.svg',  nom: 'Une étoile',   leurres: ['Un flocon', 'Un losange'] },
  { fichier: 'images/arbre.svg',   nom: 'Un arbre',     leurres: ['Un champignon', 'Un nuage'] }
];

ajouterExercice({
  id: 'souris-revelation',
  famille: 'souris',
  icone: 'icones/revelation.svg',
  titre: "Découvrir l'image",
  resume: 'Promenez la souris pour effacer le brouillard.',
  consigne: "Passez la souris sur le cadre, sans cliquer, jusqu'à reconnaître l'image.",
  demarrer: function(scene, jeu, niveau){
    var TOURS = parNiveau(niveau, {facile:3, moyen:4, fort:5});
    var RAYON = parNiveau(niveau, {facile:46, moyen:34, fort:24});
    var SEUIL = parNiveau(niveau, {facile:.4, moyen:.5, fort:.62});
    var LARGEUR = 660, HAUTEUR = 340, PAS = 20;
    var COLS = LARGEUR / PAS, LIGNES = HAUTEUR / PAS;
    var tour = 0;
    jeu.max(TOURS * 25);
    jeu.avance(0, TOURS);

    var cadre = el('div', { class: 'cadre-revelation' });
    var vignette = image('images/maison.svg', 'image à découvrir');
    var toile = el('canvas');
    // La zone de dessin est mise à l'échelle de la densité de pixels de
    // l'écran (dpr) : sur un moniteur haute résolution, le brouillard
    // reste net au lieu d'être flou. La taille affichée (fixée par le
    // CSS, qui suit elle-même la largeur réelle de la fenêtre) ne
    // change pas ; seule la finesse du dessin s'améliore.
    var dpr = window.devicePixelRatio || 1;
    toile.width = LARGEUR * dpr;
    toile.height = HAUTEUR * dpr;
    cadre.append(vignette, toile);
    var zoneChoix = el('div', { class: 'choix' });
    scene.append(cadre, zoneChoix);

    var ctx = toile.getContext('2d');
    ctx.scale(dpr, dpr);
    var sujet, devine = false, cases, effacees;

    function nouveauTour(){
      devine = false;
      zoneChoix.innerHTML = '';
      var precedent = sujet;
      do { sujet = piocher(IMAGES_A_DECOUVRIR); } while(precedent && sujet === precedent);
      vignette.src = RESSOURCES + sujet.fichier;

      /* le brouillard */
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#5a6a85';
      ctx.fillRect(0, 0, LARGEUR, HAUTEUR);
      ctx.fillStyle = '#48566e';
      for(var i = 0; i < 80; i++) ctx.fillRect(hasard(LARGEUR), hasard(HAUTEUR), 22, 22);

      /* on compte les zones effacées sans relire le canvas :
         plus simple et sans souci de sécurité avec les fichiers locaux */
      cases = {};
      effacees = 0;
      jeu.dire('Bougez la souris sur le cadre.', 'ok');
    }

    toile.addEventListener('mousemove', function(ev){
      if(devine) return;
      var r = toile.getBoundingClientRect();
      var x = (ev.clientX - r.left) * (LARGEUR / r.width);
      var y = (ev.clientY - r.top) * (HAUTEUR / r.height);

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, RAYON, 0, 6.3);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';

      var cx = Math.floor(x / PAS), cy = Math.floor(y / PAS);
      for(var dx = -1; dx <= 1; dx++) for(var dy = -1; dy <= 1; dy++){
        var cle = (cx + dx) + ':' + (cy + dy);
        if(!cases[cle]){ cases[cle] = 1; effacees++; }
      }
      if(effacees / (COLS * LIGNES) > SEUIL) proposerChoix();
    });

    function proposerChoix(){
      if(devine) return;
      devine = true;
      jeu.dire("Alors, qu'avez-vous découvert ?");
      melanger([sujet.nom].concat(sujet.leurres)).forEach(function(nom){
        zoneChoix.append(el('button', { class: 'bouton', onclick: function(){
          if(nom === sujet.nom){
            jeu.point(25); sonJuste();
            jeu.dire('Oui, ' + sujet.nom.toLowerCase() + ' !', 'ok');
          } else {
            sonFaux();
            jeu.dire("Non, c'était " + sujet.nom.toLowerCase() + '.', 'non');
          }
          /* on dévoile entièrement avant de passer à la suite */
          ctx.clearRect(0, 0, LARGEUR, HAUTEUR);
          tour++;
          jeu.avance(tour, TOURS);
          setTimeout(function(){
            if(tour >= TOURS) jeu.terminer(); else nouveauTour();
          }, 1400);
        }}, nom));
      });
    }

    nouveauTour();
  }
});

/* ---------- 2. Le clic gauche ---------- */
ajouterExercice({
  id: 'souris-clic-gauche',
  famille: 'souris',
  icone: 'icones/clic-gauche.svg',
  titre: 'Le clic gauche',
  resume: 'Faites éclater les bulles, une par une.',
  consigne: 'Posez le pointeur sur la bulle et appuyez une fois sur le bouton gauche.',
  demarrer: function(scene, jeu, niveau){
    exerciceDeClic(scene, jeu, {
      nombre: parNiveau(niveau, {facile:8, moyen:12, fort:16}),
      taille: parNiveau(niveau, {facile:104, moyen:84, fort:60}),
      eclate: true,
      image: 'jeu/bulle.svg', imageApres: 'jeu/bulle-eclatee.svg',
      brancher: function(cible, reussite){
        cible.addEventListener('click', reussite);
      }
    });
  }
});

/* ---------- 3. Le clic droit ---------- */
ajouterExercice({
  id: 'souris-clic-droit',
  famille: 'souris',
  icone: 'icones/clic-droit.svg',
  titre: 'Le clic droit',
  resume: 'Ouvrez les cadenas avec le bouton de droite.',
  consigne: 'Appuyez sur le bouton droit de la souris, celui qui ouvre les menus.',
  demarrer: function(scene, jeu, niveau){
    exerciceDeClic(scene, jeu, {
      nombre: parNiveau(niveau, {facile:7, moyen:10, fort:14}),
      taille: parNiveau(niveau, {facile:100, moyen:82, fort:58}),
      image: 'jeu/cadenas-ferme.svg', imageApres: 'jeu/cadenas-ouvert.svg',
      brancher: function(cible, reussite, erreur){
        cible.addEventListener('contextmenu', function(e){ e.preventDefault(); reussite(); });
        cible.addEventListener('click', function(){
          erreur("C'est le bouton de droite qu'il faut utiliser.");
        });
      }
    });
  }
});

/* ---------- 4. Le double-clic ---------- */
ajouterExercice({
  id: 'souris-double-clic',
  famille: 'souris',
  icone: 'icones/double-clic.svg',
  titre: 'Le double-clic',
  resume: 'Ouvrez les dossiers avec deux clics rapides.',
  consigne: 'Deux clics gauches rapprochés, sans bouger la souris entre les deux.',
  demarrer: function(scene, jeu, niveau){
    // Délai maximum (en millisecondes) toléré entre les deux clics.
    // C'est le seul réglage qui définit ce qu'est un double-clic "réussi" :
    // on ne se fie pas au réglage de double-clic propre à chaque
    // ordinateur (il varie d'un poste à l'autre), on mesure nous-mêmes.
    var VITESSE_MAX = parNiveau(niveau, { facile: 700, moyen: 500, fort: 350 });

    exerciceDeClic(scene, jeu, {
      nombre: parNiveau(niveau, {facile:6, moyen:8, fort:11}),
      taille: parNiveau(niveau, {facile:104, moyen:88, fort:64}),
      image: 'jeu/dossier-ferme.svg', imageApres: 'jeu/dossier-ouvert.svg',
      brancher: function(cible, reussite, erreur){
        var dernierClic = 0;
        cible.addEventListener('click', function(){
          var maintenant = Date.now();
          var delta = maintenant - dernierClic;
          dernierClic = maintenant;

          if(delta <= VITESSE_MAX){
            dernierClic = 0;   // évite qu'un 3e clic rapproché compte à nouveau
            reussite();
          } else if(delta < VITESSE_MAX * 3){
            // deux clics ont bien eu lieu, mais trop espacés l'un de l'autre
            erreur('Presque : rapprochez un peu plus les deux clics.');
          }
          // sinon, c'est un premier clic isolé : on attend simplement le second
        });
      }
    });
  }
});

/* ---------- 5. Le labyrinthe ---------- */
ajouterExercice({
  id: 'souris-labyrinthe',
  famille: 'souris',
  icone: 'icones/labyrinthe.svg',
  titre: 'Le labyrinthe',
  resume: 'Traversez le couloir sans toucher les murs.',
  consigne: 'Partez de la case verte et rejoignez la case orange, sans toucher le noir.',
  demarrer: function(scene, jeu, niveau){
    // Cases plus petites à mesure que le niveau monte (60, 40, 30 px),
    // mais jamais plus grandes que ce que la fenêtre peut réellement
    // afficher : sur un écran ou une fenêtre étroite, les cases se
    // resserrent encore pour que le labyrinthe reste entièrement visible.
    var TAILLE_DEMANDEE = parNiveau(niveau, {facile:60, moyen:40, fort:30});
    var COLS = parNiveau(niveau, {facile:11, moyen:15, fort:21});
    var LIGNES = parNiveau(niveau, {facile:7, moyen:9, fort:13});
    var penalites = 0, parti = false, fini = false;
    jeu.max(100);

    function calculerTailleCase(){
      var disponible = mesureBoite(scene, 720, 440).largeur;
      var taille = Math.min(TAILLE_DEMANDEE, Math.floor((disponible - 4) / COLS));
      return Math.max(14, taille);
    }
    var TAILLE_CASE = calculerTailleCase();

    function genererGrille(){
      var g = [], x, y;
      for(y = 0; y < LIGNES; y++){ g.push([]); for(x = 0; x < COLS; x++) g[y].push(1); }
      var pile = [[1, 1]];
      g[1][1] = 0;
      while(pile.length){
        var sommet = pile[pile.length - 1];
        var dirs = melanger([[2,0], [-2,0], [0,2], [0,-2]]);
        var avance = false;
        for(var i = 0; i < dirs.length; i++){
          var nx = sommet[0] + dirs[i][0], ny = sommet[1] + dirs[i][1];
          if(nx > 0 && ny > 0 && nx < COLS - 1 && ny < LIGNES - 1 && g[ny][nx] === 1){
            g[ny][nx] = 0;
            g[sommet[1] + dirs[i][1] / 2][sommet[0] + dirs[i][0] / 2] = 0;
            pile.push([nx, ny]);
            avance = true;
            break;
          }
        }
        if(!avance) pile.pop();
      }
      return g;
    }

    var grille = genererGrille();
    var plan = el('div', { class: 'labyrinthe' });
    plan.style.gridTemplateColumns = 'repeat(' + COLS + ', ' + TAILLE_CASE + 'px)';
    var cases = [];

    for(var y = 0; y < LIGNES; y++) for(var x = 0; x < COLS; x++){
      (function(x, y){
        var mur = grille[y][x] === 1;
        var depart = (x === 1 && y === 1);
        var arrivee = (x === COLS - 2 && y === LIGNES - 2);
        var etat = mur ? 'mur' : depart ? 'depart' : arrivee ? 'arrivee' : 'libre';
        var c = el('div', { class: 'lab-case ' + etat });
        c.style.width = c.style.height = TAILLE_CASE + 'px';
        c.addEventListener('mouseenter', function(){
          if(fini) return;
          if(depart){ parti = true; jeu.dire('C\'est parti, suivez le couloir.', 'ok'); return; }
          if(!parti) return;
          if(mur){
            penalites++;
            sonFaux();
            parti = false;
            cases.forEach(function(k){ k.classList.remove('passee'); });
            jeu.dire('Mur touché. Repartez de la case verte.', 'non');
          } else if(arrivee){
            fini = true;
            jeu.point(Math.max(20, 100 - penalites * 12));
            jeu.avance(1, 1);
            sonJuste();
            jeu.dire('Arrivé !', 'ok');
            setTimeout(function(){ jeu.terminer(); }, 700);
          } else {
            c.classList.add('passee');
          }
        });
        cases.push(c);
        plan.append(c);
      })(x, y);
    }

    scene.append(plan, el('p', { class: 'indice' },
      'Chaque mur touché coûte 12 points. Allez lentement, c\'est le but de l\'exercice.'));
    jeu.dire('Posez le pointeur sur la case verte pour commencer.');

    /* Si la fenêtre est redimensionnée en cours de route, on resserre
       ou on desserre les cases sans reconstruire le labyrinthe : le
       trajet déjà repéré par l'apprenant reste le même. */
    function surRedimension(){
      var nouvelle = calculerTailleCase();
      if(nouvelle === TAILLE_CASE) return;
      TAILLE_CASE = nouvelle;
      plan.style.gridTemplateColumns = 'repeat(' + COLS + ', ' + TAILLE_CASE + 'px)';
      cases.forEach(function(c){ c.style.width = c.style.height = TAILLE_CASE + 'px'; });
    }
    window.addEventListener('resize', surRedimension);
    jeu.auMenage(function(){ window.removeEventListener('resize', surRedimension); });
  }
});

/* ---------- 6. Glisser-déposer ---------- */
ajouterExercice({
  id: 'souris-glisser',
  famille: 'souris',
  icone: 'icones/glisser.svg',
  titre: 'Glisser-déposer',
  resume: 'Attrapez chaque forme et posez-la sur sa jumelle.',
  consigne: "Appuyez sur la forme, gardez le bouton appuyé, déplacez, puis relâchez sur la case grise.",
  demarrer: function(scene, jeu, niveau){
    var nombre = parNiveau(niveau, {facile:3, moyen:4, fort:5});
    var FORMES = melanger(['rond', 'carre', 'triangle', 'etoile', 'losange']).slice(0, nombre);
    jeu.max(FORMES.length * 20);
    jeu.avance(0, FORMES.length);

    var atelier = el('div', { class: 'atelier-glisser' });
    var bacPieces = el('div', { class: 'bac' });
    var bacTrous = el('div', { class: 'bac' });
    atelier.append(bacPieces, el('div', { class: 'fleche' }, '➜'), bacTrous);
    scene.append(atelier);

    var trous = [];
    melanger(FORMES).forEach(function(forme){
      var t = el('div', { class: 'trou' });
      t.append(image('formes/' + forme + '.svg'));
      t.dataset.forme = forme;
      trous.push(t);
      bacTrous.append(t);
    });

    var places = 0;

    FORMES.forEach(function(forme){
      var piece = el('div', { class: 'piece' });
      piece.append(image('formes/' + forme + '.svg'));
      bacPieces.append(piece);

      piece.addEventListener('pointerdown', function(ev){
        if(piece.dataset.pose) return;
        ev.preventDefault();
        var r = piece.getBoundingClientRect();
        var dx = ev.clientX - r.left, dy = ev.clientY - r.top;
        var fantome = piece.cloneNode(true);
        fantome.className = 'piece prise';
        fantome.style.left = r.left + 'px';
        fantome.style.top = r.top + 'px';
        document.body.append(fantome);
        piece.style.opacity = '.25';

        function bouge(e){
          fantome.style.left = (e.clientX - dx) + 'px';
          fantome.style.top = (e.clientY - dy) + 'px';
          var sous = document.elementFromPoint(e.clientX, e.clientY);
          trous.forEach(function(t){
            t.classList.toggle('survol', t === sous && !t.dataset.pris);
          });
        }
        function lache(e){
          document.removeEventListener('pointermove', bouge);
          document.removeEventListener('pointerup', lache);
          fantome.remove();
          piece.style.opacity = '';
          trous.forEach(function(t){ t.classList.remove('survol'); });

          var sous = document.elementFromPoint(e.clientX, e.clientY);
          var trou = sous && sous.closest ? sous.closest('.trou') : null;
          if(trou && trou.dataset.forme === forme && !trou.dataset.pris){
            trou.classList.add('remplie');
            trou.dataset.pris = '1';
            piece.dataset.pose = '1';
            piece.style.visibility = 'hidden';
            places++;
            jeu.point(20);
            jeu.avance(places, FORMES.length);
            sonJuste();
            jeu.dire('Bien posé.', 'ok');
            if(places === FORMES.length) setTimeout(function(){ jeu.terminer(); }, 600);
          } else {
            sonFaux();
            jeu.dire('Relâchez bien au-dessus de la forme qui va avec.', 'non');
          }
        }
        document.addEventListener('pointermove', bouge);
        document.addEventListener('pointerup', lache);
      });
    });

    jeu.dire('Attrapez une forme et amenez-la en face.');
  }
});
