// Articles de blog (SEO local + contenu produit).
// URL : /blog/{slug} (FR) et /en/blog/{slug} (EN).

export interface BlogBlock {
  type: "p" | "h2";
  text: string;
  text_en: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  title_en: string;
  excerpt: string;
  excerpt_en: string;
  /** Date de publication, format YYYY-MM-DD. */
  date: string;
  image: string;
  metaTitle: string;
  metaTitle_en: string;
  metaDesc: string;
  metaDesc_en: string;
  blocks: BlogBlock[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "ou-bruncher-a-antibes",
    title: "Où bruncher à Antibes en 2026 : notre guide",
    title_en: "Where to brunch in Antibes in 2026: our guide",
    excerpt:
      "Envie d'un brunch à Antibes sans sortir de chez vous ? Voici comment composer le brunch parfait et se le faire livrer directement à domicile ou au bureau.",
    excerpt_en:
      "Want brunch in Antibes without leaving home? Here's how to put together the perfect brunch and have it delivered straight to your door or office.",
    date: "2026-07-15",
    image: "/couverture1.webp",
    metaTitle: "Où bruncher à Antibes en 2026 ? | Breakfast Time",
    metaTitle_en: "Where to brunch in Antibes in 2026? | Breakfast Time",
    metaDesc:
      "Nos conseils pour organiser le brunch parfait à Antibes : viennoiseries, œufs bénédicte, bagels et boissons, livrés directement chez vous.",
    metaDesc_en:
      "Our tips for the perfect brunch in Antibes: pastries, eggs Benedict, bagels and drinks, delivered straight to your door.",
    blocks: [
      {
        type: "p",
        text: "Antibes ne manque pas de charme pour prendre un petit-déjeuner en terrasse, mais un vrai brunch réussi demande souvent plus de temps qu'on ne l'imagine : trouver une table libre le dimanche matin, attendre son tour, puis rentrer avec des enfants qui ont déjà faim. Il existe une alternative plus simple : faire venir le brunch à vous, chez vous ou au bureau, avec la même qualité qu'en boulangerie-traiteur artisanale.",
        text_en:
          "Antibes has no shortage of charming terraces for breakfast, but a proper brunch often takes more time than you'd think: finding a free table on a Sunday morning, waiting your turn, then heading home with hungry kids. There's a simpler alternative: have the brunch come to you, at home or at the office, with the same quality as an artisan bakery-caterer.",
      },
      {
        type: "h2",
        text: "Qu'est-ce qu'un bon brunch, exactement ?",
        text_en: "What actually makes a good brunch?",
      },
      {
        type: "p",
        text: "Un brunch réussi mélange le sucré et le salé : des viennoiseries fraîches, un plat chaud comme des œufs bénédicte ou un bagel garni, des fruits ou un bowl, et une boisson chaude ou un jus pressé. L'idée n'est pas de multiplier les plats, mais d'avoir un peu de tout pour satisfaire toutes les envies autour de la table, y compris les invités les plus difficiles.",
        text_en:
          "A good brunch mixes sweet and savoury: fresh pastries, a hot dish such as eggs Benedict or a loaded bagel, some fruit or a bowl, and a hot drink or fresh juice. The idea isn't to pile on dishes, but to have a bit of everything so every guest at the table finds something they like — even the pickiest ones.",
      },
      {
        type: "h2",
        text: "Composer son brunch à la maison, sans y passer la matinée",
        text_en: "Putting together a brunch at home, without losing your morning",
      },
      {
        type: "p",
        text: "Chez Breakfast Time, notre Menu Brunch a justement été pensé pour ça : un assortiment de viennoiseries, un plat salé au choix et une boisson, livré prêt à déguster. Pour un groupe plus large ou un anniversaire, le Menu Duo ou le Menu Famille permettent de varier les plaisirs sans multiplier les commandes séparées. Tout est personnalisable directement sur la carte.",
        text_en:
          "At Breakfast Time, our Brunch Menu was designed for exactly this: an assortment of pastries, a choice of savoury dish and a drink, delivered ready to enjoy. For a bigger group or a birthday, the Duo Menu or the Family Menu let you mix things up without placing several separate orders. Everything can be customised directly on the menu.",
      },
      {
        type: "h2",
        text: "Et si vous recevez à Antibes, Juan-les-Pins ou dans les environs ?",
        text_en: "Hosting in Antibes, Juan-les-Pins or nearby?",
      },
      {
        type: "p",
        text: "Nous livrons les petits-déjeuners et brunchs directement à Antibes et dans plusieurs communes voisines. Il suffit d'indiquer votre adresse au moment de la commande pour vérifier que vous êtes bien dans notre zone de livraison, et de choisir un créneau qui vous arrange.",
        text_en:
          "We deliver breakfasts and brunches directly to Antibes and several neighbouring towns. Just enter your address when ordering to check you're within our delivery zone, then pick a time slot that suits you.",
      },
      {
        type: "p",
        text: "Vous voulez composer votre brunch dès maintenant ? Direction notre carte pour découvrir tous les menus et options disponibles.",
        text_en:
          "Ready to build your brunch now? Head to our menu to discover all the available menus and options.",
      },
    ],
  },
  {
    slug: "anniversaire-brunch-antibes-cannes-nice",
    title: "Organiser un anniversaire brunch à Antibes, Cannes ou Nice sans rien préparer",
    title_en: "Throwing a birthday brunch in Antibes, Cannes or Nice without preparing anything",
    excerpt:
      "Un anniversaire à fêter en famille ou entre amis à Antibes, Cannes ou Nice ? Découvrez comment composer un brunch d'anniversaire livré chez vous, sans passer la matinée en cuisine.",
    excerpt_en:
      "Celebrating a birthday with family or friends in Antibes, Cannes or Nice? Here's how to put together a birthday brunch delivered to your door, without spending your morning in the kitchen.",
    date: "2026-07-27",
    image: "/brunch.webp",
    metaTitle: "Anniversaire brunch à Antibes, Cannes, Nice | Breakfast Time",
    metaTitle_en: "Birthday brunch in Antibes, Cannes, Nice | Breakfast Time",
    metaDesc:
      "Comment organiser un anniversaire brunch à Antibes, Cannes ou Nice : Birthday Box, Menu Duo ou Menu Famille, livrés directement chez vous ou au bureau.",
    metaDesc_en:
      "How to organise a birthday brunch in Antibes, Cannes or Nice: Birthday Box, Duo Menu or Family Menu, delivered straight to your door or office.",
    blocks: [
      {
        type: "p",
        text: "Fêter un anniversaire ne devrait pas commencer par une liste de courses et deux heures en cuisine. Que vous soyez à Antibes, à Cannes ou du côté de Nice, il existe une façon plus simple de célébrer : laisser le brunch venir à vous, avec la même qualité qu'en boulangerie-traiteur artisanale.",
        text_en:
          "Celebrating a birthday shouldn't start with a shopping list and two hours in the kitchen. Whether you're in Antibes, Cannes or around Nice, there's a simpler way to celebrate: let the brunch come to you, with the same quality as an artisan bakery-caterer.",
      },
      {
        type: "h2",
        text: "Pourquoi le brunch est le format idéal pour un anniversaire",
        text_en: "Why brunch is the perfect format for a birthday",
      },
      {
        type: "p",
        text: "Contrairement à un repas classique, le brunch mélange sucré et salé et se partage facilement à table, quel que soit l'âge des invités. Il convient aussi bien à un anniversaire d'enfant qu'à une réunion entre adultes, sans avoir à choisir un seul menu qui plaise à tout le monde.",
        text_en:
          "Unlike a classic meal, brunch mixes sweet and savoury and is easy to share around the table, whatever the age of your guests. It works just as well for a child's birthday as for a gathering of adults, without having to pick a single menu that pleases everyone.",
      },
      {
        type: "h2",
        text: "La Birthday Box, pensée pour l'occasion",
        text_en: "The Birthday Box, made for the moment",
      },
      {
        type: "p",
        text: "Chez Breakfast Time, la Birthday Box a été conçue spécialement pour marquer un anniversaire : viennoiseries et douceurs choisies pour l'occasion, dans une présentation soignée. Selon le nombre d'invités, elle se complète facilement avec un plat salé ou une boisson de la carte.",
        text_en:
          "At Breakfast Time, the Birthday Box was designed specifically to mark a birthday: pastries and sweet treats chosen for the occasion, in a carefully presented box. Depending on the number of guests, it's easily completed with a savoury dish or a drink from the menu.",
      },
      {
        type: "h2",
        text: "Menu Duo ou Menu Famille : adapter la commande au nombre d'invités",
        text_en: "Duo Menu or Family Menu: matching the order to your guest count",
      },
      {
        type: "p",
        text: "Pour un anniversaire à deux, le Menu Duo évite de multiplier les commandes séparées. Pour une tablée plus large, le Menu Famille rassemble tout le monde autour d'un assortiment varié. Tout est personnalisable directement sur la carte, selon les goûts et les allergies de chacun.",
        text_en:
          "For a birthday for two, the Duo Menu avoids placing several separate orders. For a bigger table, the Family Menu brings everyone together around a varied assortment. Everything can be customised directly on the menu, according to everyone's tastes and allergies.",
      },
      {
        type: "h2",
        text: "Livrer l'anniversaire à Antibes, Cannes ou Nice",
        text_en: "Delivering the birthday in Antibes, Cannes or Nice",
      },
      {
        type: "p",
        text: "Nous livrons les anniversaires brunch partout à Antibes, à Cannes et dans l'ouest de Nice (secteur aéroport, Arénas, Saint-Augustin), généralement en 30 à 45 minutes après confirmation de la commande. Il suffit d'indiquer votre adresse au moment de la commande pour vérifier votre zone de livraison et choisir un créneau, 7j/7 de 8h à 15h.",
        text_en:
          "We deliver birthday brunches anywhere in Antibes, Cannes and western Nice (airport area, Arénas, Saint-Augustin), usually within 30 to 45 minutes of order confirmation. Just enter your address when ordering to check your delivery zone and pick a time slot, 7 days a week from 8am to 3pm.",
      },
      {
        type: "p",
        text: "Envie de composer l'anniversaire idéal dès maintenant ? Direction notre carte pour découvrir la Birthday Box et tous les menus disponibles.",
        text_en:
          "Ready to put together the perfect birthday now? Head to our menu to discover the Birthday Box and all the available menus.",
      },
    ],
  },
  {
    slug: "petit-dejeuner-au-bureau-equipe",
    title: "Petit-déjeuner au bureau : comment régaler son équipe sans se déplacer",
    title_en: "Office breakfast: how to treat your team without leaving the building",
    excerpt:
      "Réunion d'équipe, onboarding, anniversaire de collègue ou simple moment de convivialité ? Découvrez comment commander un petit-déjeuner livré directement dans vos locaux.",
    excerpt_en:
      "Team meeting, onboarding, colleague's birthday or just a moment to connect? Here's how to order a breakfast delivered straight to your office.",
    date: "2026-09-09",
    image: "/entreprise2.webp",
    metaTitle: "Petit-déjeuner d'équipe livré au bureau | Breakfast Time",
    metaTitle_en: "Office team breakfast delivery | Breakfast Time",
    metaDesc:
      "Commandez un petit-déjeuner ou brunch livré au bureau pour votre équipe à Antibes, Cannes ou Nice. Viennoiseries, bagels, boissons chaudes — prêt à partager.",
    metaDesc_en:
      "Order a breakfast or brunch delivered to your office for your team in Antibes, Cannes or Nice. Pastries, bagels, hot drinks — ready to share.",
    blocks: [
      {
        type: "p",
        text: "Un petit-déjeuner partagé au bureau, c'est souvent la façon la plus simple de créer un moment de cohésion sans organisation compliquée. Que ce soit pour une réunion importante, un accueil de nouveaux collaborateurs ou juste parce que c'est vendredi, faire livrer le petit-déjeuner directement dans vos locaux évite les allers-retours en boulangerie et les croissants froids.",
        text_en:
          "A shared breakfast at the office is often the simplest way to create a moment of togetherness without complicated logistics. Whether it's for an important meeting, welcoming new team members or just because it's Friday, having breakfast delivered straight to your office avoids the back-and-forth trips to the bakery — and cold croissants.",
      },
      {
        type: "h2",
        text: "Ce qui fait un bon petit-déjeuner d'entreprise",
        text_en: "What makes a good office breakfast",
      },
      {
        type: "p",
        text: "La clé, c'est la simplicité pour vous et la qualité pour votre équipe. Des viennoiseries fraîches du matin, une option salée pour ceux qui ne mangent pas sucré, des boissons chaudes et froides — et une commande unique, pas dix commandes séparées. Chez Breakfast Time, chaque menu est personnalisable au moment de la commande, ce qui permet à chacun de choisir ses options sans compliquer la logistique.",
        text_en:
          "The key is simplicity for you and quality for your team. Fresh morning pastries, a savoury option for those who skip sweet things, hot and cold drinks — and a single order, not ten separate ones. At Breakfast Time, every menu is customisable at the time of ordering, so everyone can choose their options without complicating the logistics.",
      },
      {
        type: "h2",
        text: "Pour combien de personnes peut-on commander ?",
        text_en: "How many people can you order for?",
      },
      {
        type: "p",
        text: "Nos menus sont conçus pour des commandes individuelles ou en duo, mais rien n'empêche de passer plusieurs commandes pour une même adresse. Chaque article est livré ensemble, à l'heure choisie. Pour une équipe de 5, 10 ou 15 personnes, il suffit d'ajouter les menus correspondants au panier — viennoiseries, plats chauds ou bowls, boissons chaudes ou jus frais — et de choisir un créneau en avance pour que tout arrive en même temps.",
        text_en:
          "Our menus are designed for individual or duo orders, but there's nothing stopping you from placing several orders for the same address. Each item is delivered together at the chosen time. For a team of 5, 10 or 15 people, simply add the corresponding menus to the basket — pastries, hot dishes or bowls, hot drinks or fresh juices — and choose a time slot in advance so everything arrives together.",
      },
      {
        type: "h2",
        text: "Livraison dans vos locaux à Antibes, Cannes et Nice",
        text_en: "Delivery to your premises in Antibes, Cannes and Nice",
      },
      {
        type: "p",
        text: "Nous livrons 7j/7 de 8h à 15h dans les Alpes-Maritimes : Antibes, Juan-les-Pins, Cannes, Mougins, Sophia Antipolis, Valbonne, et l'ouest de Nice. Pour une réunion à 9h, une commande la veille ou le matin même en précommande suffit. Il suffit d'indiquer l'adresse de vos locaux lors de la commande pour vérifier votre zone de livraison.",
        text_en:
          "We deliver 7 days a week from 8am to 3pm across the Alpes-Maritimes: Antibes, Juan-les-Pins, Cannes, Mougins, Sophia Antipolis, Valbonne and western Nice. For a 9am meeting, ordering the evening before or that same morning as a pre-order is all it takes. Simply enter your office address when ordering to check your delivery zone.",
      },
      {
        type: "p",
        text: "Envie de régaler votre équipe dès la semaine prochaine ? Composez votre commande directement sur notre carte.",
        text_en:
          "Want to treat your team as early as next week? Put together your order directly on our menu.",
      },
    ],
  },
];

export const getBlogPostBySlug = (slug: string) =>
  blogPosts.find((p) => p.slug === slug);
