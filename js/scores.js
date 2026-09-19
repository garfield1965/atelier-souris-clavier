/* ==========================================================
   scores.js — mémoire des résultats et des réglages
   Tout est gardé dans le navigateur du poste, rien n'est envoyé.
   ========================================================== */

var CLE_MEMOIRE = 'atelier-souris-clavier-v1';

var donnees = {
  prenom: '',
  son: true,
  clavierVisible: true,   // réglage du clavier virtuel
  exercices: {},          // { "id@niveau": {meilleur, etoiles, essais, meilleurTemps} }
  dernierNiveau: {}       // { id: 'facile' | 'moyen' | 'fort' } — dernier niveau choisi
};

function charger(){
  try{
    var brut = localStorage.getItem(CLE_MEMOIRE);
    if(brut){
      var lu = JSON.parse(brut);
      for(var cle in lu) donnees[cle] = lu[cle];
    }
  }catch(e){}
}

function sauver(){
  try{ localStorage.setItem(CLE_MEMOIRE, JSON.stringify(donnees)); }catch(e){}
}

/* La clé de score combine l'exercice et le niveau : deux niveaux d'un
   même exercice gardent chacun leur propre meilleur score. */
function cleScore(idExercice, niveau){ return idExercice + '@' + niveau; }

function resultat(idExercice, niveau){
  return donnees.exercices[cleScore(idExercice, niveau)] ||
    { meilleur: 0, etoiles: 0, essais: 0, meilleurTemps: null };
}

function enregistrer(idExercice, niveau, points, etoiles, dureeMs){
  var avant = resultat(idExercice, niveau);
  donnees.exercices[cleScore(idExercice, niveau)] = {
    meilleur: Math.max(avant.meilleur, points),
    etoiles: Math.max(avant.etoiles, etoiles),
    essais: avant.essais + 1,
    meilleurTemps: avant.meilleurTemps ? Math.min(avant.meilleurTemps, dureeMs) : dureeMs
  };
  donnees.dernierNiveau[idExercice] = niveau;
  sauver();
  majCompteur();
}

/* Le meilleur résultat tous niveaux confondus, pour l'afficher sur
   la tuile de la liste. Retourne null si l'exercice n'a jamais été tenté. */
function meilleurResultatTousNiveaux(idExercice){
  var trouve = null;
  NIVEAUX.forEach(function(n){
    var r = resultat(idExercice, n.cle);
    if(r.essais && (!trouve || r.etoiles > trouve.etoiles ||
       (r.etoiles === trouve.etoiles && r.meilleur > trouve.meilleur))){
      trouve = { niveau: n.cle, libelle: n.libelle, meilleur: r.meilleur,
                 etoiles: r.etoiles, meilleurTemps: r.meilleurTemps };
    }
  });
  return trouve;
}

function totalPoints(){
  var somme = 0;
  for(var cle in donnees.exercices) somme += donnees.exercices[cle].meilleur;
  return somme;
}
function totalEtoiles(){
  var somme = 0;
  for(var cle in donnees.exercices) somme += donnees.exercices[cle].etoiles;
  return somme;
}

function majCompteur(){
  var nb = totalPoints();
  $('#compteur').textContent = nb + ' point' + (nb > 1 ? 's' : '') + '  ·  ' + totalEtoiles() + ' ★';
}

function dessinEtoiles(n){
  var sortie = '<span class="etoiles">';
  for(var i = 1; i <= 3; i++) sortie += (i <= n ? '★' : '<span class="off">★</span>');
  return sortie + '</span>';
}

/* Efface tous les scores (bouton en bas de l'accueil). */
function toutEffacer(){
  donnees.exercices = {};
  donnees.dernierNiveau = {};
  sauver();
  majCompteur();
}
