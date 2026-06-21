// Données des pages locales SEO (playbook "Locations").
// Chaque ville a un contenu UNIQUE pour éviter le contenu mince (pénalité Google).
// URL : /livraison-petit-dejeuner-{slug}

export interface CityUseCase {
  title: string;
  title_en: string;
  text: string;
  text_en: string;
}

export interface CityFaq {
  q: string;
  q_en: string;
  a: string;
  a_en: string;
}

export interface City {
  slug: string;
  name: string;
  /** Estimation distance routière depuis le local (371 Chemin des Prés, Biot). */
  deliveryTime: string;
  deliveryTime_en: string;
  /** Phrase d'intro unique (H1 lead). */
  intro: string;
  intro_en: string;
  /** Quartiers réellement desservis. */
  quartiers: string[];
  /** Paragraphe de contexte local (saveur locale, non générique). */
  context: string;
  context_en: string;
  /** Note honnête de couverture quand toute la ville n'est pas livrée. */
  coverageNote?: string;
  coverageNote_en?: string;
  useCases: CityUseCase[];
  faq: CityFaq[];
  metaTitle: string;
  metaTitle_en: string;
  metaDesc: string;
  metaDesc_en: string;
}

export const cities: City[] = [
  {
    slug: "cannes",
    name: "Cannes",
    deliveryTime: "30 à 45 minutes",
    deliveryTime_en: "30 to 45 minutes",
    intro:
      "Faites-vous livrer un petit-déjeuner ou un brunch frais directement chez vous à Cannes — préparé le matin même et déposé à votre porte, 7j/7 de 8h à 15h.",
    intro_en:
      "Get a fresh breakfast or brunch delivered straight to your door in Cannes — prepared the same morning and delivered, 7 days a week from 8am to 3pm.",
    quartiers: ["La Croisette", "Le Suquet", "La Bocca", "Palm Beach", "Carnot", "La Californie"],
    context:
      "Que vous soyez en bord de Croisette, dans les ruelles du Suquet ou côté La Bocca, Breakfast Time vous livre un vrai petit-déjeuner de qualité sans bouger de chez vous. Idéal pour un réveil en douceur face à la mer, un brunch entre amis après une soirée, ou pour recevoir des invités pendant la saison des festivals.",
    context_en:
      "Whether you're by the Croisette, in the alleys of Le Suquet or over in La Bocca, Breakfast Time delivers a proper quality breakfast without you leaving home. Perfect for a gentle wake-up facing the sea, a brunch with friends after a night out, or hosting guests during festival season.",
    useCases: [
      {
        title: "Brunch du dimanche",
        title_en: "Sunday brunch",
        text: "Pancakes, bagels, œufs bénédicte et jus frais livrés pour un dimanche paresseux sans cuisine ni vaisselle.",
        text_en: "Pancakes, bagels, eggs benedict and fresh juice delivered for a lazy Sunday — no cooking, no dishes.",
      },
      {
        title: "Réception d'invités",
        title_en: "Hosting guests",
        text: "Vous recevez pendant un festival ou un week-end ? Un plateau de viennoiseries ou un Menu Famille fait toute la différence.",
        text_en: "Hosting during a festival or a weekend? A pastry platter or a Family Menu makes all the difference.",
      },
      {
        title: "Petit-déjeuner d'équipe",
        title_en: "Team breakfast",
        text: "Bureaux à Cannes ou La Bocca : régalez votre équipe avec des petits-déjeuners livrés et installés.",
        text_en: "Offices in Cannes or La Bocca: treat your team to breakfasts delivered and set up.",
      },
    ],
    faq: [
      {
        q: "Livrez-vous des petits-déjeuners sur toute la commune de Cannes ?",
        q_en: "Do you deliver breakfast across all of Cannes?",
        a: "Oui, nous livrons l'ensemble de Cannes : La Croisette, Le Suquet, La Bocca, Palm Beach, le centre et les quartiers résidentiels.",
        a_en: "Yes, we deliver across all of Cannes: La Croisette, Le Suquet, La Bocca, Palm Beach, the centre and residential areas.",
      },
      {
        q: "En combien de temps suis-je livré à Cannes ?",
        q_en: "How long does delivery to Cannes take?",
        a: "Comptez environ 30 à 45 minutes après confirmation de votre commande, selon le quartier et l'affluence.",
        a_en: "Allow around 30 to 45 minutes after your order is confirmed, depending on the area and traffic.",
      },
      {
        q: "Puis-je commander un brunch pour un événement à Cannes ?",
        q_en: "Can I order brunch for an event in Cannes?",
        a: "Oui. Pour les groupes, entreprises et événements, demandez un devis via notre page Événements.",
        a_en: "Yes. For groups, companies and events, request a quote via our Events page.",
      },
    ],
    metaTitle: "Livraison petit-déjeuner Cannes — Brunch à domicile | Breakfast Time",
    metaTitle_en: "Breakfast Delivery Cannes — Brunch at Home | Breakfast Time",
    metaDesc:
      "Livraison de petit-déjeuner et brunch à domicile à Cannes (Croisette, Le Suquet, La Bocca). Produits frais, livrés en 30-45 min, 7j/7 de 8h à 15h.",
    metaDesc_en:
      "Breakfast and brunch delivery in Cannes (Croisette, Le Suquet, La Bocca). Fresh products, delivered in 30-45 min, 7 days a week from 8am to 3pm.",
  },
  {
    slug: "antibes",
    name: "Antibes",
    deliveryTime: "30 à 45 minutes",
    deliveryTime_en: "30 to 45 minutes",
    intro:
      "Breakfast Time livre votre petit-déjeuner et votre brunch à domicile partout à Antibes — frais, préparés le matin même, 7j/7 de 8h à 15h.",
    intro_en:
      "Breakfast Time delivers your breakfast and brunch at home anywhere in Antibes — fresh, prepared the same morning, 7 days a week from 8am to 3pm.",
    quartiers: ["Vieil Antibes", "Cap d'Antibes", "La Fontonne", "Les Semboules", "Le Port Vauban", "La Brague"],
    context:
      "Du Vieil Antibes au Cap, en passant par La Fontonne et Les Semboules, votre petit-déjeuner arrive chaud et soigné. Le matin face au port Vauban ou dans votre jardin antibois, c'est encore meilleur quand c'est livré.",
    context_en:
      "From Vieil Antibes to the Cap, through La Fontonne and Les Semboules, your breakfast arrives warm and beautifully prepared. Mornings facing Port Vauban or in your Antibes garden are even better when delivered.",
    useCases: [
      {
        title: "Le réveil tranquille",
        title_en: "The quiet wake-up",
        text: "Croissants pur beurre, jus pressé et café livrés avant même que vous soyez vraiment réveillé.",
        text_en: "Pure-butter croissants, pressed juice and coffee delivered before you're even fully awake.",
      },
      {
        title: "Anniversaire surprise",
        title_en: "Surprise birthday",
        text: "Notre Birthday Box avec gâteau de pancakes, bougies et message personnalisé, livrée à domicile.",
        text_en: "Our Birthday Box with pancake cake, candles and a personalised message, delivered to the door.",
      },
      {
        title: "Brunch en famille",
        title_en: "Family brunch",
        text: "Le Menu Famille rassemble tout le monde autour de la table sans passer la matinée en cuisine.",
        text_en: "The Family Menu brings everyone around the table without spending the morning cooking.",
      },
    ],
    faq: [
      {
        q: "Puis-je être livré le matin même à Antibes ?",
        q_en: "Can I get same-day delivery in Antibes?",
        a: "Oui, nous livrons à Antibes le jour même, 7j/7 de 8h à 15h. Il vous suffit de passer commande en ligne.",
        a_en: "Yes, we deliver in Antibes the same day, 7 days a week from 8am to 3pm. Just place your order online.",
      },
      {
        q: "Livrez-vous le Cap d'Antibes et Les Semboules ?",
        q_en: "Do you deliver to Cap d'Antibes and Les Semboules?",
        a: "Oui, nous couvrons tout Antibes : Vieil Antibes, Cap d'Antibes, La Fontonne, Les Semboules, le port et La Brague.",
        a_en: "Yes, we cover all of Antibes: Vieil Antibes, Cap d'Antibes, La Fontonne, Les Semboules, the port and La Brague.",
      },
      {
        q: "Puis-je commander un petit-déjeuner d'anniversaire à Antibes ?",
        q_en: "Can I order a birthday breakfast in Antibes?",
        a: "Oui, notre Birthday Box (gâteau de pancakes, bougies et message personnalisé) est livrée à domicile partout à Antibes pour surprendre vos proches.",
        a_en: "Yes, our Birthday Box (pancake cake, candles and a personalised message) is delivered to any address in Antibes to surprise your loved ones.",
      },
    ],
    metaTitle: "Livraison petit-déjeuner Antibes — Brunch à domicile | Breakfast Time",
    metaTitle_en: "Breakfast Delivery Antibes — Brunch at Home | Breakfast Time",
    metaDesc:
      "Livraison de petit-déjeuner et brunch à domicile à Antibes (Vieil Antibes, Cap d'Antibes, La Fontonne). Frais, livrés en 30-45 min, 7j/7 de 8h à 15h.",
    metaDesc_en:
      "Breakfast and brunch delivery in Antibes (old town, Cap d'Antibes, La Fontonne). Fresh, delivered in 30-45 min, 7 days a week from 8am to 3pm.",
  },
  {
    slug: "juan-les-pins",
    name: "Juan-les-Pins",
    deliveryTime: "30 à 45 minutes",
    deliveryTime_en: "30 to 45 minutes",
    intro:
      "Petit-déjeuner et brunch livrés à domicile à Juan-les-Pins — produits frais préparés le matin même, déposés chez vous 7j/7 de 8h à 15h.",
    intro_en:
      "Breakfast and brunch delivered at home in Juan-les-Pins — fresh products prepared the same morning, delivered 7 days a week from 8am to 3pm.",
    quartiers: ["Centre de Juan-les-Pins", "La Pinède", "Les plages", "Le Cap", "La Gallice"],
    context:
      "Station balnéaire animée, Juan-les-Pins se savoure encore mieux au réveil. Que vous soyez près de la Pinède, à deux pas des plages ou dans une location de vacances, Breakfast Time vous apporte un petit-déjeuner frais sans avoir à chercher une boulangerie ouverte. Parfait pour prolonger les matinées d'été et les week-ends en bord de mer.",
    context_en:
      "A lively seaside resort, Juan-les-Pins is even better enjoyed at breakfast. Whether you're near the Pinède, steps from the beaches or in a holiday rental, Breakfast Time brings you a fresh breakfast without hunting for an open bakery. Perfect for stretching out summer mornings and seaside weekends.",
    useCases: [
      {
        title: "Vacances & locations",
        title_en: "Holidays & rentals",
        text: "En Airbnb ou en location, recevez un vrai petit-déjeuner livré sans connaître les commerces du coin.",
        text_en: "In an Airbnb or rental, get a proper breakfast delivered without knowing the local shops.",
      },
      {
        title: "Matin de plage",
        title_en: "Beach morning",
        text: "Bowls, smoothies et açaí bowl pour un petit-déjeuner léger avant la plage.",
        text_en: "Bowls, smoothies and açaí bowl for a light breakfast before the beach.",
      },
      {
        title: "Brunch entre amis",
        title_en: "Brunch with friends",
        text: "Un plateau de pancakes ou un Menu Duo à partager sur la terrasse, sans rien préparer.",
        text_en: "A pancake platter or Duo Menu to share on the terrace, with nothing to prepare.",
      },
    ],
    faq: [
      {
        q: "Livrez-vous dans les locations de vacances à Juan-les-Pins ?",
        q_en: "Do you deliver to holiday rentals in Juan-les-Pins?",
        a: "Oui, nous livrons à toute adresse de Juan-les-Pins, y compris les locations saisonnières et Airbnb.",
        a_en: "Yes, we deliver to any address in Juan-les-Pins, including seasonal rentals and Airbnbs.",
      },
      {
        q: "Quel délai pour être livré à Juan-les-Pins ?",
        q_en: "How long for delivery to Juan-les-Pins?",
        a: "Comptez environ 30 à 45 minutes après confirmation de votre commande.",
        a_en: "Allow around 30 to 45 minutes after your order is confirmed.",
      },
      {
        q: "Proposez-vous des options végétariennes ?",
        q_en: "Do you offer vegetarian options?",
        a: "Oui, notre Menu Veggie et de nombreux produits (bowls, toasts, smoothies) sont végétariens.",
        a_en: "Yes, our Veggie Menu and many products (bowls, toasts, smoothies) are vegetarian.",
      },
    ],
    metaTitle: "Livraison petit-déjeuner Juan-les-Pins — Brunch à domicile | Breakfast Time",
    metaTitle_en: "Breakfast Delivery Juan-les-Pins — Brunch at Home | Breakfast Time",
    metaDesc:
      "Livraison de petit-déjeuner et brunch à domicile à Juan-les-Pins (Pinède, plages, locations). Frais, livrés en 30-45 min, 7j/7 de 8h à 15h.",
    metaDesc_en:
      "Breakfast and brunch delivery in Juan-les-Pins (Pinède, beaches, rentals). Fresh, delivered in 30-45 min, 7 days a week from 8am to 3pm.",
  },
  {
    slug: "sophia-antipolis",
    name: "Sophia Antipolis",
    deliveryTime: "30 à 45 minutes",
    deliveryTime_en: "30 to 45 minutes",
    intro:
      "Que vous habitiez, étudiiez ou travailliez à Sophia Antipolis, Breakfast Time vous livre un petit-déjeuner frais — à domicile comme au bureau — préparé le matin même, 7j/7 de 8h à 15h.",
    intro_en:
      "Whether you live, study or work in Sophia Antipolis, Breakfast Time delivers a fresh breakfast — at home or at the office — prepared the same morning, 7 days a week from 8am to 3pm.",
    quartiers: ["Les Lucioles", "Garbejaire", "Saint-Philippe", "Les Templiers", "Valbonne village", "Le parc d'activités"],
    context:
      "Première technopole d'Europe, Sophia Antipolis ne se résume pas à ses bureaux : c'est aussi un lieu de vie, entre résidences, campus et quartiers comme Garbejaire ou Les Lucioles. Un petit-déjeuner frais livré avant une journée chargée, un brunch tranquille le week-end ou un plateau à partager avec les collègues : Breakfast Time s'adapte à toutes vos matinées, à quelques minutes de notre local.",
    context_en:
      "Europe's leading technology park, Sophia Antipolis is more than its offices: it's also a place to live, between residences, campuses and neighbourhoods like Garbejaire and Les Lucioles. A fresh breakfast delivered before a busy day, a relaxed weekend brunch or a platter to share with colleagues: Breakfast Time fits every morning, just minutes from our kitchen.",
    useCases: [
      {
        title: "Avant une journée chargée",
        title_en: "Before a busy day",
        text: "Un petit-déjeuner frais livré chez vous ou au bureau pour bien démarrer, sans détour par la boulangerie.",
        text_en: "A fresh breakfast delivered to your home or office to start right, no bakery detour needed.",
      },
      {
        title: "Brunch du week-end",
        title_en: "Weekend brunch",
        text: "Bowls, pancakes, bagels et boissons livrés tranquillement le week-end, sans sortir de chez vous.",
        text_en: "Bowls, pancakes, bagels and drinks delivered for a relaxed weekend, without leaving home.",
      },
      {
        title: "Petit-déjeuner d'équipe",
        title_en: "Team breakfast",
        text: "Le « Friday Breakfast » qui réunit l'équipe : viennoiseries, café et jus livrés au bureau.",
        text_en: "The 'Friday Breakfast' that brings the team together: pastries, coffee and juice delivered to the office.",
      },
    ],
    faq: [
      {
        q: "Livrez-vous à domicile à Sophia Antipolis ?",
        q_en: "Do you deliver to homes in Sophia Antipolis?",
        a: "Oui, nous livrons aussi bien les logements et résidences que les bureaux de toute la technopole : Garbejaire, Les Lucioles, Saint-Philippe, Les Templiers et alentours.",
        a_en: "Yes, we deliver to homes and residences as well as offices across the whole park: Garbejaire, Les Lucioles, Saint-Philippe, Les Templiers and nearby areas.",
      },
      {
        q: "Puis-je être livré le matin même à Sophia Antipolis ?",
        q_en: "Can I get same-day delivery in Sophia Antipolis?",
        a: "Oui, nous livrons le jour même à partir de 8h, 7j/7. Il vous suffit de passer commande en ligne.",
        a_en: "Yes, we deliver the same day from 8am, 7 days a week. Just place your order online.",
      },
      {
        q: "Et pour un petit-déjeuner d'équipe ou un événement ?",
        q_en: "What about a team breakfast or an event?",
        a: "Pour les commandes groupées, réunions et séminaires, demandez un devis via notre page Événements.",
        a_en: "For group orders, meetings and seminars, request a quote via our Events page.",
      },
    ],
    metaTitle: "Livraison petit-déjeuner Sophia Antipolis — À domicile & bureau | Breakfast Time",
    metaTitle_en: "Breakfast Delivery Sophia Antipolis — Home & Office | Breakfast Time",
    metaDesc:
      "Livraison de petit-déjeuner et brunch à Sophia Antipolis, à domicile comme au bureau (Garbejaire, Les Lucioles, Les Templiers). Frais, le jour même, 7j/7 de 8h à 15h.",
    metaDesc_en:
      "Breakfast and brunch delivery in Sophia Antipolis, at home or at the office (Garbejaire, Les Lucioles, Les Templiers). Fresh, same day, 7 days a week from 8am to 3pm.",
  },
  {
    slug: "nice",
    name: "Nice",
    deliveryTime: "30 à 45 minutes",
    deliveryTime_en: "30 to 45 minutes",
    intro:
      "Breakfast Time livre petits-déjeuners et brunchs frais dans l'ouest de Nice — zone aéroport, Arénas et Saint-Augustin — préparés le matin même, 7j/7 de 8h à 15h.",
    intro_en:
      "Breakfast Time delivers fresh breakfasts and brunches in western Nice — airport area, Arénas and Saint-Augustin — prepared the same morning, 7 days a week from 8am to 3pm.",
    quartiers: ["Nice Ouest", "Aéroport / Arénas", "Saint-Augustin", "Saint-Isidore", "Sainte-Marguerite"],
    coverageNote:
      "Depuis notre local à Biot, nous livrons actuellement l'ouest de Nice (zone aéroport, Arénas, Saint-Augustin, Saint-Isidore). Le centre-ville et l'est de Nice sont hors de notre zone de livraison pour le moment.",
    coverageNote_en:
      "From our kitchen in Biot, we currently deliver to western Nice (airport area, Arénas, Saint-Augustin, Saint-Isidore). The city centre and eastern Nice are outside our delivery area for now.",
    context:
      "L'ouest de Nice, autour de l'aéroport, d'Arénas et de Saint-Augustin, est à portée de livraison depuis notre local de Biot. Entreprises de la plaine du Var, hôtels près de l'aéroport ou résidents de Nice Ouest : profitez d'un petit-déjeuner frais livré à domicile ou au bureau, sans détour par une boulangerie.",
    context_en:
      "Western Nice, around the airport, Arénas and Saint-Augustin, is within delivery reach from our Biot kitchen. Companies in the Var plain, hotels near the airport or residents of western Nice: enjoy a fresh breakfast delivered at home or to the office, no bakery detour needed.",
    useCases: [
      {
        title: "Bureaux plaine du Var",
        title_en: "Var plain offices",
        text: "Petit-déjeuner d'équipe livré aux entreprises de Nice Ouest, Arénas et de la plaine du Var.",
        text_en: "Team breakfast delivered to companies in western Nice, Arénas and the Var plain.",
      },
      {
        title: "Près de l'aéroport",
        title_en: "Near the airport",
        text: "Un petit-déjeuner frais livré avant un vol matinal ou pour accueillir des visiteurs.",
        text_en: "A fresh breakfast delivered before an early flight or to welcome visitors.",
      },
      {
        title: "Brunch à domicile",
        title_en: "Brunch at home",
        text: "Résidents de Saint-Augustin ou Saint-Isidore : brunch livré le week-end, sans cuisine.",
        text_en: "Residents of Saint-Augustin or Saint-Isidore: brunch delivered at the weekend, no cooking.",
      },
    ],
    faq: [
      {
        q: "Livrez-vous dans tout Nice ?",
        q_en: "Do you deliver across all of Nice?",
        a: "Pas encore. Depuis notre local de Biot, nous livrons l'ouest de Nice (aéroport, Arénas, Saint-Augustin, Saint-Isidore). Le centre et l'est de Nice ne sont pas encore desservis.",
        a_en: "Not yet. From our Biot kitchen we deliver western Nice (airport, Arénas, Saint-Augustin, Saint-Isidore). Central and eastern Nice are not covered yet.",
      },
      {
        q: "Quel est le délai de livraison vers Nice Ouest ?",
        q_en: "What's the delivery time to western Nice?",
        a: "Comptez environ 30 à 45 minutes selon le trafic, l'ouest de Nice étant à la limite de notre zone.",
        a_en: "Allow around 30 to 45 minutes depending on traffic, as western Nice is at the edge of our area.",
      },
      {
        q: "Livrez-vous les entreprises près de l'aéroport de Nice ?",
        q_en: "Do you deliver to companies near Nice airport?",
        a: "Oui, nous livrons les bureaux de la zone aéroport, Arénas et de la plaine du Var. Demandez un devis pour les commandes groupées.",
        a_en: "Yes, we deliver to offices in the airport area, Arénas and the Var plain. Request a quote for group orders.",
      },
    ],
    metaTitle: "Livraison petit-déjeuner Nice Ouest — Brunch à domicile | Breakfast Time",
    metaTitle_en: "Breakfast Delivery Western Nice — Brunch at Home | Breakfast Time",
    metaDesc:
      "Livraison de petit-déjeuner et brunch dans l'ouest de Nice (aéroport, Arénas, Saint-Augustin). Frais, préparés le matin même, 7j/7 de 8h à 15h.",
    metaDesc_en:
      "Breakfast and brunch delivery in western Nice (airport, Arénas, Saint-Augustin). Fresh, prepared the same morning, 7 days a week from 8am to 3pm.",
  },
];

export const getCityBySlug = (slug: string): City | undefined =>
  cities.find((c) => c.slug === slug);
