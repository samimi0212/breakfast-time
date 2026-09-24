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

// Noms, prix et images viennent de products.ts (source unique) — ici on ne
// fixe que l'ordre d'affichage et le rangement par catégorie.
const toCard = (id: string) => {
  const p = allProducts.find((pp) => pp.id === id);
  if (!p) throw new Error(`CartePage: produit inconnu "${id}"`);
  return { id: p.id, name: p.name, price: p.price, img: p.img };
};

const menus = ["menu-francais", "menu-anglais", "menu-brunch", "menu-veggie", "menu-duo", "menu-famille", "birthday-box"].map(toCard);

const sections: Record<string, string[]> = {
  "Le Salé": [
    "avocado-toast", "avocado-toast-feta", "bagel-avocat-saumon", "bagel-chevre-miel", "bagel-bacon-cheddar",
    "bagel-saumon-avocat", "egg-comte-muffin", "croque-monsieur", "croque-pastrami", "breakfast-burrito",
    "burrito-breakfast", "burrito-chicken-cesar", "brioche-burrata", "oeufs-brouilles", "oeufs-brouilles-truffe",
    "avocado-toast-gf", "croque-monsieur-gf",
  ],
  "Le Sucré": [
    "pancakes-a-composer", "gaufre-composer", "gaufre-speculoos", "brioche-perdue", "brioche-perdue-caramel",
    "brioche-peanut", "pudding-chia", "granola-parfait", "sweet-bowl", "porridge", "french-tartines",
    "cookie-caramel", "brownie-pecan", "muffin-choco", "muffin-myrtilles",
  ],
  "Extra": ["rostis", "frites-patates-douces", "halloumi-grille"],
  "Pains": ["baguette", "cake-marbre"],
  "Boissons Froides": [
    "iced-latte", "smoothie-tropical", "smoothie-energie", "smoothie-detox",
    "jus-orange-presse", "jus-pamplemousse-presse", "jus-abricot",
  ],
  "Boissons Chaudes": [
    "cafe-latte", "chai-latte", "the-earl-grey", "americano", "chocolat-chaud",
    "capuccino", "iced-matcha-latte", "matcha-latte-vanille",
  ],
};

const produits: Record<string, { id: string; name: string; price: string; img: string }[]> = Object.fromEntries(
  Object.entries(sections).map(([cat, ids]) => [cat, ids.map(toCard)])
);

const categories = Object.keys(produits);
const allProduits = Object.values(produits).flat();

const CardItem = ({ id, name, price, img, hasOptions = false }: { id: string; name: string; price: string; img: string; hasOptions?: boolean }) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { t, i18n } = useTranslation();
  const { lp } = useLangPath();
  const [added, setAdded] = useState(false);
  const productData = allProducts.find((p) => p.id === id);
  const displayName = i18n.language === "en" ? (productData?.name_en || name) : name;
  // Un produit avec des options (nappage, taille, etc.) doit toujours passer par
  // la page produit pour les renseigner — sinon la composition n'est jamais
  // enregistrée dans la commande (et n'apparaît pas sur le ticket).
  const requiresOptionsPage = hasOptions || (productData?.options?.length ?? 0) > 0;

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
            {requiresOptionsPage ? (
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
    "Pains": t("cartePage.catPains"),
    "Le Salé": t("cartePage.catSale"),
    "Extra": t("cartePage.catExtra"),
    "Le Sucré": t("cartePage.catSucre"),
    "Boissons Froides": t("cartePage.catBoissonsFroides"),
    "Boissons Chaudes": t("cartePage.catBoissonsChaudes"),
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
    return cat && cat in produits ? cat : categories[0];
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
