/* ==========================================================
   ecrans.js — accueil, liste d'une famille, écran d'exercice
   ========================================================== */

var racine, menageEnCours = [];

function nettoyer(){
  menageEnCours.forEach(function(fn){ try{ fn(); }catch(e){} });
  menageEnCours = [];
  racine.innerHTML = '';
}

/* ---------- accueil ---------- */
function ecranAccueil(){
  nettoyer();
  $('#btn-accueil').hidden = true;

  var intro = el('div', { class: 'intro' });
  intro.append(
    el('h1', null, donnees.prenom ? 'Bonjour ' + donnees.prenom + ' !'
                                  : 'Apprivoiser la souris et le clavier'),
    el('p', null, 'Choisissez un atelier. Chaque exercice se refait autant de fois ' +
                  'que vous voulez : seul votre meilleur résultat est gardé.')
  );

  var familles = el('div', { class: 'familles' });
  FAMILLES.forEach(function(f){
    var liste = exercicesDe(f.cle);
    var faits = liste.filter(function(e){ return resultat(e.id).etoiles > 0; }).length;

    var carte = el('button', { class: 'famille', onclick: function(){ ecranListe(f.cle); } });
    carte.dataset.f = f.cle;

    var zoneImage = el('div', { class: 'image' });
    zoneImage.append(image(f.image, f.titre));

    var texte = el('div', { class: 'texte' });
    texte.append(
      el('h2', null, f.titre),
      el('p', null, f.texte),
      el('div', { class: 'compte' }, liste.length + ' exercices · ' + faits + ' déjà réussis')
    );

    carte.append(zoneImage, texte);
    familles.append(carte);
  });

  var pied = el('p', { class: 'indice', style: 'margin-top:36px;text-align:left' });
  pied.append(el('button', { class: 'bouton discret', onclick: function(){
    if(confirm('Effacer tous les scores enregistrés sur ce poste ?')){
      toutEffacer();
      ecranAccueil();
    }
  }}, 'Remettre les scores à zéro'));

  racine.append(intro, familles, pied);
}

/* ---------- liste des exercices d'une famille ---------- */
function ecranListe(famille){
  nettoyer();
  $('#btn-accueil').hidden = false;

  var titre = famille === 'souris' ? 'Atelier souris' : 'Atelier clavier';
  var fil = el('div', { class: 'fil' });
  fil.append(el('h1', null, titre));

  var liste = el('div', { class: 'liste' });
  exercicesDe(famille).forEach(function(ex){
    var meilleur = meilleurResultatTousNiveaux(ex.id);

    var tuile = el('button', { class: 'tuile', onclick: function(){ ecranExercice(ex); } });
    tuile.dataset.f = famille;

    var pastille = el('div', { class: 'pastille' });
    pastille.append(image(ex.icone));

    var bilan = el('div', { class: 'bilan', html: dessinEtoiles(meilleur ? meilleur.etoiles : 0) });
    bilan.append(meilleur
      ? el('span', null, meilleur.meilleur + ' pts · ' + meilleur.libelle +
                          (meilleur.meilleurTemps ? ' · ' + formatDuree(meilleur.meilleurTemps) : ''))
      : el('span', { style: 'font-weight:400;color:var(--encre-doux)' }, 'jamais essayé'));

    var texte = el('div');
    texte.append(el('h3', null, ex.titre), el('p', null, ex.resume), bilan);

    tuile.append(pastille, texte);
    liste.append(tuile);
  });

  racine.append(fil, liste);
}

/* ---------- un exercice ---------- */
function ecranExercice(ex, niveauChoisi){
  nettoyer();
  $('#btn-accueil').hidden = false;

  var niveau = niveauChoisi || donnees.dernierNiveau[ex.id] || 'moyen';
  var points = 0, maximum = 100, termine = false, horlogeAide = null;

  /* ----- sélecteur de niveau ----- */
  var selecteur = el('div', { class: 'niveaux' });
  NIVEAUX.forEach(function(n){
    var actif = n.cle === niveau;
    selecteur.append(el('button', {
      class: 'niveau-bouton' + (actif ? ' actif' : ''),
      onclick: function(){ if(n.cle !== niveau) ecranExercice(ex, n.cle); }
    }, n.libelle));
  });

  /* ----- chronomètre ----- */
  var debut = Date.now();
  var chrono = el('div', { class: 'compteur' }, '0:00');
  var horlogeChrono = setInterval(function(){
    chrono.textContent = formatDuree(Date.now() - debut);
  }, 500);

  var jauge = el('div', { class: 'jauge' });
  var remplissage = el('i');
  jauge.append(remplissage);
  var compteur = el('div', { class: 'compteur' }, '0 pt');

  var barre = el('div', { class: 'barre' });
  barre.append(
    el('h2', null, ex.titre),
    selecteur,
    el('div', { class: 'consigne' }, ex.consigne),
    jauge, compteur, chrono,
    el('button', { class: 'bouton discret', onclick: function(){ ecranListe(ex.famille); } }, 'Retour')
  );

  var scene = el('div', { class: 'scene' });
  var zone = el('div', { class: 'scene-contenu' });
  var aide = el('div', { class: 'aide' });
  scene.append(zone, aide);
  racine.append(barre, scene);

  var jeu = {
    max: function(n){ maximum = n; },
    point: function(n){
      points += n;
      compteur.textContent = points + ' pt' + (points > 1 ? 's' : '');
    },
    avance: function(fait, total){
      remplissage.style.width = Math.round(fait / total * 100) + '%';
    },
    dire: function(texte, genre){
      aide.textContent = texte;
      aide.className = 'aide' + (genre ? ' ' + genre : '');
      clearTimeout(horlogeAide);
      horlogeAide = setTimeout(function(){
        aide.textContent = ''; aide.className = 'aide';
      }, 2400);
    },
    auMenage: function(fn){ menageEnCours.push(fn); },
    terminer: function(){
      if(termine) return;
      termine = true;
      clearInterval(horlogeChrono);
      var dureeMs = Date.now() - debut;
      chrono.textContent = formatDuree(dureeMs);

      var part = maximum ? points / maximum : 0;
      var etoiles = part >= .9 ? 3 : part >= .65 ? 2 : part > 0 ? 1 : 0;
      enregistrer(ex.id, niveau, points, etoiles, dureeMs);
      sonFin();
      if(etoiles === 3) confettis();

      var commentaire = etoiles === 3 ? "Parfait, c'est maîtrisé."
        : etoiles === 2 ? 'Bien joué. Un tour de plus et ce sera parfait.'
        : "C'est un début. Refaites-le tranquillement, sans vous presser.";

      var fin = el('div', { class: 'bilan-fin' });
      fin.append(
        el('div', { class: 'grosses-etoiles', html: dessinEtoiles(etoiles) }),
        el('h2', null, points + ' points sur ' + maximum),
        el('p', null, 'Niveau ' + niveau + ' · terminé en ' + formatDuree(dureeMs)),
        el('p', null, commentaire)
      );
      var actions = el('div', { class: 'actions' });
      actions.append(
        el('button', { class: 'bouton principal', onclick: function(){ ecranExercice(ex, niveau); } }, 'Recommencer'),
        el('button', { class: 'bouton', onclick: function(){ ecranListe(ex.famille); } }, 'Autre exercice')
      );
      fin.append(actions);
      scene.append(fin);
    }
  };

  menageEnCours.push(function(){ clearTimeout(horlogeAide); clearInterval(horlogeChrono); });
  ex.demarrer(zone, jeu, niveau);
}
