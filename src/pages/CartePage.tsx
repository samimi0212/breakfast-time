import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, BookOpen, ShoppingBasket, ArrowRight, ShoppingCart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useCart } from "@/context/CartContext";

const menus = [
  {
    id: "menu-francais",
    name: "Menu Français",
    price: "11,90€",
    img: "/menu-francais.png",
  },
  {
    id: "menu-anglais",
    name: "Menu Anglais",
    price: "16,90€",
    img: "/menu-anglais.png",
  },
  {
    id: "menu-brunch",
    name: "Menu Brunch",
    price: "27,90€",
    img: "/menu-brunch.png",
  },
  {
    id: "menu-veggie",
    name: "Menu Veggie",
    price: "23,90€",
    img: "/menu-veggie.png",
  },
  {
    id: "menu-duo",
    name: "Menu Duo",
    price: "35,00€",
    img: "/menu-duo.png",
  },
  {
    id: "menu-famille",
    name: "Menu Famille",
    price: "59,00€",
    img: "/menu-famille.png",
  },
  {
    id: "birthday-box",
    name: "Birthday Box",
    price: "35,00€",
    img: "/birthday-box.png",
  },
];

const produits: Record<string, { id: string; name: string; price: string; img: string }[]> = {
  Viennoiseries: [
    {
      id: "croissant",
      name: "Croissant",
      price: "1,50€",
      img: "/croissant.png",
    },
    {
      id: "pain-au-chocolat",
      name: "Pain au chocolat",
      price: "1,60€",
      img: "/pain-chocolat.png",
    },
    {
      id: "brioche",
      name: "Brioche",
      price: "1,30€",
      img: "/briochette.png",
    },
    {
      id: "chausson-pommes",
      name: "Chausson aux pommes",
      price: "2,70€",
      img: "/chausson-pommes.png",
    },
    {
      id: "pain-aux-raisins",
      name: "Pain aux raisins",
      price: "2,20€",
      img: "/pain-raisins.png",
    },
    {
      id: "suisse",
      name: "Suisse",
      price: "2,10€",
      img: "/suisse.png",
    },
    {
      id: "mini-viennoiseries",
      name: "Mini viennoiseries",
      price: "3,20€",
      img: "/mini-viennoiseries.png",
    },
  ],
  Pains: [
    {
      id: "baguette",
      name: "1/2 baguette",
      price: "1,20€",
      img: "/baguette.png",
    },
    {
      id: "baguette-bio",
      name: "1/2 baguette céréales",
      price: "1,50€",
      img: "/baguette-cereales.png",
    },
    {
      id: "pain-ciabatta",
      name: "Pain Ciabatta",
      price: "1,60€",
      img: "/ciabatta.png",
    },
    {
      id: "petit-pain-gluten-free",
      name: "Pain Gluten Free",
      price: "2,40€",
      img: "/pain-sans-gluten.png",
    },
    {
      id: "petit-pain-campagne",
      name: "Pavé de campagne",
      price: "0,90€",
      img: "/petit-pain-campagne.png",
    },
    {
      id: "pain-pepites",
      name: "Pain pépites de chocolat",
      price: "1,90€",
      img: "/pain-pepites.png",
    },
    {
      id: "pain-complet",
      name: "Pain complet",
      price: "3,70€",
      img: "/pain-complet.png",
    },
    {
      id: "pain-nordique",
      name: "Pain Nordique",
      price: "4,70€",
      img: "/pain-nordique.png",
    },
  ],
  "Le Salé": [
    {
      id: "bagel-chevre-miel",
      name: "Bagel chèvre miel",
      price: "9,50€",
      img: "/bagel-chevre.png",
    },
    {
      id: "bagel-bacon-cheddar",
      name: "Bagel Bacon Cheddar",
      price: "10,90€",
      img: "/bagel-cheddar.png",
    },
    {
      id: "bagel-saumon-avocat",
      name: "Bagel Saumon Avocat",
      price: "11,50€",
      img: "/bagel-saumon.png",
    },
    {
      id: "avocado-toast",
      name: "Avocado Toast",
      price: "10,90€",
      img: "/avocado-toast.png",
    },
    {
      id: "oeufs-benedicte",
      name: "Oeufs bénédicte",
      price: "9,50€",
      img: "/oeuf-benedicte.png",
    },
    {
      id: "oeufs-brouilles-truffe",
      name: "Oeufs brouillés Truffe",
      price: "7,50€",
      img: "/oeufs-brouilles-truffe.png",
    },
    {
      id: "oeufs-brouilles",
      name: "Oeufs brouillés",
      price: "4,50€",
      img: "/oeufs-brouilles.png",
    },
    {
      id: "breakfast-burrito",
      name: "Breakfast Burrito",
      price: "9,50€",
      img: "/breakfast-burrito.png",
    },
    {
      id: "breakfast-bowl",
      name: "Breakfast Bowl",
      price: "11,50€",
      img: "/breakfast-bowl.png",
    },
    {
      id: "chicken-burrito",
      name: "Chicken Burrito",
      price: "9,50€",
      img: "/chicken-burrito.png",
    },
    {
      id: "toast-mediterraneen",
      name: "Toast méditerranéen",
      price: "11,50€",
      img: "/toast-med.png",
    },
    {
      id: "potatoe-saumon",
      name: "Potatoe Saumon",
      price: "10,90€",
      img: "/potatoe-saumon.png",
    },
  ],
  "Extra": [
    {
      id: "salade-verte",
      name: "Salade verte",
      price: "4,50€",
      img: "/salade-verte.png",
    },
    {
      id: "frites-patates-douces",
      name: "Frites de patates douces",
      price: "5,50€",
      img: "/frites-patate-douce.png",
    },
    {
      id: "halloumi-grille",
      name: "Halloumi grillé",
      price: "7,50€",
      img: "/halloumi.png",
    },
    {
      id: "rostis",
      name: "Röstis",
      price: "6,50€",
      img: "/rostis.png",
    },
  ],
  "Le Sucré": [
    {
      id: "pancakes-a-composer",
      name: "Pancakes à composer",
      price: "5,50€",
      img: "/pancakes-composer.png",
    },
    {
      id: "gaufre-composer",
      name: "Gaufre à composer",
      price: "6,50€",
      img: "/gaufre-composer.png",
    },
    {
      id: "brioche-perdue",
      name: "Brioche Perdue Gourmande",
      price: "7,50€",
      img: "/brioche-perdue.png",
    },
    {
      id: "brioche-perdue-caramel",
      name: "Brioche Perdue Caramel",
      price: "6,50€",
      img: "/brioche-perdue-caramel.png",
    },
    {
      id: "pudding-chia",
      name: "Granola Bowl Pistache",
      price: "9,50€",
      img: "/bowl-pistache.png",
    },
    {
      id: "granola-parfait",
      name: "Granola Bowl Parfait",
      price: "8,50€",
      img: "/granola-bowl.png",
    },
    {
      id: "acai-bowl",
      name: "Acaï Bowl",
      price: "10,50€",
      img: "/acai-bowl.png",
    },
    {
      id: "cookie-chocolat",
      name: "Cookie chocolat",
      price: "3,50€",
      img: "/cookie-choco.png",
    },
    {
      id: "cookie-caramel",
      name: "Cookie Caramel Salé",
      price: "3,80€",
      img: "/cookie-caramel.png",
    },
    {
      id: "brownie-pecan",
      name: "Brownie Pécan",
      price: "3,50€",
      img: "/brownie.png",
    },
    {
      id: "muffin-myrtilles",
      name: "Muffin myrtilles",
      price: "3,50€",
      img: "/muffin-myrtilles.png",
    },
    {
      id: "muffin-choco",
      name: "Muffin Chocolat",
      price: "3,50€",
      img: "/muffin-choco.png",
    },
  ],
  Boissons: [
    {
      id: "cafe-latte",
      name: "Café Latte",
      price: "5,50€",
      img: "/cafe-latte.png",
    },
    {
      id: "capuccino",
      name: "Capuccino",
      price: "6,50€",
      img: "/capuccino.png",
    },
    {
      id: "chai-latte",
      name: "Chai Latte",
      price: "5,50€",
      img: "/chai-latte.png",
    },
    {
      id: "the-earl-grey",
      name: "Thé Earl Grey",
      price: "3,00€",
      img: "/the.png",
    },
    {
      id: "americano",
      name: "Americano",
      price: "3,00€",
      img: "/americano.png",
    },
    {
      id: "chocolat-chaud",
      name: "Chocolat chaud",
      price: "5,50€",
      img: "/chocolat-chaud.png",
    },
    {
      id: "smoothie-banane",
      name: "Smoothie banane",
      price: "6,50€",
      img: "/smoothie-banane.png",
    },
    {
      id: "smoothie-fruits-rouges",
      name: "Smoothie fruits rouges",
      price: "6,50€",
      img: "/smoothie-fruits-rouges.png",
    },
    {
      id: "jus-orange-presse",
      name: "Jus d'orange pressé",
      price: "3,50€",
      img: "/jus-orange.png",
    },
    {
      id: "jus-pamplemousse-presse",
      name: "Jus de pamplemousse pressé",
      price: "3,50€",
      img: "/jus-pamplemousse.png",
    },
    {
      id: "jus-abricot",
      name: "Jus d'abricot",
      price: "3,50€",
      img: "/jus-abricot.png",
    },
    {
      id: "iced-matcha-latte",
      name: "Iced Matcha Latte",
      price: "6,90€",
      img: "/matcha.png",
    },
  ],
  "À Partager": [
    {
      id: "plateau-viennoiseries",
      name: "Plateau de viennoiseries",
      price: "17,00€",
      img: "/plateau-mini.png",
    },
    {
      id: "cake-marbre",
      name: "Cake marbré",
      price: "10,50€",
      img: "/cake-marbre.png",
    },
    {
      id: "brioche-partager",
      name: "Brioche",
      price: "9,50€",
      img: "/brioche-partager.png",
    },
    {
      id: "plateau-pancakes",
      name: "Plateau de pancakes",
      price: "24,90€",
      img: "/pancakes-partager.png",
    },
  ],
};

const categories = Object.keys(produits);
const allProduits = Object.values(produits).flat();

const CardItem = ({ id, name, price, img, hasOptions = false }: { id: string; name: string; price: string; img: string; hasOptions?: boolean }) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({ id, name, price, img, qty: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      onClick={() => navigate(`/produit/${id}`)}
      className="bg-card rounded-2xl overflow-hidden hover-lift group cursor-pointer flex flex-col sm:flex-col h-full"
      style={{ boxShadow: "var(--card-shadow)" }}
    >
      {/* Desktop : image carrée en haut */}
      <div className="relative overflow-hidden aspect-square hidden sm:block">
        <img
          src={img}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Mobile : vignette gauche + texte droite */}
      <div className="flex sm:hidden">
        <div className="w-24 h-24 flex-shrink-0 overflow-hidden">
          <img
            src={img}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <div className="flex-1 px-3 py-2 flex flex-col justify-center gap-2">
          <h3 className="font-display text-sm font-semibold leading-tight">{name}</h3>
          <div className="flex items-center justify-between gap-2">
            <span className="text-primary font-bold text-sm">{price}</span>
            {hasOptions ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#DFF057", color: "#3a3a0a" }}>
                Voir →
              </span>
            ) : (
              <button
                onClick={handleAddToCart}
                className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full transition-all duration-200 flex-shrink-0"
                style={{ backgroundColor: added ? "#3a3a0a" : "#DFF057", color: added ? "#DFF057" : "#3a3a0a" }}
              >
                {added ? "✓ Ajouté" : <><ShoppingCart size={11} /> Ajouter</>}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop : texte en bas */}
      <div className="p-4 flex-col flex-1 hidden sm:flex">
        <div className="flex items-start justify-between gap-2 mb-3 flex-1">
          <h3 className="font-display text-base font-semibold leading-tight">{name}</h3>
          <span className="text-primary font-bold text-base flex-shrink-0">{price}</span>
        </div>
        <button className="w-full border-2 border-primary text-primary py-2 rounded-xl font-semibold hover:bg-primary hover:text-primary-foreground transition-colors text-sm mt-auto">
          Voir le produit →
        </button>
      </div>
    </div>
  );
};

const CartePage = () => {
  usePageMeta(
    "Notre Carte — Menus & Brunchs | Breakfast Time",
    "Découvrez nos menus petit-déjeuner et brunch livrés à domicile dans les Alpes-Maritimes. Produits frais et locaux, 7j/7.",
    "/carte"
  );
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState<"menus" | "carte" | null>(() => {
    const t = searchParams.get("tab");
    if (t === "carte") return "carte";
    if (t === "menus") return "menus";
    return null;
  });
  const [catActive, setCatActive] = useState(() => {
    const cat = searchParams.get("cat");
    return cat || "Viennoiseries";
  });

  const switchTab = (t: "menus" | "carte") => {
    setTab(t);
    setSearchParams({ tab: t }, { replace: true });
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  };

  const switchCat = (cat: string) => {
    setCatActive(cat);
    setSearchParams({ tab: "carte", cat }, { replace: true });
  };
  const [search, setSearch] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredMenus = menus.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));

  const filteredProduits = search
    ? allProduits.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    : produits[catActive];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Header desktop */}
      <div className="hidden md:block bg-foreground pt-24 pb-10 px-6 text-center">
        <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-2">
          Livraison 7j/7 · Alpes-Maritimes
        </p>
        <h1 className="font-display text-4xl font-bold mb-3" style={{ color: "white" }}>
          Notre{" "}
          <span className="italic" style={{ color: "#DFF057" }}>Carte</span>
        </h1>
        <p className="text-base max-w-lg mx-auto mb-7" style={{ color: "rgba(255,255,255,0.7)" }}>
          Des produits de qualité, préparés le matin même pour un petit-déjeuner aussi frais que gourmand.
        </p>
        <div className="max-w-md mx-auto relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full pl-11 pr-4 py-3.5 rounded-full border-0 bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
          />
        </div>
      </div>

      {/* Header mobile — blanc épuré */}
      <div className="md:hidden bg-white pt-20 pb-4 px-5">
        <h1 className="font-display text-2xl font-bold mb-3 text-foreground">
          Notre <span className="italic" style={{ color: "#7a7020" }}>Carte</span>
        </h1>
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-border bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
          />
        </div>
      </div>

      {/* Breadcrumb desktop uniquement */}
      <div className="hidden md:block px-6 py-4 max-w-7xl mx-auto w-full">
        <p className="text-sm text-muted-foreground">
          <a href="/" className="hover:text-primary transition-colors">Accueil</a>
          <span className="mx-2">›</span>
          <span className="text-foreground font-medium">La Carte</span>
        </p>
      </div>

      {/* Contenu */}
      <div className="flex-1 pb-16 px-6 max-w-7xl mx-auto w-full">
        {/* Si recherche active */}
        {search ? (
          <div>
            <p className="text-muted-foreground text-sm mb-6">
              {filteredMenus.length + filteredProduits.length} résultat(s) pour "<strong>{search}</strong>"
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
              {filteredMenus.map((item) => (
                <CardItem key={item.id} {...item} hasOptions={true} />
              ))}
              {filteredProduits.map((item) => (
                <CardItem key={item.id} {...item} />
              ))}
            </div>
            {filteredMenus.length + filteredProduits.length === 0 && (
              <div className="text-center py-16">
                <p className="text-2xl mb-2">🔍</p>
                <p className="font-display text-xl font-semibold mb-2">Aucun résultat</p>
                <p className="text-muted-foreground">Essayez avec un autre mot-clé</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Choix initial */}
            {tab === null && (
              <div className="mt-6 max-w-3xl mx-auto">
                {/* Desktop : 2 cards compactes côte à côte */}
                <div className="hidden sm:grid sm:grid-cols-2 gap-4 mt-2">
                  {[
                    { tab: "menus", img: "/menu-brunch.png",   title: "Nos Menus",  sub: "Formules complètes livrées chez vous", cta: "Voir les menus" },
                    { tab: "carte", img: "/avocado-toast.png", title: "À la Carte", sub: "Composez votre breakfast à la pièce",   cta: "Composer" },
                  ].map(({ tab: t, img, title, sub, cta }) => (
                    <button key={t} onClick={() => switchTab(t as "menus" | "carte")}
                      className="group flex items-center gap-5 p-6 rounded-2xl bg-white border border-border hover:border-primary hover:shadow-lg transition-all duration-300 text-left">
                      {/* Vignette image */}
                      <div className="w-36 h-36 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      {/* Texte */}
                      <div className="flex-1 min-w-0">
                        <h2 className="font-display text-xl font-bold text-foreground mb-1">{title}</h2>
                        <p className="text-sm text-muted-foreground truncate mb-4">{sub}</p>
                        <div className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full"
                          style={{ backgroundColor: "#DFF057", color: "#3a3a0a" }}>
                          {cta} <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Mobile : 2 cartes photo carrées côte à côte */}
                <div className="grid grid-cols-2 gap-3 sm:hidden">
                  {[
                    { tab: "menus", img: "/menu-highlight.jpg", title: "Nos Menus", price: "Dès 11,90€", cta: "Voir les menus" },
                    { tab: "carte", img: "/hero-breakfast.jpg", title: "À la Carte", price: "Dès 1,50€", cta: "Voir la carte" },
                  ].map(({ tab: t, img, title, price, cta }) => (
                    <button key={t} onClick={() => switchTab(t as "menus" | "carte")}
                      className="group relative rounded-2xl overflow-hidden"
                      style={{ aspectRatio: "3/4" }}>
                      <img src={img} alt={title} className="w-full h-full object-cover group-active:scale-105 transition-transform duration-300" />
                      {/* Dégradé */}
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)" }} />
                      {/* Contenu bas */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                        <p className="text-white font-display font-bold text-base leading-tight mb-1">{title}</p>
                        <p className="text-xs mb-2.5" style={{ color: "rgba(255,255,255,0.7)" }}>{price}</p>
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full" style={{ backgroundColor: "#DFF057", color: "#3a3a0a" }}>
                          {cta} <ArrowRight size={10} />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Onglets (visibles une fois un choix fait) */}
            {tab !== null && (
              <div className="flex justify-center mb-10 mt-4">
                <div className="bg-muted rounded-2xl p-1.5 flex gap-2 justify-center">
                  <button
                    onClick={() => switchTab("menus")}
                    className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                      tab === "menus"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Nos Menus
                  </button>
                  <button
                    onClick={() => switchTab("carte")}
                    className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                      tab === "carte"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Produits à la Carte
                  </button>
                </div>
              </div>
            )}

            {/* Nos Menus */}
            {tab === "menus" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
                {menus.map((item) => (
                  <CardItem key={item.id} {...item} hasOptions={true} />
                ))}
              </div>
            )}

            {/* Produits à la Carte */}
            {tab === "carte" && (
              <div>
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => switchCat(cat)}
                      className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                        catActive === cat
                          ? "bg-primary text-primary-foreground"
                          : "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
                  {produits[catActive].map((item) => (
                    <CardItem key={item.id} {...item} />
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CartePage;
