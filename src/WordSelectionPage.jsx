import { useState, useEffect, useRef } from 'react';
import { RotateCw, Play, Trash2 } from 'lucide-react';

const wordCategories = {
  animals: [
    { word: 'Loutre', hint: 'Joueuse' },
    { word: 'Puma', hint: 'Montagne' },
    { word: 'Guépard', hint: 'Sprint' },
    { word: 'Hyène', hint: 'Charognard' },
    { word: 'Okapi', hint: 'Rayé' },
    { word: 'Tapir', hint: 'Museau' },
    { word: 'Wombat', hint: 'Terrier' },
    { word: 'Ornithorynque', hint: 'Étrange' },
    { word: 'Fennec', hint: 'Oreilles' },
    { word: 'Suricate', hint: 'Sentinelle' },

    { word: 'Narval', hint: 'Défense' },
    { word: 'Lamantin', hint: 'Paisible' },
    { word: 'Espadon', hint: 'Épée' },
    { word: 'Raie', hint: 'Aplatie' },
    { word: 'Murène', hint: 'Cachette' },
    { word: 'Esturgeon', hint: 'Ancien' },
    { word: 'Hippocampe', hint: 'Dressé' },

    { word: 'Caméléon', hint: 'Couleurs' },
    { word: 'Gecko', hint: 'Adhérence' },
    { word: 'Boa', hint: 'Constriction' },
    { word: 'Varan', hint: 'Massif' },
    { word: 'Anaconda', hint: 'Étouffement' },

    { word: 'Luciole', hint: 'Lumière' },
    { word: 'Mante', hint: 'Patience' },
    { word: 'Phasme', hint: 'Camouflage' },
    { word: 'Cigale', hint: 'Chant' },
    { word: 'Bourdon', hint: 'Vrombissement' },
    { word: 'Termite', hint: 'Colonie' },

    { word: 'Pélican', hint: 'Bec' },
    { word: 'Albatros', hint: 'Océan' },
    { word: 'Martin-pêcheur', hint: 'Plongée' },
    { word: 'Toucan', hint: 'Coloré' },
    { word: 'Cormoran', hint: 'Plongeur' },
    { word: 'Héron', hint: 'Immobilité' },

    { word: 'Yak', hint: 'Altitude' },
    { word: 'Bison', hint: 'Plaine' },
    { word: 'Antilope', hint: 'Bond' },
    { word: 'Gazelle', hint: 'Agile' },
    { word: 'Mouflon', hint: 'Montagnard' },
    { word: 'Caribou', hint: 'Migration' },

    { word: 'Lynx', hint: 'Discret' },
    { word: 'Zibeline', hint: 'Fourrure' },
    { word: 'Glouton', hint: 'Vorace' },
    { word: 'Ocelot', hint: 'Tacheté' }
  ],

  food: [
    { word: 'Grenade', hint: 'Graines' },
    { word: 'Litchi', hint: 'Coque' },
    { word: 'Papaye', hint: 'Digestif' },
    { word: 'Goyave', hint: 'Parfumée' },
    { word: 'Kaki', hint: 'Mûr' },
    { word: 'Coing', hint: 'Gelée' },
    { word: 'Cassis', hint: 'Acide' },
    { word: 'Physalis', hint: 'Enveloppe' },
    { word: 'Carambole', hint: 'Étoile' },
    { word: 'Tamarin', hint: 'Aigre' },

    { word: 'Bagel', hint: 'Anneau' },
    { word: 'Ciabatta', hint: 'Alvéolée' },
    { word: 'Naan', hint: 'Chaud' },
    { word: 'Chapati', hint: 'Fin' },
    { word: 'Bretzel', hint: 'Torsadé' },

    { word: 'Ricotta', hint: 'Crémeux' },
    { word: 'Gorgonzola', hint: 'Persillé' },
    { word: 'Pecorino', hint: 'Brebis' },
    { word: 'Mascarpone', hint: 'Lisse' },
    { word: 'Feta', hint: 'Salée' },

    { word: 'Kéfir', hint: 'Fermentation' },
    { word: 'Lait ribot', hint: 'Breton' },
    { word: 'Ayran', hint: 'Salé' },

    { word: 'Boulgour', hint: 'Concassé' },
    { word: 'Sarrasin', hint: 'Rustique' },
    { word: 'Millet', hint: 'Ancien' },
    { word: 'Orge', hint: 'Céréale' },
    { word: 'Seigle', hint: 'Dense' },

    { word: 'Canard', hint: 'Confit' },
    { word: 'Veau', hint: 'Blanc' },
    { word: 'Lapereau', hint: 'Tendre' },

    { word: 'Truite', hint: 'Rivière' },
    { word: 'Lieu', hint: 'Blanc' },
    { word: 'Bar', hint: 'Marin' },
    { word: 'Sole', hint: 'Fine' },

    { word: 'Betterave', hint: 'Terreux' },
    { word: 'Fenouil', hint: 'Anisé' },
    { word: 'Navet', hint: 'Doux' },
    { word: 'Chou-fleur', hint: 'Blanc' },
    { word: 'Panais', hint: 'Ancien' },
    { word: 'Topinambour', hint: 'Oublié' },

    { word: 'Cumin', hint: 'Chaud' },
    { word: 'Curcuma', hint: 'Jaune' },
    { word: 'Paprika', hint: 'Fumé' },
    { word: 'Cannelle', hint: 'Sucrée' },

    { word: 'Brownie', hint: 'Dense' },
    { word: 'Clafoutis', hint: 'Four' },
    { word: 'Sorbet', hint: 'Glacé' },
    { word: 'Panna cotta', hint: 'Italien' },
    { word: 'Financier', hint: 'Amande' }
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

    { word: 'Jeff', hint: 'Spécial'}
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
  ],

  fictionalCharacters: [
    // Dessins animés / Animation
    { word: 'Garfield', hint: 'Lazagne' },
    { word: 'Scooby-Doo', hint: 'Mystère' },
    { word: 'Winnie l’Ourson', hint: 'Miel' },
    { word: 'Mickey Mouse', hint: 'Icône' },
    { word: 'Donald Duck', hint: 'Colère' },
    { word: 'Bugs Bunny', hint: 'Carotte' },
    { word: 'Homer Simpson', hint: 'Donut' },
    { word: 'Bart Simpson', hint: 'Bêtise' },

    // Films / Sagas
    { word: 'Dark Vador', hint: 'Respiration' },
    { word: 'Luke Skywalker', hint: 'Héritage' },
    { word: 'Yoda', hint: 'Sagesse' },
    { word: 'Harry Potter', hint: 'Sortilège' },
    { word: 'Gandalf', hint: 'Guide' },
    { word: 'Indiana Jones', hint: 'Artefact' },
    { word: 'James Bond', hint: 'Espion' },
    { word: 'Jack Sparrow', hint: 'Rhum' },

    // Super-héros
    { word: 'Batman', hint: 'Nuit' },
    { word: 'Superman', hint: 'Invincible' },
    { word: 'Spider-Man', hint: 'Agilité' },
    { word: 'Iron Man', hint: 'Armure' },
    { word: 'Captain America', hint: 'Bouclier' },
    { word: 'Hulk', hint: 'Colère' },
    { word: 'Wonder Woman', hint: 'Amazone' },

    // Jeux vidéo
    { word: 'Mario', hint: 'Plombier' },
    { word: 'Luigi', hint: 'Ombre' },
    { word: 'Sonic', hint: 'Vitesse' },
    { word: 'Pikachu', hint: 'Électricité' },

    // Séries / autres
    { word: 'Sherlock Holmes', hint: 'Déduction' },

    // Classiques
    { word: 'Peter Pan', hint: 'Enfance' },
    { word: 'Pinocchio', hint: 'Mensonge' },
    { word: 'Le Petit Prince', hint: 'Planète' },

    { word: 'Shrek', hint: 'Marais' },
    { word: 'Kung Fu Panda', hint: 'Paix' },
    { word: 'Simba', hint: 'Destin' },
    { word: 'Scar', hint: 'Trahison' },
    { word: 'Buzz l’Éclair', hint: 'Infini' },
    { word: 'Woody', hint: 'Cowboy' },
    { word: 'Nemo', hint: 'Océan' },
    { word: 'Dory', hint: 'Mémoire' },

    // Films / séries cultes
    { word: 'Terminator', hint: 'Futur' },
    { word: 'Rocky Balboa', hint: 'Persévérance' },
    { word: 'Forrest Gump', hint: 'Course' },

    // Classiques supplémentaires
    { word: 'Dracula', hint: 'Immortel' },
    { word: 'Frankenstein', hint: 'Créature' },
    { word: 'Zorro', hint: 'Masque' },
    { word: 'Tarzan', hint: 'Jungle' },
    { word: 'Hercule', hint: 'Force' },
    { word: 'Achille', hint: 'Faiblesse' },
    { word: 'Ulysse', hint: 'Voyage' },

    { word: 'Olaf', hint: 'Été' },
    { word: 'Aladdin', hint: 'Vœux' },
    { word: 'Mulan', hint: 'Honneur' },
    { word: 'Stitch', hint: 'Ohana' },
    { word: 'Wall-E', hint: 'Solitude' },
    { word: 'Ratatouille', hint: 'Cuisine' },

    // Star Wars (encore)
    { word: 'Chewbacca', hint: 'Loyal' },
    { word: 'R2-D2', hint: 'Astromech' },

    // Jeux vidéo (encore)
    { word: 'Donkey Kong', hint: 'Jungle' },
    { word: 'Bowser', hint: 'Rivalité' },

    // Classiques universels
    { word: 'Robin des Bois', hint: 'Justice' },
    { word: 'Le Chat Botté', hint: 'Ruse' },
    { word: 'Cendrillon', hint: 'Minuit' },
    { word: 'Blanche-Neige', hint: 'Pomme' },
    { word: 'La Belle et la Bête', hint: 'Malédiction' },
  ]
};

function getRandomWord(categories = ['animals', 'food', 'objects', 'places', 'jobs', 'sports', 'countries', 'celebrities', 'brands', 'fictionalCharacters']) {
  const allWords = [];
  categories.forEach(c => {
    if (wordCategories[c]) {
      wordCategories[c].forEach(item => allWords.push({ ...item, category: c }));
    }
  });
  return allWords.length > 0 ? allWords[Math.floor(Math.random() * allWords.length)] : { word: 'Pomme', hint: 'Fruit', category: 'food' };
}

function getRandomWordFromCategory(category) {
  if (!wordCategories[category] || wordCategories[category].length === 0) {
    return { word: 'Pomme', hint: 'Fruit', category: 'food' };
  }
  const words = wordCategories[category];
  const randomWord = words[Math.floor(Math.random() * words.length)];
  return { ...randomWord, category };
}

export default function WordSelectionPage({ players = [], currentUser, onConfirm, lobbyId, database, imposterId }) {
  const [particles, setParticles] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [generatedWord, setGeneratedWord] = useState('');
  const [imposterWord, setImposterWord] = useState('');
  const [hint, setHint] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [startingPlayer, setStartingPlayer] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(['animals', 'food', 'objects', 'places', 'jobs', 'sports', 'countries', 'celebrities', 'brands', 'fictionalCharacters']);
  const [inTheDarkMode, setInTheDarkMode] = useState(false);
  const [drawingBoardEnabled, setDrawingBoardEnabled] = useState(false);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [showCover, setShowCover] = useState(true);
  const [lastGeneratedAt, setLastGeneratedAt] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  
  // Drawing pad state
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const drawingTimeoutRef = useRef(null);
  
  const sortedPlayers = [...players].sort((a, b) => a.joinedAt - b.joinedAt);
  const isFirstPlayer = sortedPlayers.length > 0 && currentUser && sortedPlayers[0].id === currentUser.firebaseId;
  const isImposter = currentUser && imposterId && currentUser.firebaseId === imposterId;

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i, left: Math.random() * 100, size: Math.random() * 4 + 2,
          duration: Math.random() * 10 + 15, delay: Math.random() * -20, opacity: Math.random() * 0.3 + 0.1
        });
      }
      setParticles(newParticles);
    };
    generateParticles();
  }, []);

  // Load settings
  useEffect(() => {
    if (!database || !lobbyId) return;
    const { ref, onValue } = database;
    
    const categoriesRef = ref(database.db, `lobbies/${lobbyId}/selectedCategories`);
    const gameModeRef = ref(database.db, `lobbies/${lobbyId}/inTheDarkMode`);
    const drawingBoardRef = ref(database.db, `lobbies/${lobbyId}/drawingBoardEnabled`);

    const unsubCat = onValue(categoriesRef, (s) => {
      const d = s.val();
      if (d && Array.isArray(d) && d.length > 0) setSelectedCategories(d);
      setCategoriesLoaded(true);
    });

    const unsubMode = onValue(gameModeRef, (s) => {
      const d = s.val();
      if (d !== null) setInTheDarkMode(d);
    });

    const unsubDrawing = onValue(drawingBoardRef, (s) => {
      const d = s.val();
      if (d !== null) setDrawingBoardEnabled(d);
    });

    return () => { unsubCat(); unsubMode(); unsubDrawing(); };
  }, [database, lobbyId]);

  // Generate and sync words
  useEffect(() => {
    if (!database || !lobbyId || !categoriesLoaded) return;
    const { ref, onValue, set } = database;
    const wordRef = ref(database.db, `lobbies/${lobbyId}/currentWord`);

    const unsub = onValue(wordRef, async (s) => {
      const d = s.val();
      if (d && d.word) {
        // Check if the word was refreshed (new timestamp)
        if (d.generatedAt && lastGeneratedAt && d.generatedAt !== lastGeneratedAt) {
          setShowCover(true);
        }
        
        setGeneratedWord(d.word);
        setImposterWord(d.imposterWord || '');
        setHint(d.hint || '');
        setCategory(d.category || '');
        setStartingPlayer(d.startingPlayer || null);
        setLastGeneratedAt(d.generatedAt);
        setLoading(false);
        setIsRefreshing(false);
      } else {
        const mainWord = getRandomWord(selectedCategories);
        
        // Generate a different word for imposter from the SAME category
        let impWord = getRandomWordFromCategory(mainWord.category);
        let attempts = 0;
        while (impWord.word === mainWord.word && attempts < 10) {
          impWord = getRandomWordFromCategory(mainWord.category);
          attempts++;
        }
        
        const randPlayer = players[Math.floor(Math.random() * players.length)];
        const timestamp = Date.now();
        
        await set(wordRef, {
          word: mainWord.word,
          imposterWord: impWord.word,
          hint: mainWord.hint,
          category: mainWord.category,
          startingPlayer: randPlayer ? randPlayer.username : null,
          generatedAt: timestamp
        });
        
        setLastGeneratedAt(timestamp);
      }
    });
    return () => unsub();
  }, [database, lobbyId, players, selectedCategories, categoriesLoaded, lastGeneratedAt]);

  // Drawing pad - sync canvas data
  useEffect(() => {
    if (!database || !lobbyId || !canvasRef.current) return;
    
    const { ref, onValue } = database;
    const drawingRef = ref(database.db, `lobbies/${lobbyId}/drawing`);
    
    const unsub = onValue(drawingRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.imageData) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        };
        img.src = data.imageData;
      } else {
        // If no data in Firebase, clear the canvas
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
    });
    
    return () => unsub();
  }, [database, lobbyId]);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 600;
    canvas.height = 400;
    
    // Set white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Clear drawing board when player votes (leaves page)
  useEffect(() => {
    if (hasVoted && database && lobbyId) {
      clearDrawingBoard();
    }
  }, [hasVoted, database, lobbyId]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    if (e.touches && e.touches[0]) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
    
    // Debounced sync to Firebase
    if (drawingTimeoutRef.current) {
      clearTimeout(drawingTimeoutRef.current);
    }
    
    drawingTimeoutRef.current = setTimeout(() => {
      syncCanvas();
    }, 100);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      syncCanvas();
    }
  };

  const syncCanvas = async () => {
    if (!database || !lobbyId || !canvasRef.current) return;
    
    const { ref, set } = database;
    const drawingRef = ref(database.db, `lobbies/${lobbyId}/drawing`);
    const imageData = canvasRef.current.toDataURL();
    
    await set(drawingRef, {
      imageData,
      updatedAt: Date.now()
    });
  };

  const clearDrawingBoard = async () => {
    if (!database || !lobbyId) return;
    
    // Clear canvas locally
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    
    // Clear in Firebase
    const { ref, set } = database;
    const drawingRef = ref(database.db, `lobbies/${lobbyId}/drawing`);
    await set(drawingRef, null);
  };

  const handleRefresh = async () => {
    if (!database || !lobbyId || isRefreshing) return;
    setIsRefreshing(true);
    
    const { ref, set } = database;
    const wordRef = ref(database.db, `lobbies/${lobbyId}/currentWord`);
    const imposterRef = ref(database.db, `lobbies/${lobbyId}/gameState/imposterId`);
    
    const mainWord = getRandomWord(selectedCategories);
    
    // Generate a different word for imposter from the SAME category
    let impWord = getRandomWordFromCategory(mainWord.category);
    let attempts = 0;
    while (impWord.word === mainWord.word && attempts < 10) {
      impWord = getRandomWordFromCategory(mainWord.category);
      attempts++;
    }
    
    const randPlayer = players[Math.floor(Math.random() * players.length)];
    const randImposter = players[Math.floor(Math.random() * players.length)];
    
    await set(wordRef, {
      word: mainWord.word,
      imposterWord: impWord.word,
      hint: mainWord.hint,
      category: mainWord.category,
      startingPlayer: randPlayer ? randPlayer.username : null,
      generatedAt: Date.now()
    });
    
    await set(imposterRef, randImposter ? randImposter.id : null);
    
    // Clear the drawing board when refreshing
    await clearDrawingBoard();
  };

  const handleConfirm = () => {
    if (!selectedPlayer) {
      alert('Vous devez choisir un joueur!');
      return;
    }
    setHasVoted(true);
    if (onConfirm) onConfirm({ selectedPlayer, word: generatedWord, hint, category });
  };

  const handleReveal = () => setShowCover(false);

  // Display word logic
  const displayWord = (isImposter && inTheDarkMode) ? imposterWord : generatedWord;
  const showHintOnly = isImposter && !inTheDarkMode;

  const colors = ['#000000', '#ffffff', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes drift {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.5), 0 0 40px rgba(239, 68, 68, 0.3); }
          50% { box-shadow: 0 0 30px rgba(239, 68, 68, 0.7), 0 0 60px rgba(239, 68, 68, 0.5); }
        }
        @keyframes fadeOut { from { opacity: 1; visibility: visible; } to { opacity: 0; visibility: hidden; } }
        @keyframes scaleUp { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .btn-hover { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .btn-hover:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); }
        .btn-hover:disabled:hover { transform: none; }
        .player-card { transition: all 0.3s ease; }
        .player-card:not(.disabled):hover { transform: translateX(5px); }
        .cover-fade-out { animation: fadeOut 0.5s ease-out forwards; }
        .color-btn { 
          transition: all 0.2s ease; 
          cursor: pointer;
        }
        .color-btn:hover { 
          transform: scale(1.1); 
        }
        .color-btn.active {
          transform: scale(1.2);
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.5);
        }
      `}</style>
      
      {showCover && (
        <div onClick={handleReveal} className={!showCover ? 'cover-fade-out' : ''}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, cursor: 'pointer'
          }}>
          <div style={{ textAlign: 'center', animation: 'scaleUp 0.6s ease-out', padding: '2rem' }}>
            <div style={{ fontSize: '5rem', marginBottom: '2rem', filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3))' }}>🔒</div>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.25rem', marginBottom: '3rem', maxWidth: '500px', margin: '0 auto 3rem auto' }}>
              👆 Cliquez n'importe où pour révéler
            </p>
          </div>
        </div>
      )}
      
      <div style={{ 
        minHeight: '100vh', width: '100vw', margin: '0',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', 
        display: 'flex', flexDirection: 'column', alignItems: 'center', 
        padding: '2rem', paddingBottom: '3rem', boxSizing: 'border-box', position: 'relative', overflow: 'hidden'
      }}>
        
        {particles.map(p => (
          <div key={p.id} style={{
            position: 'absolute', left: `${p.left}%`, bottom: '-20px', width: `${p.size}px`, height: `${p.size}px`,
            borderRadius: '50%', backgroundColor: `rgba(255, 255, 255, ${p.opacity})`,
            animation: `drift ${p.duration}s linear ${p.delay}s infinite`, pointerEvents: 'none'
          }} />
        ))}
        
        <div style={{ 
          width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', 
          gap: '2rem', position: 'relative', zIndex: 10, marginTop: '2rem', animation: 'fadeInUp 0.6s ease-out'
        }}>
        
          <h1 style={{
            textAlign: 'center', color: 'white', fontSize: '2rem', fontWeight: '700',
            textShadow: '0 4px 15px rgba(0, 0, 0, 0.3)', marginBottom: '-1rem'
          }}>
            {showHintOnly ? '😈 Vous êtes l\'Imposteur!' : '🎯 Votre Mot'}
          </h1>

          <div style={{
            width: '100%', padding: '2.5rem 2rem',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px)',
            border: '3px solid rgba(255, 255, 255, 0.4)',
            borderRadius: '30px', textAlign: 'center', fontSize: '2rem', fontWeight: '700', color: 'white',
            minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '1rem', position: 'relative',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)'
          }}>
            {isFirstPlayer && (
              <button onClick={handleRefresh} disabled={isRefreshing || loading} className="btn-hover"
                style={{
                  position: 'absolute', top: '1rem', right: '1rem',
                  background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.4)', borderRadius: '50%',
                  width: '45px', height: '45px', cursor: isRefreshing || loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: isRefreshing || loading ? 0.5 : 1, padding: 0
                }}>
                <RotateCw size={22} color="white" strokeWidth={2}
                  style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
              </button>
            )}

            {loading ? (
              <div style={{ fontSize: '1.25rem' }}>Chargement...</div>
            ) : (
              <>
                {showHintOnly ? (
                  <div style={{ 
                    fontSize: '1.125rem', padding: '0.75rem 1.5rem',
                    background: 'rgba(255, 255, 255, 0.15)', borderRadius: '15px', backdropFilter: 'blur(10px)'
                  }}>
                    💡 Indice: {hint}
                  </div>
                ) : (
                  <div style={{ fontSize: '2.5rem', textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)' }}>
                    {displayWord}
                  </div>
                )}
                {startingPlayer && (
                  <div style={{ 
                    fontSize: '1rem', opacity: 0.9, padding: '0.5rem 1rem',
                    background: 'rgba(255, 255, 255, 0.15)', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', gap: '0.5rem'
                  }}>
                    <Play size={18} fill="white" />
                    {startingPlayer} commence
                  </div>
                )}
              </>
            )}
          </div>

          {/* Drawing Pad */}
          {drawingBoardEnabled && (
            <div style={{
              width: '100%', background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(20px)',
              borderRadius: '30px', border: '2px solid rgba(255, 255, 255, 0.3)',
              padding: '1.5rem', boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <h2 style={{
                  color: 'white', fontSize: '1.25rem', fontWeight: '600',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                }}>
                  🎨 Tableau de Dessin
                </h2>
              </div>

              {/* Color palette */}
              <div style={{ 
                display: 'flex', 
                gap: '0.75rem', 
                marginBottom: '1rem',
                justifyContent: 'center'
              }}>
                {colors.map(color => (
                  <div
                    key={color}
                    className={`color-btn ${currentColor === color ? 'active' : ''}`}
                    onClick={() => setCurrentColor(color)}
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      backgroundColor: color,
                      border: color === '#ffffff' 
                        ? '3px solid rgba(100, 100, 100, 0.8)' 
                        : '3px solid rgba(255, 255, 255, 0.5)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                    }}
                  />
                ))}
              </div>

              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '400px',
                  border: '3px solid rgba(255, 255, 255, 0.4)',
                  borderRadius: '15px',
                  cursor: 'crosshair',
                  touchAction: 'none',
                  display: 'block',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>
          )}

          <div style={{
            width: '100%', background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(20px)',
            borderRadius: '30px', border: '2px solid rgba(255, 255, 255, 0.3)',
            padding: '2rem 1.5rem', boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <h2 style={{
              color: 'white', fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem',
              textAlign: 'center', textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
            }}>
              Qui est l'Imposteur?
            </h2>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {players.map((p, i) => {
                const isCurrent = currentUser && p.id === currentUser.firebaseId;
                const isSelected = selectedPlayer && selectedPlayer.id === p.id;
                const cannotSelect = isCurrent;
                
                return (
                  <div key={p.id} onClick={() => !cannotSelect && setSelectedPlayer(p)}
                    className={`player-card ${cannotSelect ? 'disabled' : ''}`}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      cursor: cannotSelect ? 'not-allowed' : 'pointer',
                      padding: '0.5rem', opacity: cannotSelect ? 0.5 : 1
                    }}>
                    <div style={{
                      width: '70px', height: '70px', borderRadius: '50%', overflow: 'hidden',
                      border: isCurrent 
                        ? '3px solid rgba(16, 185, 129, 0.8)'
                        : '3px solid rgba(255, 255, 255, 0.6)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)', flexShrink: 0,
                      boxShadow: isCurrent 
                        ? '0 0 20px rgba(16, 185, 129, 0.5)'
                        : '0 4px 15px rgba(0, 0, 0, 0.2)'
                    }}>
                      <img src={p.photo} alt={p.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <div style={{
                      flex: 1, padding: '1rem 1.5rem',
                      background: isCurrent 
                        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.3) 100%)'
                        : 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      border: isSelected 
                        ? '3px solid #ef4444'
                        : (isCurrent 
                          ? '2px solid rgba(16, 185, 129, 0.6)'
                          : '2px solid rgba(255, 255, 255, 0.4)'),
                      borderRadius: '20px', textAlign: 'center', fontSize: '1.125rem', fontWeight: '600', color: 'white',
                      boxShadow: isSelected 
                        ? '0 0 25px rgba(239, 68, 68, 0.6), 0 4px 15px rgba(0, 0, 0, 0.15)'
                        : '0 4px 15px rgba(0, 0, 0, 0.15)',
                      minWidth: '10rem'
                    }}>
                      {p.username}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button onClick={handleConfirm} className="btn-hover" disabled={hasVoted}
            style={{
              width: '100%', maxWidth: '400px', padding: '1.25rem 3rem',
              background: hasVoted 
                ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
                : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              border: '3px solid rgba(255, 255, 255, 0.5)', borderRadius: '25px',
              fontWeight: '700', fontSize: '1.25rem', color: 'white', 
              cursor: hasVoted ? 'not-allowed' : 'pointer',
              boxShadow: hasVoted 
                ? '0 10px 30px rgba(100, 116, 139, 0.4)'
                : '0 10px 30px rgba(245, 87, 108, 0.4)',
              textTransform: 'uppercase', letterSpacing: '1px',
              opacity: hasVoted ? 0.6 : 1
            }}>
            {hasVoted ? 'Vote Enregistré ✓' : 'Voter 🗳️'}
          </button>
        </div>
      </div>
    </>
  );
}