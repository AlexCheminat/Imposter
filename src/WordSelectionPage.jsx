import { useState, useEffect } from 'react';

// Word categories directly in the file
const wordCategories = {
  animals: [
    { word: 'Chat', hint: 'Domestique' },
    { word: 'Chien', hint: 'Fidèle' },
    { word: 'Lion', hint: 'Roi' },
    { word: 'Tigre', hint: 'Rayures' },
    { word: 'Éléphant', hint: 'Trompe' },
    { word: 'Girafe', hint: 'Cou' },
    { word: 'Zèbre', hint: 'Rayures' },
    { word: 'Cheval', hint: 'Galop' },
    { word: 'Vache', hint: 'Lait' },
    { word: 'Mouton', hint: 'Laine' },
    { word: 'Chèvre', hint: 'Cornes' },
    { word: 'Cochon', hint: 'Ferme' },
    { word: 'Lapin', hint: 'Oreilles' },
    { word: 'Hamster', hint: 'Roue' },
    { word: 'Souris', hint: 'Fromage' },
    { word: 'Rat', hint: 'Égout' },
    { word: 'Écureuil', hint: 'Gland' },
    { word: 'Ours', hint: 'Miel' },
    { word: 'Loup', hint: 'Meute' },
    { word: 'Renard', hint: 'Rusé' },
    { word: 'Cerf', hint: 'Bois' },
    { word: 'Biche', hint: 'Forêt' },
    { word: 'Sanglier', hint: 'Défense' },
    { word: 'Blaireau', hint: 'Terrier' },
    { word: 'Hérisson', hint: 'Piquant' },
    { word: 'Chauve-souris', hint: 'Nuit' },
    { word: 'Dauphin', hint: 'Intelligent' },
    { word: 'Baleine', hint: 'Géant' },
    { word: 'Requin', hint: 'Aileron' },
    { word: 'Poisson', hint: 'Eau' },
    { word: 'Anguille', hint: 'Glissant' },
    { word: 'Méduse', hint: 'Urticant' },
    { word: 'Crabe', hint: 'Pinces' },
    { word: 'Homard', hint: 'Carapace' },
    { word: 'Crevette', hint: 'Rose' },
    { word: 'Pieuvre', hint: 'Tentacules' },
    { word: 'Calmar', hint: 'Encre' },
    { word: 'Tortue', hint: 'Lenteur' },
    { word: 'Serpent', hint: 'Venin' },
    { word: 'Lézard', hint: 'Écaille' },
    { word: 'Iguane', hint: 'Tropical' },
    { word: 'Crocodile', hint: 'Mâchoire' },
    { word: 'Alligator', hint: 'Marais' },
    { word: 'Grenouille', hint: 'Saut' },
    { word: 'Crapaud', hint: 'Verrue' },
    { word: 'Salamandre', hint: 'Humide' },
    { word: 'Papillon', hint: 'Ailes' },
    { word: 'Abeille', hint: 'Miel' },
    { word: 'Guêpe', hint: 'Piqûre' },
    { word: 'Fourmi', hint: 'Travail' },
    { word: 'Coccinelle', hint: 'Points' },
    { word: 'Scarabée', hint: 'Carapace' },
    { word: 'Moustique', hint: 'Piqûre' },
    { word: 'Araignée', hint: 'Toile' },
    { word: 'Scorpion', hint: 'Dard' },
    { word: 'Pigeon', hint: 'Ville' },
    { word: 'Moineau', hint: 'Chant' },
    { word: 'Aigle', hint: 'Royal' },
    { word: 'Faucon', hint: 'Vitesse' },
    { word: 'Hibou', hint: 'Sage' },
    { word: 'Chouette', hint: 'Nuit' },
    { word: 'Corbeau', hint: 'Noir' },
    { word: 'Perroquet', hint: 'Parle' },
    { word: 'Pingouin', hint: 'Glace' },
    { word: 'Manchot', hint: 'Antarctique' },
    { word: 'Autruche', hint: 'Rapide' },
    { word: 'Paon', hint: 'Plumes' },
    { word: 'Cygne', hint: 'Élégant' },
    { word: 'Canard', hint: 'Étang' },
    { word: 'Oie', hint: 'Bruyante' }
  ],
  
  food: [
    { word: 'Pomme', hint: 'Fruit' },
    { word: 'Poire', hint: 'Juteux' },
    { word: 'Banane', hint: 'Jaune' },
    { word: 'Orange', hint: 'Agrume' },
    { word: 'Citron', hint: 'Acide' },
    { word: 'Mandarine', hint: 'Sucré' },
    { word: 'Clémentine', hint: 'Hiver' },
    { word: 'Fraise', hint: 'Rouge' },
    { word: 'Framboise', hint: 'Baie' },
    { word: 'Myrtille', hint: 'Bleu' },
    { word: 'Mûre', hint: 'Sauvage' },
    { word: 'Cerise', hint: 'Noyau' },
    { word: 'Abricot', hint: 'Été' },
    { word: 'Pêche', hint: 'Duvet' },
    { word: 'Nectarine', hint: 'Lisse' },
    { word: 'Prune', hint: 'Violet' },
    { word: 'Raisin', hint: 'Grappe' },
    { word: 'Melon', hint: 'Frais' },
    { word: 'Pastèque', hint: 'Eau' },
    { word: 'Ananas', hint: 'Tropical' },
    { word: 'Mangue', hint: 'Exotique' },
    { word: 'Kiwi', hint: 'Vert' },
    { word: 'Figue', hint: 'Méditerranée' },
    { word: 'Datte', hint: 'Sèche' },
    { word: 'Olive', hint: 'Huile' },

    { word: 'Pain', hint: 'Boulangerie' },
    { word: 'Baguette', hint: 'Français' },
    { word: 'Croissant', hint: 'Beurre' },
    { word: 'Brioche', hint: 'Moelleux' },
    { word: 'Focaccia', hint: 'Italien' },
    { word: 'Pita', hint: 'Plat' },
    { word: 'Tortilla', hint: 'Maïs' },

    { word: 'Fromage', hint: 'Laitier' },
    { word: 'Camembert', hint: 'Normand' },
    { word: 'Brie', hint: 'Doux' },
    { word: 'Roquefort', hint: 'Bleu' },
    { word: 'Comté', hint: 'Montagne' },
    { word: 'Emmental', hint: 'Trous' },
    { word: 'Gruyère', hint: 'Fondant' },
    { word: 'Parmesan', hint: 'Italien' },
    { word: 'Chèvre', hint: 'Frais' },
    { word: 'Mozzarella', hint: 'Blanc' },

    { word: 'Lait', hint: 'Boisson' },
    { word: 'Beurre', hint: 'Gras' },
    { word: 'Crème', hint: 'Épais' },
    { word: 'Yaourt', hint: 'Fermenté' },
    { word: 'œuf', hint: 'Coquille' },

    { word: 'Riz', hint: 'Céréale' },
    { word: 'Pâtes', hint: 'Blé' },
    { word: 'Quinoa', hint: 'Graine' },
    { word: 'Semoule', hint: 'Fine' },
    { word: 'Couscous', hint: 'Maghreb' },
    { word: 'Lentilles', hint: 'Protéines' },
    { word: 'Pois', hint: 'Vert' },
    { word: 'Haricots', hint: 'Secs' },
    { word: 'Pois chiches', hint: 'Houmous' },

    { word: 'Poulet', hint: 'Volaille' },
    { word: 'Bœuf', hint: 'Rouge' },
    { word: 'Porc', hint: 'Charcuterie' },
    { word: 'Agneau', hint: 'Tendre' },
    { word: 'Dinde', hint: 'Fête' },
    { word: 'Jambon', hint: 'Salé' },
    { word: 'Saucisse', hint: 'Grillade' },
    { word: 'Steak', hint: 'Grill' },

    { word: 'Saumon', hint: 'Rose' },
    { word: 'Thon', hint: 'Conserve' },
    { word: 'Cabillaud', hint: 'Blanc' },
    { word: 'Sardine', hint: 'Huile' },
    { word: 'Maquereau', hint: 'Fumé' },

    { word: 'Carotte', hint: 'Orange' },
    { word: 'Pomme de terre', hint: 'Fécule' },
    { word: 'Tomate', hint: 'Rouge' },
    { word: 'Concombre', hint: 'Frais' },
    { word: 'Courgette', hint: 'Verte' },
    { word: 'Aubergine', hint: 'Violette' },
    { word: 'Poivron', hint: 'Croquant' },
    { word: 'Oignon', hint: 'Piquant' },
    { word: 'Ail', hint: 'Arôme' },
    { word: 'Échalote', hint: 'Subtil' },
    { word: 'Salade', hint: 'Feuille' },
    { word: 'Épinard', hint: 'Vert' },

    { word: 'Sucre', hint: 'Doux' },
    { word: 'Sel', hint: 'Salé' },
    { word: 'Poivre', hint: 'Épice' },
    { word: 'Miel', hint: 'Naturel' },
    { word: 'Huile', hint: 'Cuisson' },
    { word: 'Vinaigre', hint: 'Acide' },

    { word: 'Chocolat', hint: 'Cacao' },
    { word: 'Biscuit', hint: 'Sec' },
    { word: 'Gâteau', hint: 'Dessert' },
    { word: 'Tarte', hint: 'Four' },
    { word: 'Crêpe', hint: 'Fine' },
    { word: 'Glace', hint: 'Froid' }
  ],
  
  objects: [
    { word: 'Table', hint: 'Meuble' },
    { word: 'Chaise', hint: 'Assis' },
    { word: 'Canapé', hint: 'Salon' },
    { word: 'Fauteuil', hint: 'Confort' },
    { word: 'Lit', hint: 'Sommeil' },
    { word: 'Matelas', hint: 'Mousse' },
    { word: 'Oreiller', hint: 'Tête' },
    { word: 'Couverture', hint: 'Chaud' },
    { word: 'Armoire', hint: 'Rangement' },
    { word: 'Commode', hint: 'Tiroirs' },
    { word: 'Étagère', hint: 'Livres' },
    { word: 'Bureau', hint: 'Travail' },
    { word: 'Lampe', hint: 'Lumière' },
    { word: 'Ampoule', hint: 'Éclairage' },
    { word: 'Interrupteur', hint: 'Mur' },
    { word: 'Prise', hint: 'Courant' },
    { word: 'Câble', hint: 'Fil' },
    { word: 'Multiprise', hint: 'Prises' },

    { word: 'Télévision', hint: 'Écran' },
    { word: 'Télécommande', hint: 'Boutons' },
    { word: 'Radio', hint: 'Son' },
    { word: 'Enceinte', hint: 'Audio' },
    { word: 'Casque', hint: 'Écoute' },
    { word: 'Écouteurs', hint: 'Oreille' },

    { word: 'Ordinateur', hint: 'Calcul' },
    { word: 'Clavier', hint: 'Touches' },
    { word: 'Souris', hint: 'Clic' },
    { word: 'Écran', hint: 'Affichage' },
    { word: 'Imprimante', hint: 'Papier' },
    { word: 'Scanner', hint: 'Numériser' },

    { word: 'Téléphone', hint: 'Appel' },
    { word: 'Smartphone', hint: 'Mobile' },
    { word: 'Chargeur', hint: 'Batterie' },
    { word: 'Batterie', hint: 'Énergie' },
    { word: 'Câble usb', hint: 'Connexion' },

    { word: 'Stylo', hint: 'Encre' },
    { word: 'Crayon', hint: 'Mine' },
    { word: 'Gomme', hint: 'Effacer' },
    { word: 'Feutre', hint: 'Couleur' },
    { word: 'Cahier', hint: 'Pages' },
    { word: 'Livre', hint: 'Lecture' },
    { word: 'Agenda', hint: 'Dates' },

    { word: 'Sac', hint: 'Transport' },
    { word: 'Sac à dos', hint: 'École' },
    { word: 'Valise', hint: 'Voyage' },
    { word: 'Portefeuille', hint: 'Argent' },
    { word: 'Clé', hint: 'Serrure' },
    { word: 'Trousseau', hint: 'Clés' },

    { word: 'Montre', hint: 'Temps' },
    { word: 'Réveil', hint: 'Matin' },
    { word: 'Horloge', hint: 'Mur' },

    { word: 'Miroir', hint: 'Reflet' },
    { word: 'Brosse', hint: 'Cheveux' },
    { word: 'Peigne', hint: 'Dents' },
    { word: 'Rasoir', hint: 'Lame' },
    { word: 'Serviette', hint: 'Séchage' },

    { word: 'Assiette', hint: 'Repas' },
    { word: 'Bol', hint: 'Soupe' },
    { word: 'Verre', hint: 'Boisson' },
    { word: 'Tasse', hint: 'Chaud' },
    { word: 'Fourchette', hint: 'Piques' },
    { word: 'Couteau', hint: 'Lame' },
    { word: 'Cuillère', hint: 'Creux' },
    { word: 'Poêle', hint: 'Cuisson' },
    { word: 'Casserole', hint: 'Feu' },
    { word: 'Four', hint: 'Chaleur' },
    { word: 'Micro-ondes', hint: 'Rapide' },
    { word: 'Réfrigérateur', hint: 'Froid' },

    { word: 'Balai', hint: 'Nettoyage' },
    { word: 'Serpillière', hint: 'Sol' },
    { word: 'Aspirateur', hint: 'Poussière' },
    { word: 'Poubelle', hint: 'Déchets' }
  ],

  places: [
    { word: 'Maison', hint: 'Habitat' },
    { word: 'Appartement', hint: 'Immeuble' },
    { word: 'Studio', hint: 'Petit' },
    { word: 'Villa', hint: 'Luxueux' },
    { word: 'Immeuble', hint: 'Étages' },
    { word: 'Résidence', hint: 'Logement' },

    { word: 'Salon', hint: 'Canapé' },
    { word: 'Cuisine', hint: 'Repas' },
    { word: 'Chambre', hint: 'Sommeil' },
    { word: 'Salle de bain', hint: 'Douche' },
    { word: 'Toilettes', hint: 'Sanitaire' },
    { word: 'Garage', hint: 'Voiture' },
    { word: 'Cave', hint: 'Stockage' },
    { word: 'Grenier', hint: 'Combles' },
    { word: 'Balcon', hint: 'Extérieur' },
    { word: 'Terrasse', hint: 'Soleil' },
    { word: 'Jardin', hint: 'Plantes' },
    { word: 'Cour', hint: 'Intérieure' },

    { word: 'Rue', hint: 'Passage' },
    { word: 'Avenue', hint: 'Large' },
    { word: 'Boulevard', hint: 'Urbain' },
    { word: 'Impasse', hint: 'Fermée' },
    { word: 'Carrefour', hint: 'Croisement' },
    { word: 'Trottoir', hint: 'Piéton' },
    { word: 'Place', hint: 'Publique' },
    { word: 'Quartier', hint: 'Zone' },

    { word: 'Ville', hint: 'Urbaine' },
    { word: 'Village', hint: 'Rural' },
    { word: 'Banlieue', hint: 'Périphérie' },
    { word: 'Centre-ville', hint: 'Commerce' },
    { word: 'Zone industrielle', hint: 'Usines' },
    { word: 'Zone commerciale', hint: 'Magasins' },

    { word: 'École', hint: 'Élèves' },
    { word: 'Collège', hint: 'Ados' },
    { word: 'Lycée', hint: 'Études' },
    { word: 'Université', hint: 'Campus' },
    { word: 'Bibliothèque', hint: 'Livres' },
    { word: 'Crèche', hint: 'Enfants' },

    { word: 'Bureau', hint: 'Travail' },
    { word: 'Entreprise', hint: 'Emploi' },
    { word: 'Usine', hint: 'Production' },
    { word: 'Chantier', hint: 'Construction' },
    { word: 'Entrepôt', hint: 'Stock' },

    { word: 'Magasin', hint: 'Achat' },
    { word: 'Supermarché', hint: 'Courses' },
    { word: 'Boutique', hint: 'Vente' },
    { word: 'Centre commercial', hint: 'Galeries' },
    { word: 'Marché', hint: 'Étals' },
    { word: 'Boulangerie', hint: 'Pain' },
    { word: 'Pharmacie', hint: 'Médicaments' },
    { word: 'Librairie', hint: 'Lecture' },

    { word: 'Restaurant', hint: 'Repas' },
    { word: 'Café', hint: 'Boisson' },
    { word: 'Bar', hint: 'Soirée' },
    { word: 'Cantine', hint: 'Collectif' },
    { word: 'Fast-food', hint: 'Rapide' },

    { word: 'Hôpital', hint: 'Soins' },
    { word: 'Clinique', hint: 'Médical' },
    { word: 'Cabinet', hint: 'Consultation' },
    { word: 'Pharmacie', hint: 'Ordonnance' },

    { word: 'Gare', hint: 'Train' },
    { word: 'Station', hint: 'Transport' },
    { word: 'Aéroport', hint: 'Avion' },
    { word: 'Port', hint: 'Bateaux' },
    { word: 'Parking', hint: 'Stationnement' },

    { word: 'Parc', hint: 'Verdure' },
    { word: 'Square', hint: 'Bancs' },
    { word: 'Forêt', hint: 'Arbres' },
    { word: 'Bois', hint: 'Nature' },
    { word: 'Plage', hint: 'Sable' },
    { word: 'Montagne', hint: 'Altitude' },
    { word: 'Colline', hint: 'Pente' },
    { word: 'Vallée', hint: 'Creux' },
    { word: 'Rivière', hint: 'Eau' },
    { word: 'Lac', hint: 'Calme' },
    { word: 'Fleuve', hint: 'Courant' },

    { word: 'Stade', hint: 'Sport' },
    { word: 'Gymnase', hint: 'Activité' },
    { word: 'Piscine', hint: 'Nage' },
    { word: 'Salle de sport', hint: 'Entraînement' },
    { word: 'Cinéma', hint: 'Film' },
    { word: 'Théâtre', hint: 'Scène' },
    { word: 'Musée', hint: 'Exposition' }
  ],

  jobs: [
    { word: 'Médecin', hint: 'Soins' },
    { word: 'Infirmier', hint: 'Hôpital' },
    { word: 'Chirurgien', hint: 'Opération' },
    { word: 'Dentiste', hint: 'Dents' },
    { word: 'Pharmacien', hint: 'Médicaments' },
    { word: 'Sage-femme', hint: 'Naissance' },
    { word: 'Kinésithérapeute', hint: 'Rééducation' },
    { word: 'Psychologue', hint: 'Écoute' },

    { word: 'Enseignant', hint: 'École' },
    { word: 'Professeur', hint: 'Savoir' },
    { word: 'Instituteur', hint: 'Primaire' },
    { word: 'Formateur', hint: 'Apprentissage' },
    { word: 'Chercheur', hint: 'Science' },

    { word: 'Ingénieur', hint: 'Technique' },
    { word: 'Informaticien', hint: 'Code' },
    { word: 'Développeur', hint: 'Logiciel' },
    { word: 'Programmeur', hint: 'Algorithme' },
    { word: 'Administrateur système', hint: 'Serveur' },
    { word: 'Technicien', hint: 'Maintenance' },

    { word: 'Architecte', hint: 'Bâtiment' },
    { word: 'Urbaniste', hint: 'Ville' },
    { word: 'Dessinateur', hint: 'Plans' },
    { word: 'Géomètre', hint: 'Terrain' },

    { word: 'Ouvrier', hint: 'Chantier' },
    { word: 'Maçon', hint: 'Béton' },
    { word: 'Charpentier', hint: 'Bois' },
    { word: 'Menuisier', hint: 'Atelier' },
    { word: 'Plombier', hint: 'Tuyaux' },
    { word: 'Électricien', hint: 'Câbles' },
    { word: 'Peintre', hint: 'Murs' },
    { word: 'Carreleur', hint: 'Sol' },

    { word: 'Agriculteur', hint: 'Cultures' },
    { word: 'Éleveur', hint: 'Bétail' },
    { word: 'Maraîcher', hint: 'Légumes' },
    { word: 'Vigneron', hint: 'Vigne' },
    { word: 'Pêcheur', hint: 'Mer' },
    { word: 'Forestier', hint: 'Bois' },

    { word: 'Cuisinier', hint: 'Recettes' },
    { word: 'Chef', hint: 'Cuisine' },
    { word: 'Boulanger', hint: 'Pain' },
    { word: 'Pâtissier', hint: 'Dessert' },
    { word: 'Boucher', hint: 'Viande' },
    { word: 'Poissonnier', hint: 'Poisson' },
    { word: 'Traiteur', hint: 'Événement' },

    { word: 'Serveur', hint: 'Service' },
    { word: 'Barman', hint: 'Boissons' },
    { word: 'Hôtelier', hint: 'Accueil' },
    { word: 'Réceptionniste', hint: 'Hôtel' },

    { word: 'Vendeur', hint: 'Commerce' },
    { word: 'Caissier', hint: 'Encaissement' },
    { word: 'Commercial', hint: 'Vente' },
    { word: 'Responsable magasin', hint: 'Gestion' },

    { word: 'Comptable', hint: 'Chiffres' },
    { word: 'Gestionnaire', hint: 'Organisation' },
    { word: 'Auditeur', hint: 'Contrôle' },
    { word: 'Analyste', hint: 'Données' },
    { word: 'Actuaire', hint: 'Risque' },

    { word: 'Avocat', hint: 'Droit' },
    { word: 'Notaire', hint: 'Actes' },
    { word: 'Juriste', hint: 'Légal' },
    { word: 'Magistrat', hint: 'Justice' },

    { word: 'Policier', hint: 'Sécurité' },
    { word: 'Gendarme', hint: 'Ordre' },
    { word: 'Pompier', hint: 'Secours' },
    { word: 'Militaire', hint: 'Armée' },
    { word: 'Douanier', hint: 'Frontière' },

    { word: 'Journaliste', hint: 'Information' },
    { word: 'Rédacteur', hint: 'Texte' },
    { word: 'Photographe', hint: 'Image' },
    { word: 'Caméraman', hint: 'Vidéo' },

    { word: 'Designer', hint: 'Création' },
    { word: 'Graphiste', hint: 'Visuel' },
    { word: 'Illustrateur', hint: 'Dessin' },

    { word: 'Acteur', hint: 'Cinéma' },
    { word: 'Réalisateur', hint: 'Film' },
    { word: 'Musicien', hint: 'Instrument' },
    { word: 'Chanteur', hint: 'Voix' },

    { word: 'Chauffeur', hint: 'Conduite' },
    { word: 'Conducteur', hint: 'Transport' },
    { word: 'Livreur', hint: 'Colis' },
    { word: 'Logisticien', hint: 'Flux' },

    { word: 'Agent immobilier', hint: 'Logement' },
    { word: 'Syndic', hint: 'Copropriété' },
    { word: 'Gardien', hint: 'Surveillance' },

    { word: 'Assistant', hint: 'Aide' },
    { word: 'Secrétaire', hint: 'Bureau' },
    { word: 'Adjoint', hint: 'Support' },
    { word: 'Coordinateur', hint: 'Planning' }
  ],

  sports: [
    { word: 'Football', hint: 'Ballon' },
    { word: 'Basketball', hint: 'Panier' },
    { word: 'Handball', hint: 'Main' },
    { word: 'Volleyball', hint: 'Filet' },
    { word: 'Rugby', hint: 'Plaquage' },
    { word: 'Futsal', hint: 'Salle' },

    { word: 'Tennis', hint: 'Raquette' },
    { word: 'Badminton', hint: 'Volant' },
    { word: 'Squash', hint: 'Mur' },
    { word: 'Ping-pong', hint: 'Table' },
    { word: 'Padel', hint: 'Vitre' },

    { word: 'Athlétisme', hint: 'Piste' },
    { word: 'Course', hint: 'Endurance' },
    { word: 'Sprint', hint: 'Vitesse' },
    { word: 'Marathon', hint: 'Long' },
    { word: 'Trail', hint: 'Nature' },

    { word: 'Natation', hint: 'Eau' },
    { word: 'Plongeon', hint: 'Hauteur' },
    { word: 'Water-polo', hint: 'Piscine' },
    { word: 'Aviron', hint: 'Rame' },

    { word: 'Cyclisme', hint: 'Vélo' },
    { word: 'Vtt', hint: 'Sentier' },
    { word: 'Bmx', hint: 'Figures' },
    { word: 'Piste', hint: 'Anneau' },

    { word: 'Gymnastique', hint: 'Souplesse' },
    { word: 'Acrobatique', hint: 'Figure' },
    { word: 'Trampoline', hint: 'Saut' },

    { word: 'Judo', hint: 'Kimono' },
    { word: 'Karaté', hint: 'Katas' },
    { word: 'Taekwondo', hint: 'Pieds' },
    { word: 'Aïkido', hint: 'Projection' },
    { word: 'Kung-fu', hint: 'Art' },
    { word: 'Boxe', hint: 'Poings' },
    { word: 'Kickboxing', hint: 'Coups' },
    { word: 'Mma', hint: 'Combat' },

    { word: 'Escrime', hint: 'Épée' },
    { word: 'Tir à l’arc', hint: 'Cible' },

    { word: 'Haltérophilie', hint: 'Poids' },
    { word: 'Powerlifting', hint: 'Force' },
    { word: 'Crossfit', hint: 'Intense' },
    { word: 'Musculation', hint: 'Charges' },

    { word: 'Ski', hint: 'Neige' },
    { word: 'Ski alpin', hint: 'Pente' },
    { word: 'Ski de fond', hint: 'Glisse' },
    { word: 'Snowboard', hint: 'Planche' },
    { word: 'Biathlon', hint: 'Tir' },

    { word: 'Patinage', hint: 'Glace' },
    { word: 'Patinage artistique', hint: 'Figures' },
    { word: 'Hockey', hint: 'Palet' },

    { word: 'Équitation', hint: 'Cheval' },
    { word: 'Dressage', hint: 'Précision' },
    { word: 'Saut d’obstacles', hint: 'Barres' },

    { word: 'Golf', hint: 'Green' },
    { word: 'Mini-golf', hint: 'Parcours' },

    { word: 'Baseball', hint: 'Batte' },
    { word: 'Softball', hint: 'Lancer' },

    { word: 'Cricket', hint: 'Wicket' },

    { word: 'Surf', hint: 'Vagues' },
    { word: 'Bodyboard', hint: 'Plage' },
    { word: 'Windsurf', hint: 'Voile' },
    { word: 'Kitesurf', hint: 'Aile' },

    { word: 'Voile', hint: 'Bateau' },
    { word: 'Canoë', hint: 'Rivière' },
    { word: 'Kayak', hint: 'Pagayeur' },
    { word: 'Rafting', hint: 'Rapides' },

    { word: 'Escalade', hint: 'Paroi' },
    { word: 'Alpinisme', hint: 'Sommet' },
    { word: 'Via ferrata', hint: 'Câbles' },

    { word: 'Skateboard', hint: 'Rampe' },
    { word: 'Longboard', hint: 'Descente' },
    { word: 'Roller', hint: 'Roues' },
    { word: 'Trottinette', hint: 'Urbain' }
  ],

  countries: [
    { word: 'France', hint: 'Europe' },
    { word: 'Allemagne', hint: 'Berlin' },
    { word: 'Italie', hint: 'Rome' },
    { word: 'Espagne', hint: 'Madrid' },
    { word: 'Portugal', hint: 'Lisbonne' },
    { word: 'Belgique', hint: 'Bruxelles' },
    { word: 'Pays-Bas', hint: 'Amsterdam' },
    { word: 'Luxembourg', hint: 'Petit' },
    { word: 'Suisse', hint: 'Neutre' },
    { word: 'Autriche', hint: 'Vienne' },
    { word: 'Irlande', hint: 'Vert' },
    { word: 'Royaume-Uni', hint: 'Londres' },
    { word: 'Islande', hint: 'Volcan' },
    { word: 'Norvège', hint: 'Fjord' },
    { word: 'Suède', hint: 'Nordique' },
    { word: 'Finlande', hint: 'Forêts' },
    { word: 'Danemark', hint: 'Copenhague' },
    { word: 'Pologne', hint: 'Varsovie' },
    { word: 'Tchéquie', hint: 'Prague' },
    { word: 'Slovaquie', hint: 'Bratislava' },
    { word: 'Hongrie', hint: 'Budapest' },
    { word: 'Roumanie', hint: 'Carpates' },
    { word: 'Bulgarie', hint: 'Balkan' },
    { word: 'Grèce', hint: 'Athènes' },
    { word: 'Turquie', hint: 'Istanbul' },
    { word: 'Ukraine', hint: 'Kiev' },
    { word: 'Russie', hint: 'Vaste' },

    { word: 'États-Unis', hint: 'Fédéral' },
    { word: 'Canada', hint: 'Érable' },
    { word: 'Mexique', hint: 'Aztèque' },

    { word: 'Brésil', hint: 'Amazonie' },
    { word: 'Argentine', hint: 'Tango' },
    { word: 'Chili', hint: 'Andine' },
    { word: 'Pérou', hint: 'Inca' },
    { word: 'Colombie', hint: 'Café' },
    { word: 'Venezuela', hint: 'Caracas' },
    { word: 'Bolivie', hint: 'Altitude' },
    { word: 'Uruguay', hint: 'Montevideo' },
    { word: 'Paraguay', hint: 'Asunción' },

    { word: 'Maroc', hint: 'Atlas' },
    { word: 'Algérie', hint: 'Sahara' },
    { word: 'Tunisie', hint: 'Méditerranée' },
    { word: 'Égypte', hint: 'Nil' },
    { word: 'Libye', hint: 'Désert' },
    { word: 'Sénégal', hint: 'Dakar' },
    { word: 'Mali', hint: 'Sahel' },
    { word: 'Nigéria', hint: 'Lagos' },
    { word: 'Ghana', hint: 'Or' },
    { word: 'Cameroun', hint: 'Équateur' },
    { word: 'Kenya', hint: 'Safari' },
    { word: 'Éthiopie', hint: 'Hauts-plateaux' },
    { word: 'Afrique du Sud', hint: 'Cap' },

    { word: 'Chine', hint: 'Population' },
    { word: 'Japon', hint: 'Tokyo' },
    { word: 'Corée du Sud', hint: 'Séoul' },
    { word: 'Corée du Nord', hint: 'Fermée' },
    { word: 'Inde', hint: 'Continent' },
    { word: 'Pakistan', hint: 'Lahore' },
    { word: 'Bangladesh', hint: 'Delta' },
    { word: 'Sri Lanka', hint: 'île' },
    { word: 'Népal', hint: 'Himalaya' },
    { word: 'Thaïlande', hint: 'Bangkok' },
    { word: 'Vietnam', hint: 'Mékong' },
    { word: 'Cambodge', hint: 'Angkor' },
    { word: 'Indonésie', hint: 'Archipel' },
    { word: 'Philippines', hint: 'Manille' },
    { word: 'Malaisie', hint: 'Kuala' },

    { word: 'Arabie saoudite', hint: 'Désert' },
    { word: 'Israël', hint: 'Jerusalem' },
    { word: 'Jordanie', hint: 'Pétra' },
    { word: 'Liban', hint: 'Béryte' },
    { word: 'Iran', hint: 'Perse' },
    { word: 'Irak', hint: 'Mésopotamie' },

    { word: 'Australie', hint: 'Océanie' },
    { word: 'Nouvelle-Zélande', hint: 'Kiwi' },
    { word: 'Papouasie-Nouvelle-Guinée', hint: 'Forêts' }
  ],

  celebrities: [
    { word: 'Brad Pitt', hint: 'Acteur' },
    { word: 'Leonardo DiCaprio', hint: 'Cinéma' },
    { word: 'Johnny Depp', hint: 'Pirate' },
    { word: 'Tom Cruise', hint: 'Cascade' },
    { word: 'Will Smith', hint: 'Hollywood' },
    { word: 'Denzel Washington', hint: 'Drame' },
    { word: 'Morgan Freeman', hint: 'Narrateur' },
    { word: 'Robert De Niro', hint: 'Mafia' },
    { word: 'Al Pacino', hint: 'Parrain' },
    { word: 'Keanu Reeves', hint: 'Action' },

    { word: 'Scarlett Johansson', hint: 'Actrice' },
    { word: 'Natalie Portman', hint: 'Oscar' },
    { word: 'Emma Watson', hint: 'Sorcière' },
    { word: 'Jennifer Lawrence', hint: 'Hunger' },
    { word: 'Margot Robbie', hint: 'Barbie' },
    { word: 'Angelina Jolie', hint: 'Humanitaire' },
    { word: 'Meryl Streep', hint: 'Légende' },

    { word: 'Steven Spielberg', hint: 'Réalisateur' },
    { word: 'Christopher Nolan', hint: 'Temps' },
    { word: 'Quentin Tarantino', hint: 'Dialogues' },
    { word: 'James Cameron', hint: 'Avatar' },

    { word: 'Michael Jackson', hint: 'Pop' },
    { word: 'Elvis Presley', hint: 'Rock' },
    { word: 'Madonna', hint: 'Icône' },
    { word: 'Prince', hint: 'Génie' },
    { word: 'David Bowie', hint: 'Caméléon' },
    { word: 'Elton John', hint: 'Piano' },

    { word: 'Beyoncé', hint: 'Queen' },
    { word: 'Rihanna', hint: 'Barbade' },
    { word: 'Taylor Swift', hint: 'Albums' },
    { word: 'Adele', hint: 'Voix' },
    { word: 'Lady Gaga', hint: 'Excentrique' },
    { word: 'Shakira', hint: 'Danse' },
    { word: 'Drake', hint: 'Rap' },
    { word: 'Eminem', hint: 'Lyrique' },
    { word: 'Kanye West', hint: 'Controverse' },
    { word: 'Jay-Z', hint: 'Business' },

    { word: 'Cristiano Ronaldo', hint: 'Football' },
    { word: 'Lionel Messi', hint: 'Argentin' },
    { word: 'Neymar', hint: 'Brésil' },
    { word: 'Kylian Mbappé', hint: 'Vitesse' },
    { word: 'Zinedine Zidane', hint: 'Élégance' },
    { word: 'LeBron James', hint: 'Basket' },
    { word: 'Michael Jordan', hint: 'Légende' },
    { word: 'Serena Williams', hint: 'Tennis' },
    { word: 'Roger Federer', hint: 'Classe' },
    { word: 'Usain Bolt', hint: 'Sprint' },

    { word: 'Elon Musk', hint: 'Technologie' },
    { word: 'Steve Jobs', hint: 'Apple' },
    { word: 'Bill Gates', hint: 'Microsoft' },
    { word: 'Mark Zuckerberg', hint: 'Facebook' },
    { word: 'Jeff Bezos', hint: 'Amazon' },

    { word: 'Barack Obama', hint: 'Président' },
    { word: 'Nelson Mandela', hint: 'Paix' },
    { word: 'Winston Churchill', hint: 'Histoire' },
    { word: 'Emmanuel Macron', hint: 'France' },
  ],

  brands: [
    { word: 'Nike', hint: 'Sport' },
    { word: 'Adidas', hint: 'Football' },
    { word: 'Puma', hint: 'Performance' },
    { word: 'Reebok', hint: 'Fitness' },
    { word: 'Under Armour', hint: 'Athlète' },
    { word: 'New Balance', hint: 'Confort' },
    { word: 'Vans', hint: 'Skate' },
    { word: 'Converse', hint: 'Basket' },
    { word: 'Jordan', hint: 'Basketball' },
    { word: 'Asics', hint: 'Course' },

    { word: 'Apple', hint: 'Technologie' },
    { word: 'Samsung', hint: 'Smartphones' },
    { word: 'Google', hint: 'Internet' },
    { word: 'Microsoft', hint: 'Software' },
    { word: 'Sony', hint: 'Playstation' },
    { word: 'LG', hint: 'Électroménager' },
    { word: 'Huawei', hint: 'Smartphones' },
    { word: 'Dell', hint: 'Ordinateurs' },

    { word: 'Coca-Cola', hint: 'Boisson' },
    { word: 'Pepsi', hint: 'Cola' },
    { word: 'Red Bull', hint: 'Énergie' },
    { word: 'Fanta', hint: 'Fruité' },
    { word: 'Sprite', hint: 'Citron' },
    { word: 'Nestlé', hint: 'Alimentaire' },

    { word: 'McDonald\'s', hint: 'Fast food' },
    { word: 'Burger King', hint: 'Hamburger' },
    { word: 'KFC', hint: 'Poulet' },
    { word: 'Subway', hint: 'Sandwich' },
    { word: 'Domino\'s', hint: 'Pizza' },
    { word: 'Pizza Hut', hint: 'Pizzas' },

    { word: 'Amazon', hint: 'E-commerce' },
    { word: 'EBay', hint: 'Enchères' },
    { word: 'Alibaba', hint: 'Commerce en ligne' },
    { word: 'Walmart', hint: 'Magasin' },
    { word: 'Target', hint: 'Supermarché' },

    { word: 'Louis Vuitton', hint: 'Luxe' },
    { word: 'Gucci', hint: 'Mode' },
    { word: 'Chanel', hint: 'Haute couture' },
    { word: 'Rolex', hint: 'Montre' },
    { word: 'Hermès', hint: 'Sac' },

    { word: 'Tesla', hint: 'Électrique' },
    { word: 'BMW', hint: 'Voiture' },
    { word: 'Mercedes-Benz', hint: 'Luxe' },
    { word: 'Audi', hint: 'Confort' },
    { word: 'Ford', hint: 'Américaine' },

    { word: 'Nike', hint: 'Athlétisme' },
    { word: 'Patagonia', hint: 'Écologique' },
    { word: 'The North Face', hint: 'Outdoor' },
    { word: 'Columbia', hint: 'Montagne' },

    { word: 'L’Oréal', hint: 'Beauté' },
    { word: 'Chanel', hint: 'Parfum' },
    { word: 'Dior', hint: 'Maquillage' },
    { word: 'Maybelline', hint: 'Cosmétique' },
    { word: 'Estée Lauder', hint: 'Soin' },

    { word: 'Spotify', hint: 'Musique' },
    { word: 'Apple Music', hint: 'Streaming' },
    { word: 'YouTube', hint: 'Vidéo' },
    { word: 'Netflix', hint: 'Streaming' },
    { word: 'Disney+', hint: 'Films' },
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
    return { word: 'Pomme', hint: 'Fruit', category: 'food' };
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
  
  console.log('===== IMPOSTER CHECK =====');
  console.log('Current User Firebase ID:', currentUser?.firebaseId);
  console.log('Imposter ID from props:', imposterId);
  console.log('Is Imposter:', isImposter);
  console.log('========================');

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
          word: 'Pomme',
          hint: 'Fruit',
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
              borderBottom: `${triangle.size * 1.732}px solid rgba(${isImposter ? '255, 102, 102' : '153, 255, 153'}, ${triangle.opacity})`,
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
                    border: `4px solid ${isCurrentUser ? (isImposter ? '#ff6666' : '#74a887ff') : '#6f6f6fff'}`,
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
                    border: `4px solid ${isCurrentUser ? (isImposter ? '#ff6666' : '#74a887ff') : '#6f6f6fff'}`,
                    textAlign: 'center',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: isCurrentUser ? (isImposter ? '#ff6666' : '#74a887ff') : '#6f6f6fff',
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