// Descriptions SEO uniques par produit, utilisées UNIQUEMENT pour la balise
// <meta name="description"> (jamais affichées sur la page produit elle-même).
// Chaque produit ayant un template de page identique, Google traitait ces pages
// comme du contenu quasi dupliqué — une phrase rédigée par produit règle ça.

export const productSeoDescriptions: Record<string, { fr: string; en: string }> = {
  "menu-francais": {
    fr: "Le petit-déjeuner français : demi-baguette tradition, beurre, nappage au choix, jus frais et boisson chaude, livré chaque matin.",
    en: "The French breakfast: half tradition baguette, butter, topping of your choice, fresh juice and a hot drink, delivered every morning.",
  },
  "menu-anglais": {
    fr: "L'English Breakfast : breakfast sausages, œufs brouillés, baked beans et toast, avec jus frais et boisson chaude au choix.",
    en: "The English Breakfast: breakfast sausages, scrambled eggs, baked beans and toast, with a fresh juice and hot drink of your choice.",
  },
  "menu-brunch": {
    fr: "Le grand brunch du dimanche : bagel gourmand, frites de patates douces et granola bowl, livré prêt à partager.",
    en: "The Sunday brunch spread: bagel, sweet potato fries and granola bowl parfait, delivered ready to share.",
  },
  "menu-veggie": {
    fr: "Un brunch 100% végétal : toast méditerranéen généreux et frites de patates douces, livré frais et gourmand.",
    en: "An all-plant brunch: generous Mediterranean toast and sweet potato fries, delivered fresh and flavourful.",
  },
  "menu-duo": {
    fr: "Le brunch à deux : bagels au choix, granola bowl et mini viennoiseries à partager, livré pour deux gourmands.",
    en: "Brunch for two: bagels, granola bowl and mini pastries to share, delivered for two hungry mornings.",
  },
  "menu-famille": {
    fr: "Le grand brunch familial : bagels, granola bowls et mini viennoiseries pour quatre, livré généreux et complet.",
    en: "The big family brunch: bagels, granola bowls and mini pastries for four, delivered generous and complete.",
  },
  "birthday-box": {
    fr: "La box anniversaire gourmande : gâteau de pancakes à la pâte à tartiner, bougies scintillantes et message personnalisé inclus.",
    en: "The birthday treat box: pancake cake with chocolate spread, sparkling candles and a personalised message included.",
  },
  baguette: {
    fr: "Demi-baguette tradition coupée en deux et légèrement toastée, livrée fraîche du jour.",
    en: "Half tradition baguette, cut in two and lightly toasted, delivered fresh each day.",
  },
  "baguette-bio": {
    fr: "Baguette aux graines de tournesol, pavot, sésame et lin, croustillante et généreuse, livrée fraîche du matin.",
    en: "Seeded baguette with sunflower, poppy, sesame and flax seeds, crusty and generous, delivered fresh.",
  },
  "petit-pain-campagne": {
    fr: "Petit pavé de campagne au levain naturel, mie dense et croûte rustique, livré frais chaque matin.",
    en: "Country sourdough roll, dense crumb and rustic crust, delivered fresh every morning.",
  },
  "avocado-toast": {
    fr: "Tartine de pain toastée, sauce cream cheese, tranches d'avocat, saumon fumé, grenade et jeunes pousses.",
    en: "Toasted bread with cream cheese sauce, avocado slices, smoked salmon, pomegranate and baby greens.",
  },
  "bagel-chevre-miel": {
    fr: "Bagel brioché aux graines, chèvre cendré, noix, jeunes pousses et sauce miel moutarde.",
    en: "Seeded brioche bagel with ash-ripened goat cheese, walnuts, baby greens and honey mustard sauce.",
  },
  "bagel-bacon-cheddar": {
    fr: "Bagel brioché aux graines, bacon crispy, œufs émiettés, cheddar, jeunes pousses et sauce hollandaise.",
    en: "Seeded brioche bagel with crispy bacon, crumbled eggs, cheddar, baby greens and hollandaise sauce.",
  },
  "bagel-saumon-avocat": {
    fr: "Bagel brioché aux graines, poulet mariné, jeunes pousses, sauce fumée et pickles de chou rouge.",
    en: "Seeded brioche bagel with marinated chicken, baby greens, smoky sauce and pickled red cabbage.",
  },
  "breakfast-burrito": {
    fr: "Burrito protéiné : galette de blé, effiloché de poulet mariné, œufs brouillés, pickles de chou rouge et sauce fumée.",
    en: "Protein burrito: wheat tortilla, pulled marinated chicken, scrambled eggs, pickled red cabbage and smoky sauce.",
  },
  "pancakes-a-composer": {
    fr: "Trois pancakes moelleux à composer vous-même, nappage et topping au choix, livrés chauds et prêts à savourer.",
    en: "Three fluffy pancakes to top your way, with the topping and drizzle of your choice, delivered warm.",
  },
  "gaufre-composer": {
    fr: "Gaufre de Liège authentique et croustillante, nappage et topping au choix, livrée chaude et personnalisable.",
    en: "Authentic crisp Liège waffle, with the topping and drizzle of your choice, delivered warm and customisable.",
  },
  "focaccia-saumon": {
    fr: "Pinsa moelleuse au pesto artisanal, burrata crémeuse, mortadelle et pistache, relevée de tomates confites.",
    en: "Soft pinsa with artisanal pesto, creamy burrata, mortadella and pistachio, finished with confit tomatoes.",
  },
  "toast-mediterraneen": {
    fr: "Tartine au levain garnie de caviar d'aubergine, feta et olives Kalamata, relevée d'épices zaatar et d'huile d'olive.",
    en: "Sourdough tartine topped with eggplant caviar, feta and Kalamata olives, finished with zaatar and olive oil.",
  },
  "breakfast-bowl": {
    fr: "Bowl généreux au quinoa et falafel, pois chiches croustillants, houmous et grenade, sauce citronnée maison.",
    en: "Hearty quinoa and falafel bowl, crispy chickpeas, hummus and pomegranate, house lemon sauce.",
  },
  "oeufs-brouilles": {
    fr: "Œufs brouillés à la fleur de sel et à la ciboulette, servis avec un toast.",
    en: "Scrambled eggs with fleur de sel and chives, served with a slice of toast.",
  },
  "oeufs-brouilles-truffe": {
    fr: "Œufs brouillés à l'huile de truffe noire, sel sésame et truffe, servis avec un toast.",
    en: "Scrambled eggs with black truffle oil and truffle sesame salt, served with a slice of toast.",
  },
  rostis: {
    fr: "Trois röstis de pommes de terre dorés et croustillants, avec une sauce fraîche aux herbes.",
    en: "Three golden, crispy potato röstis with a fresh herb sauce.",
  },
  "frites-patates-douces": {
    fr: "Frites de patates douces croustillantes, fleur de sel et sauce fraîche aux herbes, livrées encore chaudes.",
    en: "Crispy sweet potato fries with fleur de sel and fresh herb sauce, delivered still warm.",
  },
  "halloumi-grille": {
    fr: "Quatre tranches d'halloumi AOP grillées à l'origan, servies avec une sauce aux herbes.",
    en: "Four slices of grilled PDO halloumi with oregano, served with a herb sauce.",
  },
  "brioche-perdue": {
    fr: "Brioche perdue épaisse et moelleuse au Nutella et éclats de noisettes grillées.",
    en: "Thick, fluffy French toast brioche with Nutella and toasted hazelnut bits.",
  },
  "brioche-perdue-caramel": {
    fr: "Brioche perdue épaisse et moelleuse, caramel au beurre salé, bananes et noix de pécan.",
    en: "Thick, fluffy French toast brioche with salted butter caramel, bananas and pecan nuts.",
  },
  "pudding-chia": {
    fr: "Bowl gourmand de 350ml au yaourt grec, vanille, crème de pistache, pistaches concassées et myrtilles.",
    en: "Indulgent 350ml bowl with Greek yogurt, vanilla, pistachio cream, crushed pistachios and blueberries.",
  },
  "granola-parfait": {
    fr: "Bowl de 350ml au yaourt grec, granola maison amandes-chocolat, fruits rouges, bananes et miel.",
    en: "350ml bowl with Greek yogurt, homemade almond-chocolate granola, mixed berries, bananas and honey.",
  },
  porridge: {
    fr: "Porridge de 350ml au yaourt grec, flocons d'avoine et chia, amandes grillées, mangue fraîche et beurre de cacahuètes.",
    en: "350ml porridge with Greek yogurt, oats and chia, toasted almonds, fresh mango and peanut butter.",
  },
  "acai-bowl": {
    fr: "Bowl açaï glacé, fruits rouges et banane, granola artisanal croquant et miel de lavande.",
    en: "Chilled açaí bowl with mixed berries and banana, crunchy artisanal granola and lavender honey.",
  },
  "cookie-chocolat": {
    fr: "Cookie fondant au chocolat et à la noisette, 85g de gourmandise, livré croustillant à l'extérieur.",
    en: "Soft chocolate hazelnut cookie, 85g of indulgence, crisp on the outside.",
  },
  "cookie-caramel": {
    fr: "Cookie moelleux au caramel et beurre salé, livré frais du jour.",
    en: "Soft salted butter caramel cookie, delivered fresh each day.",
  },
  "brownie-pecan": {
    fr: "Double brownie fondant aux noix de pécan, à compléter avec vos toppings préférés.",
    en: "Fudgy double brownie with pecan nuts, to top with your favourite extras.",
  },
  "cake-marbre": {
    fr: "Deux tranches de cake marbré aux pépites de chocolat, à personnaliser avec nappages et toppings.",
    en: "Two slices of marble cake with chocolate chips, to customise with toppings.",
  },
  "muffin-myrtilles": {
    fr: "Muffin moelleux aux myrtilles, livré tout juste cuit.",
    en: "Soft blueberry muffin, delivered freshly baked.",
  },
  "muffin-choco": {
    fr: "Muffin 100% chocolat aux pépites de chocolat noir, livré tout juste sorti du four.",
    en: "100% chocolate muffin with dark chocolate chips, delivered fresh from the oven.",
  },
  americano: {
    fr: "Café 100% Arabica, livré chaud pour bien commencer la journée.",
    en: "100% Arabica coffee, delivered hot to start your day right.",
  },
  "cafe-latte": {
    fr: "Café latte : expresso, lait chaud et mousse de lait onctueuse, sucre servi à part.",
    en: "Café latte: espresso, hot milk and creamy milk foam, sugar served on the side.",
  },
  capuccino: {
    fr: "Cappuccino onctueux à la mousse de lait, saupoudré de cacao.",
    en: "Creamy cappuccino with milk foam, dusted with cocoa.",
  },
  "chocolat-chaud": {
    fr: "Chocolat chaud 100% cacao non sucré, sucre en option.",
    en: "100% cocoa hot chocolate, unsweetened, sugar on request.",
  },
  "the-earl-grey": {
    fr: "Thé Earl Grey au citron, sucre servi à part.",
    en: "Earl Grey tea with lemon, sugar served on the side.",
  },
  "iced-latte": {
    fr: "Iced latte : espresso, mousse de lait et glaçons, frais et désaltérant.",
    en: "Iced latte: espresso, milk foam and ice, cool and refreshing.",
  },
  "chai-latte": {
    fr: "Chai latte à la cannelle, cardamome et gingembre, allongé de lait chaud et d'une mousse de lait.",
    en: "Chai latte with cinnamon, cardamom and ginger, topped up with hot milk and milk foam.",
  },
  "iced-matcha-latte": {
    fr: "Matcha latte onctueux au lait chaud et mousse de lait, légèrement sucré.",
    en: "Smooth matcha latte with hot milk and milk foam, lightly sweetened.",
  },
  "smoothie-tropical": {
    fr: "Smoothie mangue, lait de coco, pomme, gingembre et banane, sans sucres ajoutés.",
    en: "Mango, coconut milk, apple, ginger and banana smoothie, no added sugar.",
  },
  "smoothie-energie": {
    fr: "Smoothie fraise, cerise, pomme, guarana et banane, sans sucres ajoutés.",
    en: "Strawberry, cherry, apple, guarana and banana smoothie, no added sugar.",
  },
  "smoothie-detox": {
    fr: "Smoothie concombre, kiwi, matcha, pomme et banane, sans sucres ajoutés.",
    en: "Cucumber, kiwi, matcha, apple and banana smoothie, no added sugar.",
  },
  "jus-orange-presse": {
    fr: "Jus d'orange 100% pressé minute, sans sucres ajoutés, livré frais pour une vitamine C immédiate.",
    en: "Freshly squeezed orange juice, no added sugar, delivered fresh for an instant vitamin C boost.",
  },
  "jus-pamplemousse-presse": {
    fr: "Jus de pamplemousse 100% pressé minute, sans sucres ajoutés, une fraîcheur acidulée livrée chez vous.",
    en: "Freshly squeezed grapefruit juice, no added sugar, a tangy freshness delivered to your door.",
  },
  "jus-abricot": {
    fr: "Nectar d'abricot velouté et gourmand, livré frais pour accompagner votre petit-déjeuner.",
    en: "Velvety, indulgent apricot nectar, delivered fresh to accompany your breakfast.",
  },
  "brunch-mariage": {
    fr: "Formule brunch de mariage : buffet de viennoiseries, salé et sucré, décoration et service sur place inclus.",
    en: "Wedding brunch package: pastry buffet, sweet and savoury spread, decoration and on-site service included.",
  },
  "brunch-entreprise": {
    fr: "Formule brunch d'entreprise : viennoiseries fraîches, plateaux salés et fruits, livrée et installée sur site.",
    en: "Corporate brunch package: fresh pastries, savoury platters and fruit, delivered and set up on site.",
  },
  "brunch-groupe": {
    fr: "Formule brunch de groupe : buffet de viennoiseries et pains, sucré-salé et boissons fraîches, décoration possible.",
    en: "Group brunch package: pastry and bread buffet, sweet and savoury, cold drinks, themed decoration available.",
  },
  "box-cadeau-events": {
    fr: "Box cadeau personnalisée garnie de viennoiseries et gourmandises, message manuscrit et emballage inclus.",
    en: "Personalised gift box filled with pastries and sweet treats, handwritten message and gift wrap included.",
  },
  "petit-dejeuner-seminaire": {
    fr: "Petit-déjeuner de séminaire : viennoiseries individuelles, café, thé et fruits de saison, service ponctuel.",
    en: "Seminar breakfast package: individual pastries, coffee, tea and seasonal fruit, punctual on-site service.",
  },
  "avocado-toast-feta": {
    fr: "Avocado toast simple et efficace : deux tranches de pain toastées, cream cheese et avocat.",
    en: "A simple, satisfying avocado toast: two slices of toast, cream cheese and avocado.",
  },
  "bagel-avocat-saumon": {
    fr: "Bagel brioché aux graines, cream cheese, saumon fumé, avocat, câpres, pickles de concombre et aneth.",
    en: "Seeded brioche bagel with cream cheese, smoked salmon, avocado, capers, pickled cucumber and dill.",
  },
  "croque-pastrami": {
    fr: "Croque revisité : deux tranches de pain de campagne, emmental, pastrami et béchamel moutarde.",
    en: "A reinvented croque: two slices of country bread, Emmental, pastrami and mustard béchamel.",
  },
  "burrito-breakfast": {
    fr: "Breakfast burrito protéiné aux œufs brouillés, avocat et cheddar.",
    en: "Protein-packed breakfast burrito with scrambled eggs, avocado and cheddar.",
  },
  "burrito-chicken-cesar": {
    fr: "Burrito façon César : tortilla, poulet pané, parmesan, salade et sauce césar.",
    en: "Caesar-style burrito: tortilla, breaded chicken, parmesan, lettuce and Caesar sauce.",
  },
  "brioche-burrata": {
    fr: "Brioche épaisse et moelleuse, crème de pesto basilic, burrata, tomates cerises, parmesan et crème balsamique.",
    en: "Thick, fluffy brioche with basil pesto cream, burrata, cherry tomatoes, parmesan and balsamic cream.",
  },
  "gaufre-speculoos": {
    fr: "Gaufre de Liège dorée à la crème de mascarpone, caramel beurre salé et éclats de spéculoos.",
    en: "Golden Liège waffle with mascarpone cream, salted butter caramel and speculoos crumbs.",
  },
  "brioche-peanut": {
    fr: "Deux tranches de brioche épaisses toastées, beurre de cacahuètes, coulis de chocolat noir et noix de pécan.",
    en: "Two thick slices of toasted brioche with peanut butter, dark chocolate sauce and pecan nuts.",
  },
  "sweet-bowl": {
    fr: "Sweet bowl sans gluten de 350ml : yaourt grec, fruits rouges, bananes et coulis de chocolat noir.",
    en: "Gluten-free 350ml sweet bowl: Greek yogurt, mixed berries, bananas and dark chocolate sauce.",
  },
  "matcha-latte-vanille": {
    fr: "Matcha latte à la vanille, lait chaud et mousse de lait, légèrement sucré.",
    en: "Vanilla matcha latte with hot milk and milk foam, lightly sweetened.",
  },
};
