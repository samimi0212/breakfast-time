interface GiftCardPreviewProps {
  from: string;
  to: string;
  message: string;
  code?: string;
  expiresAt?: string; // format déjà localisé, ex. "12/08/2027"
  amount?: string; // affiché uniquement si la case "indiquer le montant" est cochée
}

const GiftCardPreview = ({ from, to, message, code, expiresAt, amount }: GiftCardPreviewProps) => {
  const showAmount = Boolean(amount);

  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1748 / 1240", boxShadow: "var(--card-shadow)", containerType: "inline-size" }}>
      <img
        src={showAmount ? "/carte-cadeau-verso2.webp" : "/carte-cadeau-verso.webp"}
        alt="Aperçu de la carte cadeau"
        className="absolute inset-0 w-full h-full object-contain"
      />

      <span className="absolute flex items-center font-serif text-[#1f3d2b] truncate" style={{ left: "30.5%", top: "23.2%", height: "2.6%", width: "55%", fontSize: "1.7cqw", lineHeight: 1 }}>
        {from}
      </span>

      <span className="absolute flex items-center font-serif text-[#1f3d2b] truncate" style={{ left: "22%", top: "29.8%", height: "2.6%", width: "60%", fontSize: "1.7cqw", lineHeight: 1 }}>
        {to}
      </span>

      <span className="absolute font-serif text-[#1f3d2b] whitespace-pre-wrap" style={{ left: "16%", top: "42.5%", width: "70%", height: "22%", fontSize: "1.6cqw", lineHeight: 1.4, overflow: "hidden" }}>
        {message}
      </span>

      {code && (
        <span className="absolute flex items-center font-serif font-semibold text-[#1f3d2b]" style={{ left: "65.8%", top: "79.4%", height: "2.4%", width: "22%", fontSize: "1.35cqw", lineHeight: 1 }}>
          {code}
        </span>
      )}

      {showAmount && (
        <span className="absolute flex items-center font-serif font-semibold text-[#1f3d2b]" style={{ left: "25.5%", top: "90.7%", height: "2.6%", fontSize: "1.7cqw", lineHeight: 1 }}>
          {amount}
        </span>
      )}

      {expiresAt && (
        <span
          className="absolute flex items-center font-serif text-[#1f3d2b]"
          style={showAmount
            ? { left: "75%", top: "90.3%", height: "2.6%", fontSize: "1.7cqw", lineHeight: 1 }
            : { left: "34.5%", top: "90.6%", height: "2.6%", fontSize: "1.7cqw", lineHeight: 1 }}
        >
          {expiresAt}
        </span>
      )}
    </div>
  );
};

export default GiftCardPreview;
