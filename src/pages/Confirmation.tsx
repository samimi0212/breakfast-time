import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

const Confirmation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <style>{`
        @keyframes bounceIn {
          0%   { transform: scale(0); opacity: 0; }
          55%  { transform: scale(1.22); opacity: 1; }
          75%  { transform: scale(0.92); }
          90%  { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
        @keyframes checkDraw { to { stroke-dashoffset: 0; } }
        @keyframes cf1 { 0% { transform: translate(0,0) rotate(0deg); opacity:1; } 100% { transform: translate(-48px,-90px) rotate(-260deg); opacity:0; } }
        @keyframes cf2 { 0% { transform: translate(0,0) rotate(0deg); opacity:1; } 100% { transform: translate(52px,-100px) rotate(300deg); opacity:0; } }
        @keyframes cf3 { 0% { transform: translate(0,0) rotate(0deg); opacity:1; } 100% { transform: translate(-75px,-50px) rotate(180deg); opacity:0; } }
        @keyframes cf4 { 0% { transform: translate(0,0) rotate(0deg); opacity:1; } 100% { transform: translate(72px,-62px) rotate(-220deg); opacity:0; } }
        @keyframes cf5 { 0% { transform: translate(0,0) rotate(0deg); opacity:1; } 100% { transform: translate(-25px,-110px) rotate(400deg); opacity:0; } }
        @keyframes cf6 { 0% { transform: translate(0,0) rotate(0deg); opacity:1; } 100% { transform: translate(38px,-105px) rotate(-340deg); opacity:0; } }
        .conf-circle { animation: bounceIn 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .conf-check  { stroke-dasharray: 50; stroke-dashoffset: 50; animation: checkDraw 0.35s ease-out 0.5s forwards; }
        .conf-cf1 { animation: cf1 0.7s ease-out 0.3s both; }
        .conf-cf2 { animation: cf2 0.75s ease-out 0.35s both; }
        .conf-cf3 { animation: cf3 0.65s ease-out 0.28s both; }
        .conf-cf4 { animation: cf4 0.8s ease-out 0.4s both; }
        .conf-cf5 { animation: cf5 0.7s ease-out 0.32s both; }
        .conf-cf6 { animation: cf6 0.72s ease-out 0.38s both; }
      `}</style>
      <Navbar />
      <div className="pt-32 pb-16 px-6 max-w-lg mx-auto text-center">

        {/* Icône animée */}
        <div className="flex items-center justify-center mx-auto mb-6" style={{ width: '96px', height: '96px', position: 'relative' }}>
          <div className="conf-cf1" style={{ position:'absolute', top:'50%', left:'50%', width:'12px', height:'12px', borderRadius:'50%', background:'#3a3a0a', marginTop:'-6px', marginLeft:'-6px' }} />
          <div className="conf-cf2" style={{ position:'absolute', top:'50%', left:'50%', width:'10px', height:'10px', borderRadius:'2px', background:'#DFF057', border:'1.5px solid #3a3a0a', marginTop:'-5px', marginLeft:'-5px' }} />
          <div className="conf-cf3" style={{ position:'absolute', top:'50%', left:'50%', width:'11px', height:'11px', borderRadius:'50%', background:'#7a8a10', marginTop:'-5px', marginLeft:'-5px' }} />
          <div className="conf-cf4" style={{ position:'absolute', top:'50%', left:'50%', width:'9px', height:'13px', borderRadius:'3px', background:'#DFF057', marginTop:'-6px', marginLeft:'-4px' }} />
          <div className="conf-cf5" style={{ position:'absolute', top:'50%', left:'50%', width:'10px', height:'10px', borderRadius:'50%', background:'#3a3a0a', marginTop:'-5px', marginLeft:'-5px' }} />
          <div className="conf-cf6" style={{ position:'absolute', top:'50%', left:'50%', width:'12px', height:'9px', borderRadius:'2px', background:'#c8c820', marginTop:'-4px', marginLeft:'-6px' }} />
          <svg className="conf-circle" width="96" height="96" viewBox="0 0 96 96" style={{ position:'absolute', top:0, left:0 }}>
            <circle cx="48" cy="48" r="46" fill="#DFF057" />
            <polyline className="conf-check" points="28,49 42,63 68,33" stroke="#1e1e06" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
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
            <span className="text-2xl">👩‍🍳</span>
            <div className="flex-1">
              <p className="font-semibold mb-2">C'est parti, on prépare votre commande !</p>
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
