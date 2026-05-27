import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePageMeta } from "@/hooks/usePageMeta";

const menus = [
  {
    id: "menu-francais",
    name: "Menu Français",
    price: "12,90€",
    img: "/menu-francais.png",
  },
  {
    id: "menu-anglais",
    name: "Menu Anglais",
    price: "12,90€",
    img: "/menu-anglais.png",
  },
  {
    id: "menu-brunch",
    name: "Menu Brunch",
    price: "29,00€",
    img: "https://static.wixstatic.com/media/21c6e4_137b677c57ed4588b83a5cd2f9c99169~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_137b677c57ed4588b83a5cd2f9c99169~mv2.png",
  },
  {
    id: "menu-famille",
    name: "Menu Famille",
    price: "49,00€",
    img: "https://static.wixstatic.com/media/21c6e4_a4aec83b7dd54ab48764a13c365dab08~mv2.jpg/v1/fill/w_980,h_980,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_a4aec83b7dd54ab48764a13c365dab08~mv2.jpg",
  },
  {
    id: "menu-veggie",
    name: "Menu Veggie",
    price: "21,90€",
    img: "/menu-veggie.png",
  },
  {
    id: "menu-duo",
    name: "Menu Duo",
    price: "39,00€",
    img: "/menu-duo.png",
  },
  {
    id: "birthday-box",
    name: "Birthday Box",
    price: "45,00€",
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
      id: "chausson-pommes",
      name: "Chausson aux pommes",
      price: "1,60€",
      img: "/chausson-pommes.png",
    },
    {
      id: "pain-aux-raisins",
      name: "Pain aux raisins",
      price: "1,80€",
      img: "/pain-raisins.png",
    },
    {
      id: "suisse",
      name: "Suisse",
      price: "1,70€",
      img: "/suisse.png",
    },
    {
      id: "mini-viennoiseries",
      name: "Mini viennoiseries",
      price: "3,90€",
      img: "/mini-viennoiseries.png",
    },
    {
      id: "brioche",
      name: "Brioche",
      price: "8,50€",
      img: "/briochette.png",
    },
  ],
  Pains: [
    {
      id: "baguette",
      name: "Baguette",
      price: "1,30€",
      img: "/baguette.png",
    },
    {
      id: "baguette-bio",
      name: "Baguette céréales",
      price: "2,10€",
      img: "/baguette-cereales.png",
    },
    {
      id: "pain-complet",
      name: "Pain complet",
      price: "2,80€",
      img: "/pain-complet.png",
    },
    {
      id: "petit-pain-gluten-free",
      name: "Petit pain Gluten Free",
      price: "2,50€",
      img: "/pain-sans-gluten.png",
    },
    {
      id: "petit-pain-campagne",
      name: "Petit pain campagne",
      price: "1,50€",
      img: "/mini-pain-campagne.png",
    },
    {
      id: "pain-ciabatta",
      name: "Pain Ciabatta",
      price: "3,50€",
      img: "/ciabatta.png",
    },
    {
      id: "pain-nordique",
      name: "Pain Nordique",
      price: "4,50€",
      img: "/pain-nordique.png",
    },
  ],
  "Le Salé": [
    {
      id: "bagel-chevre-miel",
      name: "Bagel chèvre miel",
      price: "13,50€",
      img: "/bagel-chevre.png",
    },
    {
      id: "bagel-bacon-cheddar",
      name: "Bagel Bacon Cheddar",
      price: "13,50€",
      img: "/bagel-cheddar.png",
    },
    {
      id: "bagel-saumon-avocat",
      name: "Bagel Saumon Avocat",
      price: "13,50€",
      img: "/bagel-saumon.png",
    },
    {
      id: "avocado-toast",
      name: "Avocado Toast",
      price: "13,50€",
      img: "/avocado-toast.png",
    },
    {
      id: "oeufs-benedicte",
      name: "Oeufs bénédicte",
      price: "8,50€",
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
      price: "14,90€",
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
      price: "8,50€",
      img: "/chicken-burrito.png",
    },
    {
      id: "toast-mediterraneen",
      name: "Toast méditerranéen",
      price: "17,90€",
      img: "/toast-med.png",
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
      price: "4,50€",
      img: "/pancakes-composer.png",
    },
    {
      id: "brioche-perdue",
      name: "Brioche Perdue Gourmande",
      price: "12,90€",
      img: "/brioche-perdue.png",
    },
    {
      id: "pudding-chia",
      name: "Pudding Chia Bowl",
      price: "9,50€",
      img: "/chia-pudding.png",
    },
    {
      id: "granola-parfait",
      name: "Granola Bowl Parfait",
      price: "8,50€",
      img: "/granola-bowl.png",
    },
    {
      id: "cookie-chocolat",
      name: "Cookie chocolat",
      price: "3,50€",
      img: "/cookie-choco.png",
    },
    {
      id: "cookie-gluten-free",
      name: "Cookie Gluten Free",
      price: "2,60€",
      img: "/cookie-sans-gluten.png",
    },
    {
      id: "muffin-myrtilles",
      name: "Muffin myrtilles",
      price: "2,70€",
      img: "/muffin-myrtilles.png",
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
      id: "cafe-frappe",
      name: "Iced latte",
      price: "5,50€",
      img: "/iced-latte.png",
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
  ],
  "À Partager": [
    {
      id: "plateau-viennoiseries",
      name: "Plateau de viennoiseries",
      price: "17,00€",
      img: "/plateau-mini.png",
    },
    {
      id: "planche-charcuterie",
      name: "Planche de charcuterie",
      price: "39,00€",
      img: "https://static.wixstatic.com/media/21c6e4_a7461066fb7542869e337fd7e3ef7d9a~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_a7461066fb7542869e337fd7e3ef7d9a~mv2.png",
    },
    {
      id: "planche-fromages",
      name: "Planche de fromages",
      price: "39,00€",
      img: "https://static.wixstatic.com/media/21c6e4_1072c5ec1d8844478ad6ddf0753d7d1d~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_1072c5ec1d8844478ad6ddf0753d7d1d~mv2.png",
    },
    {
      id: "planche-mixte",
      name: "Planche mixte",
      price: "39,00€",
      img: "/plateau-mixte.png",
    },
    {
      id: "cake-marbre",
      name: "Cake marbré",
      price: "10,50€",
      img: "/cake-marbre.png",
    },
  ],
};

const categories = Object.keys(produits);
const allProduits = Object.values(produits).flat();

const CardItem = ({ id, name, price, img }: { id: string; name: string; price: string; img: string }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/produit/${id}`)}
      className="bg-card rounded-2xl overflow-hidden hover-lift group cursor-pointer flex flex-col h-full"
      style={{ boxShadow: "var(--card-shadow)" }}
    >
      <div className="relative overflow-hidden aspect-square">
        <img
          src={img}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
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
  const [tab, setTab] = useState<"menus" | "carte">(() => {
    const t = searchParams.get("tab");
    return t === "carte" ? "carte" : "menus";
  });
  const [catActive, setCatActive] = useState(() => {
    const cat = searchParams.get("cat");
    return cat || "Viennoiseries";
  });

  const switchTab = (t: "menus" | "carte") => {
    setTab(t);
    setSearchParams({ tab: t }, { replace: true });
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

      {/* Header */}
      <div className="bg-foreground pt-28 pb-16 px-6 text-center">
        <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
          Livraison 7j/7 · Alpes-Maritimes
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4" style={{ color: "white" }}>
          Notre{" "}
          <span className="italic" style={{ color: "#DFF057" }}>
            Carte
          </span>
        </h1>
        <p className="text-lg max-w-xl mx-auto mb-8" style={{ color: "rgba(255,255,255,0.7)" }}>
          Des produits frais, locaux et préparés le matin même pour commencer la journée en beauté.
        </p>

        {/* Barre de recherche */}
        <div className="max-w-md mx-auto relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full pl-11 pr-4 py-3.5 rounded-full border-0 bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
          />
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="px-6 py-4 max-w-7xl mx-auto w-full">
        <p className="text-sm text-muted-foreground">
          <a href="/" className="hover:text-primary transition-colors">
            Accueil
          </a>
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
              {[...filteredMenus, ...filteredProduits].map((item) => (
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
            {/* Onglets */}
            <div className="flex justify-center mb-10 mt-4">
              <div className="bg-muted rounded-2xl p-1.5 flex gap-2 flex-wrap justify-center">
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

            {/* Nos Menus */}
            {tab === "menus" && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
                {menus.map((item) => (
                  <CardItem key={item.id} {...item} />
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
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
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
