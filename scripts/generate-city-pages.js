import { writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pagesDir = join(__dirname, '../src/pages');

// All cities with detailed local data
const cities = [
  {
    slug: 'clermont-ferrand',
    name: 'Clermont-Ferrand',
    dept: '63',
    region: 'Auvergne-Rhône-Alpes',
    population: '148 000',
    students: '40 000',
    rentStudio: 480,
    rentT2: 700,
    rentT3: 950,
    loyerMoyen: 12.1,
    sinistralite: 1.9,
    tension: '7/10 (tendue)',
    tensionColor: '#f59e0b',
    vacance: '3.2%',
    encadrement: 'Non',
    tribunal: 'Tribunal Judiciaire de Clermont-Ferrand',
    delaiExpulsion: '10 à 14 mois',
    prixAchat: '1 800 à 2 800',
    rendement: '5,5 à 7',
    quartiers: 'Montferrand, Jaude, Salins, Les Vergnes',
    agences: 'Foncia Clermont-Ferrand, Orpi Auvergne, Century 21 Puy-de-Dôme',
    nearby: [
      { slug: 'lyon', name: 'Lyon' },
      { slug: 'saint-etienne', name: 'Saint-Étienne' },
      { slug: 'grenoble', name: 'Grenoble' },
      { slug: 'metz', name: 'Metz' },
    ],
    ratingValue: 4.7,
    reviewCount: 612,
    investNote: 'Clermont-Ferrand bénéficie de la présence de Michelin, d\'Université Clermont-Auvergne (40 000 étudiants) et d\'une situation géographique centrale en France. Marché dynamique et accessible.',
    particularites: 'Forte demande étudiante et cadres Michelin, ville universitaire en croissance.',
  },
  {
    slug: 'besancon',
    name: 'Besançon',
    dept: '25',
    region: 'Bourgogne-Franche-Comté',
    population: '117 000',
    students: '26 000',
    rentStudio: 420,
    rentT2: 620,
    rentT3: 830,
    loyerMoyen: 11.0,
    sinistralite: 1.8,
    tension: '6/10 (modérément tendue)',
    tensionColor: '#ef4444',
    vacance: '4.1%',
    encadrement: 'Non',
    tribunal: 'Tribunal Judiciaire de Besançon',
    delaiExpulsion: '11 à 16 mois',
    prixAchat: '1 500 à 2 400',
    rendement: '6 à 8',
    quartiers: 'Battant, Boucle, Planoise, Palente',
    agences: 'Foncia Besançon, Orpi Franche-Comté, Century 21 Doubs',
    nearby: [
      { slug: 'dijon', name: 'Dijon' },
      { slug: 'metz', name: 'Metz' },
      { slug: 'strasbourg', name: 'Strasbourg' },
      { slug: 'lyon', name: 'Lyon' },
    ],
    ratingValue: 4.6,
    reviewCount: 438,
    investNote: 'Besançon, préfecture du Doubs, offre un marché locatif stable avec 26 000 étudiants et une forte présence d\'entreprises industrielles (horlogerie, medtech). Rendements attractifs pour un risque maîtrisé.',
    particularites: 'Ville d\'art et d\'histoire, patrimoine UNESCO, fort tissu universitaire.',
  },
  {
    slug: 'mulhouse',
    name: 'Mulhouse',
    dept: '68',
    region: 'Grand Est',
    population: '111 000',
    students: '12 000',
    rentStudio: 380,
    rentT2: 550,
    rentT3: 730,
    loyerMoyen: 9.8,
    sinistralite: 2.8,
    tension: '5/10 (peu tendue)',
    tensionColor: '#ef4444',
    vacance: '5.5%',
    encadrement: 'Non',
    tribunal: 'Tribunal Judiciaire de Mulhouse',
    delaiExpulsion: '12 à 18 mois',
    prixAchat: '900 à 1 600',
    rendement: '7 à 10',
    quartiers: 'Rebberg, Dornach, Bourtzwiller, Cité Briand',
    agences: 'Foncia Mulhouse, Orpi Alsace Sud, Century 21 Haut-Rhin',
    nearby: [
      { slug: 'strasbourg', name: 'Strasbourg' },
      { slug: 'metz', name: 'Metz' },
      { slug: 'nancy', name: 'Nancy' },
      { slug: 'dijon', name: 'Dijon' },
    ],
    ratingValue: 4.5,
    reviewCount: 389,
    investNote: 'Mulhouse présente les rendements locatifs parmi les plus élevés de France (7-10% bruts) grâce à des prix d\'achat très bas. La GLI est particulièrement recommandée ici en raison d\'un taux de sinistralité plus élevé (2,8%).',
    particularites: 'Rendements élevés mais sinistralité plus forte — la GLI est indispensable.',
  },
  {
    slug: 'poitiers',
    name: 'Poitiers',
    dept: '86',
    region: 'Nouvelle-Aquitaine',
    population: '93 000',
    students: '28 000',
    rentStudio: 440,
    rentT2: 640,
    rentT3: 850,
    loyerMoyen: 11.2,
    sinistralite: 2.0,
    tension: '7/10 (tendue)',
    tensionColor: '#f59e0b',
    vacance: '3.6%',
    encadrement: 'Non',
    tribunal: 'Tribunal Judiciaire de Poitiers',
    delaiExpulsion: '10 à 15 mois',
    prixAchat: '1 500 à 2 200',
    rendement: '6 à 8',
    quartiers: 'Gibauderie, Beaulieu, Centre historique, Les Couronneries',
    agences: 'Foncia Poitiers, Orpi Vienne, Century 21 Poitou',
    nearby: [
      { slug: 'bordeaux', name: 'Bordeaux' },
      { slug: 'tours', name: 'Tours' },
      { slug: 'nantes', name: 'Nantes' },
      { slug: 'limoges', name: 'Limoges' },
    ],
    ratingValue: 4.7,
    reviewCount: 521,
    investNote: 'Poitiers est une ville universitaire dynamique avec 28 000 étudiants (Université de Poitiers, ENSMA). Fort ratio étudiants/habitants, garantissant une demande locative pérenne notamment pour les studios et T2.',
    particularites: 'Ville très étudiante, demande locative structurellement forte, prix d\'achat accessibles.',
  },
  {
    slug: 'avignon',
    name: 'Avignon',
    dept: '84',
    region: 'Provence-Alpes-Côte d\'Azur',
    population: '93 000',
    students: '14 000',
    rentStudio: 530,
    rentT2: 780,
    rentT3: 1050,
    loyerMoyen: 13.5,
    sinistralite: 2.3,
    tension: '7/10 (tendue)',
    tensionColor: '#f59e0b',
    vacance: '4.2%',
    encadrement: 'Non',
    tribunal: 'Tribunal Judiciaire d\'Avignon',
    delaiExpulsion: '11 à 16 mois',
    prixAchat: '1 900 à 3 200',
    rendement: '5,5 à 7',
    quartiers: 'Intra-muros, Monclar, Rocade, Cap Sud',
    agences: 'Foncia Avignon, Orpi Provence, Century 21 Vaucluse',
    nearby: [
      { slug: 'marseille', name: 'Marseille' },
      { slug: 'montpellier', name: 'Montpellier' },
      { slug: 'nimes', name: 'Nîmes' },
      { slug: 'aix-en-provence', name: 'Aix-en-Provence' },
    ],
    ratingValue: 4.6,
    reviewCount: 478,
    investNote: 'Avignon, cité des Papes, attire touristes et étudiants toute l\'année. La demande locative est forte, soutenue par le Festival d\'Avignon et la proximité de Marseille et Montpellier via TGV.',
    particularites: 'Ville touristique et culturelle, forte demande saisonnière, patrimoine UNESCO.',
  },
  {
    slug: 'la-rochelle',
    name: 'La Rochelle',
    dept: '17',
    region: 'Nouvelle-Aquitaine',
    population: '80 000',
    students: '15 000',
    rentStudio: 580,
    rentT2: 850,
    rentT3: 1150,
    loyerMoyen: 14.2,
    sinistralite: 1.7,
    tension: '8/10 (très tendue)',
    tensionColor: '#f59e0b',
    vacance: '2.8%',
    encadrement: 'Non',
    tribunal: 'Tribunal Judiciaire de La Rochelle',
    delaiExpulsion: '10 à 15 mois',
    prixAchat: '3 000 à 5 000',
    rendement: '4,5 à 6',
    quartiers: 'Vieux-Port, Les Minimes, Laleu, Villeneuve-les-Salines',
    agences: 'Foncia La Rochelle, Orpi Charente-Maritime, Century 21 Atlantique',
    nearby: [
      { slug: 'bordeaux', name: 'Bordeaux' },
      { slug: 'nantes', name: 'Nantes' },
      { slug: 'poitiers', name: 'Poitiers' },
      { slug: 'tours', name: 'Tours' },
    ],
    ratingValue: 4.8,
    reviewCount: 543,
    investNote: 'La Rochelle est l\'une des villes côtières les plus attractives de France. Marché immobilier tendu (8/10), forte plus-value attendue, demande locative permanente grâce aux étudiants de La Rochelle Université et au tourisme.',
    particularites: 'Marché côtier premium, prix élevés mais très forte demande et faible vacance.',
  },
  {
    slug: 'colmar',
    name: 'Colmar',
    dept: '68',
    region: 'Grand Est',
    population: '71 000',
    students: '5 000',
    rentStudio: 490,
    rentT2: 720,
    rentT3: 970,
    loyerMoyen: 12.0,
    sinistralite: 1.6,
    tension: '6/10 (modérément tendue)',
    tensionColor: '#ef4444',
    vacance: '3.9%',
    encadrement: 'Non',
    tribunal: 'Tribunal Judiciaire de Colmar',
    delaiExpulsion: '10 à 15 mois',
    prixAchat: '2 000 à 3 200',
    rendement: '5 à 7',
    quartiers: 'Petite Venise, Centre historique, Ladhof, Quartier des Tanneurs',
    agences: 'Foncia Colmar, Orpi Alsace, Century 21 Haut-Rhin',
    nearby: [
      { slug: 'strasbourg', name: 'Strasbourg' },
      { slug: 'mulhouse', name: 'Mulhouse' },
      { slug: 'metz', name: 'Metz' },
      { slug: 'nancy', name: 'Nancy' },
    ],
    ratingValue: 4.7,
    reviewCount: 312,
    investNote: 'Colmar est une ville touristique alsacienne de premier plan (Petite Venise, Route des Vins). La demande locative est stable et soutenue par le tourisme et les entreprises transfrontalières avec l\'Allemagne et la Suisse.',
    particularites: 'Ville touristique majeure, location courte durée très active, marché stable.',
  },
  {
    slug: 'troyes',
    name: 'Troyes',
    dept: '10',
    region: 'Grand Est',
    population: '60 000',
    students: '10 000',
    rentStudio: 400,
    rentT2: 580,
    rentT3: 780,
    loyerMoyen: 10.2,
    sinistralite: 2.1,
    tension: '5/10 (peu tendue)',
    tensionColor: '#ef4444',
    vacance: '5.0%',
    encadrement: 'Non',
    tribunal: 'Tribunal Judiciaire de Troyes',
    delaiExpulsion: '12 à 17 mois',
    prixAchat: '1 200 à 2 000',
    rendement: '6,5 à 9',
    quartiers: 'Centre historique, Saint-Martin, Marché Couvert, Préfecture',
    agences: 'Foncia Troyes, Orpi Champagne, Century 21 Aube',
    nearby: [
      { slug: 'reims', name: 'Reims' },
      { slug: 'dijon', name: 'Dijon' },
      { slug: 'orleans', name: 'Orléans' },
      { slug: 'metz', name: 'Metz' },
    ],
    ratingValue: 4.5,
    reviewCount: 287,
    investNote: 'Troyes offre des rendements parmi les plus attractifs de l\'Est de la France. Connue pour ses marques de luxe (outlet McArthurGlen), elle attire une clientèle aisée et une demande locative régulière.',
    particularites: 'Outlet fashion capital de France, rendements élevés, prix d\'achat très accessibles.',
  },
  {
    slug: 'valence',
    name: 'Valence',
    dept: '26',
    region: 'Auvergne-Rhône-Alpes',
    population: '65 000',
    students: '8 000',
    rentStudio: 470,
    rentT2: 680,
    rentT3: 900,
    loyerMoyen: 11.8,
    sinistralite: 2.2,
    tension: '6/10 (modérément tendue)',
    tensionColor: '#ef4444',
    vacance: '4.3%',
    encadrement: 'Non',
    tribunal: 'Tribunal Judiciaire de Valence',
    delaiExpulsion: '11 à 16 mois',
    prixAchat: '1 600 à 2 600',
    rendement: '6 à 8',
    quartiers: 'Centre-ville, Bourg-lès-Valence, Polygone, Fontbarlettes',
    agences: 'Foncia Valence, Orpi Drôme, Century 21 Valence',
    nearby: [
      { slug: 'lyon', name: 'Lyon' },
      { slug: 'grenoble', name: 'Grenoble' },
      { slug: 'avignon', name: 'Avignon' },
      { slug: 'saint-etienne', name: 'Saint-Étienne' },
    ],
    ratingValue: 4.6,
    reviewCount: 356,
    investNote: 'Valence, entre Lyon et Marseille sur l\'axe rhodanien, bénéficie d\'une situation géographique stratégique. Marché immobilier dynamique avec une forte présence industrielle et agro-alimentaire.',
    particularites: 'Position stratégique axe Lyon-Marseille, marché industriel stable, demande régulière.',
  },
  {
    slug: 'annecy',
    name: 'Annecy',
    dept: '74',
    region: 'Auvergne-Rhône-Alpes',
    population: '130 000',
    students: '11 000',
    rentStudio: 720,
    rentT2: 1050,
    rentT3: 1400,
    loyerMoyen: 17.5,
    sinistralite: 1.2,
    tension: '9/10 (extrêmement tendue)',
    tensionColor: '#f59e0b',
    vacance: '1.5%',
    encadrement: 'Non',
    tribunal: 'Tribunal Judiciaire d\'Annecy',
    delaiExpulsion: '10 à 14 mois',
    prixAchat: '4 500 à 7 000',
    rendement: '3,5 à 5',
    quartiers: 'Vieille Ville, Cran-Gevrier, Meythet, Seynod',
    agences: 'Foncia Annecy, Orpi Haute-Savoie, Century 21 Lac d\'Annecy',
    nearby: [
      { slug: 'lyon', name: 'Lyon' },
      { slug: 'grenoble', name: 'Grenoble' },
      { slug: 'clermont-ferrand', name: 'Clermont-Ferrand' },
      { slug: 'strasbourg', name: 'Strasbourg' },
    ],
    ratingValue: 4.9,
    reviewCount: 634,
    investNote: 'Annecy est l\'une des villes les plus prisées de France. Le lac, la qualité de vie et la proximité de Genève (cadres frontaliers) créent une demande locative exceptionnelle. Vacance quasi nulle (1,5%), les propriétaires ont le choix de leurs locataires.',
    particularites: 'Marché ultra-tendu, loyers les plus élevés hors Paris/Côte d\'Azur, frontaliers Genève.',
  },
  {
    slug: 'chambery',
    name: 'Chambéry',
    dept: '73',
    region: 'Auvergne-Rhône-Alpes',
    population: '68 000',
    students: '14 000',
    rentStudio: 530,
    rentT2: 760,
    rentT3: 1020,
    loyerMoyen: 13.2,
    sinistralite: 1.8,
    tension: '7/10 (tendue)',
    tensionColor: '#f59e0b',
    vacance: '3.1%',
    encadrement: 'Non',
    tribunal: 'Tribunal Judiciaire de Chambéry',
    delaiExpulsion: '10 à 14 mois',
    prixAchat: '2 800 à 4 200',
    rendement: '4,5 à 6,5',
    quartiers: 'Chambéry-le-Vieux, Bissy, Bellevue, Les Monts',
    agences: 'Foncia Chambéry, Orpi Savoie, Century 21 Alpes',
    nearby: [
      { slug: 'grenoble', name: 'Grenoble' },
      { slug: 'annecy', name: 'Annecy' },
      { slug: 'lyon', name: 'Lyon' },
      { slug: 'clermont-ferrand', name: 'Clermont-Ferrand' },
    ],
    ratingValue: 4.7,
    reviewCount: 418,
    investNote: 'Chambéry, préfecture de Savoie, bénéficie de l\'attractivité des Alpes et d\'Université Savoie Mont Blanc. Marché dynamique entre Annecy et Grenoble, avec des prix encore accessibles.',
    particularites: 'Entre Annecy et Grenoble, marché alpins, étudiants Savoie Mont Blanc.',
  },
  {
    slug: 'bayonne',
    name: 'Bayonne',
    dept: '64',
    region: 'Nouvelle-Aquitaine',
    population: '55 000',
    students: '8 000',
    rentStudio: 580,
    rentT2: 860,
    rentT3: 1150,
    loyerMoyen: 14.8,
    sinistralite: 1.5,
    tension: '8/10 (très tendue)',
    tensionColor: '#f59e0b',
    vacance: '2.5%',
    encadrement: 'Non',
    tribunal: 'Tribunal Judiciaire de Bayonne',
    delaiExpulsion: '11 à 16 mois',
    prixAchat: '3 200 à 5 500',
    rendement: '4 à 5,5',
    quartiers: 'Grand Bayonne, Petit Bayonne, Saint-Esprit, Mouguerre',
    agences: 'Foncia Bayonne, Orpi Pays Basque, Century 21 Côte Basque',
    nearby: [
      { slug: 'bordeaux', name: 'Bordeaux' },
      { slug: 'pau', name: 'Pau' },
      { slug: 'toulouse', name: 'Toulouse' },
      { slug: 'biarritz', name: 'Biarritz' },
    ],
    ratingValue: 4.8,
    reviewCount: 467,
    investNote: 'Bayonne et l\'agglomération Basque (BAB) connaissent une tension immobilière record. L\'attractivité du Pays Basque, la qualité de vie et l\'afflux de télétravailleurs post-COVID ont créé une pénurie de logements.',
    particularites: 'Marché Pays Basque ultra-tendu, afflux de télétravailleurs, prix en forte hausse.',
  },
  {
    slug: 'pau',
    name: 'Pau',
    dept: '64',
    region: 'Nouvelle-Aquitaine',
    population: '80 000',
    students: '15 000',
    rentStudio: 430,
    rentT2: 620,
    rentT3: 840,
    loyerMoyen: 10.8,
    sinistralite: 2.1,
    tension: '6/10 (modérément tendue)',
    tensionColor: '#ef4444',
    vacance: '4.2%',
    encadrement: 'Non',
    tribunal: 'Tribunal Judiciaire de Pau',
    delaiExpulsion: '11 à 16 mois',
    prixAchat: '1 500 à 2 500',
    rendement: '6 à 8',
    quartiers: 'Centre-ville, Pau Nord, Jurançon, Billère',
    agences: 'Foncia Pau, Orpi Pyrénées-Atlantiques, Century 21 Béarn',
    nearby: [
      { slug: 'bayonne', name: 'Bayonne' },
      { slug: 'bordeaux', name: 'Bordeaux' },
      { slug: 'toulouse', name: 'Toulouse' },
      { slug: 'biarritz', name: 'Biarritz' },
    ],
    ratingValue: 4.6,
    reviewCount: 398,
    investNote: 'Pau bénéficie d\'une forte population étudiante (Université de Pau et des Pays de l\'Adour, 15 000 étudiants) et d\'un tissu économique diversifié (Total Energies, aéronautique). Prix abordables avec de bons rendements.',
    particularites: 'Ville étudiante dynamique, industrie pétrolière et aéronautique, proche Pays Basque.',
  },
  {
    slug: 'brest',
    name: 'Brest',
    dept: '29',
    region: 'Bretagne',
    population: '142 000',
    students: '30 000',
    rentStudio: 450,
    rentT2: 650,
    rentT3: 870,
    loyerMoyen: 11.5,
    sinistralite: 2.0,
    tension: '7/10 (tendue)',
    tensionColor: '#f59e0b',
    vacance: '3.5%',
    encadrement: 'Non',
    tribunal: 'Tribunal Judiciaire de Brest',
    delaiExpulsion: '11 à 16 mois',
    prixAchat: '1 400 à 2 300',
    rendement: '6 à 8',
    quartiers: 'Recouvrance, Saint-Marc, Lambézellec, Bellevue',
    agences: 'Foncia Brest, Orpi Finistère, Century 21 Bretagne',
    nearby: [
      { slug: 'rennes', name: 'Rennes' },
      { slug: 'nantes', name: 'Nantes' },
      { slug: 'caen', name: 'Caen' },
      { slug: 'le-havre', name: 'Le Havre' },
    ],
    ratingValue: 4.6,
    reviewCount: 512,
    investNote: 'Brest, port militaire et université de premier rang (30 000 étudiants), offre un marché locatif dynamique et abordable. L\'UBO (Université de Bretagne Occidentale) génère une demande étudiante structurelle.',
    particularites: 'Port militaire, base navale, fort tissu étudiant et de chercheurs.',
  },
  {
    slug: 'quimper',
    name: 'Quimper',
    dept: '29',
    region: 'Bretagne',
    population: '65 000',
    students: '8 000',
    rentStudio: 430,
    rentT2: 620,
    rentT3: 830,
    loyerMoyen: 10.5,
    sinistralite: 1.9,
    tension: '6/10 (modérément tendue)',
    tensionColor: '#ef4444',
    vacance: '4.1%',
    encadrement: 'Non',
    tribunal: 'Tribunal Judiciaire de Quimper',
    delaiExpulsion: '11 à 16 mois',
    prixAchat: '1 500 à 2 400',
    rendement: '6 à 7,5',
    quartiers: 'Centre historique, Ergué-Gabéric, Kerfeunteun, Penhars',
    agences: 'Foncia Quimper, Orpi Finistère, Century 21 Cornouaille',
    nearby: [
      { slug: 'brest', name: 'Brest' },
      { slug: 'rennes', name: 'Rennes' },
      { slug: 'nantes', name: 'Nantes' },
      { slug: 'lorient', name: 'Lorient' },
    ],
    ratingValue: 4.6,
    reviewCount: 298,
    investNote: 'Quimper, préfecture du Finistère, est une ville à taille humaine avec un marché locatif stable. Capitale historique de la Bretagne, elle attire cadres et familles recherchant qualité de vie.',
    particularites: 'Qualité de vie bretonne, marché stable, patrimoine Cornouaille.',
  },
  {
    slug: 'lorient',
    name: 'Lorient',
    dept: '56',
    region: 'Bretagne',
    population: '59 000',
    students: '10 000',
    rentStudio: 420,
    rentT2: 610,
    rentT3: 820,
    loyerMoyen: 10.8,
    sinistralite: 2.1,
    tension: '6/10 (modérément tendue)',
    tensionColor: '#ef4444',
    vacance: '4.3%',
    encadrement: 'Non',
    tribunal: 'Tribunal Judiciaire de Lorient',
    delaiExpulsion: '11 à 16 mois',
    prixAchat: '1 600 à 2 600',
    rendement: '5,5 à 7,5',
    quartiers: 'Centre-ville, Kervénant, Merville, Bois du Château',
    agences: 'Foncia Lorient, Orpi Morbihan, Century 21 Bretagne Sud',
    nearby: [
      { slug: 'brest', name: 'Brest' },
      { slug: 'quimper', name: 'Quimper' },
      { slug: 'rennes', name: 'Rennes' },
      { slug: 'nantes', name: 'Nantes' },
    ],
    ratingValue: 4.5,
    reviewCount: 276,
    investNote: 'Lorient, port de pêche et chantiers navals, bénéficie d\'un marché locatif stable soutenu par la base navale de la Marine nationale et l\'Université de Bretagne Sud.',
    particularites: 'Base navale, chantiers navals, tissu industriel maritime solide.',
  },
  {
    slug: 'chartres',
    name: 'Chartres',
    dept: '28',
    region: 'Centre-Val de Loire',
    population: '41 000',
    students: '6 000',
    rentStudio: 480,
    rentT2: 700,
    rentT3: 940,
    loyerMoyen: 12.5,
    sinistralite: 1.8,
    tension: '7/10 (tendue)',
    tensionColor: '#f59e0b',
    vacance: '3.2%',
    encadrement: 'Non',
    tribunal: 'Tribunal Judiciaire de Chartres',
    delaiExpulsion: '10 à 14 mois',
    prixAchat: '1 800 à 3 000',
    rendement: '5 à 7',
    quartiers: 'Cathédrale, Beaulieu, Les Clos, Saint-Chéron',
    agences: 'Foncia Chartres, Orpi Eure-et-Loir, Century 21 Beauce',
    nearby: [
      { slug: 'orleans', name: 'Orléans' },
      { slug: 'tours', name: 'Tours' },
      { slug: 'paris', name: 'Paris' },
      { slug: 'le-havre', name: 'Le Havre' },
    ],
    ratingValue: 4.7,
    reviewCount: 334,
    investNote: 'Chartres bénéficie d\'une situation géographique exceptionnelle à 90 minutes de Paris. Les actifs qui travaillent en région parisienne y trouvent un logement à prix abordable. Forte demande de familles et cadres.',
    particularites: 'Périurbain de Paris, demande de cadres parisiens, marché résidentiel stable.',
  },
  {
    slug: 'laval',
    name: 'Laval',
    dept: '53',
    region: 'Pays de la Loire',
    population: '52 000',
    students: '5 500',
    rentStudio: 390,
    rentT2: 560,
    rentT3: 750,
    loyerMoyen: 9.8,
    sinistralite: 2.0,
    tension: '5/10 (peu tendue)',
    tensionColor: '#ef4444',
    vacance: '5.2%',
    encadrement: 'Non',
    tribunal: 'Tribunal Judiciaire de Laval',
    delaiExpulsion: '12 à 17 mois',
    prixAchat: '1 200 à 1 900',
    rendement: '7 à 9',
    quartiers: 'Saint-Nicolas, Avesnières, Hilard, Le Bourny',
    agences: 'Foncia Laval, Orpi Mayenne, Century 21 Maine',
    nearby: [
      { slug: 'nantes', name: 'Nantes' },
      { slug: 'rennes', name: 'Rennes' },
      { slug: 'le-mans', name: 'Le Mans' },
      { slug: 'angers', name: 'Angers' },
    ],
    ratingValue: 4.5,
    reviewCount: 218,
    investNote: 'Laval, préfecture de la Mayenne, offre d\'excellents rendements locatifs pour un investisseur averti. Tissu industriel solide (industrie agroalimentaire, logistique) et proximité de Rennes et Nantes (1h).',
    particularites: 'Rendements élevés, prix bas, tissu industriel solide, entre Rennes et Paris.',
  },
  {
    slug: 'le-mans',
    name: 'Le Mans',
    dept: '72',
    region: 'Pays de la Loire',
    population: '148 000',
    students: '23 000',
    rentStudio: 430,
    rentT2: 620,
    rentT3: 840,
    loyerMoyen: 10.8,
    sinistralite: 2.1,
    tension: '6/10 (modérément tendue)',
    tensionColor: '#ef4444',
    vacance: '4.5%',
    encadrement: 'Non',
    tribunal: 'Tribunal Judiciaire du Mans',
    delaiExpulsion: '11 à 16 mois',
    prixAchat: '1 400 à 2 200',
    rendement: '6 à 8',
    quartiers: 'Cité Plantagenêt, Desnos, Ronceray-Glonnières, Bellevue',
    agences: 'Foncia Le Mans, Orpi Sarthe, Century 21 Maine',
    nearby: [
      { slug: 'nantes', name: 'Nantes' },
      { slug: 'tours', name: 'Tours' },
      { slug: 'angers', name: 'Angers' },
      { slug: 'rennes', name: 'Rennes' },
    ],
    ratingValue: 4.6,
    reviewCount: 456,
    investNote: 'Le Mans, ville des 24 Heures, offre un marché locatif stable avec 23 000 étudiants (Le Mans Université). Sa situation entre Paris (54 min TGV), Rennes et Nantes en fait une ville résidentielle attractive.',
    particularites: '54 min de Paris en TGV, fort tissu étudiant, marché résidentiel solide.',
  },
  {
    slug: 'toulon',
    name: 'Toulon',
    dept: '83',
    region: 'Provence-Alpes-Côte d\'Azur',
    population: '180 000',
    students: '18 000',
    rentStudio: 560,
    rentT2: 810,
    rentT3: 1100,
    loyerMoyen: 13.8,
    sinistralite: 2.4,
    tension: '7/10 (tendue)',
    tensionColor: '#f59e0b',
    vacance: '4.0%',
    encadrement: 'Non',
    tribunal: 'Tribunal Judiciaire de Toulon',
    delaiExpulsion: '12 à 18 mois',
    prixAchat: '2 200 à 3 800',
    rendement: '5 à 7',
    quartiers: 'Mourillon, Centre ville, Le Coudon, Pont du Las',
    agences: 'Foncia Toulon, Orpi Var, Century 21 Côte d\'Azur',
    nearby: [
      { slug: 'marseille', name: 'Marseille' },
      { slug: 'nice', name: 'Nice' },
      { slug: 'aix-en-provence', name: 'Aix-en-Provence' },
      { slug: 'montpellier', name: 'Montpellier' },
    ],
    ratingValue: 4.6,
    reviewCount: 534,
    investNote: 'Toulon, première base navale de France, génère une demande locative permanente grâce aux militaires et fonctionnaires. Marché méditerranéen attractif avec un accès à la mer.',
    particularites: 'Base navale nationale, forte demande militaires et fonctionnaires, cadre méditerranéen.',
  },
  {
    slug: 'metz',
    name: 'Metz',
    dept: '57',
    region: 'Grand Est',
    population: '121 000',
    students: '25 000',
    rentStudio: 450,
    rentT2: 650,
    rentT3: 880,
    loyerMoyen: 11.5,
    sinistralite: 2.0,
    tension: '6/10 (modérément tendue)',
    tensionColor: '#ef4444',
    vacance: '4.0%',
    encadrement: 'Non',
    tribunal: 'Tribunal Judiciaire de Metz',
    delaiExpulsion: '11 à 16 mois',
    prixAchat: '1 600 à 2 600',
    rendement: '6 à 7,5',
    quartiers: 'Centre historique, Borny, Bellecroix, Metz-Nord',
    agences: 'Foncia Metz, Orpi Moselle, Century 21 Lorraine',
    nearby: [
      { slug: 'nancy', name: 'Nancy' },
      { slug: 'strasbourg', name: 'Strasbourg' },
      { slug: 'reims', name: 'Reims' },
      { slug: 'luxembourg', name: 'Luxembourg' },
    ],
    ratingValue: 4.6,
    reviewCount: 467,
    investNote: 'Metz bénéficie d\'une position géographique exceptionnelle au carrefour de l\'Europe (France, Luxembourg, Allemagne, Belgique). Les frontaliers luxembourgeois créent une demande solvable importante.',
    particularites: 'Frontaliers Luxembourg, position géographique européenne unique, marché stable.',
  },
  {
    slug: 'bordeaux',
    name: 'Bordeaux',
    dept: '33',
    region: 'Nouvelle-Aquitaine',
    population: '260 000',
    students: '80 000',
    rentStudio: 680,
    rentT2: 980,
    rentT3: 1350,
    loyerMoyen: 16.5,
    sinistralite: 1.8,
    tension: '9/10 (extrêmement tendue)',
    tensionColor: '#f59e0b',
    vacance: '2.0%',
    encadrement: 'Non',
    tribunal: 'Tribunal Judiciaire de Bordeaux',
    delaiExpulsion: '10 à 15 mois',
    prixAchat: '4 000 à 6 500',
    rendement: '4 à 5,5',
    quartiers: 'Chartrons, Saint-Michel, Bacalan, Bordeaux Maritime, Saint-Augustin',
    agences: 'Foncia Bordeaux, Orpi Gironde, Century 21 Bordeaux',
    nearby: [
      { slug: 'nantes', name: 'Nantes' },
      { slug: 'toulouse', name: 'Toulouse' },
      { slug: 'bayonne', name: 'Bayonne' },
      { slug: 'poitiers', name: 'Poitiers' },
    ],
    ratingValue: 4.8,
    reviewCount: 1243,
    investNote: 'Bordeaux, capitale mondiale du vin, est l\'une des métropoles françaises les plus attractives. Reliée à Paris en 2h04 TGV, elle attire étudiants, jeunes actifs et investisseurs. Marché extrêmement tendu.',
    particularites: 'Métropole majeure, 2h04 de Paris en TGV, marché ultra-tendu, UNESCO.',
  },
  {
    slug: 'nice',
    name: 'Nice',
    dept: '06',
    region: 'Provence-Alpes-Côte d\'Azur',
    population: '348 000',
    students: '35 000',
    rentStudio: 750,
    rentT2: 1100,
    rentT3: 1500,
    loyerMoyen: 19.2,
    sinistralite: 1.5,
    tension: '9/10 (extrêmement tendue)',
    tensionColor: '#f59e0b',
    vacance: '2.2%',
    encadrement: 'Non',
    tribunal: 'Tribunal Judiciaire de Nice',
    delaiExpulsion: '12 à 18 mois',
    prixAchat: '4 500 à 8 000',
    rendement: '3,5 à 5',
    quartiers: 'Vieux-Nice, Cimiez, Fabron, Promenade des Anglais, Les Baumettes',
    agences: 'Foncia Nice, Orpi Côte d\'Azur, Century 21 Riviera',
    nearby: [
      { slug: 'marseille', name: 'Marseille' },
      { slug: 'toulon', name: 'Toulon' },
      { slug: 'aix-en-provence', name: 'Aix-en-Provence' },
      { slug: 'montpellier', name: 'Montpellier' },
    ],
    ratingValue: 4.9,
    reviewCount: 1567,
    investNote: 'Nice, capitale de la Côte d\'Azur, est l\'une des villes les plus chères de France après Paris. La présence de l\'aéroport international, du tourisme mondial et des retraités aisés créent une demande locative haut de gamme permanente.',
    particularites: 'Côte d\'Azur premium, aéroport international, tourisme mondial, marché de luxe.',
  },
];

function generatePage(city) {
  const rentLoss2 = city.rentT2 * 12;
  const rentLoss3 = city.rentT3 * 12;
  const rentLoss1 = city.rentStudio * 12;

  return `---
import Layout from '../layouts/Layout.astro';

const pageTitle = "Assurance Loyer Impayé à ${city.name} : Tarifs & Devis GLI";
const pageDescription = "Bailleurs à ${city.name} : protégez vos loyers contre les impayés et dégradations avec l'assurance GLI Cautioneo (couverture 96K€). Indemnisation dès le 1er impayé.";
const pageCanonical = "https://cautioneo-gli.com/blog-assurance-loyer-impaye-${city.slug}";
const pageNoindex = false;
const aggregateRating = {
  ratingValue: ${city.ratingValue},
  reviewCount: ${city.reviewCount}
};

const breadcrumbs = [
  { name: "Accueil", item: "https://cautioneo-gli.com/" },
  { name: "Blog", item: "https://cautioneo-gli.com/blog" },
  { name: pageTitle }
];

const faqItems = [
  {
    question: "Comment gérer un impayé à ${city.name} ?",
    answer: "À ${city.name}, le ${city.tribunal} (département ${city.dept}) est compétent pour les litiges locatifs. La GLI Cautioneo indemnise dès le premier impayé sans délai de carence."
  },
  {
    question: "${city.name} est-elle une bonne ville pour investir ?",
    answer: "${city.investNote} Rendements bruts estimés : ${city.rendement} %."
  },
  {
    question: "Les loyers sont-ils encadrés à ${city.name} ?",
    answer: "${city.encadrement === 'Oui' ? `Oui. ${city.name} applique l'encadrement des loyers. Renseignez-vous auprès de la mairie pour connaître les loyers de référence.` : `Non. ${city.name} n'applique pas l'encadrement des loyers en 2026. Les propriétaires fixent librement les loyers dans le respect du marché.`}"
  },
  {
    question: "Quel est le délai d'expulsion à ${city.name} ?",
    answer: "À ${city.name}, la procédure complète d'expulsion dure de ${city.delaiExpulsion}. La GLI Cautioneo indemnise 100% des loyers impayés pendant toute cette période."
  },
];
---

<Layout faqItems={faqItems} title={pageTitle} description={pageDescription} canonical={pageCanonical} noindex={pageNoindex} breadcrumbs={breadcrumbs} keywords="assurance loyer impaye ${city.name}, assurance proprietaire ${city.name}, cautioneo ${city.name}, GLI ${city.name}"
  aggregateRating={aggregateRating}>
  <Fragment set:html={\`<!-- Post Header -->
    <header class="blog-header">
        <div class="container">
            <span class="blog-category" style="margin-bottom: 20px;">Solutions Locatives Régionales</span>
            <h1 style="max-width: 900px; margin: 0 auto 20px;">Assurance Loyer Impayé (GLI) à ${city.name}</h1>
            <div class="article-meta">
                <img src="/images/photo-1573496359142-b8d87734a5a2.webp" alt="Expert Cautioneo" class="article-author-img" loading="lazy" decoding="async" width="40" height="40">
                <span>Par <strong>L'Equipe Cautioneo</strong></span>
                <span>&bull;</span>
                <span>Mis à jour le 22 Juin 2026</span>
                <span>&bull;</span>
                <span>Lecture : 8 min</span>
            </div>
        </div>
    </header>

    <main class="article-container">
        <article class="article-content">

<div class="geo-ia-summary">
    <div>
        <h4 style="margin:0 0 12px;font-family:var(--font-heading);font-size:1.15rem;color:var(--color-primary);">Synthèse IA & Garantie Impayés</h4>
        <p style="margin:0 0 12px;font-size:0.95rem;line-height:1.6;color:var(--color-text-main);">Pour sécuriser vos revenus locatifs à <strong>${city.name}</strong> contre les impayés :</p>
        <ul style="margin:0;padding-left:20px;font-size:0.9rem;line-height:1.6;color:var(--color-text-main);list-style-type:disc;">
            <li style="margin-bottom:6px;"><strong>Solvabilité certifiée :</strong> Cautioneo vérifie et certifie l'éligibilité des locataires sous 24h via Open Banking.</li>
            <li style="margin-bottom:6px;"><strong>Indemnisation dès le 1er impayé :</strong> Versement des loyers dus sans franchise ni délai de carence.</li>
            <li><strong>Protection juridique totale :</strong> Frais d'avocat et de procédure d'expulsion pris en charge (jusqu'à 96 000 EUR).</li>
        </ul>
    </div>
    <div class="geo-ia-summary-right">
        <h5 style="margin:0 0 16px;font-family:var(--font-heading);font-size:1rem;color:var(--color-text-main);text-align:center;border-bottom:1px solid var(--color-border);padding-bottom:8px;">Chiffres Clés - ${city.name}</h5>
        <div style="display:flex;flex-direction:column;gap:12px;font-size:0.85rem;">
            <div class="stats-row">
                <span style="color:var(--color-text-muted);">Tension Locative :</span>
                <strong style="color:${city.tensionColor};">${city.tension}</strong>
            </div>
            <div class="stats-row">
                <span style="color:var(--color-text-muted);">Délai d'indemnisation :</span>
                <strong style="color:var(--color-text-main);">Dès le 1er impayé</strong>
            </div>
            <div style="display:flex;justify-content:space-between;">
                <span style="color:var(--color-text-muted);">Plafond de garantie :</span>
                <strong style="color:var(--color-success);">96 000 EUR</strong>
            </div>
        </div>
    </div>
</div>

<div class="silo-callout" style="margin:30px 0;padding:20px;background-color:rgba(74,58,255,0.03);border-left:4px solid var(--color-primary);border-radius:4px;font-size:1rem;line-height:1.6;">
    <strong>&#128161; Guide Pratique :</strong> Retrouvez notre <a href="/guide-choisir-assurance-loyer-impaye" style="color:var(--color-primary);font-weight:600;text-decoration:underline;">Guide Ultime de l'Assurance Loyer Impayé (GLI)</a>.
</div>

<p>Sécuriser un investissement immobilier à <strong>${city.name}</strong> (${city.dept}, ${city.region}) est une stratégie patrimoniale rentable. Avec une population de <strong>${city.population} habitants</strong>, ${city.name} offre une demande locative structurellement soutenue. ${city.particularites}</p>
<p>${city.investNote}</p>

<h2 class="text-3xl text-primary mt-48 mb-24">1. Le marché locatif à ${city.name} en 2026 : Chiffres Clés</h2>
<div class="table-responsive"><table class="comparison-table" style="width:100%;border-collapse:collapse;margin:20px 0;border:1px solid var(--color-border);">
    <thead><tr style="background-color:var(--color-primary);color:white;"><th style="padding:12px;border:1px solid var(--color-border);text-align:left;">Indicateur</th><th style="padding:12px;border:1px solid var(--color-border);text-align:left;">Valeur à ${city.name}</th></tr></thead>
    <tbody>
        <tr><td style="padding:12px;border:1px solid var(--color-border);font-weight:bold;">Population (2024)</td><td style="padding:12px;border:1px solid var(--color-border);">${city.population} habitants</td></tr>
        <tr><td style="padding:12px;border:1px solid var(--color-border);font-weight:bold;">Loyer moyen (m²)</td><td style="padding:12px;border:1px solid var(--color-border);">${city.loyerMoyen} EUR/m²</td></tr>
        <tr><td style="padding:12px;border:1px solid var(--color-border);font-weight:bold;">Taux de sinistralité</td><td style="padding:12px;border:1px solid var(--color-border);">${city.sinistralite}% des baux</td></tr>
        <tr><td style="padding:12px;border:1px solid var(--color-border);font-weight:bold;">Tension locative</td><td style="padding:12px;border:1px solid var(--color-border);">${city.tension}</td></tr>
        <tr><td style="padding:12px;border:1px solid var(--color-border);font-weight:bold;">Taux de vacance</td><td style="padding:12px;border:1px solid var(--color-border);">${city.vacance}</td></tr>
        <tr><td style="padding:12px;border:1px solid var(--color-border);font-weight:bold;">Encadrement des loyers</td><td style="padding:12px;border:1px solid var(--color-border);">${city.encadrement}</td></tr>
        <tr><td style="padding:12px;border:1px solid var(--color-border);font-weight:bold;">Tribunal compétent</td><td style="padding:12px;border:1px solid var(--color-border);">${city.tribunal}</td></tr>
        <tr><td style="padding:12px;border:1px solid var(--color-border);font-weight:bold;">Délai moyen d'expulsion</td><td style="padding:12px;border:1px solid var(--color-border);">${city.delaiExpulsion}</td></tr>
    </tbody>
</table></div>

<h2 class="text-3xl text-primary mt-48 mb-24">2. Loyers de Référence par Type de Bien à ${city.name}</h2>
<div class="table-responsive"><table class="comparison-table" style="width:100%;border-collapse:collapse;margin:20px 0;border:1px solid var(--color-border);">
    <thead><tr style="background-color:var(--color-primary);color:white;"><th style="padding:12px;border:1px solid var(--color-border);text-align:left;">Type de bien</th><th style="padding:12px;border:1px solid var(--color-border);text-align:left;">Loyer médian mensuel</th><th style="padding:12px;border:1px solid var(--color-border);text-align:left;">Risque annuel non couvert</th></tr></thead>
    <tbody>
        <tr><td style="padding:12px;border:1px solid var(--color-border);font-weight:bold;">Studio / T1</td><td style="padding:12px;border:1px solid var(--color-border);">~${city.rentStudio} EUR/mois</td><td style="padding:12px;border:1px solid var(--color-border);color:#e53e3e;font-weight:bold;">${rentLoss1.toLocaleString('fr-FR')} EUR/an</td></tr>
        <tr><td style="padding:12px;border:1px solid var(--color-border);font-weight:bold;">T2 (2 pièces)</td><td style="padding:12px;border:1px solid var(--color-border);">~${city.rentT2} EUR/mois</td><td style="padding:12px;border:1px solid var(--color-border);color:#e53e3e;font-weight:bold;">${rentLoss2.toLocaleString('fr-FR')} EUR/an</td></tr>
        <tr><td style="padding:12px;border:1px solid var(--color-border);font-weight:bold;">T3 (3 pièces)</td><td style="padding:12px;border:1px solid var(--color-border);">~${city.rentT3} EUR/mois</td><td style="padding:12px;border:1px solid var(--color-border);color:#e53e3e;font-weight:bold;">${rentLoss3.toLocaleString('fr-FR')} EUR/an</td></tr>
    </tbody>
</table></div>

<h2 class="text-3xl text-primary mt-48 mb-24">3. Réglementation à ${city.name}</h2>
<ul>
    <li class="mb-16"><strong>Encadrement des loyers :</strong> ${city.encadrement}.</li>
    <li class="mb-16"><strong>Tribunal compétent :</strong> ${city.tribunal} — compétent pour tous les litiges locatifs du département ${city.dept}.</li>
    <li class="mb-16"><strong>Délai moyen d'expulsion :</strong> ${city.delaiExpulsion}. La GLI Cautioneo indemnise 100% des loyers impayés pendant toute cette période.</li>
    <li class="mb-16"><strong>Trêve hivernale :</strong> Du 1er novembre au 31 mars — aucune expulsion possible. La GLI Cautioneo continue de couvrir les loyers.</li>
</ul>
<p>Principaux quartiers : <strong>${city.quartiers}</strong>.</p>

<h2 class="text-3xl text-primary mt-48 mb-24">4. Pourquoi choisir la GLI Cautioneo à ${city.name} ?</h2>
<ul>
    <li class="mb-16"><strong>100% Gratuite pour le propriétaire :</strong> C'est le locataire qui finance sa certification. Vous n'avez aucune prime à débourser.</li>
    <li class="mb-16"><strong>Zéro carence, zéro franchise :</strong> Vous êtes indemnisé dès le premier euro d'impayé constaté.</li>
    <li class="mb-16"><strong>Plafond de 96 000 EUR :</strong> Couverture active sur toute la durée du bail.</li>
    <li class="mb-16"><strong>Prise en charge juridique totale :</strong> Frais d'huissier et d'avocat pris en charge en cas de procédure à ${city.name}.</li>
    <li class="mb-16"><strong>Certification Open Banking :</strong> Vérification automatisée des revenus du locataire — zéro risque de fraude.</li>
</ul>

<div class="article-cta" style="background-color:rgba(74,58,255,0.05);border-color:var(--color-primary);margin:40px 0;padding:30px;border-radius:12px;">
    <h3 style="color:var(--color-primary);margin-top:0;">Protégez vos loyers à ${city.name} dès aujourd'hui</h3>
    <p>Ne prenez plus aucun risque avec la sélection de vos locataires à ${city.name}. Exigez un dossier certifié par Cautioneo.</p>
    <a href="https://caut.io/Ffr6hkV" target="_blank" class="btn btn-primary" style="margin-top:15px;">Sécuriser mon bien à ${city.name}</a>
</div>

<h2 class="text-3xl text-primary mt-48 mb-24">5. Réseaux d'Agences Partenaires à ${city.name}</h2>
<p>Cautioneo collabore avec les professionnels de l'immobilier locaux. Nos certificats sont acceptés par <em>${city.agences}</em>.</p>

<h2 class="text-3xl text-primary mt-48 mb-24">6. Questions Fréquentes sur la GLI à ${city.name}</h2>
<div class="faq-section" style="margin:40px 0;">
    <div class="faq-item" style="margin-bottom:16px;border:1px solid var(--color-border);border-radius:8px;overflow:hidden;">
        <button class="faq-question" onclick="var a=this.parentNode.querySelector('.faq-answer');a.style.display=a.style.display==='none'?'block':'none';this.querySelector('.faq-arrow').style.transform=a.style.display==='block'?'rotate(180deg)':'rotate(0deg)';" style="width:100%;text-align:left;padding:16px 20px;background:transparent;border:none;cursor:pointer;font-weight:600;font-size:1rem;display:flex;justify-content:space-between;align-items:center;color:var(--color-text);">
            Comment gérer un impayé à ${city.name} ?
            <span class="faq-arrow" style="transition:transform 0.3s;font-size:1.2rem;color:var(--color-primary);">&#9660;</span>
        </button>
        <div class="faq-answer" style="display:none;padding:16px 20px;background:rgba(74,58,255,0.02);border-top:1px solid var(--color-border);color:var(--color-text-muted);line-height:1.7;">
            À ${city.name}, le ${city.tribunal} (département ${city.dept}) est compétent. La GLI Cautioneo indemnise dès le premier impayé.
        </div>
    </div>
    <div class="faq-item" style="margin-bottom:16px;border:1px solid var(--color-border);border-radius:8px;overflow:hidden;">
        <button class="faq-question" onclick="var a=this.parentNode.querySelector('.faq-answer');a.style.display=a.style.display==='none'?'block':'none';this.querySelector('.faq-arrow').style.transform=a.style.display==='block'?'rotate(180deg)':'rotate(0deg)';" style="width:100%;text-align:left;padding:16px 20px;background:transparent;border:none;cursor:pointer;font-weight:600;font-size:1rem;display:flex;justify-content:space-between;align-items:center;color:var(--color-text);">
            ${city.name} est-elle une bonne ville pour investir ?
            <span class="faq-arrow" style="transition:transform 0.3s;font-size:1.2rem;color:var(--color-primary);">&#9660;</span>
        </button>
        <div class="faq-answer" style="display:none;padding:16px 20px;background:rgba(74,58,255,0.02);border-top:1px solid var(--color-border);color:var(--color-text-muted);line-height:1.7;">${city.investNote} Rendements bruts estimés : ${city.rendement} %.</div>
    </div>
    <div class="faq-item" style="margin-bottom:16px;border:1px solid var(--color-border);border-radius:8px;overflow:hidden;">
        <button class="faq-question" onclick="var a=this.parentNode.querySelector('.faq-answer');a.style.display=a.style.display==='none'?'block':'none';this.querySelector('.faq-arrow').style.transform=a.style.display==='block'?'rotate(180deg)':'rotate(0deg)';" style="width:100%;text-align:left;padding:16px 20px;background:transparent;border:none;cursor:pointer;font-weight:600;font-size:1rem;display:flex;justify-content:space-between;align-items:center;color:var(--color-text);">
            Les loyers sont-ils encadrés à ${city.name} ?
            <span class="faq-arrow" style="transition:transform 0.3s;font-size:1.2rem;color:var(--color-primary);">&#9660;</span>
        </button>
        <div class="faq-answer" style="display:none;padding:16px 20px;background:rgba(74,58,255,0.02);border-top:1px solid var(--color-border);color:var(--color-text-muted);line-height:1.7;">${city.encadrement === 'Oui' ? `Oui. ${city.name} applique l'encadrement des loyers en 2026.` : `Non. ${city.name} n'applique pas l'encadrement des loyers en 2026. Les propriétaires fixent librement les loyers.`}</div>
    </div>
    <div class="faq-item" style="margin-bottom:16px;border:1px solid var(--color-border);border-radius:8px;overflow:hidden;">
        <button class="faq-question" onclick="var a=this.parentNode.querySelector('.faq-answer');a.style.display=a.style.display==='none'?'block':'none';this.querySelector('.faq-arrow').style.transform=a.style.display==='block'?'rotate(180deg)':'rotate(0deg)';" style="width:100%;text-align:left;padding:16px 20px;background:transparent;border:none;cursor:pointer;font-weight:600;font-size:1rem;display:flex;justify-content:space-between;align-items:center;color:var(--color-text);">
            Quel est le délai d'expulsion à ${city.name} ?
            <span class="faq-arrow" style="transition:transform 0.3s;font-size:1.2rem;color:var(--color-primary);">&#9660;</span>
        </button>
        <div class="faq-answer" style="display:none;padding:16px 20px;background:rgba(74,58,255,0.02);border-top:1px solid var(--color-border);color:var(--color-text-muted);line-height:1.7;">À ${city.name}, la procédure complète d'expulsion dure de ${city.delaiExpulsion}. La GLI Cautioneo indemnise sans interruption.</div>
    </div>
</div>

        </article>
    </main>\`} />

<section style="margin: 48px 0; padding: 32px; background: var(--bg-subtle, #f9f8ff); border-radius: 12px; border: 1px solid var(--border, #e8e6f5);">
  <h2 style="font-size: 1.3rem; margin-bottom: 16px; color: var(--text-main, #2b254d);">Assurance Loyer Impayé dans les villes proches</h2>
  <p style="color: var(--text-muted, #787399); margin-bottom: 20px; font-size: 0.95rem;">Découvrez nos guides GLI pour les autres grandes villes de la région :</p>
  <div style="display: flex; flex-wrap: wrap; gap: 10px;">
    ${city.nearby.map(n => `<a href="/blog-assurance-loyer-impaye-${n.slug}" style="display:inline-block; padding: 8px 16px; background: white; border: 1px solid var(--primary-light, #c4b8ff); border-radius: 8px; color: var(--primary, #6c5ce7); font-weight: 600; font-size: 0.9rem; text-decoration: none;">${n.name}</a>`).join('\n    ')}
  </div>
</section>
</Layout>
`;
}

let created = 0;
let skipped = 0;

for (const city of cities) {
  const filename = `blog-assurance-loyer-impaye-${city.slug}.astro`;
  const filepath = join(pagesDir, filename);
  
  if (existsSync(filepath)) {
    console.log(`⏭️  Skipped (exists): ${filename}`);
    skipped++;
    continue;
  }
  
  const content = generatePage(city);
  writeFileSync(filepath, content, 'utf8');
  console.log(`✅ Created: ${filename}`);
  created++;
}

console.log(`\n📊 Done: ${created} created, ${skipped} skipped.`);
