import { MapPin, Clock, Calendar } from "lucide-react";
import { useState, useRef } from "react";

const DeliveryZone = () => {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<"ok" | "ko" | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<{ description: string; place_id: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const timer = useRef<any>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);
    setResult(null);
    if (timer.current) clearTimeout(timer.current);
    if (value.length > 3) {
      timer.current = setTimeout(async () => {
        try {
          const res = await fetch("/api/autocomplete-address", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ input: value }),
          });
          const data = await res.json();
          setSuggestions(data.predictions || []);
          setShowSuggestions(true);
        } catch { /* ignore */ }
      }, 400);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const checkAddress = async (addr: string) => {
    setLoading(true);
    setResult(null);
    setShowSuggestions(false);
    setSuggestions([]);
    try {
      const res = await fetch("/api/get-delivery-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: addr }),
      });
      const data = await res.json();
      setResult(data.deliverable ? "ok" : "ko");
    } catch {
      setResult("ko");
    } finally {
      setLoading(false);
    }
  };

  const selectSuggestion = (description: string) => {
    setAddress(description);
    setShowSuggestions(false);
    checkAddress(description);
  };

  return (
    <section id="delivery" className="section-padding bg-secondary">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">Zone de livraison</p>
        <h2 className="section-title mb-4">Nous livrons dans les Alpes-Maritimes</h2>
        <p className="section-subtitle mx-auto mb-12">
          Nice, Cannes, Antibes, Grasse et leurs environs — votre petit-déjeuner arrive en 30 à 45 minutes.
        </p>
        <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
          {[
            { icon: MapPin, label: "Zone", value: "Alpes-Maritimes" },
            { icon: Clock, label: "Horaires", value: "8h – 15h" },
            { icon: Calendar, label: "Jours", value: "Lun. – Dim." },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-card rounded-2xl p-6 text-center"
              style={{ boxShadow: "var(--card-shadow)" }}
            >
              <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
              <p className="font-display text-lg font-semibold">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Vérificateur d'adresse */}
        <div className="max-w-xl mx-auto">
          <p className="text-sm font-medium mb-3 text-foreground">Vérifiez si nous livrons chez vous</p>
          <div className="relative">
            <div className="flex gap-2">
              <input
                type="text"
                value={address}
                onChange={handleInput}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Entrez votre adresse..."
                autoComplete="off"
                className="flex-1 px-4 py-3 rounded-xl border-2 border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition text-sm"
              />
              <button
                onClick={() => address && checkAddress(address)}
                disabled={loading || !address}
                className="px-5 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition disabled:opacity-50 whitespace-nowrap"
              >
                {loading ? "..." : "Vérifier"}
              </button>
            </div>
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 w-full bg-white border border-border rounded-xl shadow-lg mt-1 overflow-hidden text-left">
                {suggestions.map((s) => (
                  <button
                    key={s.place_id}
                    type="button"
                    onMouseDown={() => selectSuggestion(s.description)}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-muted transition-colors border-b border-border last:border-0 flex items-center gap-2"
                  >
                    <span className="text-primary flex-shrink-0">📍</span>
                    <span className="truncate">{s.description}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {result === "ok" && (
            <div className="mt-4 flex items-center justify-center gap-2 text-green-600 font-medium text-sm bg-green-50 rounded-xl py-3 px-4">
              ✅ Nous livrons à votre adresse !
            </div>
          )}
          {result === "ko" && (
            <div className="mt-4 flex items-center justify-center gap-2 text-red-500 font-medium text-sm bg-red-50 rounded-xl py-3 px-4">
              ❌ Adresse hors zone, <a href="mailto:contact@breakfast-time.fr" className="underline hover:opacity-80">contactez-nous</a> pour une demande spéciale
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DeliveryZone;
