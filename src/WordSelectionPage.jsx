import { useState, useEffect } from 'react';

// Word categories directly in the file
const wordCategories = {
  animals: [
    { word: 'chat', hint: 'domestique' },
    { word: 'chien', hint: 'fidèle' },
    { word: 'lion', hint: 'roi' },
    { word: 'tigre', hint: 'rayures' },
    { word: 'éléphant', hint: 'trompe' },
    { word: 'girafe', hint: 'cou' },
    { word: 'zèbre', hint: 'rayures' },
    { word: 'cheval', hint: 'galop' },
    { word: 'vache', hint: 'lait' },
    { word: 'mouton', hint: 'laine' },
    { word: 'chèvre', hint: 'cornes' },
    { word: 'cochon', hint: 'ferme' },
    { word: 'lapin', hint: 'oreilles' },
    { word: 'hamster', hint: 'roue' },
    { word: 'souris', hint: 'fromage' },
    { word: 'rat', hint: 'égout' },
    { word: 'écureuil', hint: 'gland' },
    { word: 'ours', hint: 'miel' },
    { word: 'loup', hint: 'meute' },
    { word: 'renard', hint: 'rusé' },
    { word: 'cerf', hint: 'bois' },
    { word: 'biche', hint: 'forêt' },
    { word: 'sanglier', hint: 'défense' },
    { word: 'blaireau', hint: 'terrier' },
    { word: 'hérisson', hint: 'piquant' },
    { word: 'chauve-souris', hint: 'nuit' },
    { word: 'dauphin', hint: 'intelligent' },
    { word: 'baleine', hint: 'géant' },
    { word: 'requin', hint: 'aileron' },
    { word: 'poisson', hint: 'eau' },
    { word: 'anguille', hint: 'glissant' },
    { word: 'méduse', hint: 'urticant' },
    { word: 'crabe', hint: 'pinces' },
    { word: 'homard', hint: 'carapace' },
    { word: 'crevette', hint: 'rose' },
    { word: 'pieuvre', hint: 'tentacules' },
    { word: 'calmar', hint: 'encre' },
    { word: 'tortue', hint: 'lenteur' },
    { word: 'serpent', hint: 'venin' },
    { word: 'lézard', hint: 'écaille' },
    { word: 'iguane', hint: 'tropical' },
    { word: 'crocodile', hint: 'mâchoire' },
    { word: 'alligator', hint: 'marais' },
    { word: 'grenouille', hint: 'saut' },
    { word: 'crapaud', hint: 'verrue' },
    { word: 'salamandre', hint: 'humide' },
    { word: 'papillon', hint: 'ailes' },
    { word: 'abeille', hint: 'miel' },
    { word: 'guêpe', hint: 'piqûre' },
    { word: 'fourmi', hint: 'travail' },
    { word: 'coccinelle', hint: 'points' },
    { word: 'scarabée', hint: 'carapace' },
    { word: 'moustique', hint: 'piqûre' },
    { word: 'araignée', hint: 'toile' },
    { word: 'scorpion', hint: 'dard' },
    { word: 'pigeon', hint: 'ville' },
    { word: 'moineau', hint: 'chant' },
    { word: 'aigle', hint: 'royal' },
    { word: 'faucon', hint: 'vitesse' },
    { word: 'hibou', hint: 'sage' },
    { word: 'chouette', hint: 'nuit' },
    { word: 'corbeau', hint: 'noir' },
    { word: 'perroquet', hint: 'parle' },
    { word: 'pingouin', hint: 'glace' },
    { word: 'manchot', hint: 'antarctique' },
    { word: 'autruche', hint: 'rapide' },
    { word: 'paon', hint: 'plumes' },
    { word: 'cygne', hint: 'élégant' },
    { word: 'canard', hint: 'étang' },
    { word: 'oie', hint: 'bruyante' }
  ],
  
  food: [
    { word: 'pomme', hint: 'fruit' },
    { word: 'poire', hint: 'juteux' },
    { word: 'banane', hint: 'jaune' },
    { word: 'orange', hint: 'agrume' },
    { word: 'citron', hint: 'acide' },
    { word: 'mandarine', hint: 'sucré' },
    { word: 'clémentine', hint: 'hiver' },
    { word: 'fraise', hint: 'rouge' },
    { word: 'framboise', hint: 'baie' },
    { word: 'myrtille', hint: 'bleu' },
    { word: 'mûre', hint: 'sauvage' },
    { word: 'cerise', hint: 'noyau' },
    { word: 'abricot', hint: 'été' },
    { word: 'pêche', hint: 'duvet' },
    { word: 'nectarine', hint: 'lisse' },
    { word: 'prune', hint: 'violet' },
    { word: 'raisin', hint: 'grappe' },
    { word: 'melon', hint: 'frais' },
    { word: 'pastèque', hint: 'eau' },
    { word: 'ananas', hint: 'tropical' },
    { word: 'mangue', hint: 'exotique' },
    { word: 'kiwi', hint: 'vert' },
    { word: 'figue', hint: 'méditerranée' },
    { word: 'datte', hint: 'sèche' },
    { word: 'olive', hint: 'huile' },

    { word: 'pain', hint: 'boulangerie' },
    { word: 'baguette', hint: 'français' },
    { word: 'croissant', hint: 'beurre' },
    { word: 'brioche', hint: 'moelleux' },
    { word: 'focaccia', hint: 'italien' },
    { word: 'pita', hint: 'plat' },
    { word: 'tortilla', hint: 'maïs' },

    { word: 'fromage', hint: 'laitier' },
    { word: 'camembert', hint: 'normand' },
    { word: 'brie', hint: 'doux' },
    { word: 'roquefort', hint: 'bleu' },
    { word: 'comté', hint: 'montagne' },
    { word: 'emmental', hint: 'trous' },
    { word: 'gruyère', hint: 'fondant' },
    { word: 'parmesan', hint: 'italien' },
    { word: 'chèvre', hint: 'frais' },
    { word: 'mozzarella', hint: 'blanc' },

    { word: 'lait', hint: 'boisson' },
    { word: 'beurre', hint: 'gras' },
    { word: 'crème', hint: 'épais' },
    { word: 'yaourt', hint: 'fermenté' },
    { word: 'œuf', hint: 'coquille' },

    { word: 'riz', hint: 'céréale' },
    { word: 'pâtes', hint: 'blé' },
    { word: 'quinoa', hint: 'graine' },
    { word: 'semoule', hint: 'fine' },
    { word: 'couscous', hint: 'maghreb' },
    { word: 'lentilles', hint: 'protéines' },
    { word: 'pois', hint: 'vert' },
    { word: 'haricots', hint: 'secs' },
    { word: 'pois chiches', hint: 'houmous' },

    { word: 'poulet', hint: 'volaille' },
    { word: 'bœuf', hint: 'rouge' },
    { word: 'porc', hint: 'charcuterie' },
    { word: 'agneau', hint: 'tendre' },
    { word: 'dinde', hint: 'fête' },
    { word: 'jambon', hint: 'salé' },
    { word: 'saucisse', hint: 'grillade' },
    { word: 'steak', hint: 'grill' },

    { word: 'saumon', hint: 'rose' },
    { word: 'thon', hint: 'conserve' },
    { word: 'cabillaud', hint: 'blanc' },
    { word: 'sardine', hint: 'huile' },
    { word: 'maquereau', hint: 'fumé' },

    { word: 'carotte', hint: 'orange' },
    { word: 'pomme de terre', hint: 'fécule' },
    { word: 'tomate', hint: 'rouge' },
    { word: 'concombre', hint: 'frais' },
    { word: 'courgette', hint: 'verte' },
    { word: 'aubergine', hint: 'violette' },
    { word: 'poivron', hint: 'croquant' },
    { word: 'oignon', hint: 'piquant' },
    { word: 'ail', hint: 'arôme' },
    { word: 'échalote', hint: 'subtil' },
    { word: 'salade', hint: 'feuille' },
    { word: 'épinard', hint: 'vert' },

    { word: 'sucre', hint: 'doux' },
    { word: 'sel', hint: 'salé' },
    { word: 'poivre', hint: 'épice' },
    { word: 'miel', hint: 'naturel' },
    { word: 'huile', hint: 'cuisson' },
    { word: 'vinaigre', hint: 'acide' },

    { word: 'chocolat', hint: 'cacao' },
    { word: 'biscuit', hint: 'sec' },
    { word: 'gâteau', hint: 'dessert' },
    { word: 'tarte', hint: 'four' },
    { word: 'crêpe', hint: 'fine' },
    { word: 'glace', hint: 'froid' }
  ],
  
  objects: [
    { word: 'table', hint: 'meuble' },
    { word: 'chaise', hint: 'assis' },
    { word: 'canapé', hint: 'salon' },
    { word: 'fauteuil', hint: 'confort' },
    { word: 'lit', hint: 'sommeil' },
    { word: 'matelas', hint: 'mousse' },
    { word: 'oreiller', hint: 'tête' },
    { word: 'couverture', hint: 'chaud' },
    { word: 'armoire', hint: 'rangement' },
    { word: 'commode', hint: 'tiroirs' },
    { word: 'étagère', hint: 'livres' },
    { word: 'bureau', hint: 'travail' },
    { word: 'lampe', hint: 'lumière' },
    { word: 'ampoule', hint: 'éclairage' },
    { word: 'interrupteur', hint: 'mur' },
    { word: 'prise', hint: 'courant' },
    { word: 'câble', hint: 'fil' },
    { word: 'multiprise', hint: 'prises' },

    { word: 'télévision', hint: 'écran' },
    { word: 'télécommande', hint: 'boutons' },
    { word: 'radio', hint: 'son' },
    { word: 'enceinte', hint: 'audio' },
    { word: 'casque', hint: 'écoute' },
    { word: 'écouteurs', hint: 'oreille' },

    { word: 'ordinateur', hint: 'calcul' },
    { word: 'clavier', hint: 'touches' },
    { word: 'souris', hint: 'clic' },
    { word: 'écran', hint: 'affichage' },
    { word: 'imprimante', hint: 'papier' },
    { word: 'scanner', hint: 'numériser' },

    { word: 'téléphone', hint: 'appel' },
    { word: 'smartphone', hint: 'mobile' },
    { word: 'chargeur', hint: 'batterie' },
    { word: 'batterie', hint: 'énergie' },
    { word: 'câble usb', hint: 'connexion' },

    { word: 'stylo', hint: 'encre' },
    { word: 'crayon', hint: 'mine' },
    { word: 'gomme', hint: 'effacer' },
    { word: 'feutre', hint: 'couleur' },
    { word: 'cahier', hint: 'pages' },
    { word: 'livre', hint: 'lecture' },
    { word: 'agenda', hint: 'dates' },

    { word: 'sac', hint: 'transport' },
    { word: 'sac à dos', hint: 'école' },
    { word: 'valise', hint: 'voyage' },
    { word: 'portefeuille', hint: 'argent' },
    { word: 'clé', hint: 'serrure' },
    { word: 'trousseau', hint: 'clés' },

    { word: 'montre', hint: 'temps' },
    { word: 'réveil', hint: 'matin' },
    { word: 'horloge', hint: 'mur' },

    { word: 'miroir', hint: 'reflet' },
    { word: 'brosse', hint: 'cheveux' },
    { word: 'peigne', hint: 'dents' },
    { word: 'rasoir', hint: 'lame' },
    { word: 'serviette', hint: 'séchage' },

    { word: 'assiette', hint: 'repas' },
    { word: 'bol', hint: 'soupe' },
    { word: 'verre', hint: 'boisson' },
    { word: 'tasse', hint: 'chaud' },
    { word: 'fourchette', hint: 'piques' },
    { word: 'couteau', hint: 'lame' },
    { word: 'cuillère', hint: 'creux' },
    { word: 'poêle', hint: 'cuisson' },
    { word: 'casserole', hint: 'feu' },
    { word: 'four', hint: 'chaleur' },
    { word: 'micro-ondes', hint: 'rapide' },
    { word: 'réfrigérateur', hint: 'froid' },

    { word: 'balai', hint: 'nettoyage' },
    { word: 'serpillière', hint: 'sol' },
    { word: 'aspirateur', hint: 'poussière' },
    { word: 'poubelle', hint: 'déchets' }
  ],

  places: [
    { word: 'maison', hint: 'habitat' },
    { word: 'appartement', hint: 'immeuble' },
    { word: 'studio', hint: 'petit' },
    { word: 'villa', hint: 'luxueux' },
    { word: 'immeuble', hint: 'étages' },
    { word: 'résidence', hint: 'logement' },

    { word: 'salon', hint: 'canapé' },
    { word: 'cuisine', hint: 'repas' },
    { word: 'chambre', hint: 'sommeil' },
    { word: 'salle de bain', hint: 'douche' },
    { word: 'toilettes', hint: 'sanitaire' },
    { word: 'garage', hint: 'voiture' },
    { word: 'cave', hint: 'stockage' },
    { word: 'grenier', hint: 'combles' },
    { word: 'balcon', hint: 'extérieur' },
    { word: 'terrasse', hint: 'soleil' },
    { word: 'jardin', hint: 'plantes' },
    { word: 'cour', hint: 'intérieure' },

    { word: 'rue', hint: 'passage' },
    { word: 'avenue', hint: 'large' },
    { word: 'boulevard', hint: 'urbain' },
    { word: 'impasse', hint: 'fermée' },
    { word: 'carrefour', hint: 'croisement' },
    { word: 'trottoir', hint: 'piéton' },
    { word: 'place', hint: 'publique' },
    { word: 'quartier', hint: 'zone' },

    { word: 'ville', hint: 'urbaine' },
    { word: 'village', hint: 'rural' },
    { word: 'banlieue', hint: 'périphérie' },
    { word: 'centre-ville', hint: 'commerce' },
    { word: 'zone industrielle', hint: 'usines' },
    { word: 'zone commerciale', hint: 'magasins' },

    { word: 'école', hint: 'élèves' },
    { word: 'collège', hint: 'ados' },
    { word: 'lycée', hint: 'études' },
    { word: 'université', hint: 'campus' },
    { word: 'bibliothèque', hint: 'livres' },
    { word: 'crèche', hint: 'enfants' },

    { word: 'bureau', hint: 'travail' },
    { word: 'entreprise', hint: 'emploi' },
    { word: 'usine', hint: 'production' },
    { word: 'chantier', hint: 'construction' },
    { word: 'entrepôt', hint: 'stock' },

    { word: 'magasin', hint: 'achat' },
    { word: 'supermarché', hint: 'courses' },
    { word: 'boutique', hint: 'vente' },
    { word: 'centre commercial', hint: 'galeries' },
    { word: 'marché', hint: 'étals' },
    { word: 'boulangerie', hint: 'pain' },
    { word: 'pharmacie', hint: 'médicaments' },
    { word: 'librairie', hint: 'lecture' },

    { word: 'restaurant', hint: 'repas' },
    { word: 'café', hint: 'boisson' },
    { word: 'bar', hint: 'soirée' },
    { word: 'cantine', hint: 'collectif' },
    { word: 'fast-food', hint: 'rapide' },

    { word: 'hôpital', hint: 'soins' },
    { word: 'clinique', hint: 'médical' },
    { word: 'cabinet', hint: 'consultation' },
    { word: 'pharmacie', hint: 'ordonnance' },

    { word: 'gare', hint: 'train' },
    { word: 'station', hint: 'transport' },
    { word: 'aéroport', hint: 'avion' },
    { word: 'port', hint: 'bateaux' },
    { word: 'parking', hint: 'stationnement' },

    { word: 'parc', hint: 'verdure' },
    { word: 'square', hint: 'bancs' },
    { word: 'forêt', hint: 'arbres' },
    { word: 'bois', hint: 'nature' },
    { word: 'plage', hint: 'sable' },
    { word: 'montagne', hint: 'altitude' },
    { word: 'colline', hint: 'pente' },
    { word: 'vallée', hint: 'creux' },
    { word: 'rivière', hint: 'eau' },
    { word: 'lac', hint: 'calme' },
    { word: 'fleuve', hint: 'courant' },

    { word: 'stade', hint: 'sport' },
    { word: 'gymnase', hint: 'activité' },
    { word: 'piscine', hint: 'nage' },
    { word: 'salle de sport', hint: 'entraînement' },
    { word: 'cinéma', hint: 'film' },
    { word: 'théâtre', hint: 'scène' },
    { word: 'musée', hint: 'exposition' }
  ],

  jobs: [
    { word: 'médecin', hint: 'soins' },
    { word: 'infirmier', hint: 'hôpital' },
    { word: 'chirurgien', hint: 'opération' },
    { word: 'dentiste', hint: 'dents' },
    { word: 'pharmacien', hint: 'médicaments' },
    { word: 'sage-femme', hint: 'naissance' },
    { word: 'kinésithérapeute', hint: 'rééducation' },
    { word: 'psychologue', hint: 'écoute' },

    { word: 'enseignant', hint: 'école' },
    { word: 'professeur', hint: 'savoir' },
    { word: 'instituteur', hint: 'primaire' },
    { word: 'formateur', hint: 'apprentissage' },
    { word: 'chercheur', hint: 'science' },

    { word: 'ingénieur', hint: 'technique' },
    { word: 'informaticien', hint: 'code' },
    { word: 'développeur', hint: 'logiciel' },
    { word: 'programmeur', hint: 'algorithme' },
    { word: 'administrateur système', hint: 'serveur' },
    { word: 'technicien', hint: 'maintenance' },

    { word: 'architecte', hint: 'bâtiment' },
    { word: 'urbaniste', hint: 'ville' },
    { word: 'dessinateur', hint: 'plans' },
    { word: 'géomètre', hint: 'terrain' },

    { word: 'ouvrier', hint: 'chantier' },
    { word: 'maçon', hint: 'béton' },
    { word: 'charpentier', hint: 'bois' },
    { word: 'menuisier', hint: 'atelier' },
    { word: 'plombier', hint: 'tuyaux' },
    { word: 'électricien', hint: 'câbles' },
    { word: 'peintre', hint: 'murs' },
    { word: 'carreleur', hint: 'sol' },

    { word: 'agriculteur', hint: 'cultures' },
    { word: 'éleveur', hint: 'bétail' },
    { word: 'maraîcher', hint: 'légumes' },
    { word: 'vigneron', hint: 'vigne' },
    { word: 'pêcheur', hint: 'mer' },
    { word: 'forestier', hint: 'bois' },

    { word: 'cuisinier', hint: 'recettes' },
    { word: 'chef', hint: 'cuisine' },
    { word: 'boulanger', hint: 'pain' },
    { word: 'pâtissier', hint: 'dessert' },
    { word: 'boucher', hint: 'viande' },
    { word: 'poissonnier', hint: 'poisson' },
    { word: 'traiteur', hint: 'événement' },

    { word: 'serveur', hint: 'service' },
    { word: 'barman', hint: 'boissons' },
    { word: 'hôtelier', hint: 'accueil' },
    { word: 'réceptionniste', hint: 'hôtel' },

    { word: 'vendeur', hint: 'commerce' },
    { word: 'caissier', hint: 'encaissement' },
    { word: 'commercial', hint: 'vente' },
    { word: 'responsable magasin', hint: 'gestion' },

    { word: 'comptable', hint: 'chiffres' },
    { word: 'gestionnaire', hint: 'organisation' },
    { word: 'auditeur', hint: 'contrôle' },
    { word: 'analyste', hint: 'données' },
    { word: 'actuaire', hint: 'risque' },

    { word: 'avocat', hint: 'droit' },
    { word: 'notaire', hint: 'actes' },
    { word: 'juriste', hint: 'légal' },
    { word: 'magistrat', hint: 'justice' },

    { word: 'policier', hint: 'sécurité' },
    { word: 'gendarme', hint: 'ordre' },
    { word: 'pompier', hint: 'secours' },
    { word: 'militaire', hint: 'armée' },
    { word: 'douanier', hint: 'frontière' },

    { word: 'journaliste', hint: 'information' },
    { word: 'rédacteur', hint: 'texte' },
    { word: 'photographe', hint: 'image' },
    { word: 'caméraman', hint: 'vidéo' },

    { word: 'designer', hint: 'création' },
    { word: 'graphiste', hint: 'visuel' },
    { word: 'illustrateur', hint: 'dessin' },

    { word: 'acteur', hint: 'cinéma' },
    { word: 'réalisateur', hint: 'film' },
    { word: 'musicien', hint: 'instrument' },
    { word: 'chanteur', hint: 'voix' },

    { word: 'chauffeur', hint: 'conduite' },
    { word: 'conducteur', hint: 'transport' },
    { word: 'livreur', hint: 'colis' },
    { word: 'logisticien', hint: 'flux' },

    { word: 'agent immobilier', hint: 'logement' },
    { word: 'syndic', hint: 'copropriété' },
    { word: 'gardien', hint: 'surveillance' },

    { word: 'assistant', hint: 'aide' },
    { word: 'secrétaire', hint: 'bureau' },
    { word: 'adjoint', hint: 'support' },
    { word: 'coordinateur', hint: 'planning' }
  ],

  sports: [
    { word: 'football', hint: 'ballon' },
    { word: 'basketball', hint: 'panier' },
    { word: 'handball', hint: 'main' },
    { word: 'volleyball', hint: 'filet' },
    { word: 'rugby', hint: 'plaquage' },
    { word: 'futsal', hint: 'salle' },

    { word: 'tennis', hint: 'raquette' },
    { word: 'badminton', hint: 'volant' },
    { word: 'squash', hint: 'mur' },
    { word: 'ping-pong', hint: 'table' },
    { word: 'padel', hint: 'vitre' },

    { word: 'athlétisme', hint: 'piste' },
    { word: 'course', hint: 'endurance' },
    { word: 'sprint', hint: 'vitesse' },
    { word: 'marathon', hint: 'long' },
    { word: 'trail', hint: 'nature' },

    { word: 'natation', hint: 'eau' },
    { word: 'plongeon', hint: 'hauteur' },
    { word: 'water-polo', hint: 'piscine' },
    { word: 'aviron', hint: 'rame' },

    { word: 'cyclisme', hint: 'vélo' },
    { word: 'vtt', hint: 'sentier' },
    { word: 'bmx', hint: 'figures' },
    { word: 'piste', hint: 'anneau' },

    { word: 'gymnastique', hint: 'souplesse' },
    { word: 'acrobatique', hint: 'figure' },
    { word: 'trampoline', hint: 'saut' },

    { word: 'judo', hint: 'kimono' },
    { word: 'karaté', hint: 'katas' },
    { word: 'taekwondo', hint: 'pieds' },
    { word: 'aïkido', hint: 'projection' },
    { word: 'kung-fu', hint: 'art' },
    { word: 'boxe', hint: 'poings' },
    { word: 'kickboxing', hint: 'coups' },
    { word: 'mma', hint: 'combat' },

    { word: 'escrime', hint: 'épée' },
    { word: 'tir à l’arc', hint: 'cible' },

    { word: 'haltérophilie', hint: 'poids' },
    { word: 'powerlifting', hint: 'force' },
    { word: 'crossfit', hint: 'intense' },
    { word: 'musculation', hint: 'charges' },

    { word: 'ski', hint: 'neige' },
    { word: 'ski alpin', hint: 'pente' },
    { word: 'ski de fond', hint: 'glisse' },
    { word: 'snowboard', hint: 'planche' },
    { word: 'biathlon', hint: 'tir' },

    { word: 'patinage', hint: 'glace' },
    { word: 'patinage artistique', hint: 'figures' },
    { word: 'hockey', hint: 'palet' },

    { word: 'équitation', hint: 'cheval' },
    { word: 'dressage', hint: 'précision' },
    { word: 'saut d’obstacles', hint: 'barres' },

    { word: 'golf', hint: 'green' },
    { word: 'mini-golf', hint: 'parcours' },

    { word: 'baseball', hint: 'batte' },
    { word: 'softball', hint: 'lancer' },

    { word: 'cricket', hint: 'wicket' },

    { word: 'surf', hint: 'vagues' },
    { word: 'bodyboard', hint: 'plage' },
    { word: 'windsurf', hint: 'voile' },
    { word: 'kitesurf', hint: 'aile' },

    { word: 'voile', hint: 'bateau' },
    { word: 'canoë', hint: 'rivière' },
    { word: 'kayak', hint: 'pagayeur' },
    { word: 'rafting', hint: 'rapides' },

    { word: 'escalade', hint: 'paroi' },
    { word: 'alpinisme', hint: 'sommet' },
    { word: 'via ferrata', hint: 'câbles' },

    { word: 'skateboard', hint: 'rampe' },
    { word: 'longboard', hint: 'descente' },
    { word: 'roller', hint: 'roues' },
    { word: 'trottinette', hint: 'urbain' }
  ],

  countries: [
    { word: 'France', hint: 'europe' },
    { word: 'Allemagne', hint: 'berlin' },
    { word: 'Italie', hint: 'rome' },
    { word: 'Espagne', hint: 'madrid' },
    { word: 'Portugal', hint: 'lisbonne' },
    { word: 'Belgique', hint: 'bruxelles' },
    { word: 'Pays-Bas', hint: 'amsterdam' },
    { word: 'Luxembourg', hint: 'petit' },
    { word: 'Suisse', hint: 'neutre' },
    { word: 'Autriche', hint: 'vienne' },
    { word: 'Irlande', hint: 'vert' },
    { word: 'Royaume-Uni', hint: 'londres' },
    { word: 'Islande', hint: 'volcan' },
    { word: 'Norvège', hint: 'fjord' },
    { word: 'Suède', hint: 'nordique' },
    { word: 'Finlande', hint: 'forêts' },
    { word: 'Danemark', hint: 'copenhague' },
    { word: 'Pologne', hint: 'varsovie' },
    { word: 'Tchéquie', hint: 'prague' },
    { word: 'Slovaquie', hint: 'bratislava' },
    { word: 'Hongrie', hint: 'budapest' },
    { word: 'Roumanie', hint: 'carpates' },
    { word: 'Bulgarie', hint: 'balkan' },
    { word: 'Grèce', hint: 'athènes' },
    { word: 'Turquie', hint: 'istanbul' },
    { word: 'Ukraine', hint: 'kiev' },
    { word: 'Russie', hint: 'vaste' },

    { word: 'États-Unis', hint: 'fédéral' },
    { word: 'Canada', hint: 'érable' },
    { word: 'Mexique', hint: 'aztèque' },

    { word: 'Brésil', hint: 'amazonie' },
    { word: 'Argentine', hint: 'tango' },
    { word: 'Chili', hint: 'andine' },
    { word: 'Pérou', hint: 'inca' },
    { word: 'Colombie', hint: 'café' },
    { word: 'Venezuela', hint: 'caracas' },
    { word: 'Bolivie', hint: 'altitude' },
    { word: 'Uruguay', hint: 'montevideo' },
    { word: 'Paraguay', hint: 'asunción' },

    { word: 'Maroc', hint: 'atlas' },
    { word: 'Algérie', hint: 'sahara' },
    { word: 'Tunisie', hint: 'méditerranée' },
    { word: 'Égypte', hint: 'nil' },
    { word: 'Libye', hint: 'désert' },
    { word: 'Sénégal', hint: 'dakar' },
    { word: 'Mali', hint: 'sahel' },
    { word: 'Nigéria', hint: 'lagos' },
    { word: 'Ghana', hint: 'or' },
    { word: 'Cameroun', hint: 'équateur' },
    { word: 'Kenya', hint: 'safari' },
    { word: 'Éthiopie', hint: 'hauts-plateaux' },
    { word: 'Afrique du Sud', hint: 'cap' },

    { word: 'Chine', hint: 'population' },
    { word: 'Japon', hint: 'tokyo' },
    { word: 'Corée du Sud', hint: 'séoul' },
    { word: 'Corée du Nord', hint: 'fermée' },
    { word: 'Inde', hint: 'continent' },
    { word: 'Pakistan', hint: 'lahore' },
    { word: 'Bangladesh', hint: 'delta' },
    { word: 'Sri Lanka', hint: 'île' },
    { word: 'Népal', hint: 'himalaya' },
    { word: 'Thaïlande', hint: 'bangkok' },
    { word: 'Vietnam', hint: 'mékong' },
    { word: 'Cambodge', hint: 'angkor' },
    { word: 'Indonésie', hint: 'archipel' },
    { word: 'Philippines', hint: 'manille' },
    { word: 'Malaisie', hint: 'kuala' },

    { word: 'Arabie saoudite', hint: 'désert' },
    { word: 'Israël', hint: 'jerusalem' },
    { word: 'Jordanie', hint: 'pétra' },
    { word: 'Liban', hint: 'béryte' },
    { word: 'Iran', hint: 'perse' },
    { word: 'Irak', hint: 'mésopotamie' },

    { word: 'Australie', hint: 'océanie' },
    { word: 'Nouvelle-Zélande', hint: 'kiwi' },
    { word: 'Papouasie-Nouvelle-Guinée', hint: 'forêts' }
  ],

  celebrities: [
    { word: 'Brad Pitt', hint: 'acteur' },
    { word: 'Leonardo DiCaprio', hint: 'cinéma' },
    { word: 'Johnny Depp', hint: 'pirate' },
    { word: 'Tom Cruise', hint: 'cascade' },
    { word: 'Will Smith', hint: 'hollywood' },
    { word: 'Denzel Washington', hint: 'drame' },
    { word: 'Morgan Freeman', hint: 'narrateur' },
    { word: 'Robert De Niro', hint: 'mafia' },
    { word: 'Al Pacino', hint: 'parrain' },
    { word: 'Keanu Reeves', hint: 'action' },

    { word: 'Scarlett Johansson', hint: 'actrice' },
    { word: 'Natalie Portman', hint: 'oscar' },
    { word: 'Emma Watson', hint: 'sorcière' },
    { word: 'Jennifer Lawrence', hint: 'hunger' },
    { word: 'Margot Robbie', hint: 'barbie' },
    { word: 'Angelina Jolie', hint: 'humanitaire' },
    { word: 'Meryl Streep', hint: 'légende' },

    { word: 'Steven Spielberg', hint: 'réalisateur' },
    { word: 'Christopher Nolan', hint: 'temps' },
    { word: 'Quentin Tarantino', hint: 'dialogues' },
    { word: 'James Cameron', hint: 'avatar' },

    { word: 'Michael Jackson', hint: 'pop' },
    { word: 'Elvis Presley', hint: 'rock' },
    { word: 'Madonna', hint: 'icône' },
    { word: 'Prince', hint: 'génie' },
    { word: 'David Bowie', hint: 'caméléon' },
    { word: 'Elton John', hint: 'piano' },

    { word: 'Beyoncé', hint: 'queen' },
    { word: 'Rihanna', hint: 'barbade' },
    { word: 'Taylor Swift', hint: 'albums' },
    { word: 'Adele', hint: 'voix' },
    { word: 'Lady Gaga', hint: 'excentrique' },
    { word: 'Shakira', hint: 'danse' },
    { word: 'Drake', hint: 'rap' },
    { word: 'Eminem', hint: 'lyrique' },
    { word: 'Kanye West', hint: 'controverse' },
    { word: 'Jay-Z', hint: 'business' },

    { word: 'Cristiano Ronaldo', hint: 'football' },
    { word: 'Lionel Messi', hint: 'argentin' },
    { word: 'Neymar', hint: 'brésil' },
    { word: 'Kylian Mbappé', hint: 'vitesse' },
    { word: 'Zinedine Zidane', hint: 'élégance' },
    { word: 'LeBron James', hint: 'basket' },
    { word: 'Michael Jordan', hint: 'légende' },
    { word: 'Serena Williams', hint: 'tennis' },
    { word: 'Roger Federer', hint: 'classe' },
    { word: 'Usain Bolt', hint: 'sprint' },

    { word: 'Elon Musk', hint: 'technologie' },
    { word: 'Steve Jobs', hint: 'apple' },
    { word: 'Bill Gates', hint: 'microsoft' },
    { word: 'Mark Zuckerberg', hint: 'facebook' },
    { word: 'Jeff Bezos', hint: 'amazon' },

    { word: 'Barack Obama', hint: 'président' },
    { word: 'Nelson Mandela', hint: 'paix' },
    { word: 'Winston Churchill', hint: 'histoire' },
    { word: 'Emmanuel Macron', hint: 'france' },
  ],

  brands: [
    { word: 'Nike', hint: 'sport' },
    { word: 'Adidas', hint: 'football' },
    { word: 'Puma', hint: 'performance' },
    { word: 'Reebok', hint: 'fitness' },
    { word: 'Under Armour', hint: 'athlète' },
    { word: 'New Balance', hint: 'confort' },
    { word: 'Vans', hint: 'skate' },
    { word: 'Converse', hint: 'basket' },
    { word: 'Jordan', hint: 'basketball' },
    { word: 'Asics', hint: 'course' },

    { word: 'Apple', hint: 'technologie' },
    { word: 'Samsung', hint: 'smartphones' },
    { word: 'Google', hint: 'internet' },
    { word: 'Microsoft', hint: 'software' },
    { word: 'Sony', hint: 'playstation' },
    { word: 'LG', hint: 'électroménager' },
    { word: 'Huawei', hint: 'smartphones' },
    { word: 'Dell', hint: 'ordinateurs' },

    { word: 'Coca-Cola', hint: 'boisson' },
    { word: 'Pepsi', hint: 'cola' },
    { word: 'Red Bull', hint: 'énergie' },
    { word: 'Fanta', hint: 'fruité' },
    { word: 'Sprite', hint: 'citron' },
    { word: 'Nestlé', hint: 'alimentaire' },

    { word: 'McDonald\'s', hint: 'fast food' },
    { word: 'Burger King', hint: 'hamburger' },
    { word: 'KFC', hint: 'poulet' },
    { word: 'Subway', hint: 'sandwich' },
    { word: 'Domino\'s', hint: 'pizza' },
    { word: 'Pizza Hut', hint: 'pizzas' },

    { word: 'Amazon', hint: 'e-commerce' },
    { word: 'eBay', hint: 'enchères' },
    { word: 'Alibaba', hint: 'commerce en ligne' },
    { word: 'Walmart', hint: 'magasin' },
    { word: 'Target', hint: 'supermarché' },

    { word: 'Louis Vuitton', hint: 'luxe' },
    { word: 'Gucci', hint: 'mode' },
    { word: 'Chanel', hint: 'haute couture' },
    { word: 'Rolex', hint: 'montre' },
    { word: 'Hermès', hint: 'sac' },

    { word: 'Tesla', hint: 'électrique' },
    { word: 'BMW', hint: 'voiture' },
    { word: 'Mercedes-Benz', hint: 'luxe' },
    { word: 'Audi', hint: 'confort' },
    { word: 'Ford', hint: 'américaine' },

    { word: 'Nike', hint: 'athlétisme' },
    { word: 'Patagonia', hint: 'écologique' },
    { word: 'The North Face', hint: 'outdoor' },
    { word: 'Columbia', hint: 'montagne' },

    { word: 'L’Oréal', hint: 'beauté' },
    { word: 'Chanel', hint: 'parfum' },
    { word: 'Dior', hint: 'maquillage' },
    { word: 'Maybelline', hint: 'cosmétique' },
    { word: 'Estée Lauder', hint: 'soin' },

    { word: 'Spotify', hint: 'musique' },
    { word: 'Apple Music', hint: 'streaming' },
    { word: 'YouTube', hint: 'vidéo' },
    { word: 'Netflix', hint: 'streaming' },
    { word: 'Disney+', hint: 'films' },
  ]
};

function getRandomWord(categories = ['animals', 'food', 'objects', 'countries', 'jobs', 'sports', 'celebrities', 'brands']) {
  const allWords = [];
  
  categories.forEach(category => {
    if (wordCategories[category]) {
      wordCategories[category].forEach(item => {
        allWords.push({ ...item, category });
      });
    }
  });
  
  if (allWords.length === 0) {
    return { word: 'pomme', hint: 'fruit', category: 'food' };
  }
  
  return allWords[Math.floor(Math.random() * allWords.length)];
}

export default function WordSelectionPage({ players = [], currentUser, onConfirm, lobbyId, database, imposterId }) {
  const [triangles, setTriangles] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [generatedWord, setGeneratedWord] = useState('');
  const [hint, setHint] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Check if current user is the imposter
  const isImposter = currentUser && imposterId && currentUser.firebaseId === imposterId;

  // Generate animated triangles
  useEffect(() => {
    const generateTriangles = () => {
      const newTriangles = [];
      for (let i = 0; i < 8; i++) {
        newTriangles.push({
          id: i,
          left: Math.random() * 100,
          size: Math.random() * 30 + 20,
          duration: Math.random() * 8 + 12,
          delay: i * 2.5 - 20,
          opacity: Math.random() * 0.25
        });
      }
      setTriangles(newTriangles);
    };
    generateTriangles();

    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
  }, []);

  // Generate and sync word with Firebase
  useEffect(() => {
    if (!database || !lobbyId) return;

    const { ref, onValue, set } = database;
    const wordRef = ref(database.db, `lobbies/${lobbyId}/currentWord`);

    const unsubscribe = onValue(wordRef, async (snapshot) => {
      const wordData = snapshot.val();
      
      if (wordData && wordData.word) {
        setGeneratedWord(wordData.word);
        setHint(wordData.hint || '');
        setCategory(wordData.category || '');
        setLoading(false);
      } else {
        // Generate word logic - you'll add your word data back here
        const randomWord = {
          word: 'pomme',
          hint: 'fruit',
          category: 'food'
        };
        
        await set(wordRef, {
          word: randomWord.word,
          hint: randomWord.hint,
          category: randomWord.category,
          generatedAt: Date.now()
        });
        
        setGeneratedWord(randomWord.word);
        setHint(randomWord.hint);
        setCategory(randomWord.category);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [database, lobbyId]);

  const handleConfirm = () => {
    if (!selectedPlayer) {
      alert('Please select a player!');
      return;
    }
    
    if (onConfirm) {
      onConfirm({ 
        selectedPlayer, 
        word: generatedWord,
        hint: hint,
        category: category
      });
    }
  };

  console.log('Is Imposter:', isImposter, 'Current User:', currentUser?.firebaseId, 'Imposter ID:', imposterId);

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          overflow-x: hidden !important;
          width: 100% !important;
        }
        @keyframes float-down {
          0% {
            transform: translateY(-100px) rotate(0deg);
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
          }
        }
      `}</style>
      
      <div style={{ minHeight: '100vh', width: '100vw', background: 'linear-gradient(to bottom, #a8a8a8ff, #686868ff)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', margin: 0, boxSizing: 'border-box', position: 'fixed', top: 0, left: 0, overflow: 'auto' }}>
        
        {/* Animated Triangles Background */}
        {triangles.map(triangle => (
          <div
            key={triangle.id}
            style={{
              position: 'absolute',
              left: `${triangle.left}%`,
              top: '-100px',
              width: 0,
              height: 0,
              borderLeft: `${triangle.size}px solid transparent`,
              borderRight: `${triangle.size}px solid transparent`,
              borderBottom: `${triangle.size * 1.732}px solid rgba(153, 255, 153, ${triangle.opacity})`,
              animation: `float-down ${triangle.duration}s linear ${triangle.delay}s infinite`,
              pointerEvents: 'none'
            }}
          />
        ))}
        
        <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', position: 'relative', zIndex: 10, marginTop: '2rem' }}>
        
          {/* Generated Word with Hint */}
          <div style={{
            width: '100%',
            padding: '2rem',
            backgroundColor: '#b3b3b3ff',
            border: '4px solid #6f6f6fff',
            textAlign: 'center',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#6f6f6fff',
            minHeight: '100px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            {loading ? 'Generating word...' : (
              <>
                {isImposter ? (
                  <>
                    <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>🕵️ Tu es l'imposteur!</div>
                    <div style={{ fontSize: '1rem' }}>Indice: {hint}</div>
                  </>
                ) : (
                  <>
                    <div>{generatedWord}</div>
                    <div style={{ fontSize: '1rem', opacity: 0.7 }}>Indice: {hint}</div>
                  </>
                )}
              </>
            )}
          </div>

          {/* Players List */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {players.map(player => {
              const isCurrentUser = currentUser && player.id === currentUser.firebaseId;
              const isSelected = selectedPlayer && selectedPlayer.id === player.id;
              
              return (
                <div 
                  key={player.id} 
                  onClick={() => setSelectedPlayer(player)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    backgroundColor: isSelected ? 'rgba(150, 50, 94, 0.2)' : 'transparent',
                    borderRadius: '8px',
                    border: `2px solid ${isSelected ? '#6f6f6fff' : 'transparent'}`
                  }}
                >
                  {/* Player Photo */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: `4px solid ${isCurrentUser ? '#74a887ff' : '#6f6f6fff'}`,
                    backgroundColor: '#b3b3b3ff',
                    flexShrink: 0
                  }}>
                    <img 
                      src={player.photo} 
                      alt={player.username}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>

                  {/* Player Username */}
                  <div style={{
                    flex: 1,
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#b3b3b3ff',
                    border: `4px solid ${isCurrentUser ? '#74a887ff' : '#6f6f6fff'}`,
                    textAlign: 'center',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: isCurrentUser ? '#74a887ff' : '#6f6f6fff'
                  }}>
                    {player.username}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Confirm Button */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '-5px' }}>
            <button
              onClick={handleConfirm}
              style={{
                padding: '1rem 5rem',
                backgroundColor: '#b3b3b3ff',
                border: '4px solid #6f6f6fff',
                borderRadius: '9999px',
                fontWeight: 'bold',
                fontSize: '1.25rem',
                color: '#6f6f6fff',
                cursor: 'pointer',
                minWidth: '250px'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#c9c9c9ff'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#b3b3b3ff'}
            >
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </>
  );
}