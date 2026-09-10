import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { allProducts } from "@/data/products";
import { Search, BookOpen, ShoppingBasket, ArrowRight, ShoppingCart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useCart } from "@/context/CartContext";
import { useLangPath } from "@/hooks/useLangPath";

const menus = [
  {
    id: "menu-francais",
    name: "Menu Français",
    price: "10,50€",
    img: "/menu-francais-texte.webp",
  },
  {
    id: "menu-anglais",
    name: "Menu Anglais",
    price: "16,90€",
    img: "/menu-anglais-texte.webp",
  },
  {
    id: "menu-brunch",
    name: "Menu Brunch",
    price: "24,90€",
    img: "/menu-brunch-texte.webp",
  },
  {
    id: "menu-veggie",
    name: "Menu Lunch",
    price: "16,90€",
    img: "/menu-veggie-titre.webp",
  },
  {
    id: "menu-duo",
    name: "Menu Duo",
    price: "45€",
    img: "/menu-duo-texte.webp",
  },
  {
    id: "menu-famille",
    name: "Menu Famille",
    price: "75€",
    img: "/menu-famille-texte.webp",
  },
  {
    id: "birthday-box",
    name: "Happy Box",
    price: "35,00€",
    img: "/birthday-box-texte.webp",
  },
];

const produits: Record<string, { id: string; name: string; price: string; img: string }[]> = {
  Viennoiseries: [
    {
      id: "croissant",
      name: "Croissant",
      price: "1,60€",
      img: "/croissant.webp",
    },
    {
      id: "pain-au-chocolat",
      name: "Pain au chocolat",
      price: "1,70€",
      img: "/pain-choco.webp",
    },
    {
      id: "chausson-pommes",
      name: "Chausson aux pommes",
      price: "2,70€",
      img: "/chausson.webp",
    },
    {
      id: "mini-viennoiseries",
      name: "Mini viennoiseries",
      price: "3,20€",
      img: "/mini-viennoiserie.webp",
    },
    {
      id: "pain-aux-raisins",
      name: "Pain aux raisins",
      price: "2,20€",
      img: "/pain-raisins.webp",
    },
    {
      id: "baguette",
      name: "1/2 Baguette",
      price: "0,90€",
      img: "/baguette.webp",
    },
    {
      id: "petit-pain-campagne",
      name: "Petit pavé campagne",
      price: "0,50€",
      img: "/pave-campagne.webp",
    },
  ],
  "Le Salé": [
    {
      id: "avocado-toast",
      name: "Tartine Avocat Saumon",
      price: "11,90€",
      img: "/tartine-avocat.webp",
    },
    {
      id: "avocado-toast-feta",
      name: "Avocado Toast",
      price: "9,70€",
      img: "/avocat-test.webp",
    },
    {
      id: "bagel-avocat-saumon",
      name: "Bagel Avocat Saumon",
      price: "8,90€",
      img: "/bagel-test.webp",
    },
    {
      id: "bagel-chevre-miel",
      name: "Bagel Chèvre Noix",
      price: "8,90€",
      img: "/bagel-chevre.webp",
    },
    {
      id: "bagel-bacon-cheddar",
      name: "Bagel Bacon Cheddar",
      price: "8,90€",
      img: "/bagel-bacon.webp",
    },
    {
      id: "bagel-saumon-avocat",
      name: "Bagel Chicken",
      price: "8,90€",
      img: "/bagel-chicken.webp",
    },
    {
      id: "egg-comte-muffin",
      name: "Egg Comté Muffin",
      price: "6,50€",
      img: "/egg-muffin.webp",
    },
    {
      id: "breakfast-burrito",
      name: "Pulled Burrito",
      price: "8,70€",
      img: "/pulled-burrito.webp",
    },
    {
      id: "oeufs-brouilles",
      name: "Oeufs brouillés",
      price: "4,50€",
      img: "/oeufs-brouilles.webp",
    },
    {
      id: "oeufs-brouilles-truffe",
      name: "Oeufs brouillés Truffe",
      price: "7,50€",
      img: "/oeufs-truffe.webp",
    },
    {
      id: "avocado-toast-gf",
      name: "Avocado Toast - Gluten Free",
      price: "12,50€",
      img: "/avocado-gluten.webp",
    },
    {
      id: "croque-monsieur",
      name: "Croque Monsieur",
      price: "7,50€",
      img: "/croque.webp",
    },
    {
      id: "croque-monsieur-gf",
      name: "Croque Monsieur - Gluten Free",
      price: "11,90€",
      img: "/croque-gluten.webp",
    },
  ],
  "Extra": [
    {
      id: "frites-patates-douces",
      name: "Frites de patates douces",
      price: "5,50€",
      img: "/frites.webp",
    },
    {
      id: "halloumi-grille",
      name: "Halloumi grillé",
      price: "7,50€",
      img: "/halloumi.webp",
    },
    {
      id: "rostis",
      name: "Röstis",
      price: "3,50€",
      img: "/rostis.webp",
    },
  ],
  "Le Sucré": [
    {
      id: "french-tartines",
      name: "French Tartines",
      price: "4,00€",
      img: "/french-tartines.webp",
    },
    {
      id: "pancakes-a-composer",
      name: "Pancakes à composer",
      price: "6,50€",
      img: "/pancakes.webp",
    },
    {
      id: "gaufre-composer",
      name: "Gaufre à composer",
      price: "6,50€",
      img: "/gaufre.webp",
    },
    {
      id: "brioche-perdue",
      name: "Brioche Perdue Gourmande",
      price: "7,50€",
      img: "/brioche-gourmande.webp",
    },
    {
      id: "brioche-perdue-caramel",
      name: "Brioche Perdue Caramel",
      price: "7,50€",
      img: "/brioche-perdue-caramel.webp",
    },
    {
      id: "pudding-chia",
      name: "Granola Bowl Pistache",
      price: "9,50€",
      img: "/granola-pistache2.webp",
    },
    {
      id: "granola-parfait",
      name: "Granola Bowl Parfait",
      price: "8,50€",
      img: "/granola-parfait.webp",
    },
    {
      id: "porridge",
      name: "Porridge Mangue Vanille",
      price: "9,50€",
      img: "/porridge.webp",
    },
    {
      id: "acai-bowl",
      name: "Acaï Bowl",
      price: "10,50€",
      img: "/acai-bowl.webp",
    },
    {
      id: "cookie-chocolat",
      name: "Cookie Chocolat Noisette",
      price: "3,80€",
      img: "/cookie-choco.webp",
    },
    {
      id: "cookie-caramel",
      name: "Cookie Caramel Beurre Salé",
      price: "3,90€",
      img: "/cookie-caramel.webp",
    },
    {
      id: "brownie-pecan",
      name: "Brownie Pécan",
      price: "3,80€",
      img: "/brownie.webp",
    },
    {
      id: "muffin-myrtilles",
      name: "Muffin myrtilles",
      price: "4,20€",
      img: "/muffin-myrtilles.webp",
    },
    {
      id: "muffin-choco",
      name: "Muffin Chocolat",
      price: "4,20€",
      img: "/muffin-choco.webp",
    },
  ],
  Boissons: [
    {
      id: "americano",
      name: "Café",
      price: "2,10€",
      img: "/cafe.webp",
    },
    {
      id: "cafe-latte",
      name: "Latte Macchiato",
      price: "5,50€",
      img: "/latte.webp",
    },
    {
      id: "capuccino",
      name: "Capuccino",
      price: "5,50€",
      img: "/capuccino.webp",
    },
    {
      id: "chocolat-chaud",
      name: "Chocolat chaud",
      price: "5,50€",
      img: "/chocolat.webp",
    },
    {
      id: "the-earl-grey",
      name: "Thé Earl Grey citron",
      price: "2,30€",
      img: "/the-citron.webp",
    },
    {
      id: "chai-latte",
      name: "Chai Latte",
      price: "6,20€",
      img: "/chai.webp",
    },
    {
      id: "iced-matcha-latte",
      name: "Matcha Latte",
      price: "6,90€",
      img: "/matcha-latte.webp",
    },
    {
      id: "smoothie-tropical",
      name: "Smoothie Tropical Ginger",
      price: "6,50€",
      img: "/smoothie-tropical.webp",
    },
    {
      id: "smoothie-energie",
      name: "Smoothie Énergie",
      price: "6,50€",
      img: "/smoothie-energie.webp",
    },
    {
      id: "smoothie-detox",
      name: "Smoothie Green Detox",
      price: "6,50€",
      img: "/smoothie-detox.webp",
    },
    {
      id: "jus-orange-presse",
      name: "Jus d'orange pressé",
      price: "3,90€",
      img: "/jus-orange.webp",
    },
    {
      id: "jus-pamplemousse-presse",
      name: "Jus de pamplemousse pressé",
      price: "3,90€",
      img: "/jus-pamplemousse.webp",
    },
    {
      id: "jus-abricot",
      name: "Jus d'abricot",
      price: "3,90€",
      img: "/jus-abricot.webp",
    },
  ],
  "À Partager": [
    {
      id: "plateau-viennoiseries",
      name: "Plateau de viennoiseries",
      price: "16€",
      img: "/plateau-mini.webp",
    },
    {
      id: "plateau-pancakes",
      name: "Plateau de pancakes",
      price: "25€",
      img: "/pancakes-partager.webp",
    },
    {
      id: "cake-marbre",
      name: "Cake marbré",
      price: "10,50€",
      img: "/cake-marbre.webp",
    },
    {
      id: "brioche-partager",
      name: "Brioche",
      price: "9,50€",
      img: "/brioche-partager.webp",
    },
    {
      id: "banana-bread",
      name: "Banana Bread",
      price: "16,50€",
      img: "/banana-bread.webp",
    },
  ],
};

const HIDDEN_CATEGORIES = ["À Partager"];
const categories = Object.keys(produits).filter((c) => !HIDDEN_CATEGORIES.includes(c));
const allProduits = Object.values(produits).flat().filter((p) => !HIDDEN_CATEGORIES.some((c) => produits[c as keyof typeof produits]?.find((pp) => pp.id === p.id)));

const CardItem = ({ id, name, price, img, hasOptions = false }: { id: string; name: string; price: string; img: string; hasOptions?: boolean }) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { t, i18n } = useTranslation();
  const { lp } = useLangPath();
  const [added, setAdded] = useState(false);
  const productData = allProducts.find((p) => p.id === id);
  const displayName = i18n.language === "en" ? (productData?.name_en || name) : name;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({ id, name, price, img, qty: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      onClick={() => navigate(lp(`/produit/${id}`))}
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
          <h3 className="font-display text-sm font-semibold leading-tight">{displayName}</h3>
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
                {added ? t("cartePage.addedShort") : <><ShoppingCart size={11} /> {t("cartePage.addShort")}</>}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop : texte en bas */}
      <div className="p-4 flex-col flex-1 hidden sm:flex">
        <div className="flex items-start justify-between gap-2 mb-3 flex-1">
          <h3 className="font-display text-base font-semibold leading-tight">{displayName}</h3>
          <span className="text-primary font-bold text-base flex-shrink-0">{price}</span>
        </div>
        <button className="w-full border-2 border-primary text-primary py-2 rounded-xl font-semibold hover:bg-primary hover:text-primary-foreground transition-colors text-sm mt-auto">
          {t("cartePage.viewProduct")}
        </button>
      </div>
    </div>
  );
};

const CartePage = () => {
  usePageMeta(
    "Notre Carte — Menus & Brunchs | Breakfast Time",
    "Découvrez nos menus petit-déjeuner et brunch livrés à domicile à Antibes, Cannes, Nice et alentours. Produits frais et locaux, 7j/7.",
    "/carte"
  );
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { lp } = useLangPath();
  const categoryLabels: Record<string, string> = {
    "Viennoiseries": t("cartePage.catViennoiseries"),
    "Le Salé": t("cartePage.catSale"),
    "Extra": t("cartePage.catExtra"),
    "Le Sucré": t("cartePage.catSucre"),
    "Boissons": t("cartePage.catBoissons"),
    "À Partager": t("cartePage.catPartager"),
  };
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

  const filteredMenus = menus.filter((m) => {
    const s = search.toLowerCase();
    const enName = allProducts.find((p) => p.id === m.id)?.name_en || "";
    return m.name.toLowerCase().includes(s) || enName.toLowerCase().includes(s);
  });

  const filteredProduits = search
    ? allProduits.filter((p) => {
        const s = search.toLowerCase();
        const enName = allProducts.find((ap) => ap.id === p.id)?.name_en || "";
        return p.name.toLowerCase().includes(s) || enName.toLowerCase().includes(s);
      })
    : produits[catActive];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Header desktop */}
      <div
        className="hidden md:block pt-24 pb-10 px-6 text-center"
        style={{ background: "linear-gradient(135deg, hsl(61, 45%, 20%) 0%, hsl(30, 10%, 8%) 100%)" }}
      >
        <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-2">
          {t("cartePage.deliveryBadge")}
        </p>
        <h1 className="font-display text-4xl font-bold mb-3" style={{ color: "white" }}>
          {t("cartePage.heroTitle")}{" "}
          <span className="italic" style={{ color: "#DFF057" }}>{t("cartePage.heroTitleItalic")}</span>
        </h1>
        <p className="text-base max-w-lg mx-auto mb-7" style={{ color: "rgba(255,255,255,0.7)" }}>
          {t("cartePage.heroSubtitle")}
        </p>
        <div className="max-w-md mx-auto relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={t("cartePage.searchPlaceholder")}
            className="w-full pl-11 pr-4 py-3.5 rounded-full border-0 bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
          />
        </div>
      </div>

      {/* Header mobile — blanc épuré */}
      <div className="md:hidden bg-white pt-20 pb-4 px-5">
        <h1 className="font-display text-2xl font-bold mb-3 text-foreground">
          {t("cartePage.heroTitle")} <span className="italic" style={{ color: "#7a7020" }}>{t("cartePage.heroTitleItalic")}</span>
        </h1>
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={t("cartePage.searchPlaceholder")}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-border bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
          />
        </div>
      </div>

      {/* Breadcrumb desktop uniquement */}
      <div className="hidden md:block px-6 py-4 max-w-7xl mx-auto w-full">
        <p className="text-sm text-muted-foreground">
          <a href={lp("/")} className="hover:text-primary transition-colors">{t("cartePage.breadcrumbHome")}</a>
          <span className="mx-2">›</span>
          <span className="text-foreground font-medium">{t("cartePage.breadcrumbCarte")}</span>
        </p>
      </div>

      {/* Contenu */}
      <div className="flex-1 pb-16 px-6 max-w-7xl mx-auto w-full">
        {/* Si recherche active */}
        {search ? (
          <div>
            <p className="text-muted-foreground text-sm mb-6">
              {filteredMenus.length + filteredProduits.length} {t("cartePage.searchResults")} "<strong>{search}</strong>"
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
                <p className="font-display text-xl font-semibold mb-2">{t("cartePage.noResults")}</p>
                <p className="text-muted-foreground">{t("cartePage.noResultsHint")}</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Choix initial */}
            {tab === null && (
              <div className="mt-6 max-w-4xl mx-auto">
                {/* Desktop : 2 cards compactes côte à côte */}
                <div className="hidden sm:grid sm:grid-cols-2 gap-5 mt-2">
                  {[
                    { tabKey: "menus", img: "/nos-menus.webp",       title: t("cartePage.choiceMenus"),  sub: t("cartePage.choiceMenusSub"), cta: t("cartePage.choiceMenusCta") },
                    { tabKey: "carte", img: "/composez-brunch.webp", title: t("cartePage.choiceCarte"), sub: t("cartePage.choiceCarteSub"),   cta: t("cartePage.choiceCarteCta") },
                  ].map(({ tabKey, img, title, sub, cta }) => (
                    <button key={tabKey} onClick={() => switchTab(tabKey as "menus" | "carte")}
                      className="group flex items-center gap-6 p-8 rounded-2xl bg-white border border-border hover:border-primary hover:shadow-lg transition-all duration-300 text-left">
                      {/* Vignette image */}
                      <div className="w-44 h-44 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      {/* Texte */}
                      <div className="flex-1 min-w-0">
                        <h2 className="font-display text-2xl font-bold text-foreground mb-1.5">{title}</h2>
                        <p className="text-base text-muted-foreground truncate mb-5">{sub}</p>
                        <div className="inline-flex items-center gap-1.5 text-sm font-semibold px-5 py-2.5 rounded-full"
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
                    { tabKey: "menus", img: "/menu-highlight.webp", title: t("cartePage.mobileMenusTitle"), price: t("cartePage.mobileMenusPrice"), cta: t("cartePage.mobileMenusCta") },
                    { tabKey: "carte", img: "/hero-breakfast.webp", title: t("cartePage.mobileCarteTitle"), price: t("cartePage.mobileCartePrice"), cta: t("cartePage.mobileCarteCta") },
                  ].map(({ tabKey, img, title, price, cta }) => (
                    <button key={tabKey} onClick={() => switchTab(tabKey as "menus" | "carte")}
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
                    className={`px-4 sm:px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
                      tab === "menus"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t("cartePage.tabMenus")}
                  </button>
                  <button
                    onClick={() => switchTab("carte")}
                    className={`px-4 sm:px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
                      tab === "carte"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t("cartePage.tabCarte")}
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
                      {categoryLabels[cat] || cat}
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
