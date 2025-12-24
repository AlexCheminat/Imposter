import { useState, useEffect } from 'react';
import { RotateCw, Play } from 'lucide-react';

// Word categories directly in the file
const wordCategories = {
  animals: [
    { word: 'Chat', hint: 'Indépendant' },
    { word: 'Chien', hint: 'Loyal' },
    { word: 'Lion', hint: 'Fierté' },
    { word: 'Tigre', hint: 'Solitaire' },
    { word: 'Éléphant', hint: 'Savane' },
    { word: 'Girafe', hint: 'Hauteur' },
    { word: 'Zèbre', hint: 'Rayures' },
    { word: 'Cheval', hint: 'Galop' },
    { word: 'Vache', hint: 'Élevage' },
    { word: 'Mouton', hint: 'Troupeau' },
    { word: 'Chèvre', hint: 'Cornes' },
    { word: 'Cochon', hint: 'Ferme' },
    { word: 'Lapin', hint: 'Rapide' },
    { word: 'Hamster', hint: 'Roue' },
    { word: 'Souris', hint: 'Discret' },
    { word: 'Rat', hint: 'Égout' },
    { word: 'Écureuil', hint: 'Gland' },
    { word: 'Ours', hint: 'Hibernation' },
    { word: 'Loup', hint: 'Meute' },
    { word: 'Renard', hint: 'Ruse' },
    { word: 'Cerf', hint: 'Bois' },
    { word: 'Biche', hint: 'Forêt' },
    { word: 'Sanglier', hint: 'Défense' },
    { word: 'Blaireau', hint: 'Terrier' },
    { word: 'Hérisson', hint: 'Piquant' },
    { word: 'Chauve-souris', hint: 'Nuit' },

    { word: 'Dauphin', hint: 'Intelligent' },
    { word: 'Baleine', hint: 'Géant' },
    { word: 'Requin', hint: 'Prédateur' },
    { word: 'Poisson', hint: 'Eau' },
    { word: 'Anguille', hint: 'Glissant' },
    { word: 'Méduse', hint: 'Transparente' },
    { word: 'Crabe', hint: 'Latéral' },
    { word: 'Homard', hint: 'Carapace' },
    { word: 'Crevette', hint: 'Rose' },
    { word: 'Pieuvre', hint: 'Stratégie' },
    { word: 'Calmar', hint: 'Encre' },

    { word: 'Tortue', hint: 'Lenteur' },
    { word: 'Serpent', hint: 'Silencieux' },
    { word: 'Lézard', hint: 'Solaire' },
    { word: 'Iguane', hint: 'Tropical' },
    { word: 'Crocodile', hint: 'Immobilité' },
    { word: 'Alligator', hint: 'Marais' },
    { word: 'Grenouille', hint: 'Amphibien' },
    { word: 'Crapaud', hint: 'Terrestre' },
    { word: 'Salamandre', hint: 'Humide' },

    { word: 'Papillon', hint: 'Métamorphose' },
    { word: 'Abeille', hint: 'Colonie' },
    { word: 'Guêpe', hint: 'Piqûre' },
    { word: 'Fourmi', hint: 'Travail' },
    { word: 'Coccinelle', hint: 'Points' },
    { word: 'Scarabée', hint: 'Carapace' },
    { word: 'Moustique', hint: 'Nuisible' },
    { word: 'Araignée', hint: 'Patience' },
    { word: 'Scorpion', hint: 'Dard' },

    { word: 'Pigeon', hint: 'Urbain' },
    { word: 'Moineau', hint: 'Chant' },
    { word: 'Aigle', hint: 'Altitude' },
    { word: 'Faucon', hint: 'Vitesse' },
    { word: 'Hibou', hint: 'Nocturne' },
    { word: 'Chouette', hint: 'Nuit' },
    { word: 'Corbeau', hint: 'Noir' },
    { word: 'Perroquet', hint: 'Imitation' },
    { word: 'Pingouin', hint: 'Froid' },
    { word: 'Manchot', hint: 'Antarctique' },
    { word: 'Autruche', hint: 'Rapide' },
    { word: 'Paon', hint: 'Plumes' },
    { word: 'Cygne', hint: 'Élégant' },
    { word: 'Canard', hint: 'Étang' },
    { word: 'Oie', hint: 'Bruyante' },
    { word: 'Flamant', hint: 'Rose' },

    { word: 'Rhinocéros', hint: 'Massif' },
    { word: 'Hippopotame', hint: 'Aquatique' },
    { word: 'Singe', hint: 'Agilité' },

    { word: 'Kangourou', hint: 'Australie' },
    { word: 'Koala', hint: 'Eucalyptus' },
    { word: 'Panda', hint: 'Bambou' },
    { word: 'Chameau', hint: 'Désert' },
    { word: 'Lama', hint: 'Andes' }
  ],

  food: [
    { word: 'Pomme', hint: 'Fruit' },
    { word: 'Poire', hint: 'Juteux' },
    { word: 'Banane', hint: 'Énergie' },
    { word: 'Orange', hint: 'Agrume' },
    { word: 'Citron', hint: 'Acide' },
    { word: 'Mandarine', hint: 'Sucré' },
    { word: 'Clémentine', hint: 'Hiver' },
    { word: 'Fraise', hint: 'Dessert' },
    { word: 'Framboise', hint: 'Baie' },
    { word: 'Myrtille', hint: 'Antioxydant' },
    { word: 'Mûre', hint: 'Sauvage' },
    { word: 'Cerise', hint: 'Noyau' },
    { word: 'Abricot', hint: 'Été' },
    { word: 'Pêche', hint: 'Duvet' },
    { word: 'Nectarine', hint: 'Lisse' },
    { word: 'Prune', hint: 'Compote' },
    { word: 'Raisin', hint: 'Grappe' },
    { word: 'Melon', hint: 'Frais' },
    { word: 'Pastèque', hint: 'Hydratant' },
    { word: 'Ananas', hint: 'Tropical' },
    { word: 'Mangue', hint: 'Exotique' },
    { word: 'Kiwi', hint: 'Acide' },
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
    { word: 'Camembert', hint: 'Affinage' },
    { word: 'Brie', hint: 'Doux' },
    { word: 'Roquefort', hint: 'Cave' },
    { word: 'Comté', hint: 'Montagne' },
    { word: 'Emmental', hint: 'Fondue' },
    { word: 'Gruyère', hint: 'Fondant' },
    { word: 'Parmesan', hint: 'Râpé' },
    { word: 'Chèvre', hint: 'Frais' },
    { word: 'Mozzarella', hint: 'Filant' },

    { word: 'Lait', hint: 'Boisson' },
    { word: 'Beurre', hint: 'Gras' },
    { word: 'Crème', hint: 'Épais' },
    { word: 'Yaourt', hint: 'Fermenté' },
    { word: 'Œuf', hint: 'Cuisine' },

    { word: 'Riz', hint: 'Céréale' },
    { word: 'Pâtes', hint: 'Blé' },
    { word: 'Quinoa', hint: 'Graine' },
    { word: 'Semoule', hint: 'Fine' },
    { word: 'Couscous', hint: 'Maghreb' },
    { word: 'Lentilles', hint: 'Protéines' },
    { word: 'Pois', hint: 'Légumineuse' },
    { word: 'Haricots', hint: 'Secs' },
    { word: 'Pois chiches', hint: 'Légumineuse' },

    { word: 'Poulet', hint: 'Volaille' },
    { word: 'Bœuf', hint: 'Grillade' },
    { word: 'Porc', hint: 'Charcuterie' },
    { word: 'Agneau', hint: 'Tendre' },
    { word: 'Dinde', hint: 'Fête' },
    { word: 'Jambon', hint: 'Salé' },
    { word: 'Saucisse', hint: 'Grillade' },
    { word: 'Steak', hint: 'Grill' },

    { word: 'Saumon', hint: 'Gravlax' },
    { word: 'Thon', hint: 'Conserve' },
    { word: 'Cabillaud', hint: 'Poisson' },
    { word: 'Sardine', hint: 'Méditerranée' },
    { word: 'Maquereau', hint: 'Fumé' },

    { word: 'Carotte', hint: 'Racine' },
    { word: 'Pomme de terre', hint: 'Accompagnement' },
    { word: 'Tomate', hint: 'Cuisine' },
    { word: 'Concombre', hint: 'Frais' },
    { word: 'Courgette', hint: 'Été' },
    { word: 'Aubergine', hint: 'Grillée' },
    { word: 'Poivron', hint: 'Croquant' },
    { word: 'Oignon', hint: 'Piquant' },
    { word: 'Ail', hint: 'Arôme' },
    { word: 'Échalote', hint: 'Subtil' },
    { word: 'Salade', hint: 'Feuille' },
    { word: 'Épinard', hint: 'Feuille' },

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
    { word: 'Crêpe', hint: 'Garniture' },
    { word: 'Glace', hint: 'Froid' }
  ],
  
  objects: [
    { word: 'Table', hint: 'Surface' },
    { word: 'Chaise', hint: 'Posture' },
    { word: 'Canapé', hint: 'Détente' },
    { word: 'Fauteuil', hint: 'Accoudoirs' },
    { word: 'Lit', hint: 'Repos' },
    { word: 'Matelas', hint: 'Soutien' },
    { word: 'Oreiller', hint: 'Nuque' },
    { word: 'Couverture', hint: 'Isolation' },
    { word: 'Armoire', hint: 'Verticale' },
    { word: 'Commode', hint: 'Rangement' },
    { word: 'Étagère', hint: 'Alignement' },
    { word: 'Bureau', hint: 'Organisation' },
    { word: 'Lampe', hint: 'Ambiance' },
    { word: 'Ampoule', hint: 'Filament' },
    { word: 'Interrupteur', hint: 'Contact' },
    { word: 'Prise', hint: 'Alimentation' },
    { word: 'Câble', hint: 'Transmission' },
    { word: 'Multiprise', hint: 'Extension' },

    { word: 'Télévision', hint: 'Diffusion' },
    { word: 'Télécommande', hint: 'Distance' },
    { word: 'Radio', hint: 'Fréquence' },
    { word: 'Enceinte', hint: 'Volume' },
    { word: 'Casque', hint: 'Immersion' },
    { word: 'Écouteurs', hint: 'Discrétion' },

    { word: 'Ordinateur', hint: 'Traitement' },
    { word: 'Clavier', hint: 'Saisie' },
    { word: 'Souris', hint: 'Curseur' },
    { word: 'Écran', hint: 'Interface' },
    { word: 'Imprimante', hint: 'Sortie' },
    { word: 'Scanner', hint: 'Capture' },

    { word: 'Téléphone', hint: 'Communication' },
    { word: 'Smartphone', hint: 'Polyvalent' },
    { word: 'Chargeur', hint: 'Recharge' },
    { word: 'Batterie', hint: 'Autonomie' },
    { word: 'Câble usb', hint: 'Standard' },

    { word: 'Stylo', hint: 'Trace' },
    { word: 'Crayon', hint: 'Graphite' },
    { word: 'Gomme', hint: 'Correction' },
    { word: 'Feutre', hint: 'Pigment' },
    { word: 'Cahier', hint: 'Reliure' },
    { word: 'Livre', hint: 'Chapitre' },
    { word: 'Agenda', hint: 'Planification' },

    { word: 'Sac', hint: 'Contenance' },
    { word: 'Sac à dos', hint: 'Épaules' },
    { word: 'Valise', hint: 'Séjour' },
    { word: 'Portefeuille', hint: 'Compartiments' },
    { word: 'Clé', hint: 'Accès' },
    { word: 'Trousseau', hint: 'Ensemble' },

    { word: 'Montre', hint: 'Précision' },
    { word: 'Réveil', hint: 'Signal' },
    { word: 'Horloge', hint: 'Cadran' },

    { word: 'Miroir', hint: 'Symétrie' },
    { word: 'Brosse', hint: 'Démêlage' },
    { word: 'Peigne', hint: 'Alignement' },
    { word: 'Rasoir', hint: 'Affûté' },
    { word: 'Serviette', hint: 'Absorption' },

    { word: 'Assiette', hint: 'Support' },
    { word: 'Bol', hint: 'Contenant' },
    { word: 'Verre', hint: 'Transparent' },
    { word: 'Tasse', hint: 'Anse' },
    { word: 'Fourchette', hint: 'Ustensile' },
    { word: 'Couteau', hint: 'Tranchant' },
    { word: 'Cuillère', hint: 'Dosage' },
    { word: 'Poêle', hint: 'Surface' },
    { word: 'Casserole', hint: 'Contenance' },
    { word: 'Four', hint: 'Chambre' },
    { word: 'Micro-ondes', hint: 'Ondes' },
    { word: 'Réfrigérateur', hint: 'Conservation' },

    { word: 'Balai', hint: 'Manche' },
    { word: 'Serpillière', hint: 'Humide' },
    { word: 'Aspirateur', hint: 'Aspiration' },
    { word: 'Poubelle', hint: 'Collecte' }
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
    { word: 'Allemagne', hint: 'Industrie' },
    { word: 'Italie', hint: 'Péninsule' },
    { word: 'Espagne', hint: 'Ibérique' },
    { word: 'Portugal', hint: 'Atlantique' },
    { word: 'Belgique', hint: 'Bière' },
    { word: 'Pays-Bas', hint: 'Canaux' },
    { word: 'Luxembourg', hint: 'Petit' },
    { word: 'Suisse', hint: 'Neutre' },
    { word: 'Autriche', hint: 'Alpes' },
    { word: 'Irlande', hint: 'Vert' },
    { word: 'Royaume-Uni', hint: 'Îles' },
    { word: 'Islande', hint: 'Volcan' },
    { word: 'Norvège', hint: 'Fjord' },
    { word: 'Suède', hint: 'Nordique' },
    { word: 'Finlande', hint: 'Forêts' },
    { word: 'Danemark', hint: 'Vikings' },
    { word: 'Pologne', hint: 'Plaines' },
    { word: 'Tchéquie', hint: 'Bohême' },
    { word: 'Slovaquie', hint: 'Tatras' },
    { word: 'Hongrie', hint: 'Danube' },
    { word: 'Roumanie', hint: 'Carpates' },
    { word: 'Bulgarie', hint: 'Balkan' },
    { word: 'Grèce', hint: 'Antique' },
    { word: 'Turquie', hint: 'Carrefour' },
    { word: 'Ukraine', hint: 'Plaines' },
    { word: 'Russie', hint: 'Vaste' },

    { word: 'États-Unis', hint: 'Fédéral' },
    { word: 'Canada', hint: 'Érable' },
    { word: 'Mexique', hint: 'Aztèque' },

    { word: 'Brésil', hint: 'Amazonie' },
    { word: 'Argentine', hint: 'Tango' },
    { word: 'Chili', hint: 'Andine' },
    { word: 'Pérou', hint: 'Inca' },
    { word: 'Colombie', hint: 'Café' },
    { word: 'Venezuela', hint: 'Pétrole' },
    { word: 'Bolivie', hint: 'Altitude' },
    { word: 'Uruguay', hint: 'Discret' },
    { word: 'Paraguay', hint: 'Bilingue' },

    { word: 'Maroc', hint: 'Atlas' },
    { word: 'Algérie', hint: 'Sahara' },
    { word: 'Tunisie', hint: 'Méditerranée' },
    { word: 'Égypte', hint: 'Nil' },
    { word: 'Libye', hint: 'Désert' },
    { word: 'Sénégal', hint: 'Teranga' },
    { word: 'Mali', hint: 'Sahel' },
    { word: 'Nigéria', hint: 'Peuplé' },
    { word: 'Ghana', hint: 'Or' },
    { word: 'Cameroun', hint: 'Diversité' },
    { word: 'Kenya', hint: 'Safari' },
    { word: 'Éthiopie', hint: 'Hauts-plateaux' },
    { word: 'Afrique du Sud', hint: 'Multiculturel' },

    { word: 'Chine', hint: 'Population' },
    { word: 'Japon', hint: 'Insulaire' },
    { word: 'Corée du Sud', hint: 'Technologie' },
    { word: 'Corée du Nord', hint: 'Fermée' },
    { word: 'Inde', hint: 'Diversité' },
    { word: 'Pakistan', hint: 'Indus' },
    { word: 'Bangladesh', hint: 'Delta' },
    { word: 'Sri Lanka', hint: 'Thé' },
    { word: 'Népal', hint: 'Himalaya' },
    { word: 'Thaïlande', hint: 'Tropical' },
    { word: 'Vietnam', hint: 'Mékong' },
    { word: 'Cambodge', hint: 'Temples' },
    { word: 'Indonésie', hint: 'Archipel' },
    { word: 'Philippines', hint: 'Îles' },
    { word: 'Malaisie', hint: 'Équatorial' },

    { word: 'Arabie saoudite', hint: 'Désert' },
    { word: 'Israël', hint: 'Conflits' },
    { word: 'Jordanie', hint: 'Roche' },
    { word: 'Liban', hint: 'Cèdres' },
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

    // 🇫🇷 French celebrities
    { word: 'Omar Sy', hint: 'Charisme' },
    { word: 'Jean Dujardin', hint: 'Oscars' },
    { word: 'Marion Cotillard', hint: 'Drame' },
    { word: 'Louis de Funès', hint: 'Comique' },
    { word: 'Gérard Depardieu', hint: 'Monument' },
    { word: 'Vincent Cassel', hint: 'Intensité' },
    { word: 'Audrey Tautou', hint: 'Poésie' },
    { word: 'Léa Seydoux', hint: 'International' },
    { word: 'Alain Delon', hint: 'Icône' },
    { word: 'Brigitte Bardot', hint: 'Mythe' },

    { word: 'Daft Punk', hint: 'Électro' },
    { word: 'David Guetta', hint: 'DJ' },
    { word: 'Stromae', hint: 'Conceptuel' },
    { word: 'Johnny Hallyday', hint: 'Rockeur' },
    { word: 'Aya Nakamura', hint: 'Streaming' },
    { word: 'Jul', hint: 'Productif' },

    { word: 'Tony Parker', hint: 'NBA' },
    { word: 'Teddy Riner', hint: 'Judo' },
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

    { word: 'Patagonia', hint: 'Écologique' },
    { word: 'The North Face', hint: 'Outdoor' },
    { word: 'Columbia', hint: 'Montagne' },

    { word: 'L’Oréal', hint: 'Beauté' },
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

function getRandomWord(categories = ['animals', 'food', 'objects', 'places', 'jobs', 'sports', 'countries', 'celebrities', 'brands']) {
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
  const [particles, setParticles] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [generatedWord, setGeneratedWord] = useState('');
  const [hint, setHint] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [startingPlayer, setStartingPlayer] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(['animals', 'food', 'objects']);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [showCover, setShowCover] = useState(true);
  
  // Sort players by join time to determine host
  const sortedPlayers = [...players].sort((a, b) => a.joinedAt - b.joinedAt);
  
  // Check if current user is the first player (host)
  const isFirstPlayer = sortedPlayers.length > 0 && currentUser && 
                        sortedPlayers[0].id === currentUser.firebaseId;

  // Check if current user is the imposter
  const isImposter = currentUser && imposterId && currentUser.firebaseId === imposterId;

  console.log('===== IMPOSTER CHECK =====');
  console.log('Current User Firebase ID:', currentUser?.firebaseId);
  console.log('Imposter ID from props:', imposterId);
  console.log('Is Imposter:', isImposter);
  console.log('========================');

  // Generate floating particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          left: Math.random() * 100,
          size: Math.random() * 4 + 2,
          duration: Math.random() * 10 + 15,
          delay: Math.random() * -20,
          opacity: Math.random() * 0.3 + 0.1
        });
      }
      setParticles(newParticles);
    };
    generateParticles();

    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'auto';
  }, []);

  // Load selected categories from Firebase
  useEffect(() => {
    if (!database || !lobbyId) return;

    const { ref, onValue } = database;
    const categoriesRef = ref(database.db, `lobbies/${lobbyId}/selectedCategories`);

    const unsubscribe = onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data && Array.isArray(data) && data.length > 0) {
        setSelectedCategories(data);
      }
      setCategoriesLoaded(true);
    });

    return () => unsubscribe();
  }, [database, lobbyId]);

  // Generate and sync word with Firebase
  useEffect(() => {
    if (!database || !lobbyId || !categoriesLoaded) return;

    const { ref, onValue, set } = database;
    const wordRef = ref(database.db, `lobbies/${lobbyId}/currentWord`);

    const unsubscribe = onValue(wordRef, async (snapshot) => {
      const wordData = snapshot.val();
      
      if (wordData && wordData.word) {
        setGeneratedWord(wordData.word);
        setHint(wordData.hint || '');
        setCategory(wordData.category || '');
        setStartingPlayer(wordData.startingPlayer || null);
        setLoading(false);
        setIsRefreshing(false);
      } else {
        // Generate random word using getRandomWord function with selected categories
        const randomWordData = getRandomWord(selectedCategories);
        
        // Select random starting player
        const randomPlayerIndex = Math.floor(Math.random() * players.length);
        const randomPlayer = players[randomPlayerIndex];
        
        await set(wordRef, {
          word: randomWordData.word,
          hint: randomWordData.hint,
          category: randomWordData.category,
          startingPlayer: randomPlayer ? randomPlayer.username : null,
          generatedAt: Date.now()
        });
        
        setGeneratedWord(randomWordData.word);
        setHint(randomWordData.hint);
        setCategory(randomWordData.category);
        setStartingPlayer(randomPlayer ? randomPlayer.username : null);
        setLoading(false);
        setIsRefreshing(false);
      }
    });

    return () => unsubscribe();
  }, [database, lobbyId, players, selectedCategories, categoriesLoaded]);

  const handleRefresh = async () => {
    if (!database || !lobbyId || isRefreshing) return;
    
    setIsRefreshing(true);
    
    const { ref, set } = database;
    const wordRef = ref(database.db, `lobbies/${lobbyId}/currentWord`);
    const imposterRef = ref(database.db, `lobbies/${lobbyId}/gameState/imposterId`);
    
    // Generate new random word using selected categories
    const randomWordData = getRandomWord(selectedCategories);
    
    // Select random starting player
    const randomPlayerIndex = Math.floor(Math.random() * players.length);
    const randomPlayer = players[randomPlayerIndex];
    
    // Select random imposter (independently, can be anyone including starting player)
    const randomImposterIndex = Math.floor(Math.random() * players.length);
    const randomImposter = players[randomImposterIndex];
    
    // Update both word and imposter in Firebase
    await set(wordRef, {
      word: randomWordData.word,
      hint: randomWordData.hint,
      category: randomWordData.category,
      startingPlayer: randomPlayer ? randomPlayer.username : null,
      generatedAt: Date.now()
    });
    
    await set(imposterRef, randomImposter ? randomImposter.id : null);
  };

  const handleConfirm = () => {
    if (!selectedPlayer) {
      alert('Vous devez choisir un joueur!');
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

  const handleReveal = () => {
    setShowCover(false);
  };

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
          width: 100% !important;
          max-width: 100% !important;
        }
        body > div {
          max-width: 100vw !important;
        }
        #root {
          min-height: 100vh;
        }
        @keyframes drift {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(239, 68, 68, 0.5), 0 0 40px rgba(239, 68, 68, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(239, 68, 68, 0.7), 0 0 60px rgba(239, 68, 68, 0.5);
          }
        }
        @keyframes pulseButton {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 40px rgba(255, 255, 255, 0.6);
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
            visibility: visible;
          }
          to {
            opacity: 0;
            visibility: hidden;
          }
        }
        @keyframes scaleUp {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .btn-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        .btn-hover:active {
          transform: translateY(0);
        }
        .player-card {
          transition: all 0.3s ease;
        }
        .player-card:not(.disabled):hover {
          transform: translateX(5px);
        }
        .cover-fade-out {
          animation: fadeOut 0.5s ease-out forwards;
        }
      `}</style>
      
      {/* Cover Screen */}
      {showCover && (
        <div
          onClick={handleReveal}
          className={!showCover ? 'cover-fade-out' : ''}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            cursor: 'pointer'
          }}
        >
          <div style={{
            textAlign: 'center',
            animation: 'scaleUp 0.6s ease-out',
            padding: '2rem'
          }}>
            <div style={{
              fontSize: '5rem',
              marginBottom: '2rem',
              filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3))'
            }}>
              🔒
            </div>
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '1.25rem',
              marginBottom: '3rem',
              maxWidth: '500px',
              margin: '0 auto 3rem auto'
            }}>
              👆 Cliquez n'importe où pour révéler
            </p>
            </div>
          </div>
      )}
      
      <div style={{ 
        minHeight: '100vh', 
        width: '100vw',
        margin: '0',
        background: isImposter 
          ? 'linear-gradient(135deg, #dc2626 0%, #991b1b 50%, #7f1d1d 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        padding: '2rem', 
        paddingBottom: '3rem', 
        boxSizing: 'border-box', 
        position: 'relative',
        overflow: 'hidden'
      }}>
        
        {/* Floating Particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            style={{
              position: 'absolute',
              left: `${particle.left}%`,
              bottom: '-20px',
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              borderRadius: '50%',
              backgroundColor: `rgba(255, 255, 255, ${particle.opacity})`,
              animation: `drift ${particle.duration}s linear ${particle.delay}s infinite`,
              pointerEvents: 'none'
            }}
          />
        ))}
        
        {/* Main Container */}
        <div style={{ 
          width: '100%', 
          maxWidth: '600px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '2rem', 
          position: 'relative', 
          zIndex: 10, 
          marginTop: '2rem',
          animation: 'fadeInUp 0.6s ease-out'
        }}>
        
          {/* Title */}
          <h1 style={{
            textAlign: 'center',
            color: 'white',
            fontSize: '2rem',
            fontWeight: '700',
            textShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
            marginBottom: '-1rem'
          }}>
            {isImposter ? '🎭 Vous êtes l\'Imposteur!' : '🎯 Votre Mot'}
          </h1>

          {/* Generated Word Card */}
          <div style={{
            width: '100%',
            padding: '2.5rem 2rem',
            background: isImposter 
              ? 'linear-gradient(135deg, rgba(220, 38, 38, 0.3) 0%, rgba(153, 27, 27, 0.3) 100%)'
              : 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px)',
            border: isImposter 
              ? '3px solid rgba(239, 68, 68, 0.6)'
              : '3px solid rgba(255, 255, 255, 0.4)',
            borderRadius: '30px',
            textAlign: 'center',
            fontSize: '2rem',
            fontWeight: '700',
            color: 'white',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            position: 'relative',
            boxShadow: isImposter 
              ? '0 15px 40px rgba(220, 38, 38, 0.4)'
              : '0 15px 40px rgba(0, 0, 0, 0.3)',
            animation: isImposter ? 'pulse 2s infinite' : 'none'
          }}>
            {/* Refresh Button */}
            {isFirstPlayer && (
              <button
                onClick={handleRefresh}
                disabled={isRefreshing || loading}
                className="btn-hover"
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                  borderRadius: '50%',
                  width: '45px',
                  height: '45px',
                  cursor: isRefreshing || loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isRefreshing || loading ? 0.5 : 1,
                  padding: 0
                }}
              >
                <RotateCw 
                  size={22} 
                  color="white"
                  strokeWidth={2}
                  style={{
                    animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
                  }}
                />
              </button>
            )}

            {loading ? (
              <div style={{ fontSize: '1.25rem' }}>Chargement...</div>
            ) : (
              <>
                {isImposter ? (
                  <>
                    <div style={{ 
                      fontSize: '1.125rem', 
                      padding: '0.75rem 1.5rem',
                      background: 'rgba(255, 255, 255, 0.15)',
                      borderRadius: '15px',
                      backdropFilter: 'blur(10px)'
                    }}>
                      💡 Indice: {hint}
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: '2.5rem', textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)' }}>
                    {generatedWord}
                  </div>
                )}
                {startingPlayer && (
                  <div style={{ 
                    fontSize: '1rem', 
                    opacity: 0.9,
                    padding: '0.5rem 1rem',
                    background: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <Play size={18} fill="white" />
                    {startingPlayer} commence
                  </div>
                )}
              </>
            )}
          </div>

          {/* Players List Section */}
          <div style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            borderRadius: '30px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            padding: '2rem 1.5rem',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <h2 style={{
              color: 'white',
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1.5rem',
              textAlign: 'center',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
            }}>
              Qui est l'Imposteur?
            </h2>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {players.map((player, index) => {
                const isCurrentUser = currentUser && player.id === currentUser.firebaseId;
                const isSelected = selectedPlayer && selectedPlayer.id === player.id;
                const cannotSelect = isCurrentUser;
                
                return (
                  <div 
                    key={player.id} 
                    onClick={() => !cannotSelect && setSelectedPlayer(player)}
                    className={`player-card ${cannotSelect ? 'disabled' : ''}`}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1rem',
                      cursor: cannotSelect ? 'not-allowed' : 'pointer',
                      padding: '0.5rem',
                      opacity: cannotSelect ? 0.5 : 1,
                      animation: `slideIn 0.4s ease-out ${index * 0.1}s backwards`
                    }}
                  >
                    {/* Player Photo */}
                    <div style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: isCurrentUser 
                        ? (isImposter ? '3px solid rgba(239, 68, 68, 0.8)' : '3px solid rgba(16, 185, 129, 0.8)')
                        : '3px solid rgba(255, 255, 255, 0.6)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      flexShrink: 0,
                      boxShadow: isCurrentUser 
                        ? (isImposter ? '0 0 20px rgba(239, 68, 68, 0.5)' : '0 0 20px rgba(16, 185, 129, 0.5)')
                        : '0 4px 15px rgba(0, 0, 0, 0.2)'
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
                      padding: '1rem 1.5rem',
                      background: isCurrentUser 
                        ? (isImposter 
                          ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.3) 100%)'
                          : 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.3) 100%)')
                        : 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      border: isSelected 
                        ? '3px solid #ef4444'
                        : (isCurrentUser 
                          ? (isImposter ? '2px solid rgba(239, 68, 68, 0.6)' : '2px solid rgba(16, 185, 129, 0.6)')
                          : '2px solid rgba(255, 255, 255, 0.4)'),
                      borderRadius: '20px',
                      textAlign: 'center',
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: 'white',
                      boxShadow: isSelected 
                        ? '0 0 25px rgba(239, 68, 68, 0.6), 0 4px 15px rgba(0, 0, 0, 0.15)'
                        : '0 4px 15px rgba(0, 0, 0, 0.15)',
                      minWidth: '10rem'
                    }}>
                      {player.username}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            className="btn-hover"
            style={{
              width: '100%',
              maxWidth: '400px',
              padding: '1.25rem 3rem',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              border: '3px solid rgba(255, 255, 255, 0.5)',
              borderRadius: '25px',
              fontWeight: '700',
              fontSize: '1.25rem',
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(245, 87, 108, 0.4)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            Voter 🗳️
          </button>
        </div>
      </div>
    </>
  );
}