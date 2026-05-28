import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";

const Confirmation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-16 px-6 max-w-lg mx-auto text-center">

        {/* Icône */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} className="text-green-500" />
        </div>

        {/* Titre */}
        <h1 className="font-display text-3xl font-bold mb-3">
          Commande confirmée !
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Merci pour votre commande 🎉 Vous allez recevoir un email de confirmation. Votre petit-déjeuner arrive bientôt !
        </p>

        {/* Infos livraison */}
        <div className="bg-white rounded-2xl p-6 mb-8 text-left" style={{ boxShadow: "var(--card-shadow)" }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🚴</span>
            <div className="flex-1">
              <p className="font-semibold mb-2">Livraison en cours de préparation</p>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-primary rounded-full animate-shimmer" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">📱</span>
            <div>
              <p className="font-semibold">Suivez votre commande</p>
              <p className="text-sm text-muted-foreground">Retrouvez le détail dans "Mes commandes"</p>
            </div>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/mes-commandes")}
            className="flex-1 bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Voir mes commandes
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 border-2 border-primary text-primary py-3.5 rounded-xl font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>

      </div>
    </div>
  );
};

export default Confirmation;
