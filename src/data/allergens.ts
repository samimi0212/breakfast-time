export interface AllergenInfo {
  fr: string;
  en: string;
  icon: string;
}

// Les 14 allergènes majeurs (réglementation INCO)
export const ALLERGENS: Record<string, AllergenInfo> = {
  GL: { fr: "Gluten", en: "Gluten", icon: "🌾" },
  CR: { fr: "Crustacés", en: "Crustaceans", icon: "🦀" },
  OE: { fr: "Œufs", en: "Eggs", icon: "🥚" },
  PO: { fr: "Poisson", en: "Fish", icon: "🐟" },
  AR: { fr: "Arachides", en: "Peanuts", icon: "🥜" },
  SO: { fr: "Soja", en: "Soy", icon: "🫘" },
  LA: { fr: "Lait", en: "Milk", icon: "🥛" },
  FC: { fr: "Fruits à coque", en: "Tree nuts", icon: "🌰" },
  CE: { fr: "Céleri", en: "Celery", icon: "🥬" },
  MO: { fr: "Moutarde", en: "Mustard", icon: "🟡" },
  SE: { fr: "Sésame", en: "Sesame", icon: "🌱" },
  SU: { fr: "Sulfites", en: "Sulphites", icon: "🧪" },
  LU: { fr: "Lupin", en: "Lupin", icon: "🌻" },
  ML: { fr: "Mollusques", en: "Molluscs", icon: "🦪" },
};

// Allergènes par produit (clé = Product.id). Absent de la liste = aucun allergène majeur identifié.
export const PRODUCT_ALLERGENS: Record<string, string[]> = {
  // Nos Menus
  "menu-francais": ["GL", "LA", "OE", "FC"],
  "menu-anglais": ["GL", "OE", "LA", "MO"],
  "menu-brunch": ["GL", "SE", "OE", "LA", "FC"],
  "menu-veggie": ["GL", "SE", "LA", "OE", "FC"],
  "menu-duo": ["GL", "SE", "LA", "OE", "FC"],
  "menu-famille": ["GL", "SE", "LA", "OE", "FC"],
  "birthday-box": ["GL", "OE", "LA", "FC", "SO"],

  // Viennoiseries
  "suisse": ["GL", "LA", "OE"],

  // Pains & Cakes
  "baguette": ["GL"],
  "baguette-bio": ["GL", "SE"],
  "pain-ciabatta": ["GL"],
  "petit-pain-campagne": ["GL"],
  "pain-pepites": ["GL", "LA", "SO"],
  "pain-nordique": ["GL", "SE"],

  // Le Salé
  "avocado-toast": ["GL", "LA", "PO"],
  "oeufs-benedicte": ["GL", "OE", "LA", "MO"],
  "bagel-chevre-miel": ["GL", "SE", "LA", "FC"],
  "bagel-bacon-cheddar": ["GL", "SE", "OE", "LA", "MO"],
  "bagel-saumon-avocat": ["GL", "SE", "PO", "LA"],
  "breakfast-burrito": ["GL", "OE"],
  "burrito-breakfast": ["GL", "OE", "LA"],
  "burrito-chicken-cesar": ["GL", "OE", "LA", "MO", "PO"],
  "brioche-burrata": ["GL", "OE", "LA", "SU"],
  "chicken-burrito": ["GL"],
  "potatoe-saumon": ["GL", "PO", "LA"],
  "toast-mediterraneen": ["GL", "SE", "LA"],
  "breakfast-bowl": ["GL", "SE"],
  "oeufs-brouilles": ["GL", "OE", "LA"],
  "oeufs-brouilles-truffe": ["GL", "OE"],
  "croque-monsieur": ["GL", "LA", "MO"],
  "croque-monsieur-gf": ["LA", "MO"],
  "croque-pastrami": ["GL", "LA", "MO"],
  "rostis": ["LA"],
  "salade-verte": ["MO"],
  "frites-patates-douces": ["LA"],
  "halloumi-grille": ["LA"],

  // Le Sucré
  "pancakes-a-composer": ["GL", "OE", "LA", "FC", "AR", "SO"],
  "gaufre-composer": ["GL", "OE", "LA", "FC", "AR", "SO"],
  "gaufre-speculoos": ["GL", "OE", "LA", "SO"],
  "brioche-perdue": ["GL", "OE", "LA", "FC", "SO"],
  "brioche-perdue-caramel": ["GL", "OE", "LA", "FC"],
  "brioche-peanut": ["GL", "OE", "LA", "AR", "FC"],
  "pudding-chia": ["GL", "LA", "FC"],
  "granola-parfait": ["GL", "LA"],
  "sweet-bowl": ["LA"],
  "porridge": ["GL", "LA", "FC", "AR"],
  "acai-bowl": ["GL", "FC", "AR"],
  "cookie-chocolat": ["GL", "LA", "OE"],
  "cookie-caramel": ["GL", "LA"],
  "brownie-pecan": ["GL", "OE", "LA", "FC"],
  "cake-marbre": ["GL", "OE", "LA"],
  "muffin-myrtilles": ["GL", "OE", "LA"],
  "muffin-choco": ["GL", "OE", "LA"],

  // Boissons
  "cafe-latte": ["LA"],
  "capuccino": ["LA"],
  "chai-latte": ["LA"],
  "iced-latte": ["LA"],
  "the-earl-grey": [],
  "americano": [],
  "chocolat-chaud": ["LA"],
  "smoothie-banane": ["LA"],
  "smoothie-fruits-rouges": ["LA"],
  "jus-orange-presse": [],
  "jus-pamplemousse-presse": [],
  "jus-abricot": ["SU"],
  "iced-matcha-latte": ["LA"],
  "matcha-latte-vanille": ["LA"],

};
