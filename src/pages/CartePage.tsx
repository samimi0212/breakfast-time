import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";

const menus = [
  { id: "menu-francais", name: "Menu Français", price: "12,90€", img: "https://static.wixstatic.com/media/21c6e4_34c4bd51a8a94133aebf056e7c1dfbbe~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_34c4bd51a8a94133aebf056e7c1dfbbe~mv2.png" },
  { id: "menu-anglais", name: "Menu Anglais", price: "12,90€", img: "https://static.wixstatic.com/media/21c6e4_35577f9aced14c51b49fc307bf7656d6~mv2.jpg/v1/fill/w_917,h_917,al_c,q_85,enc_avif,quality_auto/21c6e4_35577f9aced14c51b49fc307bf7656d6~mv2.jpg" },
  { id: "menu-brunch", name: "Menu Brunch", price: "29,00€", img: "https://static.wixstatic.com/media/21c6e4_137b677c57ed4588b83a5cd2f9c99169~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_137b677c57ed4588b83a5cd2f9c99169~mv2.png" },
  { id: "menu-famille", name: "Menu Famille", price: "49,00€", img: "https://static.wixstatic.com/media/21c6e4_a4aec83b7dd54ab48764a13c365dab08~mv2.jpg/v1/fill/w_980,h_980,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_a4aec83b7dd54ab48764a13c365dab08~mv2.jpg" },
  { id: "birthday-box", name: "Birthday Box", price: "45,00€", img: "https://static.wixstatic.com/media/21c6e4_b9896374a7884f76b153e6af574a0bdd~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_b9896374a7884f76b153e6af574a0bdd~mv2.png" },
];

const produits: Record<string, { id: string; name: string; price: string; img: string }[]> = {
  "Viennoiseries": [
    { id: "croissant", name: "Croissant", price: "1,50€", img: "https://static.wixstatic.com/media/21c6e4_d396d1aefd3347a494342e2e3100c9d7~mv2.jpeg/v1/fill/w_980,h_980,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_d396d1aefd3347a494342e2e3100c9d7~mv2.jpeg" },
    { id: "pain-aux-raisins", name: "Pain aux raisins", price: "1,80€", img: "https://static.wixstatic.com/media/21c6e4_321718d0c9b547fba1bc9e630d0d6db5~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_321718d0c9b547fba1bc9e630d0d6db5~mv2.png" },
    { id: "suisse", name: "Suisse", price: "1,70€", img: "https://static.wixstatic.com/media/21c6e4_84d87e8f2b6c494a94518f55cba0b872~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_84d87e8f2b6c494a94518f55cba0b872~mv2.png" },
    { id: "mini-viennoiseries", name: "Mini viennoiseries", price: "3,90€", img: "https://static.wixstatic.com/media/21c6e4_27396356b6cf494c807a4627f27d7d9a~mv2.jpg/v1/fill/w_980,h_980,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_27396356b6cf494c807a4627f27d7d9a~mv2.jpg" },
    { id: "brioche", name: "Brioche", price: "8,50€", img: "https://static.wixstatic.com/media/21c6e4_71ad92708a6a4bd68b0233b9842753ac~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_71ad92708a6a4bd68b0233b9842753ac~mv2.png" },
  ],
  "Pains": [
    { id: "baguette", name: "Baguette", price: "1,30€", img: "https://static.wixstatic.com/media/21c6e4_d8f2fa38f4234f1e89e73216fb5da62b~mv2.jpg/v1/fill/w_980,h_980,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_d8f2fa38f4234f1e89e73216fb5da62b~mv2.jpg" },
    { id: "baguette-bio", name: "Baguette bio aux graines", price: "2,10€", img: "https://static.wixstatic.com/media/21c6e4_bcd49273376a400fa8ca7e7b52d8d55d~mv2.jpg/v1/fill/w_980,h_980,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_bcd49273376a400fa8ca7e7b52d8d55d~mv2.jpg" },
    { id: "pain-complet", name: "Pain complet", price: "2,80€", img: "https://static.wixstatic.com/media/21c6e4_736a710692ba41f2b3c6c6944edb9a40~mv2.jpg/v1/fill/w_980,h_980,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_736a710692ba41f2b3c6c6944edb9a40~mv2.jpg" },
  ],
  "Le Salé": [
    { id: "bagel-chevre-miel", name: "Bagel chèvre miel", price: "13,50€", img: "https://static.wixstatic.com/media/21c6e4_a2a0e40b65f14dc0b9e902939034c8b7~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_a2a0e40b65f14dc0b9e902939034c8b7~mv2.png" },
    { id: "bagel-bacon-cheddar", name: "Bagel Bacon Cheddar", price: "13,50€", img: "https://static.wixstatic.com/media/21c6e4_aceb5b56d164432abb582ed01d9e5c61~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_aceb5b56d164432abb582ed01d9e5c61~mv2.png" },
    { id: "bagel-saumon-avocat", name: "Bagel Saumon Avocat", price: "13,50€", img: "https://static.wixstatic.com/media/21c6e4_1c3c0b77a93d4e0896c8679a0f21b446~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_1c3c0b77a93d4e0896c8679a0f21b446~mv2.png" },
    { id: "avocado-toast", name: "Avocado Toast", price: "13,50€", img: "https://static.wixstatic.com/media/21c6e4_d5216d063f2b4f68ad81354d27894bd1~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_d5216d063f2b4f68ad81354d27894bd1~mv2.png" },
    { id: "tartine-halloumi-avocat", name: "Tartine Halloumi Avocat", price: "14,90€", img: "https://static.wixstatic.com/media/21c6e4_08111e7f9e0b47e1b126820ad08c842e~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_08111e7f9e0b47e1b126820ad08c842e~mv2.png" },
    { id: "oeufs-benedicte", name: "Oeufs bénédicte", price: "8,50€", img: "https://static.wixstatic.com/media/21c6e4_afd75b1c09184351bf14d4b600cef84c~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_afd75b1c09184351bf14d4b600cef84c~mv2.png" },
    { id: "oeufs-brouilles-truffe", name: "Oeufs brouillés Truffe", price: "7,50€", img: "https://static.wixstatic.com/media/21c6e4_cb3b17ebf6484ce6a13ed79d3a530f53~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_cb3b17ebf6484ce6a13ed79d3a530f53~mv2.png" },
    { id: "oeufs-brouilles", name: "Oeufs brouillés", price: "4,50€", img: "https://static.wixstatic.com/media/21c6e4_de105d93f91e471d8ccb8b6c7ccbaa8f~mv2.jpg/v1/fill/w_980,h_980,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_de105d93f91e471d8ccb8b6c7ccbaa8f~mv2.jpg" },
  ],
  "Le Sucré": [
    { id: "pancakes-erable-myrtilles", name: "Pancakes Sirop d'érable Myrtilles", price: "10,90€", img: "https://static.wixstatic.com/media/21c6e4_f419aee1d44244458fc6c57efc1de148~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_f419aee1d44244458fc6c57efc1de148~mv2.png" },
    { id: "pancakes-nutella-banane", name: "Pancakes Nutella Banane", price: "10,90€", img: "https://static.wixstatic.com/media/21c6e4_e0c9e849faa64c90b4e105a283f646bf~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_e0c9e849faa64c90b4e105a283f646bf~mv2.png" },
    { id: "brioche-perdue", name: "Brioche Perdue Gourmande", price: "12,90€", img: "https://static.wixstatic.com/media/21c6e4_5ba1b60f56084a23b7fe442adaafbe4a~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_5ba1b60f56084a23b7fe442adaafbe4a~mv2.png" },
    { id: "pudding-chia", name: "Pudding Chia Bowl", price: "9,50€", img: "https://static.wixstatic.com/media/21c6e4_3b8ad26ddf37468a834c55f7697d48a6~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_3b8ad26ddf37468a834c55f7697d48a6~mv2.png" },
    { id: "granola-parfait", name: "Granola Parfait", price: "8,50€", img: "https://static.wixstatic.com/media/21c6e4_cc66f5eaed7a462488b1df7264e4b5a6~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_cc66f5eaed7a462488b1df7264e4b5a6~mv2.png" },
  ],
  "Boissons": [
    { id: "smoothie-banane", name: "Smoothie banane", price: "6,50€", img: "https://static.wixstatic.com/media/21c6e4_97bb0d3d0a8e4fd5a0bcb6426a6b5a91~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_97bb0d3d0a8e4fd5a0bcb6426a6b5a91~mv2.png" },
    { id: "smoothie-fruits-rouges", name: "Smoothie fruits rouges", price: "6,50€", img: "https://static.wixstatic.com/media/21c6e4_dd1900b53c5445bfa3005623afd0b1b0~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_dd1900b53c5445bfa3005623afd0b1b0~mv2.png" },
    { id: "cafe-frappe", name: "Café frappé", price: "5,50€", img: "https://static.wixstatic.com/media/21c6e4_0666def6d3c34d979690efd0430ca8ec~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_0666def6d3c34d979690efd0430ca8ec~mv2.png" },
  ],
  "À Partager": [
    { id: "plateau-viennoiseries", name: "Plateau de viennoiseries", price: "17,00€", img: "https://static.wixstatic.com/media/21c6e4_54d6c72da0db428c9a95913573cb84ee~mv2.jpg/v1/fill/w_832,h_832,al_c,q_85,enc_avif,quality_auto/21c6e4_54d6c72da0db428c9a95913573cb84ee~mv2.jpg" },
    { id: "planche-charcuterie", name: "Planche de charcuterie", price: "39,00€", img: "https://static.wixstatic.com/media/21c6e4_a7461066fb7542869e337fd7e3ef7d9a~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_a7461066fb7542869e337fd7e3ef7d9a~mv2.png" },
    { id: "planche-fromages", name: "Planche de fromages", price: "39,00€", img: "https://static.wixstatic.com/media/21c6e4_1072c5ec1d8844478ad6ddf0753d7d1d~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_1072c5ec1d8844478ad6ddf0753d7d1d~mv2.png" },
  ],
};

const categories = Object.keys(produits);

const CardItem = ({ id, name, price, img }: { id: string; name: string; price: string; img: string }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/produit/${id}`)}
      className="bg-card rounded-2xl overflow-hidden hover-lift group cursor-pointer"
      style={{ boxShadow: "var(--card-shadow)" }}
    >
      <div className="relative overflow-hidden aspect-square">
        <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-lg font-semibold">{name}</h3>
          <span className="text-primary font-bold text-lg">{price}</span>
        </div>
        <button className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity">
          Voir le produit →
        </button>
      </div>
    </div>
  );
};

const CartePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState<"menus" | "carte">(() => {
    const t = searchParams.get("tab");
    return t === "carte" ? "carte" : "menus";
  });
  const [catActive, setCatActive] = useState(() => {
  const cat = searchParams.get("cat");
  return cat || "Viennoiseries";
});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-6">

          {/* Titre */}
          <div className="text-center mb-12">
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">Nos produits</p>
            <h1 className="section-title mb-4">La Carte</h1>
            <p className="section-subtitle mx-auto">
              Des produits frais, locaux et préparés le matin même pour commencer la journée en beauté.
            </p>
          </div>

          {/* Onglets */}
          <div className="flex justify-center mb-10">
            <div className="bg-muted rounded-2xl p-1.5 flex gap-2">
              <button
                onClick={() => setTab("menus")}
                className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  tab === "menus" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Nos Menus
              </button>
              <button
                onClick={() => setTab("carte")}
                className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  tab === "carte" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Produits à la Carte
              </button>
            </div>
          </div>

          {/* Nos Menus */}
          {tab === "menus" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {menus.map((item) => <CardItem key={item.id} {...item} />)}
            </div>
          )}

          {/* Produits à la Carte */}
          {tab === "carte" && (
            <div>
              <div className="flex flex-wrap justify-center gap-3 mb-10">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCatActive(cat)}
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
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {produits[catActive].map((item) => <CardItem key={item.id} {...item} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartePage;
