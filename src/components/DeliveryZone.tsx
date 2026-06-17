import { MapPin, Clock, Calendar } from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLangPath } from "@/hooks/useLangPath";

const DeliveryZone = () => {
  const { t } = useTranslation();
  const { lp } = useLangPath();
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<"ok" | "ko" | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<{ description: string; place_id: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const timer = useRef<any>(null);
  const navigate = useNavigate();

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

  const infoItems = [
    { icon: MapPin,    label: t("delivery.infoZoneLabel"),  value: t("delivery.infoZoneValue") },
    { icon: Clock,     label: t("delivery.infoHoursLabel"), value: t("delivery.infoHoursValue") },
    { icon: Calendar,  label: t("delivery.infoDaysLabel"),  value: t("delivery.infoDaysValue") },
  ];

  return (
    <section id="delivery" className="section-padding bg-secondary">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">{t("delivery.label")}</p>
        <h2 className="section-title mb-3">{t("delivery.title")}</h2>
        <p className="text-sm text-muted-foreground mb-8">{t("delivery.subtitle")}</p>

        <div className="max-w-xl mx-auto mb-12">
          <p className="text-sm font-medium mb-3 text-foreground">{t("delivery.checkLabel")}</p>
          <div className="relative">
            <div className="flex gap-2">
              <input
                type="text"
                value={address}
                onChange={handleInput}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder={t("delivery.placeholder")}
                autoComplete="off"
                className="flex-1 px-4 py-3 rounded-xl border-2 border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition text-sm"
              />
              <button
                onClick={() => address && checkAddress(address)}
                disabled={loading || !address}
                className="px-5 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition disabled:opacity-50 whitespace-nowrap"
              >
                {loading ? "..." : t("delivery.checkBtn")}
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
              {t("delivery.resultOk")}
            </div>
          )}
          {result === "ko" && (
            <div className="mt-4 flex items-center justify-center gap-2 text-red-500 font-medium text-sm bg-red-50 rounded-xl py-3 px-4">
              {t("delivery.resultKo")}{" "}
              <button onClick={() => navigate(lp("/contact"))} className="underline hover:opacity-80">{t("delivery.resultKoLink")}</button>
              {" "}{t("delivery.resultKoSuffix")}
            </div>
          )}
        </div>

        {/* Desktop */}
        <div className="hidden sm:grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {infoItems.map((item, i) => (
            <div key={i} className="bg-card rounded-2xl p-6 text-center" style={{ boxShadow: "var(--card-shadow)" }}>
              <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
              <p className="font-display text-lg font-semibold">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Mobile */}
        <div className="flex flex-col gap-3 sm:hidden max-w-sm mx-auto w-full">
          {infoItems.map((item, i) => (
            <div key={i} className="flex items-center gap-4 bg-card rounded-2xl px-4 py-3" style={{ boxShadow: "var(--card-shadow)" }}>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="font-display text-base font-semibold">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeliveryZone;
