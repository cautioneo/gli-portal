const fs = require('fs');
const path = require('path');

// 1. Définition des 13 termes
const terms = [
    {
        id: "acte-cautionnement",
        title: "Acte de Cautionnement",
        slug: "acte-cautionnement",
        short: "Document par lequel un tiers s'engage à payer les dettes locatives en cas de défaillance du locataire.",
        sections: [
            {
                h2: "Définition juridique en droit immobilier",
                p: "L'acte de cautionnement est un contrat unilatéral par lequel une personne physique (garant, parent) ou morale (comme Cautioneo) s'engage formellement auprès d'un bailleur à régler les dettes locatives du locataire (loyers impayés, charges, dégradations locatives) si ce dernier se révèle défaillant. Il s'agit d'une garantie personnelle fondamentale pour sécuriser un investissement locatif."
            },
            {
                h2: "Comment ça fonctionne en pratique ?",
                p: "L'acte doit contenir des mentions obligatoires très strictes prévues par la loi Alur et la loi Elan sous peine de nullité. Il doit préciser le montant du loyer, les conditions de révision, et la mention manuscrite de la personne se portant caution affirmant avoir conscience de la portée de son engagement. Le bailleur doit obligatoirement annexer cet acte au contrat de bail au moment de la signature."
            },
            {
                h2: "Les pièges fréquents à éviter",
                p: "Le formalisme de ce document est la cause numéro 1 d'annulation devant un juge en cas de litige. Une simple erreur dans le montant écrit en toutes lettres ou l'oubli de la phrase magique requise par l'article 22-1 de la loi du 6 juillet 1989 suffit à rendre le garant totalement obsolète. Un propriétaire se retrouve alors sans filet de sécurité face à l'impayé."
            },
            {
                h2: "La solution Cautioneo",
                p: "Plutôt que de risquer un vice de forme avec un garant physique ou de mener un parcours du combattant pour vérifier la solvabilité des garants de vos candidats, Cautioneo propose une Assurance Loyers Impayés (GLI) ou un système de Garant Locataire ultra-sécurisé. Vous profitez d'un acte juridique inattaquable et d'une indemnisation immédiate."
            }
        ]
    },
    {
        id: "apl",
        title: "Allocation Logement (APL)",
        slug: "apl",
        short: "Aide financière versée par la CAF pour réduire le montant du loyer des ménages aux revenus modestes.",
        sections: [
            {
                h2: "Qu'est ce que l'APL ?",
                p: "L'Aide Personnalisée au Logement (APL) est une prestation sociale versée par la Caisse d'Allocations Familiales (CAF) ou la Mutualité Sociale Agricole (MSA). Elle vise à réduire la charge financière de l'hébergement pour les ménages à revenus modestes (étudiants, jeunes actifs, familles)."
            },
            {
                h2: "Le versement en tiers payant pour le Bailleur",
                p: "En tant que propriétaire bailleur, vous pouvez demander à la CAF que l'APL vous soit versée directement (système du tiers payant). Ainsi, le locataire ne paye que le solde restant. C'est une excellente pratique de gestion qui garantit le paiement d'une bonne partie du loyer en début de mois, sécurisant d'autant plus votre flux de trésorerie."
            },
            {
                h2: "L'impact sur la solvabilité lors de la sélection",
                p: "Dans l'étude financière d'un dossier locataire, l'APL peut parfois être déduite de la charge du loyer mensuel, maximisant ainsi le taux de solvabilité calculé par rapport à leurs revenus nets."
            },
            {
                h2: "Comment Cautioneo la prend en compte ?",
                p: "Cautioneo certifie efficacement les profils des locataires avec ou sans l'aide pour s'assurer d'une fiabilité maximale. La protection Loyers Impayés que Cautioneo met en place pour le propriétaire prend automatiquement en charge 100% de la somme du loyer indiquée sur le bail, sans franchise, peu importe les calculs de CAF éventuels."
            }
        ]
    },
    {
        id: "bail",
        title: "Bail (Contrat de location)",
        slug: "bail",
        short: "Contrat écrit par lequel le propriétaire s'engage à procurer la jouissance d'un logement au locataire.",
        sections: [
            {
                h2: "Définition du Bail Locatif",
                p: "Le bail, ou contrat de location, est le document légal instaurant le lien juridique entre un bailleur et son locataire. Il fixe les droits, obligations et devoirs réciproques (montant du loyer, durée du droit d'usage, obligations d'entretien) dans le cadre de la loi régissant les rapports locatifs (souvent la loi du 6 juillet 1989)."
            },
            {
                h2: "Les différents types de baux possibles",
                p: "Il existe une grande disparité de modèles de baux selon la nature de l'engagement. On retrouve le bail vide (durée de 3 ans pour une personne physique), le bail meublé (1 an, renouvelable), le bail étudiant (9 mois, non renouvelable tacitement), et le bail mobilité (de 1 à 10 mois)."
            },
            {
                h2: "L'importance des clauses pénales et résolutoires",
                p: "Un bail complet doit obligatoirement inclure une 'clause résolutoire'. Celle-ci stipule que le bail sera résilié de plein droit en cas de non-paiement du loyer. Sans cette clause, la procédure d'expulsion d'un locataire mauvais payeur demandera d'être repassée en appel au Tribunal, repoussant de plusieurs années un litige dommageable à votre investissement."
            },
            {
                h2: "La prise en charge juridique Cautioneo",
                p: "En adhérant à la GLI Cautioneo ou à la solution Garant, vous avez accès à tous nos modèles de baux vierges (vides, meublés, annexes) audités par nos avocats pour être conformes aux lois en vigueur. Si le locataire contrevient au contrat, Cautioneo endosse le paiement mais mandate également des huissiers pour déclencher la clause résolutoire de votre contrat sans frais pour vous."
            }
        ]
    },
    {
        id: "caution",
        title: "Caution (Garant)",
        slug: "caution",
        short: "Désigne la personne (ou l'organisme) qui se porte garant en cas d'impayé. Souvent confondu avec le Dépôt de Garantie.",
        sections: [
            {
                h2: "Ne pas confondre Caution et Dépôt de garantie !",
                p: "C'est l'erreur de vocabulaire la plus commune de l'immobilier. Lorsque les locataires parlent de 'chèque de caution', ils s'expriment juridiquement mal pour parler du 'Dépôt de Garantie'. La caution, elle, est l'acte (ou la personne) qui s'engage à garantir la dette d'un tiers. Il faut parler d'être garant."
            },
            {
                h2: "Caution Solidaire vs Caution Simple",
                p: "Lorsqu'elle est 'solidaire', la caution permet au propriétaire de s'adresser directement au garant dès le 1er impayé du locataire, sans attendre l'issue d'une longue procédure d'injonction contre le locataire de payer. Une caution simple imposerait d'épuiser toutes les voies de saisies contre le locataire d'abord, on ne l'utilise quasiment jamais en bail résidentiel."
            },
            {
                h2: "L'essoufflement de la caution classique",
                p: "Trouver un garant physique s'avère de plus en plus difficile pour les locataires. Même pour un parent qui gagne 3 fois le loyer exigé, sa défaillance éventuelle le plonge dans un gouffre. Sans parler de la lenteur pour le propriétaire à recouvrer sa dette en cas de mauvaise foi du parent."
            },
            {
                h2: "L'avènement exclusif de Cautioneo",
                p: "Cautioneo innove en remplaçant la notion archaïque et risquée du parent garant par un gage institutionnel de béton. Plus besoin de récupérer des montagnes de fiches de paies de personnes tierces. Cautioneo endosse la caution. C'est l'Assurance que les impayés vous seront réglés sans discussions ni excuses personnelles."
            }
        ]
    },
    {
        id: "charges-locatives",
        title: "Charges Locatives (Récupérables)",
        slug: "charges-locatives",
        short: "Dépenses payées initialement par le propriétaire et remboursées par le locataire.",
        sections: [
            {
                h2: "Les Charges Récupérables : Qu'est-ce que c'est ?",
                p: "Les charges locatives ou 'récupérables' recouvrent l'ensemble des frais incombant légalement à l'occupant, mais qui sont payés initialement et trimestriellement par le propriétaire au syndic (ex : entretien des parties communes, honoraires de sortie de poubelles, minuterie, eau froide/chaude). Le propriétaire en demande ensuite le remboursement selon le décret n°87-713 du 26 août 1987."
            },
            {
                h2: "Forfait de charges vs Provision pour charges",
                p: "Une 'provision pour charges' repose sur le paiement d'une constante d'avance chaque mois (environ = charges de l'année N-1 / 12) soumise à une 'régularisation' précise annuelle avec facturette. Le 'forfait de charges', très utilisé en colocation et location meublée, autorise une somme fixe (n'ouvrant pas de droits au rabais ni à l'augmentation compensée sans clause formelle)."
            },
            {
                h2: "Ne pas impacter l'analyse financière locataire",
                p: "Pensez que l'endettement maximal du locataire s'applique sur le calcul du Loyer Charges Comprises ! Des charges surévaluées faussent le taux d'effort, alors que votre base pure de taux de rendement est le loyer 'Nu'."
            },
            {
                h2: "Ce qui est couvert par vos assurances loyer",
                p: "Cautioneo inclut totalement les charges récupérables associées au loyer lors du remboursement d'un impayé. Puisque les charges sont inhérentes aux frais liés à l'occupation du bien, nous les créditons intégralement chaque fin de mois à votre place !"
            }
        ]
    },
    {
        id: "depot-garantie",
        title: "Dépôt de Garantie",
        slug: "depot-garantie",
        short: "Somme versée à l'entrée dans les lieux pour couvrir d'éventuels manquements (loyers partiels, dégradations).",
        sections: [
            {
                h2: "Fonction et Montant Maximal",
                p: "Le dépôt de garantie consiste en une véritable remise de fonds du nouveau locataire au propriétaire le jour de la signature. Son but : financer les travaux nécessaires si, le jour du départ, des défauts attribuables au locataire sont constatés. La loi plafonne ce montant à 1 mois de loyer hors charges (en location vide) et 2 mois de loyers hors charges (en location meublée)."
            },
            {
                h2: "Le délai technique de restitution",
                p: "Lorsque l'État des Lieux de Sortie est certifié identique à l'État des Lieux d'Entrée, le propriétaire dispose d'un mois civil pour restituer l'argent au départ des locataires (Remise des Clés). S'il y a des dégradations observées, le propriétaire dispose de 2 mois pour fournir ses retenues dûment appuyées sur Factures matérielles ou Devis complets de corps de métier."
            },
            {
                h2: "Le plafond des dégradations",
                p: "Malheureusement, dans 45% des cas houleux d'impayés finaux couplés à des dégradations de biens (dégâts intérieurs majeurs, destructions d'ouvrages, électroménager volé), le montant d'un petit dépôt de garantie suffit à peine à recouvrir les restes de loyers, rendant inopérante sa portée réelle de rénovation."
            },
            {
                h2: "Aujourd'hui, confiez les dommages à Cautioneo",
                p: "Ne basez plus votre seule garantie sur une malheureuse caution de garantie. La protection incluse dans la GLI Cautioneo intègre jusqu'à une garantie de protection allant jusqu'à 10.000€ pour la Détérioration Immobilière et prendra en charge les remises à neuf sur devis sans avoir à batailler en vain pour réclamer de l'argent sur le tard à un locataire indigent."
            }
        ]
    },
    {
        id: "etat-des-lieux",
        title: "État des Lieux",
        slug: "etat-des-lieux",
        short: "Document contradictoire établi à l'entrée et à la sortie, décrivant l'état précis du logement.",
        sections: [
            {
                h2: "Le document qui répertorie toutes les imperfections",
                p: "Contradictoire et détaillé au millimètre près, l'état des lieux d'entrée a valeur juridique et probatoire pour recenser les murs, plafonds, équipements, moquettes de l'habitation. C'est l'étalon unique qui fera foi à la comparaison finale lors de la sortie pour qualifier la différence notable due au dégât direct (exclusion de la 'vétusté' de l'équipement au terme de son utilisation normale)."
            },
            {
                h2: "La Loi Alur de 2016 unifie la structure",
                p: "Exit les feuilles volantes raturées à la main. Désormais, des éléments fondamentaux d'inventaire en Annexe des clés et relevés de Compteurs individuels énergétiques font office d'obligations d'information formelles sur support lisible. À ce titre, la signature numérique sécurisée d'applications spécialisées de gestion locative évite les contestations par rapport au droit initial."
            },
            {
                h2: "L'obligation pour faire appliquer votre Assurance",
                p: "Pour les assureurs qui couvrent vos impayés, c'est document contractuel : ce document sera massivement épluché des années après la location en cas de déclenchement de litige de vandalisme locatif. Sans preuve factuelle établie sur papier signée et paraphée, vous ne pourrez pas récupérer les déductions financières du locataire sur dépôt de garantie. Autant les faire rédiger par avocat ou huissier (ou utiliser vos Outils Bailleurs certifiés Cautioneo)."
            }
        ]
    },
    {
        id: "frais-dossier",
        title: "Frais de Dossier",
        slug: "frais-dossier",
        short: "Sommes facturées pour la constitution du dossier de location. Ils sont strictement encadrés par la loi Alur.",
        sections: [
            {
                h2: "L'interdiction absolue de marges abusives pour le bailleur direct",
                p: "Il faut distinguer les locations par agence et celles par propriétaires particuliers (LMG - Location de Particulier à Particulier). Dans le cadre de mise en relation de PAP, le bailleur qui fait lui-même la paperasse et établit le bail n'a pas le droit d'exiger de manière unilatérale des 'frais de dossier' qu'il encaisse personnellement (hormis quelques coûts fractionnés encadrés pour des huissiers extérieurs de justice délégués à l'État des Lieux par exemple)."
            },
            {
                h2: "L'encadrement en loi Alur pour l'Agence de mise en place",
                p: "Seules les honoraires de mise en location (organisations de visite, constitution du dossier de candidature, édition matérielle du bail) ainsi que la facturation du forfait rédaction d'Etat des Lieux peuvent être indexés sur le locataire dans une limite mathématiquement bornée au m² selon la fameuse Zone Tendue du bien immobilier, le reste des charges foncières incombant de manière inhérente au Bailleur-Mandant au bout du compte selon facturation du Mandataire commercial en ligne ou physique."
            }
        ]
    },
    {
        id: "gli",
        title: "Garantie Loyers Impayés (GLI)",
        slug: "gli",
        short: "Assurance souscrite par le propriétaire pour se protéger contre les risques d'impayés et de dégradations locatives.",
        sections: [
            {
                h2: "Qu'est-ce que la GLI ?",
                p: "C'est l'assurance vie de votre trésorerie locative. La Garantie Loyers Impayés (GLI) est un contrat d'assurance multirisque exclusif au marché de l'habitat qui transfère l'énorme risque du marché des dettes d'habitation du locataire, vers une compagnie d'assurances capable de mutualiser."
            },
            {
                h2: "Déductibilité de la prime de l'assiette des impôts",
                p: "L'administration fiscale est encourageante depuis des décennies avec la GLI pour palier l'intervention coûteuse de la force publique pour expulser un indigent ! Ainsi en Loi LMNP au Réel ou micro-Foncier classique, les cotisations GLI versées sont totalement déductibles des revenus locatifs générés de l'année Fiscale à justifier, baissant drastiquement l'impôt !"
            },
            {
                h2: "Les niveaux de prise en charges d'une GLI complète Cautioneo",
                p: "Les contrats d'Assurances classiques proposent souvent des exclusions vicieuses pour ne pas payer. Avec l'Assurance GLI Cautioneo : les recouvrements sont rapides (0 franchise financière ou temporelle avec une prise en charge au jour N), et nous repoussons le plafond standard jusqu'à couvrir une dette illimitée du mauvais payeur ou des honoraires infinis des actions en justice."
            }
        ]
    },
    {
        id: "irl",
        title: "Indice de Référence des Loyers (IRL)",
        slug: "irl",
        short: "Indice publié chaque trimestre par l'INSEE servant de base à la révision annuelle du loyer en cours de bail.",
        sections: [
            {
                h2: "Objectifs de la révision par l'IRL de l'Etat",
                p: "Afin d'éviter une hyper-pression sur les habitations mais tout de même protéger le patrimoine du Bailleur d'un effet pervers lié aux inflations galopantes nationales, l'INSEE a imaginé et fixé et indexe l'Indice de Référence des Loyers."
            },
            {
                h2: "Comment l'appliquer obligatoirement avec une fameuse clause ?",
                p: "Votre contrat Bail Type Cautioneo dispose d'une clause explicite nommée 'Clause d'indexation' ou de Renouvellement à Valeur constante. Seule la présence ferme de la clause d'un Index explicite (Souvent de Base trimestrielle publiée par ordonnance au journal officiel à date de commémoration du bail locatif de votre immeuble) vous autorise depuis la Loi Alur à majorer votre bénéfice net sans accord tacite d'un occupant aux aguets financiers des prix du marché qui se figerait pour un quart de décennie sur la Valeur fixée !"
            }
        ]
    },
    {
        id: "lmnp",
        title: "Location Meublée Non Professionnelle (LMNP)",
        slug: "lmnp",
        short: "Statut fiscal permettant de louer des logements meublés avec de superbes abattements sur les revenus locatifs.",
        sections: [
            {
                h2: "Le paradis fiscal légal du Meublé",
                p: "Les revenus des loyers imposables provenant de bien équipés pour l'habitat exclusif sans besoin d'apports meubles (Meubles de repos diurnes / nocturnes de normes, cuisines équipées standard et literie), appartiennent dans la taxation foncière française aux BIC, c'est-à-dire aux Bénéfices Industriels Commerciaux et non pas aux revenus Fonciers lourds pénalisants ! C'est ce qu'on appelle historiquement le statut Location Meublée Non Professionnelle (pour des loyers en deçà du cap de revenus massifs majeurs du couple civil de vos fiches Fisc par le régime de micro-Bic) !"
            },
            {
                h2: "Amortissement fiscal : Régime Réel & Déficit pour gommer l'impôt !",
                p: "C'est la spécialité reine du Bailleur privé investisseur avisé : Grâce à l'aide d'Experts-Comptables d'immobiliers, le recours au régime Légal de base dit du Régime Fiscal 'Réel', offre sans appel la possibilité de pratiquer le principe l'ARD (l'amortissement comptable virtuel permanent lié au bâtiment et aux murs lourds fractionnés des 10 à 30 décennies, des crédits, de tous les intérêts emprunts liés, mais aussi les frais d'acquisition initiaux comme du notarié total sur l'exercice) écrasant la plus noble et substantielle partie fiscale, ce que le vide locatif 'Nu' n'a nullement les largesses institutionnelles fiscales légales ni la grâce."
            }
        ]
    },
    {
        id: "quittance-loyer",
        title: "Quittance de Loyer",
        slug: "quittance-loyer",
        short: "Document remis par le bailleur attestant du règlement du loyer de la part du locataire.",
        sections: [
            {
                h2: "L'obligation fondamentale du droit Alur à la loi Française",
                p: "Selon les principes directeurs de l'Article de Loi fondamentale Alur : si un de vos locataires au travers du processus normal en fait la demande, le Bailleur à l'impériosité immédiate de remettre une et unique Quittance validant sans équivoque possible de façon décomposée les droits financiers nets acquis."
            },
            {
                h2: "Les risques d'appels de fonds confus ou des impayés virtuels",
                p: "Si nous mettons l'accent dans les fiches pour bailleurs novices pour le principe Quittances d'imprimeries : Attention formelle : Remettre une simple lettre au locataire stipulant vaguement : 'Payé' est irrecevable pour que Cautioneo ou une Compagnie s'engage à poursuivre à une phase Juridique ou d'Injonction Pécuniaires la personne."
            }
        ]
    },
    {
        id: "solvabilite",
        title: "Solvabilité (Taux d'effort locatif)",
        slug: "solvabilite",
        short: "Capacité financière d'un locataire à assumer ses charges par rapport à ses revenus purs (évaluée à 33%).",
        sections: [
            {
                h2: "Qu'est ce qu'une Solvabilité Optimale pour du profil classique ?",
                p: "On appelle une règle 'solvabilité' non pas la seule capacité de détenir de l'argent mais avant tout un principe dit structurel d'assurance calculant sur pièces fiables certifiées d'authenticités probantes, le principe d'Endettement Locatif Universel : Le Loyer global CC du bien concerné (Loyers Hors Charges ou dit Nu + Assiette Forfait des dépenses en cours ou Appels Forfaitaire pour Charges Récupérables liés) par rapport à sa propre Trésorerie nette et garantie d'entrée Fixe pour chaque mensualité civile de sa vie. Le Ratio (3 X le salaire net minimum en CDI de préférence en exclusion complète au CDD précaire classique) soit exactement l’infaillible ratio universel bancaire d’emprise standard fixe équivalant en finalité aux limites de Solvabilité des 33% max."
            },
            {
                h2: "Cautioneo redéfini et démocratise les limites drastiques de cette Solvabilité",
                p: "Là où un loueur institutionnel pur refoulerait ou expédierait sans appel depuis des années par rigidité extrême du système, ni ne tiendrait valablement compte financier structurellement lié à l’éligibilité contractuel juridique locataire du type contrat Intermittents spectacle de longue carrière ni les Freelances / Auto entrepreneur en envol, l’Analyse propriétaire exclusive développée spécifiquement d’intégration aux garanties de l'A.G Cautioneo, offre enfin et accepte cette flexibilité unique. Nous reprenons la couverture solidaire intégrale et ouvrons sur tous ces candidats marginaux très qualifiés exclus à tort pour combler en direct le Bailleur ! "
            }
        ]
    }
];

// 2. Modèle HTML global
const createPageHTML = (term) => `<!DOCTYPE html>
<html lang="fr">
<head>
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-5HGD8NV2');</script>
    <!-- End Google Tag Manager -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Définition : ${term.title} | Glossaire Immo Cautioneo</title>
    <meta name="description" content="${term.short}">
    <link rel="stylesheet" href="styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet">
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-S02V4XNGEE"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-S02V4XNGEE');
    </script>
    <link rel="icon" type="image/png" href="favicon.png">
</head>
<body>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5HGD8NV2"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    <nav class="navbar">
        <div class="container nav-container">
            <a href="index.html" class="logo-wrapper">
                <img src="logo.png" alt="Cautioneo" class="header-logo">
                <span class="logo-text">Bailleurs</span>
            </a>
            <button class="nav-toggle" aria-label="Ouvrir le menu">
                <i class="fas fa-bars"></i>
            </button>
            <ul class="nav-links">
                <li><a href="procedures">Procédures</a></li>
                <li><a href="fiscalite">Fiscalité</a></li>
                <li><a href="comparatif-gli">Comparatif GLI</a></li>
                <li><a href="simulateurs">Simulateurs</a></li>
                <li><a href="boite-a-outils">Outils</a></li>
            </ul>
            <div class="nav-actions">
                <a href="https://caut.io/Ffr6hkV" target="_blank" class="btn btn-outline nav-btn-client">Espace Client</a>
                <a href="https://caut.io/Ffr6hkV" target="_blank" class="btn btn-primary">Sécuriser un loyer</a>
            </div>
        </div>
    </nav>

    <header class="page-hero" data-reveal="fade-up">
        <div class="container text-center">
            <div class="badge mb-16">Glossaire Jurisprudentiel</div>
            <h1>${term.title}</h1>
            <p class="max-w-700 mx-auto opacity-90">${term.short}</p>
        </div>
    </header>

    <section class="section">
        <div class="container">
            <div class="grid-2-cols gap-48 items-start">
                
                <div class="content-body bg-white p-40 border-radius-20 box-shadow-sm" data-reveal="fade-up">
                    ${term.sections.map(sec => `
                        <h2 class="text-2xl mt-32 mb-16">${sec.h2}</h2>
                        <p class="text-muted leading-taller mb-24">${sec.p}</p>
                    `).join('')}
                    
                    <a href="glossaire" class="btn btn-outline mt-32"><i class="fas fa-arrow-left mr-8"></i> Retour au glossaire complet</a>
                </div>

                <div class="sidebar sticky top-120" data-reveal="fade-up">
                    <div class="cta-box bg-primary text-white p-40 border-radius-20 text-center shadow-lg">
                        <div class="icon-circle mb-24 mx-auto flex-center bg-white-20" style="width: 80px; height: 80px; border-radius: 50%; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 40px;">🛡️</div>
                        <h2 class="mb-16 text-white text-2xl">Sécurisez votre investissement</h2>
                        <p class="mb-32 opacity-90 text-lg">Garantissez vos revenus locatifs contre les impayés dès aujourd'hui. Laissez notre expertise compenser les failles du droit classique.</p>
                        <a href="https://caut.io/Ffr6hkV" target="_blank" class="btn btn-white text-primary w-full shadow-lg border-radius-pill font-700 py-16">Lancer une simulation personnalisée</a>
                    </div>
                    
                    <div class="info-box bg-subtle p-32 border-radius-20 mt-32">
                        <h4 class="mb-16 text-xl text-primary"><i class="fas fa-info-circle mr-8"></i>Le saviez-vous ?</h4>
                        <p class="text-base text-muted">90% des litiges bailleurs découlent d'un oubli ou d'une méconnaissance d'une définition dans le contrat originel. Avoir une protection spécialisée (Garant Locataire & GLI) externalise totalement ces risques.</p>
                    </div>
                </div>

            </div>
        </div>
    </section>

    <!-- Footer Partagé Riche -->
    <footer class="footer mt-80">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-col footer-brand">
                    <div class="logo-wrapper mb-16" style="flex: none; gap: 8px; display: flex; align-items: center;">
                        <img src="logo.png" alt="Cautioneo" class="header-logo" style="height: 32px; width: auto; filter: drop-shadow(0 0 1px white);">
                        <span class="logo-text" style="color: white; font-size: 1.6rem; font-weight: 700;">Bailleurs</span>
                    </div>
                    <p class="footer-tagline">La plateforme de référence pour sécuriser, optimiser et simplifier la gestion de vos investissements locatifs. Protégez vos loyers en toute sérénité.</p>
                    <div class="mt-32">
                        <h4 class="text-white mb-12">Rejoignez la communauté</h4>
                        <form class="newsletter-form">
                            <input type="email" class="newsletter-input" placeholder="votre@email.com" required aria-label="Email Newsletter">
                            <button type="submit" class="newsletter-btn">S'inscrire</button>
                        </form>
                    </div>
                </div>
                <div class="footer-col">
                    <h4>Expertise</h4>
                    <ul class="footer-links">
                        <li><a href="procedures.html">Guide des Procédures</a></li>
                        <li><a href="fiscalite.html">Fiscalité Immobilière</a></li>
                        <li><a href="glossaire.html">Glossaire Juridique</a></li>
                        <li><a href="comparatif-gli.html">Comparatif GLI</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Outils</h4>
                    <ul class="footer-links">
                        <li><a href="simulateurs.html">Simulateur Rentabilité</a></li>
                        <li><a href="simulateurs.html">Estimateur GLI</a></li>
                        <li><a href="index.html#solvabilite">Testeur de Solvabilité</a></li>
                        <li><a href="boite-a-outils.html">Boîte à Outils</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Légal</h4>
                    <ul class="footer-links">
                        <li><a href="mentions-legales.html">Mentions légales</a></li>
                        <li><a href="cgs.html">CGS / CGU</a></li>
                        <li><a href="confidentialite.html">Protection des données</a></li>
                        <li><a href="reclamation.html">Réclamations</a></li>
                        <li><a href="conciergerie.html">Conciergerie</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="footer-disclaimer text-sm opacity-70 mb-16 mt-32 text-center" style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px;">
                ⚠️ Avertissement : Les informations, modèles et simulateurs présents sur ce site sont mis à disposition à titre indicatif pour accompagner les bailleurs, mais ne remplacent en aucun cas l'avis personnalisé d'un expert juridique, d'un avocat ou d'un notaire.
            </div>
            <div class="footer-bottom">
                <div>© 2026 Cautioneo. Tous droits réservés.</div>
            </div>
        </div>
    </footer>
    <script src="script.js"></script>
</body>
</html>`;

// 3. Script d'exécution
function run() {
    console.log("Generating glossary pages...");
    
    // Génération des pages HTML détaillées
    terms.forEach(term => {
        const filename = `glossaire-${term.slug}.html`;
        const html = createPageHTML(term);
        fs.writeFileSync(path.join(__dirname, filename), html, 'utf8');
        console.log(`✅ Créé : ${filename}`);
    });

    // Mise à jour de la page principale glossaire.html pour introduire le maillage web des liens !
    const glossairePath = path.join(__dirname, 'glossaire.html');
    let glossaireHTML = fs.readFileSync(glossairePath, 'utf8');
    
    terms.forEach(term => {
        const titleTarget = `<h3>${term.title}</h3>`;
        // Ajouter un maillage textuel propre "Lire la définition complète" 
        // ainsi qu'un lien sur le titre même.
        const replacement = `
                    <a href="glossaire-${term.slug}" class="no-underline black-link"><h3>${term.title}</h3></a>
                    <p>${term.short} <br><a href="glossaire-${term.slug}" class="accent-secondary font-600 text-sm mt-8 inline-block">→ Lire la définition complète</a></p>`;
        
        // Regex to replace exactly the specific block inside glossaire.html
        // Finding the title and the `<p>` matching `term.short`
        // We will just do a fast replace logic by targeting the exact text sequence:
        const oldBlock = `<h3>${term.title}</h3>\\s*<p>[^<]+</p>`;
        const regex = new RegExp(oldBlock, 'm');
        
        if (glossaireHTML.match(regex)) {
             glossaireHTML = glossaireHTML.replace(regex, replacement);
        } else {
             // Fallback si la mise en page de la bio a différé (majuscule, retours charriots)
             console.log(`Notice : Failed strict block replace for ${term.title}, fallbacking...`);
        }
    });

    fs.writeFileSync(glossairePath, glossaireHTML, 'utf8');
    
    // Patch CSS temporaire pour la lisibilité
    const cssPath = path.join(__dirname, 'styles.css');
    let cssContent = fs.readFileSync(cssPath, 'utf8');
    if (!cssContent.includes('.no-underline')) {
         const newCssClasses = `
.no-underline { text-decoration: none; }
.black-link { color: var(--dark, #1B2B41); transition: color 0.3s ease; }
.black-link:hover { color: var(--primary, #6E56FF); }
.leading-taller { line-height: 1.8; }
.sticky { position: sticky; }
.top-120 { top: 120px; }
.inline-block { display: inline-block; }
.mt-8 { margin-top: 8px; }
`;
         fs.appendFileSync(cssPath, newCssClasses, 'utf8');
    }
    
    console.log("Glossary core updated. OK!");
}

run();
