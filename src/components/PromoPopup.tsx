import { useNavigate } from "react-router-dom";
import { useLangPath } from "@/hooks/useLangPath";
import { X, Tag } from "lucide-react";

interface PromoPopupProps {
  code: string;
  discount: string;
  onClose: () => void;
}

const PromoPopup = ({ code, discount, onClose }: PromoPopupProps) => {
  const navigate = useNavigate();
  const { lp } = useLangPath();

  const handleOrder = () => {
    onClose();
    navigate(lp("/carte"));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-border transition-colors"
        >
          <X size={16} />
        </button>

        {/* Icône */}
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: "#DFF057" }}>
          <Tag size={28} style={{ color: "#3a3a0a" }} />
        </div>

        {/* Titre */}
        <h2 className="font-display text-2xl font-bold mb-2">
          Bienvenue ! 🎉
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Un cadeau rien que pour toi
        </p>

        {/* Code */}
        <div className="bg-muted rounded-2xl p-4 mb-3">
          <p className="text-xs text-muted-foreground mb-1">Ton code promo</p>
          <p className="font-display text-3xl font-bold tracking-widest" style={{ color: "#3a3a0a" }}>
            {code}
          </p>
          <p className="text-sm font-semibold mt-1" style={{ color: "#5a7a0a" }}>
            {discount} sur ta commande
          </p>
        </div>

        <p className="text-xs text-muted-foreground mb-6">
          Appliqué automatiquement au paiement ✓
        </p>

        {/* CTA */}
        <button
          onClick={handleOrder}
          className="w-full py-4 rounded-2xl font-semibold text-base transition-all"
          style={{ backgroundColor: "#DFF057", color: "#3a3a0a" }}
        >
          Commander maintenant →
        </button>
      </div>
    </div>
  );
};

export default PromoPopup;
