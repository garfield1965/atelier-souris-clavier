/* ==========================================================
   demarrage.js — branche l'en-tête et ouvre l'accueil.
   Doit rester le dernier script chargé par index.html.
   ========================================================== */

racine = $('#racine');
charger();
majCompteur();

var champPrenom = $('#prenom');
champPrenom.value = donnees.prenom;
champPrenom.addEventListener('input', function(e){
  donnees.prenom = e.target.value;
  sauver();
});

$('#btn-accueil').addEventListener('click', ecranAccueil);

var boutonSon = $('#btn-son');
function majBoutonSon(){
  boutonSon.textContent = donnees.son ? 'Son activé' : 'Son coupé';
}
boutonSon.addEventListener('click', function(){
  donnees.son = !donnees.son;
  sauver();
  majBoutonSon();
});
majBoutonSon();

ecranAccueil();
