/* ==========================================================
   moteurs.js — deux moteurs réutilisables
   1. exerciceDeClic  : des cibles apparaissent, un geste les valide
   2. exerciceDeFrappe : une suite à taper, avec clavier AZERTY à l'écran
   ========================================================== */

/* ----------------------------------------------------------
   1. MOTEUR DE CLIC
   options = {
     nombre, taille, image, imageApres,
     brancher: function(cible, reussite, erreur){ ... }
   }
   ---------------------------------------------------------- */
function exerciceDeClic(scene, jeu, options){
  var NOMBRE = options.nombre;
  jeu.max(NOMBRE * 10);
  jeu.avance(0, NOMBRE);

  var terrain = el('div', { class: 'terrain' });
  scene.append(terrain);
  terrain.addEventListener('contextmenu', function(e){ e.preventDefault(); });

  var apparues = 0, cibleActuelle = null;

  /* La cible se replace dans les limites réelles du terrain, quelle
     que soit la résolution de l'écran ou la largeur de la fenêtre du
     navigateur — jamais d'après un nombre de pixels fixe. */
  function placerDansLeTerrain(cible, taille){
    var boite = mesureBoite(terrain, 720, 380);
    var maxX = Math.max(0, boite.largeur - taille);
    var maxY = Math.max(0, boite.hauteur - taille);
    cible.style.left = hasard(maxX + 1) + 'px';
    cible.style.top = hasard(maxY + 1) + 'px';
  }

  function suivante(){
    if(apparues >= NOMBRE){ setTimeout(function(){ jeu.terminer(); }, 500); return; }
    apparues++;

    var taille = options.taille;
    var cible = el('button', { class: 'cible' });
    cible.style.width = taille + 'px';
    cible.style.height = taille + 'px';
    placerDansLeTerrain(cible, taille);
    cible.append(image(options.image));
    terrain.append(cible);
    cibleActuelle = cible;

    function reussite(){
      if(cible.dataset.fini) return;
      cible.dataset.fini = '1';
      cibleActuelle = null;
      jeu.point(10);
      sonJuste();
      cible.innerHTML = '';
      cible.append(image(options.imageApres));
      if(options.eclate) cible.classList.add('partie');
      jeu.avance(apparues, NOMBRE);
      setTimeout(function(){ cible.remove(); suivante(); }, 340);
    }
    function erreur(message){
      if(cible.dataset.fini) return;
      sonFaux();
      jeu.point(-2);
      jeu.dire(message, 'non');
    }
    options.brancher(cible, reussite, erreur);
  }

  /* Si la fenêtre change de taille pendant l'exercice (écran externe
     branché, navigateur redimensionné), on ramène la cible affichée
     dans les nouvelles limites plutôt que de la laisser hors champ. */
  function surRedimension(){
    if(cibleActuelle) placerDansLeTerrain(cibleActuelle, parseFloat(cibleActuelle.style.width));
  }
  window.addEventListener('resize', surRedimension);
  jeu.auMenage(function(){ window.removeEventListener('resize', surRedimension); });

  suivante();
}

/* ----------------------------------------------------------
   2. LE CLAVIER AZERTY DESSINÉ À L'ÉCRAN
   Chaque touche : [caractère du bas, caractère du haut, libellé, largeur]
   ---------------------------------------------------------- */
var RANGEES_AZERTY = [
  [['²',''],['&','1'],['é','2'],['"','3'],["'",'4'],['(','5'],['-','6'],['è','7'],
   ['_','8'],['ç','9'],['à','0'],[')','°'],['=','+'],['Backspace','','Retour',2]],
  [['Tab','','Tab',1.6],['a','A'],['z','Z'],['e','E'],['r','R'],['t','T'],['y','Y'],
   ['u','U'],['i','I'],['o','O'],['p','P'],['^','¨'],['$','£']],
  [['CapsLock','','Verr. Maj',1.9],['q','Q'],['s','S'],['d','D'],['f','F'],['g','G'],
   ['h','H'],['j','J'],['k','K'],['l','L'],['m','M'],['ù','%'],['Enter','','Entrée',1.8]],
  [['Shift','','Maj ⇧',2.4],['<','>'],['w','W'],['x','X'],['c','C'],['v','V'],['b','B'],
   ['n','N'],[',','?'],[';','.'],[':','/'],['!','§'],['Shift','','Maj ⇧',2.4]],
  [['Espace',' ','',7]]
];
var TOUCHES_SPECIALES = ['Backspace', 'Tab', 'CapsLock', 'Enter', 'Shift', 'Espace'];

/* Lettres composées avec la touche accent (^ ou ¨) suivie de la voyelle.
   Sur un clavier français, ë/ï/ô/î/û ne sont pas des touches directes :
   il faut presser l'accent (une "touche morte", invisible à l'écran)
   puis la voyelle. Le navigateur envoie alors, dans l'ordre, une touche
   "Dead" puis la lettre déjà composée. */
var ACCENTS_COMPOSES = {
  'ô': { maj: false, base: 'o' },
  'î': { maj: false, base: 'i' },
  'û': { maj: false, base: 'u' },
  'ë': { maj: true,  base: 'e' },
  'ï': { maj: true,  base: 'i' }
};

function construireClavier(){
  var clavier = el('div', { class: 'clavier' });
  var index = {};   // caractère tapé -> { touche, maj }

  RANGEES_AZERTY.forEach(function(rang){
    var ligne = el('div', { class: 'rangee' });
    rang.forEach(function(def){
      var bas = def[0], haut = def[1], libelle = def[2], largeur = def[3];
      var t = el('div', { class: 'touche' });
      if(largeur) t.style.minWidth = (largeur * 42) + 'px';

      if(TOUCHES_SPECIALES.indexOf(bas) !== -1){
        t.textContent = libelle || bas;
        t.style.fontSize = '13px';
        if(bas === 'Shift') t.dataset.maj = '1';
        if(bas === 'Espace') index[' '] = { touche: t, maj: false };
        else index[bas] = { touche: t, maj: false };
      }
      else if(/^[a-z]$/.test(bas)){          // vraie lettre
        t.textContent = bas.toUpperCase();
        index[bas] = { touche: t, maj: false };
        index[bas.toUpperCase()] = { touche: t, maj: true };
      }
      else {                                  // é/è/ç/à portent un chiffre, ponctuation, etc.
        t.append(el('small', null, haut), document.createTextNode(bas));
        index[bas] = { touche: t, maj: false };
        if(haut) index[haut] = { touche: t, maj: true };
      }
      ligne.append(t);
    });
    clavier.append(ligne);
  });

  return { clavier: clavier, index: index };
}

/* ----------------------------------------------------------
   3. MOTEUR DE FRAPPE
   options = {
     suites : tableau de chaînes ('a', 'maison', 'Le chat dort.')
              ou de tableaux de jetons {valeur, libelle} pour les
              touches qui n'écrivent pas de lettre
     indice : phrase d'aide sous la zone
     rappel : message affiché en cas de mauvaise touche
   }
   ---------------------------------------------------------- */
function exerciceDeFrappe(scene, jeu, options){
  var suites = options.suites;
  var total = 0;
  suites.forEach(function(s){ total += s.length; });
  jeu.max(total * 10);

  var affichage = el('div', { class: 'cible-texte' });
  var indice = el('p', { class: 'indice' }, options.indice || '');
  var construit = construireClavier();
  var clavier = construit.clavier, index = construit.index;

  var bascule = el('button', { class: 'bouton discret', onclick: function(){
    donnees.clavierVisible = !donnees.clavierVisible;
    sauver();
    majAffichageClavier();
  }});

  function majAffichageClavier(){
    clavier.classList.toggle('masque', !donnees.clavierVisible);
    bascule.textContent = donnees.clavierVisible ? 'Masquer le clavier' : 'Afficher le clavier';
  }

  scene.append(affichage, indice, bascule, clavier);
  majAffichageClavier();

  var numero = 0, position = 0, faits = 0;
  var etapeAccent = 0;   // 0 : rien en attente : 1 : touche morte déjà pressée, voyelle attendue

  /* Une suite devient une liste de jetons {valeur, libelle}. */
  function jetons(suite){
    if(typeof suite !== 'string') return suite;
    return suite.split('').map(function(c){
      return { valeur: c, libelle: c === ' ' ? '␣' : c };
    });
  }

  function echapper(texte){
    return texte.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function dessiner(){
    var liste = jetons(suites[numero]);
    affichage.innerHTML = liste.map(function(j, i){
      var etat = i < position ? 'fait' : (i === position ? 'encours' : 'reste');
      return '<span class="' + etat + '">' + echapper(j.libelle) + '</span>';
    }).join('');

    var touches = clavier.querySelectorAll('.touche');
    Array.prototype.forEach.call(touches, function(t){
      t.classList.remove('attendue', 'maj-attendue');
    });
    var attendu = liste[position];
    var compose = attendu && ACCENTS_COMPOSES[attendu.valeur];
    var trouvee;

    if(compose){
      /* deux touches à presser l'une après l'autre : on surligne
         d'abord l'accent, puis la voyelle une fois l'accent pressé */
      trouvee = etapeAccent === 0 ? index[compose.maj ? '¨' : '^'] : index[compose.base];
    } else {
      trouvee = attendu && index[attendu.valeur];
    }

    if(trouvee){
      trouvee.touche.classList.add('attendue');
      if(trouvee.maj){
        Array.prototype.forEach.call(clavier.querySelectorAll('[data-maj]'), function(t){
          t.classList.add('maj-attendue');
        });
      }
    }
  }

  function valider(){
    position++; faits++;
    jeu.point(10);
    bip(700, .07);
    jeu.avance(faits, total);
    if(position >= jetons(suites[numero]).length){
      sonJuste();
      jeu.dire('Bravo.', 'ok');
      numero++; position = 0;
      if(numero >= suites.length){ setTimeout(function(){ jeu.terminer(); }, 500); return; }
    }
    dessiner();
  }

  function frappe(ev){
    if(ev.ctrlKey || ev.altKey || ev.metaKey || ev.key === 'F5') return;
    if(ev.key === 'Tab'){ ev.preventDefault(); return; }
    if(['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].indexOf(ev.key) !== -1) return;

    var liste = jetons(suites[numero]);
    var attendu = liste[position];
    if(!attendu) return;
    var compose = ACCENTS_COMPOSES[attendu.valeur];

    if(compose && etapeAccent === 0){
      /* première touche d'une lettre composée : la touche morte ne
         produit pas de caractère, le navigateur l'annonce comme "Dead" */
      if(ev.key === 'Dead' || ev.key === '^' || ev.key === '¨'){
        ev.preventDefault();
        etapeAccent = 1;
        bip(500, .05);
        dessiner();
        return;
      }
      ev.preventDefault();
      sonFaux();
      jeu.dire('Pour ' + attendu.valeur + ', commencez par la touche accent surlignée.', 'non');
      return;
    }

    ev.preventDefault();

    if(ev.key === attendu.valeur){
      etapeAccent = 0;
      valider();
    } else {
      etapeAccent = 0;
      sonFaux();
      affichage.classList.add('secoue');
      setTimeout(function(){ affichage.classList.remove('secoue'); }, 250);
      jeu.dire(options.rappel || 'Pas la bonne touche. Prenez votre temps.', 'non');
      dessiner();
    }
  }

  document.addEventListener('keydown', frappe);
  jeu.auMenage(function(){ document.removeEventListener('keydown', frappe); });
  dessiner();
}
