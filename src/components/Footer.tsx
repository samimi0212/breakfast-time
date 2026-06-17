import { useState } from "react";
import { Instagram, Facebook, Mail, MapPin, Clock, CheckCircle, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLangPath } from "@/hooks/useLangPath";
import logo from "@/assets/logo.png";

const Footer = () => {
  const { t } = useTranslation();
  const { lp } = useLangPath();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "already" | "error">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const res = await fetch("/api/send-newsletter-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else if (res.status === 409) {
        setStatus("already");
      } else {
        setStatus("error");
      }
    } catch {
      clearTimeout(timeout);
      setStatus("error");
    }
  };

  return (
  <footer className="bg-foreground" style={{ color: "hsl(var(--background))" }}>

    {/* ── MOBILE ──────────────────────────────────────────── */}
    <div className="sm:hidden px-5 pt-8 pb-6">
      {/* Logo + réseaux */}
      <div className="flex items-center justify-between mb-6">
        <img src={logo} alt="Breakfast Time" className="h-10 w-auto brightness-0 invert" />
        <div className="flex gap-2">
          <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(223,240,87,0.15)" }}>
            <Instagram size={15} style={{ color: "#DFF057" }} />
          </a>
          <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(223,240,87,0.15)" }}>
            <Facebook size={15} style={{ color: "#DFF057" }} />
          </a>
        </div>
      </div>

      {/* Nav + Infos en 2 colonnes */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Navigation */}
        <div>
          <h4 className="font-semibold text-xs tracking-widest uppercase mb-3" style={{ color: "#DFF057" }}>{t("footer.navigationTitle")}</h4>
          <ul className="space-y-2 text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
            <li><a href={lp("/carte")} className="hover:text-white transition-colors">{t("footer.menuLink")}</a></li>
            <li><a href={lp("/#how")} className="hover:text-white transition-colors">{t("footer.howItWorksLink")}</a></li>
            <li><a href={lp("/#about")} className="hover:text-white transition-colors">{t("footer.aboutLink")}</a></li>
            <li><a href={lp("/#delivery")} className="hover:text-white transition-colors">{t("footer.deliveryLink")}</a></li>
            <li><a href={lp("/connexion")} className="hover:text-white transition-colors">{t("footer.accountLink")}</a></li>
          </ul>
        </div>
        {/* Infos pratiques */}
        <div>
          <h4 className="font-semibold text-xs tracking-widest uppercase mb-3" style={{ color: "#DFF057" }}>{t("footer.infoTitle")}</h4>
          <ul className="space-y-2 text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
            <li className="flex items-center gap-1.5"><Clock size={12} style={{ color: "#DFF057" }} />{t("footer.hours")}</li>
            <li className="flex items-center gap-1.5"><MapPin size={12} style={{ color: "#DFF057" }} />{t("footer.zone")}</li>
            <li className="flex items-center gap-1.5"><Mail size={12} style={{ color: "#DFF057" }} /><a href={lp("/contact")} className="hover:text-white transition-colors">{t("footer.contactLink")}</a></li>
          </ul>
        </div>
      </div>

      {/* Newsletter compacte */}
      {status === "success" || status === "already" ? (
        <div className="flex items-center gap-2 text-xs" style={{ color: "#DFF057" }}>
          <CheckCircle size={14} />
          <span>{status === "success" ? t("footer.newsletterSuccessTextShort") : t("footer.newsletterAlreadyTextShort")}</span>
        </div>
      ) : (
        <form onSubmit={handleSubscribe} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (status === "error" || status === "already") setStatus("idle"); }}
            placeholder={t("footer.newsletterPlaceholder")}
            required
            className="flex-1 px-3 py-2 rounded-xl text-xs bg-white/10 border border-white/20 placeholder:text-white/30 focus:outline-none focus:border-primary min-w-0"
            style={{ color: "white" }}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-3 py-2 rounded-xl text-xs font-semibold flex-shrink-0 flex items-center gap-1"
            style={{ backgroundColor: "#DFF057", color: "#3a3a0a" }}
          >
            {status === "loading" ? <Loader2 size={12} className="animate-spin" /> : t("footer.newsletterSubscribe")}
          </button>
        </form>
      )}

      {/* Copyright */}
      <div className="border-t mt-6 pt-4 flex flex-wrap justify-between gap-2 text-xs" style={{ borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.3)" }}>
        <p>{t("footer.copyright")}</p>
        <div className="flex gap-3">
          <a href={lp("/mentions-legales")} className="hover:text-white transition-colors">{t("footer.legalLink")}</a>
          <a href={lp("/cgv")} className="hover:text-white transition-colors">{t("footer.cgvLink")}</a>
        </div>
      </div>
    </div>

    {/* ── DESKTOP ─────────────────────────────────────────── */}
    <div className="hidden sm:block">
      <div className="px-6 py-16 max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo + description */}
          <div className="lg:col-span-1">
            <img src={logo} alt="Breakfast Time" className="h-16 w-auto mb-4 brightness-0 invert" />
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
              {t("footer.description")}
            </p>
            <div className="flex gap-3 mt-6">
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ backgroundColor: "rgba(223,240,87,0.15)" }}>
                <Instagram size={18} style={{ color: "#DFF057" }} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ backgroundColor: "rgba(223,240,87,0.15)" }}>
                <Facebook size={18} style={{ color: "#DFF057" }} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-sm tracking-widest uppercase mb-5" style={{ color: "#DFF057" }}>{t("footer.navigationTitle")}</h4>
            <ul className="space-y-3 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
              <li><a href={lp("/carte")} className="hover:text-white transition-colors">{t("footer.menuLink")}</a></li>
              <li><a href={lp("/#how")} className="hover:text-white transition-colors">{t("footer.howItWorksLink")}</a></li>
              <li><a href={lp("/#about")} className="hover:text-white transition-colors">{t("footer.aboutLink")}</a></li>
              <li><a href={lp("/#delivery")} className="hover:text-white transition-colors">{t("footer.deliveryLink")}</a></li>
              <li><a href={lp("/connexion")} className="hover:text-white transition-colors">{t("footer.accountLink")}</a></li>
            </ul>
          </div>

          {/* Infos pratiques */}
          <div>
            <h4 className="font-semibold text-sm tracking-widest uppercase mb-5" style={{ color: "#DFF057" }}>{t("footer.infoTitle")}</h4>
            <ul className="space-y-3 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
              <li className="flex items-center gap-2"><Clock size={14} style={{ color: "#DFF057" }} />{t("footer.hours")}</li>
              <li className="flex items-center gap-2"><MapPin size={14} style={{ color: "#DFF057" }} />{t("footer.zone")}</li>
              <li className="flex items-center gap-2"><Mail size={14} style={{ color: "#DFF057" }} /><a href={lp("/contact")} className="hover:text-white transition-colors">{t("footer.contactLink")}</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-sm tracking-widest uppercase mb-5" style={{ color: "#DFF057" }}>{t("footer.newsletterTitle")}</h4>
            {status === "success" ? (
              <div className="flex flex-col items-start gap-3">
                <div className="flex items-center gap-2" style={{ color: "#DFF057" }}>
                  <CheckCircle size={18} />
                  <span className="text-sm font-semibold">{t("footer.newsletterSuccessTitle")}</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {t("footer.newsletterSuccessText")}
                </p>
              </div>
            ) : status === "already" ? (
              <div className="flex flex-col items-start gap-3">
                <div className="flex items-center gap-2" style={{ color: "#DFF057" }}>
                  <CheckCircle size={18} />
                  <span className="text-sm font-semibold">{t("footer.newsletterAlreadyTitle")}</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {t("footer.newsletterAlreadyText")}
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>{t("footer.newsletterText")}</p>
                <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (status === "error" || status === "already") setStatus("idle"); }}
                    placeholder={t("footer.newsletterPlaceholder")}
                    required
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/10 border border-white/20 placeholder:text-white/30 focus:outline-none focus:border-primary"
                    style={{ color: "white", borderColor: status === "error" ? "#ff6b6b" : undefined }}
                  />
                  {status === "error" && <p className="text-xs" style={{ color: "#ff9999" }}>{t("footer.newsletterError")}</p>}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ backgroundColor: "#DFF057", color: "#3a3a0a" }}
                  >
                    {status === "loading" ? <><Loader2 size={14} className="animate-spin" />{t("footer.newsletterSubscribing")}</> : t("footer.newsletterSubscribe")}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bas de page desktop */}
      <div className="border-t px-6 py-6" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
          <p>{t("footer.copyrightFull")}</p>
          <div className="flex gap-6">
            <a href={lp("/mentions-legales")} className="hover:text-white transition-colors">{t("footer.legalLink")}</a>
            <a href={lp("/cgv")} className="hover:text-white transition-colors">{t("footer.cgvLink")}</a>
            <a href={lp("/confidentialite")} className="hover:text-white transition-colors">{t("footer.privacyLink")}</a>
          </div>
        </div>
      </div>
    </div>

  </footer>
  );
};

export default Footer;
