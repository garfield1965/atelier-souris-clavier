/* ==========================================================
   outils.js — petites fonctions utilisées partout
   ========================================================== */

var RESSOURCES = 'ressources/';

function $(selecteur, parent){ return (parent || document).querySelector(selecteur); }
function hasard(n){ return Math.floor(Math.random() * n); }
function piocher(tableau){ return tableau[hasard(tableau.length)]; }
function melanger(tableau){
  var t = tableau.slice();
  for(var i = t.length - 1; i > 0; i--){
    var j = hasard(i + 1), garde = t[i]; t[i] = t[j]; t[j] = garde;
  }
  return t;
}
function tirer(source, combien){
  var r = [];
  for(var i = 0; i < combien; i++) r.push(piocher(source));
  return r;
}

/* Mesure la taille réellement affichée d'un élément (après mise en page
   par le navigateur), avec une valeur de repli si l'élément n'a pas
   encore de taille (par exemple juste après sa création). Sert à faire
   dépendre les jeux de la taille réelle de la fenêtre plutôt que d'un
   nombre de pixels fixe, qui ne convient qu'à une seule résolution. */
function mesureBoite(element, largeurDefaut, hauteurDefaut){
  var largeur = element.clientWidth, hauteur = element.clientHeight;
  return {
    largeur: largeur > 0 ? largeur : largeurDefaut,
    hauteur: hauteur > 0 ? hauteur : hauteurDefaut
  };
}

/* Choisit une valeur selon le niveau ('facile', 'moyen', 'fort').
   Retombe sur 'moyen' si le niveau est inconnu ou absent. */
function parNiveau(niveau, valeurs){
  return valeurs[niveau] !== undefined ? valeurs[niveau] : valeurs.moyen;
}

/* Formate une durée en millisecondes en "m:ss". */
function formatDuree(ms){
  var secondes = Math.round(ms / 1000);
  var m = Math.floor(secondes / 60), s = secondes % 60;
  return m + ':' + (s < 10 ? '0' : '') + s;
}

/* Crée un élément. Les clés commençant par "on" deviennent des écouteurs. */
function el(balise, attributs, contenu){
  var n = document.createElement(balise);
  attributs = attributs || {};
  for(var cle in attributs){
    if(cle === 'class') n.className = attributs[cle];
    else if(cle === 'html') n.innerHTML = attributs[cle];
    else if(cle.slice(0, 2) === 'on') n.addEventListener(cle.slice(2), attributs[cle]);
    else n.setAttribute(cle, attributs[cle]);
  }
  if(contenu != null) n.textContent = contenu;
  return n;
}

/* Une image du répertoire ressources. */
function image(chemin, description){
  return el('img', { src: RESSOURCES + chemin, alt: description || '' });
}

/* ---------- sons fabriqués à la volée, aucun fichier audio ---------- */
var contexteAudio = null;
function bip(frequence, duree, forme){
  if(!donnees.son) return;
  try{
    contexteAudio = contexteAudio || new (window.AudioContext || window.webkitAudioContext)();
    var o = contexteAudio.createOscillator(), g = contexteAudio.createGain();
    o.type = forme || 'sine';
    o.frequency.value = frequence;
    g.gain.setValueAtTime(0.14, contexteAudio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, contexteAudio.currentTime + duree);
    o.connect(g); g.connect(contexteAudio.destination);
    o.start(); o.stop(contexteAudio.currentTime + duree);
  }catch(e){}
}
function sonJuste(){ bip(660, .12); setTimeout(function(){ bip(880, .14); }, 90); }
function sonFaux(){ bip(150, .2, 'square'); }
function sonFin(){
  [523, 659, 784, 1046].forEach(function(f, i){
    setTimeout(function(){ bip(f, .22); }, i * 110);
  });
}

/* ---------- confettis de fin ---------- */
function confettis(){
  var toile = $('#confettis');
  toile.hidden = false;
  toile.width = innerWidth; toile.height = innerHeight;
  var ctx = toile.getContext('2d');
  var couleurs = ['#1f5fd0', '#e08a00', '#17915f', '#cf3535', '#12203a'];
  var parts = [], i;
  for(i = 0; i < 90; i++) parts.push({
    x: innerWidth / 2 + hasard(260) - 130, y: innerHeight / 2,
    vx: Math.random() * 10 - 5, vy: Math.random() * -13 - 4,
    c: piocher(couleurs), t: Math.random() * 6.28, r: 5 + hasard(6)
  });
  var restant = 110;
  (function anime(){
    ctx.clearRect(0, 0, toile.width, toile.height);
    parts.forEach(function(p){
      p.x += p.vx; p.y += p.vy; p.vy += .42; p.t += .16;
      ctx.fillStyle = p.c;
      ctx.fillRect(p.x, p.y, p.r, p.r * Math.abs(Math.cos(p.t)));
    });
    if(restant-- > 0) requestAnimationFrame(anime);
    else { ctx.clearRect(0, 0, toile.width, toile.height); toile.hidden = true; }
  })();
}
