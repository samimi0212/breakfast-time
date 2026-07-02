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
    context:
      "L'ouest de Nice, autour de l'aéroport, d'Arénas et de Saint-Augustin, est à portée de livraison. Hôtels près de l'aéroport, bureaux du secteur ou résidents de Nice Ouest : profitez d'un petit-déjeuner frais livré à domicile ou au bureau, sans détour par une boulangerie.",
    context_en:
      "Western Nice, around the airport, Arénas and Saint-Augustin, is within delivery reach. Hotels near the airport, local offices or residents of western Nice: enjoy a fresh breakfast delivered at home or to the office, no bakery detour needed.",
    useCases: [
      {
        title: "Bureaux de Nice Ouest",
        title_en: "Western Nice offices",
        text: "Petit-déjeuner d'équipe livré aux entreprises de Nice Ouest, du secteur aéroport et d'Arénas.",
        text_en: "Team breakfast delivered to companies in western Nice, the airport area and Arénas.",
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
        q: "Quels quartiers de Nice livrez-vous ?",
        q_en: "Which areas of Nice do you deliver to?",
        a: "Nous livrons l'ouest de Nice : aéroport, Arénas, Saint-Augustin, Saint-Isidore et Sainte-Marguerite, à domicile comme au bureau.",
        a_en: "We deliver to western Nice: airport, Arénas, Saint-Augustin, Saint-Isidore and Sainte-Marguerite, at home or at the office.",
      },
      {
        q: "Puis-je être livré le matin même à Nice ?",
        q_en: "Can I get same-day delivery in Nice?",
        a: "Oui, nous livrons le jour même à partir de 8h, 7j/7. Il vous suffit de passer commande en ligne.",
        a_en: "Yes, we deliver the same day from 8am, 7 days a week. Just place your order online.",
      },
      {
        q: "Livrez-vous les entreprises près de l'aéroport de Nice ?",
        q_en: "Do you deliver to companies near Nice airport?",
        a: "Oui, nous livrons les bureaux de la zone aéroport, d'Arénas et de Nice Ouest. Demandez un devis pour les commandes groupées.",
        a_en: "Yes, we deliver to offices in the airport area, Arénas and western Nice. Request a quote for group orders.",
      },
    ],
    metaTitle: "Livraison petit-déjeuner Nice Ouest — Brunch à domicile | Breakfast Time",
    metaTitle_en: "Breakfast Delivery Western Nice — Brunch at Home | Breakfast Time",
    metaDesc:
      "Livraison de petit-déjeuner et brunch dans l'ouest de Nice (aéroport, Arénas, Saint-Augustin). Frais, préparés le matin même, 7j/7 de 8h à 15h.",
    metaDesc_en:
      "Breakfast and brunch delivery in western Nice (airport, Arénas, Saint-Augustin). Fresh, prepared the same morning, 7 days a week from 8am to 3pm.",
  },
  {
    slug: "biot",
    name: "Biot",
    deliveryTime: "15 à 25 minutes",
    deliveryTime_en: "15 to 25 minutes",
    intro:
      "Petit-déjeuner et brunch frais livrés à Biot en 15 à 25 minutes — notre zone de livraison la plus rapide, 7j/7 de 8h à 15h.",
    intro_en:
      "Fresh breakfast and brunch delivered in Biot in 15 to 25 minutes — our fastest delivery area, 7 days a week from 8am to 3pm.",
    quartiers: ["Village historique", "Saint-Philippe", "Sophia Antipolis (côté Biot)", "La Brague", "Gare de Biot"],
    context:
      "Biot est notre zone la mieux desservie : du village des verriers aux quartiers proches de Sophia Antipolis, votre commande arrive rapidement et encore chaude. Résidents, télétravailleurs ou vacanciers en villa, profitez d'un vrai petit-déjeuner sans sortir de chez vous.",
    context_en:
      "Biot is our best-served area: from the glassblowers' village to the neighbourhoods near Sophia Antipolis, your order arrives quickly and still warm. Residents, remote workers or holidaymakers in villas — enjoy a proper breakfast without leaving home.",
    useCases: [
      {
        title: "Livraison express",
        title_en: "Express delivery",
        text: "Biot est notre zone la plus rapide : commande livrée en 15 à 25 minutes, souvent moins.",
        text_en: "Biot is our fastest area: orders delivered in 15 to 25 minutes, often less.",
      },
      {
        title: "Télétravail gourmand",
        title_en: "Working from home",
        text: "Petit-déjeuner ou brunch livré à domicile pendant votre journée de télétravail, sans perdre une minute.",
        text_en: "Breakfast or brunch delivered to your door on your work-from-home day, without losing a minute.",
      },
      {
        title: "Vacances en villa",
        title_en: "Villa holidays",
        text: "En location saisonnière à Biot ? Réveillez toute la maisonnée avec un Menu Famille livré au portail.",
        text_en: "Staying in a holiday rental in Biot? Wake the whole household with a Family Menu delivered to the gate.",
      },
    ],
    faq: [
      {
        q: "Livrez-vous partout à Biot ?",
        q_en: "Do you deliver everywhere in Biot?",
        a: "Oui, toute la commune : le village historique, Saint-Philippe, La Brague, la gare et les quartiers résidentiels.",
        a_en: "Yes, the whole town: the historic village, Saint-Philippe, La Brague, the station area and residential neighbourhoods.",
      },
      {
        q: "Quel est le délai de livraison à Biot ?",
        q_en: "How fast is delivery in Biot?",
        a: "Entre 15 et 25 minutes après confirmation de votre commande — Biot est notre zone de livraison la plus rapide.",
        a_en: "Between 15 and 25 minutes after your order is confirmed — Biot is our fastest delivery area.",
      },
      {
        q: "Peut-on commander pour un événement à Biot ?",
        q_en: "Can I order for an event in Biot?",
        a: "Oui, brunchs de groupe, anniversaires et petits-déjeuners d'entreprise : demandez un devis via notre page Événements.",
        a_en: "Yes — group brunches, birthdays and corporate breakfasts: request a quote via our Events page.",
      },
    ],
    metaTitle: "Livraison petit-déjeuner Biot — Brunch à domicile | Breakfast Time",
    metaTitle_en: "Breakfast Delivery Biot — Brunch at Home | Breakfast Time",
    metaDesc:
      "Livraison de petit-déjeuner et brunch à Biot en 15-25 min, notre zone la plus rapide. Produits frais du matin, 7j/7 de 8h à 15h.",
    metaDesc_en:
      "Breakfast and brunch delivery in Biot in 15-25 min, our fastest area. Fresh morning products, 7 days a week from 8am to 3pm.",
  },
  {
    slug: "valbonne",
    name: "Valbonne",
    deliveryTime: "20 à 30 minutes",
    deliveryTime_en: "20 to 30 minutes",
    intro:
      "Petit-déjeuner et brunch frais livrés à Valbonne et Sophia Antipolis en 20 à 30 minutes — à la maison comme au bureau, 7j/7 de 8h à 15h.",
    intro_en:
      "Fresh breakfast and brunch delivered to Valbonne and Sophia Antipolis in 20 to 30 minutes — at home or at the office, 7 days a week from 8am to 3pm.",
    quartiers: ["Village de Valbonne", "Garbejaïre", "Haut-Sartoux", "Île Verte", "Les Clausonnes", "Sophia Antipolis"],
    context:
      "Entre le village provençal de Valbonne et les entreprises de Sophia Antipolis, les matins sont souvent trop courts. Petit-déjeuner d'équipe livré avant une réunion, brunch du week-end près de la place des Arcades ou à Garbejaïre : commandez en ligne, on s'occupe du reste. Site et service disponibles en anglais pour la communauté internationale.",
    context_en:
      "Between Valbonne's Provençal village and the companies of Sophia Antipolis, mornings are often too short. Team breakfast delivered before a meeting, weekend brunch near the Place des Arcades or in Garbejaïre: order online, we handle the rest. Website and service fully available in English for the international community.",
    useCases: [
      {
        title: "Petit-déjeuner d'entreprise",
        title_en: "Corporate breakfast",
        text: "Réunions, séminaires et comités à Sophia Antipolis : plateaux livrés et installés à l'heure, devis rapide.",
        text_en: "Meetings, seminars and boards in Sophia Antipolis: platters delivered and set up on time, quick quote.",
      },
      {
        title: "Brunch du week-end",
        title_en: "Weekend brunch",
        text: "Pancakes, bagels et jus pressés livrés à domicile au village, à l'Île Verte ou au Haut-Sartoux.",
        text_en: "Pancakes, bagels and fresh juices delivered to your home in the village, Île Verte or Haut-Sartoux.",
      },
      {
        title: "English breakfast",
        title_en: "English breakfast",
        text: "Expatriés et internationaux de Valbonne : notre Menu Anglais complet arrive chaud, commandé en 2 minutes.",
        text_en: "Valbonne's expat community: our full English Breakfast arrives hot, ordered in 2 minutes.",
      },
    ],
    faq: [
      {
        q: "Livrez-vous les entreprises de Sophia Antipolis côté Valbonne ?",
        q_en: "Do you deliver to Sophia Antipolis companies on the Valbonne side?",
        a: "Oui, Garbejaïre, Haut-Sartoux, Les Clausonnes et toute la technopole. Pour les groupes, demandez un devis Événements.",
        a_en: "Yes — Garbejaïre, Haut-Sartoux, Les Clausonnes and the whole technology park. For groups, request an Events quote.",
      },
      {
        q: "En combien de temps suis-je livré à Valbonne ?",
        q_en: "How long does delivery to Valbonne take?",
        a: "Comptez 20 à 30 minutes après confirmation de votre commande, selon le quartier.",
        a_en: "Allow 20 to 30 minutes after your order is confirmed, depending on the area.",
      },
      {
        q: "Proposez-vous un service en anglais ?",
        q_en: "Is your service available in English?",
        a: "Oui, le site existe en version anglaise et toute la carte est traduite — pratique pour la communauté internationale de Valbonne.",
        a_en: "Yes, the website has a full English version and the whole menu is translated — handy for Valbonne's international community.",
      },
    ],
    metaTitle: "Livraison petit-déjeuner Valbonne & Sophia — Brunch livré | Breakfast Time",
    metaTitle_en: "Breakfast Delivery Valbonne & Sophia — Brunch Delivered | Breakfast Time",
    metaDesc:
      "Livraison de petit-déjeuner et brunch à Valbonne et Sophia Antipolis (Garbejaïre, Haut-Sartoux). Frais, livrés en 20-30 min, 7j/7 de 8h à 15h.",
    metaDesc_en:
      "Breakfast and brunch delivery in Valbonne and Sophia Antipolis (Garbejaïre, Haut-Sartoux). Fresh, delivered in 20-30 min, 7 days a week from 8am to 3pm.",
  },
  {
    slug: "cagnes-sur-mer",
    name: "Cagnes-sur-Mer",
    deliveryTime: "25 à 40 minutes",
    deliveryTime_en: "25 to 40 minutes",
    intro:
      "Faites-vous livrer un petit-déjeuner ou un brunch frais à Cagnes-sur-Mer — du Cros-de-Cagnes au Haut-de-Cagnes, préparé le matin même, 7j/7 de 8h à 15h.",
    intro_en:
      "Get a fresh breakfast or brunch delivered in Cagnes-sur-Mer — from Cros-de-Cagnes to Haut-de-Cagnes, prepared the same morning, 7 days a week from 8am to 3pm.",
    quartiers: ["Centre-ville", "Cros-de-Cagnes", "Haut-de-Cagnes", "Les Collettes", "Val Fleuri", "Polygone Riviera"],
    context:
      "Matin en bord de mer au Cros, ruelles médiévales du Haut-de-Cagnes ou résidences autour du Polygone Riviera : Breakfast Time livre un petit-déjeuner complet ou un brunch gourmand partout à Cagnes-sur-Mer. Parfait pour un dimanche en famille, des invités de passage ou un réveil paresseux face à la Méditerranée.",
    context_en:
      "Seaside mornings at the Cros, medieval lanes of Haut-de-Cagnes or residences around Polygone Riviera: Breakfast Time delivers a full breakfast or an indulgent brunch anywhere in Cagnes-sur-Mer. Perfect for a family Sunday, visiting guests or a lazy wake-up facing the Mediterranean.",
    useCases: [
      {
        title: "Brunch en famille",
        title_en: "Family brunch",
        text: "Le Menu Famille livré un dimanche matin : viennoiseries, bagels, jus pressés — zéro cuisine, zéro vaisselle.",
        text_en: "The Family Menu delivered on a Sunday morning: pastries, bagels, fresh juices — no cooking, no dishes.",
      },
      {
        title: "Réveil face à la mer",
        title_en: "Seaside wake-up",
        text: "Résidents et vacanciers du Cros-de-Cagnes : petit-déjeuner frais livré pour le déguster sur la terrasse.",
        text_en: "Residents and holidaymakers in Cros-de-Cagnes: fresh breakfast delivered to enjoy on the terrace.",
      },
      {
        title: "Occasions spéciales",
        title_en: "Special occasions",
        text: "Anniversaire, naissance, matinée entre amis : Birthday Box et plateaux à partager livrés avec le sourire.",
        text_en: "Birthday, new baby, morning with friends: Birthday Box and sharing platters delivered with a smile.",
      },
    ],
    faq: [
      {
        q: "Livrez-vous toute la commune de Cagnes-sur-Mer ?",
        q_en: "Do you deliver across all of Cagnes-sur-Mer?",
        a: "Oui : centre-ville, Cros-de-Cagnes, Haut-de-Cagnes, Les Collettes, Val Fleuri et les quartiers autour du Polygone Riviera.",
        a_en: "Yes: the town centre, Cros-de-Cagnes, Haut-de-Cagnes, Les Collettes, Val Fleuri and the areas around Polygone Riviera.",
      },
      {
        q: "Quel est le délai de livraison à Cagnes-sur-Mer ?",
        q_en: "How long does delivery to Cagnes-sur-Mer take?",
        a: "Comptez 25 à 40 minutes après confirmation de la commande, selon le quartier et la circulation.",
        a_en: "Allow 25 to 40 minutes after your order is confirmed, depending on the area and traffic.",
      },
      {
        q: "Peut-on commander un brunch pour un groupe à Cagnes ?",
        q_en: "Can I order brunch for a group in Cagnes?",
        a: "Oui, pour les groupes, anniversaires et entreprises : demandez un devis via notre page Événements.",
        a_en: "Yes — for groups, birthdays and companies: request a quote via our Events page.",
      },
    ],
    metaTitle: "Livraison petit-déjeuner Cagnes-sur-Mer — Brunch à domicile | Breakfast Time",
    metaTitle_en: "Breakfast Delivery Cagnes-sur-Mer — Brunch at Home | Breakfast Time",
    metaDesc:
      "Livraison de petit-déjeuner et brunch à Cagnes-sur-Mer (Cros, Haut-de-Cagnes, centre). Produits frais, livrés en 25-40 min, 7j/7 de 8h à 15h.",
    metaDesc_en:
      "Breakfast and brunch delivery in Cagnes-sur-Mer (Cros, Haut-de-Cagnes, centre). Fresh products, delivered in 25-40 min, 7 days a week from 8am to 3pm.",
  },
];

export const getCityBySlug = (slug: string): City | undefined =>
  cities.find((c) => c.slug === slug);
