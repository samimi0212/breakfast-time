import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Clock, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

const statusColors: Record<string, string> = {
  "En attente": "bg-yellow-100 text-yellow-700",
  "En préparation": "bg-blue-100 text-blue-700",
  "En livraison": "bg-orange-100 text-orange-700",
  "Livré": "bg-green-100 text-green-700",
  "Annulé": "bg-red-100 text-red-700",
};

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/connexion");
        return;
      }

      const { data, error } = await supabase
        .from("commandes")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (!error) setOrders(data || []);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 flex justify-center">
          <span className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-28 pb-16 px-6 max-w-3xl mx-auto">

        {/* Titre */}
        <div className="mb-8">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-2">Historique</p>
          <h1 className="font-display text-3xl font-bold">Mes commandes</h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={32} className="text-muted-foreground" />
            </div>
            <h2 className="font-display text-xl font-semibold mb-2">Aucune commande</h2>
            <p className="text-muted-foreground mb-6">Vous n'avez pas encore passé de commande.</p>
            <button
              onClick={() => navigate("/#menu")}
              className="bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              Découvrir la carte
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl overflow-hidden"
                style={{ boxShadow: "var(--card-shadow)" }}
              >
                {/* Header commande */}
                <div
                  className="p-5 cursor-pointer"
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[order.statut] || "bg-muted text-muted-foreground"}`}>
                          {order.statut}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(order.created_at)}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {order.heure_livraison} · {order.date_livraison}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {order.ville}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="font-bold text-primary text-lg">
                        {Number(order.total).toFixed(2).replace(".", ",")}€
                      </span>
                      {expanded === order.id
                        ? <ChevronUp size={18} className="text-muted-foreground" />
                        : <ChevronDown size={18} className="text-muted-foreground" />
                      }
                    </div>
                  </div>
                </div>

                {/* Détail commande */}
                {expanded === order.id && (
                  <div className="border-t border-border px-5 pb-5 pt-4">

                    {/* Produits */}
                    <h3 className="font-semibold text-sm mb-3">Produits commandés</h3>
                    <div className="space-y-3 mb-4">
                      {order.items?.map((item: any, i: number) => (
                        <div key={i} className="flex items-center gap-3">
                          <img
                            src={item.img}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{item.name}</p>
                            {item.options && Object.keys(item.options).length > 0 && (
                              <p className="text-xs text-muted-foreground">
                                {Object.values(item.options).join(", ")}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">x{item.qty}</p>
                          </div>
                          <p className="text-sm font-bold text-primary flex-shrink-0">
                            {(parseFloat(item.price.replace("€", "").replace(",", ".")) * item.qty).toFixed(2).replace(".", ",")}€
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Adresse */}
                    <div className="bg-muted rounded-xl p-3 text-sm">
                      <p className="font-semibold mb-1">Adresse de livraison</p>
                      <p className="text-muted-foreground">
                        {order.adresse}, {order.code_postal} {order.ville}
                      </p>
                      {order.note && (
                        <p className="text-muted-foreground mt-1">📝 {order.note}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
