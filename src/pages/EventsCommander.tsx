import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "@/context/CartContext";
import { useLangPath } from "@/hooks/useLangPath";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, ShoppingBag, Check, Minus, Plus, Trash2, Users, MapPin, Calendar } from "lucide-react";
import plateauMini from "@/assets/4.webp";
import plateauMiniPac from "@/assets/5.webp";
import plateauCroissant from "@/assets/6.webp";
import plateauChaussons from "@/assets/7.webp";
import plateauPainsRaisins from "@/assets/8.webp";
import verrinesGranola from "@/assets/9.webp";
import plateauChouquettes from "@/assets/10.webp";
import plateauMacaron from "@/assets/11.webp";
import cakeMarbre from "@/assets/12.webp";
import plateauPancakes from "@/assets/13.webp";
import plateauFruits from "@/assets/14.webp";
import plateauFromage from "@/assets/15.webp";
import plateauCharcuterie from "@/assets/plateau-charcuterie.webp";
import thermosCafe from "@/assets/thermos-cafe.webp";
import thermosChocolat from "@/assets/thermos-chocolat.webp";
import eauDetox from "@/assets/eau-detox.webp";
import jusFrais from "@/assets/jus-frais1.webp";
import clocheCookies from "@/assets/Cookies.webp";
import verrineCrudites from "@/assets/verrine-crudites.webp";
import tarteletteThon from "@/assets/entreprises/tartelette-thon.webp";
import focacciaPastrami from "@/assets/entreprises/focaccia-pastrami.webp";
import bagelSaumon from "@/assets/entreprises/bagel-saumon.webp";
import duoClub from "@/assets/entreprises/duo-club.webp";
import formuleEssentielle from "@/assets/1.webp";
import formulePlaisir from "@/assets/2.webp";
import formuleGouter from "@/assets/3.webp";

type EventProduct = { id: string; name: string; price: string; img: string; imgPosition?: string; composition: string[] };

const parseEuroPrice = (price: string): number => {
  const match = price.replace(",", ".").match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
};

const MenuFormulaCard = ({ product, guestCount }: { product: EventProduct; guestCount: number }) => {
  const { items, addItem, updateQty } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const unitPrice = parseEuroPrice(product.price);
  const totalPrice = unitPrice * guestCount;
  const cartIndex = items.findIndex((item) => item.id === product.id);
  const cartQty = cartIndex >= 0 ? items[cartIndex].qty : 0;

  const handleAdd = () => {
    if (cartIndex >= 0) {
      updateQty(cartIndex, guestCount);
    } else {
      addItem({ id: product.id, name: product.name, price: product.price, img: product.img, qty: guestCount });
    }
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div
      className="bg-card rounded-2xl overflow-hidden flex flex-col h-full transition-all"
      style={{
        boxShadow: justAdded ? "0 0 0 2px #DFF057, var(--card-shadow)" : "var(--card-shadow)",
      }}
    >
      <div className="relative overflow-hidden h-40">
        <img src={product.img} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
        {cartQty > 0 && (
          <div
            className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-md"
            style={{ backgroundColor: "#3a3a0a", color: "#DFF057" }}
          >
            <ShoppingBag size={12} />
            {cartQty} convives
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold leading-tight">{product.name}</h3>
          <span className="text-primary font-bold text-base flex-shrink-0">{product.price}</span>
        </div>

        <ul className="space-y-1">
          {product.composition.map((item, i) => (
            <li key={i} className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-primary/40 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between mt-auto pt-2 text-sm">
          <span className="text-muted-foreground">Pour {guestCount} convives</span>
          <span className="font-display font-bold text-primary">{totalPrice.toFixed(2).replace(".", ",")}€</span>
        </div>
        <button
          onClick={handleAdd}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{
            backgroundColor: justAdded ? "#b8cc30" : "#DFF057",
            color: "#3a3a0a",
          }}
        >
          {justAdded ? <Check size={14} /> : <ShoppingBag size={14} />}
          {justAdded ? "Ajouté ✓" : "Ajouter au panier"}
        </button>
      </div>
    </div>
  );
};

const EventProductCard = ({ product }: { product: EventProduct }) => {
  const { items, addItem } = useCart();
  const { t } = useTranslation();
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const cartQty = items
    .filter((item) => item.id === product.id)
    .reduce((sum, item) => sum + item.qty, 0);

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, price: product.price, img: product.img, qty });
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      setQty(1);
    }, 1200);
  };

  return (
    <div
      className="bg-card rounded-2xl overflow-hidden flex flex-col h-full transition-all"
      style={{
        boxShadow: justAdded ? "0 0 0 2px #DFF057, var(--card-shadow)" : "var(--card-shadow)",
      }}
    >
      <div className="relative overflow-hidden h-40">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover"
          style={{ objectPosition: product.imgPosition ?? "center" }}
          loading="lazy"
        />
        {cartQty > 0 && (
          <div
            className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-md"
            style={{ backgroundColor: "#3a3a0a", color: "#DFF057" }}
          >
            <ShoppingBag size={12} />
            {cartQty}
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold leading-tight">{product.name}</h3>
          <span className="text-primary font-bold text-base flex-shrink-0">{product.price}</span>
        </div>

        <ul className="space-y-1">
          {product.composition.map((item, i) => (
            <li key={i} className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-primary/40 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 mt-auto pt-2">
          <div className="flex items-center gap-2 border rounded-xl px-3 py-1.5">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="relative hover:text-primary transition-colors before:absolute before:-inset-3 before:content-['']">
              <Minus size={13} />
            </button>
            <span className="w-5 text-center text-sm font-semibold">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} className="relative hover:text-primary transition-colors before:absolute before:-inset-3 before:content-['']">
              <Plus size={13} />
            </button>
          </div>
          <button
            onClick={handleAdd}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              backgroundColor: justAdded ? "#b8cc30" : "#DFF057",
              color: "#3a3a0a",
            }}
          >
            {justAdded ? <Check size={14} /> : <ShoppingBag size={14} />}
            {justAdded ? t("eventsCommander.addedBtn") : t("eventsCommander.addBtn")}
          </button>
        </div>
      </div>
    </div>
  );
};

const MIN_ORDER = 50;

const EventsCommander = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { lp } = useLangPath();
  const { items, removeItem, updateQty, total, count } = useCart();

  const [guestCount, setGuestCount] = useState(10);
  const [heroGuestInput, setHeroGuestInput] = useState(String(guestCount));
  useEffect(() => {
    setHeroGuestInput(String(guestCount));
  }, [guestCount]);
  const remainingForMin = Math.max(0, MIN_ORDER - total);

  // Barre "adresse / date / convives" façon mytraiteur.com
  const [heroAddress, setHeroAddress] = useState("");
  const [heroDate, setHeroDate] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<{ place_id: string; description: string }[]>([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const addressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleHeroAddressChange = (value: string) => {
    setHeroAddress(value);
    if (addressTimer.current) clearTimeout(addressTimer.current);
    if (value.length > 3) {
      addressTimer.current = setTimeout(async () => {
        try {
          const res = await fetch("/api/autocomplete-address", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ input: value }),
          });
          const data = await res.json();
          setAddressSuggestions(data.predictions || []);
          setShowAddressSuggestions(true);
        } catch {
          /* ignore */
        }
      }, 400);
    } else {
      setAddressSuggestions([]);
      setShowAddressSuggestions(false);
    }
  };

  const selectHeroAddress = (description: string) => {
    setHeroAddress(description);
    setShowAddressSuggestions(false);
    setAddressSuggestions([]);
  };

  // Données de démo — à remplacer par la liste définitive des produits événements
  const productSections: { id: string; label: string; products: EventProduct[] }[] = [
    {
      id: "menus",
      label: "Formules personnalisées",
      products: [
        {
          id: "evt-formule-essentielle",
          name: "Formule Essentielle",
          price: "12,00€ / pers.",
          img: formuleEssentielle,
          composition: ["Assortiment de mini viennoiseries", "Thermos de café", "Thermos d'eau chaude", "Sachets de thé"],
        },
        {
          id: "evt-formule-gourmande",
          name: "Formule Plaisir",
          price: "18,00€ / pers.",
          img: formulePlaisir,
          composition: [
            "Assortiment de mini viennoiseries",
            "Thermos de café",
            "Thermos d'eau chaude",
            "Sachets de thé",
            "Verrine de granola",
            "Composition de fruits coupés",
          ],
        },
        {
          id: "evt-formule-prestige",
          name: "Pause goûter",
          price: "25,00€ / pers.",
          img: formuleGouter,
          composition: [
            "Assortiments de mignardises (Financiers, Madeleines citron, Chouquettes)",
            "Thé glacé",
            "Citronnade",
            "Thermos de café",
          ],
        },
      ],
    },
    {
      id: "sucre",
      label: "Sucré",
      products: [
        {
          id: "evt-plateau-mini-viennoiseries",
          name: t("eventsCommander.plateauName"),
          price: "29,00€",
          img: plateauMini,
          composition: [
            t("eventsCommander.plateauC1"),
            t("eventsCommander.plateauC2"),
          ],
        },
        {
          id: "evt-plateau-pains-au-chocolat",
          name: "Plateau pains au chocolat",
          price: "12,00€",
          img: plateauMiniPac,
          composition: ["10 mini pains au chocolat"],
        },
        {
          id: "evt-plateau-croissants",
          name: "Plateau croissants",
          price: "11,00€",
          img: plateauCroissant,
          composition: ["10 mini croissants"],
        },
        {
          id: "evt-plateau-chaussons-pommes",
          name: "Plateau chaussons aux pommes",
          price: "13,50€",
          img: plateauChaussons,
          composition: ["10 mini chaussons aux pommes"],
        },
        {
          id: "evt-plateau-pains-raisins",
          name: "Plateau pains aux raisins",
          price: "14,00€",
          img: plateauPainsRaisins,
          composition: ["10 mini pains aux raisins"],
        },
        {
          id: "evt-verrines-granola",
          name: "Verrines de Granola",
          price: "24,00€",
          img: verrinesGranola,
          composition: ["10 verrines", "Fromage blanc", "Granola artisanal", "Fruits de saison", "Miel de Lavande"],
        },
        {
          id: "evt-plateau-chouquettes",
          name: "Plateau chouquettes",
          price: "19,00€",
          img: plateauChouquettes,
          composition: ["30 chouquettes", "Perles de sucre"],
        },
        {
          id: "evt-plateau-macarons",
          name: "Plateau macarons",
          price: "30,00€",
          img: plateauMacaron,
          composition: ["4 pistache", "4 fraise", "4 vanille", "4 amande", "4 chocolat"],
        },
        {
          id: "evt-cloche-cookies",
          name: "Cloche de cookies",
          price: "25,00€",
          img: clocheCookies,
          composition: ["10 cookies"],
        },
        {
          id: "evt-plateau-cake-marbre",
          name: "Plateau Cake marbré",
          price: "26,00€",
          img: cakeMarbre,
          composition: ["10 tranches"],
        },
        {
          id: "evt-plateau-pancakes",
          name: "Plateau Pancakes",
          price: "39,00€",
          img: plateauPancakes,
          composition: ["10 pièces", "3 nappages inclus", "3 toppings inclus"],
        },
        {
          id: "evt-plateau-fruits",
          name: "Plateau de fruits",
          price: "59,00€",
          img: plateauFruits,
          composition: ["Pour 10 personnes"],
        },
      ],
    },
    {
      id: "sale",
      label: "Salé",
      products: [
        {
          id: "evt-tartelette-thon",
          name: "Tartelette Tataki",
          price: "39,00€",
          img: tarteletteThon,
          composition: ["20 pièces"],
        },
        {
          id: "evt-focaccia-pastrami",
          name: "Focaccia pastrami",
          price: "35,00€",
          img: focacciaPastrami,
          composition: ["20 pièces"],
        },
        {
          id: "evt-bagel-saumon",
          name: "Bagel Saumon",
          price: "7,50€",
          img: bagelSaumon,
          composition: [],
        },
        {
          id: "evt-club-sandwich",
          name: "Club Sandwich",
          price: "7,50€",
          img: duoClub,
          composition: [],
        },
        {
          id: "evt-plateau-fromage",
          name: "Plateau de fromage",
          price: "45,00€",
          img: plateauFromage,
          composition: ["Pour 10 personnes"],
        },
        {
          id: "evt-plateau-charcuterie",
          name: "Plateau de charcuterie",
          price: "45,00€",
          img: plateauCharcuterie,
          composition: ["Pour 10 personnes"],
        },
        {
          id: "evt-verrine-crudites",
          name: "Verrine de crudités",
          price: "7,50€",
          img: verrineCrudites,
          composition: [],
        },
      ],
    },
    {
      id: "boissons-chaudes",
      label: "Boissons chaudes",
      products: [
        {
          id: "evt-thermos-cafe",
          name: "Thermos de café",
          price: "5,50€",
          img: thermosCafe,
          composition: ["Carafe ou distributeur inox selon quantité"],
        },
        {
          id: "evt-thermos-the",
          name: "Thermos de thé",
          price: "5,50€",
          img: thermosCafe,
          composition: ["Carafe ou distributeur inox selon quantité", "Assortiment de thé Kusmi Tea"],
        },
        {
          id: "evt-thermos-chocolat",
          name: "Thermos de chocolat chaud",
          price: "5,50€",
          img: thermosChocolat,
          composition: ["Carafe ou distributeur inox selon quantité"],
        },
      ],
    },
    {
      id: "boissons-froides",
      label: "Boissons froides",
      products: [
        {
          id: "evt-jus-frais",
          name: "Jus frais",
          price: "3,50€",
          img: jusFrais,
          imgPosition: "center 40%",
          composition: ["Carafe ou distributeur inox selon quantité", "Orange, pamplemousse, pêche, abricot"],
        },
        {
          id: "evt-eau-detox",
          name: "Eau détox",
          price: "3,50€",
          img: eauDetox,
          composition: ["Fraise, Agrumes au choix"],
        },
      ],
    },
  ];

  const steps = productSections.map((s) => ({ id: s.id, label: s.label }));

  const [activeSection, setActiveSection] = useState(steps[0].id);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const stickyHeaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-120px 0px -70% 0px", threshold: 0 }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const STICKY_HEADER_TOP = 64; // doit rester synchro avec la classe "top-16" du bandeau sticky

  const getScrollOffset = () => {
    const headerHeight = stickyHeaderRef.current?.getBoundingClientRect().height ?? 65;
    return STICKY_HEADER_TOP + headerHeight + 16;
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - getScrollOffset();
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const scrollToRecap = () => {
    const el = document.getElementById("recapitulatif");
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - getScrollOffset();
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Header */}
      <div
        className="pt-28 pb-24 px-6 text-center"
        style={{ background: "linear-gradient(135deg, hsl(61, 45%, 20%) 0%, hsl(30, 10%, 8%) 100%)" }}
      >
        <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
          {t("eventsCommander.badge")}
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4" style={{ color: "white" }}>
          {t("eventsCommander.title")}{" "}
          <span className="italic" style={{ color: "#DFF057" }}>
            {t("eventsCommander.titleItalic")}
          </span>
        </h1>
        <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.7)" }}>
          {t("eventsCommander.subtitle")}
        </p>
      </div>

      {/* Barre adresse / date / convives — façon mytraiteur.com */}
      <div className="px-6 -mt-9 relative z-20">
        <div
          className="max-w-5xl mx-auto bg-white rounded-2xl flex flex-col sm:flex-row items-stretch divide-y sm:divide-y-0 sm:divide-x divide-border"
          style={{ boxShadow: "0 20px 40px -12px rgba(0,0,0,0.25)" }}
        >
          {/* Adresse */}
          <div className="relative flex items-center gap-3 px-5 py-4 flex-1 min-w-0">
            <MapPin size={18} className="text-primary flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <label className="block text-xs text-muted-foreground mb-0.5">Choisir une adresse</label>
              <input
                type="text"
                value={heroAddress}
                onChange={(e) => handleHeroAddressChange(e.target.value)}
                onFocus={() => addressSuggestions.length > 0 && setShowAddressSuggestions(true)}
                onBlur={() => setTimeout(() => setShowAddressSuggestions(false), 150)}
                placeholder="Adresse de livraison"
                className="w-full text-sm font-semibold bg-transparent focus:outline-none placeholder:font-normal placeholder:text-muted-foreground"
              />
            </div>
            {showAddressSuggestions && addressSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl overflow-hidden z-30" style={{ boxShadow: "0 10px 30px -8px rgba(0,0,0,0.25)" }}>
                {addressSuggestions.map((s) => (
                  <button
                    key={s.place_id}
                    type="button"
                    onMouseDown={() => selectHeroAddress(s.description)}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors"
                  >
                    {s.description}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date */}
          <div
            className="flex items-center gap-3 px-5 py-4 flex-1 min-w-0 cursor-pointer"
            onClick={() => dateInputRef.current?.showPicker?.()}
          >
            <Calendar size={18} className="text-primary flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <label className="block text-xs text-muted-foreground mb-0.5">Date de l'événement</label>
              <input
                ref={dateInputRef}
                type="date"
                value={heroDate}
                onChange={(e) => setHeroDate(e.target.value)}
                onClick={() => dateInputRef.current?.showPicker?.()}
                min={new Date().toISOString().split("T")[0]}
                className="w-full text-sm font-semibold bg-transparent focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Convives */}
          <div className="flex items-center gap-3 px-5 py-4 flex-1 min-w-0 sm:max-w-[180px]">
            <Users size={18} className="text-primary flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <label className="block text-xs text-muted-foreground mb-0.5">Nombre de convives</label>
              <input
                type="number"
                min={1}
                value={heroGuestInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setHeroGuestInput(val);
                  const n = parseInt(val, 10);
                  if (val !== "" && !isNaN(n) && n > 0) setGuestCount(n);
                }}
                onBlur={() => {
                  const n = parseInt(heroGuestInput, 10);
                  if (heroGuestInput === "" || isNaN(n) || n < 1) {
                    setGuestCount(1);
                  }
                }}
                className="w-full text-sm font-semibold bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => scrollToSection("menus")}
            className="flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold whitespace-nowrap transition-all hover:opacity-90 sm:rounded-r-2xl rounded-b-2xl sm:rounded-bl-none"
            style={{ backgroundColor: "#DFF057", color: "#3a3a0a" }}
          >
            <ShoppingBag size={16} />
            Choisissez vos produits
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="px-6 pt-8 pb-4 max-w-7xl mx-auto w-full">
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <button
            onClick={() => navigate(lp("/entreprise"))}
            className="hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft size={13} />
            {t("eventsCommander.backBtn")}
          </button>
        </p>
      </div>

      {/* Stepper numéroté */}
      <div ref={stickyHeaderRef} className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 overflow-x-auto">
          <div className="flex items-center min-w-max">
            {steps.map((s, i) => {
              const isActive = activeSection === s.id;
              return (
                <div key={s.id} className="flex items-center">
                  <button
                    onClick={() => scrollToSection(s.id)}
                    className="flex items-center gap-2.5 group"
                  >
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all flex-shrink-0"
                      style={
                        isActive
                          ? { backgroundColor: "#DFF057", color: "#3a3a0a" }
                          : { backgroundColor: "rgba(58,58,10,0.1)", color: "#5a5a40" }
                      }
                    >
                      {i + 1}
                    </span>
                    <span
                      className={`text-sm font-semibold whitespace-nowrap transition-colors ${
                        isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      {s.label}
                    </span>
                  </button>
                  {i < steps.length - 1 && (
                    <div className="w-8 sm:w-16 h-px bg-border mx-3 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {count > 0 && (
          <div className="max-w-7xl mx-auto px-6 pb-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-muted-foreground">Votre commande en cours</span>
              <span style={{ color: "#3a3a0a" }}>{total.toFixed(2).replace(".", ",")}€</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 pb-16 px-6 max-w-7xl mx-auto w-full">
        {/* Sections produits */}
        {productSections.map((section, sIndex) => (
          <div
            key={section.id}
            id={section.id}
            ref={(el) => (sectionRefs.current[section.id] = el)}
            className={sIndex === 0 ? "pt-10 scroll-mt-24" : "pt-16 scroll-mt-24"}
          >
            {section.id === "menus" ? (
              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold mb-1">Choisissez une formule tout compris</h2>
                <p className="text-sm text-muted-foreground">Pour {guestCount} convives</p>
                <p className="text-sm text-muted-foreground">
                  Toutes nos prestations incluent : vaisselle, serviettes et consommables
                </p>
              </div>
            ) : (
              <>
                {sIndex === 1 && (
                  <h2 className="font-display text-2xl font-bold mb-8">Ou composez votre commande à la carte</h2>
                )}
                <h2 className="font-display text-2xl font-bold mb-6">{section.label}</h2>
              </>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
              {section.products.map((product) =>
                section.id === "menus" ? (
                  <MenuFormulaCard key={product.id} product={product} guestCount={guestCount} />
                ) : (
                  <EventProductCard key={product.id} product={product} />
                )
              )}
            </div>
          </div>
        ))}

        {/* Récapitulatif */}
        <div id="recapitulatif" className="pt-16 scroll-mt-24">
          <div className="rounded-3xl p-8" style={{ backgroundColor: "#f4f1ea" }}>
            <h2 className="font-display text-2xl font-bold mb-2">Récapitulatif de votre commande</h2>
            <p className="text-muted-foreground text-sm mb-6">{guestCount} convives</p>

            {items.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Votre sélection est vide pour le moment — ajoutez des produits ci-dessus pour préparer votre événement.
              </p>
            ) : (
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="flex items-center gap-4 bg-white rounded-2xl p-3"
                  >
                    <img src={item.img} alt={item.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{item.name}</p>
                      <p className="text-primary font-bold text-sm">{item.price}</p>
                    </div>
                    <div className="flex items-center gap-2 border rounded-xl px-2 py-1">
                      <button
                        onClick={() => updateQty(index, Math.max(1, item.qty - 1))}
                        className="relative hover:text-primary transition-colors before:absolute before:-inset-3 before:content-['']"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-5 text-center text-sm font-semibold">{item.qty}</span>
                      <button
                        onClick={() => updateQty(index, item.qty + 1)}
                        className="relative hover:text-primary transition-colors before:absolute before:-inset-3 before:content-['']"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(index)}
                      className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-4 border-t border-border/60">
                  <span className="font-semibold">Total</span>
                  <span className="font-display text-xl font-bold text-primary">
                    {total.toFixed(2).replace(".", ",")}€
                  </span>
                </div>

                {remainingForMin > 0 && (
                  <p className="text-xs font-semibold" style={{ color: "#b45309" }}>
                    Minimum de commande : {MIN_ORDER}€ — il manque {remainingForMin.toFixed(2).replace(".", ",")}€
                  </p>
                )}

                <button
                  onClick={() => remainingForMin === 0 && navigate(lp("/panier"))}
                  disabled={remainingForMin > 0}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-semibold transition-all mt-2"
                  style={
                    remainingForMin > 0
                      ? { backgroundColor: "rgba(58,58,10,0.15)", color: "rgba(58,58,10,0.4)", cursor: "not-allowed" }
                      : { backgroundColor: "#3a3a0a", color: "white" }
                  }
                >
                  Finaliser ma commande
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Barre panier flottante si articles */}
      {count > 0 && (
        <div className="sticky bottom-0 left-0 right-0 p-4 z-40" style={{ backgroundColor: "#f4f1ea" }}>
          <div className="max-w-7xl mx-auto">
            {remainingForMin > 0 && (
              <p className="text-xs font-semibold text-center mb-2" style={{ color: "#b45309" }}>
                Il manque {remainingForMin.toFixed(2).replace(".", ",")}€ pour atteindre le minimum de commande ({MIN_ORDER}€)
              </p>
            )}
            <button
              onClick={scrollToRecap}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-semibold transition-all hover:scale-[1.01]"
              style={{ backgroundColor: "#3a3a0a", color: "white" }}
            >
              <ShoppingBag size={16} />
              {count > 1
                ? t("eventsCommander.viewCartPlural", { count })
                : t("eventsCommander.viewCart", { count })}
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default EventsCommander;
